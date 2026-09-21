/**
 * Genera landings «venta piso económica {zona}» (layout economica-hub) desde JSON de barrio.
 * Uso: node scripts/scaffold-economica-barrios.js
 *      node scripts/scaffold-economica-barrios.js vender-sants vender-eixample ...
 */
const fs = require('fs');
const path = require('path');

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

function buildArgumento(B, econSlug) {
  const barrio = B.barrio || B.slug.replace(/^vender-/, '');
  const venderSlug = B.slug;
  const precio = B.ejemploPrecio || 400000;
  const com6 = Math.round(precio * 0.06 * 1.21);
  const ahorro = Math.max(com6 - 3630, 12000);
  const m2 = (B.datosMercado && B.datosMercado.precioM2) || '—';
  const zonasTxt = (B.zonas || []).slice(0, 4).join(', ');
  const pfSlug = intencionPrecioFijoSlug(barrio);
  const barrioCore = B.argumento_principal || '';

  return (
    `<p>¿Buscas <strong>venta de piso económica en ${barrio}</strong>? No vendemos por debajo de mercado — evitas pagar <strong>${fmtEuro(com6)} €</strong> de comisión (6% + IVA sobre ${fmtEuro(precio)} €). <strong>NuevaHabitat</strong> cobra <strong>3.630 €</strong> solo en escritura en ${zonasTxt || barrio}: honorarios fijos, panel vendedor y cartera de compradores cualificados.</p>` +
    `<p><a href="/venta-piso-economica-barcelona">Venta económica Barcelona</a> · <a href="/${venderSlug}">Vender piso ${barrio}</a> · <a href="/${pfSlug}">Precio fijo ${barrio}</a></p>` +
    `<h2>Honorarios en ${barrio}: ${fmtEuro(com6)} € vs 3.630 €</h2><p>Rango local ${m2}. Ahorro orientativo <strong>${fmtEuro(ahorro)} €</strong>. <a href="#calc">Calculadora</a> con tu precio estimado.</p>` +
    barrioCore +
    `<h2>Panel vendedor y venta económica en ${barrio}</h2><p>Visitas registradas, documentación centralizada, compradores con solvencia verificada antes de entrar a tu casa. Cobro 3.630 € únicamente si hay escritura — sin venta, 0 € de honorarios. Compara <a href="/nuevahabitat-vs-agencia-tradicional-barcelona">agencia tradicional</a> y <a href="/nuevahabitat-vs-idealista-particular">Idealista particular</a>.</p>` +
    `<h2>Próximo paso · ${econSlug}</h2><p>Calculadora, bloques «Qué hace NuevaHabitat» y formulario de valoración. Respuesta en 24 h laborables con condiciones por escrito.</p>`
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
      title: `Venta de piso económica en ${barrio} · 3.630 € honorarios · NuevaHabitat`,
      description: `Vende tu piso en ${barrio} con honorarios fijos 3.630 € (solo en escritura). Comparativa vs 6%, compradores cualificados y panel vendedor. ${(B.zonas || []).slice(0, 2).join(', ')}.`,
      keywords: kw,
    },
    hero: {
      badge: `${barrio} · Venta económica · Precio fijo`,
      h1: `Venta de piso económica en ${barrio}: 3.630 € en escritura, no un 6% sobre tu venta`,
      lead: `¿Vendes en ${zonasLead || barrio} sin regalar <strong>${fmtEuro(Math.round(com6 * 0.85))}–${fmtEuro(com6)} €</strong> en comisión? <strong>NuevaHabitat</strong>: <strong>honorarios fijos</strong>, <strong>cartera de compradores</strong> y <strong>panel vendedor</strong> — cobro <strong>solo en escritura</strong>. Guía: <a href="/${B.slug}">vender en ${barrio}</a>.`,
      image: heroImg,
      imageAlt: heroAlt,
    },
    heroStats: [
      { label: 'NuevaHabitat', value: '3.630 €', note: 'Honorarios fijos · solo en escritura', highlight: true },
      { label: 'Agencia tradicional ~6%', value: `~${fmtEuro(com6)} €`, note: `En venta de ${fmtEuro(precio)} € + IVA` },
      { label: 'Ahorro orientativo', value: `>${fmtEuro(ahorro)} €`, note: 'Dinero que conservas en notaría', highlight: true },
    ],
    argumento_principal: buildArgumento(B, econSlug),
    calculadora: {
      precioDefault: precio,
      titulo: `Calculadora ${barrio}: venta económica vs comisión 6%`,
      subtitulo: `Precio orientativo ${fmtEuro(precio)} € (${(B.datosMercado && B.datosMercado.precioM2) || 'mercado local'}). Compara 3%–6% + IVA con 3.630 € fijos solo en escritura.`,
    },
    como_ayudamos: {
      title: `Venta económica con acompañamiento en ${barrio}`,
      description: `Honorarios fijos, compradores cualificados y panel vendedor en ${barrio}.`,
      steps: [
        { title: 'Valoración local', body: `Comparables ${barrio}; 3.630 € solo en escritura por escrito.` },
        { title: 'Cartera activa', body: 'Difusión a compradores con hipoteca o liquidez verificada.' },
        { title: 'Panel vendedor', body: 'Visitas, documentos y ofertas centralizados.' },
        { title: 'Visitas filtradas', body: 'Solo solvencia contrastada entra a tu casa.' },
        { title: 'Negociación hasta arras', body: 'Acompañamiento legal y documentación del comprador.' },
        { title: 'Escritura: cobro fijo', body: '3.630 € solo si vendes. Sin venta, 0 € de honorarios.' },
      ],
    },
    comparativa_modelos: {
      title: `Comparativa real en ${barrio}: ¿cuál es la venta más económica?`,
      rows: [
        { modelo: 'Particular en Idealista / Fotocasa', tiempo: 'Impredecible (3–12+ meses)', coste: 'Anuncio + horas tuyas', riesgo: 'Curiosos, precio mal fijado', tipo: 'neutral' },
        { modelo: 'Agencia tradicional ~6% + IVA', tiempo: tiempoVenta, coste: `>${fmtEuro(Math.round(precio * 0.06 * 1.21))} € en piso ${fmtEuro(precio)}`, riesgo: 'Exclusiva; pagas aunque vendas tú', tipo: 'lose' },
        { modelo: 'Low-cost online', tiempo: 'Variable', coste: 'Cuota o % reducido', riesgo: 'Poco filtro de compradores', tipo: 'neutral' },
        { modelo: `NuevaHabitat venta económica ${barrio}`, tiempo: '60–90 días habitual', coste: '3.630 € solo en escritura', riesgo: 'Sin venta, sin factura', tipo: 'win' },
      ],
    },
    mitos: {
      title: `Mitos sobre vender barato (de verdad) en ${barrio}`,
      items: [
        { mito: 'Venta económica = vender el piso por poco dinero', realidad: 'Honorarios contenidos, no regalar el inmueble por debajo de mercado.' },
        { mito: 'Sin comisión 6% no hay servicio profesional', realidad: 'Incluye valoración, fotos, cartera, visitas, negociación y escritura.' },
        { mito: 'En ' + barrio + ' los portales traen mejores compradores', realidad: 'Traen volumen; filtramos solvencia antes de la visita.' },
        { mito: 'Todas las inmobiliarias económicas son iguales', realidad: 'Compara: ¿cobro solo en escritura? ¿Panel? ¿Cartera propia?' },
        { mito: `El 6% es inevitable en ${barrio}`, realidad: `Precio fijo 3.630 € — ahorro >${fmtEuro(ahorro)} € en muchos tickets locales.` },
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
      { q: `¿Qué es venta de piso económica en ${barrio}?`, a: 'Vender con coste de intermediación contenido: 3.630 € fijos en NuevaHabitat, solo en escritura, frente a comisiones del 3%–6% + IVA.' },
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
    form_side_text: `Cuéntanos barrio y situación en ${barrio} (particular, herencia, urgencia…). Te explicamos venta económica con 3.630 € solo en escritura, cartera de compradores y panel vendedor — respuesta en 24 h.`,
  };

  fs.writeFileSync(outPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('Wrote', econSlug);
}

const args = process.argv.slice(2).filter((a) => a !== '--force');
const slugs = args.length ? args : DEFAULT_BARRIOS;
for (const s of slugs) buildLanding(s);
