/**
 * Guarda OAuth Calendar en Supabase (producción) vía API panel + NH_PANEL_API_KEY.
 * Lee clave desde NH_PANEL_API_KEY o ../Captador/.env
 *
 * node scripts/seed-google-calendar-production.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadCaptadorKey() {
  const p = join(root, '..', 'Captador', '.env');
  if (!existsSync(p)) return '';
  const m = readFileSync(p, 'utf8').match(/^NH_PANEL_API_KEY=(.+)$/m);
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
}

const API_KEY = process.env.NH_PANEL_API_KEY || loadCaptadorKey();
const BASE = process.env.NH_SITE_URL || 'https://www.nuevahabitat.com';

const clientSecret =
  process.env.GOOGLE_CLIENT_SECRET || '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';
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const calendarId = process.env.GOOGLE_CALENDAR_ID || 'admin.nuevahabitat@gmail.com';

if (!API_KEY) {
  console.error('Falta NH_PANEL_API_KEY (env o Captador/.env)');
  process.exit(1);
}
if (!refreshToken) {
  console.error('Falta GOOGLE_REFRESH_TOKEN en env');
  process.exit(1);
}

async function post(action, body) {
  const res = await fetch(`${BASE}/api/notify?__action=${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

const save = await post('admin-google-calendar-save', {
  clientSecret,
  refreshToken,
  calendarId,
});
console.log('save', save.status, JSON.stringify(save.json, null, 2));
if (!save.json?.ok) process.exit(1);

const visitas = await post('admin-visitas', { syncCalendar: true });
console.log(
  'visitas',
  visitas.status,
  'rows',
  visitas.json?.data?.length,
  'sync',
  JSON.stringify(visitas.json?.sync)
);
