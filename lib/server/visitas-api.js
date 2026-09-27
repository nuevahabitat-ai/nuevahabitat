/**
 * Visitas — listado admin (Supabase + sync Google Calendar equipo).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { listTeamCalendarEvents, dedupeCalendarEvents } from './google-calendar.js';

const VISITA_SELECT =
  'id,estado,fecha_hora,notas,tipo_solicitud,inmueble_id,perfil_id,lead_id,inmuebles(titulo,ref),leads(nombre,email,telefono),perfiles(nombre,telefono)';

export function gcalMarker(eventId) {
  return `[gcal:${eventId}]`;
}

function inferTipoFromSummary(summary) {
  const s = String(summary || '').toLowerCase();
  if (s.includes('disponibilidad') && s.includes('vendedor')) return 'disponibilidad_vendedor';
  if (s.includes('disponibilidad') && s.includes('comprador')) return 'disponibilidad_comprador';
  if (s.includes('disponibilidad')) return 'disponibilidad_comprador';
  if (s.includes('visita')) return 'visita';
  return 'visita';
}

function mapGoogleStatus(status) {
  if (status === 'confirmed') return 'confirmada';
  if (status === 'cancelled') return 'cancelada';
  return 'pendiente';
}

function calendarEventToRow(ev) {
  const start = ev.start?.dateTime || ev.start?.date;
  if (!start) return null;
  const fecha_hora = ev.start.dateTime
    ? new Date(ev.start.dateTime).toISOString()
    : new Date(`${ev.start.date}T10:00:00`).toISOString();
  return {
    estado: mapGoogleStatus(ev.status),
    fecha_hora,
    notas: `${gcalMarker(ev.id)} ${ev.summary || 'Cita calendario'}${ev.description ? `\n${ev.description}` : ''}`.trim(),
    tipo_solicitud: inferTipoFromSummary(ev.summary),
    _htmlLink: ev.htmlLink || null,
    _fromCalendar: true,
  };
}

async function findVisitaByFechaNotas(fecha_hora, notas) {
  if (!fecha_hora || !notas) return null;
  const res = await fetch(
    `${SB_URL}/rest/v1/visitas?fecha_hora=eq.${encodeURIComponent(fecha_hora)}&select=id,notas&limit=8`,
    { headers: svcHeaders() }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  const needle = String(notas).slice(0, 48);
  const hit = (rows || []).find((r) => String(r.notas || '').includes(needle));
  return hit?.id || null;
}

async function findVisitaByGoogleEventId(eventId) {
  const mark = gcalMarker(eventId);
  const res = await fetch(
    `${SB_URL}/rest/v1/visitas?notas=ilike.${encodeURIComponent(`*${mark}*`)}&select=id&limit=1`,
    { headers: svcHeaders() }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0]?.id || null;
}

async function insertVisitaRow(row) {
  const payload = Object.fromEntries(
    Object.entries(row).filter(([k, v]) => v != null && v !== '' && !String(k).startsWith('_'))
  );
  const res = await fetch(`${SB_URL}/rest/v1/visitas`, {
    method: 'POST',
    headers: svcHeaders('return=representation'),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.warn('insertVisitaRow', res.status, await res.text());
    return null;
  }
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

/** Crea fila en visitas al registrar disponibilidad / evento GCal. */
export async function insertVisitaFromDisponibilidad({
  fecha_hora,
  notas,
  tipo_solicitud,
  perfil_id,
  inmueble_id,
  google_event_id,
  html_link,
}) {
  let notasFinal = notas || '';
  if (google_event_id && !notasFinal.includes(gcalMarker(google_event_id))) {
    notasFinal = `${gcalMarker(google_event_id)} ${notasFinal}`.trim();
  }
  if (html_link && !notasFinal.includes(html_link)) {
    notasFinal = `${notasFinal}\n${html_link}`.trim();
  }
  if (google_event_id) {
    const existing = await findVisitaByGoogleEventId(google_event_id);
    if (existing) return { id: existing, duplicate: true };
  }
  const dup = await findVisitaByFechaNotas(fecha_hora, notasFinal);
  if (dup) return { id: dup, duplicate: true };
  const base = {
    estado: 'pendiente',
    fecha_hora,
    notas: notasFinal,
    tipo_solicitud: tipo_solicitud || 'visita',
    perfil_id: perfil_id || null,
    inmueble_id: inmueble_id || null,
  };
  const attempts = [
    base,
    { ...base, inmueble_id: undefined },
    { ...base, perfil_id: undefined, inmueble_id: undefined },
    { estado: base.estado, fecha_hora: base.fecha_hora, notas: base.notas, tipo_solicitud: base.tipo_solicitud },
  ];
  for (const attempt of attempts) {
    const clean = Object.fromEntries(
      Object.entries(attempt).filter(([, v]) => v != null && v !== '')
    );
    const ins = await insertVisitaRow(clean);
    if (ins?.id) return ins;
  }
  return null;
}

async function syncGoogleEventsToDb(events) {
  let inserted = 0;
  for (const ev of events) {
    if (ev.status === 'cancelled') continue;
    const row = calendarEventToRow(ev);
    if (!row) continue;
    const existing = await findVisitaByGoogleEventId(ev.id);
    if (existing) continue;
    const ins = await insertVisitaRow({
      estado: row.estado,
      fecha_hora: row.fecha_hora,
      notas: row.notas,
      tipo_solicitud: row.tipo_solicitud,
    });
    if (ins?.id) inserted += 1;
  }
  return inserted;
}

export async function listVisitasAdminServer({ syncCalendar = true } = {}) {
  if (syncCalendar) {
    try {
      const raw = await listTeamCalendarEvents();
      const deduped = dedupeCalendarEvents(raw);
      await syncGoogleEventsToDb(deduped);
    } catch (err) {
      console.warn('listVisitasAdminServer sync', err.message);
    }
  }

  const res = await fetch(
    `${SB_URL}/rest/v1/visitas?select=${encodeURIComponent(VISITA_SELECT)}&order=fecha_hora.desc&limit=500`,
    { headers: svcHeaders() }
  );
  if (!res.ok) {
    const err = await res.text();
    console.error('listVisitasAdminServer', res.status, err);
    const fallback = await fetch(
      `${SB_URL}/rest/v1/visitas?select=id,estado,fecha_hora,notas,tipo_solicitud,inmueble_id,perfil_id&order=fecha_hora.desc&limit=500`,
      { headers: svcHeaders() }
    );
    if (!fallback.ok) return { data: [], error: err };
    return { data: await fallback.json(), schemaFallback: true };
  }
  const data = await res.json();
  return { data: data || [] };
}
