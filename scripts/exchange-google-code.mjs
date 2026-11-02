/**
 * Intercambia ?code= del OAuth Playground / redirect y guarda en producción.
 * GOOGLE_OAUTH_CODE=... node scripts/exchange-google-code.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLIENT_ID =
  '311723462282-lva0ig636e0387g12b1r51in9fceoru2.apps.googleusercontent.com';
const REDIRECT = process.env.GOOGLE_OAUTH_REDIRECT || 'https://developers.google.com/oauthplayground';
const code = process.env.GOOGLE_OAUTH_CODE;

function loadEnvLocal() {
  const p = join(root, '.env.local');
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

const secret = process.env.GOOGLE_CLIENT_SECRET;
const captadorEnv = join(root, '..', 'Captador', '.env');
let apiKey = process.env.NH_PANEL_API_KEY;
if (!apiKey && existsSync(captadorEnv)) {
  const m = readFileSync(captadorEnv, 'utf8').match(/^NH_PANEL_API_KEY=(.+)$/m);
  if (m) apiKey = m[1].trim().replace(/^["']|["']$/g, '');
}

if (!code || !secret || !apiKey) {
  console.error('Necesitas GOOGLE_OAUTH_CODE, GOOGLE_CLIENT_SECRET (.env.local), NH_PANEL_API_KEY');
  process.exit(1);
}

const tok = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: secret,
    redirect_uri: REDIRECT,
    grant_type: 'authorization_code',
  }),
}).then((r) => r.json());

if (!tok.refresh_token) {
  console.error('Sin refresh_token:', tok);
  process.exit(1);
}

const save = await fetch('https://www.nuevahabitat.com/api/notify?__action=admin-google-calendar-save', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    clientSecret: secret,
    refreshToken: tok.refresh_token,
    calendarId: 'admin.nuevahabitat@gmail.com',
  }),
}).then((r) => r.json());

console.log(JSON.stringify(save, null, 2));
if (!save.ok) process.exit(1);

const visitas = await fetch('https://www.nuevahabitat.com/api/notify?__action=admin-visitas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({ syncCalendar: true }),
}).then((r) => r.json());

console.log('sync', visitas.sync?.error || 'ok', 'rows', visitas.data?.length);
