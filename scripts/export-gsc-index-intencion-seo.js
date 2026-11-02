/**
 * Lista URLs intención SEO (pf, pp, econ) para GSC.
 * node scripts/export-gsc-index-intencion-seo.js
 */
const fs = require('fs');
const path = require('path');

const INT = path.join(__dirname, '..', 'content', 'landings', 'intencion');
const OUT = path.join(__dirname, '..', 'content', 'gsc-index-intencion-seo.txt');
const BASE = 'https://www.nuevahabitat.com/';

const slugs = fs
  .readdirSync(INT)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .filter(
    (s) =>
      s.startsWith('inmobiliaria-precio-fijo-') ||
      s.startsWith('inmobiliaria-para-particulares-') ||
      s.startsWith('venta-piso-economica-')
  )
  .sort();

const lines = [
  '# Indexar en GSC — intención SEO (precio fijo, particulares, venta económica)',
  '# Generado: ' + new Date().toISOString().slice(0, 10),
  '',
  ...slugs.map((s) => BASE + s),
  '',
];
fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log('Wrote', slugs.length, 'URLs →', OUT);
