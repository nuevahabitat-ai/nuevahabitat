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

const FORMULARIO_TIPOS = new Set(['compra', 'venta', 'valoracion', 'hipoteca']);

/** Solo formularios web con tipo explícito (no contacto genérico tipo info). */
export function isFormularioWebLead(row) {
  const origen = String(row?.origen || '').trim();
  const tel = String(row?.telefono || '').trim();
  const tipo = String(row?.tipo || '').trim().toLowerCase();
  if (origen === 'registro_cuenta') return false;
  if (origen === 'newsletter_blog') return false;
  if (tel === 'newsletter') return false;
  return FORMULARIO_TIPOS.has(tipo);
}

export function isAlquilerPropietarioLead(row) {
  const o = String(row?.origen || '').trim();
  return o === 'alquiler_integral' || o === 'alquiler_administracion';
}

export function isAdminLeadsListRow(row) {
  return isFormularioWebLead(row) || isAlquilerPropietarioLead(row);
}

/** Lead sintético desde fila propietarios_alquiler (panel admin). */
export function propietarioAlquilerToLeadRow(p) {
  if (!p?.id) return null;
  const integral = (p.servicio || 'administracion') === 'integral';
  const inactivo = p.activo === false || p.estado_gestion === 'baja' || p.estado_gestion === 'descartado';
  return {
    id: `pa:${p.id}`,
    propietario_alquiler_id: p.id,
    nombre: p.nombre,
    email: p.email,
    telefono: p.telefono || '000000000',
    tipo: 'info',
    origen: integral ? 'alquiler_integral' : 'alquiler_administracion',
    mensaje: integral
      ? `Panel alquiler integral (499 €)${p.inmueble_direccion ? ` · ${p.inmueble_direccion}` : ''}`
      : `Panel administración alquiler (60 €/mes)${p.inmueble_direccion ? ` · ${p.inmueble_direccion}` : ''}`,
    estado: inactivo ? 'descartado' : 'nuevo',
    notas: p.notas_propietario,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
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
  if (!formularioOnly) return rows || [];
  return (rows || []).filter(isAdminLeadsListRow);
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

const LEAD_PATCH_KEYS = new Set(['estado', 'notas']);

/** Actualiza un lead (solo admin vía API). */
export async function updateLeadServer(id, patch) {
  const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!SB_SERVICE || !id) return { ok: false, error: 'missing service role or id' };

  const body = {};
  for (const [k, v] of Object.entries(patch || {})) {
    if (!LEAD_PATCH_KEYS.has(k)) continue;
    if (k === 'estado') {
      const e = String(v || '').trim().toLowerCase();
      if (!['nuevo', 'contactado', 'cualificado', 'descartado', 'cerrado'].includes(e)) {
        return { ok: false, error: 'estado no válido' };
      }
      body.estado = e;
    } else if (k === 'notas') {
      body.notas = v == null || String(v).trim() === '' ? null : String(v).trim();
    }
  }
  if (!Object.keys(body).length) return { ok: false, error: 'sin campos para actualizar' };

  const res = await fetch(`${SB_URL}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: svcHeaders('return=representation'),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('updateLeadServer', res.status, err);
    return { ok: false, error: err };
  }
  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : data;
  return row?.id ? { ok: true, row } : { ok: false, error: 'lead no encontrado' };
}

/** Elimina un lead por id (solo admin vía API). */
export async function deleteLeadServer(id) {
  const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!SB_SERVICE || !id) return { ok: false, error: 'missing service role or id' };

  const res = await fetch(`${SB_URL}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...svcHeaders('return=representation'), Prefer: 'return=representation' },
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('deleteLeadServer', res.status, err);
    return { ok: false, error: err };
  }
  const data = await res.json();
  const deleted = Array.isArray(data) ? data.length : data?.id ? 1 : 0;
  return deleted ? { ok: true, deleted } : { ok: false, error: 'lead no encontrado' };
}

/** Elimina leads que no son de formulario web (registro panel, newsletter, sync CRM). */
export async function purgeNonFormularioLeadsServer() {
  const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!SB_SERVICE) return { deleted: 0, error: 'missing service role' };

  const q = 'or=(origen.eq.registro_cuenta,origen.eq.newsletter_blog,telefono.eq.newsletter,tipo.eq.info)';
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
