/** PWA panel cliente: instalación, permisos push y alertas de visitas/documentos */
(function () {
  const POLL_MS = 5 * 60 * 1000;
  const STORAGE_KEY = 'nh_panel_notify_state';

  function readState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (_) { return {}; }
  }

  function writeState(patch) {
    const next = { ...readState(), ...patch, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return null;
    try {
      const reg = await navigator.serviceWorker.register('/sw-panel.js', { scope: '/' });
      return reg;
    } catch (e) {
      console.warn('SW panel:', e);
      return null;
    }
  }

  function showLocalNotification(title, body, url, tag) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        payload: { title, body, url, tag },
      });
      return;
    }
    try {
      new Notification(title, { body, icon: '/imagenes/Logo/logosinfondo2.png', tag });
    } catch (_) {}
  }

  async function requestNotificationPermission() {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    return Notification.requestPermission();
  }

  function setupInstallPrompt() {
    if (window.nhPwaInstall) {
      window.nhPwaInstall.init({
        app: 'panel',
        swUrl: '/sw-panel.js',
        storageKey: 'nh_pwa_dismiss_panel',
        title: 'Instala Mi Panel NuevaHabitat',
        hint: 'Acceso rápido a tu expediente, visitas y documentos',
        mobileOnly: true,
        delayMs: 1000,
      });
      return;
    }
    let deferred;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferred = e;
      document.getElementById('pPwaBar')?.classList.add('show');
    });
    document.getElementById('pPwaInstall')?.addEventListener('click', async () => {
      if (!deferred) return;
      deferred.prompt();
      await deferred.userChoice;
      deferred = null;
      document.getElementById('pPwaBar')?.classList.remove('show');
    });
  }

  async function pollUpdates(user, tipo) {
    if (!window.nhSupabase || !user?.email) return;
    const state = readState();
    const email = user.email;

    const { data: byPerfil } = await window.nhSupabase.from('visitas')
      .select('id,estado,fecha_hora,updated_at')
      .eq('perfil_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(20);

    const { data: myLeads } = await window.nhSupabase.from('leads').select('id').eq('email', email);
    const leadIds = (myLeads || []).map((l) => l.id);
    let byLead = [];
    if (leadIds.length) {
      const { data } = await window.nhSupabase.from('visitas')
        .select('id,estado,fecha_hora,updated_at')
        .in('lead_id', leadIds)
        .order('updated_at', { ascending: false })
        .limit(20);
      byLead = data || [];
    }

    const visitas = [...(byPerfil || [])];
    byLead.forEach((v) => { if (!visitas.some((r) => r.id === v.id)) visitas.push(v); });

    const pending = visitas.filter((v) => ['pendiente', 'confirmada'].includes(v.estado));
    const sig = pending.map((v) => `${v.id}:${v.estado}:${v.fecha_hora}`).join('|');
    if (state.visitasSig && state.visitasSig !== sig && Notification.permission === 'granted') {
      showLocalNotification(
        'Actualización de visitas',
        `Tienes ${pending.length} visita(s) en tu expediente.`,
        '/panel?sec=visitas',
        'nh-visitas'
      );
    }
    writeState({ visitasSig: sig });

    const { data: docs } = await window.nhSupabase.from('cliente_documentos')
      .select('id,nombre,created_at')
      .ilike('cliente_email', email)
      .order('created_at', { ascending: false })
      .limit(10);

    const docsSig = (docs || []).map((d) => d.id).join('|');
    if (state.docsSig && state.docsSig !== docsSig && docs?.length && Notification.permission === 'granted') {
      showLocalNotification(
        'Nuevo documento',
        'Hay un documento nuevo en tu expediente.',
        '/panel?sec=documentos',
        'nh-docs'
      );
    }
    writeState({ docsSig });
  }

  function setupNotifyButton() {
    const btn = document.getElementById('pNotifyBtn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const perm = await requestNotificationPermission();
      if (perm === 'granted') {
        btn.textContent = 'Notificaciones activas';
        btn.disabled = true;
        if (window.currentUser) await pollUpdates(window.currentUser, window.userTipo);
        showLocalNotification('NuevaHabitat', 'Recibirás avisos de visitas y documentos.', '/panel', 'nh-welcome');
      } else if (perm === 'denied') {
        btn.textContent = 'Bloqueadas en el navegador';
      }
    });
    if (Notification.permission === 'granted') {
      btn.textContent = 'Notificaciones activas';
      btn.disabled = true;
    }
  }

  async function initPanelPwa() {
    await registerServiceWorker();
    setupInstallPrompt();
    setupNotifyButton();

    const params = new URLSearchParams(location.search);
    const sec = params.get('sec');
    if (sec) {
      const nav = document.querySelector(`.p-nav-btn[data-sec="${sec}"]`);
      nav?.click();
    }

    if (window.currentUser && window.userTipo) {
      await pollUpdates(window.currentUser, window.userTipo);
      setInterval(() => {
        if (document.visibilityState === 'visible' && window.currentUser) {
          pollUpdates(window.currentUser, window.userTipo);
        }
      }, POLL_MS);
    }
  }

  window.nhPanelPwa = { initPanelPwa, requestNotificationPermission, pollUpdates };
})();
