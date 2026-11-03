/**
 * Panel vendedor — servicio operativo solo tras 1.er pago (50 %).
 */
(function () {
  const ALLOW = new Set(['resumen', 'honorarios', 'configuraciones', 'proceso-vendedor', 'proceso']);

  let state = { active: true, row: null };

  function servicioActivo(row) {
    if (!row) return false;
    if (row.honorarios_pagado && !row.honorarios_pago_inicial_pagado) return true;
    return !!row.honorarios_pago_inicial_pagado;
  }

  function normalizeSec(sec) {
    if (!sec) return sec;
    if (sec === 'proceso' && window.userTipo === 'vendedor') return 'proceso-vendedor';
    if (sec === 'contratos' || sec === 'tasacion') return 'documentacion';
    return sec;
  }

  function lockedMessageHtml() {
    return `<div class="p-card nh-vend-gate" style="border:1.5px solid rgba(184,147,106,.45);background:linear-gradient(135deg,#fffbf5,#fff)">
      <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--oro);margin-bottom:.35rem">Servicio pendiente de activación</div>
      <h3 style="font-family:var(--font-serif);font-size:1.15rem;margin:0 0 .5rem">Contrata y paga el primer 50 %</h3>
      <p style="font-size:.88rem;color:var(--gris-texto);line-height:1.6;margin:0 0 1rem">
        Hasta confirmar el <strong>primer pago</strong> (50 % al contratar), el alta del inmueble, documentación, calendario y visitas permanecen bloqueados.
      </p>
      <button type="button" class="btn btn-gold" onclick="goPanelSection('honorarios')">Ir a Honorarios →</button>
    </div>`;
  }

  function renderBanner() {
    const host = document.getElementById('nhVendGateBanner');
    if (!host) return;
    if (window.userTipo !== 'vendedor' || state.active) {
      host.innerHTML = '';
      host.style.display = 'none';
      return;
    }
    host.innerHTML = lockedMessageHtml();
    host.style.display = 'block';
  }

  function applyNavLock() {
    const locked = window.userTipo === 'vendedor' && !state.active;
    document.querySelectorAll('.p-nav-btn[data-only="vendedor"], .p-nav-btn[data-sec="documentacion"], .p-nav-btn[data-sec="honorarios"]').forEach((btn) => {
      const sec = btn.dataset.sec;
      if (!locked) {
        btn.classList.remove('nh-nav-locked');
        btn.removeAttribute('title');
        return;
      }
      const ok = ALLOW.has(sec) || sec === 'honorarios' || sec === 'resumen' || sec === 'configuraciones' || sec === 'proceso';
      btn.classList.toggle('nh-nav-locked', !ok);
      btn.title = ok ? '' : 'Activa el servicio en Honorarios (1.er pago)';
    });
    document.querySelectorAll('.mbn-tab[data-only="vendedor"], .mbn-tab[data-sec="documentacion"]').forEach((btn) => {
      if (!locked) {
        btn.classList.remove('nh-nav-locked');
        return;
      }
      const sec = btn.dataset.sec;
      const ok = ALLOW.has(sec) || sec === 'honorarios' || sec === 'resumen' || sec === 'configuraciones';
      btn.classList.toggle('nh-nav-locked', !ok);
    });
  }

  async function refresh() {
    if (window.userTipo !== 'vendedor' || !window.nhSupabase || !window.currentUser?.email) {
      state.active = true;
      state.row = null;
      return state;
    }
    const { data, error } = await window.nhSupabase
      .from('vendedores')
      .select('honorarios_pagado,honorarios_pago_inicial_pagado,honorarios_pago_final_pagado,plan_venta,honorarios')
      .eq('email', window.currentUser.email)
      .maybeSingle();
    if (error) console.warn('nhVendedorGate', error);
    state.row = data;
    state.active = servicioActivo(data);
    window.nhVendedorServicioActivo = servicioActivo;
    renderBanner();
    applyNavLock();
    return state;
  }

  function canAccessSection(sec) {
    if (window.userTipo !== 'vendedor') return true;
    if (state.active) return true;
    const s = normalizeSec(sec);
    if (s === 'documentacion' || s === 'publicacion' || s === 'visitas-vendedor') return false;
    return ALLOW.has(s);
  }

  function isActive() {
    return state.active;
  }

  function lockedPlaceholder() {
    return `<div class="p-empty"><h4>Servicio no activo</h4><p>Completa el primer pago en la sección <strong>Honorarios</strong> para continuar.</p></div>`;
  }

  window.nhVendedorGate = {
    refresh,
    canAccessSection,
    isActive,
    lockedMessageHtml,
    lockedPlaceholder,
  };
})();
