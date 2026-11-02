/**
 * Lote 13: precio fijo restantes + hubs inmobiliaria para particulares pendientes.
 * node scripts/scaffold-intencion-lote13-micro.js && node scripts/refresh-lote13-intencion-argumentos.js && node scripts/build-landings.js
 */
const pf = require('./scaffold-intencion-precio-fijo.js');
const pp = require('./scaffold-intencion-para-particulares.js');

const PF = [
  'vender-camp-de-larpa-barcelona',
  'vender-la-bordeta-barcelona',
  'vender-la-marina-barcelona',
  'vender-roquetes-barcelona',
  'vender-sant-just-sant-joan-despi',
  'vender-sant-pere-santa-caterina-barcelona',
  'vender-tetuan-barcelona',
  'vender-trinitat-vella-barcelona',
  'vender-vall-d-hebron-barcelona',
];

const PP = [
  'vender-bon-pastor-barcelona',
  'vender-camp-de-larpa-barcelona',
  'vender-camp-den-grassot-barcelona',
  'vender-el-besos-barcelona',
  'vender-la-bordeta-barcelona',
  'vender-la-marina-barcelona',
  'vender-navas-barcelona',
  'vender-piso-barceloneta',
  'vender-piso-born-barcelona',
  'vender-piso-gotic-barcelona',
  'vender-piso-raval-barcelona',
  'vender-provencals-del-poblenou-barcelona',
  'vender-sant-just-sant-joan-despi',
  'vender-sant-pere-santa-caterina-barcelona',
  'vender-tetuan-barcelona',
  'vender-trinitat-vella-barcelona',
  'vender-vall-d-hebron-barcelona',
  'vender-verneda-barcelona',
];

for (const s of PF) pf.buildLanding(s);
for (const s of PP) pp.buildLanding(s);

console.log('Lote 13 scaffold done.', PF.length, 'pf +', PP.length, 'pp');
