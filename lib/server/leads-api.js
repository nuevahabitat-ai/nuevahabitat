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
