/**
 * Crea venta-piso-economica-* para cada JSON en content/landings/barrio.
 * node scripts/scaffold-economica-all-barrios.js
 */
const fs = require('fs');
const path = require('path');
const { buildLanding, barrioToEconSlug } = require('./scaffold-economica-barrios.js');

const BARRIO_DIR = path.join(__dirname, '..', 'content', 'landings', 'barrio');
const INT = path.join(__dirname, '..', 'content', 'landings', 'intencion');

let created = 0;
for (const f of fs.readdirSync(BARRIO_DIR).filter((x) => x.endsWith('.json'))) {
  const barrioSlug = f.replace(/\.json$/, '');
  const econSlug = barrioToEconSlug(barrioSlug) + '.json';
  if (fs.existsSync(path.join(INT, econSlug))) continue;
  buildLanding(barrioSlug);
  created++;
}
console.log('New economica landings:', created);
