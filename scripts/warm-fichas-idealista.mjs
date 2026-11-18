#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const n of ['.env.local', '.env']) {
  const p = path.join(root, n);
  if (!fs.existsSync(p)) continue;
  for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
}
const { warmYCompletarFichasIdealista } = await import('../lib/server/idealista-compradores-post-import.js');
const r = await warmYCompletarFichasIdealista({ maxScrape: 30, onlyIfEmpty: false, alwaysPresupuesto: true });
console.log(JSON.stringify(r, null, 2));