#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['.env.local', '.env']) {
  const p = path.join(root, name);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
}
const captador = path.join(root, '..', 'Captador', '.env');
function pickServiceRole() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE ||
    process.env.NH_SUPABASE_SERVICE_KEY
  );
}
if (!pickServiceRole() && fs.existsSync(captador)) {
  const raw = fs.readFileSync(captador, 'utf8');
  const m = raw.match(/^NH_SUPABASE_SERVICE_KEY="?([^"\r\n]+)"?/m);
  if (m?.[1]?.length > 20) process.env.SUPABASE_SERVICE_ROLE_KEY = m[1];
  const u = raw.match(/^NH_SUPABASE_URL="?([^"\r\n]+)"?/m);
  if (u?.[1]) process.env.SUPABASE_URL = u[1];
  if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://xxodawayoogthxnjpouq.supabase.co';
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = pickServiceRole();
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Sin SUPABASE_SERVICE_ROLE_KEY — define en .env.local o ejecuta: python scripts/run-infer-from-vps-env.py --write-env',
  );
  process.exit(1);
}

const dryRun = process.argv.includes('--dry-run');
const { inferAllCompradoresCriterios } = await import('../lib/server/comprador-infer-criterios.js');
const stats = await inferAllCompradoresCriterios({ dryRun, limit: 500 });
console.log(JSON.stringify(stats, null, 2));
