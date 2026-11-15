/**
 * Línea SEO «vende tu piso por ~1.900 €» (distinta de venta-digital-{ciudad}).
 * Mismo plan 1.999 € + IVA · venta 100 % digital.
 */
const { CIUDADES } = require('./venta-digital-ciudades-data');

function vd(citySlug) {
  return CIUDADES.find((c) => c.slug === `venta-digital-${citySlug}`) || null;
}

function baseLocalFaq(ventaDigitalHref, cityName) {
  return (
    '<details><summary>¿Es el mismo servicio que venta digital?</summary><p>Sí. Misma operativa, panel y honorarios <strong>1.999 € + IVA</strong>. Esta URL refuerza búsquedas por precio (~1.900–1.990&nbsp;€). Ficha paralela: <a href="' +
    ventaDigitalHref +
    '">venta digital ' +
    cityName +
    '</a>.</p></details>' +
    '<details><summary>¿Por qué ponéis 1.900 € si el contrato dice 1.999 € + IVA?</summary><p>Muchas búsquedas redondean a 1.900 o 1.990&nbsp;€. En factura verás el importe legal cerrado, sin % sobre el precio de venta del piso.</p></details>' +
    '<details><summary>¿Puedo ver todos los pasos antes de pagar?</summary><p>En esta página tienes los <strong>8 pasos ilustrados</strong> y la <strong>lista completa de acciones</strong>. Si quieres valoración previa, usa el formulario o WhatsApp.</p></details>'
  );
}

function makeCityLanding(cityKey) {
  const vdRow = vd(cityKey);
  if (!vdRow) throw new Error(`No venta-digital-${cityKey}`);
  const slug = `vende-tu-piso-por-1900-euros-${cityKey}`;
  const name = vdRow.cityName;
  const heroImages = {
    barcelona: 'imagenes/eixample1.jpg',
    madrid: 'imagenes/interior15.jpg',
    valencia: 'imagenes/interior13.jpg',
  };
  return {
    slug,
    cityKey,
    cityName: name,
    cityLabel: name,
    ventaDigitalSlug: vdRow.slug,
    navSub: `${name} · ~1.900 €`,
    registroCiudad: name,
    breadcrumbLabel: `Vende tu piso · ${name}`,
    switcherLabel: name,
    pageTitle: `Vende tu piso por 1.900 euros en ${name} · guía ilustrada · 1.999 € + IVA`,
    heroH1: `Vende tu piso en ${name} por ~1.900 €: guía con fotos de cada paso (plan digital 1.999 € + IVA)`,
    metaDescription: `vende tu piso por 1900 euros ${name}: checklist de ${25} acciones, 8 pasos ilustrados y mismo plan venta 100 % digital (1.999 € + IVA). Idealista, pisos.com y visitas cualificadas.`,
    keyword_principal: `vende tu piso por 1900 euros ${name.toLowerCase()}`,
    keyword_aliases: [
      `vender piso 1900 euros ${name.toLowerCase()}`,
      `vender piso por 1990 euros ${name.toLowerCase()}`,
      `inmobiliaria precio fijo ${name.toLowerCase()}`,
      `vender piso online barato ${name.toLowerCase()}`,
      `agencia vender piso ${name.toLowerCase()} precio cerrado`,
      vdRow.keyword_principal,
    ],
    priority: 0.94,
    areaServed: vdRow.areaServed,
    heroBadge: `Guía SEO precio fijo · ${name}`,
    heroImage: heroImages[cityKey] || 'imagenes/interior11.jpg',
    marketLead: vdRow.marketLead,
    zones: vdRow.zones,
    priceExample: vdRow.priceExample,
    priceM2: vdRow.priceM2,
    avgDays: vdRow.avgDays,
    cardTeaser: `Línea ~1.900 € en ${name}: pasos ilustrados + todas las acciones del plan digital (1.999 € + IVA).`,
    localFaq: baseLocalFaq(`/${vdRow.slug}`, name),
    waText: `Hola, quiero vender mi piso en ${name} con el plan digital ~1.900 € (1.999 + IVA)`,
    footerBlurb: `Guía vende tu piso por ~1.900 € en ${name} · mismo plan venta digital 1.999 € + IVA.`,
    seoExtra: `<h2>Vende tu piso en ${name} buscando «1.900 euros» de honorarios</h2>
<p>Esta URL convive con <a href="/${vdRow.slug}">venta digital ${name}</a> sin duplicar el servicio: aquí priorizamos <strong>lista de acciones</strong>, <strong>fotos del proceso</strong> y comparativa frente a comisión del 3&nbsp;% o 6&nbsp;% sobre un ticket orientativo de ${vdRow.priceExample.toLocaleString('es-ES')}&nbsp;€.</p>
<h2>Zonas habituales en ${name}</h2>
<p>${(vdRow.zones || []).slice(0, 6).join(', ')} y municipios colindantes si puedes recibir visitas cualificadas.</p>
<h2>Mercado orientativo</h2>
<p>${vdRow.priceM2 || ''} · plazos ${vdRow.avgDays || ''}.</p>`,
    ctaSectionTitle: `Contratar plan digital en ${name}`,
  };
}

const VENDE_PISO_1900_NATIONAL = {
  slug: 'vende-tu-piso-por-1900-euros',
  cityKey: '',
  cityName: 'España',
  cityLabel: 'España',
  ventaDigitalSlug: 'venta-digital',
  navSub: 'Precio fijo · guía',
  registroCiudad: '',
  breadcrumbLabel: 'Vende tu piso · 1.900 €',
  switcherLabel: 'España',
  pageTitle: 'Vende tu piso por 1.900 euros · guía ilustrada · 1.999 € + IVA',
  heroH1:
    'Vende tu piso por 1.900 euros: 8 pasos con fotos y lista completa de acciones (plan digital 1.999 € + IVA)',
  metaDescription:
    'vende tu piso por 1900 euros: línea SEO del plan venta 100 % digital (1.999 € + IVA). 8 pasos ilustrados, checklist de acciones, Idealista y pisos.com. Versiones Barcelona, Madrid y Valencia.',
  keyword_principal: 'vende tu piso por 1900 euros',
  keyword_aliases: [
    'vende tu piso por 1990 euros',
    'vender piso por 1900 euros',
    'vender piso 1900 euros honorarios',
    'inmobiliaria precio fijo 1900 euros',
    'vender piso online precio fijo',
    'lista pasos vender piso agencia barata',
  ],
  priority: 0.95,
  areaServed: 'España (39 ciudades · plan venta digital)',
  heroBadge: 'Segunda línea SEO · mismo servicio digital',
  heroImage: 'imagenes/interior11.jpg',
  marketLead:
    'Reforzamos búsquedas que hablan de «1.900 €» o «1.990 €» con una guía visual: qué hace NuevaHabitat, qué haces tú y cuánto ahorras frente a una comisión porcentual. El plan legal sigue siendo venta 100 % digital por 1.999 € + IVA.',
  zones: ['Barcelona', 'Madrid', 'Valencia', 'Cádiz', 'Sevilla', 'Málaga', 'Bilbao', 'Zaragoza'],
  priceExample: 280000,
  cardTeaser:
    'Hub SEO precio fijo ~1.900 €: pasos ilustrados + checklist (mismo plan 1.999 € + IVA).',
  localFaq:
    baseLocalFaq('/venta-digital', 'España') +
    '<details><summary>¿Hay versión Barcelona, Madrid o Valencia?</summary><p>Sí: <a href="/vende-tu-piso-por-1900-euros-barcelona">Barcelona</a>, <a href="/vende-tu-piso-por-1900-euros-madrid">Madrid</a> y <a href="/vende-tu-piso-por-1900-euros-valencia">Valencia</a> con mismas secciones y datos locales.</p></details>',
  waText: 'Hola, quiero la guía vende tu piso por ~1.900 € (plan digital 1.999 + IVA)',
  footerBlurb: 'Línea SEO vende tu piso por ~1.900 € · plan digital 1.999 € + IVA en 39 ciudades.',
  seoExtra: `<h2>Dos URLs, un solo plan</h2>
<p>Las páginas <code>/venta-digital-*</code> explican la venta digital por ciudad. Esta línea <code>/vende-tu-piso-por-1900-euros*</code> captura intención de <strong>precio fijo bajo</strong> con checklist y fotos del proceso.</p>
<p>Ejemplo ciudad: <a href="/venta-digital-cadiz">venta digital Cádiz</a> · guía precio: <a href="/vende-tu-piso-por-1900-euros-barcelona">Barcelona</a>.</p>`,
  ctaSectionTitle: 'Contratar venta digital por honorarios fijos',
};

const VENDE_PISO_1900_LANDINGS = [
  VENDE_PISO_1900_NATIONAL,
  makeCityLanding('barcelona'),
  makeCityLanding('madrid'),
  makeCityLanding('valencia'),
];

/** @deprecated use VENDE_PISO_1900_LANDINGS */
const VENDE_PISO_1900 = VENDE_PISO_1900_NATIONAL;

module.exports = {
  VENDE_PISO_1900,
  VENDE_PISO_1900_NATIONAL,
  VENDE_PISO_1900_LANDINGS,
};
