/**
 * Parche lista vacía rebaja (compatN) si el HTML en caché aún es viejo.
 */
(function () {
  function safeEmptyList(state) {
    const inm = state.inm;
    const filters =
      typeof rebajaVisMatchFiltersHtml === 'function' ? rebajaVisMatchFiltersHtml(inm) : '';
    const meta = state.meta;
    const hint = meta
      ? `Visitas NH: ${meta.visitas || 0} · Idealista (tabla): ${meta.interes || 0} · notas import: ${meta.notas || 0}${meta.warn ? ' · ' + meta.warn : ''}`
      : '';
    const idealRef =
      (document.getElementById('rebaja-match-idealista')?.value || '').trim() ||
      inm?.idealista_id ||
      '—';
    return (
      filters +
      `<p class="text-muted">Ningún contacto para este piso: solo <strong>visitas NH</strong> o consultas Idealista (ref. <strong>${idealRef}</strong>).</p>` +
      (hint ? `<p class="text-muted" style="font-size:.72rem;margin-top:.5rem">${hint}</p>` : '')
    );
  }

  function patchRender() {
    if (typeof renderRebajaVisitantesList !== 'function' || renderRebajaVisitantesList.__nhCompatFix) return;
    const orig = renderRebajaVisitantesList;
    renderRebajaVisitantesList = function (state) {
      if (!state?.visitantes?.length) {
        try {
          return orig(state);
        } catch (e) {
          if (/compatN|is not defined/i.test(String(e?.message || e))) return safeEmptyList(state);
          throw e;
        }
      }
      return orig(state);
    };
    renderRebajaVisitantesList.__nhCompatFix = true;
  }

  function boot() {
    patchRender();
  }

  boot();
})();
