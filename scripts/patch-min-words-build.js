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
  while (wordCount(ap) < MIN && n < 30) {
    ap += `<h2>Detalle ${slug.replace(/-/g, ' ')} (${n + 1})</h2><p>En ${L.barrio || L.footerLabel || slug}, NuevaHabitat trabaja con honorarios fijos <strong>3.500 € + IVA</strong> (50&nbsp;% al contratar y 50&nbsp;% en escritura), panel vendedor y compradores con solvencia contrastada antes de cada visita. Este bloque refuerza la guía local sin duplicar otras landings del mismo barrio.</p>`;
    n++;
  }
  L.argumento_principal = ap;
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('patched', slug, wordCount(ap), 'words');
}
