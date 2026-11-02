/**
 * Genera refresh token y opcionalmente lo guarda en Supabase (private_integrations).
 *
 * 1. Añade en Google Cloud redirect: http://127.0.0.1:8787/callback
 * 2. Crea .env.local con GOOGLE_CLIENT_SECRET y SUPABASE_SERVICE_ROLE_KEY
 * 3. node scripts/google-calendar-oauth-setup.mjs
 */
import http from 'http';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env.local');

function loadEnvFile() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    process.env[m[1]] = v;
  }
}

loadEnvFile();

const CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  '311723462282-iva0ig636e0387g12b1r51in9fceoru2.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SB_URL = process.env.SUPABASE_URL || 'https://xxodawayoogthxnjpouq.supabase.co';
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
const REDIRECT = 'http://127.0.0.1:8787/callback';
const SCOPE = 'https://www.googleapis.com/auth/calendar';
const PORT = 8787;

if (!CLIENT_SECRET) {
  console.error('Falta GOOGLE_CLIENT_SECRET en .env.local');
  process.exit(1);
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPE);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

async function exchangeCode(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT,
      grant_type: 'authorization_code',
    }),
  });
  return res.json();
}

async function saveToSupabase(refreshToken) {
  if (!SB_SERVICE) {
    console.log('\nSin SUPABASE_SERVICE_ROLE_KEY — copia GOOGLE_REFRESH_TOKEN a Vercel manualmente.\n');
    return;
  }
  const rows = [
    { key: 'google_client_id', value: CLIENT_ID },
    { key: 'google_client_secret', value: CLIENT_SECRET },
    { key: 'google_refresh_token', value: refreshToken },
    { key: 'google_calendar_id', value: process.env.GOOGLE_CALENDAR_ID || 'admin.nuevahabitat@gmail.com' },
  ];
  for (const row of rows) {
    const res = await fetch(`${SB_URL}/rest/v1/private_integrations?on_conflict=key`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SB_SERVICE}`,
        apikey: SB_SERVICE,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({ ...row, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) {
      const err = await res.text();
      if (/42P01|does not exist/i.test(err)) {
        console.error('\nEjecuta supabase/migrations/062_private_integrations.sql primero.\n');
      } else {
        console.error('Supabase save failed:', err);
      }
      process.exit(1);
    }
  }
  console.log('\n✓ Credenciales guardadas en Supabase (private_integrations). El panel puede sincronizar sin Vercel.\n');
}

console.log('\nAbre en el navegador (cuenta admin.nuevahabitat@gmail.com):\n');
console.log(authUrl.toString());
console.log('\nEsperando callback en', REDIRECT, '...\n');

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith('/callback')) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const code = url.searchParams.get('code');
  const err = url.searchParams.get('error');
  if (err || !code) {
    res.writeHead(400);
    res.end('Error OAuth: ' + (err || 'sin code'));
    server.close();
    process.exit(1);
  }
  const tokens = await exchangeCode(code);
  if (!tokens.refresh_token) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<p>Sin refresh_token. Revoca acceso en Google Account y repite con prompt=consent.</p>');
    console.error('Respuesta:', tokens);
    server.close();
    process.exit(1);
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<p>OK — puedes cerrar esta pestaña.</p>');
  console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
  await saveToSupabase(tokens.refresh_token);
  server.close();
  process.exit(0);
});

server.listen(PORT, '127.0.0.1');
