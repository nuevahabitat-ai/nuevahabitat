/**
 * Visitantes de un inmueble + log avisos de rebaja (service role).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { idealistaIdVariants, normalizeIdealistaId } from './idealista-id.js';
import { nhMatching } from '../comprador-matching-core.js';
import { getIdealistaRebajaContacts } from './rebaja-idealista-contacts.js';

const VISITA_SELECT =
  'id,estado,fecha_hora,tipo_solicitud,inmueble_id,lead_id,perfil_id,leads(nombre,email,telefono),perfiles(nombre,telefono)';

const INTERES_SELECT =
  'comprador_id,idealista_id,inmueble_id,inmueble_ref,descripcion,fecha_contacto,compradores(id,nombre,email,telefono)';

const INTERES_SELECT_MIN = 'comprador_id,idealista_id,inmueble_id,inmueble_ref,descripcion,fecha_contacto';

function normEmail(e) {
  return String(e || '').trim().toLowerCase();
}

function normTel(t) {
  const d = String(t || '').replace(/\D/g, '');
  if (d.length >= 9) return d.slice(-9);
  return d || '';
}

function contactKey(row) {
  const em = normEmail(row.email);
  if (em) return `e:${em}`;
  const tel = normTel(row.telefono);
  if (tel) return `t:${tel}`;
  return `v:${row.visita_id}`;
}

const ESTADOS_VISITA = new Set(['pendiente', 'confirmada', 'realizada', 'completada']);

const INMUEBLE_REBAJA_SELECT =
  'id,ref,idealista_id,precio,precio_anterior,barrio,municipio,habitaciones,banos,m2_utiles,m2_construidos,m2_terraza,planta,ascensor,balcon,terraza,orientacion,tipo,estado,titulo,descripcion';

const COMPRADOR_MATCH_SELECT =
  'id,nombre,email,telefono,activo,presupuesto_min,presupuesto_max,tipo_inmueble,habitaciones_min,ascensor,planta_max_sin_ascensor,balcon_terraza_indispensable,m2_min,banos_min,exterior_indispensable,zona_buscada';

async function loadCompradoresMap(ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return new Map();
  const inList = unique.map((id) => encodeURIComponent(id)).join(',');
  const q = `${SB_URL}/rest/v1/compradores?id=in.(${inList})&select=id,nombre,email,telefono&limit=500`;
  const res = await fetch(q, { headers: svcHeaders() });
  if (!res.ok) return new Map();
  const rows = await res.json();
  const map = new Map();
  for (const c of rows || []) map.set(c.id, c);
  return map;
}

async function syncInteresesIdealistaToInmueble(inm) {
  if (!inm?.id || !inm.idealista_id) return;
  const idealistaId = normalizeIdealistaId(inm.idealista_id);
  if (!idealistaId) return;
  const body = {
    inmueble_id: inm.id,
    inmueble_ref: inm.ref || null,
  };
  for (const id of idealistaIdVariants(idealistaId)) {
    const patchRes = await fetch(
      `${SB_URL}/rest/v1/comprador_inmueble_interes?idealista_id=eq.${encodeURIComponent(id)}`,
      { method: 'PATCH', headers: svcHeaders('return=minimal'), body: JSON.stringify(body) }
    );
    if (!patchRes.ok && /inmueble_ref/.test(await patchRes.text().catch(() => ''))) {
      await fetch(
        `${SB_URL}/rest/v1/comprador_inmueble_interes?idealista_id=eq.${encodeURIComponent(id)}`,
        { method: 'PATCH', headers: svcHeaders('return=minimal'), body: JSON.stringify({ inmueble_id: inm.id }) }
      );
    }
  }
}

async function queryInteresRows(filters, meta) {
  if (!filters.length) return { rows: [], mode: 'none' };
  const or = filters.join(',');
  for (const select of [INTERES_SELECT, INTERES_SELECT_MIN]) {
    const q = `${SB_URL}/rest/v1/comprador_inmueble_interes?or=(${or})&select=${encodeURIComponent(select)}&limit=500`;
    const res = await fetch(q, { headers: svcHeaders() });
    if (res.ok) return { rows: await res.json(), mode: select === INTERES_SELECT ? 'join' : 'min' };
    const text = await res.text().catch(() => '');
    if (res.status === 404) {
      if (meta) meta.warn = 'Tabla comprador_inmueble_interes no encontrada (migración 066 en Supabase).';
      return { rows: [], mode: '404' };
    }
    const withoutRef = filters.filter((f) => !f.startsWith('inmueble_ref.'));
    if (res.status === 400 && withoutRef.length < filters.length) {
      return queryInteresRows(withoutRef, meta);
    }
    if (select === INTERES_SELECT_MIN) {
      if (meta) meta.warn = meta.warn || `interes query: ${res.status} ${text.slice(0, 80)}`;
      console.warn('comprador_inmueble_interes', res.status, text.slice(0, 200));
    }
  }
  return { rows: [], mode: 'error' };
}

function rowsToVisitantes(rows, compradorMap) {
  return (rows || [])
    .map((r) => {
      const c = r.compradores || compradorMap.get(r.comprador_id) || {};
      return {
        visita_id: `idealista:${r.comprador_id}:${r.idealista_id || r.inmueble_id || ''}`,
        nombre: c.nombre || '',
        email: c.email || '',
        telefono: c.telefono || '',
        estado: 'realizada',
        fecha_hora: r.fecha_contacto || null,
        comprador_id: r.comprador_id || c.id || null,
        fuente: 'idealista_import',
      };
    })
    .filter((v) => v.email || v.telefono);
}

async function fetchCompradoresNotasIdealista(idealistaIds, inmuebleRef, meta) {
  const out = [];
  const seen = new Set();
  const patterns = new Set();
  for (const id of idealistaIds) {
    if (id) {
      patterns.add(`%${id}%`);
      patterns.add(`%Idealista ${id}%`);
    }
  }
  if (inmuebleRef) patterns.add(`%${inmuebleRef}%`);

  for (const pat of patterns) {
    const q = `${SB_URL}/rest/v1/compradores?notas=ilike.${encodeURIComponent(pat)}&select=id,nombre,email,telefono,notas&limit=200`;
    const res = await fetch(q, { headers: svcHeaders() });
    if (!res.ok) continue;
    const rows = await res.json();
    for (const c of rows || []) {
      if (!c.email && !c.telefono) continue;
      const notas = String(c.notas || '');
      const key = c.id ? `c:${c.id}` : contactKey(c);
      if (seen.has(key)) continue;
      seen.add(key);
      const hasIdealista = idealistaIds.some((id) => id && notas.includes(id));
      const hasNh = inmuebleRef && notas.toUpperCase().includes(inmuebleRef.toUpperCase());
      let fuente = 'idealista_notas';
      if (hasNh && !hasIdealista) fuente = 'nh_notas';
      else if (hasNh && hasIdealista) fuente = 'nh_idealista_notas';
      out.push({
        visita_id: `notas:${c.id}:${pat}`,
        nombre: c.nombre || '',
        email: c.email || '',
        telefono: c.telefono || '',
        estado: 'realizada',
        fecha_hora: null,
        comprador_id: c.id,
        fuente,
      });
    }
  }
  if (meta) meta.notas = out.length;
  return out;
}

async function fetchInteresByIdealistaVariants(variantIds, meta) {
  const all = [];
  const ids = [...new Set(variantIds.filter(Boolean))];
  if (!ids.length) return [];
  if (ids.length === 1) {
    const q = `${SB_URL}/rest/v1/comprador_inmueble_interes?idealista_id=eq.${encodeURIComponent(ids[0])}&select=${encodeURIComponent(INTERES_SELECT_MIN)}&limit=500`;
    const res = await fetch(q, { headers: svcHeaders() });
    if (res.ok) all.push(...(await res.json()));
  } else {
    const inList = ids.map((id) => encodeURIComponent(id)).join(',');
    const q = `${SB_URL}/rest/v1/comprador_inmueble_interes?idealista_id=in.(${inList})&select=${encodeURIComponent(INTERES_SELECT_MIN)}&limit=500`;
    const res = await fetch(q, { headers: svcHeaders() });
    if (res.ok) all.push(...(await res.json()));
  }
  if (!all.length && meta && !meta.warn) {
    meta.idealistaIdsBuscados = ids;
  }
  const cmap = await loadCompradoresMap(all.map((r) => r.comprador_id));
  return rowsToVisitantes(all, cmap);
}

async function fetchIdealistaInteresVisitantes(inmuebleId, opts = {}, meta) {
  if (!inmuebleId) return [];
  const inmRes = await fetch(
    `${SB_URL}/rest/v1/inmuebles?id=eq.${encodeURIComponent(inmuebleId)}&select=id,idealista_id,ref&limit=1`,
    { headers: svcHeaders() }
  );
  if (!inmRes.ok) return [];
  const inmRows = await inmRes.json();
  const inm = inmRows?.[0];
  if (!inm) return [];

  const idealistaOverride = opts.idealista_id != null ? normalizeIdealistaId(opts.idealista_id) : '';
  const inmuebleRef = (opts.inmueble_ref || inm.ref || '').trim();
  const useIdealista = opts.include_interes_idealista !== false;
  const useNhRef = opts.include_interes_nh_ref !== false;

  const variants = idealistaIdVariants(inm.idealista_id, idealistaOverride, opts.idealista_id);
  if (idealistaOverride && idealistaOverride !== normalizeIdealistaId(inm.idealista_id)) {
    await fetch(`${SB_URL}/rest/v1/inmuebles?id=eq.${encodeURIComponent(inmuebleId)}`, {
      method: 'PATCH',
      headers: svcHeaders('return=minimal'),
      body: JSON.stringify({ idealista_id: idealistaOverride }),
    });
    inm.idealista_id = idealistaOverride;
    if (!variants.includes(idealistaOverride)) variants.push(idealistaOverride);
  }
  await syncInteresesIdealistaToInmueble(inm);

  const filters = [];
  filters.push(`inmueble_id.eq.${inmuebleId}`);
  if (useIdealista) {
    for (const id of variants) {
      filters.push(`idealista_id.eq.${encodeURIComponent(id)}`);
    }
  }
  if (useNhRef && inmuebleRef) {
    filters.push(`inmueble_ref.eq.${encodeURIComponent(inmuebleRef)}`);
  }

  let fromInteres = [];
  const { rows, mode } = filters.length ? await queryInteresRows(filters, meta) : { rows: [], mode: 'none' };
  if (meta) meta.interesQuery = mode;
  if (rows.length) {
    const needsMap = mode !== 'join' || rows.some((r) => !r.compradores?.telefono && !r.compradores?.email);
    const cmap = needsMap ? await loadCompradoresMap(rows.map((r) => r.comprador_id)) : new Map();
    fromInteres = rowsToVisitantes(rows, cmap);
  }
  if (useIdealista && !fromInteres.length && variants.length) {
    fromInteres = await fetchInteresByIdealistaVariants(variants, meta);
  }
  if (meta) meta.interes = fromInteres.length;

  let fromNotas = [];
  const idsForNotas = useIdealista ? variants : [];
  if (idsForNotas.length || (useNhRef && inmuebleRef)) {
    fromNotas = await fetchCompradoresNotasIdealista(idsForNotas, useNhRef ? inmuebleRef : null, meta);
  }
  return [...fromInteres, ...fromNotas];
}

export async function listVisitantesInmuebleServer(inmuebleId, opts = {}) {
  if (!inmuebleId) return { visitantes: [], meta: { visitas: 0, interes: 0, notas: 0 } };
  const includeVisitas = opts.include_visitas !== false;
  const meta = { visitas: 0, interes: 0, notas: 0, warn: null };
  const out = [];
  const seen = new Set();

  if (includeVisitas) {
    const q = `${SB_URL}/rest/v1/visitas?inmueble_id=eq.${encodeURIComponent(inmuebleId)}&select=${encodeURIComponent(VISITA_SELECT)}&order=fecha_hora.desc&limit=500`;
    const res = await fetch(q, { headers: svcHeaders() });
    if (!res.ok) throw new Error(`visitas: ${res.status}`);
    const rows = await res.json();

    for (const v of rows || []) {
      const tipo = v.tipo_solicitud || 'visita';
      if (tipo === 'disponibilidad_vendedor' || tipo === 'disponibilidad_comprador') continue;
      if (!ESTADOS_VISITA.has(v.estado)) continue;

      const nombre = v.leads?.nombre || v.perfiles?.nombre || '';
      const email = v.leads?.email || '';
      const telefono = v.leads?.telefono || v.perfiles?.telefono || '';
      if (!email && !telefono) continue;

      const row = {
        visita_id: v.id,
        nombre,
        email,
        telefono,
        estado: v.estado,
        fecha_hora: v.fecha_hora,
        comprador_id: null,
        fuente: 'visita_nh',
      };
      const key = contactKey(row);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(row);
    }
    meta.visitas = out.length;
  }

  for (const v of await fetchIdealistaInteresVisitantes(inmuebleId, opts, meta)) {
    const key = contactKey(v);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }

  return { visitantes: out, meta };
}

async function loadInmuebleForRebaja(inmuebleId) {
  const q = `${SB_URL}/rest/v1/inmuebles?id=eq.${encodeURIComponent(inmuebleId)}&select=${encodeURIComponent(INMUEBLE_REBAJA_SELECT)}&limit=1`;
  const res = await fetch(q, { headers: svcHeaders() });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

async function loadCompradoresActivosForMatch() {
  const q = `${SB_URL}/rest/v1/compradores?activo=eq.true&select=${encodeURIComponent(COMPRADOR_MATCH_SELECT)}&limit=2500`;
  const res = await fetch(q, { headers: svcHeaders() });
  if (!res.ok) return [];
  return await res.json();
}

async function enrichVisitantesCompradorIds(visitantes) {
  const needTel = visitantes.filter((v) => !v.comprador_id && (v.telefono || v.email));
  if (!needTel.length) return;
  const res = await fetch(
    `${SB_URL}/rest/v1/compradores?select=id,nombre,email,telefono&limit=3000`,
    { headers: svcHeaders() }
  );
  if (!res.ok) return;
  const all = await res.json();
  const byTel = new Map();
  const byEm = new Map();
  for (const c of all || []) {
    const t = normTel(c.telefono);
    if (t) byTel.set(t, c);
    const e = normEmail(c.email);
    if (e) byEm.set(e, c);
  }
  for (const v of visitantes) {
    if (v.comprador_id) continue;
    const t = normTel(v.telefono);
    const e = normEmail(v.email);
    const c = (t && byTel.get(t)) || (e && byEm.get(e));
    if (!c) continue;
    v.comprador_id = c.id;
    if (!v.nombre) v.nombre = c.nombre || '';
    if (!v.email) v.email = c.email || '';
    if (!v.telefono) v.telefono = c.telefono || '';
  }
}

async function fetchCompatibleCompradores(inmueble, meta) {
  const compradores = await loadCompradoresActivosForMatch();
  const out = [];
  const inmMatch = { ...inmueble, estado: inmueble.estado || 'disponible' };
  for (const c of compradores) {
    if (!c.telefono && !c.email) continue;
    if (!nhMatching.matchCompradorInmueble(c, inmMatch)) continue;
    out.push({
      visita_id: `compatible:${c.id}:${inmueble.id}`,
      nombre: c.nombre || '',
      email: c.email || '',
      telefono: c.telefono || '',
      estado: 'realizada',
      fecha_hora: null,
      comprador_id: c.id,
      fuente: 'compatible',
    });
  }
  if (meta) meta.compatibles = out.length;
  return out;
}

/**
 * Lista unificada: visitas NH + interés Idealista/NH + notas + compradores compatibles.
 */
export async function listRebajaRecipients(inmuebleId, opts = {}) {
  const matchOpts = {
    idealista_id: opts.idealista_id ?? opts.idealistaId ?? null,
    inmueble_ref: opts.inmueble_ref ?? opts.inmuebleRef ?? null,
    include_visitas: opts.include_visitas !== false && opts.includeVisitas !== false,
    include_interes_idealista: opts.include_interes_idealista !== false && opts.includeInteresIdealista !== false,
    include_interes_nh_ref: opts.include_interes_nh_ref !== false && opts.includeInteresNhRef !== false,
  };
  const includeCompatibles = opts.include_compatibles !== false && opts.includeCompatibles !== false;

  const meta = {
    visitas: 0,
    interes: 0,
    notas: 0,
    compatibles: 0,
    warn: null,
    serviceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  const seen = new Set();
  const out = [];

  function push(v) {
    if (!v?.email && !v?.telefono) return;
    const key = v.comprador_id
      ? `c:${v.comprador_id}`
      : contactKey(v);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(v);
  }

  const inm = await loadInmuebleForRebaja(inmuebleId);
  if (!inm) return { visitantes: [], meta: { ...meta, warn: 'Inmueble no encontrado' } };

  const idealistaId = normalizeIdealistaId(matchOpts.idealista_id || inm.idealista_id);
  const nhRef = String(matchOpts.inmueble_ref || inm.ref || '').trim();
  if (idealistaId) matchOpts.idealista_id = idealistaId;
  if (nhRef) matchOpts.inmueble_ref = nhRef;

  if (matchOpts.include_interes_idealista !== false && idealistaId) {
    const idRows = await getIdealistaRebajaContacts(idealistaId, inmuebleId);
    Object.assign(meta, idRows.meta || {});
    for (const v of idRows.visitantes || []) push(v);
  }

  const nh = await listVisitantesInmuebleServer(inmuebleId, matchOpts);
  for (const v of nh.visitantes || []) push(v);
  meta.visitas = nh.meta?.visitas ?? 0;
  meta.interes = Math.max(meta.interes || 0, nh.meta?.interes || 0);
  meta.notas = Math.max(meta.notas || 0, nh.meta?.notas || 0);
  if (nh.meta?.warn) meta.warn = nh.meta.warn;

  if (includeCompatibles) {
    for (const v of await fetchCompatibleCompradores(inm, meta)) push(v);
  }

  await enrichVisitantesCompradorIds(out);
  return { visitantes: out, meta };
}

export async function fetchRebajaAvisosSent(inmuebleId, precioNuevo) {
  const res = await fetch(
    `${SB_URL}/rest/v1/inmueble_rebaja_avisos?inmueble_id=eq.${encodeURIComponent(inmuebleId)}&precio_nuevo=eq.${encodeURIComponent(precioNuevo)}&select=email,telefono,comprador_id,canal`,
    { headers: svcHeaders() }
  );
  if (!res.ok) return { email: new Set(), whatsapp: new Set() };
  const rows = await res.json();
  const email = new Set();
  const whatsapp = new Set();
  for (const r of rows || []) {
    const k = r.comprador_id
      ? `c:${r.comprador_id}`
      : normEmail(r.email)
        ? `e:${normEmail(r.email)}`
        : normTel(r.telefono)
          ? `t:${normTel(r.telefono)}`
          : '';
    if (!k) continue;
    if (r.canal === 'email') email.add(k);
    if (r.canal === 'whatsapp') whatsapp.add(k);
  }
  return { email, whatsapp };
}

export async function insertRebajaAviso(row) {
  const res = await fetch(`${SB_URL}/rest/v1/inmueble_rebaja_avisos`, {
    method: 'POST',
    headers: svcHeaders('return=minimal'),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const t = await res.text();
    if (!/duplicate|unique|23505/i.test(t)) console.warn('insertRebajaAviso', res.status, t);
  }
}

export async function insertCompradorWaRebaja({ comprador_id, inmueble_id, inmueble_ref, precio_notificado }) {
  const res = await fetch(`${SB_URL}/rest/v1/comprador_inmueble_wa_avisos`, {
    method: 'POST',
    headers: svcHeaders('return=minimal'),
    body: JSON.stringify({
      comprador_id,
      inmueble_id,
      inmueble_ref,
      motivo: 'rebaja',
      precio_notificado,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    if (!/duplicate|unique|23505/i.test(t)) console.warn('insertCompradorWaRebaja', res.status, t);
  }
}
