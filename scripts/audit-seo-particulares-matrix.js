/**
 * Matriz SEO: distritos inmobiliaria-para-particulares vs vender-como-particular.
 * node scripts/audit-seo-particulares-matrix.js
 */
const fs = require('fs');
const path = require('path');

const INT = path.join(__dirname, '..', 'content', 'landings', 'intencion');
const PART = path.join(__dirname, '..', 'content', 'landings', 'particular');

function slugs(dir, prefix) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

const hubPart = slugs(INT, 'inmobiliaria-para-particulares-');
const particularGuides = slugs(PART, 'vender-como-particular-');

const districtFromParticular = (slug) => {
  const m = slug.match(/^inmobiliaria-para-particulares-(.+)-barcelona$/);
  return m ? m[1] : null;
};

const districtFromGuide = (slug) => {
  const m = slug.match(/^vender-como-particular-(.+)-barcelona$/);
  return m ? m[1] : null;
};

const hubDistricts = new Set(hubPart.map(districtFromParticular).filter(Boolean));
const guideDistricts = new Set(particularGuides.map(districtFromGuide).filter(Boolean));

const missingGuides = [...hubDistricts].filter((d) => !guideDistricts.has(d)).sort();
const extraGuides = [...guideDistricts].filter((d) => !hubDistricts.has(d) && d !== 'barcelona').sort();

console.log('Hub inmobiliaria-para-particulares:', hubPart.length);
console.log('Guías vender-como-particular:', particularGuides.length);
console.log('\nDistritos con hub SIN guía particular:', missingGuides.length ? missingGuides.join(', ') : '(ninguno)');
console.log('\nGuías particular SIN hub distrito (micro-barrios OK):', extraGuides.length);
if (extraGuides.length) console.log(extraGuides.slice(0, 30).join(', '), extraGuides.length > 30 ? '…' : '');
