#!/usr/bin/env node
/**
 * Limpia cartera activa: compradores que ya compraron + particulares vendidos/reservados/arras.
 *
 *   node scripts/cleanup-cartera-cerrados.mjs --dry-run
 *   node scripts/cleanup-cartera-cerrados.mjs --apply
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
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NH_SUPABASE_SERVICE_KEY;
if (!SB || !KEY) {
  console.error('Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const apply = process.argv.includes('--apply');
const hdr = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};
const hdrMin = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal',
};

/** @type {Array<{tag:string, re:RegExp}>} */
const COMPRADOR_CLOSURE = [
  { tag: 'encontrado', re: /\bya\s+(he\s+)?encontrad[oa]/i },
  { tag: 'comprado', re: /\bya\s+(he\s+)?comprad[oa]/i },
  { tag: 'tengo vivienda', re: /\bya\s+tengo\s+(piso|casa|vivienda|hogar)\b/i },
  { tag: 'no busca', re: /\b(no\s+sigo|ya\s+no)\s+busc/i },
  { tag: 'dejó buscar', re: /\bdej[eé]\s+(de\s+)?busc/i },
  { tag: 'paró búsqueda', re: /\bparo\s+(la\s+)?b[uú]squeda/i },
  { tag: 'otra opción', re: /\b(me\s+)?he\s+ido\s+(a\s+)?otra\b/i },
  { tag: 'alquiler', re: /\bya\s+estoy\s+de\s+alquiler\b/i },
  { tag: 'no molestar', re: /\bno\s+(me\s+)?molest/i },
];

/** @type {Array<{tag:string, re:RegExp}>} */
const PARTICULAR_CLOSURE = [
  { tag: 'vendido', re: /\b(ya\s+)?(est[aá]\s+)?vendid[oa]\b/i },
  { tag: 'reservado', re: /\breservad[oa]\b/i },
  { tag: 'arras', re: /\b(arras|señal)\s*(firmad|pagad|hech)|firmamos?\s+arras|han\s+firmado\s+arras/i },
  { tag: 'no vende', re: /\b(ya\s+)?no\s+(lo\s+)?vend(e|emos|en)\b/i },
  { tag: 'retirado', re: /\b(retirad[oa]|bajad[oa])\s+(del\s+)?(anuncio|portal|mercado)\b/i },
  { tag: 'otra agencia', re: /\botra\s+(inmobiliaria|agencia)\b.*\bvendid/i },
  { tag: 'no disponible', re: /\b(ya\s+)?no\s+(est[aá]|sale)\s+disponible\b/i },
  { tag: 'vendido portal', re: /\bpiso\s+ya\s+vendid/i },
  { tag: 'oferta aceptada', re: /\b(recibimos?\s+una\s+)?oferta\s+y\s+acept/i },
  { tag: 'cerrado operación', re: /\b(operaci[oó]n|venta)\s+(cerrad|hech)/i },
];

function matchClosure(text, patterns) {
  const t = String(text || '');
  if (!t.trim()) return null;
  for (const p of patterns) {
    if (p.re.test(t)) return { tag: p.tag, snippet: t.replace(/\s+/g, ' ').slice(0, 140) };
  }
  return null;
}

/** Extrae la cita del propietario (José/Javier/Alfredo en panel). */
function propietarioInboundTexts(comentario) {
  const c = String(comentario || '');
  const texts = [];
  for (const m of c.matchAll(/WhatsApp\s+respuesta\s+propietario:\s*«([^»]{2,900})»/gi)) {
    texts.push(m[1].trim());
  }
  if (!texts.length) {
    const m = c.match(/respuesta\s+propietario:\s*«([^»]+)»/i);
    if (m) texts.push(m[1].trim());
  }
  return texts;
}

async function getAll(table, select, extra = '') {
  const rows = [];
  let offset = 0;
  const limit = 500;
  while (true) {
    const url = `${SB}/rest/v1/${table}?select=${encodeURIComponent(select)}${extra}&limit=${limit}&offset=${offset}`;
    const r = await fetch(url, { headers: hdr });
    if (!r.ok) throw new Error(`${table} ${r.status} ${await r.text()}`);
    const batch = await r.json();
    rows.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
  }
  return rows;
}

function compradorTexts(c) {
  const notas = String(c.notas || '');
  const parts = [...notas.matchAll(/WhatsApp comprador:\s*«([^»]+)»/g)].map((m) => m[1].trim());
  if (parts.length) return parts;
  if (notas.trim()) return [notas];
  return [];
}

// ——— Compradores ———
const compradores = await getAll(
  'compradores',
  'id,nombre,telefono,activo,notas,proxima_alarma_at',
  '&activo=eq.true',
);
const compToClose = [];
for (const c of compradores) {
  let hit = null;
  for (const t of compradorTexts(c)) {
    hit = matchClosure(t, COMPRADOR_CLOSURE);
    if (hit) break;
  }
  if (hit) compToClose.push({ ...c, ...hit });
}

// ——— Particulares ———
const particulares = await getAll(
  'particulares',
  'id,titulo,direccion,estado,activo,descripcion',
  '&activo=eq.true',
);
const activeParts = particulares.filter((p) => !['descartado', 'captado'].includes(p.estado));

const segs = await getAll(
  'particulares_seguimientos',
  'particular_id,comentario,created_at',
  '&order=created_at.desc',
);
const segByPart = new Map();
for (const s of segs) {
  let hit = null;
  const inbound = propietarioInboundTexts(s.comentario);
  for (const t of inbound.length ? inbound : [s.comentario]) {
    hit = matchClosure(t, PARTICULAR_CLOSURE);
    if (hit) break;
  }
  if (!hit) continue;
  if (!segByPart.has(s.particular_id)) segByPart.set(s.particular_id, hit);
}

const partToClose = [];
for (const p of activeParts) {
  let hit = segByPart.get(p.id) || null;
  if (!hit) hit = matchClosure(p.descripcion, PARTICULAR_CLOSURE);
  if (hit) partToClose.push({ ...p, ...hit });
}

console.log(apply ? '=== APLICAR ===' : '=== DRY-RUN ===');
console.log(`Compradores activos a pausar: ${compToClose.length}`);
for (const c of compToClose) {
  console.log(`  [${c.tag}] ${c.nombre} ${c.telefono} | ${c.snippet}`);
}

console.log(`\nParticulares activos a descartar: ${partToClose.length}`);
for (const p of partToClose) {
  console.log(`  [${p.tag}] ${(p.titulo || p.direccion || '?').slice(0, 50)} (${p.estado}) | ${p.snippet}`);
}

if (!apply) {
  console.log('\nRevisa la lista. Si cuadra: node scripts/cleanup-cartera-cerrados.mjs --apply');
  process.exit(0);
}

let okComp = 0;
for (const c of compToClose) {
  const r = await fetch(`${SB}/rest/v1/compradores?id=eq.${c.id}`, {
    method: 'PATCH',
    headers: hdrMin,
    body: JSON.stringify({ activo: false, proxima_alarma_at: null }),
  });
  if (r.ok) okComp++;
  else console.error('comprador', c.nombre, await r.text());
}

let okPart = 0;
for (const p of partToClose) {
  const r = await fetch(`${SB}/rest/v1/particulares?id=eq.${p.id}`, { method: 'DELETE', headers: hdrMin });
  if (!r.ok) {
    console.error('particular', p.id, await r.text());
    continue;
  }
  okPart++;
}

console.log(`\nListo: ${okComp} compradores pausados, ${okPart} particulares eliminados (como «Descartado» en panel).`);