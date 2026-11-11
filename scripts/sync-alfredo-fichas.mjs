#!/usr/bin/env node
/**
 * Sincroniza cuestionarios Alfredo → fichas compradores (campos + notas).
 *
 *   node scripts/sync-alfredo-fichas.mjs --xlsx "D:\Proyectos\Captador\fichas-compradores-noviembre-2026.xlsx"
 *   node scripts/sync-alfredo-fichas.mjs --all
 *   node scripts/sync-alfredo-fichas.mjs --xlsx ... --dry-run
 *
 * Requiere SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY en .env.local
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    const p = path.join(ROOT, name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    }
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { dryRun: false, all: false, xlsx: null, sheets: ['1-Con respuesta', '3-Solo lo que falta'] };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') opts.dryRun = true;
    else if (args[i] === '--all') opts.all = true;
    else if (args[i] === '--xlsx' && args[i + 1]) opts.xlsx = args[++i];
    else if (args[i] === '--sheets' && args[i + 1]) opts.sheets = args[++i].split(',');
  }
  return opts;
}

async function readXlsxSheets(filePath, sheetNames) {
  let XLSX;
  try {
    XLSX = await import('xlsx');
  } catch {
    console.error('npm install xlsx');
    process.exit(1);
  }
  const wb = XLSX.read(fs.readFileSync(filePath), { type: 'buffer' });
  const rows = [];
  for (const name of sheetNames) {
    if (!wb.Sheets[name]) continue;
    rows.push(...XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: '' }));
  }
  return rows;
}

loadEnv();

const opts = parseArgs();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const { enrichFromExcelRows, enrichAllCompradoresFromNotas } = await import(
  '../lib/server/alfredo-ficha-enrich.js'
);

const enrichOpts = { dryRun: opts.dryRun };

if (opts.all) {
  console.log('Enriqueciendo todos los compradores desde notas + interés…', enrichOpts);
  const stats = await enrichAllCompradoresFromNotas(enrichOpts);
  console.log(JSON.stringify(stats, null, 2));
  process.exit(stats.errors?.length ? 1 : 0);
}

const xlsx =
  opts.xlsx ||
  'D:\\Proyectos\\Captador\\fichas-compradores-noviembre-2026.xlsx';

if (!fs.existsSync(xlsx)) {
  console.error('No existe:', xlsx);
  process.exit(1);
}

const rows = await readXlsxSheets(xlsx, opts.sheets);
console.log(`Filas ${rows.length} desde ${path.basename(xlsx)} (${opts.sheets.join(', ')})`);
const stats = await enrichFromExcelRows(rows, enrichOpts);
console.log(JSON.stringify(stats, null, 2));
