/** Particulares (seguimientos captación) — Supabase service role */
import { SB_URL, svcHeaders } from './supabase-server.js';

const SELECT =
  'id,titulo,telefono,contacto_nombre,zona,municipio,proxima_alarma_at,estado,ultimo_contacto_at';

export function publicParticular(row) {
  if (!row) return null;
  return {
    id: row.id,
    titulo: row.titulo ?? null,
    telefono: row.telefono ?? null,
    contacto_nombre: row.contacto_nombre ?? null,
    zona: row.zona ?? null,
    municipio: row.municipio ?? null,
    proxima_alarma_at: row.proxima_alarma_at ?? null,
    estado: row.estado ?? null,
    ultimo_contacto_at: row.ultimo_contacto_at ?? null,
  };
}

export async function listParticulares({ mode = 'activos', limit = 50 } = {}) {
  const params = new URLSearchParams();
  params.set('select', SELECT);
  params.set('activo', 'eq.true');
  params.set('estado', 'not.in.(captado,descartado)');
  params.set('order', 'proxima_alarma_at.asc.nullslast,created_at.desc');
  params.set('limit', String(Math.min(Math.max(limit, 1), 50)));

  const now = new Date();
  if (mode === 'alarmas') {
    params.set('proxima_alarma_at', `lte.${now.toISOString()}`);
  } else if (mode === 'hoy') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    params.set('proxima_alarma_at', `gte.${start.toISOString()}`);
    params.append('proxima_alarma_at', `lte.${end.toISOString()}`);
  }

  const res = await fetch(`${SB_URL}/rest/v1/particulares?${params}`, { headers: svcHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
