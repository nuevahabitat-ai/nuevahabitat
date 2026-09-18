/**
 * Genera landings cluster "particular" desde datos de barrio.
 * Uso: node scripts/scaffold-particular-barrios.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'content', 'landings', 'particular');

const BARRIOS = [
  {
    slug: 'vender-como-particular-horta-barcelona',
    barrioSlug: 'vender-horta',
    intencionSlug: 'inmobiliaria-precio-fijo-horta-barcelona',
    footerLabel: 'Particular Horta-Guinardó',
    keyword: 'vender piso particular horta barcelona',
    aliases: ['vender mi piso horta yo mismo', 'vender piso montbau particular', 'vender piso guinardo sin agencia', 'vender piso 08031 particular'],
    badge: 'Horta-Guinardó · 08031 · Particular',
    h1: 'Vender tu piso en Horta-Guinardó siendo particular: 3.630 € en escritura, panel del vendedor y visitas con criterio',
    lead: 'Publicaste desde <strong>Horta centre</strong>, <strong>Montbau</strong> o <strong>Vall d\'Hebron</strong> y las visitas no traen hipoteca. <strong>NuevaHabitat</strong> acompaña al particular con <strong>3.630 €</strong> solo en escritura, <strong>panel del vendedor</strong> y compradores con solvencia contrastada.',
    image: 'imagenes/horta1.jpg',
    imageAlt: 'Particular vendiendo piso en Horta-Guinardó Barcelona',
    objectPosition: 'center 40%',
    precioM2: '3.900 – 4.300 €/m² (Horta · Montbau · Guinardó)',
    tiempoVenta: '60 – 90 días',
    tendencia: 'Demanda familiar estable; sensibilidad alta a ascensor y planta en fincas sin lift',
    precioDefault: 420000,
    calcTitulo: 'Calculadora Horta: particular vs 6%',
    calcSub: 'Ticket habitual 350.000–480.000 €. Compara comisión 3%–6% + IVA con 3.630 € fijos.',
    zonas: ['Horta centre', 'Montbau', 'Vall d\'Hebron', 'La Teixonera', 'El Carmel'],
    cp: '08031',
    barrioNombre: 'Horta-Guinardó',
    ticket: '350.000–480.000',
    comision6: '30.000',
    ahorro: '26.000',
    microIntro: 'Horta centre, Montbau y El Carmel',
    situaciones: [
      ['Familia que reduce metros', 'vende piso grande tras marcha de hijos — comprador exige ascensor o planta baja documentada.'],
      ['Herencia entre hermanos', 'en La Teixonera — nota simple y plusvalía mal explicadas alargan meses.'],
      ['Piso alquilado', 'cerca Vall d\'Hebron — comprador inversor vs familiar; mensaje distinto.'],
      ['Traslado laboral', 'necesitas arras en fecha; visitas sin filtro retrasan todo.'],
    ],
    errores: [
      'Precio copiado del portal sin ajustar calle, planta y ascensor.',
      'Abrir visitas sin estudio hipotecario en barrio muy familiar.',
      'Fotos oscuras en pasillo de finca años 60–70.',
      'No mencionar desnivel en El Carmel cuando aplica.',
      'Firmar exclusiva al 6% tras agotar portal por desesperación.',
    ],
    interlinks: [
      { slug: 'vender-como-particular-barcelona', label: 'Particular Barcelona' },
      { slug: 'vender-horta', label: 'Vender Horta-Guinardó' },
      { slug: 'inmobiliaria-precio-fijo-horta-barcelona', label: 'Precio fijo Horta' },
      { slug: 'vender-como-particular-gracia-barcelona', label: 'Particular Gràcia' },
      { slug: 'vender-piso-herencia-barcelona', label: 'Herencia' },
    ],
    whatsapp: 'Hola%2C%20soy%20particular%20y%20quiero%20vender%20en%20Horta',
    formPlaceholder: 'Horta centre, Montbau o Carmel — m² y planta',
  },
  {
    slug: 'vender-como-particular-sant-marti-barcelona',
    barrioSlug: 'vender-sant-marti',
    intencionSlug: null,
    footerLabel: 'Particular Sant Martí',
    keyword: 'vender piso particular sant marti barcelona',
    aliases: ['vender mi piso poblenou yo mismo', 'vender piso el clot particular', 'vender piso 22@ sin agencia', 'vender piso 08005 particular'],
    badge: 'Sant Martí · 08005 · Particular',
    h1: 'Vender tu piso en Sant Martí siendo particular: 3.630 € en escritura, panel del vendedor y visitas con criterio',
    lead: 'Llevas semanas en portal desde <strong>Poblenou</strong>, <strong>El Clot</strong> o el <strong>22@</strong> y ninguna oferta trae financiación. <strong>NuevaHabitat</strong> acompaña al particular con precio fijo, panel vendedor y visitas solo con solvencia.',
    image: 'imagenes/interior11.jpg',
    imageAlt: 'Particular vendiendo piso en Sant Martí Barcelona',
    objectPosition: 'center 35%',
    precioM2: '3.900 – 5.200 €/m² (Poblenou · Clot · 22@ · Besòs)',
    tiempoVenta: '45 – 75 días',
    tendencia: 'Alta rotación en Poblenou/22@; pricing muy distinto entre sub-zonas',
    precioDefault: 385000,
    calcTitulo: 'Calculadora Sant Martí: particular vs 6%',
    calcSub: 'Ticket habitual 320.000–480.000 € según sub-zona.',
    zonas: ['Poblenou', 'El Clot', 'La Sagrera', '22@', 'Diagonal Mar', 'El Besòs'],
    cp: '08005',
    barrioNombre: 'Sant Martí',
    ticket: '320.000–480.000',
    comision6: '27.500',
    ahorro: '24.000',
    microIntro: 'Poblenou, El Clot y 22@',
    situaciones: [
      ['Profesional tech en Poblenou', 'vende loft reconvertido — comprador exige certificado energético y ITE clara.'],
      ['Herencia en El Clot', 'varios herederos; pricing debe usar comparables del Clot, no media Barcelona.'],
      ['Inversor liquida alquiler', 'en El Besòs — perfil comprador distinto al de familias del 22@.'],
      ['Traslado fuera del distrito', 'necesitas calendario de arras; visitas sin filtro saturan fines de semana.'],
    ],
    errores: [
      'Tratar Sant Martí como un solo precio — Poblenou ≠ El Besòs.',
      'Publicar sin mencionar ruido de obra en 22@ cuando aplica.',
      'Abrir visitas a curiosos de portal sin hipoteca preaprobada.',
      'Fotos que no muestran luminosidad en planta baja Poblenou.',
      'Firmar mandato al 6% sin calcular coste sobre ticket real.',
    ],
    interlinks: [
      { slug: 'vender-como-particular-barcelona', label: 'Particular Barcelona' },
      { slug: 'vender-sant-marti', label: 'Vender Sant Martí' },
      { slug: 'vender-como-particular-poblenou-barcelona', label: 'Particular Poblenou' },
      { slug: 'vender-como-particular-eixample-barcelona', label: 'Particular Eixample' },
      { slug: 'vender-piso-alquilado-barcelona', label: 'Piso alquilado' },
    ],
    whatsapp: 'Hola%2C%20soy%20particular%20y%20quiero%20vender%20en%20Sant%20Mart%C3%AD',
    formPlaceholder: 'Poblenou, Clot o 22@ — m² y situación',
  },
  {
    slug: 'vender-como-particular-badalona-barcelona',
    barrioSlug: 'vender-badalona',
    intencionSlug: 'inmobiliaria-precio-fijo-badalona-barcelona',
    footerLabel: 'Particular Badalona',
    keyword: 'vender piso particular badalona',
    aliases: ['vender mi piso badalona yo mismo', 'vender piso gorg particular', 'vender piso montigala sin agencia', 'vender piso 08911 particular'],
    badge: 'Badalona · 08911 · Particular',
    h1: 'Vender tu piso en Badalona siendo particular: 3.630 € en escritura, panel del vendedor y visitas con criterio',
    lead: 'Publicaste en <strong>Centre</strong>, <strong>Gorg</strong> o <strong>Montigalà</strong> y el teléfono suena pero no cierras. <strong>NuevaHabitat</strong> desde Les Corts acompaña al particular con <strong>3.630 €</strong> en escritura y compradores filtrados.',
    image: 'imagenes/interior11.jpg',
    imageAlt: 'Particular vendiendo piso en Badalona',
    objectPosition: 'center 42%',
    precioM2: '2.650 – 3.100 €/m² (Centre · Gorg · Montigalà)',
    tiempoVenta: '55 – 85 días',
    tendencia: 'Alto volumen; comprador desplazado desde Barcelona ciudad',
    precioDefault: 245000,
    calcTitulo: 'Calculadora Badalona: particular vs 6%',
    calcSub: 'Ticket habitual 220.000–290.000 €. Ahorro habitual >15.000 € vs 6%.',
    zonas: ['Centre', 'Gorg', 'Montigalà', 'La Salut', 'Artigues'],
    cp: '08911',
    barrioNombre: 'Badalona',
    ticket: '220.000–290.000',
    comision6: '17.500',
    ahorro: '14.000',
    microIntro: 'Centre, Gorg y Montigalà',
    situaciones: [
      ['Familia joven desplazada', 'vende para comprar en Maresme — comprador compara con L\'Hospitalet el mismo día.'],
      ['Herencia entre hermanos', 'en Centre — documentación desordenada frena arras.'],
      ['Piso alquilado', 'cerca playa — inversor vs vivienda habitual.'],
      ['Particular agotado en portal', 'tres meses sin oferta con hipoteca — suele ser pricing, no falta demanda.'],
    ],
    errores: [
      'Precio de Barcelona ciudad aplicado a Sant Roc o Artigues.',
      'No cuantificar minutos a metro L2 o playa.',
      'Visitas sin filtrar solvencia en municipio de alto volumen.',
      'Ocultar derrama o estado de finca años 60.',
      'Firmar exclusiva larga tras frustración en Idealista.',
    ],
    interlinks: [
      { slug: 'vender-como-particular-barcelona', label: 'Particular Barcelona' },
      { slug: 'vender-badalona', label: 'Vender Badalona' },
      { slug: 'inmobiliaria-precio-fijo-badalona-barcelona', label: 'Precio fijo Badalona' },
      { slug: 'vender-como-particular-l-hospitalet-barcelona', label: 'Particular L\'Hospitalet' },
      { slug: 'nuevahabitat-vs-idealista-particular', label: 'vs Idealista' },
    ],
    whatsapp: 'Hola%2C%20soy%20particular%20y%20quiero%20vender%20en%20Badalona',
    formPlaceholder: 'Centre, Gorg o Montigalà — m² y planta',
  },
  {
    slug: 'vender-como-particular-l-hospitalet-barcelona',
    barrioSlug: 'vender-l-hospitalet',
    intencionSlug: 'inmobiliaria-precio-fijo-l-hospitalet-barcelona',
    footerLabel: 'Particular L\'Hospitalet',
    keyword: 'vender piso particular l hospitalet',
    aliases: ['vender mi piso hospitalet yo mismo', 'vender piso bellvitge particular', 'vender piso pubilla cases sin agencia', 'vender piso 08901 particular'],
    badge: 'L\'Hospitalet · 08901 · Particular',
    h1: 'Vender tu piso en L\'Hospitalet siendo particular: 3.630 € en escritura, panel del vendedor y visitas con criterio',
    lead: 'Respondes WhatsApp desde <strong>Centre</strong>, <strong>Bellvitge</strong> o <strong>Pubilla Cases</strong> sin cerrar. <strong>NuevaHabitat</strong> (Les Corts) acompaña al particular con <strong>3.630 €</strong> solo en escritura y visitas con criterio.',
    image: 'imagenes/hospitalet1.jpg',
    imageAlt: 'Particular vendiendo piso en L\'Hospitalet',
    objectPosition: 'center 38%',
    precioM2: '2.750 – 3.200 €/m² (Centre · Bellvitge · Pubilla)',
    tiempoVenta: '60 – 90 días',
    tendencia: 'Máximo volumen área metropolitana; comprador muy sensible a metro',
    precioDefault: 265000,
    calcTitulo: 'Calculadora L\'Hospitalet: particular vs 6%',
    calcSub: 'Ticket habitual 220.000–320.000 €.',
    zonas: ['Centre', 'Bellvitge', 'Pubilla Cases', 'Granvia L\'H', 'Santa Eulàlia'],
    cp: '08901',
    barrioNombre: 'L\'Hospitalet de Llobregat',
    ticket: '220.000–320.000',
    comision6: '18.500',
    ahorro: '15.000',
    microIntro: 'Centre, Bellvitge y Pubilla Cases',
    situaciones: [
      ['Familia que sube de alquiler', 'primer piso en propiedad — comprador exige comunidad al día.'],
      ['Sanitario vende en Bellvitge', 'comprador similar; mensaje de proximidad hospital.'],
      ['Herencia en Pubilla Cases', 'varios herederos; plusvalía y nota simple.'],
      ['Traslado a Baix Llobregat', 'necesitas fecha de arras; curiosos de portal retrasan.'],
    ],
    errores: [
      'Precio único para todo el municipio — Centre ≠ Pubilla.',
      'No indicar minutos reales a metro L1.',
      'Visitas sin hipoteca preaprobada.',
      'Ignorar ruido en Gran Via sin explicar aislamiento.',
      'Mandato al 6% sin comparar con 3.630 € fijos.',
    ],
    interlinks: [
      { slug: 'vender-como-particular-barcelona', label: 'Particular Barcelona' },
      { slug: 'vender-l-hospitalet', label: 'Vender L\'Hospitalet' },
      { slug: 'inmobiliaria-precio-fijo-l-hospitalet-barcelona', label: 'Precio fijo L\'Hospitalet' },
      { slug: 'vender-como-particular-badalona-barcelona', label: 'Particular Badalona' },
      { slug: 'vender-piso-alquilado-barcelona', label: 'Piso alquilado' },
    ],
    whatsapp: 'Hola%2C%20soy%20particular%20y%20quiero%20vender%20en%20L%27Hospitalet',
    formPlaceholder: 'Centre, Bellvitge o Pubilla — m²',
  },
];

function buildArgumento(b) {
  const intLink = b.intencionSlug
    ? `<a href="/${b.intencionSlug}">inmobiliaria precio fijo ${b.barrioNombre}</a>`
    : `<a href="/${b.barrioSlug}">vender en ${b.barrioNombre}</a>`;
  const zonasList = b.zonas.join(', ');
  const sitHtml = b.situaciones.map(([t, d]) => `<p><strong>${t}</strong> — ${d}</p>`).join('');
  const errHtml = b.errores.map((e) => `<li>${e}</li>`).join('');
  const extraBlocks = b.zonas.map((z, i) =>
    `<h2>${z}: particular y comprador local</h2><p>En ${z}, el particular que publica sin micro-zona pierde posicionamiento frente a anuncios que nombran calle, planta y ascensor. Compradores de ${b.barrioNombre} comparan ${b.ticket} € con alternativas en municipios vecinos el mismo fin de semana — tu ficha debe explicar por qué tu piso encaja en ese bucket, no en una media regional inventada. Valoración NuevaHabitat usa comparables de cierre en ${b.cp}, no precios de portal inflados un 8–12%.</p>`
  ).join('');

  return `<p>Vender como <strong>particular en ${b.barrioNombre}</strong> empieza con ilusión: muchas consultas, fotos compartidas, algún «me interesa» por WhatsApp. El problema aparece cuando ninguna oferta llega con hipoteca aprobada o liquidez documentada. Orientativamente 2026: <strong>${b.precioM2}</strong>; ticket habitual <strong>${b.ticket} €</strong> según m², planta y estado. Tratar ${b.barrioNombre} como bloque único — sin distinguir ${b.microIntro} — es el error más caro del vendedor autónomo.</p><p>Guía Barcelona: <a href="/vender-como-particular-barcelona">particular en Barcelona</a>. Barrio: <a href="/${b.barrioSlug}">vender en ${b.barrioNombre}</a>. Precio fijo: ${intLink}.</p><h2>Situaciones que vemos en ${b.barrioNombre}</h2>${sitHtml}<h2>Errores típicos del particular en ${b.cp}</h2><ol>${errHtml}</ol><h2>Calculadora: ${b.precioDefault.toLocaleString('es-ES')} €</h2><p>6% + IVA ≈ <strong>${b.comision6} €</strong> de comisión tradicional. Precio fijo <strong>3.630 €</strong>. <a href="#calc">Calculadora</a> — ahorro orientativo superior a <strong>${b.ahorro} €</strong>.</p><h2>Panel del vendedor</h2><p>Centraliza visitas, documentos y ofertas. El particular que saturó WhatsApp recupera control: franjas, registro, feedback. Compradores con estudio hipotecario entran primero.</p><h2>Documentación antes de publicar</h2><ul><li>Certificado energético y cédula si aplica.</li><li>Comunidad e IBI al día; derramas visibles.</li><li>Nota simple sin cargas sorpresa.</li><li>Si hay inquilino: contrato y calendario explicados.</li></ul><h2>Micro-zonas en ${b.barrioNombre}</h2><p>${zonasList} no comparten el mismo comprador ni €/m². Titular genérico «piso en ${b.barrioNombre}» no posiciona en búsqueda ni filtra curiosos.</p>${extraBlocks}<h2>Cuándo pedir valoración</h2><p>Ocho semanas sin oferta financiada; herencia; piso alquilado; o quieres coste cerrado antes de mandato. Valoración 24 h desde Les Corts, sin exclusiva abusiva.</p><h2>Preguntas antes de firmar agencia</h2><p>¿Honorarios totales? ¿Cobro en escritura? ¿Filtro hipoteca? ¿Panel? ¿Exclusiva? Compara con <a href="/nuevahabitat-vs-agencia-tradicional-barcelona">agencia tradicional</a> y <a href="/nuevahabitat-vs-idealista-particular">Idealista</a> solo.</p><h2>Arras y señal</h2><p>Señal sin revisar financiación del comprador es apuesta. Acompañamiento hasta arras ordena calendario sin sustituir asesoramiento legal.</p><h2>Plusvalía y gestoría</h2><p>Coordinamos calendario con tu gestor; no asesoramiento fiscal vinculante, pero evitamos cierres desorganizados.</p><h2>Interlinking particulares</h2><p>Propietarios comparan barrios del silo «particular» antes de decidir — enlaces internos refuerzan navegación y SEO.</p><h2>Servicio NuevaHabitat al particular</h2><p>Valoración con comparables locales, difusión a compradores con solvencia, negociación hasta arras, seguimiento escritura. Cobro único 3.630 € al cierre. Sin venta, sin factura de honorarios. Condiciones por escrito en 24 h laborables. WhatsApp y formulario en esta página. Si pruebas portal un mes más, valoración indica si el cuello de botella es precio, fotos o documentación — sin presión de exclusiva el mismo día. Panel útil aunque empieces solo: subes docs una vez. En ${b.barrioNombre}, un ajuste de 5.000 € mal temporizado puede costar más que toda la intermediación — valoración previa con cierres reales es el paso más rentable. Comprador habitual llega con preaprobación condicionada: confirma condiciones antes de reservar el sábado entero. Filtramos curiosos de portal que repiten visita por Idealista, Fotocasa y mil anuncios sin intención real de compra.</p><h2>Próximo paso</h2><p>Calculadora, comparativa y formulario. Indica micro-zona (${b.microIntro}) y m². Respuesta en 24 h con rango orientativo.</p>`;
}

function buildLanding(b) {
  const intencionLink = b.intencionSlug ? `<a href="/${b.intencionSlug}">precio fijo ${b.barrioNombre}</a>` : `<a href="/${b.barrioSlug}">vender ${b.barrioNombre}</a>`;
  return {
    slug: b.slug,
    cluster: 'particular',
    indexable: true,
    keyword_principal: b.keyword,
    keyword_aliases: b.aliases,
    footerLabel: b.footerLabel,
    priority: 0.9,
    origen_lead: b.slug,
    datosMercado: {
      precioM2: b.precioM2,
      tiempoVenta: b.tiempoVenta,
      tendencia: b.tendencia,
    },
    perfilComprador: `En ${b.barrioNombre} el particular mezcla perfiles distintos (${b.zonas.slice(0, 3).join(', ')}) si no filtra hipoteca y micro-zona. Comprador familiar, inversor y desplazado desde Barcelona ciudad no comparten el mismo discurso ni el mismo precio máximo.`,
    tipologiaEdificios: `Parque heterogéneo en ${b.barrioNombre}: estado de finca, ascensor y planta condicionan el ticket tanto como la reforma. El anuncio genérico penaliza visitas.`,
    meta: {
      title: `Vender tu piso en ${b.barrioNombre} siendo particular · 3.630 € · NuevaHabitat`,
      description: `Guía particular ${b.barrioNombre}: ${b.precioM2}. Errores en portal, panel vendedor y precio fijo solo en escritura.`,
      keywords: b.aliases.join(', '),
    },
    hero: {
      badge: b.badge,
      h1: b.h1,
      lead: b.lead,
      image: b.image,
      imageAlt: b.imageAlt,
      objectPosition: b.objectPosition,
    },
    breadcrumbCurrent: b.footerLabel,
    argumento_principal: buildArgumento(b),
    calculadora: {
      precioDefault: b.precioDefault,
      titulo: b.calcTitulo,
      subtitulo: b.calcSub,
    },
    como_ayudamos: {
      title: `Particular en ${b.barrioNombre}: filtro y precio por calle`,
      description: b.microIntro,
      steps: [
        { title: `Valoración ${b.cp}`, body: 'Comparables por calle, no media Barcelona.' },
        { title: 'Plan particular', body: 'Seguir solo, ajustar precio o activar compradores.' },
        { title: 'Panel vendedor', body: 'Visitas en tus franjas, registro y docs.' },
        { title: 'Solo solvencia', body: 'Hipoteca o liquidez antes de abrir la puerta.' },
        { title: 'Arras', body: `Negociación con datos de cierre ${b.barrioNombre}.` },
        { title: 'Escritura 3.630 €', body: 'Sin venta, sin factura.' },
      ],
    },
    comparativa_modelos: {
      title: `Particular ${b.barrioNombre}: portal vs 6% vs NuevaHabitat`,
      rows: [
        { modelo: 'Particular en portal', tiempo: b.tiempoVenta + '+', coste: 'Anuncio + sábados', riesgo: 'Curiosos sin hipoteca', tipo: 'neutral' },
        { modelo: 'Agencia ~6%', tiempo: '4–8 meses', coste: `>${b.comision6} €`, riesgo: 'Exclusiva', tipo: 'lose' },
        { modelo: 'Low-cost online', tiempo: 'Variable', coste: 'Cuota', riesgo: 'Poco arras', tipo: 'neutral' },
        { modelo: `NuevaHabitat ${b.barrioNombre}`, tiempo: b.tiempoVenta, coste: '3.630 € escritura', riesgo: 'Sin venta, sin factura', tipo: 'win' },
      ],
    },
    mitos: {
      title: `Mitos del particular vendedor en ${b.barrioNombre}`,
      items: [
        { mito: `En ${b.barrioNombre} vende cualquiera rápido`, realidad: 'Sin pricing fino y filtro, el tiempo en mercado se alarga.' },
        { mito: 'Todas las zonas valen lo mismo', realidad: `${b.microIntro} tienen compradores distintos.` },
        { mito: 'Más visitas = más cerca de vender', realidad: 'Visitas sin hipoteca desgastan al particular.' },
        { mito: 'El 6% es inevitable', realidad: 'Precio fijo 3.630 € es alternativa real.' },
        { mito: 'Panel vendedor es solo para agencias', realidad: 'Útil cuando saturaste WhatsApp.' },
      ],
    },
    checklist: {
      title: `Checklist particular ${b.barrioNombre}`,
      intro: 'Antes de publicar o firmar mandato.',
      items: ['¿Precio coherente con calle y planta?', '¿Energético y comunidad listos?', '¿Filtras hipoteca?', '¿6% calculado?', '¿Cobro solo en escritura?', '¿Micro-zona clara en título?'],
    },
    faq: [
      { q: `¿Cuánto pago como particular con NuevaHabitat en ${b.barrioNombre}?`, a: '3.630 € total solo en escritura. Sin venta, no hay honorarios.' },
      { q: '¿Precio orientativo piso medio?', a: `Orientativamente ${b.ticket} € según zona y estado. Valoración en 24 h.` },
      { q: '¿Piso alquilado?', a: 'Sí, con transparencia; comprador puede ser inversor.' },
      { q: '¿Puedo probar portal primero?', a: 'Sí; valoración indica si precio o docs bloquean.' },
      { q: '¿Panel del vendedor?', a: 'Visitas, calendario, documentos y ofertas en un expediente.' },
      { q: '¿Exclusiva?', a: 'No exclusivas largas ni 6% obligatorio.' },
    ],
    relacionadas: b.interlinks,
    keywords_footer: `${b.keyword} · ${b.cp} · sin agencia 6%`,
    whatsappText: b.whatsapp,
    formPlaceholder: b.formPlaceholder,
    form_side_text: `Indica micro-zona en ${b.barrioNombre}. Rango €/m² y plan particular — 3.630 € solo en escritura.`,
  };
}

BARRIOS.forEach((b) => {
  const outPath = path.join(OUT, `${b.slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(buildLanding(b), null, 2) + '\n', 'utf8');
  const wc = buildArgumento(b).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log('Wrote', b.slug + '.json', '—', wc, 'words');
});
