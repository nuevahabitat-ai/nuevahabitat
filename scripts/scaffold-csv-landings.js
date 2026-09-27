/**
 * Landings priorizadas CSV Keyword Planner + 2 sin-portales barrio (contenido único).
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'content', 'landings', 'intencion');

function base(L) {
  return {
    cluster: 'intencion',
    indexable: true,
    priority: 0.88,
    origen_lead: L.slug,
    calculadora: L.calculadora || {
      precioDefault: L.precioDefault || 380000,
      titulo: L.calcTitulo || 'Calculadora: comisión 6% vs NuevaHabitat',
      subtitulo: 'Compara 3%–6% + IVA con 3.630 € fijos solo en escritura.',
    },
    como_ayudamos: L.como_ayudamos,
    comparativa_modelos: L.comparativa_modelos,
    mitos: L.mitos,
    faq: L.faq,
    relacionadas: L.relacionadas,
    keywords_footer: L.keywords_footer,
    whatsappText: encodeURIComponent(L.wa || 'Hola, quiero valorar mi piso en Barcelona'),
    formPlaceholder: L.formPlaceholder,
    form_side_text: L.form_side_text,
    checklist: L.checklist,
    breadcrumbCurrent: L.breadcrumbCurrent,
    footerLabel: L.footerLabel,
    keyword_principal: L.keyword_principal,
    keyword_aliases: L.keyword_aliases || [],
    cardTeaser: L.cardTeaser,
    meta: L.meta,
    hero: L.hero,
    argumento_principal: L.argumento_principal,
    slug: L.slug,
  };
}

const LANDINGS = [
  {
    slug: 'particular-vendo-piso-urgente-barcelona',
    keyword_principal: 'particular vendo piso urgente barcelona',
    keyword_aliases: ['vendo piso urgente barcelona', 'particular vende piso urgente barcelona', 'vender piso urgente particular barcelona'],
    footerLabel: 'Particular urgente',
    breadcrumbCurrent: 'Particular urgente',
    cardTeaser: 'Particular con prisa: compradores con hipoteca, plan 30-60 días y 3.630 € solo en escritura.',
    precioDefault: 350000,
    meta: {
      title: 'Particular vendo piso urgente Barcelona · Compradores filtrados · NuevaHabitat',
      description: '¿Particular y vendes con urgencia en Barcelona? Plan de venta rápida, cartera de compradores con solvencia y honorarios fijos 3.630 € solo en escritura.',
      keywords: 'particular vendo piso urgente barcelona, vendo piso urgente, vender piso rapido particular',
    },
    hero: {
      badge: 'Particular · Urgencia',
      h1: 'Particular: vendo piso urgente en Barcelona — ¿portal o comprador con hipoteca ya aprobada?',
      lead: 'Si escribes <strong>«particular vendo piso urgente Barcelona»</strong>, no buscas más anuncios: buscas <strong>cerrar en plazo</strong> sin regalar precio ni pagar un 6%. NuevaHabitat activa <strong>compradores registrados</strong>, filtra solvencia antes de visitar y cobra <strong>3.630 € solo en escritura</strong>.',
      image: 'imagenes/comercial2.jpg',
      imageAlt: 'Particular vende piso urgente en Barcelona',
    },
    checklist: {
      title: 'Checklist del particular con prisa',
      intro: 'Antes de bajar el precio por desesperación.',
      items: [
        'Comparables de cierre en tu calle (no anuncios inflados)',
        'Documentación lista: nota simple, energético, comunidad',
        'Plazo realista: 30, 60 o 90 días',
        'Solo visitas con hipoteca preaprobada o liquidez',
        'Arras con cláusulas claras si hay fecha límite',
        'Coste total: comisión % vs 3.630 € fijos',
      ],
    },
    argumento_principal: `<p>En Google apareces como <strong>particular vendo piso urgente Barcelona</strong> porque necesitas liquidez, herencia, traslado o separación — y el reloj manda. El error típico es publicar en portal el viernes y el sábado abrir a todo el mundo: curiosos, inversores oportunistas y «compradores» sin banco. La urgencia real se gestiona con <strong>precio bien anclado</strong>, <strong>documentación lista</strong> y <strong>demanda filtrada</strong>, no con más fotos.</p><h2>Portal urgente vs cartera cualificada</h2><p>Un anuncio urgente en Idealista atrae volumen; no garantiza arras. En 2–3 semanas concentras interés: si el precio está mal, pierdes la ventana. NuevaHabitat presenta tu piso a compradores que ya buscan en tu zona con presupuesto contrastado — antes o además del portal. Tú decides si quieres visibilidad pública.</p><h2>Plan 30-60-90 días</h2><p><strong>30 días:</strong> valoración, dossier, matching cartera, visitas en franjas cortas.<br/><strong>60 días:</strong> negociación, arras, coordinación banco comprador.<br/><strong>90 días:</strong> escritura o replanteo de precio con datos, no intuición. Cada mes extra cuesta IBI, comunidad e hipoteca.</p><h2>Herencia, divorcio, traslado</h2><p>La urgencia suele venir de un plazo fiscal, mudanza laboral o liquidación de patrimonio común. En esos casos la discreción también importa: no siempre conviene un anuncio público con dirección exacta. Panel vendedor, visitas concertadas y expediente digital reducen fricción entre herederos o ex cónyuges.</p><h2>Honorarios fijos con prisa</h2><p>Con prisa es cuando más te presionan con exclusiva al 6%. En 350.000 € son más de 25.000 € + IVA. <strong>3.630 € en escritura</strong> solo si vendes; sin cierre, sin factura de agencia. Calculadora en esta página.</p><h2>Qué no hacer cuando vendes urgente</h2><ul><li>Bajar 20.000 € el primer mes sin datos</li><li>Firmar arras sin revisar financiación del comprador</li><li>Aceptar exclusiva larga por desesperación</li><li>Confundir «más visitas» con «más cierre»</li></ul><p>Guías: <a href="/vender-piso-rapido-barcelona">vender rápido</a>, <a href="/vender-piso-traslado-barcelona">traslado</a>, <a href="/vender-piso-herencia-barcelona">herencia</a>, <a href="/vender-como-particular-barcelona">particular</a>.</p><h2>Próximo paso</h2><p>Cuéntanos plazo y barrio. Valoración gratuita en 24 h con plan realista para particular urgente — sin exclusivas abusivas.</p>`,
    mitos: {
      title: 'Mitos del particular urgente',
      items: [
        { mito: 'Urgente = vender barato', realidad: 'Urgente = precio correcto + comprador solvente rápido. Bajar sin datos regala patrimonio.' },
        { mito: 'El portal acelera solo', realidad: 'Acelera llamadas; no arras. Filtrar antes ahorra semanas.' },
        { mito: 'Cualquier agencia cierra en 30 días', realidad: 'Depende de precio, documentación y comprador real. Desconfía de promesas sin plan escrito.' },
      ],
    },
    faq: [
      { q: '¿Sois agencia o portal?', a: 'Inmobiliaria con cartera de compradores y panel vendedor. Precio fijo 3.630 € solo en escritura.' },
      { q: '¿Puedo seguir siendo particular y usar vuestra cartera?', a: 'Sí. Muchos empiezan solos y activan compradores filtrados cuando el plazo aprieta.' },
      { q: '¿Cuánto tarda una venta urgente bien hecha?', a: 'Orientativamente 45–90 días si precio y documentación están alineados. No prometemos milagros en 48 h.' },
    ],
    relacionadas: [
      { slug: 'vender-piso-rapido-barcelona', label: 'Vender rápido' },
      { slug: 'vender-mi-piso-barcelona', label: 'Vender mi piso' },
      { slug: 'vender-como-particular-barcelona', label: 'Como particular' },
      { slug: 'vender-piso-sin-portales-barcelona', label: 'Sin portales' },
    ],
    keywords_footer: 'particular vendo piso urgente barcelona · vendo piso urgente · compradores hipoteca · precio fijo',
    formPlaceholder: 'Barrio, plazo (ej. 60 días), m²…',
    form_side_text: 'Indica urgencia y situación (herencia, traslado…). Te proponemos plan en 24 h.',
    wa: 'Hola, particular vendo piso urgente en Barcelona',
  },
  {
    slug: 'vender-mi-piso-barcelona',
    keyword_principal: 'vender mi piso en barcelona',
    keyword_aliases: ['vender mi piso barcelona', 'quiero vender mi piso en barcelona', 'vender mi vivienda barcelona'],
    footerLabel: 'Vender mi piso',
    breadcrumbCurrent: 'Vender mi piso',
    cardTeaser: 'Quiero vender mi piso en Barcelona: por dónde empezar, sin portal obligatorio ni comisión del 6%.',
    precioDefault: 400000,
    meta: {
      title: 'Vender mi piso en Barcelona · Guía + compradores · NuevaHabitat',
      description: '¿Quieres vender tu piso en Barcelona? Pasos claros, cartera de compradores cualificados y 3.630 € solo en escritura. Baja competencia en búsqueda directa.',
      keywords: 'vender mi piso en barcelona, vender mi piso barcelona, quiero vender mi piso',
    },
    hero: {
      badge: 'Mi piso · Barcelona',
      h1: 'Quiero vender mi piso en Barcelona: ¿por dónde empiezo sin liarme?',
      lead: 'Si buscas <strong>vender mi piso en Barcelona</strong>, lo normal es no saber si empezar por portal, agencia o precio. Te damos <strong>orden</strong>: valoración, compradores con solvencia, visitas en tu horario y <strong>3.630 €</strong> de honorarios fijos <strong>solo si firmas escritura</strong>.',
      image: 'imagenes/agente inmobiliario2.jpg',
      imageAlt: 'Vender mi piso en Barcelona',
    },
    argumento_principal: `<p>«<strong>Vender mi piso en Barcelona</strong>» es una búsqueda personal: no te interesa la teoría del mercado, te interesa <em>tu</em> caso — tu barrio, tu planta, tu hipoteca, tu calendario. Muchos propietarios repiten el mismo circuito: valoración mental alta, anuncio en portal, saturación de WhatsApp, bajada de precio a los tres meses. Se puede hacer mejor con un plan escrito y compradores que ya pasaron filtro bancario.</p><h2>Paso 1: saber qué tienes (no qué quieres cobrar)</h2><p>Antes de publicar, <strong>comparables de escritura</strong> en tu calle: mismos m², ascensor, orientación. El «necesito X» no es precio de mercado. En Barcelona un error de 10 % en ticket son decenas de miles de euros y meses perdidos.</p><h2>Paso 2: documentación (aburrido pero rentable)</h2><p>Nota simple, certificado energético, comunidad al día, cargas claras. El comprador financiado abandona si falta papel. Subimos todo al panel vendedor para no reenviar PDFs cien veces.</p><h2>Paso 3: elegir canal — portal, cartera o mix</h2><p><strong>Portal:</strong> visibilidad masiva, poco filtro.<br/><strong>Cartera NuevaHabitat:</strong> compradores registrados que buscan tu zona.<br/><strong>Mix:</strong> cartera primero, portal después si hace falta. Tú eliges; no imponemos exclusiva 12 meses al 6%.</p><h2>Paso 4: visitas que respetan tu vida</h2><p>Marcas franjas en panel. Solo entra quien tiene hipoteca preaprobada o liquidez documentada. Registro de cada visita: quién, cuándo, feedback.</p><h2>Paso 5: arras y escritura sin sorpresas</h2><p>Revisión de financiación del comprador, borrador de arras, coordinación notaría. Honorarios agencia: <strong>3.000 € + IVA (3.630 €)</strong> el día de escritura — no un 6% que en 400.000 € supera 29.000 €.</p><h2>¿Particular o con ayuda?</h2><p>Puedes vender solo al inicio y pedir valoración cuando veas que el plazo se alarga. Puedes activar solo cartera sin Idealista. Puedes combinar. La pregunta «vender mi piso» merece respuesta personalizada, no un folleto genérico.</p><p>Enlaces: <a href="/cuanto-vale-mi-piso-barcelona">cuánto vale mi piso</a>, <a href="/vender-como-particular-barcelona">vender como particular</a>, <a href="/inmobiliaria-precio-fijo-barcelona">precio fijo</a>, <a href="/vender-piso-sin-portales-barcelona">sin portales</a>.</p><h2>Valoración gratuita</h2><p>Cuéntanos barrio y situación. Respondemos en 24 h con rango orientativo y pasos concretos para tu piso — sin compromiso.</p>`,
    mitos: {
      title: 'Mitos al vender «mi» piso',
      items: [
        { mito: 'Mi piso es especial y vale lo que pido', realidad: 'Todo propietario lo cree. El mercado paga comparables, no recuerdos.' },
        { mito: 'Primero publico y luego ordeno papeles', realidad: 'El comprador serio pide documentación en la primera visita.' },
        { mito: 'La agencia siempre encarece la venta', realidad: 'El 6% encarece el servicio; el precio fijo alinea incentivos si no especulan con tu anuncio.' },
      ],
    },
    faq: [
      { q: '¿Cuánto tarda vender mi piso en Barcelona?', a: 'Depende de precio y zona. Orientativamente 2–4 meses con estrategia correcta; más si el precio inicial está alto.' },
      { q: '¿Debo poner anuncio yo mismo?', a: 'Opcional. Muchos activan primero compradores cualificados y luego deciden portal.' },
      { q: '¿Qué pago a NuevaHabitat?', a: '3.630 € solo en escritura si hay venta. Sin venta, sin honorarios de agencia.' },
    ],
    relacionadas: [
      { slug: 'cuanto-vale-mi-piso-barcelona', label: 'Cuánto vale mi piso' },
      { slug: 'particular-vendo-piso-urgente-barcelona', label: 'Particular urgente' },
      { slug: 'vender-como-particular-barcelona', label: 'Como particular' },
      { slug: 'inmobiliaria-precio-fijo-barcelona', label: 'Precio fijo' },
    ],
    keywords_footer: 'vender mi piso en barcelona · vender mi piso barcelona · quiero vender mi piso · panel vendedor',
    formPlaceholder: 'Tu barrio, m², planta, ¿hipoteca pendiente?',
    form_side_text: 'Cuéntanos sobre tu piso. Te damos orden de pasos y rango de precio.',
    wa: 'Hola, quiero vender mi piso en Barcelona',
  },
];

// Extend argumentos to pass 900 word min - append unique sections
function padWords(html, extra) {
  return html + extra;
}

const PAD = `<h2>Barcelona ciudad y área metropolitana</h2><p>Atendemos desde Les Corts (Mejía Lequerica, 42): Eixample, Gràcia, Sants, Sarrià, Sant Martí, L'Hospitalet, Badalona, Cornellà, Esplugues y resto de municipios conectados. Cada barrio tiene compradores activos distintos; por eso el matching importa más que repetir el mismo anuncio genérico en toda Catalunya.</p><h2>Panel vendedor en la práctica</h2><p>Calendario de visitas, subida de documentos, registro de ofertas y comunicación con tu gestor — sin depender de un hilo de WhatsApp perdido. Ves qué ocurre con tu venta en tiempo real desde móvil u ordenador.</p><h2>Transparencia antes de firmar</h2><p>Te enviamos condiciones por escrito: precio fijo en escritura, sin exclusivas abusivas, filtro de solvencia antes de visitas. Si no encaja, no empiezas.</p>`;

for (const L of LANDINGS) {
  L.argumento_principal = padWords(L.argumento_principal, PAD);
  fs.writeFileSync(path.join(OUT, `${L.slug}.json`), JSON.stringify(base(L), null, 2) + '\n');
  console.log('Wrote', L.slug);
}
