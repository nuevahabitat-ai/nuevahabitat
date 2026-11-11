#!/usr/bin/env node
/**
 * Playwright: precios Idealista → idealista_anuncio_cache (migración 069).
 * Requiere: npx playwright install chromium
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

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

import { SB_URL, svcHeaders } from '../lib/server/supabase-server.js';
import { upsertIdealistaPrecioCache } from '../lib/server/idealista-precio-cache.js';

function parsePrecio(html) {
  const m =
    html.match(/(\d{1,3}(?:\.\d{3})+)\s*€/) ||
    html.match(/"price":(\d+)/) ||
    html.match(/priceValue[^0-9]*(\d{5,7})/);
  if (!m) return null;
  const n = parseInt(String(m[1]).replace(/\./g, ''), 10);
  return n >= 30_000 && n <= 15_000_000 ? n : null;
}

function plausibleIdealistaId(id) {
  const s = String(id || '').trim();
  if (!/^\d{8,10}$/.test(s)) return false;
  if (/^6\d{8}$/.test(s)) return false;
  return true;
}

async function collectIds() {
  const ids = new Set();
  const r1 = await fetch(
    `${SB_URL}/rest/v1/compradores?presupuesto_max=is.null&select=notas&limit=500`,
    { headers: svcHeaders() },
  );
  for (const c of await r1.json()) {
    for (const m of String(c.notas || '').matchAll(/\bIdealista\s+(\d{6,})\b/gi)) {
      const id = m[1];
      if (plausibleIdealistaId(id)) ids.add(id);
    }
  }
  const r2 = await fetch(
    `${SB_URL}/rest/v1/comprador_inmueble_interes?select=idealista_id&idealista_id=not.is.null&limit=1000`,
    { headers: svcHeaders() },
  );
  for (const row of await r2.json()) {
    const id = String(row.idealista_id || '');
    if (plausibleIdealistaId(id)) ids.add(id);
  }
  return [...ids];
}

const dryRun = process.argv.includes('--dry-run');
const limit = Number(process.argv.find((a) => a.startsWith('--limit='))?.slice(8)) || 80;

const ids = (await collectIds()).slice(0, limit);
console.log('IDs a consultar:', ids.length);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: 'es-ES',
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  viewport: { width: 1280, height: 800 },
});
const page = await context.newPage();

let ok = 0;
let fail = 0;
for (const id of ids) {
  const url = `https://www.idealista.com/es/inmueble/${id}/`;
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await page.waitForTimeout(1200);
    const html = await page.content();
    if (res?.status() === 403 || /captcha|datadome/i.test(html)) {
      console.warn('bloqueado', id);
      fail++;
      continue;
    }
    const precio = parsePrecio(html);
    const titulo = await page.title();
    const habM = html.match(/(\d+)\s*hab/i);
    if (!precio) {
      console.warn('sin precio', id);
      fail++;
      continue;
    }
    if (!dryRun) {
      const up = await upsertIdealistaPrecioCache({
        idealista_id: id,
        precio,
        habitaciones: habM ? parseInt(habM[1], 10) : null,
        titulo,
      });
      if (!up.ok) {
        console.error(up.error);
        process.exit(1);
      }
    }
    console.log('OK', id, precio);
    ok++;
  } catch (e) {
    console.warn('err', id, e.message);
    fail++;
  }
}
await browser.close();
console.log(JSON.stringify({ ok, fail, dryRun }, null, 2));
