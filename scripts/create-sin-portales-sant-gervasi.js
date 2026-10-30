const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../content/landings/intencion/vender-piso-sin-portales-gracia-barcelona.json');
const out = path.join(__dirname, '../content/landings/intencion/vender-piso-sin-portales-sant-gervasi-barcelona.json');
const L = JSON.parse(fs.readFileSync(src, 'utf8'));

const z = {
  slug: 'vender-piso-sin-portales-sant-gervasi-barcelona',
  barrio: 'Sant Gervasi',
  barrioSlug: 'vender-sant-gervasi',
  keyword: 'vender piso sin portales sant gervasi barcelona',
  h1: '¿Vender en Sant Gervasi con compradores solventes, sin portal?',
  micro: 'Putxet, Farró, Sant Gervasi centre',
  precioDefault: 520000,
};

L.slug = z.slug;
L.barrio = z.barrio;
L.keyword_principal = z.keyword;
L.keyword_aliases = ['vender sin idealista sant gervasi', 'off market sant gervasi barcelona'];
L.footerLabel = 'Sin portales Sant Gervasi';
L.breadcrumbCurrent = 'Sin portales Sant Gervasi';
L.origen_lead = z.slug;
L.cardTeaser = `${z.h1.replace(/\?$/, '')}. Cartera NH, 3.630 € en escritura.`;
L.meta.title = 'Vender sin portales en Sant Gervasi · NuevaHabitat';
L.meta.description = `${z.h1} Honorarios 3.000 € + IVA (3.630 €) solo en escritura. ${z.micro}.`;
L.meta.keywords = z.keyword;
L.hero.badge = 'Sant Gervasi · Sin portales';
L.hero.h1 = z.h1;
L.hero.lead = `<strong>NuevaHabitat</strong> en <strong>${z.barrio}</strong> (${z.micro}): cartera de compradores, panel vendedor y <strong>3.000 € + IVA (3.630 €)</strong> solo en escritura. Guía: <a href="/${z.barrioSlug}">vender en ${z.barrio}</a>.`;
L.hero.image = 'imagenes/santgervasi1.jpg';
L.hero.imageAlt = 'Vender Sant Gervasi sin portales';
L.calculadora.precioDefault = z.precioDefault;
L.calculadora.titulo = 'Calculadora Sant Gervasi: portal vs NH';

L.argumento_principal = (L.argumento_principal || '')
  .replace(/Gràcia/g, z.barrio)
  .replace(/gracia/g, 'sant-gervasi')
  .replace(/vender-piso-sin-portales-gracia-barcelona/g, z.slug)
  .replace(/Vila de Gràcia, Camp d'En Grassot, Salut, Vallcarca/g, z.micro);

L.relacionadas = (L.relacionadas || []).map((r) => {
  if (r.slug === 'vender-gracia') return { slug: z.barrioSlug, label: `Vender ${z.barrio}` };
  if (r.slug === 'vender-piso-sin-portales-gracia-barcelona') {
    return { slug: 'vender-piso-sin-portales-sarria-barcelona', label: 'Sin portales Sarrià' };
  }
  return r;
});

fs.writeFileSync(out, JSON.stringify(L, null, 2) + '\n', 'utf8');
console.log('Wrote', z.slug);
