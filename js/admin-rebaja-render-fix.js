/**
 * Rebaja: lista automática = compradores con este idealista_id en notas / interés.
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

  function resolveIdealistaId(inm) {
    const fromInput = document.getElementById('rebaja-match-idealista')?.value;
    return (
      nhNormalizeIdealistaId(fromInput) ||
      nhNormalizeIdealistaId(inm?.idealista_id) ||
      null
    );
  }

  /** Busca en fichas del panel (notas / historial Idealista import) */
  function buscarCompradoresPorIdealistaEnFicha(idealistaId) {
    const id = nhNormalizeIdealistaId(idealistaId);
    if (!id) return [];
    const re = new RegExp('Idealista\\s*' + id + '\\b|\\b' + id + '\\b', 'i');
    return nhGetCompData()
      .filter((c) => {
        const notas = String(c.notas || '');
        if (!notas.includes(id) && !re.test(notas)) return false;
        return (c.telefono || '').trim() || (c.email || '').trim();
      })
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

  async function buscarCompradoresPorIdealistaSupabase(idealistaId) {
    const id = nhNormalizeIdealistaId(idealistaId);
    if (!id || !window.nhSupabase) return [];
    const { data, error } = await window.nhSupabase
      .from('compradores')
      .select('id,nombre,email,telefono,notas')
      .ilike('notas', '%' + id + '%')
      .limit(500);
    if (error) {
      console.warn('rebaja supabase compradores', error.message);
      return [];
    }
    return (data || [])
      .filter((c) => String(c.notas || '').includes(id) && (c.telefono || c.email))
      .map((c) => ({
        visita_id: 'sb:' + c.id + ':' + id,
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

  function pintarFiltros(inm) {
    return typeof rebajaVisMatchFiltersHtml === 'function' ? rebajaVisMatchFiltersHtml(inm) : '';
  }

  async function nhRefreshRebajaVisitantesImpl() {
    if (!_rebajaVisState) return;
    const body = document.getElementById('rebaja-vis-body');
    const inm = _rebajaVisState.inm;

    if (body) {
      body.innerHTML = pintarFiltros(inm) + '<p class="text-muted" style="margin-top:.75rem">Buscando en compradores…</p>';
    }

    if (typeof loadCompradores === 'function') {
      await loadCompradores(true);
    }

    const idealistaId = resolveIdealistaId(inm);
    if (!idealistaId) {
      if (body) {
        body.innerHTML =
          pintarFiltros(inm) +
          '<p class="text-muted" style="margin-top:.75rem">Pon la <strong>ref. Idealista</strong> del piso en el campo de arriba y pulsa <strong>Actualizar lista</strong>.</p>';
      }
      return;
    }

    const desdeFicha = buscarCompradoresPorIdealistaEnFicha(idealistaId);
    const desdeSb = await buscarCompradoresPorIdealistaSupabase(idealistaId);
    let rows = mergeList(desdeFicha, desdeSb);

    let json = { visitantes: [], meta: {}, alreadySent: { email: [], whatsapp: [] } };
    try {
      const opts =
        typeof rebajaVisitantesMatchOpts === 'function'
          ? rebajaVisitantesMatchOpts()
          : { idealista_id: idealistaId };
      json = await fetchRebajaVisitantesApi(_rebajaVisState.inm.id, _rebajaVisState.precioNuevo, {
        ...opts,
        idealista_id: idealistaId,
        include_interes_idealista: true,
        include_visitas: document.getElementById('rebaja-match-ch-vis')?.checked === true,
      });
      rows = mergeList(
        rows,
        (json.visitantes || []).map((v) => ({
          ...v,
          comprador_id:
            typeof matchCompradorIdForVisitor === 'function'
              ? matchCompradorIdForVisitor(v)
              : v.comprador_id,
        }))
      );
    } catch (e) {
      console.warn('rebaja API', e);
    }

    if (!rows.length && window.nhBackfillIdealistaInteres) {
      await window.nhBackfillIdealistaInteres(idealistaId);
      rows = mergeList(
        buscarCompradoresPorIdealistaEnFicha(idealistaId),
        await buscarCompradoresPorIdealistaSupabase(idealistaId)
      );
    }

    _rebajaVisState.meta = {
      ...(json.meta || {}),
      idealistaId,
      enFicha: desdeFicha.length,
      enSupabase: desdeSb.length,
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
        body.innerHTML =
          pintarFiltros(inm) +
          `<p class="text-muted" style="margin-top:.75rem">Ningún comprador con <strong>Idealista ${idealistaId}</strong> en notas (revisados ${nhGetCompData().length} en panel).</p>` +
          `<p class="text-muted" style="font-size:.72rem">Ficha: ${desdeFicha.length} · Supabase: ${desdeSb.length}. ¿Importaste el CSV de ese anuncio?</p>`;
      }
    }

    const foot = document.getElementById('rebaja-vis-foot');
    if (foot) {
      foot.innerHTML =
        '<button type="button" class="adm-btn adm-btn-ghost" onclick="closeRebajaVisitantesModal()">Cerrar</button>' +
        (rows.length
          ? '<button type="button" class="adm-btn adm-btn-gold" onclick="sendRebajaVisitantesBatch()">Enviar avisos</button>'
          : '') +
        '<button type="button" class="adm-btn adm-btn-ghost" onclick="nhSyncIdealistaSinReimportar()">Sincronizar</button>' +
        '<button type="button" class="adm-btn adm-btn-ghost" onclick="refreshRebajaVisitantesModal()">↻ Actualizar lista</button>';
    }
  }

  const origOpen = window.openRebajaVisitantesModal;
  if (typeof origOpen === 'function' && !origOpen.__nhAutoIdealista) {
    window.openRebajaVisitantesModal = async function () {
      await origOpen.apply(this, arguments);
    };
    window.openRebajaVisitantesModal.__nhAutoIdealista = true;
  }

  window.__nhRefreshRebajaVisitantes = nhRefreshRebajaVisitantesImpl;
  window.refreshRebajaVisitantesModal = () => window.__nhRefreshRebajaVisitantes();
})();
