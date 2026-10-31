/**
 * Genera landings cluster "particular" desde JSON barrio (lote captación Barcelona).
 * node scripts/scaffold-particular-lote10-barcelona.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BARRIO_DIR = path.join(ROOT, 'content', 'landings', 'barrio');
const OUT_DIR = path.join(ROOT, 'content', 'landings', 'particular');

const BARRIO_SLUGS = [
  'vender-la-bordeta-barcelona',
  'vender-roquetes-barcelona',
  'vender-verneda-barcelona',
  'vender-guinardo-barcelona',
  'vender-la-marina-barcelona',
  'vender-el-clot-la-sagrera-barcelona',
  'vender-diagonal-mar-barcelona',
  'vender-camp-den-grassot-barcelona',
];

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugLabel(slug) {
  return slug.replace(/^vender-/, '').replace(/-barcelona$/, '').replace(/-/g, ' ');
}

function buildAliases(b) {
  const n = b.barrio;
  const cp = (b.postalCodes && b.postalCodes[0]) || '08000';
  return [
    `vender mi piso ${n.toLowerCase()} yo mismo`,
    `vender piso ${cp} sin agencia`,
    `vender piso particular ${n.toLowerCase()} barcelona`,
    `vender vivienda ${n.toLowerCase()} particular`,
  ];
}

function buildArgumento(b, barrioSlug) {
  const n = b.barrio;
  const zonas = (b.zonas || []).join(' · ');
  const cp = (b.postalCodes || []).join(' / ');
  const dm = b.datosMercado || {};
  const m2 = dm.precioM2 || 'consultar valoración';
  const precio = b.ejemploPrecio || 350000;
  const precioFmt = precio.toLocaleString('es-ES');
  const com6 = Math.round(precio * 0.06 * 1.21);
  const barrioLink = `/${barrioSlug}`;
  const body = b.argumento_principal || '';

  const intro = `<p>Esta guía es para el <strong>propietario particular</strong> que vende en <strong>${n}</strong> (${cp}): ${zonas}. Si ya publicaste en Idealista o Fotocasa y las visitas no traen hipoteca, aquí va el mapa local (${m2}) más la opción NuevaHabitat — <strong>3.000 € + IVA (3.630 € en escritura)</strong> solo en escritura, panel vendedor y filtro de compradores. General: <a href="/vender-como-particular-barcelona">particular Barcelona</a>. Agencia precio fijo: <a href="${barrioLink}">vender en ${n}</a>.</p>`;

  const faqBlock = (b.faq || [])
    .slice(0, 4)
    .map((f) => `<h3>${f.q}</h3><p>${f.a} En ${n}, aplicado a propietarios que publican solos.</p>`)
    .join('');

  const outro = `<h2>Particular en ${n}: calculadora y honorarios</h2><p>Sobre ${precioFmt} € orientativos, comisión 6% + IVA ≈ <strong>${com6.toLocaleString('es-ES')} €</strong> frente a <strong>3.000 € + IVA (3.630 € en escritura)</strong> fijos si cierras con nosotros. <a href="#calc">Calculadora</a> · <a href="/vender-por-tu-cuenta-vs-nuevahabitat-barcelona">comparativa</a>.</p><h2>Panel, visitas y arras en ${n}</h2><p>Sube comunidad, energético y nota simple; abre visitas solo con cita y solvencia contrastada. Arras con plazo realista (60–75 días) y condiciones suspensivas claras. Herencia: <a href="/vender-piso-herencia-barcelona">guía herencia</a>. Alquilado: <a href="/vender-piso-alquilado-barcelona">piso alquilado</a>.</p><h2>Preguntas frecuentes del particular en ${n}</h2>${faqBlock}<h2>Próximo paso</h2><p>Formulario con m² y calle en ${n}. Valoración orientativa en 24 h laborables desde Les Corts — sin exclusiva abusiva.</p>`;

  return intro + body + outro;
}

function buildParticular(barrioSlug) {
  const p = path.join(BARRIO_DIR, `${barrioSlug}.json`);
  if (!fs.existsSync(p)) throw new Error(`Missing barrio JSON: ${barrioSlug}`);
  const b = JSON.parse(fs.readFileSync(p, 'utf8'));
  const slug = barrioSlug.replace(/^vender-/, 'vender-como-particular-');
  const n = b.barrio;
  const cp = (b.postalCodes && b.postalCodes[0]) || '08000';
  const dm = b.datosMercado || {};
  const precio = b.ejemploPrecio || 350000;

  return {
    slug,
    cluster: 'particular',
    indexable: true,
    keyword_principal: `vender piso particular ${n.toLowerCase()} barcelona`,
    keyword_aliases: buildAliases(b),
    footerLabel: `Particular ${n}`,
    priority: 0.89,
    origen_lead: slug,
    datosMercado: {
      precioM2: dm.precioM2,
      tiempoVenta: dm.tiempoVenta,
      tendencia: dm.tendencia,
    },
    perfilComprador: b.perfilComprador,
    tipologiaEdificios: b.tipologiaEdificios,
    meta: {
      title: `Vender tu piso en ${n} siendo particular · 3.000 € + IVA (3.630 € en escritura) · NuevaHabitat`,
      description: `Guía particular ${n} (${cp}): ${dm.precioM2 || 'valoración local'}. Errores en portal, panel vendedor y precio fijo solo en escritura.`,
      keywords: buildAliases(b).join(', '),
    },
    hero: {
      badge: `${n} · ${cp} · Particular`,
      h1: `Vender tu piso en ${n} siendo particular: 3.000 € + IVA (3.630 € en escritura) en escritura, panel del vendedor y visitas con criterio`,
      lead: `Publicaste en ${n} (${zonasShort(b)}) y las visitas no cuadran con el precio. <strong>NuevaHabitat</strong> acompaña al propietario con <strong>3.000 € + IVA (3.630 € en escritura)</strong> solo en escritura, panel vendedor y compradores con solvencia contrastada.`,
      image: b.heroImage || 'imagenes/interior3.jpg',
      imageAlt: b.heroImageAlt || `Particular vendiendo piso en ${n} Barcelona`,
      objectPosition: 'center 40%',
    },
    breadcrumbCurrent: `Particular ${n}`,
    argumento_principal: buildArgumento(b, barrioSlug),
    calculadora: {
      precioDefault: precio,
      titulo: `Calculadora ${n}: particular vs 6%`,
      subtitulo: `Ejemplo orientativo ${precioFmt(precio)} € en ${n}.`,
    },
    como_ayudamos: {
      title: `Particular en ${n}: de portal a escritura`,
      description: `${n} · Barcelona`,
      steps: [
        { title: `Valoración ${cp}`, body: `Comparables en ${n}, no media genérica Barcelona.` },
        { title: 'Plan particular', body: 'Seguir solo, ajustar precio o activar compradores filtrados.' },
        { title: 'Panel vendedor', body: 'Documentos y visitas con cita.' },
        { title: 'Solo solvencia', body: 'Hipoteca o liquidez antes de abrir la puerta.' },
        { title: 'Arras', body: 'Plazos realistas con banco del comprador.' },
        { title: '3.000 € + IVA (3.630 € en escritura) en escritura', body: 'Sin venta, sin factura de agencia.' },
      ],
    },
    comparativa_modelos: {
      title: `Particular ${n}: portal vs 6% vs NuevaHabitat`,
      rows: [
        { modelo: 'Particular en portal', tiempo: dm.tiempoVenta || 'Variable', coste: 'Anuncio + sábados', riesgo: 'Curiosos sin hipoteca', tipo: 'neutral' },
        { modelo: 'Agencia ~6%', tiempo: '4–8 meses', coste: `>${Math.round(precio * 0.06 * 1.21 / 1000)}k €`, riesgo: 'Exclusiva', tipo: 'lose' },
        { modelo: 'Low-cost online', tiempo: 'Variable', coste: 'Cuota', riesgo: 'Poco seguimiento arras', tipo: 'neutral' },
        { modelo: `NuevaHabitat ${n}`, tiempo: dm.tiempoVenta || 'Plan 60–90 días', coste: '3.000 € + IVA (3.630 € en escritura) escritura', riesgo: 'Sin venta, sin factura', tipo: 'win' },
      ],
    },
    mitos: {
      title: `Mitos del particular vendedor en ${n}`,
      items: [
        { mito: `En ${n} vende cualquiera rápido`, realidad: 'Sin pricing fino y filtro, el tiempo en mercado se alarga.' },
        { mito: 'Más visitas = más cerca de vender', realidad: 'Visitas sin hipoteca desgastan al particular.' },
        { mito: 'El 6% es inevitable', realidad: 'Precio fijo 3.000 € + IVA (3.630 € en escritura) es alternativa real.' },
        { mito: 'Publicar alto y bajar no penaliza', realidad: 'Días en portal sin oferta erosionan negociación final.' },
        { mito: 'Panel vendedor es solo para agencias', realidad: 'Útil cuando saturaste WhatsApp.' },
      ],
    },
    checklist: {
      title: `Checklist particular ${n}`,
      intro: `${cp} — antes de publicar o firmar mandato.`,
      items: [
        '¿Titular nombra barrio concreto?',
        '¿Precio coherente con calle y planta?',
        '¿Energético y comunidad listos?',
        '¿Filtras hipoteca?',
        '¿Calculaste 6% vs 3.000 € + IVA (3.630 € en escritura)?',
        '¿Micro-zona clara en portal?',
      ],
    },
    faq: [
      { q: `¿Cuánto pago como particular con NuevaHabitat en ${n}?`, a: '3.000 € + IVA (3.630 € en escritura) total solo en escritura. Sin venta, no hay honorarios.' },
      { q: '¿Precio orientativo piso medio?', a: `Orientativamente ${precioFmt(precio)} € según estado. Valoración en 24 h.` },
      { q: '¿Piso alquilado?', a: 'Sí, con transparencia; comprador puede ser inversor o familia según plazo.' },
      { q: '¿Panel del vendedor?', a: 'Visitas, calendario, documentos y ofertas en un expediente.' },
      { q: '¿Puedo probar portal primero?', a: 'Sí; valoración indica si precio o docs bloquean.' },
      { q: '¿Exclusiva larga?', a: 'No exclusivas abusivas ni 6% obligatorio.' },
    ],
    relacionadas: [
      { slug: 'vender-como-particular-barcelona', label: 'Particular Barcelona' },
      { slug: barrioSlug, label: `Vender ${n}` },
      ...(b.relacionadas || []).slice(0, 3).map((r) => ({ slug: r.slug, label: r.label })),
    ],
    keywords_footer: `vender piso particular ${n.toLowerCase()} · ${cp} · sin agencia 6%`,
    whatsappText: `Hola%2C%20soy%20particular%20y%20quiero%20vender%20en%20${encodeURIComponent(n)}`,
    formPlaceholder: `${n} — calle aproximada y m²`,
    form_side_text: `Indica micro-zona en ${n}. Rango €/m² y plan particular — 3.000 € + IVA (3.630 € en escritura) solo en escritura.`,
  };
}

function zonasShort(b) {
  return (b.zonas || [b.barrio]).slice(0, 3).join(', ');
}

function precioFmt(n) {
  return n.toLocaleString('es-ES');
}

let n = 0;
for (const barrioSlug of BARRIO_SLUGS) {
  const outSlug = barrioSlug.replace(/^vender-/, 'vender-como-particular-');
  const outPath = path.join(OUT_DIR, `${outSlug}.json`);
  const force = process.argv.includes('--force');
  if (fs.existsSync(outPath) && !force) {
    console.log('skip (exists)', outSlug, '— use --force');
    continue;
  }
  const data = buildParticular(barrioSlug);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('wrote', outSlug);
  n++;
}
console.log('Done.', n, 'new files');
