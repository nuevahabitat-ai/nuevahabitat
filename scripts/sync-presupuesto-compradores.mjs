#!/usr/bin/env node
/**
 * Rellena presupuesto_max (pisos Idealista / notas / interés).
 * 1) Backfill comprador_inmueble_interes desde notas
 * 2) Inferencia (scrape Idealista si hace falta)
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
const all = process.argv.includes('--all');

const { backfillInteresFromCompradorNotas } = await import('../lib/server/idealista-interes-backfill.js');
const { inferAllCompradoresCriterios } = await import('../lib/server/comprador-infer-criterios.js');

console.log('Backfill interés desde notas…');
const bf = await backfillInteresFromCompradorNotas({});
console.log(JSON.stringify({ backfill: bf }, null, 2));

const stats = await inferAllCompradoresCriterios({
  dryRun,
  onlySinPresupuesto: !all,
  limit: 500,
});
console.log(JSON.stringify({ inferencia: stats }, null, 2));
