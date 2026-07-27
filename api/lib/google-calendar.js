/**
 * Google Calendar — OAuth (refresh token) o cuenta de servicio.
 * Crea eventos con invitaciones a cliente + equipo NH.
 */
import crypto from 'crypto';

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin.nuevahabitat@gmail.com';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || process.env.INFO_EMAIL || 'info@nuevahabitat.com';

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

  const attendees = uniqueEmails([email, ADMIN_EMAIL, CONTACT_EMAIL]).map((e) => ({ email: e }));

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

  const primaryCalendarId = process.env.GOOGLE_CALENDAR_ID || ADMIN_EMAIL;
  const secondaryCalendarId = process.env.GOOGLE_CALENDAR_ID_INFO || CONTACT_EMAIL;

  const events = [];
  events.push(await insertEvent(accessToken, primaryCalendarId, event));

  if (secondaryCalendarId && secondaryCalendarId.toLowerCase() !== primaryCalendarId.toLowerCase()) {
    try {
      events.push(await insertEvent(accessToken, secondaryCalendarId, {
        ...event,
        summary: `${summary} (copia equipo)`,
      }));
    } catch (err) {
      console.warn('google-calendar secondary:', err.message);
    }
  }

  return { ok: true, events: events.map((e) => ({ id: e.id, htmlLink: e.htmlLink })) };
}
