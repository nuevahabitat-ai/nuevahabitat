/**
 * Lógica rebaja Idealista (no editar admin-panel.html a mano).
 */
(function () {
  function nhNormalizeIdealistaId(val) {
    if (val == null || val === '') return null;
    const s = String(val).trim();
    const d = s.match(/\d{6,}/);
    if (d) return d[0];
    const n = Number(s);
    return Number.isFinite(n) && n > 0 ? String(Math.trunc(n)) : null;
  }

  function nhGetCompData() {
    try {
      if (typeof _compData !== 'undefined' && _compData) return _compData;
    } catch (_) { /* otro scope */ }
    return window._compData || [];
  }

  function nhCompradoresMemoriaIdealista(idealistaId) {
    const id = nhNormalizeIdealistaId(idealistaId);
    if (!id) return [];
    const list = nhGetCompData();
    return list
      .filter((c) => {
        const n = String(c.notas || '');
        return n.includes(id) && ((c.telefono || '').trim() || (c.email || '').trim());
      })
      .map((c) => ({
        visita_id: 'mem:' + c.id + ':' + id,
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
        (v.email || '').trim().toLowerCase() ||
        String(v.telefono || '').replace(/\D/g, '').slice(-9) ||
        v.visita_id;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(v);
    }
    return out;
  }

  function safeEmptyList(state) {
    const inm = state.inm;
    const filters =
      typeof rebajaVisMatchFiltersHtml === 'function' ? rebajaVisMatchFiltersHtml(inm) : '';
    const meta = state.meta || {};
    const idealRef =
      nhNormalizeIdealistaId(document.getElementById('rebaja-match-idealista')?.value) ||
      inm?.idealista_id ||
      '—';
    const hint = `API interés: ${meta.interes ?? 0} · notas API: ${meta.notas ?? 0} · panel: ${meta.clientIdealista ?? 0} · memoria: ${meta.memoria ?? 0}${meta.warn ? ' · ' + meta.warn : ''}${meta.serviceRole === false ? ' · Falta SUPABASE_SERVICE_ROLE_KEY en Vercel' : ''}`;
    return (
      filters +
      `<p class="text-muted"><strong>0 contactos</strong> con ref. Idealista <strong>${idealRef}</strong>. En Compradores solo cuentan las fichas cuyas notas incluyen <em>esa</em> ref. (p. ej. <code>Idealista ${idealRef}</code>), no otras como 112932462.</p>` +
      `<p class="text-muted" style="font-size:.78rem;margin-top:.5rem">Primero pulsa <strong>Sincronizar sin reimportar</strong> (usa las notas del import anterior). Solo si sigue vacío: import parcial de esta ref.</p>` +
      `<p class="text-muted" style="font-size:.72rem;margin-top:.4rem">${hint}</p>`
    );
  }

  async function nhRefreshRebajaVisitantesImpl() {
    if (!_rebajaVisState) return;
    const body = document.getElementById('rebaja-vis-body');
    if (body) body.innerHTML = '<p class="text-muted">Buscando contactos Idealista…</p>';
    try {
      if (typeof loadCompradores === 'function' && !nhGetCompData().length) {
        await loadCompradores(true);
      }
      const opts =
        typeof rebajaVisitantesMatchOpts === 'function' ? rebajaVisitantesMatchOpts() : {};
      const idealistaId = nhNormalizeIdealistaId(
        opts.idealista_id ||
          document.getElementById('rebaja-match-idealista')?.value ||
          _rebajaVisState.inm.idealista_id
      );
      const memFirst = nhCompradoresMemoriaIdealista(idealistaId);
      let rows = [...memFirst];

      const json = await fetchRebajaVisitantesApi(
        _rebajaVisState.inm.id,
        _rebajaVisState.precioNuevo,
        opts
      );
      rows = mergeList(rows, (json.visitantes || []).map((v) => ({
        ...v,
        comprador_id: typeof matchCompradorIdForVisitor === 'function' ? matchCompradorIdForVisitor(v) : v.comprador_id,
      })));

      if (window.nhFetchIdealistaRebajaClient && window.nhSupabase) {
        let client = await window.nhFetchIdealistaRebajaClient(
          window.nhSupabase,
          _rebajaVisState.inm,
          opts
        );
        rows = mergeList(rows, client.visitantes);
        if (!(client.visitantes || []).length && idealistaId && window.nhBackfillIdealistaInteres) {
          const bf = await window.nhBackfillIdealistaInteres(idealistaId);
          if (bf?.created > 0) {
            client = await window.nhFetchIdealistaRebajaClient(
              window.nhSupabase,
              _rebajaVisState.inm,
              opts
            );
            rows = mergeList(rows, client.visitantes);
          }
          json.meta = { ...(json.meta || {}), backfill: bf };
        }
        Object.assign(json.meta || {}, client.meta || {});
      }

      _rebajaVisState.meta = {
        ...(json.meta || {}),
        memoria: memFirst.length,
        enFichaIdealista: memFirst.length,
        idealistaId,
        total: rows.length,
      };
      _rebajaVisState.visitantes = rows;
      _rebajaVisState.alreadySent = {
        email: new Set(json.alreadySent?.email || []),
        whatsapp: new Set(json.alreadySent?.whatsapp || []),
      };

      if (body) {
        if (rows.length && typeof renderRebajaVisitantesList === 'function') {
          body.innerHTML = renderRebajaVisitantesList(_rebajaVisState);
        } else {
          body.innerHTML = safeEmptyList(_rebajaVisState);
        }
      }
      const foot = document.getElementById('rebaja-vis-foot');
      if (foot) {
        foot.innerHTML =
          '<button type="button" class="adm-btn adm-btn-ghost" onclick="closeRebajaVisitantesModal()">Cerrar</button>' +
          (rows.length
            ? '<button type="button" class="adm-btn adm-btn-gold" onclick="sendRebajaVisitantesBatch()">Enviar avisos</button>'
            : '') +
          '<button type="button" class="adm-btn adm-btn-gold" onclick="nhSyncIdealistaSinReimportar()">Sincronizar sin reimportar</button>' +
          '<button type="button" class="adm-btn adm-btn-ghost" onclick="nhImportIdealistaSoloEstaRef()">Solo esta ref. (CSV)</button>';
      }
    } catch (e) {
      if (body) body.innerHTML = '<p class="text-muted">Error: ' + e.message + '</p>';
    }
  }

  window.__nhRefreshRebajaVisitantes = nhRefreshRebajaVisitantesImpl;

  window.refreshRebajaVisitantesModal = function () {
    return window.__nhRefreshRebajaVisitantes();
  };
})();
