/**
 * Quita bloques <h2>Detalle …</h2> añadidos por patch-min-words-build.js
 * node scripts/strip-detalle-filler.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SLUGS = [
  'inmobiliaria-precio-fijo-montjuic-barcelona',
  'inmobiliaria-precio-fijo-pedralbes-barcelona',
  'inmobiliaria-precio-fijo-poblenou-barcelona',
  'inmobiliaria-precio-fijo-roquetes-barcelona',
  'inmobiliaria-precio-fijo-tetuan-barcelona',
  'inmobiliaria-precio-fijo-vall-d-hebron-barcelona',
  'vender-piso-sin-portales-gracia-barcelona',
  'vender-piso-sin-portales-poblenou-barcelona',
  'vender-como-particular-guinardo-barcelona',
  'vender-como-particular-roquetes-barcelona',
  'nuevahabitat-vs-habitaclia-particular',
];

const dirs = ['intencion', 'particular', 'comparativa', 'barrio', 'situacion'];
const TAILS = require('./landing-unique-tail.js');
const MIN = 900;
const re =
  /<h2>Detalle[^<]*<\/h2><p>[\s\S]*?Este bloque refuerza la guía local sin duplicar otras landings del mismo barrio\.<\/p>/g;

function findJson(slug) {
  for (const d of dirs) {
    const p = path.join(ROOT, 'content/landings', d, slug + '.json');
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function wordCount(html) {
  return (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
}

let n = 0;
for (const slug of SLUGS) {
  const p = findJson(slug);
  if (!p) continue;
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  const before = L.argumento_principal || '';
  let after = before.replace(re, '').trim();
  const tail = TAILS[slug];
  if (tail && !after.includes(tail.slice(0, 40))) {
    after = (after + tail).trim();
  }
  if (after === before) {
    console.log('skip (sin cambios)', slug, wordCount(before));
    continue;
  }
  if (wordCount(after) < MIN) {
    console.warn('LOW words', slug, wordCount(after));
  }
  L.argumento_principal = after;
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('ok', slug, wordCount(before), '->', wordCount(after));
  n++;
}
console.log('stripped', n);
