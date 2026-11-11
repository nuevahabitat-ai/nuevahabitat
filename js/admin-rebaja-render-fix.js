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
      ? `Visitas NH: ${meta.visitas || 0} · Idealista (tabla): ${meta.interes || 0} · notas import: ${meta.notas || 0}${meta.warn ? ' · ' + meta.warn : ''}${meta.interesQuery ? ' · query:' + meta.interesQuery : ''}`
      : 'Sin datos del servidor (¿caché? Pulsa Actualizar lista).';
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
          const html = orig(state);
          if (state.meta || /Visitas NH:/.test(html)) return html;
          return safeEmptyList(state);
        } catch (e) {
          if (/compatN|is not defined/i.test(String(e?.message || e))) return safeEmptyList(state);
          throw e;
        }
      }
      return orig(state);
    };
    renderRebajaVisitantesList.__nhCompatFix = true;
  }

  function patchRefresh() {
    if (typeof refreshRebajaVisitantesModal !== 'function' || refreshRebajaVisitantesModal.__nhMetaFix) return;
    refreshRebajaVisitantesModal = async function () {
      if (!_rebajaVisState) return;
      const body = document.getElementById('rebaja-vis-body');
      if (body) body.innerHTML = '<p class="text-muted">Cargando visitantes…</p>';
      try {
        const json = await fetchRebajaVisitantesApi(
          _rebajaVisState.inm.id,
          _rebajaVisState.precioNuevo,
          rebajaVisitantesMatchOpts()
        );
        _rebajaVisState.meta = json.meta || null;
        _rebajaVisState.visitantes = (json.visitantes || []).map((v) => ({
          ...v,
          comprador_id: matchCompradorIdForVisitor(v),
        }));
        _rebajaVisState.alreadySent = {
          email: new Set(json.alreadySent?.email || []),
          whatsapp: new Set(json.alreadySent?.whatsapp || []),
        };
        if (body) body.innerHTML = renderRebajaVisitantesList(_rebajaVisState);
        const foot = document.getElementById('rebaja-vis-foot');
        if (foot) {
          foot.innerHTML = `<button type="button" class="adm-btn adm-btn-ghost" onclick="closeRebajaVisitantesModal()">Cerrar</button>
        <button type="button" class="adm-btn adm-btn-gold" onclick="sendRebajaVisitantesBatch()">Enviar avisos</button>`;
        }
      } catch (e) {
        if (body) body.innerHTML = `<p class="text-muted">Error: ${e.message}</p>`;
      }
    };
    refreshRebajaVisitantesModal.__nhMetaFix = true;
  }

  function boot() {
    patchRender();
    patchRefresh();
  }

  boot();
})();
