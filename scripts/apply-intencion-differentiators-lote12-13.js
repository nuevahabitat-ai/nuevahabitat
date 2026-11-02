/**
 * Meta/H1/lead únicos + argumento regenerado para lotes 12–13.
 * node scripts/apply-intencion-differentiators-lote12-13.js && node scripts/build-landings.js
 */
const fs = require('fs');
const path = require('path');
const pf = require('./scaffold-intencion-precio-fijo.js');
const pp = require('./scaffold-intencion-para-particulares.js');
const {
  resolveBarrioSlug,
  kindFromIntSlug,
  applyVisibleDifferentiators,
  slugsFromGscIndexFile,
  BARRIO_DIR,
} = require('./intencion-micro-differentiate.js');

const INT = path.join(__dirname, '..', 'content', 'landings', 'intencion');
const GSC = path.join(__dirname, '..', 'content', 'gsc-index-lote12-13-urls.txt');

const slugs = slugsFromGscIndexFile(GSC);

for (const intSlug of slugs) {
  const jsonPath = path.join(INT, intSlug + '.json');
  if (!fs.existsSync(jsonPath)) {
    console.warn('SKIP missing', intSlug);
    continue;
  }
  const barrioSlug = resolveBarrioSlug(intSlug);
  if (!barrioSlug) {
    console.warn('SKIP no barrio', intSlug);
    continue;
  }
  const B = JSON.parse(fs.readFileSync(path.join(BARRIO_DIR, barrioSlug + '.json'), 'utf8'));
  const L = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const kind = kindFromIntSlug(intSlug);

  applyVisibleDifferentiators(L, B, kind);

  if (kind === 'pf') {
    L.argumento_principal = pf.buildArgumento(B, intSlug);
  } else {
    let zoneSlug = barrioSlug.replace(/^vender-/, '').replace(/^piso-/, '');
    if (!zoneSlug.endsWith('-barcelona')) zoneSlug += '-barcelona';
    L.argumento_principal = pp.buildArgumento(B, intSlug, zoneSlug);
  }

  fs.writeFileSync(jsonPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('OK', intSlug, L.meta.title.slice(0, 70) + '…');
}

console.log('Done.', slugs.length, 'landings.');
