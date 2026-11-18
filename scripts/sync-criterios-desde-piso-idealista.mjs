#!/usr/bin/env node
/**
 * Rellena criterios comprador desde piso Idealista/NH consultado (todos los campos).
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

const SB = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hdr = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const { applyIdealistaPisoDefaultsForComprador } = await import('../lib/server/comprador-idealista-piso.js');

const limit = Number(process.argv.find((a) => a.startsWith('--limit='))?.slice(8)) || 400;
const r = await fetch(
  `${SB}/rest/v1/compradores?activo=eq.true&or=(notas.ilike.*Idealista*,notas.ilike.*idealista*)&select=id,nombre,telefono,notas,presupuesto_max,presupuesto_min,tipo_inmueble,zona_buscada,habitaciones_min,m2_min,banos_min,ascensor,balcon_terraza_indispensable,exterior_indispensable,planta_max_sin_ascensor&order=updated_at.desc&limit=${limit}`,
  { headers: hdr },
);
const rows = await r.json();
let ok = 0;
let skip = 0;
for (const c of rows) {
  const res = await applyIdealistaPisoDefaultsForComprador(c, {
    fetchListing: true,
    onlyIfEmpty: false,
    fillAllFromPiso: true,
    alwaysPresupuesto: true,
  });
  if (res.ok && res.patch && Object.keys(res.patch).length) ok++;
  else skip++;
}
console.log({ total: rows.length, actualizados: ok, sinCambio: skip });