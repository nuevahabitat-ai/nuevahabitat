/**
 * Visitantes de un inmueble + log avisos de rebaja (service role).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';

const VISITA_SELECT =
  'id,estado,fecha_hora,tipo_solicitud,inmueble_id,lead_id,perfil_id,leads(nombre,email,telefono),perfiles(nombre,telefono)';

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

const ESTADOS_VISITA = new Set(['pendiente', 'confirmada', 'realizada']);

const INTERES_SELECT =
  'comprador_id,idealista_id,inmueble_id,descripcion,fecha_contacto,compradores(id,nombre,email,telefono)';

async function syncInteresesIdealistaToInmueble(inm) {
  if (!inm?.id || !inm.idealista_id) return;
  const idealistaId = String(inm.idealista_id).trim();
  if (!idealistaId) return;
  const body = {
    inmueble_id: inm.id,
    inmueble_ref: inm.ref || null,
  };
  const patchRes = await fetch(
    `${SB_URL}/rest/v1/comprador_inmueble_interes?idealista_id=eq.${encodeURIComponent(idealistaId)}`,
    { method: 'PATCH', headers: svcHeaders('return=minimal'), body: JSON.stringify(body) }
  );
  if (!patchRes.ok && /inmueble_ref/.test(await patchRes.text().catch(() => ''))) {
    await fetch(
      `${SB_URL}/rest/v1/comprador_inmueble_interes?idealista_id=eq.${encodeURIComponent(idealistaId)}`,
      { method: 'PATCH', headers: svcHeaders('return=minimal'), body: JSON.stringify({ inmueble_id: inm.id }) }
    );
  }
}

async function queryInteresRows(filters, meta) {
  if (!filters.length) return [];
  const or = filters.join(',');
  const q = `${SB_URL}/rest/v1/comprador_inmueble_interes?or=(${or})&select=${encodeURIComponent(INTERES_SELECT)}&limit=500`;
  const res = await fetch(q, { headers: svcHeaders() });
  if (res.ok) return res.json();
  const text = await res.text().catch(() => '');
  if (res.status === 404) {
    if (meta) meta.warn = 'Tabla comprador_inmueble_interes no encontrada (migración 066).';
    return [];
  }
  const withoutRef = filters.filter((f) => !f.startsWith('inmueble_ref.'));
  if (res.status === 400 && withoutRef.length < filters.length) {
    return queryInteresRows(withoutRef, meta);
  }
  if (meta) meta.warn = meta.warn || `interes query: ${res.status}`;
  console.warn('comprador_inmueble_interes', res.status, text.slice(0, 200));
  return [];
}

async function fetchCompradoresNotasIdealista(idealistaIds, meta) {
  const out = [];
  const seen = new Set();
  for (const id of idealistaIds) {
    if (!id) continue;
    const pat = encodeURIComponent(`%${id}%`);
    const q = `${SB_URL}/rest/v1/compradores?activo=eq.true&notas=ilike.${pat}&select=id,nombre,email,telefono&limit=150`;
    const res = await fetch(q, { headers: svcHeaders() });
    if (!res.ok) continue;
    const rows = await res.json();
    for (const c of rows || []) {
      if (!c.email && !c.telefono) continue;
      const key = c.id ? `c:${c.id}` : contactKey(c);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        visita_id: `notas:${c.id}:${id}`,
        nombre: c.nombre || '',
        email: c.email || '',
        telefono: c.telefono || '',
        estado: 'realizada',
        fecha_hora: null,
        comprador_id: c.id,
        fuente: 'idealista_notas',
      });
    }
  }
  if (meta) meta.notas = out.length;
  return out;
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

  const idealistaOverride = opts.idealista_id != null ? String(opts.idealista_id).trim() : '';
  const inmuebleRef = (opts.inmueble_ref || inm.ref || '').trim();
  const useIdealista = opts.include_interes_idealista !== false;
  const useNhRef = opts.include_interes_nh_ref !== false;

  if (idealistaOverride && idealistaOverride !== String(inm.idealista_id || '').trim()) {
    await fetch(`${SB_URL}/rest/v1/inmuebles?id=eq.${encodeURIComponent(inmuebleId)}`, {
      method: 'PATCH',
      headers: svcHeaders('return=minimal'),
      body: JSON.stringify({ idealista_id: idealistaOverride }),
    });
    inm.idealista_id = idealistaOverride;
  }
  await syncInteresesIdealistaToInmueble(inm);

  const filters = [];
  filters.push(`inmueble_id.eq.${encodeURIComponent(inmuebleId)}`);
  const idealistaIds = new Set();
  if (useIdealista && inm.idealista_id) idealistaIds.add(String(inm.idealista_id).trim());
  if (useIdealista && idealistaOverride) idealistaIds.add(idealistaOverride);
  for (const id of idealistaIds) {
    filters.push(`idealista_id.eq.${encodeURIComponent(id)}`);
  }
  if (useNhRef && inmuebleRef) {
    filters.push(`inmueble_ref.eq.${encodeURIComponent(inmuebleRef)}`);
  }
  if (!filters.length && !idealistaIds.size) return [];

  const rows = filters.length ? await queryInteresRows(filters, meta) : [];
  const fromInteres = (rows || []).map((r) => {
    const c = r.compradores || {};
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
  }).filter((v) => v.email || v.telefono);
  if (meta) meta.interes = fromInteres.length;

  let fromNotas = [];
  if (useIdealista && idealistaIds.size) {
    fromNotas = await fetchCompradoresNotasIdealista(idealistaIds, meta);
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
