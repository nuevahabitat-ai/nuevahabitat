/**
 * Inserción de leads con service role (formularios web → tabla leads).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';

const LEAD_TYPES = new Set(['compra', 'venta', 'hipoteca', 'valoracion', 'info']);

export function normalizeLeadTipo(raw) {
  const t = String(raw || 'info').toLowerCase().trim();
  const map = {
    vender: 'venta',
    vendedor: 'venta',
    venta: 'venta',
    valoracion: 'valoracion',
    comprar: 'compra',
    compra: 'compra',
    comprador: 'compra',
    hipoteca: 'hipoteca',
    contacto: 'info',
    visita: 'info',
    newsletter: 'info',
    info: 'info',
  };
  const n = map[t] || t;
  return LEAD_TYPES.has(n) ? n : 'info';
}

export function cleanLeadRow(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== '')
  );
}

/**
 * @returns {Promise<{ id: string } | null>}
 */
export async function insertLeadServer(row) {
  const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!SB_SERVICE) {
    console.error('insertLeadServer: missing SUPABASE_SERVICE_ROLE_KEY');
    return null;
  }

  const nombre = String(row.nombre || '').trim();
  const telefono = String(row.telefono || '').trim();
  if (!nombre || !telefono) return null;

  const payload = cleanLeadRow({
    nombre,
    telefono,
    email: row.email ? String(row.email).trim() : null,
    mensaje: row.mensaje != null ? String(row.mensaje) : null,
    tipo: normalizeLeadTipo(row.tipo),
    origen: row.origen ? String(row.origen).slice(0, 120) : 'web',
    inmueble_id: row.inmueble_id || null,
    perfil_id: row.perfil_id || null,
    utm_source: row.utm_source || null,
    utm_medium: row.utm_medium || null,
    utm_campaign: row.utm_campaign || null,
    estado: 'nuevo',
  });

  const res = await fetch(`${SB_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: svcHeaders('return=representation'),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('insertLeadServer', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const id = Array.isArray(data) ? data[0]?.id : data?.id;
  return id ? { id } : null;
}

function normEmail(e) {
  return String(e || '').trim().toLowerCase();
}

function normTel(t) {
  const d = String(t || '').replace(/\D/g, '');
  return d.length >= 9 ? d : '';
}

/** Solo solicitudes enviadas desde formularios en la web (landings, contacto, etc.). */
export function isFormularioWebLead(row) {
  const origen = String(row?.origen || '').trim();
  const tel = String(row?.telefono || '').trim();
  if (origen === 'registro_cuenta') return false;
  if (origen === 'newsletter_blog') return false;
  if (tel === 'newsletter') return false;
  return true;
}

export async function listLeadsServer({ limit = 500, formularioOnly = true } = {}) {
  const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!SB_SERVICE) return [];

  const res = await fetch(
    `${SB_URL}/rest/v1/leads?select=id,nombre,email,telefono,tipo,mensaje,estado,notas,origen,utm_source,utm_medium,utm_campaign,created_at,updated_at&order=created_at.desc&limit=${Math.min(limit, 1000)}`,
    { headers: svcHeaders() }
  );
  if (!res.ok) {
    console.error('listLeadsServer', res.status, await res.text());
    return [];
  }
  const rows = await res.json();
  return formularioOnly ? (rows || []).filter(isFormularioWebLead) : (rows || []);
}

export async function getLeadByIdServer(id) {
  const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!SB_SERVICE || !id) return null;
  const res = await fetch(
    `${SB_URL}/rest/v1/leads?id=eq.${encodeURIComponent(id)}&select=id,nombre,email,telefono,tipo,mensaje,estado,notas,origen,created_at&limit=1`,
    { headers: svcHeaders() }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

/** Elimina leads que no son de formulario web (registro panel, newsletter, sync CRM). */
export async function purgeNonFormularioLeadsServer() {
  const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!SB_SERVICE) return { deleted: 0, error: 'missing service role' };

  const q = 'or=(origen.eq.registro_cuenta,origen.eq.newsletter_blog,telefono.eq.newsletter)';
  const res = await fetch(`${SB_URL}/rest/v1/leads?${q}`, {
    method: 'DELETE',
    headers: { ...svcHeaders('return=representation'), Prefer: 'return=representation' },
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('purgeNonFormularioLeadsServer', res.status, err);
    return { deleted: 0, error: err };
  }
  const data = await res.json();
  return { deleted: Array.isArray(data) ? data.length : 0 };
}

/** @deprecated No usar: los leads son solo formularios web. */
export async function syncLeadsFromCrmServer() {
  const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!SB_SERVICE) return { inserted: 0, error: 'missing service role' };

  const headers = svcHeaders();
  const [compRes, vendRes, leadRes] = await Promise.all([
    fetch(`${SB_URL}/rest/v1/compradores?select=nombre,email,telefono,created_at&order=created_at.desc&limit=150`, { headers }),
    fetch(`${SB_URL}/rest/v1/vendedores?select=nombre,email,telefono,created_at&order=created_at.desc&limit=150`, { headers }),
    fetch(`${SB_URL}/rest/v1/leads?select=email,telefono&order=created_at.desc&limit=1000`, { headers }),
  ]);

  if (!compRes.ok || !vendRes.ok || !leadRes.ok) {
    const err = [compRes, vendRes, leadRes].find(r => !r.ok);
    return { inserted: 0, error: err ? await err.text() : 'fetch failed' };
  }

  const comps = await compRes.json();
  const vends = await vendRes.json();
  const existing = await leadRes.json();
  const seen = new Set();
  for (const l of existing || []) {
    const e = normEmail(l.email);
    const t = normTel(l.telefono);
    if (e) seen.add(`e:${e}`);
    if (t) seen.add(`t:${t}`);
  }

  const already = (email, telefono) => {
    const e = normEmail(email);
    const t = normTel(telefono);
    if (e && seen.has(`e:${e}`)) return true;
    if (t && seen.has(`t:${t}`)) return true;
    return false;
  };
  const mark = (email, telefono) => {
    const e = normEmail(email);
    const t = normTel(telefono);
    if (e) seen.add(`e:${e}`);
    if (t) seen.add(`t:${t}`);
  };

  let inserted = 0;
  const rows = [];
  for (const c of comps || []) {
    if (!c?.nombre || already(c.email, c.telefono)) continue;
    const tel = normTel(c.telefono) || String(c.telefono || '').trim();
    if (!tel) continue;
    rows.push({
      nombre: c.nombre,
      email: c.email || null,
      telefono: tel,
      tipo: 'compra',
      origen: 'registro_cuenta',
      mensaje: 'Nuevo comprador registrado en su panel',
      estado: 'nuevo',
    });
    mark(c.email, c.telefono);
  }
  for (const v of vends || []) {
    if (!v?.nombre || already(v.email, v.telefono)) continue;
    const tel = normTel(v.telefono) || String(v.telefono || '').trim();
    if (!tel) continue;
    rows.push({
      nombre: v.nombre,
      email: v.email || null,
      telefono: tel,
      tipo: 'venta',
      origen: 'registro_cuenta',
      mensaje: 'Nuevo vendedor registrado en su panel',
      estado: 'nuevo',
    });
    mark(v.email, v.telefono);
  }

  for (const row of rows) {
    const ins = await insertLeadServer(row);
    if (ins?.id) inserted += 1;
  }

  return { inserted, pending: rows.length };
}
