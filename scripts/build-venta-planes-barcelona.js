/**
 * Genera venta-clasica-barcelona.html y venta-comercial-barcelona.html
 */
const fs = require('fs');
const path = require('path');
const { renderClasicaBarcelona } = require('./render-venta-clasica-barcelona');
const { renderComercialBarcelona } = require('./render-venta-comercial-barcelona');

const ROOT = path.join(__dirname, '..');

function main() {
  fs.writeFileSync(path.join(ROOT, 'venta-clasica-barcelona.html'), renderClasicaBarcelona(), 'utf8');
  console.log('Built venta-clasica-barcelona.html');
  fs.writeFileSync(path.join(ROOT, 'venta-comercial-barcelona.html'), renderComercialBarcelona(), 'utf8');
  console.log('Built venta-comercial-barcelona.html');
}

if (require.main === module) main();
module.exports = { main };
