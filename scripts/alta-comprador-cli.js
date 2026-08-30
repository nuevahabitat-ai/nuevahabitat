#!/usr/bin/env node
/**
 * Alta de comprador vía API producción (Claude Cowork / terminal local).
 * Lee NH_PANEL_API_KEY de env o .nh-panel-api-key.local en la raíz del repo.
 *
 * Uso:
 *   node scripts/alta-comprador-cli.js --nombre "Ana López" --telefono 612345678 --zona Eixample --presupuesto 250000
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const API = process.env.NH_PANEL_API_URL || 'https://www.nuevahabitat.com/api/compradores';

function readKey() {
  if (process.env.NH_PANEL_API_KEY) return process.env.NH_PANEL_API_KEY.trim();
  const p = path.join(ROOT, '.nh-panel-api-key.local');
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim();
  console.error('Falta NH_PANEL_API_KEY (env o .nh-panel-api-key.local)');
  process.exit(1);
}

function parseArgs() {
  const out = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i + 1];
      if (v && !v.startsWith('--')) { out[k] = v; i++; }
      else out[k] = true;
    }
  }
  return out;
}

async function main() {
  const args = parseArgs();
  if (args.list) {
    const key = readKey();
    const url = `${API}?activo=true&limit=50`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
    console.log(JSON.stringify(await res.json(), null, 2));
    process.exit(res.ok ? 0 : 1);
  }

  const nombre = args.nombre || args.n;
  const telefono = args.telefono || args.tel;
  if (!nombre || !telefono) {
    console.error('Uso: node scripts/alta-comprador-cli.js --nombre "..." --telefono 612345678 [--zona ...] [--presupuesto 200000] [--habitaciones 3] [--notas "..."]');
    console.error('      node scripts/alta-comprador-cli.js --list');
    process.exit(1);
  }

  const body = {
    nombre: String(nombre).trim(),
    telefono: String(telefono).trim(),
  };
  if (args.zona) body.zona_buscada = String(args.zona).trim();
  if (args.presupuesto) body.presupuesto_max = Number(args.presupuesto);
  if (args.habitaciones) body.habitaciones_min = parseInt(args.habitaciones, 10);
  if (args.notas) body.notas = String(args.notas).trim();
  if (args.email) body.email = String(args.email).trim();

  const key = readKey();
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  process.exit(res.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
