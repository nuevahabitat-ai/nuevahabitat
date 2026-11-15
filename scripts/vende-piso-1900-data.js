/**
 * Línea SEO «vende tu piso por ~1.900 €» (distinta de venta-digital-{ciudad}).
 * Mismo plan 1.999 € + IVA · venta 100 % digital.
 */
const { CIUDADES } = require('./venta-digital-ciudades-data');
const ACTION_COUNT = 25;

function vd(citySlug) {
  return CIUDADES.find((c) => c.slug === `venta-digital-${citySlug}`) || null;
}

const HERO_IMAGES = {
  barcelona: 'imagenes/eixample1.jpg',
  madrid: 'imagenes/interior15.jpg',
  valencia: 'imagenes/interior13.jpg',
  sevilla: 'imagenes/interior12.jpg',
  malaga: 'imagenes/barcelona5.jpg',
  cadiz: 'imagenes/interior11.jpg',
  bilbao: 'imagenes/interior14.jpg',
  zaragoza: 'imagenes/interior4.jpg',
};

function baseLocalFaq(ventaDigitalHref, cityName) {
  return (
    '<details><summary>¿Es el mismo servicio que venta digital?</summary><p>Sí. Misma operativa, panel y honorarios <strong>1.999 € + IVA</strong>. Esta URL refuerza búsquedas por precio (~1.900–1.990&nbsp;€). Ficha paralela: <a href="' +
    ventaDigitalHref +
    '">venta digital ' +
    cityName +
    '</a>.</p></details>' +
    '<details><summary>¿Por qué ponéis 1.900 € si el contrato dice 1.999 € + IVA?</summary><p>Muchas búsquedas redondean a 1.900 o 1.990&nbsp;€. En factura verás el importe legal cerrado, sin % sobre el precio de venta del piso.</p></details>' +
    '<details><summary>¿Puedo ver todos los pasos antes de pagar?</summary><p>En esta página tienes el proceso explicado y la <strong>lista de ' +
    ACTION_COUNT +
    ' acciones</strong>. Si quieres valoración previa, usa el formulario o WhatsApp.</p></details>'
  );
}

function makeCityLanding(cityKey, extra = {}) {
  const vdRow = vd(cityKey);
  if (!vdRow) throw new Error(`No venta-digital-${cityKey}`);
  const slug = `vende-tu-piso-por-1900-euros-${cityKey}`;
  const name = vdRow.cityName;
  const base = {
    slug,
    cityKey,
    cityName: name,
    cityLabel: name,
    ventaDigitalSlug: vdRow.slug,
    navSub: `${name} · ~1.900 €`,
    registroCiudad: name,
    breadcrumbLabel: `Vende tu piso · ${name}`,
    switcherLabel: name,
    layoutVariant: 'guia',
    pageTitle: `Vende tu piso por 1.900 euros en ${name} · guía ilustrada · 1.999 € + IVA`,
    heroH1: `Vende tu piso en ${name} por ~1.900 €: guía con fotos de cada paso (plan digital 1.999 € + IVA)`,
    metaDescription: `vende tu piso por 1900 euros ${name}: checklist de ${ACTION_COUNT} acciones, pasos ilustrados y plan venta 100 % digital (1.999 € + IVA). Idealista, pisos.com y visitas cualificadas.`,
    keyword_principal: `vende tu piso por 1900 euros ${name.toLowerCase()}`,
    keyword_aliases: [
      `vender piso 1900 euros ${name.toLowerCase()}`,
      `vender piso por 1990 euros ${name.toLowerCase()}`,
      `inmobiliaria precio fijo ${name.toLowerCase()}`,
      `vender piso online barato ${name.toLowerCase()}`,
      vdRow.keyword_principal,
    ],
    priority: 0.94,
    areaServed: vdRow.areaServed,
    heroBadge: `Guía SEO precio fijo · ${name}`,
    heroImage: HERO_IMAGES[cityKey] || 'imagenes/interior11.jpg',
    marketLead: vdRow.marketLead,
    zones: vdRow.zones,
    priceExample: vdRow.priceExample,
    priceM2: vdRow.priceM2,
    avgDays: vdRow.avgDays,
    cardTeaser: `Línea ~1.900 € en ${name}: diseño propio + plan digital (1.999 € + IVA).`,
    localFaq: baseLocalFaq(`/${vdRow.slug}`, name),
    waText: `Hola, quiero vender mi piso en ${name} con el plan digital ~1.900 € (1.999 + IVA)`,
    footerBlurb: `Guía vende tu piso por ~1.900 € en ${name} · plan digital 1.999 € + IVA.`,
    seoExtra: `<h2>Vende tu piso en ${name} buscando «1.900 euros» de honorarios</h2>
<p>Esta URL convive con <a href="/${vdRow.slug}">venta digital ${name}</a>: mismo servicio, otro enfoque SEO. Ticket orientativo ${vdRow.priceExample.toLocaleString('es-ES')}&nbsp;€.</p>
<p>${(vdRow.zones || []).slice(0, 6).join(', ')} · ${vdRow.priceM2 || ''} · ${vdRow.avgDays || ''}</p>`,
    ctaSectionTitle: `Contratar plan digital en ${name}`,
  };
  return { ...base, ...extra };
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
  layoutVariant: 'guia',
  pageTitle: 'Vende tu piso por 1.900 euros · guía ilustrada · 1.999 € + IVA',
  heroH1:
    'Vende tu piso por 1.900 euros: 8 pasos con fotos y lista completa de acciones (plan digital 1.999 € + IVA)',
  metaDescription:
    'vende tu piso por 1900 euros: línea SEO del plan venta 100 % digital (1.999 € + IVA). Guías por ciudad con diseños distintos: Barcelona, Madrid, Valencia, Sevilla, Málaga, Cádiz, Bilbao, Zaragoza.',
  keyword_principal: 'vende tu piso por 1900 euros',
  keyword_aliases: [
    'vende tu piso por 1990 euros',
    'vender piso por 1900 euros',
    'inmobiliaria precio fijo 1900 euros',
    'vender piso online precio fijo',
  ],
  priority: 0.95,
  areaServed: 'España (39 ciudades · plan venta digital)',
  heroBadge: 'Segunda línea SEO · mismo servicio digital',
  heroImage: 'imagenes/interior11.jpg',
  marketLead:
    'Reforzamos búsquedas «1.900–1.990 €» con landings distintas por ciudad (checklist, pilares, zonas…). Contrato: venta 100 % digital · 1.999 € + IVA.',
  zones: ['Barcelona', 'Madrid', 'Valencia', 'Sevilla', 'Málaga', 'Cádiz', 'Bilbao', 'Zaragoza'],
  priceExample: 280000,
  cardTeaser: 'Hub SEO precio fijo ~1.900 € · varias guías por ciudad (1.999 € + IVA).',
  localFaq:
    baseLocalFaq('/venta-digital', 'España') +
    '<details><summary>¿Qué ciudades tienen guía propia?</summary><p>Barcelona, Madrid, Valencia, Sevilla, Málaga, Cádiz, Bilbao y Zaragoza — cada una con título y bloques diferentes.</p></details>',
  waText: 'Hola, quiero la guía vende tu piso por ~1.900 € (plan digital 1.999 + IVA)',
  footerBlurb: 'Línea SEO vende tu piso por ~1.900 € · plan digital 1.999 € + IVA.',
  seoExtra: `<h2>Dos familias de URL</h2>
<p><code>/venta-digital-*</code> (ficha ciudad) y <code>/vende-tu-piso-por-1900-euros-*</code> (intención precio). Misma operativa.</p>`,
  ctaSectionTitle: 'Contratar venta digital por honorarios fijos',
};

const VENDE_PISO_1900_LANDINGS = [
  VENDE_PISO_1900_NATIONAL,
  makeCityLanding('barcelona'),
  makeCityLanding('madrid'),
  makeCityLanding('valencia'),
  makeCityLanding('sevilla', {
    layoutVariant: 'checklist-first',
    pageTitle: 'Vender piso en Sevilla sin comisión del 6 % · plan 1.999 € + IVA',
    heroH1: 'Vender piso en Sevilla sin pagar el 6 %: checklist primero, plan digital 1.999 € + IVA',
    heroBadge: 'Sevilla · checklist y mitos desmontados',
    heroCtaPrimary: '#todas-las-acciones',
    heroCtaPrimaryLabel: 'Ver checklist completo',
    keyword_principal: 'vender piso sevilla sin comision 1900 euros',
    cardTeaser: 'Sevilla: checklist antes que storytelling · plan ~1.900 € (1.999 + IVA).',
    myths: [
      { myth: 'En Sevilla solo se vende con exclusiva al 3 %', fact: 'El plan digital es precio fijo nacional: mismos portales y panel sin % sobre venta.' },
      { myth: '1.900 € no incluye negociación', fact: 'Incluye filtro, visitas cualificadas, arras y coordinación hasta escritura.' },
      { myth: 'En Triana o Nervión hace falta agencia de barrio', fact: 'Valoramos con comparables de tu zona; difusión en Idealista y pisos.com.' },
    ],
  }),
  makeCityLanding('malaga', {
    layoutVariant: 'pilares',
    pageTitle: 'Inmobiliaria barata Málaga · vende por 1.999 € + IVA (búsquedas 1.900 €)',
    heroH1: 'Inmobiliaria barata en Málaga que no cobra comisión: 1.999 € + IVA, tú en las visitas',
    heroBadge: 'Málaga · Costa y ciudad · 4 pilares en foto',
    heroCtaPrimary: '#pasos-ilustrados',
    heroCtaPrimaryLabel: 'Ver pilares del servicio',
    keyword_principal: 'inmobiliaria barata malaga vender piso 1900',
    cardTeaser: 'Málaga: 4 pilares visuales + pasos ilustrados · honorarios fijos.',
    pillars: [
      { img: 'imagenes/interior12.webp', t: 'Costa y capital', p: 'Málaga ciudad, Teatinos, El Palo o la costa: mismo plan digital.' },
      { img: 'imagenes/comercial2.jpg', t: 'Demanda filtrada', p: 'Segunda residencia y compradores con hipoteca revisada antes de visita.' },
      { img: 'imagenes/pexels-kampus-8428067.jpg', t: 'Anuncio pro', p: 'Foto, vídeo y copy para destacar frente al portal particular.' },
      { img: 'imagenes/contrato1.jpg', t: 'Cierre legal', p: 'Arras y escritura con expediente en panel, no solo WhatsApp.' },
    ],
  }),
  makeCityLanding('cadiz', {
    layoutVariant: 'compact4',
    pageTitle: 'Vende tu casa en Cádiz con honorarios cerrados · guía 4 pasos · 1.999 € + IVA',
    heroH1: 'Vende tu casa en Cádiz y la bahía: 4 pasos con foto + checklist (plan ~1.900 €)',
    heroBadge: 'Cádiz · Bahía · formato compacto',
    heroCtaPrimary: '#pasos-ilustrados',
    heroCtaPrimaryLabel: 'Ver 4 pasos clave',
    keyword_principal: 'vender casa cadiz honorarios cerrados 1900 euros',
    cardTeaser: 'Cádiz: recorrido visual en 4 tarjetas + tabla de acciones.',
    compactStepIndexes: [0, 3, 5, 7],
  }),
  makeCityLanding('bilbao', {
    layoutVariant: 'split-equipo',
    pageTitle: 'Agencia precio fijo Bilbao · vender piso ~1.900 € · 1.999 € + IVA',
    heroH1: 'Agencia a precio fijo en Bilbao: tú abres la puerta, NH gestiona el resto (1.999 € + IVA)',
    heroBadge: 'Bilbao · Gran Bilbao · NH vs propietario',
    heroCtaPrimary: '#pasos-ilustrados',
    heroCtaPrimaryLabel: 'Ver reparto de tareas',
    keyword_principal: 'agencia precio fijo bilbao vender piso 1900',
    cardTeaser: 'Bilbao: bloque NH vs tú con fotos + proceso ilustrado.',
  }),
  makeCityLanding('zaragoza', {
    layoutVariant: 'zonas-texto',
    pageTitle: 'Vender piso en Zaragoza por menos de 2.000 € de gestión · 1.999 € + IVA',
    heroH1: 'Vender piso en Zaragoza por menos de 2.000 € de gestión: lista de fases y zonas',
    heroBadge: 'Zaragoza · mapa de zonas + proceso en texto',
    heroClass: 'nh-vp1900-hero--centered',
    hideHeroSavings: false,
    heroCtaPrimary: '#todas-las-acciones',
    heroCtaPrimaryLabel: 'Ver todas las acciones',
    keyword_principal: 'vender piso zaragoza menos 2000 euros gestion',
    cardTeaser: 'Zaragoza: zonas destacadas + 8 fases sin galería repetida.',
  }),
];

const VENDE_PISO_1900 = VENDE_PISO_1900_NATIONAL;

module.exports = {
  VENDE_PISO_1900,
  VENDE_PISO_1900_NATIONAL,
  VENDE_PISO_1900_LANDINGS,
};