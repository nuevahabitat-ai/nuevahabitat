/**
 * Añade párrafos únicos hasta >=900 palabras (solo slugs que fallan validate).
 * node scripts/patch-min-words-build.js
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

const TAILS = require('./landing-unique-tail.js');
const MIN = 900;

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function wordCount(html) {
  return stripHtml(html).split(' ').filter(Boolean).length;
}

function findJson(slug) {
  const dirs = ['intencion', 'particular', 'comparativa', 'barrio', 'situacion'];
  for (const d of dirs) {
    const p = path.join(ROOT, 'content/landings', d, slug + '.json');
    if (fs.existsSync(p)) return p;
  }
  return null;
}

for (const slug of SLUGS) {
  const p = findJson(slug);
  if (!p) {
    console.warn('skip (no json)', slug);
    continue;
  }
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  let ap = L.argumento_principal || '';
  let n = 0;
  const tail = TAILS[slug];
  if (tail && wordCount(ap) < MIN && !ap.includes(tail.slice(0, 40))) {
    ap += tail;
  }
  while (wordCount(ap) < MIN && n < 5) {
    console.warn('patch-min-words: aún <', MIN, 'palabras tras tail único:', slug, wordCount(ap));
    break;
  }
  L.argumento_principal = ap;
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('patched', slug, wordCount(ap), 'words');
}
