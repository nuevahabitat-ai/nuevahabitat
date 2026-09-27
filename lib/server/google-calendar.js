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

function parseServiceAccountCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
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
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
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
  const params = new URLSearchParams({
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: String(maxResults),
    timeMin,
    timeMax,
  });
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `Google list events HTTP ${res.status}`);
  }
  return (data.items || []).map((ev) => ({ ...ev, _calendarId: calendarId }));
}

/** Eventos de los calendarios del equipo (visitas programadas). */
export async function listTeamCalendarEvents({
  daysBack = 30,
  daysAhead = 120,
} = {}) {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  const now = Date.now();
  const timeMin = new Date(now - daysBack * 86400000).toISOString();
  const timeMax = new Date(now + daysAhead * 86400000).toISOString();

  const all = [];
  for (const calId of getTeamCalendarIds()) {
    try {
      const items = await listCalendarEvents(accessToken, calId, { timeMin, timeMax });
      all.push(...items.filter((ev) => ev.start?.dateTime));
    } catch (err) {
      console.warn('listTeamCalendarEvents', calId, err.message);
    }
  }
  return all;
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
