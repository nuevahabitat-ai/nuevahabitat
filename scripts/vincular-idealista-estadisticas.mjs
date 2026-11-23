#!/usr/bin/env node
/**
 * CLI: vincular IDs Idealista del export estadísticas a inmuebles NH.
 * Requiere .env.local con SUPABASE_SERVICE_ROLE_KEY y NEXT_PUBLIC_SUPABASE_URL (o SB_URL).
 */
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

const dryRun = process.argv.includes('--dry-run');
const { autoLinkIdealistaInmuebles } = await import('../lib/server/link-idealista-inmuebles.js');
const result = await autoLinkIdealistaInmuebles({ dryRun });
console.log(JSON.stringify(result, null, 2));
if (!dryRun && result.vinculados > 0) {
  const { backfillPresupuestoByIdealistaIds } = await import('../lib/server/comprador-presupuesto-idealista-id.js');
  const pres = await backfillPresupuestoByIdealistaIds({ limit: 500, maxScrape: 80 });
  console.log('presupuesto_compradores', JSON.stringify(pres, null, 2));
}