/**
 * Landings intención «inmobiliaria para particulares {zona}» desde JSON barrio.
 * node scripts/scaffold-intencion-para-particulares.js vender-diagonal-mar-barcelona ...
 */
const fs = require('fs');
const path = require('path');
const { applyVisibleDifferentiators } = require('./intencion-micro-differentiate.js');

const ROOT = path.join(__dirname, '..');
const BARRIO_DIR = path.join(ROOT, 'content/landings/barrio');
const OUT_DIR = path.join(ROOT, 'content/landings/intencion');
function extraParticularBlock(B) {
  const barrio = B.barrio || '';
  const perfil = B.perfilComprador || '';
  const tipologia = B.tipologiaEdificios || '';
  const tendencia = (B.datosMercado && B.datosMercado.tendencia) || '';
  return (
    `<h2>Qué busca el comprador en ${barrio}</h2><p>${perfil}</p>` +
    `<h2>Edificios y estado del parque</h2><p>${tipologia}</p>` +
    `<h2>Tendencia reciente</h2><p>${tendencia}</p>` +
    `<h2>Idealista, Fotocasa y mandato</h2><p>Antes de firmar exclusiva, compara importe en escritura, filtrado de visitas y panel. Muchos particulares en ${barrio} mantienen anuncio en portal mientras prueban cartera cualificada — sin pagar 6% por adelantado.</p>` +
    `<h2>Valoración desde Les Corts</h2><p>Mejía Lequerica 42 — respuesta orientativa en 24 h laborables con comparables de tu calle, no solo “Barcelona”.</p>` +
    `<h2>Señales de que el precio no encaja</h2><p>En ${barrio}, muchas semanas con visitas pero cero ofertas con hipoteca suele indicar ticket mal calibrado o ficha incompleta — no falta de demanda. Revisar comparables, certificado energético y titular del anuncio antes de bajar precio a ciegas.</p>` +
    `<h2>Arras, plazos y comprador financiado</h2><p>Plazos de sesenta a noventa días son habituales si el comprador trae banco y documentación ordenada. Condiciones suspensivas claras protegen al particular que vende sin experiencia en operaciones previas.</p>` +
    `<h2>Separación, herencia y usufructo</h2><p>Vender siendo particular con varios titulares exige acuerdo previo sobre precio mínimo y firma. Ordenamos expediente antes de abrir visitas masivas para no malgastar tiempo ni generar ofertas bloqueadas.</p>`
  );
}

const SKIP_BARRIO = new Set(['vender-el-clot-la-sagrera-barcelona']);

function intencionSlugFromBarrio(barrioSlug) {
  if (SKIP_BARRIO.has(barrioSlug)) return null;
  let zone = barrioSlug.replace(/^vender-/, '').replace(/^piso-/, '');
  if (!zone.endsWith('-barcelona')) zone += '-barcelona';
  return 'inmobiliaria-para-particulares-' + zone;
}

function fmtEuro(n) {
  return Math.round(n).toLocaleString('es-ES');
}

function buildArgumento(B, intSlug, zoneSlug) {
  const barrio = B.barrio || B.slug.replace(/^vender-/, '');
  const venderSlug = B.slug;
  const precio = B.ejemploPrecio || 400000;
  const com6 = Math.round(precio * 0.06 * 1.21);
  const m2 = (B.datosMercado && B.datosMercado.precioM2) || '—';
  const tiempo = (B.datosMercado && B.datosMercado.tiempoVenta) || '55 – 90 días';
  const zonas = (B.zonas || []).slice(0, 4).join(', ');
  const cps = (B.postalCodes || []).join(', ');
  const perfil = B.perfilComprador || '';
  const tipologia = B.tipologiaEdificios || '';
  const tendencia = (B.datosMercado && B.datosMercado.tendencia) || '';
  const particularSlug = 'vender-como-particular-' + zoneSlug;
  const pfSlug = intSlug.replace('para-particulares', 'precio-fijo');

  return (
    `<p>La búsqueda <strong>inmobiliaria para particulares ${barrio}</strong> indica que ya probaste (o descartaste) vender solo en portal y quieres agencia con condiciones claras: <strong>3.000 € + IVA (3.630 €)</strong> solo en escritura, frente a más de <strong>${fmtEuro(com6)} €</strong> en comisión 6% + IVA sobre ${fmtEuro(precio)} €. Landing distinta de <a href="/${venderSlug}">vender piso en ${barrio}</a> y de <a href="/${pfSlug}">inmobiliaria precio fijo ${barrio}</a>.</p>` +
    `<p>Pilares: <a href="/inmobiliaria-para-particulares-barcelona">particulares Barcelona</a> · <a href="/${particularSlug}">vender como particular ${barrio}</a> · <a href="/nuevahabitat-vs-idealista-particular">vs Idealista</a>.</p>` +
    `<h2>Agencia para el propietario particular en ${barrio}</h2><p>No buscas franquicia nacional ni comisión opaca: buscas importe cerrado en escritura, panel vendedor y visitas con hipoteca o liquidez contrastada antes de abrir la puerta.</p>` +
    `<h2>¿Puedo seguir publicando en Idealista?</h2><p>Sí: muchos particulares en ${barrio} combinan portal y cartera de compradores cualificados. Evitas pagar un 6% si cierras con comprador filtrado por NuevaHabitat.</p>` +
    `<h2>Particular en ${(B.zonas && B.zonas[0]) || barrio}: ${m2}</h2><p>Rango orientativo ${m2}; plazos habituales ${tiempo}. ${tendencia}</p><p>${perfil}</p>` +
    `<h2>Tipología en ${barrio}</h2><p>${tipologia}</p>` +
    (zonas ? `<h2>Micro-zonas: ${zonas}</h2><p>Valorar con comparables de ${cps || 'tu CP'}, no con la media de Barcelona. El particular que copia el anuncio más caro del portal suele alargar semanas sin oferta financiable.</p>` : '') +
    `<h2>Panel vendedor y documentación</h2><p>Sube nota simple, certificado energético, actas y ofertas en un solo expediente. Visitas en tus franjas, registro por cita y feedback tras cada visita.</p>` +
    `<h2>Filtrado de solvencia</h2><p>Priorizamos compradores con hipoteca preaprobada o liquidez acreditada. Menos curiosos un sábado, más arras con plazo realista.</p>` +
    `<h2>Honorarios: 3.630 € en escritura</h2><p>Sobre ${fmtEuro(precio)} €, el 6% + IVA supera ${fmtEuro(com6)} €; el importe fijo protege tu neto si el comprador negocia. <a href="#calc">Calculadora</a> en esta página.</p>` +
    `<h2>Particular vs agencia tradicional</h2><p><a href="/nuevahabitat-vs-agencia-tradicional-barcelona">Comparativa 6%</a> · <a href="/vender-por-tu-cuenta-vs-nuevahabitat-barcelona">vender por tu cuenta vs NuevaHabitat</a> · <a href="/vender-piso-sin-exclusividad-barcelona">sin exclusiva larga</a>.</p>` +
    `<h2>Herencia, alquiler o varios titulares</h2><p>Si vendes por <a href="/vender-piso-herencia-barcelona">herencia</a>, con <a href="/vender-piso-alquilado-barcelona">inquilino</a> o entre hermanos, ordenamos papeles y calendario antes de masificar visitas.</p>` +
    `<h2>Proceso en ${barrio}</h2><ol><li>Valoración con comparables locales.</li><li>Condiciones por escrito (3.630 € solo en escritura).</li><li>Alta en panel vendedor.</li><li>Difusión a cartera cualificada.</li><li>Visitas y ofertas trazables.</li><li>Escritura: cobro solo si cierras.</li></ol>` +
    `<h2>Checklist antes de firmar mandato</h2><ol><li>¿Importe total en escritura?</li><li>¿Filtran hipoteca?</li><li>¿Panel incluido?</li><li>¿Exclusiva obligatoria?</li><li>¿Comparables de mi calle?</li></ol>` +
    `<h2>Preguntas frecuentes del particular</h2><p><strong>¿Cuánto cuesta?</strong> 3.000 € + IVA (3.630 €) solo en escritura; sin venta, no pagas honorarios de agencia.</p><p><strong>¿Atendéis desde Les Corts?</strong> Sí — Mejía Lequerica 42; visitas concertadas en ${barrio}.</p>` +
    `<h2>Errores típicos del particular en ${barrio}</h2><p>Precio copiado de otro barrio, fotos oscuras, abrir visitas sin carta bancaria y firmar exclusiva 6% tras agotar el portal. Corregir pricing con comparables locales suele valer más que un segundo pack destacado.</p>` +
    `<h2>Reportaje y titular del anuncio</h2><p>El titular debe nombrar ${barrio} o micro-zona (${zonas || 'tu calle'}), no solo «Barcelona centro». Compradores filtrados llegan con expectativas alineadas.</p>` +
    `<h2>Cartera y portal combinados</h2><p>Puedes mantener Idealista o Fotocasa mientras activamos compradores de cartera con solvencia verificada. Pagas 3.630 € solo si cierras — no un porcentaje sobre el precio final.</p>` +
    `<h2>Plusvalía, herencia y neto</h2><p>Herencia entre hermanos, plusvalía municipal o piso alquilado cambian el neto aceptable. <a href="/vender-piso-herencia-barcelona">Herencia</a> · <a href="/vender-piso-alquilado-barcelona">Alquilado</a>.</p>` +
    `<h2>Visitas en tus horarios</h2><p>Marcas franjas en panel; no agendamos sábados completos sin filtro previo. Feedback tras cada visita para ajustar precio o ficha.</p>` +
    `<h2>Coordinación hasta notaría</h2><p>Arras con plazo realista (60–90 días), condiciones suspensivas claras y documentación del comprador centralizada antes de señal grande.</p>` +
    `<h2>Próximo paso en ${barrio}</h2><p>Formulario o WhatsApp; valoración orientativa en 24 h laborables. Slug: ${intSlug}.</p>` +
    `<h2>Landings distintas para Google</h2><p>Esta URL captura «inmobiliaria para particulares ${barrio}»; la guía <a href="/${particularSlug}">vender como particular</a> captura al propietario en portal; <a href="/${venderSlug}">vender en ${barrio}</a> es servicio de barrio. Contenido, calculadora y CTA alineados con honorarios 3.630 €.</p>` +
    extraParticularBlock(B)
  );
}

function buildLanding(barrioSlug) {
  const intSlug = intencionSlugFromBarrio(barrioSlug);
  if (!intSlug) {
    console.log('SKIP (sin slug):', barrioSlug);
    return;
  }
  const outPath = path.join(OUT_DIR, intSlug + '.json');
  if (fs.existsSync(outPath)) {
    console.log('SKIP (exists):', intSlug);
    return;
  }
  const barrioPath = path.join(BARRIO_DIR, barrioSlug + '.json');
  if (!fs.existsSync(barrioPath)) {
    console.log('SKIP (no barrio json):', barrioSlug);
    return;
  }
  const B = JSON.parse(fs.readFileSync(barrioPath, 'utf8'));
  const barrio = B.barrio || barrioSlug.replace(/^vender-/, '');
  const label = barrio.replace(/-/g, ' ');
  const precio = B.ejemploPrecio || 400000;
  const kw = `inmobiliaria para particulares ${label.toLowerCase()} barcelona`;
  const heroImg = B.heroImage || 'imagenes/comercial2.jpg';
  const heroAlt = B.heroImageAlt || `Inmobiliaria para particulares ${barrio}`;
  let zoneSlug = barrioSlug.replace(/^vender-/, '').replace(/^piso-/, '');
  if (!zoneSlug.endsWith('-barcelona')) zoneSlug += '-barcelona';
  const particularSlug = 'vender-como-particular-' + zoneSlug;
  const pfSlug = intSlug.replace('para-particulares', 'precio-fijo');

  const L = {
    slug: intSlug,
    cluster: 'intencion',
    indexable: true,
    keyword_principal: kw,
    keyword_aliases: [
      `agencia inmobiliaria para vender piso ${label.toLowerCase()}`,
      `inmobiliaria vendedores particulares ${label.toLowerCase()}`,
      `vender piso particular con agencia ${label.toLowerCase()}`,
    ],
    footerLabel: `Particulares ${barrio}`,
    priority: 0.88,
    origen_lead: intSlug,
    cardTeaser: `Inmobiliaria para propietarios particulares en ${barrio}: 3.630 € solo en escritura, panel vendedor y compradores filtrados.`,
    meta: {
      title: `Inmobiliaria para particulares en ${barrio} · 3.630 € · NuevaHabitat`,
      description: `¿Buscas inmobiliaria para vender siendo particular en ${barrio}? 3.000 € + IVA (3.630 €) solo al cerrar, panel del vendedor y calculadora vs 6%.`,
      keywords: kw,
    },
    hero: {
      badge: `${barrio} · Propietario particular`,
      h1: `Inmobiliaria para particulares en ${barrio}: 3.630 € en escritura, no un 6% sobre tu piso`,
      lead: `Eres <strong>propietario particular</strong> en <strong>${barrio}</strong>. <strong>NuevaHabitat</strong>: <strong>3.000 € + IVA (3.630 €)</strong> solo en escritura, <strong>panel vendedor</strong> y visitas con solvencia verificada. Guía: <a href="/${particularSlug}">particular ${barrio}</a>.`,
      image: heroImg,
      imageAlt: heroAlt,
    },
    breadcrumbCurrent: `Particulares ${barrio}`,
    argumento_principal: buildArgumento(B, intSlug, zoneSlug),
    calculadora: {
      precioDefault: precio,
      titulo: `Calculadora particulares ${barrio}: 6% vs NuevaHabitat`,
      subtitulo: 'Compara comisión habitual con 3.630 € fijos solo en escritura.',
    },
    como_ayudamos: {
      title: `Particulares en ${barrio} — proceso claro`,
      description: 'De valoración a escritura con coste cerrado.',
      steps: [
        { title: 'Valoración', body: `Comparables locales en ${barrio}.` },
        { title: 'Condiciones', body: '3.630 € solo en escritura por escrito.' },
        { title: 'Panel', body: 'Visitas, docs y ofertas centralizados.' },
        { title: 'Cartera', body: 'Compradores con solvencia contrastada.' },
        { title: 'Arras', body: 'Negociación y expediente comprador.' },
        { title: 'Escritura', body: 'Sin venta, sin factura de agencia.' },
      ],
    },
    comparativa_modelos: {
      title: `Particular en ${barrio}: portal vs 6% vs NuevaHabitat`,
      rows: [
        { modelo: 'Particular en portal', tiempo: 'Variable', coste: 'Anuncio + sábados', riesgo: 'Curiosos', tipo: 'neutral' },
        { modelo: 'Agencia ~6% + IVA', tiempo: '4–8 meses', coste: `>${fmtEuro(Math.round(precio * 0.06 * 1.21))} €`, riesgo: 'Exclusiva', tipo: 'lose' },
        { modelo: 'NuevaHabitat', tiempo: '60–90 días', coste: '3.000 € + IVA (3.630 €) escritura', riesgo: 'Sin venta, sin factura', tipo: 'win' },
      ],
    },
    mitos: {
      title: `Mitos particulares en ${barrio}`,
      items: [
        { mito: 'Portal basta', realidad: 'Filtrar solvencia cierra ventas.' },
        { mito: 'Toda agencia cobra 6%', realidad: 'Compara total y cuándo se cobra.' },
        { mito: 'Precio fijo es servicio mínimo', realidad: 'Incluye valoración, panel y arras.' },
      ],
    },
    checklist: {
      title: `Checklist particular ${barrio}`,
      intro: 'Antes de firmar.',
      items: ['¿3.630 € solo en escritura?', '¿Filtran hipoteca?', '¿Panel vendedor?', '¿Puedo seguir en portal?', '¿Exclusiva obligatoria?'],
    },
    faq: [
      { q: `¿Cuánto cuesta en ${barrio}?`, a: '3.000 € + IVA (3.630 €) solo en escritura.' },
      { q: '¿Qué es el panel vendedor?', a: 'Visitas, documentación y ofertas en expediente digital.' },
      { q: '¿Y si no vendo?', a: 'No pagas honorarios de agencia.' },
      { q: '¿Diferencia con precio fijo?', a: `Ver /${pfSlug} — misma tarifa, distinta intención de búsqueda.` },
    ],
    relacionadas: [
      { slug: B.slug, label: `Vender ${barrio}` },
      { slug: pfSlug, label: `Precio fijo ${barrio}` },
      { slug: particularSlug, label: `Particular ${barrio}` },
      { slug: 'inmobiliaria-para-particulares-barcelona', label: 'Particulares Barcelona' },
    ],
    keywords_footer: kw + ' · panel vendedor · 3.630 €',
    whatsappText: 'Hola%2C%20soy%20particular%20y%20busco%20agencia%20en%20' + encodeURIComponent(barrio),
    formPlaceholder: `Zona en ${barrio}, m²`,
    form_side_text: '3.630 € solo en escritura — valoración en 24 h.',
  };

  applyVisibleDifferentiators(L, B, 'pp');
  fs.writeFileSync(outPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('Wrote', intSlug);
}

module.exports = { buildLanding, intencionSlugFromBarrio, buildArgumento };

if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.log('Uso: node scripts/scaffold-intencion-para-particulares.js vender-...');
    process.exit(1);
  }
  for (const s of args) buildLanding(s);
}
