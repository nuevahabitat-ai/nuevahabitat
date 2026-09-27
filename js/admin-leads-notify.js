/** Aviso en panel admin cuando entra un lead de formulario nuevo */
(function () {
  const POLL_MS = 45000;
  const STORAGE_KEY = 'nh_admin_last_lead_id';

  function showLeadAlert(nombre) {
    const title = 'Lead nuevo';
    const body = (nombre || 'Sin nombre').trim() + ' — formulario web';
    window.nhToast?.(body, 'info', 9000);
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const target = navigator.serviceWorker?.controller;
    if (target) {
      target.postMessage({
        type: 'SHOW_NOTIFICATION',
        payload: { title, body, url: '/admin-panel.html#leads', tag: 'nh-admin-lead-' + Date.now() },
      });
    } else {
      try {
        new Notification(title, { body, icon: '/imagenes/Logo/logosinfondo2.png' });
      } catch (_) {}
    }
  }

  async function pollLeads() {
    if (typeof window.fetchAdminLeads !== 'function') return;
    try {
      const payload = await window.fetchAdminLeads({ purge: false, limit: 40 });
      const data = payload.data || [];
      const newest = data[0];
      if (!newest?.id) return;

      let prevId;
      try { prevId = localStorage.getItem(STORAGE_KEY); } catch (_) {}

      if (!prevId) {
        try { localStorage.setItem(STORAGE_KEY, newest.id); } catch (_) {}
        return;
      }
      if (newest.id === prevId) return;

      const idx = data.findIndex((l) => l.id === prevId);
      const fresh = idx === -1 ? data.slice(0, 1) : data.slice(0, idx);
      fresh.reverse().forEach((l) => showLeadAlert(l.nombre));
      try { localStorage.setItem(STORAGE_KEY, newest.id); } catch (_) {}
      window._adminRefreshLeadsFromPoll?.(data);
    } catch (e) {
      console.warn('admin leads poll', e);
    }
  }

  window.nhAdminLeadsNotifyInit = function () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-admin.js', { scope: '/' }).catch(() => {});
    }
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission().catch(() => {});
      }, 2500);
    }
    pollLeads();
    setInterval(pollLeads, POLL_MS);
  };
})();
