/** Modal onboarding vendedor — nombre, teléfono y dirección del inmueble */
(function () {
  if (window.nhVendedorOnboarding) return;

  let _pendingResolve = null;

  async function needsOnboarding(user) {
    if (!window.nhSupabase || !user?.email) return false;
    const { data, error } = await window.nhSupabase
      .from('vendedores')
      .select('inmueble_ref')
      .eq('email', user.email)
      .maybeSingle();
    if (error) {
      console.warn('needsOnboarding', error);
      return true;
    }
    return !data?.inmueble_ref;
  }

  async function registrarInmueble({ nombre, telefono, direccion }) {
    const { data: rpcData, error: rpcErr } = await window.nhSupabase.rpc('registrar_inmueble_vendedor', {
      p_nombre: nombre,
      p_telefono: telefono,
      p_direccion: direccion,
    });

    if (!rpcErr && rpcData?.ok) return rpcData;

    const sess = await window.nhSupabase.auth.getSession();
    const token = sess?.data?.session?.access_token;
    if (!token) throw new Error(rpcErr?.message || 'Sin sesión activa');

    const res = await fetch('/api/onboarding-vendedor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nombre, telefono, direccion }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || rpcErr?.message || 'No se pudo registrar el inmueble');
    }
    return data;
  }

  function prefill(user) {
    const nombre = user.user_metadata?.nombre || user.email?.split('@')[0] || '';
    const tel = user.user_metadata?.telefono || '';
    const nombreEl = document.getElementById('vo-nombre');
    const emailEl = document.getElementById('vo-email');
    const telEl = document.getElementById('vo-tel');
    const dirEl = document.getElementById('vo-direccion');
    if (nombreEl) nombreEl.value = nombre;
    if (emailEl) emailEl.value = user.email || '';
    if (telEl) telEl.value = tel;
    if (dirEl) dirEl.value = '';
    const errEl = document.getElementById('vo-error');
    if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
  }

  function openModal() {
    const overlay = document.getElementById('vendOnboardOverlay');
    if (!overlay) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('vend-onboard-open');
    const mbn = document.getElementById('mbn');
    if (mbn) mbn.setAttribute('aria-hidden', 'true');
  }

  function closeModal() {
    const overlay = document.getElementById('vendOnboardOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.classList.remove('vend-onboard-open');
    const mbn = document.getElementById('mbn');
    if (mbn) mbn.removeAttribute('aria-hidden');
    if (_pendingResolve) {
      _pendingResolve();
      _pendingResolve = null;
    }
  }

  function bindMobileFocus() {
    const modal = document.querySelector('.vend-onboard-modal');
    if (!modal || modal.dataset.focusBound) return;
    modal.dataset.focusBound = '1';
    modal.querySelectorAll('input, textarea').forEach((el) => {
      el.addEventListener('focus', () => {
        if (window.matchMedia('(max-width: 600px)').matches) {
          setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 280);
        }
      });
    });
  }

  async function handleSubmit(e, user) {
    e.preventDefault();
    const errEl = document.getElementById('vo-error');
    const btn = document.getElementById('vo-submit');
    const nombre = document.getElementById('vo-nombre')?.value?.trim() || '';
    const telefono = document.getElementById('vo-tel')?.value?.trim() || '';
    const direccion = document.getElementById('vo-direccion')?.value?.trim() || '';

    if (!nombre || !telefono || !direccion) {
      if (errEl) {
        errEl.textContent = 'Completa todos los campos obligatorios.';
        errEl.style.display = 'block';
      }
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Guardando…'; }
    if (errEl) errEl.style.display = 'none';

    try {
      await window.nhWaitSupabase?.();
      const result = await registrarInmueble({ nombre, telefono, direccion });

      await window.nhSupabase.auth.updateUser({
        data: { nombre, telefono, tipo: 'vender' },
      });

      if (window.nhSubmitLead) {
        await window.nhSubmitLead({
          nombre,
          telefono,
          email: user.email,
          mensaje: `Onboarding vendedor · Ref: ${result.ref || '—'} · Dirección: ${direccion}`,
          tipo: 'venta',
          origen: 'panel_vendedor_onboarding',
          inmueble_id: result.inmueble_id || undefined,
          notifyExtra: { ref: result.ref, direccion },
        }).catch(() => {});
      }

      window.nhToast?.('¡Datos guardados! Bienvenido a tu panel de vendedor.', 'success');
      closeModal();
    } catch (err) {
      console.error('vendedor onboarding', err);
      if (errEl) {
        errEl.textContent = err.message || 'Error al guardar. Inténtalo de nuevo.';
        errEl.style.display = 'block';
      }
      if (btn) { btn.disabled = false; btn.textContent = 'Aceptar y continuar →'; }
    }
  }

  function bindForm(user) {
    const form = document.getElementById('vendOnboardForm');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';
    form.addEventListener('submit', (e) => handleSubmit(e, user));
  }

  function show(user) {
    return new Promise((resolve) => {
      const overlay = document.getElementById('vendOnboardOverlay');
      if (!overlay) { resolve(); return; }
      _pendingResolve = resolve;
      prefill(user);
      bindForm(user);
      bindMobileFocus();
      openModal();
      setTimeout(() => document.getElementById('vo-nombre')?.focus(), 120);
    });
  }

  window.nhVendedorOnboarding = { needsOnboarding, show, registrarInmueble };
})();
