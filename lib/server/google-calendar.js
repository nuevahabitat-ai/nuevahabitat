/**
 * Google Calendar — OAuth (refresh token) o cuenta de servicio.
 * Crea eventos con invitaciones a cliente + equipo NH.
 */
import crypto from 'crypto';

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin.nuevahabitat@gmail.com';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || process.env.INFO_EMAIL || 'info@nuevahabitat.com';
const DANIEL_EMAIL = process.env.DANIEL_EMAIL || 'daniel@nuevahabitat.com';
const JUAN_EMAIL = process.env.JUAN_EMAIL || 'juan@nuevahabitat.com';

/** Calendarios donde debe aparecer cada visita / disponibilidad del equipo. */
export function getTeamCalendarIds() {
  const ids = [
    process.env.GOOGLE_CALENDAR_ID || ADMIN_EMAIL,
    process.env.GOOGLE_CALENDAR_ID_INFO || CONTACT_EMAIL,
    process.env.GOOGLE_CALENDAR_ID_DANIEL || DANIEL_EMAIL,
    process.env.GOOGLE_CALENDAR_ID_JUAN || JUAN_EMAIL,
  ];
  return uniqueEmails(ids);
}

export function getTeamAttendeeEmails() {
  return uniqueEmails([ADMIN_EMAIL, CONTACT_EMAIL, DANIEL_EMAIL, JUAN_EMAIL]);
}

function b64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function envTrim(name) {
  let v = String(process.env[name] || '').trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

function parseServiceAccountCredentials() {
  const raw = envTrim('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function getAccessTokenFromServiceAccount(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: credentials.client_email,
    scope: CALENDAR_SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  }));
  const signInput = `${header}.${claim}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(signInput)
    .sign(credentials.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const jwt = `${signInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(data.error_description || data.error || 'No access token (service account)');
  }
  return data.access_token;
}

/** OAuth refresh token — alternativa si Google bloquea claves de cuenta de servicio */
async function getAccessTokenFromOAuth() {
  const clientId = envTrim('GOOGLE_CLIENT_ID');
  const clientSecret = envTrim('GOOGLE_CLIENT_SECRET');
  const refreshToken = envTrim('GOOGLE_REFRESH_TOKEN');
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(data.error_description || data.error || 'No access token (OAuth)');
  }
  return data.access_token;
}

async function getAccessToken() {
  const oauthToken = await getAccessTokenFromOAuth().catch(() => null);
  if (oauthToken) return oauthToken;

  const credentials = parseServiceAccountCredentials();
  if (credentials) return getAccessTokenFromServiceAccount(credentials);

  return null;
}

function uniqueEmails(list) {
  const seen = new Set();
  return list
    .map((e) => String(e || '').trim().toLowerCase())
    .filter((e) => {
      if (!e || !e.includes('@') || seen.has(e)) return false;
      seen.add(e);
      return true;
    });
}

async function insertEvent(accessToken, calendarId, event) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `Google Calendar HTTP ${res.status}`);
  }
  return data;
}

async function listCalendarEvents(accessToken, calendarId, { timeMin, timeMax, maxResults = 250 }) {
  const all = [];
  let pageToken;
  let pages = 0;
  do {
    const params = new URLSearchParams({
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: String(maxResults),
      timeMin,
      timeMax,
    });
    if (pageToken) params.set('pageToken', pageToken);
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || `Google list events HTTP ${res.status}`);
    }
    all.push(...(data.items || []).map((ev) => ({ ...ev, _calendarId: calendarId })));
    pageToken = data.nextPageToken;
    pages += 1;
  } while (pageToken && pages < 12 && all.length < 3000);
  return all;
}

export function getGoogleCalendarConfigStatus() {
  const saRaw = envTrim('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (saRaw) {
    try {
      JSON.parse(saRaw);
      return { configured: true, mode: 'service_account', missing: [] };
    } catch {
      return {
        configured: false,
        mode: 'service_account',
        missing: ['GOOGLE_SERVICE_ACCOUNT_JSON (JSON inválido)'],
      };
    }
  }
  const missing = [];
  if (!envTrim('GOOGLE_CLIENT_ID')) missing.push('GOOGLE_CLIENT_ID');
  if (!envTrim('GOOGLE_CLIENT_SECRET')) missing.push('GOOGLE_CLIENT_SECRET');
  if (!envTrim('GOOGLE_REFRESH_TOKEN')) missing.push('GOOGLE_REFRESH_TOKEN');
  return { configured: missing.length === 0, mode: 'oauth', missing };
}

export function isGoogleCalendarConfigured() {
  return getGoogleCalendarConfigStatus().configured;
}

/** Comprueba variables en Vercel y que el refresh token / SA obtenga access token. */
export async function verifyGoogleCalendarConnection() {
  const status = getGoogleCalendarConfigStatus();
  if (!status.configured) {
    return {
      ok: false,
      status,
      error: `Faltan en Vercel (Production): ${status.missing.join(', ')}`,
    };
  }
  if (status.mode === 'service_account') {
    try {
      const credentials = parseServiceAccountCredentials();
      if (!credentials) throw new Error('JSON de cuenta de servicio inválido');
      await getAccessTokenFromServiceAccount(credentials);
      return { ok: true, status };
    } catch (err) {
      return { ok: false, status, error: err.message || String(err) };
    }
  }
  const clientId = envTrim('GOOGLE_CLIENT_ID');
  const clientSecret = envTrim('GOOGLE_CLIENT_SECRET');
  const refreshToken = envTrim('GOOGLE_REFRESH_TOKEN');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    const msg = data.error_description || data.error || 'No access token (OAuth)';
    let hint = '';
    if (data.error === 'invalid_grant') {
      hint =
        ' Regenera GOOGLE_REFRESH_TOKEN con OAuth Playground (scope calendar), mismo Client ID/Secret que en Vercel, sesión admin.nuevahabitat@gmail.com.';
    } else if (data.error === 'invalid_client') {
      hint = ' Revisa GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET (cliente OAuth «nuevahabitat», tipo Web).';
    }
    return { ok: false, status, error: `${msg}.${hint}` };
  }
  return { ok: true, status };
}

/** Ventana de sync panel ↔ Google Calendar (hoy, semana y meses atrás/adelante). */
export function getCalendarSyncWindow() {
  const daysBack = Math.max(7, parseInt(process.env.GOOGLE_CALENDAR_SYNC_DAYS_BACK || '180', 10) || 180);
  const daysAhead = Math.max(7, parseInt(process.env.GOOGLE_CALENDAR_SYNC_DAYS_AHEAD || '120', 10) || 120);
  return { daysBack, daysAhead };
}

function calendarEventHasStart(ev) {
  return !!(ev?.start?.dateTime || ev?.start?.date);
}

/** Eventos de los calendarios del equipo (visitas programadas). */
export async function listTeamCalendarEvents(windowOpts = {}) {
  const { daysBack, daysAhead } = { ...getCalendarSyncWindow(), ...windowOpts };
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  const now = Date.now();
  const timeMin = new Date(now - daysBack * 86400000).toISOString();
  const timeMax = new Date(now + daysAhead * 86400000).toISOString();

  const all = [];
  for (const calId of getTeamCalendarIds()) {
    try {
      const items = await listCalendarEvents(accessToken, calId, { timeMin, timeMax });
      all.push(...items.filter(calendarEventHasStart));
    } catch (err) {
      console.warn('listTeamCalendarEvents', calId, err.message);
    }
  }
  return all;
}

/** Crea una cita en el calendario principal del admin (visitas del panel sin marcador gcal). */
export async function createPanelVisitaCalendarEvent({
  summary,
  description,
  startIso,
  durationMinutes = 60,
  timeZone = 'Europe/Madrid',
}) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return {
      ok: false,
      skipped: true,
      reason: 'Configura GOOGLE_REFRESH_TOKEN (+ CLIENT_ID/SECRET) o GOOGLE_SERVICE_ACCOUNT_JSON',
    };
  }
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return { ok: false, error: 'fecha_hora inválida' };
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const calId = process.env.GOOGLE_CALENDAR_ID || ADMIN_EMAIL;
  const event = {
    summary: (summary || '[NH] Visita').slice(0, 200),
    description: description || '',
    start: { dateTime: start.toISOString(), timeZone },
    end: { dateTime: end.toISOString(), timeZone },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 60 },
      ],
    },
  };
  try {
    const created = await insertEvent(accessToken, calId, event);
    return { ok: true, id: created.id, htmlLink: created.htmlLink, calendarId: calId };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/** Misma cita copiada en varios calendarios → una sola fila en el panel. */
export function dedupeCalendarEvents(events) {
  const byKey = new Map();
  for (const ev of events || []) {
    if (!ev?.id || ev.status === 'cancelled') continue;
    const start = ev.start?.dateTime || ev.start?.date || '';
    const summary = String(ev.summary || '')
      .replace(/\s*\(copia equipo\)\s*/gi, '')
      .trim()
      .toLowerCase();
    const key = `${start}|${summary}`;
    if (!byKey.has(key)) byKey.set(key, ev);
  }
  return [...byKey.values()];
}

/**
 * Crea cita(s) de disponibilidad en Google Calendar.
 * @returns {{ ok: boolean, skipped?: boolean, events?: object[], error?: string }}
 */
export async function createAvailabilityEvents({
  nombre,
  email,
  telefono,
  mensaje,
  extra,
  calendar,
}) {
  if (!calendar?.start || !calendar?.end) {
    return { ok: true, skipped: true, reason: 'sin fechas de calendario' };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return {
      ok: true,
      skipped: true,
      reason: 'Configura GOOGLE_REFRESH_TOKEN (+ CLIENT_ID/SECRET) o GOOGLE_SERVICE_ACCOUNT_JSON',
    };
  }

  const timeZone = calendar.timeZone || 'Europe/Madrid';
  const esVendedor = extra?.rol === 'vendedor';
  const rolLabel = esVendedor ? 'Vendedor' : 'Comprador';
  const summary = `[NH] Disponibilidad ${rolLabel} — ${nombre || 'Cliente'}`;
  const description = [
    mensaje || '',
    telefono ? `Tel: ${telefono}` : '',
    email ? `Email: ${email}` : '',
    'Registrado desde panel NuevaHabitat.',
  ].filter(Boolean).join('\n');

  const attendees = uniqueEmails([email, ...getTeamAttendeeEmails()]).map((e) => ({ email: e }));

  const event = {
    summary,
    description,
    start: { dateTime: calendar.start, timeZone },
    end: { dateTime: calendar.end, timeZone },
    attendees,
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 60 },
      ],
    },
  };

  const calendarIds = getTeamCalendarIds();
  const events = [];
  let first = true;
  for (const calId of calendarIds) {
    try {
      const payload = first
        ? event
        : { ...event, summary: `${summary} (copia equipo)` };
      events.push(await insertEvent(accessToken, calId, payload));
      first = false;
    } catch (err) {
      console.warn('google-calendar', calId, err.message);
    }
  }

  return { ok: true, events: events.map((e) => ({ id: e.id, htmlLink: e.htmlLink })) };
}
