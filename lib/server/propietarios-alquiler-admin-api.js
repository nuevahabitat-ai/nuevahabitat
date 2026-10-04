/**
 * Admin: actualizar / eliminar propietarios alquiler (service role).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';

const ESTADOS = new Set(['alta', 'documentacion', 'contrato', 'activo', 'renovacion', 'baja', 'descartado']);

export async function getPropietarioAlquilerById(id) {
  if (!id) return null;
  const res = await fetch(
    `${SB_URL}/rest/v1/propietarios_alquiler?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
    { headers: svcHeaders() }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

export async function listPropietariosAlquilerServer() {
  const res = await fetch(
    `${SB_URL}/rest/v1/propietarios_alquiler?select=*&order=updated_at.desc&limit=1000`,
    { headers: svcHeaders() }
  );
  if (!res.ok) {
    console.error('listPropietariosAlquilerServer', res.status, await res.text());
    return [];
  }
  return res.json();
}

export async function patchPropietarioAlquilerAdmin(id, patch) {
  if (!id) return { ok: false, error: 'id requerido' };
  const body = {};
  if (patch.estado_gestion != null) {
    const e = String(patch.estado_gestion).trim().toLowerCase();
    if (!ESTADOS.has(e)) return { ok: false, error: 'estado_gestion no válido' };
    body.estado_gestion = e;
  }
  if (patch.activo != null) body.activo = !!patch.activo;
  if (patch.notas_propietario != null) {
    body.notas_propietario = String(patch.notas_propietario).trim() || null;
  }
  if (!Object.keys(body).length) return { ok: false, error: 'sin campos' };

  const res = await fetch(`${SB_URL}/rest/v1/propietarios_alquiler?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: svcHeaders('return=representation'),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('patchPropietarioAlquilerAdmin', res.status, err);
    return { ok: false, error: err };
  }
  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : data;
  return row?.id ? { ok: true, row } : { ok: false, error: 'no encontrado' };
}

export async function deletePropietarioAlquilerAdmin(id) {
  if (!id) return { ok: false, error: 'id requerido' };
  const res = await fetch(`${SB_URL}/rest/v1/propietarios_alquiler?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...svcHeaders('return=representation'), Prefer: 'return=representation' },
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('deletePropietarioAlquilerAdmin', res.status, err);
    return { ok: false, error: err };
  }
  const data = await res.json();
  const n = Array.isArray(data) ? data.length : data?.id ? 1 : 0;
  return n ? { ok: true, deleted: n } : { ok: false, error: 'no encontrado' };
}
