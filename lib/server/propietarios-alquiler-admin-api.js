/**
 * Admin: actualizar / eliminar propietarios alquiler (service role).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { ADMIN_ALQUILER_MENSUAL_EUR, ALQUILER_INTEGRAL_EUR } from './pricing.js';

const ESTADOS = new Set(['alta', 'documentacion', 'contrato', 'activo', 'renovacion', 'baja', 'descartado']);

function normEmail(e) {
  return String(e || '').trim().toLowerCase();
}

function normTel(t) {
  const d = String(t || '').replace(/\D/g, '');
  return d.length >= 9 ? d.slice(-9) : '';
}

function manualPlaceholderEmail(telefono) {
  const tel = normTel(telefono) || String(Date.now());
  return `manual+${tel}@leads.nuevahabitat.local`;
}

export async function findPropietarioAlquilerByContact({ email, telefono }) {
  const em = normEmail(email);
  if (em && !em.endsWith('@leads.nuevahabitat.local')) {
    const res = await fetch(
      `${SB_URL}/rest/v1/propietarios_alquiler?email=ilike.${encodeURIComponent(em)}&select=*&limit=1`,
      { headers: svcHeaders() }
    );
    if (res.ok) {
      const rows = await res.json();
      if (rows?.[0]) return rows[0];
    }
  }
  const tel = normTel(telefono);
  if (!tel) return null;
  const res = await fetch(
    `${SB_URL}/rest/v1/propietarios_alquiler?select=*&telefono=not.is.null&limit=500&order=updated_at.desc`,
    { headers: svcHeaders() }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return (rows || []).find((r) => normTel(r.telefono) === tel) || null;
}

/** Crea expediente alquiler desde lead manual (admin / integral). */
export async function createPropietarioAlquilerFromManualLead(row) {
  const nombre = String(row?.nombre || '').trim();
  const telefono = String(row?.telefono || '').trim();
  if (!nombre || !telefono) return { ok: false, error: 'nombre y telefono requeridos' };

  const servicio = row?.servicio === 'integral' ? 'integral' : 'administracion';
  const emailRaw = String(row?.email || '').trim();
  const email = emailRaw || manualPlaceholderEmail(telefono);

  const existing = await findPropietarioAlquilerByContact({ email: emailRaw || email, telefono });
  if (existing?.id) {
    const patch = {};
    if (row?.procedencia && !existing.procedencia) patch.procedencia = row.procedencia;
    if (row?.ultimo_contacto_at && !existing.ultimo_contacto_at) patch.ultimo_contacto_at = row.ultimo_contacto_at;
    if (row?.mensaje && !existing.notas_propietario) {
      patch.notas_propietario = String(row.mensaje).trim();
    }
    if (Object.keys(patch).length) {
      await patchPropietarioAlquilerAdmin(existing.id, patch);
    }
    return { ok: true, id: existing.id, row: existing, created: false };
  }

  const body = {
    nombre,
    telefono,
    email,
    activo: true,
    servicio,
    estado_gestion: 'alta',
    cuota_mensual: servicio === 'integral' ? 0 : ADMIN_ALQUILER_MENSUAL_EUR,
    integral_tarifa: ALQUILER_INTEGRAL_EUR,
    procedencia: row?.procedencia || null,
    ultimo_contacto_at: row?.ultimo_contacto_at || null,
    notas_propietario: row?.mensaje ? String(row.mensaje).trim() : null,
  };

  const res = await fetch(`${SB_URL}/rest/v1/propietarios_alquiler`, {
    method: 'POST',
    headers: svcHeaders('return=representation'),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    if (err.includes('duplicate') || err.includes('unique')) {
      const again = await findPropietarioAlquilerByContact({ email, telefono });
      if (again?.id) return { ok: true, id: again.id, row: again, created: false };
    }
    console.error('createPropietarioAlquilerFromManualLead', res.status, err);
    return { ok: false, error: err };
  }
  const data = await res.json();
  const created = Array.isArray(data) ? data[0] : data;
  return created?.id ? { ok: true, id: created.id, row: created, created: true } : { ok: false, error: 'sin id' };
}

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
  if (patch.procedencia != null) {
    body.procedencia = String(patch.procedencia).trim() || null;
  }
  if (patch.ultimo_contacto_at != null) {
    body.ultimo_contacto_at = patch.ultimo_contacto_at || null;
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
