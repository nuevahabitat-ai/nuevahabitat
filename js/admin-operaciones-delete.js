/**
 * Operaciones: borrado real (API) + filtro cartera (publicados siempre visibles).
 */
(function () {
  let _inmRefsPublicados = new Set();
  let _vendSoloCierreProbable = true;

  async function loadInmPublicados() {
    if (!window.nhSupabase) return;
    const { data } = await window.nhSupabase
      .from('inmuebles')
      .select('ref')
      .in('estado', ['disponible', 'reservado']);
    _inmRefsPublicados = new Set((data || []).map((x) => x.ref).filter(Boolean));
  }

  function injectVendFilter() {
    const sec = document.getElementById('sec-vendedores');
    if (!sec || document.getElementById('vend-filter-cierre-wrap')) return;
    const stats = sec.querySelector('.adm-stats');
    if (!stats) return;
    const wrap = document.createElement('div');
    wrap.id = 'vend-filter-cierre-wrap';
    wrap.style.cssText = 'margin:-.35rem 0 1rem;font-size:.78rem;display:flex;align-items:center;gap:.75rem;flex-wrap:wrap';
    wrap.innerHTML = `
      <label style="display:flex;align-items:center;gap:.4rem;cursor:pointer">
        <input type="checkbox" id="vend-filter-cierre" checked/>
        Ocultar operaciones sin cierre probable (los inmuebles <strong>publicados</strong> siguen saliendo)
      </label>`;
    stats.insertAdjacentElement('afterend', wrap);
    document.getElementById('vend-filter-cierre')?.addEventListener('change', (ev) => {
      _vendSoloCierreProbable = !!ev.target.checked;
      if (typeof renderVendedores === 'function') renderVendedores();
    });
  }

  function vendEnCartera(v) {
    if (typeof vendEstadoOperacion === 'function' && vendEstadoOperacion(v) === 'seguimiento') return false;
    if (!_vendSoloCierreProbable) return true;
    const ref = (v.inmueble_ref || '').trim();
    if (ref && _inmRefsPublicados.has(ref)) return true;
  if (v.probable_cierre === false) return false;
    if (v.estado_operacion === 'inactiva' && ref && !_inmRefsPublicados.has(ref)) return false;
    return true;
  }

  function patchRender() {
    if (typeof renderVendedores !== 'function' || renderVendedores.__nhOpPatch) return;
    const orig = renderVendedores;
    renderVendedores = function () {
      const tbl = document.getElementById('vend-table');
      const cartera = (_vendData || []).filter(vendEnCartera);
      if (typeof renderVendStats === 'function') renderVendStats();
      const countEl = document.getElementById('vend-count');
      if (countEl) countEl.textContent = cartera.length + ' operaciones';
      if (!tbl) return orig();
      if (!cartera.length) {
        tbl.innerHTML = '<p class="text-muted">Sin operaciones visibles con este filtro. Desmarca el filtro o reactiva operaciones.</p>';
        return;
      }
      const saved = _vendData;
      _vendData = cartera;
      try {
        orig();
      } finally {
        _vendData = saved;
      }
    };
    renderVendedores.__nhOpPatch = true;
  }

  window.deleteVendedor = async function (id) {
    if (!confirm('¿Eliminar esta operación de forma permanente? No volverá al pulsar Sincronizar (migración 068).')) return;
    const v = typeof vendFindById === 'function' ? vendFindById(id) : null;
    try {
      const { data: { session } } = await window.nhSupabase.auth.getSession();
      if (!session?.access_token) throw new Error('Sesión no válida');
      const res = await fetch('/api/notify?__action=admin-delete-vendedor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({ id, inmueble_ref: v?.inmueble_ref || null }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo eliminar');
      window.nhToast?.(json.warned || 'Operación eliminada', json.warned ? 'info' : 'success');
      if (typeof loadVendedores === 'function') await loadVendedores(true);
    } catch (e) {
      window.nhToast?.(e.message, 'error');
    }
  };

  async function boot() {
    injectVendFilter();
    await loadInmPublicados();
    patchRender();
    if (typeof renderVendedores === 'function' && (_vendData || []).length) renderVendedores();
  }

  const origLoad = window.loadVendedores;
  if (typeof origLoad === 'function' && !origLoad.__nhOpWrap) {
    window.loadVendedores = async function (force) {
      await loadInmPublicados();
      return origLoad(force);
    };
    window.loadVendedores.__nhOpWrap = true;
  }

  document.addEventListener('DOMContentLoaded', () => { boot(); });
  if (document.readyState !== 'loading') boot();
  setTimeout(boot, 800);
})();
