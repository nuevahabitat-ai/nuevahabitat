/**
 * Regenera argumento_principal de todas venta-piso-economica-*.
 * node scripts/refresh-all-economica-argumentos.js
 */
const fs = require('fs');
const path = require('path');
const { buildArgumento, barrioToEconSlug } = require('./scaffold-economica-barrios.js');
const { resolveBarrioSlug, applyVisibleDifferentiators, BARRIO_DIR } = require('./intencion-micro-differentiate.js');

const INT = path.join(__dirname, '..', 'content', 'landings', 'intencion');
let n = 0;
for (const f of fs.readdirSync(INT).filter((x) => x.startsWith('venta-piso-economica-') && x.endsWith('.json'))) {
  const slug = f.replace(/\.json$/, '');
  if (slug === 'venta-piso-economica-barcelona') continue;
  const barrioSlug = resolveBarrioSlug(slug);
  if (!barrioSlug) {
    console.warn('SKIP', slug);
    continue;
  }
  const B = JSON.parse(fs.readFileSync(path.join(BARRIO_DIR, barrioSlug + '.json'), 'utf8'));
  const jsonPath = path.join(INT, f);
  const L = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  applyVisibleDifferentiators(L, B, 'econ');
  L.argumento_principal = buildArgumento(B, slug);
  fs.writeFileSync(jsonPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  n++;
}
console.log('Refreshed economica argumentos:', n);
