/**
 * OAuth Google Calendar (handler compartido; ruta pública vía /api/notify?__action=google-calendar-oauth).
 */
import {
  saveGoogleCalendarIntegration,
  getIntegrationSecret,
  defaultGoogleClientId,
} from './integration-secrets.js';
import { verifyGoogleCalendarConnection } from './google-calendar.js';

const CLIENT_ID = defaultGoogleClientId();
const REDIRECT_URI = 'https://www.nuevahabitat.com/api/google-calendar-oauth';
const SCOPE = 'https://www.googleapis.com/auth/calendar';
const CALENDAR_ID = 'admin.nuevahabitat@gmail.com';

async function clientSecret() {
  const fromEnv = String(process.env.GOOGLE_CLIENT_SECRET || '').trim();
  if (fromEnv) return fromEnv;
  return getIntegrationSecret('GOOGLE_CLIENT_SECRET');
}

function authUrl() {
  const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  u.searchParams.set('client_id', CLIENT_ID);
  u.searchParams.set('redirect_uri', REDIRECT_URI);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', SCOPE);
  u.searchParams.set('access_type', 'offline');
  u.searchParams.set('prompt', 'consent');
  return u.toString();
}

async function exchangeCode(code) {
  const secret = await clientSecret();
  if (!secret) throw new Error('Falta GOOGLE_CLIENT_SECRET (Vercel o Supabase)');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: secret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  return res.json();
}

export default async function handleGoogleCalendarOAuth(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'GET only' });
  }

  const code = String(req.query?.code || '').trim();
  const err = String(req.query?.error || '').trim();

  if (!code) {
    if (err) {
      return res.redirect(
        302,
        `/admin-panel?gcal_error=${encodeURIComponent(err)}#visitas`
      );
    }
    if (!(await clientSecret())) {
      return res.status(503).send(
        'Falta GOOGLE_CLIENT_SECRET (Vercel o panel). Redirect URI en Google Cloud: ' +
          REDIRECT_URI
      );
    }
    return res.redirect(302, authUrl());
  }

  try {
    const tokens = await exchangeCode(code);
    if (!tokens.refresh_token) {
      const msg =
        tokens.error_description ||
        tokens.error ||
        'Sin refresh_token (revoca acceso en Google Account y repite con prompt=consent)';
      return res.redirect(302, `/admin-panel?gcal_error=${encodeURIComponent(msg)}#visitas`);
    }
    const secret = await clientSecret();
    const saved = await saveGoogleCalendarIntegration({
      clientId: CLIENT_ID,
      clientSecret: secret,
      refreshToken: tokens.refresh_token,
      calendarId: CALENDAR_ID,
    });
    if (!saved.ok) {
      return res.redirect(
        302,
        `/admin-panel?gcal_error=${encodeURIComponent(saved.error || 'save failed')}#visitas`
      );
    }
    const auth = await verifyGoogleCalendarConnection();
    const q = auth.ok ? 'gcal_ok=1' : `gcal_error=${encodeURIComponent(auth.error || 'verify failed')}`;
    return res.redirect(302, `/admin-panel?${q}#visitas`);
  } catch (e) {
    return res.redirect(
      302,
      `/admin-panel?gcal_error=${encodeURIComponent(e.message || String(e))}#visitas`
    );
  }
}
