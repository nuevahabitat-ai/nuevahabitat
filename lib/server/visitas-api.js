/**
 * Visitas — listado admin (Supabase + sync Google Calendar equipo).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import {
  listTeamCalendarEvents,
  dedupeCalendarEvents,
  getCalendarSyncWindow,
  isGoogleCalendarConfigured,
  createPanelVisitaCalendarEvent,
} from './google-calendar.js';

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

function hasGcalMarker(notas) {
  return /\[gcal:[^\]]+\]/.test(String(notas || ''));
}

function visitaSummaryFromRow(v) {
  const tipo = v.tipo_solicitud || 'visita';
  const tipoLabel =
    tipo === 'disponibilidad_vendedor'
      ? 'Disponibilidad vendedor'
      : tipo === 'disponibilidad_comprador'
        ? 'Disponibilidad comprador'
        : 'Visita';
  const cliente = v.leads?.nombre || v.perfiles?.nombre || '';
  const inm = v.inmuebles?.titulo || v.inmuebles?.ref || '';
  const parts = [`[NH] ${tipoLabel}`];
  if (cliente) parts.push(cliente);
  if (inm) parts.push(inm);
  return parts.join(' — ').slice(0, 200);
}

async function patchVisitaNotas(id, notas) {
  const res = await fetch(`${SB_URL}/rest/v1/visitas?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: svcHeaders(),
    body: JSON.stringify({ notas }),
  });
  return res.ok;
}

async function fetchVisitasInSyncWindow() {
  const { daysBack, daysAhead } = getCalendarSyncWindow();
  const now = Date.now();
  const min = new Date(now - daysBack * 86400000).toISOString();
  const max = new Date(now + daysAhead * 86400000).toISOString();
  const q = `${SB_URL}/rest/v1/visitas?fecha_hora=gte.${encodeURIComponent(min)}&fecha_hora=lte.${encodeURIComponent(max)}&select=${encodeURIComponent(VISITA_SELECT)}&order=fecha_hora.asc&limit=1000`;
  const res = await fetch(q, { headers: svcHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  return data || [];
}

const MAX_EXPORT_TO_GCAL_PER_SYNC = 50;

/** Visitas en Supabase (hoy, semana, meses) → Google Calendar si aún no tienen [gcal:…]. */
async function syncDbVisitasToGoogleCalendar() {
  const rows = await fetchVisitasInSyncWindow();
  const pending = rows.filter((v) => v.fecha_hora && !hasGcalMarker(v.notas) && v.estado !== 'cancelada');
  const now = Date.now();
  pending.sort((a, b) => {
    const ta = new Date(a.fecha_hora).getTime();
    const tb = new Date(b.fecha_hora).getTime();
    const aFuture = ta >= now;
    const bFuture = tb >= now;
    if (aFuture !== bFuture) return aFuture ? -1 : 1;
    return Math.abs(ta - now) - Math.abs(tb - now);
  });

  let exported = 0;
  let errors = 0;
  for (const v of pending.slice(0, MAX_EXPORT_TO_GCAL_PER_SYNC)) {
    const summary = visitaSummaryFromRow(v);
    const description = [v.notas || '', v.leads?.telefono ? `Tel: ${v.leads.telefono}` : '', v.leads?.email ? `Email: ${v.leads.email}` : '']
      .filter(Boolean)
      .join('\n');
    const created = await createPanelVisitaCalendarEvent({
      summary,
      description,
      startIso: v.fecha_hora,
    });
    if (created.ok && created.id) {
      let notas = `${gcalMarker(created.id)} ${v.notas || summary}`.trim();
      if (created.htmlLink && !notas.includes(created.htmlLink)) {
        notas = `${notas}\n${created.htmlLink}`.trim();
      }
      if (await patchVisitaNotas(v.id, notas)) exported += 1;
    } else if (!created.skipped) {
      errors += 1;
      console.warn('syncDbVisitasToGoogleCalendar', v.id, created.error || created.reason);
    }
  }
  return { exported, pending: pending.length, errors };
}

export async function listVisitasAdminServer({ syncCalendar = true } = {}) {
  const sync = {
    configured: isGoogleCalendarConfigured(),
    daysBack: getCalendarSyncWindow().daysBack,
    daysAhead: getCalendarSyncWindow().daysAhead,
    eventsFromGoogle: 0,
    insertedFromGoogle: 0,
    exportedToGoogle: 0,
    pendingExport: 0,
    error: null,
  };

  if (syncCalendar) {
    if (!sync.configured) {
      sync.error = 'Faltan GOOGLE_REFRESH_TOKEN (o cuenta de servicio) en Vercel';
    } else {
      try {
        const raw = await listTeamCalendarEvents();
        sync.eventsFromGoogle = raw.length;
        const deduped = dedupeCalendarEvents(raw);
        sync.insertedFromGoogle = await syncGoogleEventsToDb(deduped);
        const out = await syncDbVisitasToGoogleCalendar();
        sync.exportedToGoogle = out.exported;
        sync.pendingExport = Math.max(0, out.pending - out.exported);
      } catch (err) {
        sync.error = err.message;
        console.warn('listVisitasAdminServer sync', err.message);
      }
    }
  }

  const { daysBack, daysAhead } = getCalendarSyncWindow();
  const now = Date.now();
  const min = new Date(now - daysBack * 86400000).toISOString();
  const max = new Date(now + daysAhead * 86400000).toISOString();
  const res = await fetch(
    `${SB_URL}/rest/v1/visitas?fecha_hora=gte.${encodeURIComponent(min)}&fecha_hora=lte.${encodeURIComponent(max)}&select=${encodeURIComponent(VISITA_SELECT)}&order=fecha_hora.desc&limit=1000`,
    { headers: svcHeaders() }
  );
  if (!res.ok) {
    const err = await res.text();
    console.error('listVisitasAdminServer', res.status, err);
    const fallback = await fetch(
      `${SB_URL}/rest/v1/visitas?select=id,estado,fecha_hora,notas,tipo_solicitud,inmueble_id,perfil_id&order=fecha_hora.desc&limit=500`,
      { headers: svcHeaders() }
    );
    if (!fallback.ok) return { data: [], error: err, sync };
    return { data: await fallback.json(), schemaFallback: true, sync };
  }
  const data = await res.json();
  return { data: data || [], sync };
}
