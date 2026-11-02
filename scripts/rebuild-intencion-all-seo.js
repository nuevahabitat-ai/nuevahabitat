/**
 * Diferenciadores + limpieza argumento en todas las intenciones pf/pp/econ con barrio.
 * node scripts/rebuild-intencion-all-seo.js
 */
const fs = require('fs');
const path = require('path');
const pf = require('./scaffold-intencion-precio-fijo.js');
const pp = require('./scaffold-intencion-para-particulares.js');
const econ = require('./scaffold-economica-barrios.js');
const {
  resolveBarrioSlug,
  kindFromIntSlug,
  applyVisibleDifferentiators,
  needsArgumentoRebuild,
  BARRIO_DIR,
} = require('./intencion-micro-differentiate.js');

const INT = path.join(__dirname, '..', 'content', 'landings', 'intencion');
const HUB_SKIP = new Set([
  'inmobiliaria-precio-fijo-barcelona',
  'inmobiliaria-para-particulares-barcelona',
  'venta-piso-economica-barcelona',
]);

let metaN = 0;
let argN = 0;
let skipN = 0;

for (const f of fs.readdirSync(INT).filter((x) => x.endsWith('.json'))) {
  const slug = f.replace(/\.json$/, '');
  const kind = kindFromIntSlug(slug);
  if (!kind) continue;
  if (HUB_SKIP.has(slug)) continue;

  const barrioSlug = resolveBarrioSlug(slug);
  if (!barrioSlug) {
    console.warn('SKIP no barrio', slug);
    skipN++;
    continue;
  }

  const B = JSON.parse(fs.readFileSync(path.join(BARRIO_DIR, barrioSlug + '.json'), 'utf8'));
  const jsonPath = path.join(INT, f);
  const L = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  applyVisibleDifferentiators(L, B, kind);
  metaN++;

  if (needsArgumentoRebuild(L.argumento_principal, slug)) {
    if (kind === 'pf') {
      L.argumento_principal = pf.buildArgumento(B, slug);
    } else if (kind === 'pp') {
      let zoneSlug = barrioSlug.replace(/^vender-/, '').replace(/^piso-/, '');
      if (!zoneSlug.endsWith('-barcelona')) zoneSlug += '-barcelona';
      L.argumento_principal = pp.buildArgumento(B, slug, zoneSlug);
    } else {
      L.argumento_principal = econ.buildArgumento(B, slug);
    }
    argN++;
  }

  fs.writeFileSync(jsonPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
}

console.log('Meta/hero updated:', metaN, '| argumento rebuilt:', argN, '| skip:', skipN);
