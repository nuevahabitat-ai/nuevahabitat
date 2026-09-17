/**
 * Genera landings intención «inmobiliaria precio fijo {zona}» desde JSON de barrio.
 * Uso: node scripts/scaffold-intencion-precio-fijo.js vender-poble-sec vender-sant-gervasi ...
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BARRIO_DIR = path.join(ROOT, 'content/landings/barrio');
const OUT_DIR = path.join(ROOT, 'content/landings/intencion');

const SLUG_MAP = {
  'vender-poble-sec': 'inmobiliaria-precio-fijo-poble-sec-barcelona',
  'vender-sant-gervasi': 'inmobiliaria-precio-fijo-sant-gervasi-barcelona',
  'vender-nou-barris': 'inmobiliaria-precio-fijo-nou-barris-barcelona',
  'vender-esplugues': 'inmobiliaria-precio-fijo-esplugues-barcelona',
  'vender-sant-marti': 'inmobiliaria-precio-fijo-sant-marti-barcelona',
  'vender-poblenou': 'inmobiliaria-precio-fijo-poblenou-barcelona',
  'vender-piso-ciutat-vella-barcelona': 'inmobiliaria-precio-fijo-ciutat-vella-barcelona',
  'vender-el-clot-la-sagrera-barcelona': 'inmobiliaria-precio-fijo-el-clot-barcelona',
};

function esc(s) {
  return String(s || '').replace(/"/g, '\\"');
}

function fmtEuro(n) {
  return Math.round(n).toLocaleString('es-ES');
}

function buildArgumento(B, slugIntencion) {
  const barrio = B.barrio || B.slug.replace(/^vender-/, '');
  const venderSlug = B.slug;
  const precio = B.ejemploPrecio || 400000;
  const com6 = Math.round(precio * 0.06 * 1.21);
  const ahorro = Math.max(com6 - 3630, 15000);
  const m2 = (B.datosMercado && B.datosMercado.precioM2) || '—';
  const tiempo = (B.datosMercado && B.datosMercado.tiempoVenta) || '55 – 90 días';
  const zonas = (B.zonas || []).slice(0, 4).join(', ');
  const cps = (B.postalCodes || []).join(', ');
  const perfil = B.perfilComprador || '';
  const tipologia = B.tipologiaEdificios || '';
  const tendencia = (B.datosMercado && B.datosMercado.tendencia) || '';

  return (
    `<p>Esta es una <strong>landing nueva</strong> para captar propietarios que buscan <strong>inmobiliaria con precio fijo en ${barrio}</strong> — distinta de la guía <a href="/${venderSlug}">vender piso en ${barrio}</a>. Si tu piso ronda <strong>${fmtEuro(precio)} €</strong>, una agencia al 6% + IVA puede cobrarte más de <strong>${fmtEuro(com6)} €</strong>; <strong>NuevaHabitat</strong> cobra <strong>3.630 €</strong> solo en escritura, con <strong>panel vendedor</strong> (visitas, documentación, comprador) y sin especular con tu precio de anuncio.</p>` +
    `<p>Pilar Barcelona: <a href="/inmobiliaria-precio-fijo-barcelona">inmobiliaria precio fijo Barcelona</a>.</p>` +
    `<h2>${barrio}: mercado local (${m2})</h2><p>Rango orientativo ${m2}; plazos habituales ${tiempo}. ${tendencia}</p>` +
    `<p>${perfil}</p>` +
    `<h2>Tipología de edificios en ${barrio}</h2><p>${tipologia}</p>` +
    (zonas ? `<h2>Micro-zonas: ${zonas}</h2><p>Valorar con comparables de ${cps || 'tu CP'}, no con la media de Barcelona. Cada calle compite con anuncios a pocos minutos a pie; copiar el precio del portal vecino sin mirar planta, ascensor y reforma es el error más repetido entre particulares.</p>` : '') +
    `<h2>Precio fijo: 3.630 € en escritura, no porcentaje</h2><p>Honorarios cerrados, cobro únicamente si hay venta. Ahorro orientativo frente al 6%: más de <strong>${fmtEuro(ahorro)} €</strong> en un piso de ${fmtEuro(precio)} €. Usa la <a href="#calc">calculadora</a> con tu precio estimado.</p>` +
    `<h2>Panel vendedor: plataforma del propietario</h2><p>Registro de visitas, control de franjas, documentación que subes tú, expediente del comprador, ofertas y arras visibles. Buena intermediación sin presión para inflar captación — porque no cobramos % sobre tu venta.</p><ul><li>Visitas con ficha y feedback.</li><li>Calendario en tus horarios.</li><li>PDF de comunidad, energético, nota simple.</li><li>Docs del comprador antes de arras.</li></ul>` +
    `<h2>Particular vs <a href="/nuevahabitat-vs-agencia-tradicional-barcelona">agencia tradicional</a></h2><p>Portal ahorra comisión pero genera curiosos; el 6% escala con el ticket. Precio fijo + compradores filtrados + acompañamiento legal hasta notaría encaja cuando quieres servicio profesional sin regalar un porcentaje.</p>` +
    `<h2>Calculadora en esta landing</h2><p>Compara 3%–6% + IVA con 3.630 € fijos. No vinculante; sirve para decidir antes de la valoración gratuita.</p>` +
    `<h2>Proceso en ${barrio}</h2><ol><li>Valoración con comparables locales.</li><li>Alta en panel vendedor.</li><li>Difusión a compradores con hipoteca o liquidez verificada.</li><li>Visitas registradas en tus franjas.</li><li>Arras y documentación centralizada.</li><li>Escritura: cobro precio fijo solo si cierras.</li></ol>` +
    `<h2>Documentación y transparencia</h2><p>Nota simple, certificado energético, ITE si aplica, actas de comunidad y plusvalía: anticipar sorpresas evita caídas tras arras — especialmente con compradores exigentes en ${barrio}.</p>` +
    `<h2>Cuándo tiene sentido contratar</h2><p>Si llevas semanas en portal sin oferta financiada, si quieres evitar exclusiva larga, si necesitas panel y registro de visitas, o si el coste del 6% sobre ${fmtEuro(precio)} € no te cuadra. Si solo quieres probar anuncio sin filtro, puedes empezar solo y reevaluar.</p>` +
    `<h2>Preguntas antes de firmar mandato</h2><p>¿Total a pagar a tu precio objetivo? ¿Solo en escritura? ¿Filtran hipoteca? ¿Panel? ¿Exclusiva? NuevaHabitat responde por escrito antes de empezar.</p>` +
    `<h2>Próximo paso</h2><p>Formulario o WhatsApp en esta página; respuesta en 24 h. Más datos de barrio en <a href="/${venderSlug}">vender en ${barrio}</a>. Slug SEO: ${slugIntencion}.</p>` +
    `<h2>Landings distintas para Google</h2><p>Esta URL captura búsquedas «inmobiliaria precio fijo ${barrio}»; la guía de barrio captura «vender piso ${barrio}». Contenido rico, calculadora y CTA — sin duplicar el H1 «¿Vendes en…?» de la otra página.</p>` +
    `<h2>Comparar modelos en la misma web</h2><p>Revisa la comparativa de esta landing, <a href="/vender-por-tu-cuenta-vs-nuevahabitat-barcelona">particular vs NuevaHabitat</a> y <a href="/vender-piso-sin-exclusividad-barcelona">vender sin exclusiva</a> si vienes de otra agencia.</p>`
  );
}

function buildLanding(barrioSlug) {
  const intSlug = SLUG_MAP[barrioSlug];
  if (!intSlug) throw new Error('Sin mapa de slug para ' + barrioSlug);
  const outPath = path.join(OUT_DIR, intSlug + '.json');
  if (fs.existsSync(outPath)) {
    console.log('SKIP (exists):', intSlug);
    return;
  }
  const B = JSON.parse(fs.readFileSync(path.join(BARRIO_DIR, barrioSlug + '.json'), 'utf8'));
  const barrio = B.barrio || barrioSlug.replace(/^vender-/, '');
  const label = barrio.replace(/-/g, ' ');
  const precio = B.ejemploPrecio || 400000;
  const kw = `inmobiliaria precio fijo ${label.toLowerCase()} barcelona`;
  const heroImg = B.heroImage || 'imagenes/comercial2.jpg';
  const heroAlt = B.heroImageAlt || `Inmobiliaria precio fijo ${barrio} Barcelona`;
  const zonasLead = (B.zonas || []).slice(0, 3).map((z) => `<strong>${z}</strong>`).join(', ');

  const L = {
    slug: intSlug,
    cluster: 'intencion',
    indexable: true,
    keyword_principal: kw,
    keyword_aliases: [
      `inmobiliaria honorarios fijos ${label.toLowerCase()}`,
      `vender piso particular ${label.toLowerCase()}`,
      `agencia inmobiliaria ${label.toLowerCase()} precio fijo`,
    ],
    footerLabel: `Precio fijo ${barrio}`,
    priority: 0.89,
    origen_lead: intSlug,
    meta: {
      title: `Inmobiliaria precio fijo ${barrio} · 3.630 € en escritura · NuevaHabitat`,
      description: `Nueva landing: agencia honorarios fijos en ${barrio}. 3.000€ + IVA solo al vender. Panel vendedor, calculadora vs 6%. ${(B.zonas || []).slice(0, 2).join(', ')}.`,
      keywords: kw,
    },
    hero: {
      badge: `${barrio} · Precio fijo · Panel`,
      h1: `Inmobiliaria con precio fijo en ${barrio}: 3.630 € en escritura, no 6%`,
      lead: `¿Buscas agencia en ${zonasLead || barrio} como <strong>particular</strong>? <strong>NuevaHabitat</strong>: <strong>3.000 € + IVA</strong> solo en escritura, <strong>panel vendedor</strong>, calculadora de ahorro. Guía barrio: <a href="/${B.slug}">vender en ${barrio}</a>.`,
      image: heroImg,
      imageAlt: heroAlt,
    },
    breadcrumbCurrent: `Precio fijo ${barrio}`,
    argumento_principal: buildArgumento(B, intSlug),
    calculadora: {
      precioDefault: precio,
      titulo: `Calculadora ${barrio}: tradicional vs precio fijo`,
      subtitulo: `Precio orientativo ${fmtEuro(precio)} €. Compara 3%–6% + IVA con 3.630 € en escritura.`,
    },
    como_ayudamos: {
      title: `Precio fijo y panel en ${barrio}`,
      description: `Proceso NuevaHabitat — landing intención ${barrio}.`,
      steps: [
        { title: 'Valoración local', body: `Comparables ${barrio}; 3.630 € solo en escritura por escrito.` },
        { title: 'Panel vendedor', body: 'Visitas, docs y ofertas centralizados.' },
        { title: 'Compradores filtrados', body: 'Hipoteca o liquidez antes de visitas.' },
        { title: 'Visitas controladas', body: 'Registro por cita en tus franjas.' },
        { title: 'Arras', body: 'Expediente comprador y negociación.' },
        { title: 'Escritura', body: 'Sin venta, sin factura de agencia.' },
      ],
    },
    comparativa_modelos: {
      title: `Modelos de venta en ${barrio}`,
      rows: [
        { modelo: 'Particular portal', tiempo: 'Variable', coste: 'Anuncio + tiempo', riesgo: 'Curiosos', tipo: 'neutral' },
        { modelo: 'Agencia ~6% + IVA', tiempo: '4–8 meses', coste: `>${fmtEuro(Math.round(precio * 0.06 * 1.21))} €`, riesgo: 'Exclusiva', tipo: 'lose' },
        { modelo: 'Agencia online', tiempo: 'Variable', coste: 'Cuota/%', riesgo: 'Poco arras', tipo: 'neutral' },
        { modelo: `NuevaHabitat ${barrio}`, tiempo: '60–90 días', coste: '3.630 € escritura', riesgo: 'Sin venta, sin factura', tipo: 'win' },
      ],
    },
    mitos: {
      title: `Mitos precio fijo en ${barrio}`,
      items: [
        { mito: 'Precio fijo es servicio mínimo', realidad: 'Incluye valoración, fotos, filtrado, panel y arras.' },
        { mito: 'Todas las agencias cobran 6%', realidad: 'Compara total y cuándo se cobra.' },
        { mito: 'Portal basta en ' + barrio, realidad: 'Filtrar solvencia y docs cierra ventas.' },
        { mito: 'Subir precio no cuesta', realidad: 'Semanas sin visitas cualificadas.' },
        { mito: 'No necesito panel', realidad: 'Centraliza visitas y documentación del comprador.' },
      ],
    },
    checklist: {
      title: `Checklist vendedor ${barrio}`,
      intro: 'Antes de exclusiva.',
      items: [
        '¿6% + IVA sobre mi objetivo?',
        '¿Solo cobro en escritura?',
        '¿Panel con visitas?',
        '¿Filtran hipoteca?',
        '¿Comparables de mi calle?',
        '¿Exclusiva obligatoria?',
      ],
    },
    faq: [
      { q: `¿Cuánto cuesta precio fijo en ${barrio}?`, a: '3.630 € total en escritura; ahorro grande vs 6% según ticket.' },
      { q: '¿Qué es el panel vendedor?', a: 'Visitas, docs propios y del comprador, ofertas y calendario.' },
      { q: `¿Diferencia con /${B.slug}?`, a: 'Esta landing es intención «inmobiliaria precio fijo»; la otra es guía «vender piso».' },
      { q: '¿Y si no vendo?', a: 'No pagas honorarios de agencia.' },
    ],
    relacionadas: [
      { slug: B.slug, label: `Vender ${barrio}` },
      { slug: 'inmobiliaria-precio-fijo-barcelona', label: 'Precio fijo Barcelona' },
      { slug: 'nuevahabitat-vs-agencia-tradicional-barcelona', label: 'Vs agencia tradicional' },
    ],
    keywords_footer: kw + ' · panel vendedor · calculadora ahorro',
    whatsappText: 'Hola%2C%20quiero%20precio%20fijo%20en%20' + encodeURIComponent(barrio),
    formPlaceholder: `Zona en ${barrio}, m², precio orientativo`,
    form_side_text: `Cuéntanos tu piso en ${barrio}: panel, 3.630 € en escritura, calculadora vs 6%.`,
  };

  fs.writeFileSync(outPath, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('Wrote', intSlug);
}

const args = process.argv.slice(2);
const slugs = args.length ? args : Object.keys(SLUG_MAP);
for (const s of slugs) buildLanding(s);
