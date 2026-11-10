#!/usr/bin/env node
/**
 * Convierte export Idealista .xls/.xlsx a CSV (;) listo para importar.
 * Uso: node scripts/xls-to-csv-idealista.js "C:\Users\...\retert.xls"
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function esc(v) {
  const s = v == null ? '' : String(v);
  if (/[;"\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  const inPath = process.argv[2];
  if (!inPath || !fs.existsSync(inPath)) {
    console.error('Uso: node scripts/xls-to-csv-idealista.js entrada.xls [salida.csv]');
    process.exit(1);
  }
  let XLSX;
  try {
    XLSX = await import('xlsx');
  } catch {
    console.error('Ejecuta primero: npm install xlsx');
    process.exit(1);
  }
  const wb = XLSX.read(fs.readFileSync(inPath), { type: 'buffer' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const outPath = process.argv[3] || inPath.replace(/\.xlsx?$/i, '') + '-idealista.csv';
  const csv = XLSX.utils.sheet_to_csv(sheet, { FS: ';' });
  fs.writeFileSync(outPath, '\uFEFF' + csv, 'utf8');
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  console.log(`OK: ${rows.length} filas → ${path.resolve(outPath)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
