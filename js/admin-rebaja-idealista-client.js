/**
 * Contactos rebaja desde Supabase (sesión admin) — mismo idealista_id + mismo piso.
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

  async function fetchIdealistaRebajaClient(supabase, inm, opts) {
    const meta = { clientIdealista: 0, clientError: null };
    if (!supabase) return { visitantes: [], meta };
  const useIdealista = opts?.include_interes_idealista !== false;
  if (!useIdealista) return { visitantes: [], meta };

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

    function push(c, extra) {
      if (!c) return;
      const row = {
        visita_id: extra.visita_id,
        nombre: c.nombre || '',
        email: c.email || '',
        telefono: c.telefono || '',
        estado: 'realizada',
        fecha_hora: extra.fecha_hora || null,
        comprador_id: c.id || extra.comprador_id,
        fuente: extra.fuente,
      };
      if (!row.email && !row.telefono) return;
      const key = contactKey(row);
      if (seen.has(key)) return;
      seen.add(key);
      out.push(row);
    }

    const sel =
      'comprador_id,idealista_id,inmueble_id,inmueble_ref,fecha_contacto,compradores(id,nombre,email,telefono)';

    const { data: byIdealista, error: e1 } = await supabase
      .from('comprador_inmueble_interes')
      .select(sel)
      .eq('idealista_id', idealistaId)
      .limit(500);

    if (e1) {
      if (/does not exist|schema cache|PGRST/i.test(e1.message || '')) {
        meta.clientError = 'Tabla comprador_inmueble_interes no existe — ejecuta migración 066 en Supabase.';
      } else {
        meta.clientError = e1.message;
      }
    } else {
      for (const r of byIdealista || []) {
        if (normalizeIdealistaId(r.idealista_id) !== idealistaId) continue;
        push(r.compradores, {
          visita_id: `idealista:${r.comprador_id}:${idealistaId}`,
          comprador_id: r.comprador_id,
          fecha_hora: r.fecha_contacto,
          fuente: 'idealista_import',
        });
      }
    }

    if (inmuebleId && opts?.include_interes_nh_ref !== false) {
      const { data: byInm } = await supabase
        .from('comprador_inmueble_interes')
        .select(sel)
        .eq('inmueble_id', inmuebleId)
        .limit(300);
      for (const r of byInm || []) {
        if (r.idealista_id && normalizeIdealistaId(r.idealista_id) !== idealistaId) continue;
        push(r.compradores, {
          visita_id: `idealista:${r.comprador_id}:${r.idealista_id || 'nh'}`,
          comprador_id: r.comprador_id,
          fecha_hora: r.fecha_contacto,
          fuente: 'idealista_import',
        });
      }
    }

    const { data: notasRows } = await supabase
      .from('compradores')
      .select('id,nombre,email,telefono,notas')
      .ilike('notas', '%' + idealistaId + '%')
      .limit(300);

    for (const c of notasRows || []) {
      const n = String(c.notas || '');
      if (!n.includes(idealistaId) && !n.includes('Idealista ' + idealistaId)) continue;
      if (!n.includes(idealistaId)) continue;
      push(c, {
        visita_id: `notas:${c.id}:${idealistaId}`,
        fuente: 'idealista_notas',
      });
    }

    meta.clientIdealista = out.length;
    meta.idealistaId = idealistaId;
    return { visitantes: out, meta };
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
})();
