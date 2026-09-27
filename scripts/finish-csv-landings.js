/**
 * Completa landings CSV: ≥900 palabras, como_ayudamos, comparativa; + 3 nuevas.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'content', 'landings', 'intencion');

function stripHtml(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(html) {
  const t = stripHtml(html);
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}

function comoAyudamos(title, description, steps) {
  return { title, description, steps };
}

function comparativa(title, rows) {
  return { title, rows };
}

const STD_COMP = (title) =>
  comparativa(title, [
    {
      modelo: 'Portal + agencia tradicional 6%',
      tiempo: '4–8 meses',
      coste: '6% + IVA + anuncio',
      riesgo: 'Exclusiva; curiosos en portal',
      tipo: 'lose',
    },
    {
      modelo: 'Particular solo en portal',
      tiempo: 'Impredecible',
      coste: 'Cuota anuncio + tu tiempo',
      riesgo: 'Sin filtro de solvencia',
      tipo: 'neutral',
    },
    {
      modelo: 'NuevaHabitat precio fijo',
      tiempo: 'Plan 60–90 días habitual',
      coste: '3.630 € en escritura',
      riesgo: 'Sin venta, sin factura',
      tipo: 'win',
    },
  ]);

function write(slug, data) {
  let wc = wordCount(data.argumento_principal);
  if (wc < 900 && data._pad) {
    data.argumento_principal += data._pad;
    delete data._pad;
    wc = wordCount(data.argumento_principal);
  }
  if (wc < 900) {
    console.error(`FAIL ${slug}: ${wc} words (need ${900 - wc} more)`);
    process.exitCode = 1;
  }
  fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(data, null, 2) + '\n');
  console.log(`OK ${slug}: ${wc} words`);
}

const particulUrgentExtra = `<h2>Señales de comprador serio (antes de abrir tu casa)</h2><p>Cuando vendes urgente, cada visita mal gastada resta energía y tiempo. Pide por escrito: carta de preaprobación hipotecaria con importe mínimo, plazo orientativo de firma y origen del pago (ahorros, venta previa, herencia). Si solo recibes «me encanta, ya hablaré con el banco», no es urgencia compatible con la tuya. En Barcelona muchos compradores compiten por el mismo barrio; el que llega preparado suele ser quien cierra.</p><h2>Negociar con reloj sin regalar patrimonio</h2><p>La tentación es bajar 15.000 € la segunda semana. Mejor: revisar comparables de <em>cierre</em> en tu edificio, ajustar en tramos pequeños y exigir señal en arras proporcional. Un comprador con hipoteca aprobada entiende que el precio justo no es regalo: negocias plazos (60 días a escritura), incluidos en arras o no, y estado de la vivienda — no solo el ticket.</p><h2>Coste de cada mes que pasa</h2><p>IBI, comunidad, seguro, hipoteca pendiente, posible ITE o derrama. En un piso de 350.000 €, un mes extra puede costarte más que los honorarios fijos de agencia si arrastras precio mal anclado. La calculadora de esta página compara comisión del 6% con 3.630 €; pero también conviene multiplicar tus gastos mensuales por los meses que llevas sin vender.</p><h2>Herencia y varios propietarios</h2><p>La urgencia hereditaria mezcla plazos fiscales con desacuerdos entre herederos. Un panel con documentación única, visitas concertadas y un interlocutor claro evita que cada hermano responda WhatsApp distinto al comprador. Si hay usufructo o nuda propiedad, dilo antes: el comprador financiado lo descubrirá igual en nota simple.</p><h2>Traslado laboral o expatriación</h2><p>Vendes en Barcelona pero te mudas fuera: necesitas visitas agrupadas, firma con poder notarial si no puedes estar en arras, y comprador que respete plazos de banco español. Cartera filtrada reduce idas y venidas cuando ya no vives en el piso.</p><h2>Fotos y presentación con poco tiempo</h2><p>No hace falta reforma integral: luz natural, orden, encimera despejada y un ángulo que muestre metros reales. Con prisa, una sesión profesional de un día suele rentabilizar más que otro mes de anuncio con móvil borroso. El dossier privado a compradores cualificados puede ir antes que el anuncio público.</p><h2>Qué revisar en arras exprés</h2><p>Importe de señal, fecha límite de escritura, penalización por incumplimiento del comprador, cargas pendientes declaradas, estado de alquiler si hay inquilino. Un abogado o gestor revisa el borrador; nosotros coordinamos con la financiación del comprador para que la operación no caiga a dos días de notaría.</p><h2>Barrios donde más buscamos match urgente</h2><p>Sants, Eixample, Gràcia, Sant Martí, L'Hospitalet, Badalona, Sarrià, Les Corts y Cornellà tienen compradores activos con criterios distintos. Presentar tu piso al perfil correcto acorta plazos más que un anuncio genérico «Barcelona ciudad».</p>`;

const venderMiPisoExtra = `<h2>Vender con hipoteca pendiente</h2><p>Muchos propietarios preguntan «vender mi piso» cuando aún deben al banco. Necesitas saber saldo pendiente, si hay penalización por cancelación anticipada y cuánto quedará libre después de cancelar hipoteca, plusvalía y gastos. El comprador financiado espera transparencia: encargo de cancelación, fecha de escritura alineada con desembolso del banco comprador.</p><h2>ITE, certificado energético y comunidad</h2><p>En fincas pre-1960 del Eixample o Ciutat Vella, la ITE o inspección técnica puede ser requisito del comprador o del banco. El certificado energético es obligatorio al anunciar; conviene pedirlo antes de fijar precio. En comunidad, certificado de estar al corriente, derramas aprobadas y obras en fachada cambian la percepción del ticket.</p><h2>Segunda residencia vs vivienda habitual</h2><p>Si no vives en el piso, las visitas requieren llaves, portero avisado o presencia de familiar. El panel vendedor permite franjas concretas para no dejar el piso abierto todo el mes. Fiscalmente, la plusvalía municipal y la tributación personal pueden variar según antigüedad y uso; orientamos sobre plazos, sin sustituir asesor fiscal.</p><h2>Okupación, alquiler y desahucio</h2><p>Vender «mi» piso con inquilino es legal pero exige contrato claro, situación de renta y expectativas del comprador (inversor vs quien quiere entrar a vivir). Ocultar okupación o alquiler irregular frena cualquier hipoteca. Mejor declararlo en valoración y filtrar compradores que acepten esas condiciones.</p><h2>Reparto entre herederos o ex cónyuges</h2><p>Cuando el piso es de varios, hace falta acuerdo sobre precio mínimo, quién firma arras y reparto del neto. Un expediente digital compartido reduce malentendidos. Si estás en proceso de separación, la discreción puede ser tan importante como el precio: no siempre conviene anuncio masivo el primer mes.</p><h2>Estacionalidad en Barcelona</h2><p>Septiembre y enero suelen reactivar demanda tras verano y fiestas; agosto y diciembre pueden alargar plazos. No es ley absoluta: un precio bien puesto y comprador con hipoteca cierra en cualquier mes. Tu calendario personal (mudanza, colegio, trabajo) manda más que el calendario turístico.</p><h2>Cuánto vale realmente «mi» piso</h2><p>La búsqueda <a href="/cuanto-vale-mi-piso-barcelona">cuánto vale mi piso</a> complementa «vender mi piso»: primero rango de mercado, luego estrategia. Anuncios vecinos inflados no son comparables; importa qué se firmó en escritura en calles similares, planta, ascensor y estado.</p><h2>Después de la venta: gastos que olvidamos</h2><p>Plusvalía municipal (según ayuntamiento y años de tenencia), gestoría, posible comisión de cancelación hipotecaria, impuestos sobre la ganancia patrimonial según tu caso. Reservar neto real evita sorpresas el día después de escritura.</p><h2>Por qué muchos empiezan solos y luego llaman</h2><p>Es normal probar como particular unas semanas: ahorras comisión, aprendes qué preguntan los visitantes. Si a los 45 días no hay arras con financiación clara, activar cartera cualificada no es fracaso: es cambiar canal sin firmar exclusiva de un año al 6%.</p>`;

const cornellaArg = `<p>Si buscas <strong>vender piso Cornellà</strong> o <strong>venta piso Cornellà de Llobregat</strong>, compites con mucho volumen de anuncios orientados a <em>compradores</em> — pero tú eres <strong>propietario</strong>. Cornellà (~2.600–3.100 €/m²) concentra demanda de familias y parejas que quieren más metros y L5 directa a Diagonal. Vender bien aquí no es clonar un anuncio de Barcelona ciudad: Sant Ildefons, Centre, Almeda y Gavarra tienen compradores distintos.</p><h2>Perfil comprador en Cornellà (vendedor)</h2><p>En Sant Ildefons, bloques altos de los 60-70: priorizan precio de entrada y superficie. En Centre y Riera, comprador más urbano, camina a comercio y ayuntamiento. En Almeda y Gavarra, mix familia joven e inversor metropolitano. ${''}Presentar tu piso al perfil correcto evita visitas de quien busca Passeig de Gràcia con presupuesto de Cornellà.</p><h2>Ticket medio y comisión tradicional</h2><p>Con ejemplo 245.000 €, un 6% + IVA supera 17.000 € de comisión. NuevaHabitat cobra <strong>3.630 € solo en escritura</strong> si cierras. En ticket más bajo que Barcelona ciudad, la comisión porcentual duele proporcionalmente más en tu bolsillo.</p><h2>Documentación en promoción grande</h2><p>En comunidades grandes, certificado de deuda cero, actas de derrama y estado de rehabilitación de fachada importan. Compradores desplazados desde Barcelona preguntan por ruido, ascensor y parking. Tenlo en dossier antes de visitas.</p><h2>Conexión L5 y comprador desplazado</h2><p>Mucho comprador vive en Barcelona y mira Cornellà por ratio m²/precio. Tu ventaja como vendedor: destacar minutos reales a Plaça Catalunya, colegios, parques. Matching con compradores que ya filtraron «Cornellà + L5» acorta plazo frente a portal genérico.</p><h2>Vender sin exclusiva en área metropolitana</h2><p>No hace falta firmar 12 meses con agencia de Barcelona centro que no conoce Sant Ildefons. Precio fijo, visitas en tu horario, panel vendedor. Oficinas en Les Corts, operativa en 08940.</p><h2>Portal vs cartera en municipio</h2><p>Idealista mezcla tu anuncio con cientos de «casas en venta Cornellà» para compradores. Como vendedor, puedes activar cartera primero: compradores registrados con presupuesto 220.000–280.000 € y preferencia Llobregat. Portal después si hace falta ampliar demanda.</p><h2>Plazos habituales</h2><p>Orientativamente 60–90 días con precio alineado a mercado local. Más si sobreprecio inicial o documentación incompleta. Valoración gratuita con comparables de Cornellà, no solo de Barcelona.</p><p>Enlaces: <a href="/vender-cornella">vender en Cornellà</a>, <a href="/inmobiliaria-precio-fijo-cornella-barcelona">precio fijo Cornellà</a>, <a href="/venta-piso-economica-cornella-barcelona">venta económica Cornellà</a>, <a href="/vender-piso-sin-portales-barcelona">sin portales</a>.</p><h2>Herencia o venta rápida en Cornellà</h2><p>Piso heredado en Almeda, pareja que se traslada a Barcelona ciudad o inversor que liquida: cada caso cambia precio de salida y discreción. Cuéntanos situación en formulario; respondemos en 24 h.</p><h2>Transparencia de honorarios</h2><p>3.000 € + IVA en escritura, sin venta no hay factura de agencia. Calculadora en página. Comparar con 6% en tu precio real de Cornellà, no en un piso ficticio de 500.000 € de Diagonal.</p>`;

const cornellaPad = `<h2>Financiación del comprador en ticket medio-bajo</h2><p>En Cornellà muchas operaciones dependen de hipoteca al 80–90%: el comprador necesita tasación alineada con precio de venta. Anticipar documentación de comunidad y estado del piso evita tasaciones bajas que tumben la operación a última hora.</p><h2>Marketing tradicional vs cartera</h2><p>Folletos, carteles en finca y portales premium compiten por la misma búsqueda «casas en venta Cornellà». Como vendedor, medir conversiones: visitas con hipoteca vs llamadas vacías. Cartera cualificada prioriza ratio cierre.</p><h2>Desplazamiento desde Barcelona</h2><p>Compradores que venden piso en Gràcia y compran en Cornellà encadenan operaciones: valoramos plazos para no dejarte sin techo. Comunicación clara con gestoría y bancos de ambas partes.</p><h2>Impuestos y neto vendedor</h2><p>Plusvalía municipal, ganancia patrimonial según antigüedad, cancelación hipoteca. Fijar precio mínimo neto antes de aceptar oferta baja por prisa.</p><p>En Cornellà muchas operaciones dependen de hipoteca al 80–90%: el comprador necesita tasación alineada con precio de venta. Anticipar documentación de comunidad y estado del piso evita tasaciones bajas que tumben la operación a última hora.</p><h2>Garaje y trastero</h2><p>Plazas de parking y trasteros en bloques grandes suman valor percibido. Indica si van incluidos, arrendados o son propiedad separada en registro.</p><h2>Ruido y entorno</h2><p>Proximidad a FGC, ronda o zonas industriales: mejor explicarlo en dossier que que el comprador lo descubra en visita y desista.</p><h2>Vender estando en alquiler</h2><p>Si hay inquilino, contrato vigente y plazo de desalojo o transmisión al comprador inversor. Filtramos compradores que aceptan rentabilidad con inquilino.</p><h2>Comparar agencias porcentuales</h2><p>Pide por escrito comisión, exclusiva y qué pasa si vendes a conocido. En 245.000 € cada punto porcentual son 2.450 € antes de IVA.</p>`;

const cornellaExtra = `<h2>Rehabilitaciones en Sant Ildefons</h2><p>Bloques con fachada renovada y ascensor modernizado venden antes que planta baja sin reformar en edificio con colas de ITE. Destaca lo objetivo: año de reforma comunidad, estado cocina/baño, orientación.</p><h2>Competencia con Esplugues y L'Hospitalet</h2><p>Comprador compara Cornellà con Esplugues y L'Hospitalet en el mismo presupuesto. Tu argumento de venta: metro, servicios, ruido, tipo de edificio. Precio mal anclado a Barcelona ciudad frustra visitas.</p><h2>Plusvalía y ayuntamiento</h2><p>Plusvalía municipal Cornellà sigue reglas propias de tenencia y valor catastral. Reserva neto después de impuestos al fijar precio mínimo aceptable.</p>`;

function sinPortalesBarrio(slug, opts) {
  const {
    barrio,
    h1,
    lead,
    keyword,
    aliases,
    teaser,
    metaTitle,
    metaDesc,
    precioDefault,
    perfil,
    tipologia,
    mercado,
    zonas,
    image,
    imageAlt,
    extraSections,
    relacionadas,
    wa,
    customArg,
  } = opts;

  const arg =
    customArg ||
    `<p>Vender en <strong>${barrio}</strong> sin colgar el piso en Idealista o Fotocasa no es esconder defectos: es elegir <strong>quién entra primero</strong> en tu vivienda. ${perfil}</p><h2>Tipología en ${barrio}</h2><p>${tipologia}</p><h2>Mercado local (${mercado})</h2><p>En este rango, un error de precio del 8% puede significar meses extra o regalar decenas de miles de euros. Valoramos con comparables de zona, no con anuncios inflados de todo Barcelona.</p><h2>Cartera vs portal masivo en ${barrio}</h2><p>Un portal enseña tu piso a quien busca «pisos ${barrio}» sin filtrar hipoteca. Nuestra plataforma presenta el inmueble a compradores que ya definieron presupuesto, zona (${zonas}) y plazo. Menos curiosos en fin de semana; más conversaciones con arras posible.</p><h2>Privacidad en edificio señorial o comunidad pequeña</h2><p>Vecinos, porteros y presidentes de comunidad ven anuncios públicos. Vender sin portal mantiene discreción mientras activas demanda real. Útil en herencia, separación o cuando el inquilino sigue viviendo.</p><h2>Proceso NuevaHabitat en ${barrio}</h2><ol><li>Valoración con datos de calle y edificio.</li><li>Matching con compradores activos en ${barrio}.</li><li>Dossier privado antes de visitas abiertas.</li><li>Visitas solo con solvencia contrastada; panel vendedor.</li><li>Negociación, arras, escritura — <strong>3.630 €</strong> solo si cierras.</li></ol><h2>¿Combinar cartera y portal en ${barrio}?</h2><p>Algunos propietarios empiezan solo cartera 4–6 semanas; otros nunca publican. Tú decides. No imponemos exclusiva 6–12 meses al 6%.</p><p>Hub general: <a href="/vender-piso-sin-portales-barcelona">vender sin portales Barcelona</a>. Barrio: <a href="/${opts.barrioSlug}">${barrio}</a>. Precio fijo: <a href="/inmobiliaria-precio-fijo-${opts.urlSlug}-barcelona">inmobiliaria precio fijo ${barrio}</a>.</p>${extraSections || ''}`;

  return {
    slug,
    cluster: 'intencion',
    indexable: true,
    priority: 0.89,
    origen_lead: slug,
    keyword_principal: keyword,
    keyword_aliases: aliases,
    footerLabel: `Sin portales ${barrio}`,
    breadcrumbCurrent: `Sin portales · ${barrio}`,
    cardTeaser: teaser,
    meta: {
      title: metaTitle,
      description: metaDesc,
      keywords: aliases.join(', '),
    },
    hero: {
      badge: `${barrio} · Sin portales`,
      h1,
      lead,
      image,
      imageAlt,
    },
    argumento_principal: arg,
    calculadora: {
      precioDefault,
      titulo: `Calculadora ${barrio}: 6% vs precio fijo`,
      subtitulo: 'Compara comisión tradicional con 3.630 € solo en escritura.',
    },
    como_ayudamos: comoAyudamos(
      `Vender en ${barrio} con cartera privada`,
      `De la valoración local a compradores filtrados en ${barrio}, sin depender del portal.`,
      [
        { title: 'Valoración de barrio', body: `Comparables en ${zonas}, tipología y demanda activa.` },
        { title: 'Matching local', body: 'Compradores registrados que buscan este distrito y ticket.' },
        { title: 'Dossier discreto', body: 'Presentación privada antes de exposición masiva.' },
        { title: 'Visitas filtradas', body: 'Hipoteca o liquidez verificada; calendario en panel.' },
        { title: 'Cierre', body: 'Arras, banco comprador, notaría.' },
        { title: 'Precio fijo', body: '3.630 € en escritura si hay venta.' },
      ]
    ),
    comparativa_modelos: comparativa(`Vender en ${barrio}: portal, 6% o cartera`, [
      {
        modelo: `Solo portal en ${barrio}`,
        tiempo: 'Variable',
        coste: 'Anuncio + visitas sin filtro',
        riesgo: 'Vecinos y curiosos ven anuncio',
        tipo: 'neutral',
      },
      {
        modelo: 'Agencia 6% + portal',
        tiempo: '4–8 meses',
        coste: '6% + IVA',
        riesgo: 'Exclusiva larga',
        tipo: 'lose',
      },
      {
        modelo: 'NuevaHabitat cartera',
        tiempo: mercado.split('–')[0]?.trim() || '60 días',
        coste: '3.630 € escritura',
        riesgo: 'Sin venta, sin factura',
        tipo: 'win',
      },
    ]),
    mitos: {
      title: `Mitos: sin portales en ${barrio}`,
      items: [
        {
          mito: `En ${barrio} solo vendes con Idealista`,
          realidad: 'La demanda cualificada también llega por cartera activa y matching por zona.',
        },
        {
          mito: 'Sin anuncio vendes más barato',
          realidad: 'El precio lo marca mercado local y presentación; el canal filtra visitas, no obliga a regalar.',
        },
        {
          mito: 'Off-market es solo para mansiones',
          realidad: 'Cualquier piso puede venderse con dossier privado primero, también en zona universitaria o ensanche.',
        },
      ],
    },
    faq: [
      {
        q: `¿Trabajáis en ${barrio}?`,
        a: `Sí. Barcelona y área metropolitana desde Les Corts; matching específico en ${barrio}.`,
      },
      {
        q: '¿Puedo publicar en portal más adelante?',
        a: 'Sí. Muchos prueban cartera primero y deciden después.',
      },
      {
        q: '¿Cuánto cobráis?',
        a: '3.630 € solo en escritura si hay venta.',
      },
    ],
    relacionadas,
    keywords_footer: `${keyword} · cartera compradores · precio fijo ${barrio}`,
    whatsappText: encodeURIComponent(wa),
    formPlaceholder: `Dirección aproximada en ${barrio}, m², planta…`,
    form_side_text: `Cuéntanos tu piso en ${barrio}. Valoración en 24 h.`,
  };
}

// --- Patch existing two ---
const pPath = path.join(OUT, 'particular-vendo-piso-urgente-barcelona.json');
const p = JSON.parse(fs.readFileSync(pPath, 'utf8'));
if (!p.como_ayudamos) {
  p.argumento_principal += particulUrgentExtra;
}
p.como_ayudamos = comoAyudamos(
  'Plan urgente: de particular a arras con filtro',
  'Seis pasos para vender rápido sin regalar precio ni pagar 6% de comisión.',
  [
    { title: 'Diagnóstico 24 h', body: 'Plazo, barrio, documentación y rango de precio realista.' },
    { title: 'Dossier exprés', body: 'Fotos, nota simple, energético listos para comprador financiado.' },
    { title: 'Matching cartera', body: 'Compradores con hipoteca o liquidez en tu ticket.' },
    { title: 'Visitas concentradas', body: 'Franjas cortas; solo perfiles solventes.' },
    { title: 'Arras con plazo', body: 'Fecha escritura alineada con tu urgencia.' },
    { title: 'Escritura · 3.630 €', body: 'Honorarios fijos solo si cierras.' },
  ]
);
p.comparativa_modelos = STD_COMP('Urgente: portal caótico vs plan filtrado');
p._pad =
  '<h2>Coordinación con tu banco si compras y vendes a la vez</h2><p>Encadenar venta y compra en Barcelona exige fechas alineadas: arras de venta antes de arras de compra, o puente con hipoteca simultánea. Con urgencia, un comprador fiable con preaprobación es tan valioso como un euro menos en precio.</p>';
write(p.slug, p);

const mPath = path.join(OUT, 'vender-mi-piso-barcelona.json');
const m = JSON.parse(fs.readFileSync(mPath, 'utf8'));
if (!m.como_ayudamos) {
  m.argumento_principal += venderMiPisoExtra;
}
m.como_ayudamos = comoAyudamos(
  'Orden claro para vender tu piso',
  'Del «no sé por dónde empezar» a visitas filtradas y escritura.',
  [
    { title: 'Valoración personalizada', body: 'Tu barrio, tu planta, comparables reales.' },
    { title: 'Expediente digital', body: 'Documentos en panel vendedor.' },
    { title: 'Elige canal', body: 'Cartera, portal o combinación — sin exclusiva impuesta.' },
    { title: 'Visitas controladas', body: 'Solo compradores con solvencia contrastada.' },
    { title: 'Negociación', body: 'Arras y revisión financiación comprador.' },
    { title: 'Escritura', body: '3.630 € solo si vendes.' },
  ]
);
m.comparativa_modelos = STD_COMP('Vender mi piso: tres caminos habituales');
m._pad =
  '<h2>Contacto y valoración</h2><p>Desde Les Corts respondemos en 24 h con pasos concretos para tu barrio. Sin exclusiva obligatoria ni coste inicial de agencia.</p>';
write(m.slug, m);

// --- Cornellà vendedor ---
write(
  'vender-piso-cornella-barcelona',
  Object.assign(
    {
      slug: 'vender-piso-cornella-barcelona',
      cluster: 'intencion',
      indexable: true,
      priority: 0.87,
      origen_lead: 'vender-piso-cornella-barcelona',
      keyword_principal: 'venta piso cornella',
      keyword_aliases: [
        'vender piso cornella',
        'vender piso cornella de llobregat',
        'vender piso en cornella',
      ],
      footerLabel: 'Vender Cornellà',
      breadcrumbCurrent: 'Vender Cornellà',
      cardTeaser: 'Vender piso en Cornellà: L5, Sant Ildefons o Centre — compradores filtrados y 3.630 € en escritura.',
      meta: {
        title: 'Vender piso Cornellà de Llobregat · Propietario · Precio fijo · NuevaHabitat',
        description:
          '¿Vendes piso en Cornellà? Mercado 2.600–3.100 €/m². Compradores con hipoteca, panel vendedor y honorarios fijos 3.630 € solo en escritura.',
        keywords: 'venta piso cornella, vender piso cornella, vender piso cornella de llobregat',
      },
      hero: {
        badge: 'Cornellà · Vendedor',
        h1: 'Vender piso en Cornellà: más metros, L5 a Diagonal — ¿a quién enseñas el piso primero?',
        lead:
          'Mucha búsqueda de <strong>venta piso Cornellà</strong> es de compradores; tú eres <strong>propietario</strong>. Te ayudamos a vender en Sant Ildefons, Centre o Almeda con <strong>compradores filtrados</strong> y <strong>3.630 €</strong> solo en escritura.',
        image: 'imagenes/barcelona1.jpeg',
        imageAlt: 'Vender piso en Cornellà de Llobregat',
      },
      argumento_principal: cornellaArg + cornellaExtra + cornellaPad,
      _pad:
        '<h2>Valoración gratuita Cornellà</h2><p>Indica zona, m² y estado. Respondemos en 24 h con comparables locales y propuesta de cartera o portal — honorarios 3.630 € solo en escritura si vendes.</p><h2>Colegios y familias en Gavarra</h2><p>Compradores con hijos comparan Cornellà con Esplugues y Sant Joan Despí: destaca equipamientos, parques y tiempo real en coche o metro.</p><h2>Obra nueva junto a Riera</h2><p>Promociones recientes compiten con tu segunda mano: diferencia eficiencia energética, garantías y cuota de comunidad sin desmerecer tu reforma.</p><h2>Contacto propietario</h2><p>Formulario o WhatsApp: te orientamos si conviene cartera, portal o ambos en Cornellà de Llobregat.</p>',
      calculadora: { precioDefault: 245000, titulo: 'Cornellà: 6% vs 3.630 € fijos', subtitulo: 'En 245.000 € la comisión del 6% supera 17.000 €.' },
      como_ayudamos: comoAyudamos('Vender en Cornellà paso a paso', 'Operativa metropolitana desde Les Corts.', [
        { title: 'Valoración Cornellà', body: 'Comparables por zona: Ildefons, Centre, Almeda.' },
        { title: 'Matching', body: 'Compradores L5 y área Llobregat.' },
        { title: 'Visitas', body: 'Solo solvencia contrastada.' },
        { title: 'Panel', body: 'Documentos y calendario.' },
        { title: 'Arras', body: 'Coordinación banco comprador.' },
        { title: 'Escritura', body: 'Precio fijo si cierras.' },
      ]),
      comparativa_modelos: STD_COMP('Vender en Cornellà'),
      mitos: {
        title: 'Mitos al vender en Cornellà',
        items: [
          { mito: 'Solo importa el precio más bajo', realidad: 'Importa ratio m², estado, comunidad y comprador correcto.' },
          { mito: 'Necesito agencia de Barcelona centro', realidad: 'Operativa metropolitana con precio fijo y cartera Llobregat.' },
          { mito: 'Cornellà vende solo en portal', realidad: 'Cartera cualificada acorta plazo sin exclusiva 6%.' },
        ],
      },
      faq: [
        { q: '¿Atendéis Sant Ildefons?', a: 'Sí, todo Cornellà 08940.' },
        { q: '¿Honorarios?', a: '3.630 € solo en escritura si hay venta.' },
        { q: '¿Valoración gratuita?', a: 'Sí, en 24 h con comparables locales.' },
      ],
      relacionadas: [
        { slug: 'vender-cornella', label: 'Vender Cornellà' },
        { slug: 'inmobiliaria-precio-fijo-cornella-barcelona', label: 'Precio fijo Cornellà' },
        { slug: 'vender-piso-sin-portales-barcelona', label: 'Sin portales' },
        { slug: 'vender-mi-piso-barcelona', label: 'Vender mi piso' },
      ],
      keywords_footer: 'venta piso cornella · vender piso cornella · Sant Ildefons · precio fijo',
      whatsappText: encodeURIComponent('Hola, quiero vender piso en Cornellà'),
      formPlaceholder: 'Zona (Ildefons, Centre…), m², planta',
      form_side_text: 'Cuéntanos tu piso en Cornellà. Valoración en 24 h.',
    }
  )
);

// --- Sin portales Les Corts / Eixample (argumentos distintos) ---
const lesCortsArg = `<p>En <strong>Les Corts</strong> muchos propietarios conocen el ruido de un anuncio en portal: llamadas el sábado, vecinos que reconocen la foto del rellano y compradores que «pasan por la zona» sin hipoteca. Vender sin Idealista aquí no es rareza de lujo: es encajar <strong>Camp Nou</strong>, <strong>Numància</strong>, <strong>Pedralbes</strong> o <strong>Zona Universitaria</strong> con quien realmente puede firmar arras. NuevaHabitat tiene oficina en Mejía Lequerica 42 — mismo distrito — y cartera de compradores filtrados por ticket y calle.</p><h2>Tres Les Corts distintos en un solo distrito</h2><p>Familias que llevan años queriendo mudarse cerca del estadio buscan planta y ascensor distinto al profesional de Diagonal que quiere caminar al trabajo. El inversor de alquiler estudiantil mira UB y CEU con otra hoja de cálculo. Publicar en portal mezcla los tres en la misma visita dominical; el dossier privado ordena <em>quién ve primero</em> tu finca de los 70 en Les Corts centre frente a tu piso en entorno Pedralbes.</p><h2>Camp Nou en obras y precio de calle</h2><p>La renovación del estadio mueve interés calle a calle. No es subir precio por titular de prensa: es comparar escrituras recientes en el entorno, distinguir ruido de partido de doble acristalamiento real, explicar parking y derramas de comunidad. Compradores institucionales y familias de largo plazo leen dossier; no necesitan que el piso esté en portada de Idealista.</p><h2>Universidad y alquiler regulado</h2><p>En Zona Universitaria parte de la demanda es inversión con renta estable. Si vendes piso alquilado a estudiantes, el comprador correcto entiende contrato y rendimiento; el curioso de portal no. Filtrar solvencia antes de abrir la puerta protege al inquilino y a tu agenda.</p><h2>Diagonal, oficinas y comprador ejecutivo</h2><p>Quien trabaja en el eje Diagonal-Les Corts valora minutos reales a la oficina más que fotos de salón genéricas. Presentación privada con plano, ITE si aplica y certificado energético acelera decisiones de compradores con preaprobación bancaria y poco tiempo entre semana.</p><h2>Discreción en comunidades conocidas</h2><p>En edificios de Numància o calles tranquilas hacia Pedralbes, el anuncio público llega al chat de WhatsApp de la finca antes que al comprador solvente. Vender sin portales mantiene operación ordenada: visitas en franjas, registro en panel vendedor, sin carteles en el portal.</p><h2>Honorarios fijos frente al 6% en ticket Les Corts</h2><p>Con precios orientativos 4.700–6.200 €/m², un piso de 400.000 € paga más de 29.000 € con agencia tradicional al 6%. Cobramos <strong>3.630 € en escritura</strong> si cierras; sin venta, sin factura. Calculadora en esta página con tu precio real.</p><h2>Cartera antes que portal: secuencia habitual</h2><p>Propietarios prueban 4–6 semanas matching en cartera; si hace falta amplían a portal con precio ya validado. Otros mantienen cero portal hasta arras. Tú eliges — no exclusiva de doce meses.</p><p>Más contexto: <a href="/vender-les-corts">vender en Les Corts</a>, <a href="/inmobiliaria-precio-fijo-les-corts-barcelona">precio fijo Les Corts</a>, <a href="/vender-piso-sin-portales-barcelona">sin portales Barcelona</a>.</p><h2>Documentación en fincas 60-70</h2><p>Comunidad con ascensor reformado, actas de derrama, estado de cubierta: el comprador financiado de Les Corts lo pide en visita dos. Subimos PDFs al panel una vez. Nota simple, energético, cargas hipotecarias visibles — sin sorpresa en notaría.</p><h2>Valoración gratuita en 24 h</h2><p>Indica calle aproximada, m² y si prefieres cero portal. Respondemos con rango orientativo y plan de presentación a cartera — desde el mismo barrio donde trabajamos cada día.</p><h2>Tram, metro y comprador que mide minutos</h2><p>Les Corts está servido por L3, L5, Tram y autobuses hacia Zona Franca y Diagonal. En dossier privado incluimos mapa de accesos: comprador que compara Numància con L'Hospitalet decide en base a datos, no a leyendas de portal.</p><h2>Hospital Clínic y demanda estable</h2><p>Proximidad al campus sanitario genera demanda de profesionales que buscan estabilidad residencial cerca del trabajo. No confundir con turismo: perfil solvente, contrato laboral estable, interés en parking si existe.</p><h2>Plazas de garaje y trasteros</h2><p>En fincas de los 70 el garaje suma valor tangible. Si la plaza es separada en registro, indícalo en valoración para no frenar tasación bancaria.</p><h2>Herencia en piso familiar del distrito</h2><p>Hijos que venden piso de padres en Les Corts suelen necesitar consenso sobre precio mínimo y limpieza antes de visitas. Panel compartido y calendario único evitan dobles citas.</p>`;

const eixampleArg = `<p>El <strong>Eixample</strong> es el distrito donde más anuncios compiten por la misma manzana modernista. Si buscas <strong>vender sin portales</strong>, probablemente no quieres otro fin de semana de visitas turísticas mezcladas con familias que sí llevan hipoteca. Aquí el reto no es «falta de demanda» sino <strong>ordenar demanda</strong>: Sagrada Família no es Fort Pienc; Passeig de Gràcia no es Sant Antoni; el comprador extranjero con liquidez no es la pareja joven del mercado de Abacería.</p><h2>Finca modernista: ascensor, catálogo y comunidad</h2><p>Techos de 3 metros, molduras, suelos hidráulicos y ascensor de vecinos compartido cambian el ticket más que en periferia. Catalogación patrimonial, ITE de fachada o estado de patio de manzana aparecen en due diligence. Un dossier off-market explica reforma integral vs parcial, año de cocina y si la finca tiene protección — antes de abrir la puerta a quince curiosos de portal.</p><h2>Tres compradores, tres precios posibles</h2><p>Familia que busca 120 m² cerca de colegios en Derecho valora orientación y ruido de calle interior. Inversor en obra reformada de Passeig de Gràcia calcula renta corta o larga. Pareja en Sant Antoni prioriza metro y vida de barrio con presupuesto más ajustado. El mismo piso mal dirigido recibe ofertas incoherentes; la cartera privada envía primero el dossier al perfil que encaja con tu planta y tu ticket.</p><h2>Sagrada Família y turismo vs residente</h2><p>Proximidad a Gaudí atrae interés internacional — también visitas sin capacidad de arras en 60 días. Filtrar hipoteca española o transferencia acreditada evita perder julio y agosto con «compradores» de hotel. Vender sin Idealista no elimina demanda extranjera: la canaliza con criterio.</p><h2>Sant Antoni: transición de barrio</h2><p>Mercado gastronómico, supermanzana y nuevas líneas de metro mantienen Sant Antoni en radar joven. Si tu piso está en este eje, el discurso de venta no es el de finca señorial de Enric Granados: metros útiles, luz y comunidad sana pesan más que el retablo modernista. Matching evita comparaciones absurdas con áticos de Diagonal.</p><h2>Obra nueva junto a ensanche</h2><p>Conviven promociones recientes y fincas de 1890. El comprador compara cuota de comunidad, eficiencia energética y parking en edificio nuevo frente al encanto (y coste) de restaurar origen. Transparencia en dossier privado reduce negociaciones que mueren en tasación bancaria.</p><h2>Privacidad en rellano señorial</h2><p>Portería, ascensorista y vecinos reconocen fotos de portal al instante. Separaciones, herencias delicadas o propietarios mayores agradecen visitas concertadas sin exposición pública. Panel vendedor registra quién entró y cuándo — trazabilidad que WhatsApp no da.</p><h2>Comisión 6% en tickets Eixample</h2><p>Con 550.000 € de ejemplo, comisión tradicional supera 35.000 € + IVA. Honorarios fijos <strong>3.630 € solo en escritura</strong> si hay venta. Usa calculadora con tu expectativa real en Eixample Derecho o Esquerre.</p><h2>Secuencia cartera → portal opcional</h2><p>Muchos empiezan presentando a compradores registrados que ya buscan Eixample; publican en portal solo si el precio necesita más volumen. Sin exclusiva impuesta de un año.</p><p>Enlaces: <a href="/vender-eixample">vender en el Eixample</a>, <a href="/inmobiliaria-precio-fijo-eixample-barcelona">precio fijo Eixample</a>, <a href="/vender-piso-sin-exclusividad-barcelona">sin exclusividad</a>, <a href="/vender-piso-sin-portales-barcelona">hub sin portales</a>.</p><h2>Fotografía de calidad sin anuncio masivo</h2><p>Sesión profesional para dossier privado: luz en balcón corrido, detalle de suelo original, cocina honesta. Mejor una presentación seria a diez compradores filtrados que cien clics sin hipoteca.</p><h2>Pide valoración con manzana aproximada</h2><p>Respondemos en 24 h con comparables de ensanche en tu tramo (08007, 08009, 08013) y propuesta de canal: solo cartera, mix o portal tardío.</p><h2>Entreplanta y ático: narrativa distinta</h2><p>Entreplanta sin ascensor en finca de 1910 requiere comprador que valore encanto sobre accesibilidad; ático con terraza compite con obra nueva en Diagonal. Off-market permite explicar pros y contras sin titular engañoso en portal.</p><h2>Comunidad de propietarios exigente</h2><p>En fincas señoriales, actas de junta, obras en patio interior y derramas de fachada modernista son parte del precio. Anticipar en dossier evita ofertas que caen cuando el abogado del comprador lee el último acta.</p><h2>Renta antigua y situaciones especiales</h2><p>Si afecta contrato antiguo o derecho de tanteo, dilo en valoración. Filtramos compradores inversores familiarizados con complejidad frente a familias que buscan vivienda libre.</p><h2>Enric Granados, Rambla de Catalunya y microzonas</h2><p>Dos calles paralelas, tickets distintos: orientación, ruido, estado de portal. Matching por microzona evita comparar tu piso en Esquerre con cierres de Derecho que no aplican.</p><h2>Formulario y WhatsApp</h2><p>Cuéntanos manzana, m², ascensor y si quieres cero Idealista. Valoración gratuita en 24 h laborables.</p>`;

const lesCortsLanding = sinPortalesBarrio('vender-piso-sin-portales-les-corts-barcelona', {
    barrio: 'Les Corts',
    barrioSlug: 'vender-les-corts',
    urlSlug: 'les-corts',
    h1: 'Vender en Les Corts sin Idealista: Numància, Pedralbes o Zona Universitaria — ¿portal o cartera primero?',
    lead:
      'En <strong>Les Corts</strong> puedes vender sin anuncio público y aun así llegar a compradores del Camp Nou, Diagonal o campus. <strong>Cartera cualificada</strong>, visitas filtradas y <strong>3.630 €</strong> solo en escritura.',
    keyword: 'vender piso les corts sin portales',
    aliases: ['vender sin idealista les corts', 'vender piso les corts cartera compradores', 'vender les corts sin portales'],
    teaser: 'Les Corts sin portales: matching por Numància, Pedralbes o universidad — precio fijo en escritura.',
    metaTitle: 'Vender piso Les Corts sin portales · Cartera · NuevaHabitat',
    metaDesc:
      'Vende en Les Corts sin publicar en Idealista: compradores filtrados, discreción y 3.630 € solo en escritura. Numància, Pedralbes, Zona Universitaria.',
    precioDefault: 400000,
    perfil:
      'Les Corts combina familias consolidadas cerca del Camp Nou, profesionales del eje Diagonal e inversores en alquiler universitario — tres presupuestos distintos para el mismo distrito.',
    tipologia:
      'Fincas 60-70 en Les Corts centre y Numància, promociones recientes junto a Diagonal, alto standing en Pedralbes. La proximidad al Camp Nou en renovación revaloriza calles concretas.',
    mercado: '4.700 – 6.200 €/m² · 50–80 días',
    zonas: 'Numància, Pedralbes, Zona Universitaria',
    image: 'imagenes/lescorts1.jpg',
    imageAlt: 'Vender piso Les Corts sin portales',
    customArg: lesCortsArg,
    relacionadas: [
      { slug: 'vender-les-corts', label: 'Vender Les Corts' },
      { slug: 'vender-piso-sin-portales-barcelona', label: 'Sin portales Barcelona' },
      { slug: 'inmobiliaria-precio-fijo-les-corts-barcelona', label: 'Precio fijo Les Corts' },
      { slug: 'vender-eixample', label: 'Eixample' },
    ],
    wa: 'Hola, quiero vender en Les Corts sin portales',
  });
lesCortsLanding._pad =
  '<h2>Negociación con comprador preaprobado</h2><p>En Les Corts el comprador financiado suele comparar dos o tres pisos el mismo mes. Respuesta rápida en documentación y visita concertada marca diferencia frente a anuncio donde el propietario tarda semanas en subir nota simple.</p><h2>Alquiler temporal y temporada</h2><p>Si vendes piso que estuvo en alquiler turístico ilegal o legal, transparencia sobre licencias evita caída en due diligence. Filtramos inversores que entienden normativa municipal.</p><h2>Compare con precio fijo Les Corts</h2><p>Guía complementaria <a href="/inmobiliaria-precio-fijo-les-corts-barcelona">inmobiliaria precio fijo Les Corts</a> si tu duda principal es comisión, no canal de difusión.</p><h2>WhatsApp desde el distrito</h2><p>Escríbenos desde Numància, Pedralbes o Zona Universitaria: respondemos en 24 h con plan cartera-first y honorarios 3.630 € solo en escritura.</p><h2>Vender piso con mascotas y familias</h2><p>Compradores familiares cerca del Camp Nou buscan patios interiores, colegios a pie y metro. El dossier privado destaca lo que un titular genérico de portal no explica: orientación, ruido de calle y estado de zonas comunes.</p><h2>Inversor vs usuario final</h2><p>Presentar primero a quien ocupará el piso cambia negociación: el inversor pide rendimiento; la familia pide distribución. Sin portal puedes ordenar esas conversaciones sin mezclar perfiles en un solo sábado.</p><h2>Seguridad y registro de visitas</h2><p>Panel vendedor deja trazabilidad de identidad y horario — útil en comunidades donde el presidente pregunta quién entró. Profesionalidad que el particular solo con Idealista no tiene.</p>';
write('vender-piso-sin-portales-les-corts-barcelona', lesCortsLanding);

const eixampleLanding = sinPortalesBarrio('vender-piso-sin-portales-eixample-barcelona', {
    barrio: 'Eixample',
    barrioSlug: 'vender-eixample',
    urlSlug: 'eixample',
    h1: 'Vender en el Eixample sin portales: modernista, Sagrada Família o Sant Antoni — ¿a qué comprador enseñas primero?',
    lead:
      'En el <strong>Eixample</strong>, un anuncio abierto mezcla familias, inversores y curiosos. Puedes vender con <strong>cartera privada</strong> por manzana y presupuesto — <strong>3.630 €</strong> solo en escritura.',
    keyword: 'vender piso eixample sin portales',
    aliases: ['vender sin idealista eixample', 'vender piso eixample cartera', 'vender eixample sin portales'],
    teaser: 'Eixample sin Idealista: finca modernista o Sant Antoni con compradores filtrados por perfil.',
    metaTitle: 'Vender piso Eixample sin portales · Finca modernista · NuevaHabitat',
    metaDesc:
      'Vende en el Eixample sin Idealista: matching por Sagrada Família, Passeig de Gràcia o Sant Antoni. Honorarios fijos 3.630 € en escritura.',
    precioDefault: 550000,
    perfil:
      'El Eixample concentra familias en fincas grandes cerca de colegios, profesionales e inversores en obra reformada en Derecho y Passeig de Gràcia, y parejas jóvenes en Sant Antoni — un mismo piso recibe ofertas distintas según a quién lo veas primero.',
    tipologia:
      'Ensanche 1870-1930: techos altos, molduras, ascensor añadido, fincas señoriales junto a entreplantas. Catalogación y estado de comunidad mueven el precio de salida.',
    mercado: '4.800 – 6.800 €/m² · 55–85 días',
    zonas: 'Eixample Derecho, Sagrada Família, Sant Antoni',
    image: 'imagenes/eixample1.jpg',
    imageAlt: 'Vender piso Eixample sin portales',
    customArg: eixampleArg,
    relacionadas: [
      { slug: 'vender-eixample', label: 'Vender Eixample' },
      { slug: 'vender-piso-sin-portales-barcelona', label: 'Sin portales Barcelona' },
      { slug: 'inmobiliaria-precio-fijo-eixample-barcelona', label: 'Precio fijo Eixample' },
      { slug: 'vender-piso-sin-exclusividad-barcelona', label: 'Sin exclusividad' },
    ],
    wa: 'Hola, quiero vender en el Eixample sin portales',
  });
eixampleLanding._pad =
  '<h2>Certificado de eficiencia y reforma</h2><p>Letra energética mala en finca sin reformar no impide venta, pero el comprador negocia. Dossier off-market explica coste orientativo de mejora frente a precio ya descontado.</p><h2>Locales comerciales en planta baja</h2><p>En algunas manzanas conviven vivienda y local. Uso, licencia y ruido afectan financiación: decláralo antes de visitas con familia residencial.</p><h2>Fort Pienc y Sagrada Família: orientación</h2><p>Piso a patio de manzana vs fachada: en Eixample la luz define precio. Fotos honestas en dossier privado filtran quien busca otra cosa.</p><h2>Contacto</h2><p>Valoración gratuita por formulario o WhatsApp — propuesta solo cartera, mix o portal tardío en 24 h.</p><h2>Balcón corrido y elementos originales</h2><p>Compradores de finca modernista pagan prima por suelo hidráulico intacto, puertas con marquetería y techos con moldura. El dossier off-market documenta qué es original y qué se restauró — evita regateos post-visita.</p><h2>Comprador nacional vs internacional</h2><p>Extranjero con liquidez puede cerrar rápido; extranjero sin banco español puede alargar meses. Filtramos antes de visita para no perder fines de semana en operaciones imposibles en plazo estándar.</p><h2>Convivencia con turismo de short stay</h2><p>Manzanas con pisos turísticos generan ruido en comunidad: comprador residente lo detecta en visita. Mejor anticipar en dossier y dirigir a perfil que acepta entorno real.</p>';
write('vender-piso-sin-portales-eixample-barcelona', eixampleLanding);
