/**
 * Contactos rebaja Idealista (sesión admin): tabla interés + notas + _compData en memoria.
 */
(function () {
  function normalizeIdealistaId(val) {
    if (val == null || val === '') return null;
    const s = String(val).trim();
    const url = s.match(/idealista[^/]*\/inmueble\/(\d{5,})/i);
    if (url) return url[1];
    const digits = s.match(/\d{6,}/);
    if (digits) return digits[0];
    const n = Number(s);
    if (Number.isFinite(n) && n > 0) return String(Math.trunc(n));
    return s || null;
  }

  function contactKey(v) {
    const em = String(v.email || '').trim().toLowerCase();
    if (em) return 'e:' + em;
    const tel = String(v.telefono || '').replace(/\D/g, '').slice(-9);
    if (tel) return 't:' + tel;
    return 'c:' + (v.comprador_id || v.visita_id);
  }

  async function loadCompradoresByIds(supabase, ids) {
    const uniq = [...new Set(ids.filter(Boolean))];
    if (!uniq.length) return new Map();
    const { data, error } = await supabase
      .from('compradores')
      .select('id,nombre,email,telefono,notas')
      .in('id', uniq)
      .limit(500);
    if (error) return new Map();
    const map = new Map();
    for (const c of data || []) map.set(c.id, c);
    return map;
  }

  function pushFromComprador(c, out, seen, extra) {
    if (!c) return;
    const row = {
      visita_id: extra.visita_id,
      nombre: c.nombre || '',
      email: c.email || '',
      telefono: c.telefono || '',
      estado: 'realizada',
      fecha_hora: extra.fecha_hora || null,
      comprador_id: c.id,
      fuente: extra.fuente,
    };
    if (!row.email && !row.telefono) return;
    const key = contactKey(row);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(row);
  }

  function scanCompDataMemory(idealistaId, nhRef, out, seen) {
    const list = typeof _compData !== 'undefined' && _compData ? _compData : [];
    let n = 0;
    for (const c of list) {
      const notas = String(c.notas || '');
      if (!notas.includes(idealistaId) && !notas.includes('Idealista ' + idealistaId)) continue;
      if (nhRef && notas.includes('NH-') && notas.includes(nhRef) === false) {
        const hasId = notas.includes(idealistaId);
        if (!hasId) continue;
      }
      pushFromComprador(c, out, seen, {
        visita_id: `mem:${c.id}:${idealistaId}`,
        fuente: 'idealista_notas',
      });
      n += 1;
    }
    return n;
  }

  async function fetchIdealistaRebajaClient(supabase, inm, opts) {
    const meta = { clientIdealista: 0, clientError: null, memCache: 0, interesRows: 0 };
    if (!supabase) return { visitantes: [], meta };
    if (opts?.include_interes_idealista === false) return { visitantes: [], meta };

    const idealistaId = normalizeIdealistaId(
      opts?.idealista_id ||
        document.getElementById('rebaja-match-idealista')?.value ||
        inm?.idealista_id
    );
    if (!idealistaId) {
      meta.clientError = 'Sin ref. Idealista';
      return { visitantes: [], meta };
    }

    const nhRef = (opts?.inmueble_ref || inm?.ref || '').trim();
    const inmuebleId = inm?.id || null;
    const out = [];
    const seen = new Set();

    const interesSel = 'comprador_id,idealista_id,inmueble_id,inmueble_ref,fecha_contacto';

    const { data: byIdealista, error: e1 } = await supabase
      .from('comprador_inmueble_interes')
      .select(interesSel)
      .eq('idealista_id', idealistaId)
      .limit(500);

    if (e1) {
      if (/does not exist|schema cache|could not find/i.test(e1.message || '')) {
        meta.clientError = 'Tabla comprador_inmueble_interes: ' + e1.message;
      } else {
        meta.clientError = e1.message;
      }
    } else {
      meta.interesRows = (byIdealista || []).length;
      const cmap = await loadCompradoresByIds(
        supabase,
        (byIdealista || []).map((r) => r.comprador_id)
      );
      for (const r of byIdealista || []) {
        if (normalizeIdealistaId(r.idealista_id) !== idealistaId) continue;
        pushFromComprador(cmap.get(r.comprador_id), out, seen, {
          visita_id: `idealista:${r.comprador_id}:${idealistaId}`,
          fecha_hora: r.fecha_contacto,
          fuente: 'idealista_import',
        });
      }
    }

    if (inmuebleId && opts?.include_interes_nh_ref !== false) {
      const { data: byInm } = await supabase
        .from('comprador_inmueble_interes')
        .select(interesSel)
        .eq('inmueble_id', inmuebleId)
        .limit(300);
      const cmap = await loadCompradoresByIds(
        supabase,
        (byInm || []).map((r) => r.comprador_id)
      );
      for (const r of byInm || []) {
        if (r.idealista_id && normalizeIdealistaId(r.idealista_id) !== idealistaId) continue;
        pushFromComprador(cmap.get(r.comprador_id), out, seen, {
          visita_id: `idealista:${r.comprador_id}:${r.idealista_id || 'nh'}`,
          fecha_hora: r.fecha_contacto,
          fuente: 'idealista_import',
        });
      }
    }

    const { data: notasRows, error: e2 } = await supabase
      .from('compradores')
      .select('id,nombre,email,telefono,notas')
      .ilike('notas', '%' + idealistaId + '%')
      .limit(400);

    if (e2) meta.clientError = meta.clientError || e2.message;
    for (const c of notasRows || []) {
      if (!String(c.notas || '').includes(idealistaId)) continue;
      pushFromComprador(c, out, seen, {
        visita_id: `notas:${c.id}:${idealistaId}`,
        fuente: 'idealista_notas',
      });
    }

    meta.memCache = scanCompDataMemory(idealistaId, nhRef, out, seen);
    meta.clientIdealista = out.length;
    meta.idealistaId = idealistaId;
    return { visitantes: out, meta };
  }

  async function backfillIdealistaInteres(idealistaId) {
    const { data: { session } } = await window.nhSupabase.auth.getSession();
    if (!session?.access_token) return null;
    const res = await fetch('/api/notify?__action=admin-backfill-idealista-interes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + session.access_token,
      },
      body: JSON.stringify({ idealista_id: idealistaId }),
    });
    const json = await res.json().catch(() => ({}));
    return res.ok && json.ok ? json : null;
  }

  function mergeVisitantes(apiList, clientList) {
    const seen = new Set();
    const out = [];
    for (const v of [...(apiList || []), ...(clientList || [])]) {
      const key = contactKey(v);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(v);
    }
    return out;
  }

  window.nhFetchIdealistaRebajaClient = fetchIdealistaRebajaClient;
  window.nhMergeRebajaVisitantes = mergeVisitantes;
  window.nhBackfillIdealistaInteres = backfillIdealistaInteres;
})();
