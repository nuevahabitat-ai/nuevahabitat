/** Helpers compradores — normalización teléfono y Supabase (service role) */
import { SB_URL, svcHeaders } from './supabase-server.js';

export function normalizePhoneES(raw) {
  if (raw == null || String(raw).trim() === '') return null;
  let digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('34') && digits.length > 9) digits = digits.slice(2);
  if (digits.length !== 9) return null;
  if (!/^[6789]/.test(digits)) return null;
  return `+34${digits}`;
}

export function buildCompradorRow(body) {
  const nombre = String(body.nombre || '').trim();
  const telefono = normalizePhoneES(body.telefono);
  const row = {
    nombre,
    telefono,
    activo: true,
    email: body.email ? String(body.email).trim() || null : null,
    notas: body.notas ? String(body.notas).trim() || null : null,
    zona_buscada: body.zona_buscada ? String(body.zona_buscada).trim() || null : null,
    presupuesto_max: body.presupuesto_max != null && body.presupuesto_max !== ''
      ? Number(body.presupuesto_max)
      : null,
    habitaciones_min: body.habitaciones_min != null && body.habitaciones_min !== ''
      ? parseInt(body.habitaciones_min, 10)
      : null,
    ascensor: body.ascensor === true || body.ascensor === 'true' ? true : undefined,
    planta_max_sin_ascensor: body.planta_max_sin_ascensor != null && body.planta_max_sin_ascensor !== ''
      ? parseInt(body.planta_max_sin_ascensor, 10)
      : undefined,
    m2_min: body.m2_min != null && body.m2_min !== '' ? Number(body.m2_min) : undefined,
    banos_min: body.banos_min != null && body.banos_min !== '' ? parseInt(body.banos_min, 10) : undefined,
    balcon_terraza_indispensable: body.balcon_terraza_indispensable === true || body.balcon_terraza_indispensable === 'true' ? true : undefined,
    exterior_indispensable: body.exterior_indispensable === true || body.exterior_indispensable === 'true' ? true : undefined,
  };
  if (row.presupuesto_max != null && !Number.isFinite(row.presupuesto_max)) row.presupuesto_max = null;
  if (row.habitaciones_min != null && !Number.isFinite(row.habitaciones_min)) row.habitaciones_min = null;
  if (row.m2_min != null && !Number.isFinite(row.m2_min)) row.m2_min = null;
  if (row.banos_min != null && !Number.isFinite(row.banos_min)) row.banos_min = null;
  if (row.planta_max_sin_ascensor != null && !Number.isFinite(row.planta_max_sin_ascensor)) row.planta_max_sin_ascensor = null;
  Object.keys(row).forEach((k) => { if (row[k] === undefined) delete row[k]; });
  return row;
}

export async function findCompradorByTelefono(telefono) {
  const e164 = normalizePhoneES(telefono);
  if (!e164) return null;
  const last9 = e164.slice(-9);
  const q = `or=(telefono.eq.${encodeURIComponent(e164)},telefono.eq.${last9},telefono.eq.34${last9})`;
  const res = await fetch(
    `${SB_URL}/rest/v1/compradores?${q}&select=id,nombre,telefono,email,zona_buscada,presupuesto_max,activo,created_at&limit=1`,
    { headers: svcHeaders() }
  );
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  return rows?.[0] || null;
}

export async function insertComprador(row) {
  const res = await fetch(`${SB_URL}/rest/v1/compradores`, {
    method: 'POST',
    headers: svcHeaders('return=representation'),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(text);
    err.status = res.status;
    throw err;
  }
  const rows = await res.json();
  return Array.isArray(rows) ? rows[0] : rows;
}

export async function listCompradores({ activo, limit }) {
  const params = new URLSearchParams();
  params.set('select', 'id,nombre,telefono,email,zona_buscada,presupuesto_max,habitaciones_min,ascensor,planta_max_sin_ascensor,balcon_terraza_indispensable,m2_min,banos_min,exterior_indispensable,activo,notas,created_at');
  params.set('order', 'created_at.desc');
  params.set('limit', String(limit));
  if (activo === true) params.set('activo', 'eq.true');
  if (activo === false) params.set('activo', 'eq.false');

  const res = await fetch(`${SB_URL}/rest/v1/compradores?${params}`, { headers: svcHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function publicComprador(row) {
  if (!row) return null;
  return {
    id: row.id,
    nombre: row.nombre,
    telefono: row.telefono,
    email: row.email ?? null,
    zona_buscada: row.zona_buscada ?? null,
    presupuesto_max: row.presupuesto_max != null ? Number(row.presupuesto_max) : null,
    habitaciones_min: row.habitaciones_min != null ? Number(row.habitaciones_min) : null,
    ascensor: row.ascensor === true,
    planta_max_sin_ascensor: row.planta_max_sin_ascensor != null ? Number(row.planta_max_sin_ascensor) : null,
    m2_min: row.m2_min != null ? Number(row.m2_min) : null,
    banos_min: row.banos_min != null ? Number(row.banos_min) : null,
    balcon_terraza_indispensable: row.balcon_terraza_indispensable === true,
    exterior_indispensable: row.exterior_indispensable === true,
    activo: row.activo !== false,
    notas: row.notas ?? null,
    created_at: row.created_at ?? null,
  };
}
