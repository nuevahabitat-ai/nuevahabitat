#!/usr/bin/env node
/**
 * Importa export Idealista (CSV o Excel) contra Supabase vía lib local.
 * Requiere en env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (o las de Vercel en .env.local).
 *
 * Uso:
 *   node scripts/import-idealista-compradores-cli.js "C:\ruta\contactos.csv"
 *   node scripts/import-idealista-compradores-cli.js --dry-run "contactos.xls"
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function loadEnvFile() {
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

function parseCsv(text) {
  const raw = text.replace(/^\uFEFF/, '');
  const semi = (raw.slice(0, 800).match(/;/g) || []).length;
  const comma = (raw.slice(0, 800).match(/,/g) || []).length;
  const sep = semi >= comma ? ';' : ',';
  const matrix = [];
  let row = [];
  let cell = '';
  let q = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === '"') {
      if (q && raw[i + 1] === '"') { cell += '"'; i++; }
      else q = !q;
    } else if (c === sep && !q) {
      row.push(cell.trim());
      cell = '';
    } else if ((c === '\n' || c === '\r') && !q) {
      if (c === '\r' && raw[i + 1] === '\n') i++;
      row.push(cell.trim());
      cell = '';
      if (row.some((x) => x !== '')) matrix.push(row);
      row = [];
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell.trim());
    if (row.some((x) => x !== '')) matrix.push(row);
  }
  if (!matrix.length) return [];
  const headers = matrix[0];
  return matrix.slice(1).map((cells) => {
    const o = {};
    headers.forEach((h, j) => { o[h] = cells[j] != null ? cells[j] : ''; });
    return o;
  });
}

async function readRows(filePath) {
  const low = filePath.toLowerCase();
  if (low.endsWith('.csv') || low.endsWith('.txt')) {
    return parseCsv(fs.readFileSync(filePath, 'utf8'));
  }
  let XLSX;
  try {
    XLSX = await import('xlsx');
  } catch {
    console.error('Para .xls/.xlsx instala una vez: npm install xlsx');
    console.error('O exporta el fichero a CSV desde Excel (delimitador ;).');
    process.exit(1);
  }
  const wb = XLSX.read(fs.readFileSync(filePath), { type: 'buffer' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

async function main() {
  loadEnvFile();
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run');
  const file = argv.filter((a) => !a.startsWith('--'))[0];
  if (!file || !fs.existsSync(file)) {
    console.error('Uso: node scripts/import-idealista-compradores-cli.js [--dry-run] ruta.csv|.xls|.xlsx');
    process.exit(1);
  }
  const rows = await readRows(path.resolve(file));
  const conTel = rows.filter((r) => String(r['TELÉFONO'] || r.TELEFONO || '').replace(/\D/g, '').length >= 9);
  console.log(`Filas: ${rows.length}, con teléfono: ${conTel.length}`);
  if (dryRun) {
    console.log('Dry-run — no se escribe en Supabase.');
    process.exit(0);
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_KEY) {
    console.error('Falta SUPABASE_SERVICE_ROLE_KEY en env o .env.local');
    process.exit(1);
  }
  const { importIdealistaCompradores } = await import('../lib/server/idealista-compradores-import.js');
  const result = await importIdealistaCompradores(rows);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
