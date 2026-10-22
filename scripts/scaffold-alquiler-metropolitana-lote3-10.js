/**
 * Lote 3: 5 admin + 5 integral — Baró de Viver (Campins), Camp d'en Grassot,
 * Sant Boi, Sant Joan Despí, Esplugues, Cornellà, L'Hospitalet (JSON alquiler).
 * node scripts/scaffold-alquiler-metropolitana-lote3-10.js && node scripts/build-landings.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'content', 'landings', 'alquiler');
const TEMPLATE = path.join(OUT, 'administracion-alquiler-porta-barcelona.json');

function wc(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function patchAdmin(base, b) {
  const j = clone(base);
  j.slug = b.slug;
  j.servicio = 'administracion';
  j.barrioNombre = b.barrioNombre;
  if (b.municipio) j.municipio = true;
  j.keyword_principal = b.keyword;
  j.keyword_aliases = b.aliases || [
    `${b.keyword} gestion`,
    `${b.barrioNombre.toLowerCase()} alquiler propietarios`,
    `gestionar alquiler ${b.cp}`,
    `administrar renta ${b.barrioShort}`,
  ];
  j.footerLabel = `Admin ${b.barrioShort}`;
  j.breadcrumbCurrent = b.barrioShort;
  j.origen_lead = b.slug;
  j.postalCodes = b.postalCodes || [b.cp];
  j.zonas = b.zonas || [b.barrioNombre];
  j.meta = {
    title: `${b.h1} | NuevaHabitat`.slice(0, 120),
    description: b.metaDescription || `Administracion de alquiler en ${b.barrioNombre} (${b.cp}). INCASOL, LAU, zona tensionada y gestor Les Corts. Renta orientativa ${b.renta}.`,
    keywords: b.keyword,
  };
  j.hero = {
    badge: `${b.barrioShort} · ${b.cp} · Admin`,
    h1: b.h1,
    lead: b.lead || `Propietario en <strong>${b.barrioNombre}</strong> (${b.cp})? Cobramos rentas e incidencias con <strong>LAU</strong> e <strong>INCASOL</strong>. Renta orientativa <strong>${b.renta}</strong>. <strong>NuevaHabitat</strong> — Les Corts.`,
    image: b.image,
    imageAlt: `Administracion alquiler ${b.barrioNombre}`,
  };
  j.calculadora = {
    precioDefault: b.precioDefault,
    titulo: 'Gestion mensual del arrendamiento',
    subtitulo: `Renta orientativa en ${b.barrioShort}: ${b.renta}. Ajustamos segun estado, amueblado y calle.`,
  };
  const pad = `<h2>Operativa mensual en ${b.barrioShort}</h2><p>Liquidacion en ${b.cp}: conciliacion bancaria, archivo de transferencias del inquilino e informe al propietario con saldo y pendientes. Renovaciones con preaviso LAU, revision de indice en zona tensionada y mediacion en averias de fontaneria, electricidad certificada y ascensor comunitario. El inquilino no tiene tu telefono personal: canal unico con gestor en Les Corts (Carrer Mejia Lequerica 42).</p><h2>Impagos y seguro</h2><p>Valoramos seguro de impago cuando el perfil lo requiere. En ${b.barrioNombre} la rotacion genera costes de pintura entre contratos — actuamos con recordatorios formales antes de escalada. No sustituimos abogado en contencioso, pero documentamos comunicaciones y plazos contractuales.</p><h2>Comunidad y obras</h2><p>Derramas, obras de fachada o ascensor fuera de servicio: informamos al inquilino y al propietario con criterio LAU. Coordinacion con administrador de finca sin saturarte de llamadas.</p>`;
  j.argumento_principal = `<p><strong>Administracion de alquiler</strong> en <strong>${b.barrioNombre}</strong> (${b.cp}): propietarios sin tiempo, sin experiencia LAU o desde el extranjero. Renta orientativa <strong>${b.renta}</strong>. <strong>Administracion</strong> mensual una vez alquilado. Equipo <strong>NuevaHabitat</strong> en Les Corts.</p><p>Guia: <a href="/administracion-alquiler-barcelona">Administracion de alquiler Barcelona</a>. Si el piso estaba en venta: <a href="/vender-piso-alquilado-barcelona">vender piso alquilado</a>.</p><h2>Fianza INCASOL y zona tensionada</h2><p>${b.tensionado || 'En Barcelona ciudad la fianza legal se deposita en el <strong>INCASOL</strong> en un plazo maximo de dos meses. Todo el municipio esta en mercado tensionado: contratos nuevos deben respetar topes, informar renta anterior y justificar mejoras.'} En el area metropolitana aplicamos la misma rigurosidad LAU e INCASOL que en Barcelona, adaptada al ticket local.</p>${b.proseLocal}${pad}<h2>Perfil inquilino en ${b.barrioNombre}</h2><p>${b.perfil}</p><h2>Errores que vemos en ${b.cp}</h2><ol>${b.errores.map((e) => `<li>${e}</li>`).join('')}</ol><h2>Documentacion propietario</h2><ul><li>Escritura o nota simple, IBI, certificado energetico.</li><li>Comunidad al dia; derramas comunicadas.</li><li>Seguro hogar arrendador.</li><li>Inventario y fotos al alta del servicio.</li><li>Renta anterior documentada cuando aplica tensionado.</li></ul><h2>Panel y comunicacion</h2><p>Incidencias, rentas y documentos centralizados. WhatsApp con gestor en horario comercial.</p><h2>Interlinking</h2><p>${b.interlink}</p><h2>Proximo paso ${b.slug}</h2><p>Formulario: micro-zona, m2, renta deseada, situacion (libre, alquilado, herencia). Consulta sin compromiso en 24 h laborables desde Carrer Mejia Lequerica 42.</p>`;
  j.como_ayudamos.title = `Administracion en ${b.barrioShort}`;
  j.comparativa_modelos.title = `${b.barrioShort}: quien administra tu alquiler`;
  j.mitos.title = `Mitos administracion ${b.barrioShort}`;
  j.checklist.title = `Checklist propietario ${b.barrioShort}`;
  j.faq[0] = { q: `Trabajais en ${b.barrioNombre}?`, a: `Si. Esta landing cubre ${b.barrioNombre}. Renta orientativa ${b.renta} segun calle, estado y LAU.` };
  j.keywords_footer = `${b.keyword} · ${b.cp} · INCASOL · LAU · NuevaHabitat Les Corts`;
  j.whatsappText = encodeURIComponent(`Hola, consulto administracion de alquiler en ${b.barrioNombre}`);
  j.formPlaceholder = `${b.barrioShort} — m2 y renta deseada`;
  j.form_side_text = `${b.barrioShort}: cuota de administracion por escrito tras revisar contrato y estado.`;
  if (b.priority) j.priority = b.priority;
  return j;
}

function patchIntegral(baseIntegral, b) {
  const j = clone(baseIntegral);
  j.slug = b.slug;
  j.servicio = 'integral';
  j.barrioNombre = b.barrioNombre;
  if (b.municipio) j.municipio = true;
  j.keyword_principal = b.keyword;
  j.keyword_aliases = b.aliases || [
    `${b.keyword} gestion`,
    `${b.barrioNombre.toLowerCase()} alquiler propietarios`,
    `alquilar piso ${b.barrioShort}`,
    `alquiler integral ${b.cp}`,
  ];
  j.footerLabel = `Integral ${b.barrioShort}`;
  j.breadcrumbCurrent = b.barrioShort;
  j.origen_lead = b.slug;
  j.postalCodes = b.postalCodes || [b.cp];
  j.zonas = b.zonas || [b.barrioNombre];
  j.meta = {
    title: `${b.h1} | NuevaHabitat`.slice(0, 120),
    description: b.metaDescription || `Alquiler integral en ${b.barrioNombre} (${b.cp}). Anuncio, visitas filtradas, LAU e INCASOL. Renta orientativa ${b.renta}.`,
    keywords: b.keyword,
  };
  j.hero = {
    badge: `${b.barrioShort} · ${b.cp} · Integral`,
    h1: b.h1,
    lead: b.lead || `Propietario en <strong>${b.barrioNombre}</strong> (${b.cp})? Del anuncio al contrato con <strong>LAU</strong> e <strong>INCASOL</strong>. Renta orientativa <strong>${b.renta}</strong>. <strong>NuevaHabitat</strong> — Les Corts.`,
    image: b.image,
    imageAlt: `Alquiler integral ${b.barrioNombre}`,
  };
  j.calculadora = {
    precioDefault: b.precioDefault,
    titulo: 'Puesta en alquiler integral',
    subtitulo: `Renta orientativa en ${b.barrioShort}: ${b.renta}. Comparables del barrio, no medias genericas.`,
  };
  const pad = `<h2>Captacion en ${b.barrioShort}</h2><p>Publicacion con fotos honestas, criba de mensajes y visitas en franjas acordadas — menos curiosos, mas perfiles con nomina o aval. Propuesta de renta con comparables de ${b.cp}, no medias genericas de Barcelona. Informe top 3 candidatos, borrador LAU revisado, fianza INCASOL e inventario firmado en entrega de llaves.</p><h2>599 € IVA incluido · pago único vs comision clasica</h2><p>En rentas orientativas de ${b.renta}, un mes de comision mas IVA suele superar con creces un pack integral cerrado. Tras firmar, puedes pasar a <a href="/administracion-alquiler-barcelona">administracion mensual</a> con el mismo panel.</p><h2>Plazos orientativos</h2><p>Con pricing correcto y filtro de solvencia, muchos casos cierran en 3–8 semanas. Si el piso necesita pintura ligera o pequena reparacion, lo indicamos antes de publicar para no alargar vacancia.</p><h2>Despues del contrato</h2><p>Seguimiento opcional de incidencias, renovaciones e informes al propietario. Mismo equipo NuevaHabitat que conoce historial del piso si mas adelante decides vender.</p>`;
  j.argumento_principal = `<p><strong>Alquiler integral</strong> en <strong>${b.barrioNombre}</strong> (${b.cp}): propietarios que alquilan sin tiempo o sin experiencia LAU. Renta orientativa <strong>${b.renta}</strong>. Servicio <strong>integral</strong>: del anuncio al contrato. Equipo <strong>NuevaHabitat</strong> en Les Corts.</p><p>Guia: <a href="/alquiler-integral-barcelona">Alquiler integral Barcelona</a>. Si el piso estaba en venta: <a href="/vender-piso-alquilado-barcelona">vender piso alquilado</a>.</p><h2>Fianza INCASOL y contrato LAU</h2><p>${b.tensionado || 'Fianza en <strong>INCASOL</strong> y contrato conforme a mercado tensionado cuando el municipio esta bajo normativa catalana de alquiler. Revisamos renta anterior y clausulas obligatorias antes de firmar.'}</p>${b.proseLocal}${pad}<h2>Perfil inquilino en ${b.barrioNombre}</h2><p>${b.perfil}</p><h2>Errores que vemos en ${b.cp}</h2><ol>${b.errores.map((e) => `<li>${e}</li>`).join('')}</ol><h2>Que incluye el pack integral</h2><ul><li>Propuesta de renta con comparables del barrio.</li><li>Anuncio, criba y visitas en tus franjas.</li><li>Informe top 3 perfiles, contrato LAU e inventario.</li><li>Opcion de administracion mensual tras firmar.</li></ul><h2>Interlinking</h2><p>${b.interlink}</p><h2>Proximo paso ${b.slug}</h2><p>Formulario: m2, renta deseada y situacion del piso. Respuesta en 24 h laborables.</p>`;
  j.como_ayudamos.title = `Alquiler integral en ${b.barrioShort}`;
  j.comparativa_modelos.title = `${b.barrioShort}: formas de alquilar`;
  j.mitos.title = `Mitos alquiler integral ${b.barrioShort}`;
  j.checklist.title = `Checklist propietario ${b.barrioShort}`;
  j.faq[0] = { q: `Trabajais en ${b.barrioNombre}?`, a: `Si. Cubrimos ${b.barrioNombre}. Renta orientativa ${b.renta}.` };
  j.faq[6] = { q: 'Plazo hasta primer ingreso?', a: 'Orientativamente 3–8 semanas con pricing correcto y filtro de solvencia.' };
  j.relacionadas[0] = { slug: 'administracion-alquiler-barcelona', label: 'Administracion de alquiler Barcelona' };
  j.keywords_footer = `${b.keyword} · ${b.cp} · INCASOL · LAU · NuevaHabitat Les Corts`;
  j.whatsappText = encodeURIComponent(`Hola, consulto alquiler integral en ${b.barrioNombre}`);
  j.formPlaceholder = `${b.barrioShort} — m2 y renta deseada`;
  j.form_side_text = `${b.barrioShort}: plan integral por escrito tras revisar estado del piso.`;
  if (b.priority) j.priority = b.priority;
  return j;
}

const ADMIN = [
  {
    slug: 'administracion-alquiler-baro-de-viver-barcelona',
    barrioNombre: 'Baró de Viver',
    barrioShort: 'Baró de Viver',
    cp: '08020',
    renta: '720–900 €/mes',
    precioDefault: 810,
    image: 'imagenes/noubarris2.jpg',
    keyword: 'administracion alquiler baro de viver barcelona',
    h1: 'Administracion de alquiler en Baró de Viver: gestion en la illa Campins (Sant Andreu nord)',
    proseLocal: '<h2>Baró de Viver y Campins</h2><p><strong>Baró de Viver</strong> concentra la illa de vivienda de los 80 (Campins, Tiana) — ticket contenido y propietarios que delegan cobro e incidencias. Transparencia sobre ascensor comunitario y proximidad a vias.</p><h2>Limite Santa Coloma</h2><p>Inquilino familiar valora metro L1 proximo; contrato LAU claro reduce rotacion en fincas pequenas.</p>',
    perfil: 'Familias locales, herencias entre hermanos, inversores en ticket bajo en Barcelona ciudad.',
    errores: ['Confundir Baró de Viver con Bon Pastor en renta.', 'Impago sin actuar en 15 dias.', 'No domiciliar renta.', 'Renovacion sin indice tensionado.', 'WhatsApp directo propietario-inquilino.'],
    interlink: '<a href="/administracion-alquiler-bon-pastor-barcelona">Admin Bon Pastor</a> · <a href="/administracion-alquiler-trinitat-vella-barcelona">Trinitat Vella</a> · <a href="/administracion-alquileres-sant-andreu">Admin Sant Andreu (distrito)</a>.',
  },
  {
    slug: 'administracion-alquiler-sant-boi-de-llobregat',
    municipio: true,
    barrioNombre: 'Sant Boi de Llobregat',
    barrioShort: 'Sant Boi',
    cp: '08830',
    postalCodes: ['08830'],
    zonas: ['Centre', 'Marianao', 'Bloques', 'Plaça Catalunya'],
    renta: '780–980 €/mes',
    precioDefault: 880,
    image: 'imagenes/hospitalet2.webp',
    keyword: 'administracion alquiler sant boi de llobregat',
    priority: 0.845,
    h1: 'Administracion de alquiler en Sant Boi de Llobregat: cobro de rentas desde Les Corts',
    tensionado: 'Sant Boi esta en area metropolitana: fianza <strong>INCASOL</strong>, contrato LAU y revision de clausulas antes de firmar. Aplicamos criterio tensionado cuando corresponde segun normativa vigente en Catalunya.',
    proseLocal: '<h2>Sant Boi y Baix Llobregat</h2><p><strong>Sant Boi</strong> mezcla casco historico y bloques residenciales — demanda familiar estable si el piso esta bien mantenido. Administracion mensual evita que el propietario en Barcelona o extranjero gestione incidencias a distancia.</p><h2>FGC y bus a Barcelona</h2><p>Inquilino pendular pregunta por tiempos reales; documentacion en contrato reduce disputas.</p>',
    perfil: 'Familias del Baix Llobregat, parejas jovenes, propietarios herederos que alquilan piso familiar.',
    errores: ['Pricing Barcelona ciudad en Sant Boi.', 'Sin filtro solvencia al alta.', 'Fianza en mano del propietario.', 'No informar derrama en comunidad.', 'Impago tolerado demasiado.'],
    interlink: '<a href="/administracion-alquiler-l-hospitalet-de-llobregat">Admin L\'Hospitalet</a> · <a href="/administracion-alquiler-cornella-de-llobregat">Admin Cornellà</a> · <a href="/administracion-alquileres-l-hospitalet">Admin L\'Hospitalet (distrito)</a>.',
  },
  {
    slug: 'administracion-alquiler-sant-joan-despi',
    municipio: true,
    barrioNombre: 'Sant Joan Despí',
    barrioShort: 'Sant Joan Despí',
    cp: '08970',
    postalCodes: ['08970'],
    zonas: ['Centre', 'Fontsanta', 'Torreblanca', 'Can Jordi'],
    renta: '950–1.200 €/mes',
    precioDefault: 1070,
    image: 'imagenes/santjust1.webp',
    keyword: 'administracion alquiler sant joan despi',
    priority: 0.846,
    h1: 'Administracion de alquiler en Sant Joan Despí: gestion mensual en el Baix Llobregat',
    proseLocal: '<h2>Sant Joan Despí residencial</h2><p><strong>Sant Joan Despí</strong> atrae familias entre unifamiliar y piso en bloque — incidencias de comunidad y jardines requieren seguimiento. Gestor unico en Les Corts sin dar tu telefono al inquilino.</p><h2>Parc fluvial Llobregat</h2><p>Argumento de calidad de vida en ficha; contrato LAU de uso habitual, no turistico.</p>',
    perfil: 'Familias con hijos, teletrabajadores, propietarios que emigraron y mantienen piso en alquiler.',
    errores: ['Mezclar Sant Just y Sant Joan Despí en pricing.', 'Renovacion sin preaviso LAU.', 'No archivo de recibos.', 'Seguro hogar desactualizado.', 'Gestion informal sin panel.'],
    interlink: '<a href="/vender-sant-just-sant-joan-despi">Vender Sant Just / Sant Joan Despí</a> · <a href="/administracion-alquiler-esplugues-de-llobregat">Admin Esplugues</a>.',
  },
  {
    slug: 'administracion-alquiler-esplugues-de-llobregat',
    municipio: true,
    barrioNombre: 'Esplugues de Llobregat',
    barrioShort: 'Esplugues',
    cp: '08950',
    postalCodes: ['08950'],
    zonas: ['Can Vidalet', 'Centre', 'Finestrelles', 'Les Malloles'],
    renta: '1.000–1.250 €/mes',
    precioDefault: 1120,
    image: 'imagenes/esplugues1.jpg',
    keyword: 'administracion alquiler esplugues de llobregat',
    priority: 0.847,
    h1: 'Administracion de alquiler en Esplugues: cobro e incidencias junto a Les Corts',
    proseLocal: '<h2>Esplugues y Can Vidalet</h2><p><strong>Esplugues</strong> combina bloques 70–90 y zonas unifamiliares — ticket superior a L\'Hospitalet. Administracion documenta inventario en entrega por desgaste en familias largas.</p><h2>Colegios y desplazamiento</h2><p>Inquilino estable valora continuidad escolar; renovaciones con indice cuando aplica.</p>',
    perfil: 'Familias con hijos, profesionales que trabajan en Barcelona, expatriados en contrato anual.',
    errores: ['Pricing Sarria en Can Vidalet.', 'Confundir Esplugues y Cornella en anuncio.', 'Incidencias ascensor sin proveedor.', 'Fianza mal gestionada.', 'No renta anterior en renovacion.'],
    interlink: '<a href="/vender-esplugues">Vender Esplugues</a> · <a href="/vender-como-particular-esplugues-barcelona">Particular Esplugues</a> · <a href="/administracion-alquileres-esplugues">Admin Esplugues (distrito)</a>.',
  },
  {
    slug: 'administracion-alquiler-cornella-de-llobregat',
    municipio: true,
    barrioNombre: 'Cornellà de Llobregat',
    barrioShort: 'Cornellà',
    cp: '08940',
    postalCodes: ['08940'],
    zonas: ['Centre', 'Sant Ildefons', 'Almeda', 'Riera'],
    renta: '820–1.020 €/mes',
    precioDefault: 920,
    image: 'imagenes/barcelona1.jpeg',
    keyword: 'administracion alquiler cornella de llobregat',
    priority: 0.845,
    h1: 'Administracion de alquiler en Cornellà: gestion mensual con metro L5 a Barcelona',
    proseLocal: '<h2>Cornellà y Sant Ildefons</h2><p><strong>Cornellà</strong> concentra gran parque de bloques — cobro puntual y actas en incidencias comunitarias protegen margen del propietario inversor.</p><h2>L5 directa</h2><p>Inquilino joven y familiar segun tipologia; canal unico con gestor evita conflictos vecinales.</p>',
    perfil: 'Familias primerizas, parejas que trabajan en Barcelona por metro, inversores en yield moderado.',
    errores: ['Precio Esplugues en Sant Ildefons.', 'Subarriendo no autorizado.', 'WhatsApp propietario al inquilino.', 'Sin informe anual al propietario.', 'LAU mal redactada.'],
    interlink: '<a href="/vender-cornella">Vender Cornellà</a> · <a href="/administracion-alquileres-cornella">Admin Cornellà (distrito)</a> · <a href="/alquiler-integral-l-hospitalet-de-llobregat">Integral L\'Hospitalet</a>.',
  },
];

const INTEGRAL = [
  {
    slug: 'alquiler-integral-camp-den-grassot-barcelona',
    barrioNombre: 'Camp d\'en Grassot i Gràcia Nova',
    barrioShort: 'Camp d\'en Grassot',
    cp: '08025',
    renta: '1.050–1.320 €/mes',
    precioDefault: 1180,
    image: 'imagenes/eixample5.jpg',
    keyword: 'alquiler integral camp den grassot barcelona',
    h1: 'Alquiler integral en Camp d\'en Grassot: del anuncio al contrato en Gràcia nord',
    proseLocal: '<h2>Grassot i Gràcia Nova</h2><p><strong>Camp d\'en Grassot</strong> mezcla fincas Cerdà y eix comercial — visitas filtradas ahorran fines de semana. Anuncio honesto sobre planta y ruido en Travessera.</p><h2>La Sedeta y equipamientos</h2><p>Inquilino familiar y teletrabajo; pricing distinto a Vila de Gràcia en finca sin ascensor.</p><h2>Entorn Sagrada Familia</h2><p>Comprador compara con Eixample: minutos reales al metro documentados en ficha y contrato.</p>',
    perfil: 'Familias, parejas profesionales, teletrabajadores que buscan Gràcia sin ticket Vila.',
    errores: ['Precio Eixample en Grassot interior.', 'Fotos gran angular enganoso.', 'No filtro de nomina.', 'Contrato sin INCASOL.', 'Ignorar derrama en comunidad.'],
    interlink: '<a href="/vender-camp-den-grassot-barcelona">Vender Camp d\'en Grassot</a> · <a href="/alquiler-integral-gracia">Integral Gràcia (distrito)</a> · <a href="/administracion-alquiler-vallcarca-barcelona">Admin Vallcarca</a>.',
  },
  {
    slug: 'alquiler-integral-l-hospitalet-de-llobregat',
    municipio: true,
    barrioNombre: 'L\'Hospitalet de Llobregat',
    barrioShort: 'L\'Hospitalet',
    cp: '08901',
    postalCodes: ['08901', '08902', '08907'],
    zonas: ['Centre', 'Bellvitge', 'Pubilla Cases', 'Granvia L\'H'],
    renta: '850–1.050 €/mes',
    precioDefault: 950,
    image: 'imagenes/hospitalet1.jpg',
    keyword: 'alquiler integral l hospitalet de llobregat',
    priority: 0.848,
    h1: 'Alquiler integral en L\'Hospitalet: captacion y cierre LAU en el municipio con mas volumen',
    proseLocal: '<h2>L\'Hospitalet heterogeneo</h2><p><strong>L\'Hospitalet</strong> no es un solo mercado: Centre, Bellvitge y Pubilla Cases exigen comparables por zona. Pack integral con pricing local evita vacancia larga.</p><h2>Metro L1 y demanda</h2><p>Alto volumen de consultas — criba de solvencia antes de visita separa familia estable de curiosos.</p>',
    perfil: 'Familias desplazadas desde Barcelona ciudad, personal sanitario Bellvitge, inversores en yield.',
    errores: ['Media unica de Hospitalet en anuncio.', 'Pricing Barcelona en Pubilla Cases.', 'Visitas sin preaprobacion hipoteca.', 'Fianza en efectivo.', 'Inventario incompleto.'],
    interlink: '<a href="/vender-l-hospitalet">Vender L\'Hospitalet</a> · <a href="/vender-como-particular-l-hospitalet-barcelona">Particular L\'Hospitalet</a> · <a href="/administracion-alquiler-l-hospitalet-de-llobregat">Admin L\'Hospitalet</a>.',
  },
  {
    slug: 'alquiler-integral-sant-boi-de-llobregat',
    municipio: true,
    barrioNombre: 'Sant Boi de Llobregat',
    barrioShort: 'Sant Boi',
    cp: '08830',
    postalCodes: ['08830'],
    zonas: ['Centre', 'Marianao', 'Bloques'],
    renta: '780–980 €/mes',
    precioDefault: 880,
    image: 'imagenes/hospitalet3.jpg',
    keyword: 'alquiler integral sant boi de llobregat',
    priority: 0.844,
    h1: 'Alquiler integral en Sant Boi: del anuncio al contrato en el Baix Llobregat',
    proseLocal: '<h2>Sant Boi familiar</h2><p><strong>Sant Boi</strong> ticket contenido — filtro de aval y nomina acorta plazo hasta primer ingreso. Fotos reales en bloques Marianao.</p><h2>Competencia con Hospitalet</h2><p>Mismo comprador compara municipios el sabado: pricing honesto por calle.</p><h2>Documentacion entre contratos</h2><p>Pintura ligera y pequenas reparaciones antes de publicar: presupuesto claro al propietario evita alargar vacancia en mercados de rotacion moderada.</p>',
    perfil: 'Familias locales, parejas jovenes, propietarios primerizos en alquiler.',
    errores: ['Anuncio generico Baix Llobregat.', 'No mencionar ascensor.', 'Comision opaca.', 'LAU sin revision INCASOL.', 'Rotacion por mala criba.'],
    interlink: '<a href="/administracion-alquiler-sant-boi-de-llobregat">Admin Sant Boi</a> · <a href="/alquiler-integral-l-hospitalet-de-llobregat">Integral L\'Hospitalet</a>.',
  },
  {
    slug: 'alquiler-integral-sant-joan-despi',
    municipio: true,
    barrioNombre: 'Sant Joan Despí',
    barrioShort: 'Sant Joan Despí',
    cp: '08970',
    postalCodes: ['08970'],
    zonas: ['Centre', 'Fontsanta', 'Torreblanca'],
    renta: '950–1.200 €/mes',
    precioDefault: 1070,
    image: 'imagenes/santjust1.webp',
    keyword: 'alquiler integral sant joan despi',
    priority: 0.846,
    h1: 'Alquiler integral en Sant Joan Despí: inquilino estable en municipio residencial',
    proseLocal: '<h2>Sant Joan Despí mixto</h2><p><strong>Sant Joan Despí</strong> mezcla chalet y piso — inventario detallado en terraza y jardín reduce disputas en fianza. Visitas en franjas laborales.</p><h2>Proximidad Barcelona</h2><p>Inquilino profesional exige contrato claro y domiciliacion de renta.</p>',
    perfil: 'Familias con hijos, teletrabajo, inquilino larga duracion.',
    errores: ['Pricing unifamiliar extrapolado a piso.', 'No filtro ruido en planta baja.', 'Renovacion sin preaviso.', 'Mobiliario no listado.', 'Fianza mal gestionada.'],
    interlink: '<a href="/administracion-alquiler-sant-joan-despi">Admin Sant Joan Despí</a> · <a href="/administracion-alquiler-esplugues-de-llobregat">Admin Esplugues</a>.',
  },
  {
    slug: 'alquiler-integral-esplugues-de-llobregat',
    municipio: true,
    barrioNombre: 'Esplugues de Llobregat',
    barrioShort: 'Esplugues',
    cp: '08950',
    postalCodes: ['08950'],
    zonas: ['Can Vidalet', 'Centre', 'Finestrelles'],
    renta: '1.000–1.250 €/mes',
    precioDefault: 1120,
    image: 'imagenes/esplugues3.jpg',
    keyword: 'alquiler integral esplugues de llobregat',
    priority: 0.847,
    h1: 'Alquiler integral en Esplugues: puesta en alquiler junto a Les Corts',
    proseLocal: '<h2>Esplugues por zonas</h2><p><strong>Esplugues</strong> Can Vidalet ≠ Finestrelles: comparables separados desde el primer anuncio. Pack 599 € IVA incluido · pago único vs comision suele compensar en rentas de 1.000 €+.</p><h2>Demanda familiar</h2><p>Criba de solvencia y informe top 3 perfiles antes de que el propietario decida.</p>',
    perfil: 'Familias con colegios en zona, profesionales Les Corts/Sarria, expatriados.',
    errores: ['Confundir Esplugues y Cornella.', 'Precio Sarria en anuncio.', 'Curiosos sin filtro.', 'Contrato sin clausula uso habitual.', 'No registrar renta anterior.'],
    interlink: '<a href="/vender-esplugues">Vender Esplugues</a> · <a href="/administracion-alquiler-esplugues-de-llobregat">Admin Esplugues</a> · <a href="/alquiler-integral-les-corts">Integral Les Corts</a>.',
  },
];

const adminTpl = JSON.parse(fs.readFileSync(TEMPLATE, 'utf8'));
const integralTpl = JSON.parse(fs.readFileSync(path.join(OUT, 'alquiler-integral-el-carmel-barcelona.json'), 'utf8'));

let failed = false;
ADMIN.forEach((b) => {
  const j = patchAdmin(adminTpl, b);
  const words = wc(j.argumento_principal);
  if (words < 360) {
    console.error('FAIL', j.slug, words, 'words');
    failed = true;
  }
  fs.writeFileSync(path.join(OUT, j.slug + '.json'), JSON.stringify(j, null, 2));
  console.log('Wrote', j.slug, '—', words, 'words');
});

INTEGRAL.forEach((b) => {
  const j = patchIntegral(integralTpl, b);
  const words = wc(j.argumento_principal);
  if (words < 360) {
    console.error('FAIL', j.slug, words, 'words');
    failed = true;
  }
  fs.writeFileSync(path.join(OUT, j.slug + '.json'), JSON.stringify(j, null, 2));
  console.log('Wrote', j.slug, '—', words, 'words');
});

if (failed) process.exit(1);
