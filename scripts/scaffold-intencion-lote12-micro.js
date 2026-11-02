/**
 * Lote 12: 10 precio fijo + 10 inmobiliaria para particulares (micro-barrios).
 * node scripts/scaffold-intencion-lote12-micro.js && node scripts/build-landings.js
 */
const PF = [
  'vender-piso-barceloneta',
  'vender-piso-born-barcelona',
  'vender-piso-gotic-barcelona',
  'vender-piso-raval-barcelona',
  'vender-bon-pastor-barcelona',
  'vender-navas-barcelona',
  'vender-verneda-barcelona',
  'vender-el-besos-barcelona',
  'vender-provencals-del-poblenou-barcelona',
  'vender-camp-den-grassot-barcelona',
];

const PP = [
  'vender-diagonal-mar-barcelona',
  'vender-fort-pienc-barcelona',
  'vender-guinardo-barcelona',
  'vender-hostafrancs-barcelona',
  'vender-vila-olimpica-barcelona',
  'vender-montjuic-barcelona',
  'vender-la-sagrera-barcelona',
  'vender-pedralbes-barcelona',
  'vender-sagrada-familia-barcelona',
  'vender-roquetes-barcelona',
];

const pf = require('./scaffold-intencion-precio-fijo.js');
const pp = require('./scaffold-intencion-para-particulares.js');

for (const s of PF) pf.buildLanding(s);
for (const s of PP) pp.buildLanding(s);

console.log('Lote 12 scaffold done.');
