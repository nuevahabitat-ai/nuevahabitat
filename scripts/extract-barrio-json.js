/** Extrae JSON de landings barrio manuales → content/landings/barrio/ */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'content', 'landings', 'barrio');

const SLUGS = [
  'vender-gracia',
  'vender-sarria',
  'vender-eixample',
  'vender-les-corts',
  'vender-sants',
];

function stripTags(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractFaq(html) {
  const m = html.match(/id="nh-seo-static">([\s\S]*?)<\/script>/);
  if (!m) return [];
  const schemas = JSON.parse(m[1]);
  const faq = schemas.find((s) => s['@type'] === 'FAQPage');
  return (faq?.mainEntity || []).map((q) => ({
    q: q.name,
    a: q.acceptedAnswer?.text || '',
  }));
}

function extractProse(html) {
  const m = html.match(/<div class="lc-prose fade-up">([\s\S]*?)<\/div>\s*<div class="lc-form/);
  if (!m) return '';
  return m[1]
    .replace(/<span class="overline">[\s\S]*?<\/span>/, '')
    .replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '')
    .trim();
}

function extractMeta(html, name) {
  const re = new RegExp(`<meta name="${name}" content="([^"]*)"`);
  return html.match(re)?.[1] || '';
}

function extractTitle(html) {
  return html.match(/<title>([^<]*)<\/title>/)?.[1] || '';
}

function extractHero(html) {
  const h1 = html.match(/<h1>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '')?.trim();
  const lead = html.match(/<div class="lc-hero-content fade-up">[\s\S]*?<h1>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/)?.[1]?.trim();
  return { h1, lead: lead || '' };
}

function extractAhorro(html) {
  const m = html.match(/te ahorras más de <strong>([^<]+)<\/strong>/i);
  return m ? m[1].replace(/\s/g, '') : '25.000';
}

function barrioMeta(slug) {
  const map = {
    'vender-gracia': {
      barrio: 'Gràcia',
      footerLabel: 'Vender en Gràcia',
      breadcrumbCurrent: 'Gràcia',
      postalCodes: ['08012', '08024', '08006'],
      zonas: ['Vila de Gràcia', "Camp d'en Grassot", 'Vallcarca', 'Penitents'],
      inmueblesQuery: 'Gràcia',
      ejemploPrecio: 480000,
      heroImage: 'imagenes/agenteinmobiliario3.jpg',
      heroImageAlt: 'Agente inmobiliario en Gràcia, Barcelona',
      origen_lead: 'vender-gracia',
      testimonials: false,
      priority: 0.88,
    },
    'vender-sarria': {
      barrio: 'Sarrià',
      footerLabel: 'Vender en Sarrià',
      breadcrumbCurrent: 'Sarrià',
      postalCodes: ['08017', '08034'],
      zonas: ['Galvany', 'Bonanova', 'Tres Torres', 'Sant Gervasi'],
      inmueblesQuery: 'Sarrià',
      ejemploPrecio: 650000,
      heroImage: 'imagenes/interior2.jpg',
      heroImageAlt: 'Vivienda en Sarrià-Sant Gervasi, Barcelona',
      origen_lead: 'vender-sarria',
      testimonials: false,
      priority: 0.88,
    },
    'vender-eixample': {
      barrio: 'Eixample',
      footerLabel: 'Vender en el Eixample',
      breadcrumbCurrent: 'Eixample',
      postalCodes: ['08007', '08009', '08013'],
      zonas: ['Eixample Derecho', 'Sagrada Família', 'Passeig de Gràcia', 'Fort Pienc'],
      inmueblesQuery: 'Eixample',
      ejemploPrecio: 520000,
      heroImage: 'imagenes/interior1.jpg',
      heroImageAlt: 'Piso en el Eixample de Barcelona',
      origen_lead: 'vender-eixample',
      testimonials: true,
      priority: 0.88,
    },
    'vender-les-corts': {
      barrio: 'Les Corts',
      footerLabel: 'Vender en Les Corts',
      breadcrumbCurrent: 'Les Corts',
      postalCodes: ['08028', '08034'],
      zonas: ['Numància', 'Zona Universitaria', 'Pedralbes', 'Les Corts centre'],
      inmueblesQuery: 'Les Corts',
      ejemploPrecio: 450000,
      heroImage: 'imagenes/equipo1.jpg',
      heroImageAlt: 'Vivienda en Les Corts, Barcelona',
      origen_lead: 'vender-les-corts',
      testimonials: true,
      priority: 0.88,
      footerExtra: 'comprar',
    },
    'vender-sants': {
      barrio: 'Sants',
      footerLabel: 'Vender en Sants',
      breadcrumbCurrent: 'Sants',
      postalCodes: ['08014', '08028'],
      zonas: ['Hostafrancs', 'La Bordeta', 'Estació de Sants', 'Sants centre'],
      inmueblesQuery: 'Sants',
      ejemploPrecio: 380000,
      heroImage: 'imagenes/interior3.jpg',
      heroImageAlt: 'Piso en Sants, Barcelona',
      origen_lead: 'vender-sants',
      testimonials: true,
      priority: 0.88,
    },
  };
  return map[slug];
}

SLUGS.forEach((slug) => {
  const html = fs.readFileSync(path.join(ROOT, slug + '.html'), 'utf8');
  const meta = barrioMeta(slug);
  const hero = extractHero(html);
  const precio = html.match(/data-nh-precio-default="(\d+)"/)?.[1];
  const kwFooter = html.match(/<div class="lc-kw[^"]*">[\s\S]*?<strong>Búsquedas relacionadas:<\/strong>\s*([^<]+)/)?.[1]?.trim();

  const L = {
    slug,
    cluster: 'barrio',
    indexable: true,
    ...meta,
    ejemploPrecio: precio ? Number(precio) : meta.ejemploPrecio,
    ahorro: extractAhorro(html),
    meta: {
      title: extractTitle(html),
      description: extractMeta(html, 'description'),
      keywords: extractMeta(html, 'keywords'),
    },
    hero: {
      h1: hero.h1,
      lead: hero.lead,
    },
    argumento_principal: extractProse(html),
    faq: extractFaq(html),
    relacionadas: [
      { slug: 'vender-eixample', label: 'Vender en el Eixample' },
      { slug: 'vender-gracia', label: 'Vender en Gràcia' },
      { slug: 'vender-sants', label: 'Vender en Sants' },
      { slug: 'vender-les-corts', label: 'Vender en Les Corts' },
    ].filter((r) => r.slug !== slug),
    keywords_footer: kwFooter || `vender piso ${meta.barrio} Barcelona`,
    whatsappText: `Hola%2C%20quiero%20vender%20mi%20piso%20en%20${encodeURIComponent(meta.barrio.replace('à', 'a').replace('à', 'a'))}`,
    formPlaceholder: `Dirección o zona en ${meta.barrio}`,
  };

  if (meta.footerExtra) L.footerExtra = meta.footerExtra;

  const outPath = path.join(OUT, slug + '.json');
  fs.writeFileSync(outPath, JSON.stringify(L, null, 2) + '\n');
  console.log('Wrote', outPath, 'words', stripTags(L.argumento_principal).split(' ').filter(Boolean).length);
});
