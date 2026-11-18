/**
 * Rebaja: lista vía API unificada (visitas NH + Idealista + ref. NH + compatibles).
 */
(function () {
  function nhNormalizeIdealistaId(val) {
    if (val == null || val === '') return null;
    const d = String(val).trim().match(/\d{6,}/);
    return d ? d[0] : null;
  }

  function nhTel9(telefono) {
    const d = String(telefono || '').replace(/\D/g, '');
    return d.length >= 9 ? d.slice(-9) : d;
  }

  function nhGetCompData() {
    try {
      if (typeof _compData !== 'undefined' && _compData?.length) return _compData;
    } catch (_) {}
    return window._compData || [];
  }

  function nhCompradorForRebajaVisitor(v) {
    const data = nhGetCompData();
    if (v?.comprador_id) {
      const byId = data.find((x) => x.id === v.comprador_id);
      if (byId) return byId;
    }
    const t = nhTel9(v?.telefono);
    if (t) {
      const byTel = data.find((x) => nhTel9(x.telefono) === t);
      if (byTel) return byTel;
    }
    const em = String(v?.email || '')
      .trim()
      .toLowerCase();
    if (em) {
      const byEm = data.find((x) => (x.email || '').trim().toLowerCase() === em);
      if (byEm) return byEm;
    }
    return null;
  }

  function enrichRebajaVisitor(v) {
    const c = nhCompradorForRebajaVisitor(v);
    if (!c) return v;
    return {
      ...v,
      comprador_id: v.comprador_id || c.id,
      nombre: (c.nombre || v.nombre || '').trim(),
      telefono: (v.telefono || c.telefono || '').trim(),
      email: (v.email || c.email || '').trim(),
    };
  }

  window.nhEnrichRebajaVisitor = enrichRebajaVisitor;

  function mergeRebajaKey(v) {
    if (v.comprador_id) return 'c:' + v.comprador_id;
    const t = nhTel9(v.telefono);
    if (t.length >= 9) return 't:' + t;
    const em = String(v.email || '')
      .trim()
      .toLowerCase();
    if (em) return 'e:' + em;
    return 'v:' + (v.visita_id || '');
  }

  function mergeList(a, b) {
    const map = new Map();
    for (const v of [...(a || []), ...(b || [])]) {
      const key = mergeRebajaKey(v);
      if (!key || key === 'v:') continue;
      const prev = map.get(key);
      const row = enrichRebajaVisitor(prev ? { ...prev, ...v } : v);
      map.set(key, row);
    }
    return [...map.values()];
  }

  function pintarFiltros(inm) {
    return typeof rebajaVisMatchFiltersHtml === 'function' ? rebajaVisMatchFiltersHtml(inm) : '';
  }

  function mergeClientCompatibles(inm, rows, includeCompat) {
    if (!includeCompat || typeof getMatchesForInmuebleObj !== 'function') return rows;
    const extra = getMatchesForInmuebleObj(inm).map((c) => ({
      visita_id: 'client_compat:' + c.id,
      nombre: c.nombre || '',
      email: c.email || '',
      telefono: c.telefono || '',
      estado: 'realizada',
      comprador_id: c.id,
      fuente: 'compatible',
    }));
    return mergeList(rows, extra);
  }

  async function nhRefreshRebajaVisitantesImpl() {
    if (!_rebajaVisState) return;
    const body = document.getElementById('rebaja-vis-body');
    const inm = _rebajaVisState.inm;

    if (body) {
      body.innerHTML = pintarFiltros(inm) + '<p class="text-muted" style="margin-top:.75rem">Cargando audiencia…</p>';
    }

    if (typeof loadCompradores === 'function') {
      await loadCompradores(true);
    }

    const idealistaId =
      nhNormalizeIdealistaId(document.getElementById('rebaja-match-idealista')?.value) ||
      nhNormalizeIdealistaId(inm?.idealista_id);

    const opts =
      typeof rebajaVisitantesMatchOpts === 'function'
        ? rebajaVisitantesMatchOpts()
        : {
            idealista_id: idealistaId,
            inmueble_ref: inm?.ref || null,
            include_visitas: true,
            include_interes_idealista: true,
            include_interes_nh_ref: true,
            include_compatibles: true,
          };

    opts.idealista_id = idealistaId || opts.idealista_id;
    opts.inmueble_ref = document.getElementById('rebaja-match-nh-ref')?.value?.trim() || inm?.ref || opts.inmueble_ref;
    opts.include_visitas = document.getElementById('rebaja-match-ch-vis')?.checked !== false;
    opts.include_interes_idealista = document.getElementById('rebaja-match-ch-ideal')?.checked !== false;
    opts.include_interes_nh_ref = document.getElementById('rebaja-match-ch-nhref')?.checked !== false;
    opts.include_compatibles = document.getElementById('rebaja-match-ch-compat')?.checked !== false;

    let json = { visitantes: [], meta: {}, alreadySent: { email: [], whatsapp: [] } };
    try {
      json = await fetchRebajaVisitantesApi(_rebajaVisState.inm.id, _rebajaVisState.precioNuevo, opts);
    } catch (e) {
      console.warn('rebaja API', e);
      if (body) {
        body.innerHTML =
          pintarFiltros(inm) +
          `<p class="text-muted" style="margin-top:.75rem;color:#b91c1c">Error al cargar: ${(e.message || e).toString().replace(/</g, '')}</p>`;
      }
      return;
    }

    let rows = mergeClientCompatibles(inm, (json.visitantes || []).map(enrichRebajaVisitor), opts.include_compatibles);

    if (idealistaId && inm?.id) {
      const pubList = typeof _pubData !== 'undefined' && _pubData ? _pubData : window._pubData || [];
      const p = pubList.find((x) => x.id === inm.id);
      if (p) p.idealista_id = idealistaId;
      if (_rebajaVisState.inm) _rebajaVisState.inm.idealista_id = idealistaId;
    }
    _rebajaVisState.meta = { ...(json.meta || {}), total: rows.length, idealistaId };
    _rebajaVisState.visitantes = rows;
    _rebajaVisState.alreadySent = {
      email: new Set(json.alreadySent?.email || []),
      whatsapp: new Set(json.alreadySent?.whatsapp || []),
    };

    if (body) {
      if (rows.length && typeof renderRebajaVisitantesList === 'function') {
        body.innerHTML = renderRebajaVisitantesList(_rebajaVisState);
      } else {
        const m = json.meta || {};
        body.innerHTML =
          pintarFiltros(inm) +
          `<p class="text-muted" style="margin-top:.75rem">Ningún contacto con los filtros activos.</p>` +
          `<p class="text-muted" style="font-size:.72rem">Visitas NH: ${m.visitas || 0} · Interés: ${m.interes || 0} · Notas: ${m.notas || 0} · Compatibles: ${m.compatibles || 0}</p>` +
          `<p class="text-muted" style="font-size:.72rem">Revisa Visitas del inmueble, import Idealista o activa «Compatibles».</p>`;
      }
    }

    const foot = document.getElementById('rebaja-vis-foot');
    if (foot) {
      foot.innerHTML =
        '<button type="button" class="adm-btn adm-btn-ghost" onclick="closeRebajaVisitantesModal()">Cerrar</button>' +
        (rows.length
          ? '<button type="button" class="adm-btn adm-btn-gold" onclick="sendRebajaVisitantesBatch()">Enviar avisos</button>'
          : '') +
        '<button type="button" class="adm-btn adm-btn-ghost" onclick="nhSyncIdealistaSinReimportar()">Sincronizar notas</button>' +
        '<button type="button" class="adm-btn adm-btn-ghost" onclick="nhImportIdealistaSoloEstaRef()">Importar CSV (esta ref.)</button>' +
        '<button type="button" class="adm-btn adm-btn-ghost" onclick="refreshRebajaVisitantesModal()">↻ Actualizar lista</button>';
    }
  }

  window.__nhRefreshRebajaVisitantes = nhRefreshRebajaVisitantesImpl;
  window.refreshRebajaVisitantesModal = () => window.__nhRefreshRebajaVisitantes();
})();