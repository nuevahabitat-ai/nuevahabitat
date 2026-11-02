/**
 * Genera landings «venta piso económica {zona}» (layout economica-hub) desde JSON de barrio.
 * Uso: node scripts/scaffold-economica-barrios.js
 *      node scripts/scaffold-economica-barrios.js vender-sants vender-eixample ...
 */
const fs = require('fs');
const path = require('path');
const { applyVisibleDifferentiators } = require('./intencion-micro-differentiate.js');

const ROOT = path.join(__dirname, '..');
const BARRIO_DIR = path.join(ROOT, 'content/landings/barrio');
const OUT_DIR = path.join(ROOT, 'content/landings/intencion');

const DEFAULT_BARRIOS = [
  'vender-sants',
  'vender-les-corts',
  'vender-eixample',
  'vender-gracia',
  'vender-sarria',
  'vender-poblenou',
  'vender-sant-antoni',
  'vender-horta',
  'vender-sant-marti',
  'vender-l-hospitalet',
];

function barrioToEconSlug(barrioSlug) {
  let zone = barrioSlug.replace(/^vender-piso-/, '').replace(/^vender-/, '');
  if (zone.endsWith('-barcelona')) zone = zone.slice(0, -'-barcelona'.length);
  return `venta-piso-economica-${zone}-barcelona`;
}

function fmtEuro(n) {
  return Math.round(n).toLocaleString('es-ES');
}

function intencionPrecioFijoSlug(barrio) {
  const map = {
    "L'Hospitalet": 'inmobiliaria-precio-fijo-l-hospitalet-barcelona',
    'Sant Martí': 'inmobiliaria-precio-fijo-sant-marti-barcelona',
    'Sant Antoni': 'inmobiliaria-precio-fijo-sant-antoni-barcelona',
  };
  if (map[barrio]) return map[barrio];
  const slug = barrio.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `inmobiliaria-precio-fijo-${slug}-barcelona`;
}

const { extraWordsBlock } = require('./scaffold-intencion-precio-fijo.js');

function extraEconomicaPadBlock(B) {
  const barrio = B.barrio || '';
  const z1 = (B.zonas && B.zonas[0]) || barrio;
  const cps = (B.postalCodes || []).join(', ') || 'Barcelona';
  return (
    `<h2>Negociación sin presión por captación</h2><p>Al no cobrar porcentaje sobre el precio de venta, no tenemos incentivo para inflar el ticket en ${barrio}. Te asesoramos sobre ofertas reales, plazos del comprador y condiciones de arras — la decisión final sigue siendo tuya.</p>` +
    `<h2>Mandato y exclusiva</h2><p>Explicamos por escrito duración, obligaciones y qué ocurre si vendes por tu cuenta durante el mandato. Muchos propietarios en ${z1} prefieren claridad antes de abrir la puerta; respondemos antes de la primera visita.</p>` +
    `<h2>Revisión de precio con datos</h2><p>Si tras varias semanas no hay oferta financiada, revisamos comparables en ${cps} y ajustamos estrategia (precio, staging, horarios de visita). Venta económica no significa quedarse meses con un precio irreal.</p>` +
    `<h2>Herencias y segundas viviendas</h2><p>Herederos, usufructo o titulares no residentes: centralizamos documentación en panel para que todos vean visitas y ofertas. Útil cuando hay varios decisores lejos de ${barrio}.</p>` +
    `<h2>Seguridad en visitas</h2><p>Identificamos comprador y agencia antes de la cita; registramos hora y feedback. En micro-zonas demandadas como ${z1} reduce visitas repetidas de curiosos sin solvencia.</p>`
  );
}

function buildArgumento(B, econSlug) {
  const barrio = B.barrio || B.slug.replace(/^vender-/, '');
  const venderSlug = B.slug;
  const precio = B.ejemploPrecio || 400000;
  const com6 = Math.round(precio * 0.06 * 1.21);
  const ahorro = Math.max(com6 - 3630, 15000);
  const m2 = (B.datosMercado && B.datosMercado.precioM2) || '—';
  const tiempo = (B.datosMercado && B.datosMercado.tiempoVenta) || '55 – 90 días';
  const zonas = (B.zonas || []).slice(0, 4).join(', ');
  const cps = (B.postalCodes || []).join(', ');
  const z1 = (B.zonas && B.zonas[0]) || barrio;
  const pfSlug = intencionPrecioFijoSlug(barrio);
  const perfil = B.perfilComprador || '';
  const tipologia = B.tipologiaEdificios || '';
  const tendencia = (B.datosMercado && B.datosMercado.tendencia) || '';

  return (
    `<p><strong>Venta de piso económica en ${barrio}</strong> (${cps || 'Barcelona'}) — foco <strong>${z1}</strong>${tendencia ? ': ' + tendencia : ''}. «Económica» aquí significa <strong>honorarios contenidos</strong>, no regalar el inmueble: <strong>3.000 € + IVA (3.630 € en escritura)</strong> solo en escritura frente a ~<strong>${fmtEuro(com6)} €</strong> (6% + IVA sobre ${fmtEuro(precio)} €). Distinta de <a href="/${venderSlug}">vender piso en ${barrio}</a> y de <a href="/${pfSlug}">inmobiliaria precio fijo ${barrio}</a>.</p>` +
    `<p>Pilar ciudad: <a href="/venta-piso-economica-barcelona">venta económica Barcelona</a> · <a href="/inmobiliaria-para-particulares-barcelona">inmobiliaria para particulares</a>.</p>` +
    `<h2>${z1}: mercado local (${m2})</h2><p>Rango orientativo ${m2}; plazos habituales ${tiempo}. ${tendencia} Ahorro en intermediación: más de <strong>${fmtEuro(ahorro)} €</strong> vs 6%. <a href="#calc">Calculadora venta económica</a>.</p>` +
    `<p>${perfil}</p>` +
    `<h2>Tipología de edificios en ${barrio}</h2><p>${tipologia}</p>` +
    (zonas ? `<h2>Micro-zonas: ${zonas}</h2><p>Valorar con comparables de ${cps || 'tu CP'}, no con la media de Barcelona. En venta económica el margen lo pierdes si el precio de salida está mal — por eso priorizamos calle a calle en ${z1}.</p>` : '') +
    `<h2>Honorarios fijos: la venta más barata en coste de agencia</h2><p>Cobro únicamente si hay escritura. Sin venta, 0 € de honorarios. Comparativa: <a href="/nuevahabitat-vs-agencia-tradicional-barcelona">NuevaHabitat vs agencia tradicional</a>, <a href="/nuevahabitat-vs-idealista-particular">vs Idealista solo</a>, <a href="/vender-como-particular-barcelona">vender como particular</a>.</p>` +
    `<h2>Panel vendedor en ${barrio}</h2><p>Visitas registradas, calendario en tus franjas, documentación del expediente, ofertas y arras visibles. Intermediación profesional sin que el coste escale con el ticket de venta.</p><ul><li>Feedback tras cada visita.</li><li>PDF comunidad, energético, nota simple.</li><li>Comprador con solvencia antes de abrir la puerta.</li><li>Seguimiento hasta notaría desde Les Corts.</li></ul>` +
    `<h2>Cartera de compradores (no solo portal)</h2><p>Difusión a clientes con hipoteca preaprobada o liquidez contrastada. El anuncio en portal puede complementar, pero no sustituye el filtro de solvencia — clave cuando buscas cerrar sin meses de curiosos.</p>` +
    `<h2>Reportaje y ficha honesta</h2><p>En ${barrio} el comprador compara varios pisos el mismo fin de semana. Fotografiamos luz real y distribución; una ficha transparente acorta negociación y evita visitas inútiles.</p>` +
    `<h2>Documentación antes de arras</h2><p>Nota simple, certificado energético, ITE si aplica, actas de comunidad y plusvalía: anticipar sorpresas evita caídas tras arras — especialmente con compradores exigentes en ${z1}.</p>` +
    `<h2>Proceso venta económica en ${barrio}</h2><ol><li>Valoración con comparables locales.</li><li>Alta en panel vendedor.</li><li>Difusión a compradores cualificados.</li><li>Visitas en tus franjas.</li><li>Arras y documentación centralizada.</li><li>Escritura: cobro fijo solo si cierras.</li></ol>` +
    `<h2>Hipoteca pendiente y neto real</h2><p>Plusvalía, cancelación de hipoteca y comisiones bancarias mueven el neto. <a href="/vender-piso-hipoteca-pendiente-barcelona">Guía hipoteca pendiente</a>. Te ayudamos a ordenar el expediente; la decisión fiscal sigue siendo tuya con tu gestor.</p>` +
    `<h2>Cuándo tiene sentido la venta económica</h2><p>Si el 6% sobre ${fmtEuro(precio)} € no te cuadra, si llevas semanas en portal sin oferta financiada, o si quieres panel y registro sin exclusiva abusiva. Si solo quieres probar anuncio sin filtro, puedes empezar solo y reevaluar.</p>` +
    `<h2>Preguntas antes de firmar</h2><p>¿Total a pagar a tu precio objetivo? ¿Solo en escritura? ¿Filtran hipoteca? ¿Panel y cartera? NuevaHabitat responde por escrito antes de empezar.</p>` +
    `<h2>URLs distintas para Google</h2><p>Esta landing captura «venta piso económica ${barrio}»; precio fijo captura «inmobiliaria precio fijo»; la guía de barrio captura «vender piso». Contenido, calculadora y CTA alineados — sin confundir intenciones de búsqueda.</p>` +
    extraWordsBlock(B) +
    extraEconomicaPadBlock(B) +
    `<h2>Próximo paso</h2><p>Formulario o WhatsApp en esta página; respuesta en 24 h. Slug SEO: ${econSlug}.</p>`
  );
}

function buildLanding(barrioSlug) {
  const econSlug = barrioToEconSlug(barrioSlug);
  const outPath = path.join(OUT_DIR, econSlug + '.json');
  const force = process.argv.includes('--force');
  if (fs.existsSync(outPath) && !force) {
    console.log('SKIP (exists):', econSlug);
    return;
  }

  const srcPath = path.join(BARRIO_DIR, barrioSlug + '.json');
  if (!fs.existsSync(srcPath)) {
    console.error('MISSING barrio JSON:', barrioSlug);
    return;
  }

  const B = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const barrio = B.barrio || barrioSlug.replace(/^vender-/, '');
  const precio = B.ejemploPrecio || 400000;
  const tiempoVenta = (B.datosMercado && B.datosMercado.tiempoVenta) || '4–8 meses';
  const com6 = Math.round(precio * 0.06 * 1.21);
  const ahorro = Math.max(com6 - 3630, 12000);
  const kw = `venta de piso economica ${barrio.toLowerCase()} barcelona`;
  const heroImg = B.heroImage || 'imagenes/familia10.jpg';
  const heroAlt = B.heroImageAlt || `Venta económica piso ${barrio} Barcelona`;
  const zonasLead = (B.zonas || []).slice(0, 3).map((z) => `<strong>${z}</strong>`).join(', ');
  const pfSlug = intencionPrecioFijoSlug(barrio);

  const L = {
    slug: econSlug,
    cluster: 'intencion',
    layout: 'economica-hub',
    indexable: true,
    barrio,
    keyword_principal: kw,
    keyword_aliases: [
      `vender piso ${barrio.toLowerCase()} honorarios bajos`,
      `venta piso economica ${barrio.toLowerCase()}`,
      `inmobiliaria economica ${barrio.toLowerCase()} barcelona`,
      `vender sin pagar 6 por ciento ${barrio.toLowerCase()}`,
    ],
    footerLabel: `Venta económica ${barrio}`,
    breadcrumbCurrent: `Venta económica ${barrio}`,
    priority: 0.91,
    origen_lead: econSlug,
    postalCodes: B.postalCodes,
    zonas: B.zonas,
    meta: {
      title: `Venta de piso económica en ${barrio} · 3.000 € + IVA (3.630 € en escritura) honorarios · NuevaHabitat`,
      description: `Vende tu piso en ${barrio} con honorarios fijos 3.000 € + IVA (3.630 € en escritura) (solo en escritura). Comparativa vs 6%, compradores cualificados y panel vendedor. ${(B.zonas || []).slice(0, 2).join(', ')}.`,
      keywords: kw,
    },
    hero: {
      badge: `${barrio} · Venta económica · Precio fijo`,
      h1: `Venta de piso económica en ${barrio}: 3.000 € + IVA (3.630 € en escritura) en escritura, no un 6% sobre tu venta`,
      lead: `¿Vendes en ${zonasLead || barrio} sin regalar <strong>${fmtEuro(Math.round(com6 * 0.85))}–${fmtEuro(com6)} €</strong> en comisión? <strong>NuevaHabitat</strong>: <strong>honorarios fijos</strong>, <strong>cartera de compradores</strong> y <strong>panel vendedor</strong> — cobro <strong>solo en escritura</strong>. Guía: <a href="/${B.slug}">vender en ${barrio}</a>.`,
      image: heroImg,
      imageAlt: heroAlt,
    },
    heroStats: [
      { label: 'NuevaHabitat', value: '3.000 € + IVA (3.630 € en escritura)', note: 'Honorarios fijos · solo en escritura', highlight: true },
      { label: 'Agencia tradicional ~6%', value: `~${fmtEuro(com6)} €`, note: `En venta de ${fmtEuro(precio)} € + IVA` },
      { label: 'Ahorro orientativo', value: `>${fmtEuro(ahorro)} €`, note: 'Dinero que conservas en notaría', highlight: true },
    ],
    argumento_principal: buildArgumento(B, econSlug),
    calculadora: {
      precioDefault: precio,
      titulo: `Calculadora ${barrio}: venta económica vs comisión 6%`,
      subtitulo: `Precio orientativo ${fmtEuro(precio)} € (${(B.datosMercado && B.datosMercado.precioM2) || 'mercado local'}). Compara 3%–6% + IVA con 3.000 € + IVA (3.630 € en escritura) fijos solo en escritura.`,
    },
    como_ayudamos: {
      title: `Venta económica con acompañamiento en ${barrio}`,
      description: `Honorarios fijos, compradores cualificados y panel vendedor en ${barrio}.`,
      steps: [
        { title: 'Valoración local', body: `Comparables ${barrio}; 3.000 € + IVA (3.630 € en escritura) solo en escritura por escrito.` },
        { title: 'Cartera activa', body: 'Difusión a compradores con hipoteca o liquidez verificada.' },
        { title: 'Panel vendedor', body: 'Visitas, documentos y ofertas centralizados.' },
        { title: 'Visitas filtradas', body: 'Solo solvencia contrastada entra a tu casa.' },
        { title: 'Negociación hasta arras', body: 'Acompañamiento legal y documentación del comprador.' },
        { title: 'Escritura: cobro fijo', body: '3.000 € + IVA (3.630 € en escritura) solo si vendes. Sin venta, 0 € de honorarios.' },
      ],
    },
    comparativa_modelos: {
      title: `Comparativa real en ${barrio}: ¿cuál es la venta más económica?`,
      rows: [
        { modelo: 'Particular en Idealista / Fotocasa', tiempo: 'Impredecible (3–12+ meses)', coste: 'Anuncio + horas tuyas', riesgo: 'Curiosos, precio mal fijado', tipo: 'neutral' },
        { modelo: 'Agencia tradicional ~6% + IVA', tiempo: tiempoVenta, coste: `>${fmtEuro(Math.round(precio * 0.06 * 1.21))} € en piso ${fmtEuro(precio)}`, riesgo: 'Exclusiva; pagas aunque vendas tú', tipo: 'lose' },
        { modelo: 'Low-cost online', tiempo: 'Variable', coste: 'Cuota o % reducido', riesgo: 'Poco filtro de compradores', tipo: 'neutral' },
        { modelo: `NuevaHabitat venta económica ${barrio}`, tiempo: '60–90 días habitual', coste: '3.000 € + IVA (3.630 € en escritura) solo en escritura', riesgo: 'Sin venta, sin factura', tipo: 'win' },
      ],
    },
    mitos: {
      title: `Mitos sobre vender barato (de verdad) en ${barrio}`,
      items: [
        { mito: 'Venta económica = vender el piso por poco dinero', realidad: 'Honorarios contenidos, no regalar el inmueble por debajo de mercado.' },
        { mito: 'Sin comisión 6% no hay servicio profesional', realidad: 'Incluye valoración, fotos, cartera, visitas, negociación y escritura.' },
        { mito: 'En ' + barrio + ' los portales traen mejores compradores', realidad: 'Traen volumen; filtramos solvencia antes de la visita.' },
        { mito: 'Todas las inmobiliarias económicas son iguales', realidad: 'Compara: ¿cobro solo en escritura? ¿Panel? ¿Cartera propia?' },
        { mito: `El 6% es inevitable en ${barrio}`, realidad: `Precio fijo 3.000 € + IVA (3.630 € en escritura) — ahorro >${fmtEuro(ahorro)} € en muchos tickets locales.` },
      ],
    },
    checklist: {
      title: `Checklist venta económica en ${barrio}`,
      intro: 'Antes de firmar con cualquier agencia — o seguir solo en portal.',
      items: [
        '¿Cuánto pagaré en total si vendo a mi precio objetivo?',
        '¿Cobro solo en escritura o hay anticipos?',
        '¿Filtráis hipoteca antes de visitas?',
        '¿Hay panel vendedor y cartera de compradores?',
        `¿Comparables de mi calle en ${barrio}?`,
        '¿Qué pasa si no vendo?',
      ],
    },
    faq: [
      { q: `¿Qué es venta de piso económica en ${barrio}?`, a: 'Vender con coste de intermediación contenido: 3.000 € + IVA (3.630 € en escritura) fijos en NuevaHabitat, solo en escritura, frente a comisiones del 3%–6% + IVA.' },
      { q: `¿Cuánto ahorro vs agencia al 6% en ${barrio}?`, a: `En ${fmtEuro(precio)} €, orientativamente más de ${fmtEuro(ahorro)} €. Usa la calculadora de esta página.` },
      { q: '¿Cómo funciona NuevaHabitat?', a: 'Valoración → panel vendedor → compradores cualificados → visitas filtradas → arras → escritura. Cobro solo al cerrar.' },
      { q: '¿El comprador viene de Idealista?', a: 'No necesariamente. Priorizamos cartera activa con solvencia verificada en Barcelona y área metropolitana.' },
      { q: '¿Qué es el panel del vendedor?', a: 'Área privada con visitas, calendario, documentos, ofertas y contratos. Acceso web y móvil.' },
      { q: `¿Diferencia con /${B.slug}?`, a: `Esta landing es «venta económica ${barrio}»; la otra es guía general «vender piso en ${barrio}».` },
      { q: '¿Y si no vendo?', a: 'No pagas honorarios de agencia. El precio fijo solo aplica si hay escritura.' },
      { q: '¿Puedo probar a vender solo primero?', a: 'Sí. Valoración gratuita indica si conviene seguir en portal o activar compradores cualificados.' },
    ],
    relacionadas: [
      { slug: 'venta-piso-economica-barcelona', label: 'Venta económica Barcelona' },
      { slug: B.slug, label: `Vender ${barrio}` },
      { slug: pfSlug, label: `Precio fijo ${barrio}` },
      { slug: 'nuevahabitat-vs-agencia-tradicional-barcelona', label: 'Vs agencia tradicional' },
      { slug: 'vender-como-particular-barcelona', label: 'Vender como particular' },
      { slug: 'cuanto-vale-mi-piso-barcelona', label: 'Cuánto vale mi piso' },
    ],
    keywords_footer: `${kw} · honorarios fijos · vender sin 6% · panel vendedor · ${(B.zonas || []).slice(0, 2).join(' · ')}`,
    whatsappText: 'Hola%2C%20busco%20venta%20economica%20de%20mi%20piso%20en%20' + encodeURIComponent(barrio),
    formPlaceholder: `Zona en ${barrio}, m², precio orientativo`,
    form_side_text: `Cuéntanos barrio y situación en ${barrio} (particular, herencia, urgencia…). Te explicamos venta económica con 3.000 € + IVA (3.630 € en escritura) solo en escritura, cartera de compradores y panel vendedor — respuesta en 24 h.`,
  };

  applyVisibleDifferentiators(L, B, 'econ');
  fs.writeFileSync(outPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('Wrote', econSlug);
}

module.exports = { buildLanding, buildArgumento, barrioToEconSlug };

const args = process.argv.slice(2).filter((a) => a !== '--force');
const slugs = args.length ? args : DEFAULT_BARRIOS;
for (const s of slugs) buildLanding(s);
