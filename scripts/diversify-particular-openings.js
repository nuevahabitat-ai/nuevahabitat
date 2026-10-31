/**
 * Sustituye la apertura genérica «Idealista/Fotocasa… error más caro» en guías particular.
 * node scripts/diversify-particular-openings.js
 */
const fs = require('fs');
const path = require('path');
const { NH_FEE_LABEL_ESCRITURA } = require('./fee-config');

const DIR = path.join(__dirname, '..', 'content', 'landings', 'particular');
const MARKER = 'empieza con consultas en Idealista o Fotocasa';

const OPENERS = [
  (c) =>
    `<p>En <strong>${c.barrio}</strong>, vender como <strong>particular</strong> suele significar muchas consultas en portal y ninguna oferta con hipoteca cerrada. Orientativamente 2026: <strong>${c.precioM2}</strong>; ticket habitual <strong>${c.ticket}</strong>. ${c.tendencia} NuevaHabitat trabaja con <strong>${NH_FEE_LABEL_ESCRITURA}</strong> solo en escritura, panel vendedor y filtro de solvencia.</p>`,
  (c) =>
    `<p>Si publicaste en <strong>${c.barrio}</strong> como particular y el teléfono no trae banco al fondo, el problema rara vez es «falta de anuncio»: es <strong>precio por calle</strong> (<strong>${c.precioM2}</strong>, <strong>${c.ticket}</strong>) y visitas sin filtro. ${c.tendencia} Opción con coste cerrado: <strong>${NH_FEE_LABEL_ESCRITURA}</strong> en escritura.</p>`,
  (c) =>
    `<p><strong>Particular en ${c.barrio}</strong>: antes de abrir más puertas conviene anclar <strong>${c.precioM2}</strong> y exigir preaprobación hipotecaria. Ticket orientativo <strong>${c.ticket}</strong>. ${c.tendencia} Guía local + <strong>${NH_FEE_LABEL_ESCRITURA}</strong> solo si hay venta.</p>`,
];

function barrioFrom(L) {
  const m = L.slug.match(/vender-como-particular-(.+)-barcelona$/);
  if (m) return m[1].replace(/-/g, ' ').replace(/\bl h\b/i, "L'");
  return L.breadcrumbCurrent?.replace(/^Particular\s/i, '') || 'Barcelona';
}

function parseGeneric(html) {
  const re =
    /<p>Vender como <strong>particular en ([^<]+)<\/strong> empieza con consultas en Idealista o Fotocasa;[^<]*<strong>([^<]+)<\/strong>; ticket habitual <strong>([^<]+)<\/strong>\.[^<]*<\/p>/;
  const m = html.match(re);
  if (!m) return null;
  return { barrioLabel: m[1], precioM2: m[2], ticket: m[3] };
}

let n = 0;
for (const name of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const file = path.join(DIR, name);
  const L = JSON.parse(fs.readFileSync(file, 'utf8'));
  const arg = L.argumento_principal || '';
  if (!arg.includes(MARKER)) continue;
  const parsed = parseGeneric(arg);
  if (!parsed) {
    console.warn('skip parse', name);
    continue;
  }
  const barrio = parsed.barrioLabel;
  const tendencia = (L.datosMercado?.tendencia || L.perfilComprador || '').trim();
  const tendenciaSuffix = tendencia ? `${tendencia.endsWith('.') ? tendencia : tendencia + '.'} ` : '';
  const ctx = {
    barrio,
    precioM2: L.datosMercado?.precioM2 || parsed.precioM2,
    ticket: parsed.ticket,
    tendencia: tendenciaSuffix,
  };
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % OPENERS.length;
  const newP = OPENERS[idx](ctx);
  const reOld =
    /<p>Vender como <strong>particular en [^<]+<\/strong> empieza con consultas en Idealista o Fotocasa;[\s\S]*?<\/p>/;
  L.argumento_principal = arg.replace(reOld, newP);
  fs.writeFileSync(file, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('updated', name);
  n++;
}
console.log('Done.', n, 'particular openings');
