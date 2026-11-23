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

const { runSyncPresupuestoCompradores } = await import('../lib/server/sync-presupuesto-compradores.js');

const result = await runSyncPresupuestoCompradores({
  dryRun,
  all: true,
  maxScrape: 80,
  limit: 500,
});
console.log(JSON.stringify(result, null, 2));
