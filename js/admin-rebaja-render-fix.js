/**
 * Rebaja = clientes importados de Idealista con el mismo idealista_id del piso.
 */
(function () {
  function nhNormalizeIdealistaId(val) {
    if (val == null || val === '') return null;
    const d = String(val).trim().match(/\d{6,}/);
    return d ? d[0] : null;
  }

  function nhGetCompData() {
    try {
      if (typeof _compData !== 'undefined' && _compData?.length) return _compData;
    } catch (_) {}
    return window._compData || [];
  }

  /** Compradores ya visibles en el panel cuya notas llevan este idealista_id */
  function nhCompradoresIdealistaEnFicha(idealistaId) {
    const id = nhNormalizeIdealistaId(idealistaId);
    if (!id) return [];
    return nhGetCompData()
      .filter((c) => String(c.notas || '').includes(id) && (c.telefono || c.email))
      .map((c) => ({
        visita_id: 'ficha:' + c.id + ':' + id,
        nombre: c.nombre || '',
        email: c.email || '',
        telefono: c.telefono || '',
        estado: 'realizada',
        comprador_id: c.id,
        fuente: 'idealista_notas',
      }));
  }

  function mergeList(a, b) {
    const seen = new Set();
    const out = [];
    for (const v of [...(a || []), ...(b || [])]) {
      const key =
        v.comprador_id ||
        String(v.telefono || '').replace(/\D/g, '').slice(-9) ||
        String(v.email || '').trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(v);
    }
    return out;
  }

  async function nhRefreshRebajaVisitantesImpl() {
    if (!_rebajaVisState) return;
    const body = document.getElementById('rebaja-vis-body');
    if (body) body.innerHTML = '<p class="text-muted">Cargando clientes Idealista de este anuncio…</p>';

    try {
      if (typeof loadCompradores === 'function' && !nhGetCompData().length) {
        await loadCompradores(true);
      }

      const opts =
        typeof rebajaVisitantesMatchOpts === 'function' ? rebajaVisitantesMatchOpts() : {};
      const idealistaId = nhNormalizeIdealistaId(
        document.getElementById('rebaja-match-idealista')?.value ||
          opts.idealista_id ||
          _rebajaVisState.inm.idealista_id
      );

      if (!idealistaId) {
        body.innerHTML =
          (typeof rebajaVisMatchFiltersHtml === 'function'
            ? rebajaVisMatchFiltersHtml(_rebajaVisState.inm)
            : '') +
          '<p class="text-muted">Escribe la <strong>ref. Idealista</strong> del anuncio (ej. 112985423) y pulsa Actualizar lista.</p>';
        return;
      }

      const desdeFicha = nhCompradoresIdealistaEnFicha(idealistaId);
      const json = await fetchRebajaVisitantesApi(
        _rebajaVisState.inm.id,
        _rebajaVisState.precioNuevo,
        { ...opts, idealista_id: idealistaId, include_interes_idealista: true }
      );

      let rows = mergeList(desdeFicha, (json.visitantes || []).map((v) => ({
        ...v,
        comprador_id:
          typeof matchCompradorIdForVisitor === 'function'
            ? matchCompradorIdForVisitor(v)
            : v.comprador_id,
      })));

      _rebajaVisState.meta = {
        ...(json.meta || {}),
        enFicha: desdeFicha.length,
        idealistaId,
        total: rows.length,
      };
      _rebajaVisState.visitantes = rows;
      _rebajaVisState.alreadySent = {
        email: new Set(json.alreadySent?.email || []),
        whatsapp: new Set(json.alreadySent?.whatsapp || []),
      };

      if (body) {
        body.innerHTML = rows.length
          ? typeof renderRebajaVisitantesList === 'function'
            ? renderRebajaVisitantesList(_rebajaVisState)
            : '<p>' + rows.length + ' contactos</p>'
          : (typeof rebajaVisMatchFiltersHtml === 'function'
              ? rebajaVisMatchFiltersHtml(_rebajaVisState.inm)
              : '') +
            `<p class="text-muted">Ningún comprador con <strong>Idealista ${idealistaId}</strong> en notas. Importa el CSV de ese anuncio o pulsa Sincronizar.</p>` +
            `<p class="text-muted" style="font-size:.72rem">En ficha ahora: ${desdeFicha.length} · API: ${rows.length}</p>`;
      }

      const foot = document.getElementById('rebaja-vis-foot');
      if (foot) {
        foot.innerHTML =
          '<button type="button" class="adm-btn adm-btn-ghost" onclick="closeRebajaVisitantesModal()">Cerrar</button>' +
          (rows.length
            ? '<button type="button" class="adm-btn adm-btn-gold" onclick="sendRebajaVisitantesBatch()">Enviar avisos</button>'
            : '') +
          '<button type="button" class="adm-btn adm-btn-gold" onclick="nhSyncIdealistaSinReimportar()">Sincronizar</button>';
      }
    } catch (e) {
      if (body) body.innerHTML = '<p class="text-muted">Error: ' + e.message + '</p>';
    }
  }

  window.__nhRefreshRebajaVisitantes = nhRefreshRebajaVisitantesImpl;
  window.refreshRebajaVisitantesModal = () => window.__nhRefreshRebajaVisitantes();
})();
