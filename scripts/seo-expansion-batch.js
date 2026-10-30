/**
 * Expansión SEO: honorarios 3.630 €, landings faltantes, fixes enlaces, comparativa Habitaclia.
 * Uso: node scripts/seo-expansion-batch.js && node scripts/build-landings.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BARRIO_DIR = path.join(ROOT, 'content/landings/barrio');
const INT_DIR = path.join(ROOT, 'content/landings/intencion');
const PART_DIR = path.join(ROOT, 'content/landings/particular');
const COMP_DIR = path.join(ROOT, 'content/landings/comparativa');

const FEE_SHORT = '3.000 € + IVA (3.630 €)';
const FEE_LINE = '3.630 €';

function fmtEuro(n) {
  return Math.round(n).toLocaleString('es-ES');
}

function walkJson(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (f.endsWith('.json')) cb(p);
  }
}

function normalizeHonorariosInLandings() {
  const dirs = [
    path.join(ROOT, 'content/landings/intencion'),
    path.join(ROOT, 'content/landings/particular'),
    path.join(ROOT, 'content/landings/comparativa'),
    path.join(ROOT, 'content/landings/barrio'),
    path.join(ROOT, 'content/landings/situacion'),
  ];
  let n = 0;
  dirs.forEach((dir) => {
    walkJson(dir, (p) => {
      let t = fs.readFileSync(p, 'utf8');
      const orig = t;
      t = t.replace(/3\.500\s*€\s*\+\s*IVA/g, FEE_SHORT);
      t = t.replace(/3500\s*€\s*\+\s*IVA/g, FEE_SHORT);
      t = t.replace(/3\.500€\s*\+\s*IVA/g, FEE_SHORT);
      t = t.replace(/Honorarios fijos 3\.500/g, 'Honorarios fijos 3.630');
      t = t.replace(/precio fijo 3500 euros/gi, 'precio fijo 3000 euros mas IVA');
      t = t.replace(/com6 - 3500/g, 'com6 - 3630');
      t = t.replace(/Math\.max\(com6 - 3500/g, 'Math.max(com6 - 3630');
      if (t !== orig) {
        fs.writeFileSync(p, t, 'utf8');
        n++;
      }
    });
  });
  console.log('normalizeHonorariosInLandings:', n, 'files');
}

function fixEconomicaRelacionadas() {
  const fixes = {
    'venta-piso-economica-cornella-barcelona.json': 'inmobiliaria-precio-fijo-cornella-barcelona',
    'venta-piso-economica-esplugues-barcelona.json': 'inmobiliaria-precio-fijo-esplugues-barcelona',
    'venta-piso-economica-horta-barcelona.json': 'inmobiliaria-precio-fijo-horta-barcelona',
  };
  Object.entries(fixes).forEach(([file, slug]) => {
    const p = path.join(INT_DIR, file);
    if (!fs.existsSync(p)) return;
    let t = fs.readFileSync(p, 'utf8');
    t = t.replace(/inmobiliaria-precio-fijo-cornella-de-llobregat-barcelona/g, slug);
    t = t.replace(/inmobiliaria-precio-fijo-esplugues-de-llobregat-barcelona/g, slug);
    t = t.replace(/inmobiliaria-precio-fijo-horta-guinardo-barcelona/g, slug);
    fs.writeFileSync(p, t, 'utf8');
    console.log('fix relacionadas', file, '->', slug);
  });
}

function zoneFromBarrioSlug(barrioSlug) {
  let z = barrioSlug.replace(/^vender-piso-/, '').replace(/^vender-/, '');
  if (z.endsWith('-barcelona')) z = z.slice(0, -'-barcelona'.length);
  return z;
}

function precioFijoSlugFromZone(zone) {
  return `inmobiliaria-precio-fijo-${zone}-barcelona`;
}

function buildPrecioFijoFromBarrio(barrioSlug, force) {
  const srcPath = path.join(BARRIO_DIR, barrioSlug + '.json');
  if (!fs.existsSync(srcPath)) {
    console.warn('MISSING barrio', barrioSlug);
    return;
  }
  const zone = zoneFromBarrioSlug(barrioSlug);
  const intSlug = precioFijoSlugFromZone(zone);
  const outPath = path.join(INT_DIR, intSlug + '.json');
  if (fs.existsSync(outPath) && !force) {
    console.log('SKIP precio fijo (exists)', intSlug);
    return;
  }
  const B = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const barrio = B.barrio || zone;
  const precio = B.ejemploPrecio || 400000;
  const com6 = Math.round(precio * 0.06 * 1.21);
  const ahorro = Math.max(com6 - 3630, 12000);
  const kw = `inmobiliaria precio fijo ${barrio.toLowerCase()} barcelona`;
  const pfPara = `inmobiliaria-para-particulares-${zone}-barcelona`;

  const argumento =
    `<p>Landing <strong>inmobiliaria precio fijo ${barrio}</strong> para propietarios que buscan agencia con honorarios cerrados: <strong>${FEE_LINE}</strong> solo en escritura, frente a más de <strong>${fmtEuro(com6)} €</strong> (6% + IVA sobre ${fmtEuro(precio)} €). Distinta de <a href="/${B.slug}">vender piso en ${barrio}</a> y de <a href="/${pfPara}">inmobiliaria para particulares ${barrio}</a>.</p>` +
    `<p><a href="/inmobiliaria-precio-fijo-barcelona">Precio fijo Barcelona</a> · <a href="/venta-piso-economica-${zone}-barcelona">Venta económica ${barrio}</a></p>` +
    (B.argumento_principal || '').slice(0, 4000) +
    `<h2>Honorarios fijos ${barrio}</h2><p>${FEE_SHORT} en escritura. Ahorro orientativo <strong>${fmtEuro(ahorro)} €</strong>. <a href="#calc">Calculadora</a> con tu precio.</p>` +
    `<h2>Panel vendedor</h2><p>Visitas registradas, documentación centralizada, compradores con hipoteca preaprobada. Sin venta, sin factura de agencia.</p>`;

  const L = {
    slug: intSlug,
    cluster: 'intencion',
    indexable: true,
    keyword_principal: kw,
    keyword_aliases: [
      `inmobiliaria honorarios fijos ${barrio.toLowerCase()}`,
      `vender piso particular ${barrio.toLowerCase()}`,
      `agencia inmobiliaria ${barrio.toLowerCase()} precio fijo`,
    ],
    footerLabel: `Precio fijo ${barrio}`,
    priority: 0.89,
    origen_lead: intSlug,
    meta: {
      title: `Inmobiliaria precio fijo ${barrio} · ${FEE_LINE} en escritura · NuevaHabitat`,
      description: `Agencia honorarios fijos en ${barrio}. ${FEE_SHORT} solo al vender. Panel vendedor y calculadora vs 6%.`,
      keywords: kw,
    },
    hero: {
      badge: `${barrio} · Precio fijo`,
      h1: `Inmobiliaria con precio fijo en ${barrio}: ${FEE_LINE} en escritura, no un 6%`,
      lead: `¿Buscas agencia en <strong>${barrio}</strong> como <strong>particular</strong>? <strong>NuevaHabitat</strong>: <strong>${FEE_SHORT}</strong> solo en escritura, <strong>panel vendedor</strong> y compradores filtrados.`,
      image: B.heroImage || 'imagenes/comercial2.jpg',
      imageAlt: `Inmobiliaria precio fijo ${barrio} Barcelona`,
    },
    breadcrumbCurrent: `Precio fijo ${barrio}`,
    argumento_principal: argumento,
    calculadora: {
      precioDefault: precio,
      titulo: `Calculadora ${barrio}: tradicional vs precio fijo`,
      subtitulo: `Compara 3%–6% + IVA con ${FEE_LINE} fijos solo en escritura.`,
    },
    como_ayudamos: {
      title: `Precio fijo en ${barrio}`,
      description: 'Valoración, panel, visitas filtradas y escritura.',
      steps: [
        { title: 'Valoración local', body: `Comparables en ${barrio}; ${FEE_LINE} solo en escritura por escrito.` },
        { title: 'Panel vendedor', body: 'Visitas, docs y ofertas centralizados.' },
        { title: 'Compradores filtrados', body: 'Hipoteca o liquidez antes de visitas.' },
        { title: 'Arras', body: 'Negociación y expediente comprador.' },
        { title: 'Escritura', body: 'Sin venta, sin factura de agencia.' },
      ],
    },
    comparativa_modelos: {
      title: `Modelos de venta en ${barrio}`,
      rows: [
        { modelo: 'Particular portal', tiempo: 'Variable', coste: 'Anuncio + tiempo', riesgo: 'Curiosos', tipo: 'neutral' },
        { modelo: 'Agencia ~6% + IVA', tiempo: '4–8 meses', coste: `>${fmtEuro(com6)} €`, riesgo: 'Exclusiva', tipo: 'lose' },
        { modelo: 'NuevaHabitat precio fijo', tiempo: '60–90 días', coste: `${FEE_SHORT} escritura`, riesgo: 'Sin venta, sin factura', tipo: 'win' },
      ],
    },
    mitos: {
      title: `Mitos precio fijo en ${barrio}`,
      items: [
        { mito: 'Precio fijo es servicio mínimo', realidad: 'Incluye valoración, filtrado, panel y arras.' },
        { mito: 'Portal basta', realidad: 'Filtrar solvencia cierra ventas.' },
        { mito: 'Todas las agencias cobran 6%', realidad: 'Compara total y cuándo se cobra.' },
      ],
    },
    checklist: {
      title: `Checklist vendedor ${barrio}`,
      intro: 'Antes de firmar mandato.',
      items: ['¿6% + IVA sobre mi objetivo?', '¿Solo cobro en escritura?', '¿Panel vendedor?', '¿Filtran hipoteca?', '¿Exclusiva obligatoria?'],
    },
    faq: [
      { q: `¿Cuánto cuesta precio fijo en ${barrio}?`, a: `${FEE_SHORT} solo en escritura.` },
      { q: '¿Qué es el panel vendedor?', a: 'Visitas, documentación y ofertas en expediente digital.' },
      { q: '¿Y si no vendo?', a: 'No pagas honorarios de agencia.' },
      { q: '¿Particulares?', a: `Ver también /${pfPara}.` },
    ],
    relacionadas: [
      { slug: B.slug, label: `Vender ${barrio}` },
      { slug: pfPara, label: `Inmobiliaria particulares ${barrio}` },
      { slug: 'inmobiliaria-precio-fijo-barcelona', label: 'Precio fijo Barcelona' },
      { slug: 'nuevahabitat-vs-agencia-tradicional-barcelona', label: 'Vs agencia tradicional' },
    ],
    keywords_footer: `${kw} · panel vendedor · ${FEE_LINE}`,
    whatsappText: 'Hola%2C%20quiero%20precio%20fijo%20en%20' + encodeURIComponent(barrio),
    formPlaceholder: `Zona en ${barrio}, m²`,
    form_side_text: `${FEE_LINE} solo en escritura, panel vendedor — valoración en 24 h.`,
  };
  fs.writeFileSync(outPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('Wrote', intSlug);
}

function buildParaParticularesFromBarrio(barrioSlug) {
  const srcPath = path.join(BARRIO_DIR, barrioSlug + '.json');
  if (!fs.existsSync(srcPath)) return;
  const zone = zoneFromBarrioSlug(barrioSlug);
  const slug = `inmobiliaria-para-particulares-${zone}-barcelona`;
  const outPath = path.join(INT_DIR, slug + '.json');
  if (fs.existsSync(outPath)) {
    console.log('SKIP particulares (exists)', slug);
    return;
  }
  const B = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const barrio = B.barrio || zone;
  const precio = B.ejemploPrecio || 400000;
  const com6 = Math.round(precio * 0.06 * 1.21);
  const pfSlug = precioFijoSlugFromZone(zone);
  const kw = `inmobiliaria para particulares ${barrio.toLowerCase()} barcelona`;

  const L = {
    slug,
    cluster: 'intencion',
    indexable: true,
    keyword_principal: kw,
    keyword_aliases: [
      `agencia inmobiliaria para vender piso ${barrio.toLowerCase()}`,
      `inmobiliaria vendedores particulares ${barrio.toLowerCase()}`,
      `vender piso particular con agencia ${barrio.toLowerCase()}`,
    ],
    footerLabel: `Particulares ${barrio}`,
    priority: 0.88,
    origen_lead: slug,
    cardTeaser: `Inmobiliaria para propietarios particulares en ${barrio}: ${FEE_LINE} solo en escritura, panel vendedor y compradores filtrados.`,
    meta: {
      title: `Inmobiliaria para particulares en ${barrio} · ${FEE_LINE} · NuevaHabitat`,
      description: `¿Buscas inmobiliaria para vender siendo particular en ${barrio}? ${FEE_SHORT} solo al cerrar, panel del vendedor y calculadora vs 6%.`,
      keywords: kw,
    },
    hero: {
      badge: `${barrio} · Propietario particular`,
      h1: `Inmobiliaria para particulares en ${barrio}: ${FEE_LINE} en escritura, no un 6% sobre tu piso`,
      lead: `Eres <strong>propietario particular</strong> en <strong>${barrio}</strong>. <strong>NuevaHabitat</strong>: <strong>${FEE_SHORT}</strong> solo en escritura, <strong>panel vendedor</strong> y visitas con solvencia verificada.`,
      image: B.heroImage || 'imagenes/comercial2.jpg',
      imageAlt: `Inmobiliaria para particulares ${barrio}`,
    },
    breadcrumbCurrent: `Particulares ${barrio}`,
    argumento_principal:
      `<p>La búsqueda <strong>inmobiliaria para particulares ${barrio}</strong> indica que ya descartaste (o probaste) vender solo en portal y quieres agencia sin exclusiva abusiva ni 6%. En ${barrio}, un piso de ~${fmtEuro(precio)} € puede costarte más de <strong>${fmtEuro(com6)} €</strong> en comisión tradicional; NuevaHabitat cobra <strong>${FEE_LINE}</strong> solo en escritura.</p>` +
      `<p>Pilares: <a href="/inmobiliaria-para-particulares-barcelona">particulares Barcelona</a> · <a href="/${pfSlug}">precio fijo ${barrio}</a> · <a href="/vender-como-particular-${zone}-barcelona">vender como particular ${barrio}</a> · <a href="/${B.slug}">vender en ${barrio}</a>.</p>` +
      (B.argumento_principal || '').slice(0, 3500) +
      `<h2>Checklist particular en ${barrio}</h2><ol><li>Importe total en escritura (${FEE_LINE}).</li><li>¿Filtran hipoteca antes de visitas?</li><li>¿Panel vendedor incluido?</li><li>¿Puedo seguir en portal?</li></ol>` +
      `<h2>Próximo paso</h2><p>Calculadora y valoración gratuita — respuesta en 24 h, condiciones por escrito.</p>`,
    calculadora: {
      precioDefault: precio,
      titulo: `Calculadora particulares ${barrio}: 6% vs NuevaHabitat`,
      subtitulo: `Compara comisión habitual con ${FEE_LINE} fijos solo en escritura.`,
    },
    como_ayudamos: {
      title: `Particulares en ${barrio} — proceso claro`,
      description: 'De valoración a escritura con coste cerrado.',
      steps: [
        { title: 'Valoración', body: `Comparables locales en ${barrio}.` },
        { title: 'Condiciones', body: `${FEE_LINE} solo en escritura por escrito.` },
        { title: 'Panel', body: 'Visitas y documentación centralizadas.' },
        { title: 'Cartera', body: 'Compradores con financiación verificada.' },
        { title: 'Escritura', body: 'Sin venta, sin factura de agencia.' },
      ],
    },
    comparativa_modelos: {
      title: `Portal vs agencia vs NuevaHabitat en ${barrio}`,
      rows: [
        { modelo: 'Particular portal', tiempo: '3–12+ meses', coste: 'Anuncio + tiempo', riesgo: 'Curiosos', tipo: 'neutral' },
        { modelo: 'Agencia ~6%', tiempo: '4–8 meses', coste: `~${fmtEuro(com6)} €`, riesgo: 'Exclusiva', tipo: 'lose' },
        { modelo: 'NuevaHabitat particulares', tiempo: '60–90 días', coste: FEE_SHORT, riesgo: 'Panel vendedor', tipo: 'win' },
      ],
    },
    mitos: {
      title: `Mitos inmobiliaria particulares ${barrio}`,
      items: [
        { mito: 'Todas las agencias son iguales', realidad: 'Precio fijo vs % cambia incentivos.' },
        { mito: 'Particular + agencia = doble pago', realidad: 'Puedes combinar portal y cartera sin 6%.' },
      ],
    },
    checklist: {
      title: `Checklist antes de firmar en ${barrio}`,
      intro: 'Preguntas para propietarios particulares.',
      items: [`¿${FEE_LINE} total?`, '¿Solo en escritura?', '¿Panel vendedor?', '¿Exclusiva?'],
    },
    faq: [
      { q: `¿Cuánto paga el particular vendedor en ${barrio}?`, a: `${FEE_SHORT} solo en escritura si hay venta.` },
      { q: '¿Puedo vender solo en Idealista y luego llamaros?', a: 'Sí. Valoración gratuita sin exclusiva abusiva.' },
      { q: '¿Diferencia con precio fijo?', a: 'Misma tarifa; esta landing captura búsqueda «inmobiliaria para particulares».' },
    ],
    relacionadas: [
      { slug: 'inmobiliaria-para-particulares-barcelona', label: 'Particulares Barcelona' },
      { slug: pfSlug, label: `Precio fijo ${barrio}` },
      { slug: `vender-como-particular-${zone}-barcelona`, label: `Guía particular ${barrio}` },
      { slug: B.slug, label: `Vender ${barrio}` },
    ],
    keywords_footer: `${kw} · honorarios fijos · panel vendedor`,
    whatsappText: 'Hola%2C%20soy%20particular%20en%20' + encodeURIComponent(barrio),
    formPlaceholder: `Tu zona en ${barrio}`,
    form_side_text: `Propietario particular en ${barrio}: ${FEE_LINE} solo en escritura.`,
  };
  fs.writeFileSync(outPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('Wrote', slug);
}

function buildEconomicaFromBarrio(barrioSlug) {
  const srcPath = path.join(BARRIO_DIR, barrioSlug + '.json');
  if (!fs.existsSync(srcPath)) return;
  const zone = zoneFromBarrioSlug(barrioSlug);
  const slug = `venta-piso-economica-${zone}-barcelona`;
  const outPath = path.join(INT_DIR, slug + '.json');
  if (fs.existsSync(outPath)) {
    console.log('SKIP economica (exists)', slug);
    return;
  }
  const B = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const barrio = B.barrio || zone;
  const precio = B.ejemploPrecio || 400000;
  const pfSlug = precioFijoSlugFromZone(zone);
  const kw = `venta de piso economica ${barrio.toLowerCase()} barcelona`;

  const L = {
    slug,
    cluster: 'intencion',
    layout: 'economica-hub',
    indexable: true,
    barrio,
    keyword_principal: kw,
    keyword_aliases: [`vender piso ${barrio.toLowerCase()} honorarios bajos`, `inmobiliaria economica ${barrio.toLowerCase()}`],
    footerLabel: `Venta económica ${barrio}`,
    breadcrumbCurrent: `Venta económica ${barrio}`,
    priority: 0.88,
    origen_lead: slug,
    meta: {
      title: `Venta de piso económica en ${barrio} · ${FEE_LINE} · NuevaHabitat`,
      description: `Venta económica en honorarios en ${barrio}: ${FEE_SHORT} solo en escritura. Calculadora vs 6% y panel vendedor.`,
      keywords: kw,
    },
    hero: {
      badge: `${barrio} · Venta económica`,
      h1: `Venta de piso económica en ${barrio}: ${FEE_LINE} en escritura, no un 6%`,
      lead: `Vender en <strong>${barrio}</strong> sin regalar la comisión: <strong>${FEE_SHORT}</strong> solo en escritura, panel vendedor y compradores cualificados.`,
      image: B.heroImage || 'imagenes/familia10.jpg',
      imageAlt: `Venta económica ${barrio} Barcelona`,
    },
    heroStats: [
      { label: 'NuevaHabitat', value: FEE_LINE, note: 'Solo en escritura', highlight: true },
      { label: 'Agencia ~6%', value: `~${fmtEuro(Math.round(precio * 0.06 * 1.21))} €`, note: `Sobre ${fmtEuro(precio)} €` },
    ],
    argumento_principal:
      `<p><strong>Venta de piso económica en ${barrio}</strong> = honorarios contenidos, no vender barato. NuevaHabitat: <strong>${FEE_LINE}</strong> solo en escritura.</p>` +
      `<p><a href="/venta-piso-economica-barcelona">Hub Barcelona</a> · <a href="/${B.slug}">Vender ${barrio}</a> · <a href="/${pfSlug}">Precio fijo ${barrio}</a></p>` +
      (B.argumento_principal || '').slice(0, 3000),
    calculadora: { precioDefault: precio, titulo: `Calculadora venta económica ${barrio}`, subtitulo: `Compara 6% + IVA con ${FEE_LINE} fijos.` },
    como_ayudamos: {
      title: `Venta económica ${barrio}`,
      description: 'Honorarios fijos y cartera compradores.',
      steps: [
        { title: 'Valoración', body: 'Comparables locales.' },
        { title: 'Difusión', body: 'Compradores con solvencia.' },
        { title: 'Escritura', body: `${FEE_LINE} solo si cierras.` },
      ],
    },
    faq: [
      { q: `¿Qué cuesta en ${barrio}?`, a: `${FEE_SHORT} solo en escritura.` },
      { q: '¿Venta económica es vender barato?', a: 'No: es no pagar de más al intermediario.' },
    ],
    relacionadas: [
      { slug: 'venta-piso-economica-barcelona', label: 'Venta económica Barcelona' },
      { slug: B.slug, label: `Vender ${barrio}` },
      { slug: pfSlug, label: `Precio fijo ${barrio}` },
      { slug: 'inmobiliaria-para-particulares-barcelona', label: 'Inmobiliaria particulares' },
    ],
    keywords_footer: kw,
    whatsappText: 'Hola%2C%20venta%20economica%20' + encodeURIComponent(barrio),
    formPlaceholder: `Barrio / m² en ${barrio}`,
    form_side_text: `Venta económica en honorarios — ${barrio}.`,
  };
  fs.writeFileSync(outPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('Wrote', slug);
}

function buildParticularFromBarrio(barrioSlug, particularSlug) {
  const srcPath = path.join(BARRIO_DIR, barrioSlug + '.json');
  if (!fs.existsSync(srcPath)) return;
  const outPath = path.join(PART_DIR, particularSlug + '.json');
  if (fs.existsSync(outPath)) {
    console.log('SKIP particular (exists)', particularSlug);
    return;
  }
  const B = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const barrio = B.barrio || barrioSlug;
  const zone = zoneFromBarrioSlug(barrioSlug);
  const kw = `vender piso particular ${barrio.toLowerCase()} barcelona`;

  const L = {
    slug: particularSlug,
    cluster: 'particular',
    indexable: true,
    keyword_principal: kw,
    keyword_aliases: [`vender mi piso ${barrio.toLowerCase()} yo mismo`, `vender casa particular ${barrio.toLowerCase()}`],
    footerLabel: `Particular ${barrio}`,
    priority: 0.86,
    origen_lead: particularSlug,
    meta: {
      title: `Vender tu piso en ${barrio} siendo particular · ${FEE_LINE} · NuevaHabitat`,
      description: `Guía para vender como particular en ${barrio}. Documentos, errores típicos y acompañamiento con ${FEE_SHORT} solo en escritura.`,
      keywords: kw,
    },
    hero: {
      badge: `${barrio} · Particular`,
      h1: `Vender tu piso en ${barrio} siendo particular: ${FEE_LINE} en escritura si quieres ayuda profesional`,
      lead: `Guía para <strong>particulares</strong> en <strong>${barrio}</strong>. NuevaHabitat: <strong>${FEE_SHORT}</strong> solo en escritura, panel vendedor y visitas filtradas.`,
      image: B.heroImage || 'imagenes/comercial2.jpg',
      imageAlt: `Particular vendiendo en ${barrio}`,
    },
    breadcrumbCurrent: `Particular ${barrio}`,
    argumento_principal:
      `<p>Si buscas <strong>vender piso siendo particular en ${barrio}</strong>, esta guía local complementa <a href="/vender-como-particular-barcelona">particular Barcelona</a> y <a href="/inmobiliaria-para-particulares-${zone}-barcelona">inmobiliaria para particulares ${barrio}</a>.</p>` +
      (B.argumento_principal || '').slice(0, 4500) +
      `<h2>Cuándo pasar de portal a agencia precio fijo</h2><p>Si llevas 6–8 semanas sin oferta con hipoteca, activa cartera con <strong>${FEE_LINE}</strong> solo en escritura — sin 6%.</p>`,
    calculadora: {
      precioDefault: B.ejemploPrecio || 400000,
      titulo: `Calculadora particular ${barrio}`,
      subtitulo: `Compara 6% + IVA con ${FEE_LINE} fijos.`,
    },
    faq: [
      { q: `¿Cuánto cuesta la agencia en ${barrio}?`, a: `${FEE_SHORT} solo en escritura con NuevaHabitat.` },
      { q: '¿Puedo empezar solo en portal?', a: 'Sí. Valoración gratuita cuando quieras cambiar canal.' },
    ],
    relacionadas: [
      { slug: 'vender-como-particular-barcelona', label: 'Particular Barcelona' },
      { slug: B.slug, label: `Vender ${barrio}` },
      { slug: `inmobiliaria-para-particulares-${zone}-barcelona`, label: `Agencia particulares ${barrio}` },
      { slug: precioFijoSlugFromZone(zone), label: `Precio fijo ${barrio}` },
    ],
    keywords_footer: kw,
    whatsappText: 'Hola%2C%20particular%20' + encodeURIComponent(barrio),
    formPlaceholder: `Zona en ${barrio}`,
    form_side_text: `Particular en ${barrio} — valoración en 24 h.`,
  };
  fs.writeFileSync(outPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('Wrote', particularSlug);
}

function buildHabitacliaComparativa() {
  const outPath = path.join(COMP_DIR, 'nuevahabitat-vs-habitaclia-particular.json');
  if (fs.existsSync(outPath)) {
    console.log('SKIP habitaclia (exists)');
    return;
  }
  const fotocasa = JSON.parse(fs.readFileSync(path.join(COMP_DIR, 'nuevahabitat-vs-fotocasa-particular.json'), 'utf8'));
  let s = JSON.stringify(fotocasa, null, 2);
  s = s.replace(/fotocasa/gi, (m) => (m === 'Fotocasa' ? 'Habitaclia' : m.toLowerCase() === 'fotocasa' ? 'habitaclia' : m));
  s = s.replace(/FOTOCASA/g, 'HABITCLIA');
  const L = JSON.parse(s);
  L.slug = 'nuevahabitat-vs-habitaclia-particular';
  L.keyword_principal = 'nuevahabitat vs habitaclia particular';
  L.keyword_aliases = [
    'habitaclia particulares barcelona',
    'vender piso habitaclia particular barcelona',
    'habitaclia vs inmobiliaria barcelona',
  ];
  L.origen_lead = L.slug;
  L.footerLabel = 'NH vs Habitaclia';
  L.meta.title = 'NuevaHabitat vs Habitaclia (particular) en Barcelona · Comparativa 2026';
  L.meta.description = L.meta.description.replace(/Fotocasa/gi, 'Habitaclia');
  L.meta.keywords = 'nuevahabitat vs habitaclia, habitaclia particulares barcelona, vender piso habitaclia particular barcelona, habitaclia vs inmobiliaria barcelona';
  L.hero.h1 = '¿Vender en Habitaclia como particular o con NuevaHabitat en Barcelona?';
  L.hero.lead = L.hero.lead.replace(/Fotocasa/gi, 'Habitaclia');
  L.breadcrumbCurrent = 'vs Habitaclia';
  L.argumento_principal = L.argumento_principal.replace(/Fotocasa/g, 'Habitaclia').replace(/fotocasa/g, 'habitaclia');
  L.relacionadas = [
    { slug: 'nuevahabitat-vs-fotocasa-particular', label: 'NH vs Fotocasa' },
    { slug: 'nuevahabitat-vs-idealista-particular', label: 'NH vs Idealista' },
    { slug: 'inmobiliaria-para-particulares-barcelona', label: 'Inmobiliaria particulares' },
    { slug: 'nuevahabitat-vs-agencia-tradicional-barcelona', label: 'Vs agencia 6%' },
  ];
  L.keywords_footer = 'nuevahabitat vs habitaclia · habitaclia particulares barcelona · vender piso habitaclia · precio fijo 3000 euros';
  fs.writeFileSync(outPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('Wrote nuevahabitat-vs-habitaclia-particular');
}

function patchHubsAndCsvLandings() {
  const idealistaPath = path.join(COMP_DIR, 'nuevahabitat-vs-idealista-particular.json');
  if (fs.existsSync(idealistaPath)) {
    const L = JSON.parse(fs.readFileSync(idealistaPath, 'utf8'));
    if (!L.keyword_aliases.includes('idealista particulares barcelona')) {
      L.keyword_aliases.push('idealista particulares barcelona');
    }
    L.meta.keywords = (L.meta.keywords || '') + ', idealista particulares barcelona';
    fs.writeFileSync(idealistaPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  }
  const fotocasaPath = path.join(COMP_DIR, 'nuevahabitat-vs-fotocasa-particular.json');
  if (fs.existsSync(fotocasaPath)) {
    const L = JSON.parse(fs.readFileSync(fotocasaPath, 'utf8'));
    if (!L.keyword_aliases.includes('fotocasa particulares barcelona')) {
      L.keyword_aliases.push('fotocasa particulares barcelona');
    }
    L.meta.keywords = (L.meta.keywords || '') + ', fotocasa particulares barcelona';
    fs.writeFileSync(fotocasaPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  }

  const miPisoPath = path.join(INT_DIR, 'vender-mi-piso-barcelona.json');
  if (fs.existsSync(miPisoPath)) {
    const L = JSON.parse(fs.readFileSync(miPisoPath, 'utf8'));
    const extraFaq = {
      q: '¿Puedo vender mi piso cerca de mi en Barcelona sin liarme?',
      a: 'Sí. Buscamos compradores en tu barrio y área metropolitana desde Les Corts. Valoración gratuita con comparables de tu calle y honorarios ' + FEE_SHORT + ' solo en escritura.',
    };
    if (!L.faq.some((f) => f.q.includes('cerca de mi'))) L.faq.push(extraFaq);
    if (!L.relacionadas.some((r) => r.slug === 'inmobiliaria-para-particulares-barcelona')) {
      L.relacionadas.unshift({ slug: 'inmobiliaria-para-particulares-barcelona', label: 'Inmobiliaria particulares' });
    }
    L.keyword_aliases = L.keyword_aliases || [];
    if (!L.keyword_aliases.includes('agencia inmobiliaria barcelona vender piso')) {
      L.keyword_aliases.push('agencia inmobiliaria barcelona vender piso');
    }
    fs.writeFileSync(miPisoPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
    console.log('Patched vender-mi-piso-barcelona');
  }

  const pfHub = path.join(INT_DIR, 'inmobiliaria-precio-fijo-barcelona.json');
  if (fs.existsSync(pfHub)) {
    const L = JSON.parse(fs.readFileSync(pfHub, 'utf8'));
    if (!L.relacionadas.some((r) => r.slug === 'inmobiliaria-para-particulares-barcelona')) {
      L.relacionadas.unshift({ slug: 'inmobiliaria-para-particulares-barcelona', label: 'Inmobiliaria para particulares' });
    }
    if (!L.relacionadas.some((r) => r.slug === 'nuevahabitat-vs-habitaclia-particular')) {
      L.relacionadas.push({ slug: 'nuevahabitat-vs-habitaclia-particular', label: 'Vs Habitaclia' });
    }
    fs.writeFileSync(pfHub, JSON.stringify(L, null, 2) + '\n', 'utf8');
  }

  const econHub = path.join(INT_DIR, 'venta-piso-economica-barcelona.json');
  if (fs.existsSync(econHub)) {
    const L = JSON.parse(fs.readFileSync(econHub, 'utf8'));
    if (!L.relacionadas.some((r) => r.slug === 'inmobiliaria-para-particulares-barcelona')) {
      L.relacionadas.unshift({ slug: 'inmobiliaria-para-particulares-barcelona', label: 'Inmobiliaria particulares' });
    }
    fs.writeFileSync(econHub, JSON.stringify(L, null, 2) + '\n', 'utf8');
  }
}

function appendSinPortalesZones() {
  const scaffoldPath = path.join(__dirname, 'scaffold-sin-portales-barrios.js');
  let t = fs.readFileSync(scaffoldPath, 'utf8');
  const extra = `
  {
    slug: 'vender-piso-sin-portales-sarria-barcelona',
    barrio: 'Sarrià',
    barrioSlug: 'vender-sarria',
    footerLabel: 'Sin portales Sarrià',
    keyword: 'vender piso sin portales sarria barcelona',
    h1: '¿Vender en Sarrià con discreción, sin anuncio masivo en portales?',
    badge: 'Sarrià · Cartera compradores',
    precioDefault: 750000,
    micro: 'Sarrià poble, Bonanova, Tres Torres, Galvany',
    precioM2: '5.500–7.500 €/m²',
    ticket: '650.000–950.000 €',
    comision6: '45.000–55.000 €',
    perfil: 'compradores con financiación premium o liquidez, familias de colegios y expatriados',
    edificio: 'fincas señoriales, áticos con terraza y pisos en finca regia',
    mitoLocal: 'En Sarrià el portal expone demasiado el inmueble',
    image: 'imagenes/sarria1.jpg',
    imageAlt: 'Vender en Sarrià sin portales',
  },
  {
    slug: 'vender-piso-sin-portales-gracia-barcelona',
    barrio: 'Gràcia',
    barrioSlug: 'vender-gracia',
    footerLabel: 'Sin portales Gràcia',
    keyword: 'vender piso sin portales gracia barcelona',
    h1: '¿Vender en Gràcia con compradores filtrados, no curiosos de portal?',
    badge: 'Gràcia · Sin portales',
    precioDefault: 480000,
    micro: 'Vila de Gràcia, Camp Grassot, Vallcarca',
    precioM2: '4.300–5.800 €/m²',
    ticket: '420.000–550.000 €',
    comision6: '28.000–38.000 €',
    perfil: 'familias que buscan terraza y vida de plaza',
    edificio: 'fincas de principios de siglo, pisos con encanto',
    mitoLocal: 'En Gràcia basta publicar en Idealista un domingo',
    image: 'imagenes/gracia1.jpg',
    imageAlt: 'Vender en Gràcia sin portales',
  },
  {
    slug: 'vender-piso-sin-portales-poblenou-barcelona',
    barrio: 'Poblenou',
    barrioSlug: 'vender-poblenou',
    footerLabel: 'Sin portales Poblenou',
    keyword: 'vender piso sin portales poblenou barcelona',
    h1: '¿Vender en Poblenou fuera del ruido de portales?',
    badge: 'Poblenou · Cartera',
    precioDefault: 520000,
    micro: 'Rambla Poblenou, 22@, Vila Olímpica',
    precioM2: '4.200–5.600 €/m²',
    ticket: '450.000–600.000 €',
    comision6: '30.000–40.000 €',
    perfil: 'profesionales tech y compradores con hipoteca aprobada',
    edificio: 'lofts, fincas reconvertidas y obra nueva',
    mitoLocal: 'Poblenou se vende solo por estar de moda',
    image: 'imagenes/poblenou1.jpg',
    imageAlt: 'Vender Poblenou sin portales',
  },
  {
    slug: 'vender-piso-sin-portales-sant-gervasi-barcelona',
    barrio: 'Sant Gervasi',
    barrioSlug: 'vender-sant-gervasi',
    footerLabel: 'Sin portales Sant Gervasi',
    keyword: 'vender piso sin portales sant gervasi barcelona',
    h1: '¿Vender en Sant Gervasi con compradores solventes, sin portal?',
    badge: 'Sant Gervasi · Sin portales',
    precioDefault: 520000,
    micro: 'Putxet, Farró, Sant Gervasi centre',
    precioM2: '5.000–6.500 €/m²',
    ticket: '450.000–600.000 €',
    comision6: '30.000–40.000 €',
    perfil: 'familias consolidadas y compradores con colegios',
    edificio: 'fincas unifamiliares y bloques con ascensor',
    mitoLocal: 'Sant Gervasi no necesita filtro de compradores',
    image: 'imagenes/santgervasi1.jpg',
    imageAlt: 'Vender Sant Gervasi sin portales',
  },`;
  if (!t.includes('vender-piso-sin-portales-sarria-barcelona')) {
    t = t.replace('const ZONES = [', 'const ZONES = [' + extra);
    fs.writeFileSync(scaffoldPath, t, 'utf8');
    console.log('Extended scaffold-sin-portales-barrios.js');
  }
}

// --- main ---
if (require.main !== module) {
  module.exports = {
    buildParaParticularesFromBarrio,
    buildPrecioFijoFromBarrio,
    buildEconomicaFromBarrio,
    buildParticularFromBarrio,
  };
} else {
normalizeHonorariosInLandings();
fixEconomicaRelacionadas();
patchHubsAndCsvLandings();
buildHabitacliaComparativa();
appendSinPortalesZones();

const DISTRICT_BARRIOS = [
  'vender-eixample',
  'vender-gracia',
  'vender-sants',
  'vender-sarria',
  'vender-les-corts',
  'vender-sant-antoni',
  'vender-poble-sec',
  'vender-poblenou',
  'vender-sant-gervasi',
  'vender-horta',
  'vender-sant-andreu',
  'vender-nou-barris',
  'vender-piso-ciutat-vella-barcelona',
  'vender-sant-marti',
  'vender-badalona',
  'vender-l-hospitalet',
  'vender-cornella',
  'vender-esplugues',
  'vender-el-clot-la-sagrera-barcelona',
];

DISTRICT_BARRIOS.forEach((b) => {
  buildParaParticularesFromBarrio(b);
});

buildPrecioFijoFromBarrio('vender-sant-marti', true);
buildEconomicaFromBarrio('vender-el-clot-la-sagrera-barcelona');

const TIER1_PRECIO_FIJO = [
  'vender-pedralbes-barcelona',
  'vender-diagonal-mar-barcelona',
  'vender-vila-olimpica-barcelona',
  'vender-fort-pienc-barcelona',
  'vender-guinardo-barcelona',
  'vender-hostafrancs-barcelona',
  'vender-la-sagrera-barcelona',
  'vender-montjuic-barcelona',
  'vender-sagrada-familia-barcelona',
];

TIER1_PRECIO_FIJO.forEach((b) => buildPrecioFijoFromBarrio(b, false));

const MISSING_PARTICULAR = [
  ['vender-camp-de-larpa-barcelona', 'vender-como-particular-camp-de-larpa-barcelona'],
  ['vender-el-besos-barcelona', 'vender-como-particular-el-besos-barcelona'],
  ['vender-piso-barceloneta', 'vender-como-particular-barceloneta-barcelona'],
  ['vender-piso-born-barcelona', 'vender-como-particular-born-barcelona'],
  ['vender-piso-gotic-barcelona', 'vender-como-particular-gotic-barcelona'],
  ['vender-piso-raval-barcelona', 'vender-como-particular-raval-barcelona'],
  ['vender-provencals-del-poblenou-barcelona', 'vender-como-particular-provencals-del-poblenou-barcelona'],
  ['vender-sagrada-familia-barcelona', 'vender-como-particular-sagrada-familia-barcelona'],
  ['vender-sant-just-sant-joan-despi', 'vender-como-particular-sant-just-sant-joan-despi-barcelona'],
  ['vender-vila-olimpica-barcelona', 'vender-como-particular-vila-olimpica-barcelona'],
  ['vender-piso-ciutat-vella-barcelona', 'vender-como-particular-ciutat-vella-distrito-barcelona'],
];

MISSING_PARTICULAR.forEach(([b, p]) => buildParticularFromBarrio(b, p));

console.log('Done. Run: node scripts/scaffold-sin-portales-barrios.js && node scripts/build-landings.js');
}
