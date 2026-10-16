/**
 * Lote 2 micro-barrios Barcelona: 5 admin + 5 integral (-barcelona).
 * node scripts/scaffold-alquiler-barrios-lote2-10.js && node scripts/build-landings.js
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
  j.keyword_principal = b.keyword;
  j.keyword_aliases = [
    `${b.keyword} gestion`,
    `${b.barrioNombre.toLowerCase()} alquiler propietarios`,
    `gestionar alquiler ${b.cp}`,
    `administrar renta ${b.barrioShort}`,
  ];
  j.footerLabel = `Admin ${b.barrioShort}`;
  j.breadcrumbCurrent = b.barrioShort;
  j.origen_lead = b.slug;
  j.postalCodes = [b.cp];
  j.zonas = [b.barrioNombre];
  j.meta = {
    title: `${b.h1} | NuevaHabitat`.slice(0, 120),
    description: `Administracion de alquiler en ${b.barrioNombre} (${b.cp}). INCASOL, LAU, zona tensionada y gestor Les Corts. Renta orientativa ${b.renta}.`,
    keywords: b.keyword,
  };
  j.hero = {
    badge: `${b.barrioShort} · ${b.cp} · Admin`,
    h1: b.h1,
    lead: `Propietario en <strong>${b.barrioNombre}</strong> (${b.cp})? Cobramos rentas e incidencias con <strong>LAU</strong> e <strong>INCASOL</strong>. Renta orientativa <strong>${b.renta}</strong>. <strong>NuevaHabitat</strong> — Les Corts.`,
    image: b.image,
    imageAlt: `Administracion alquiler ${b.barrioNombre} Barcelona`,
  };
  j.calculadora = {
    precioDefault: b.precioDefault,
    titulo: 'Gestion mensual del arrendamiento',
    subtitulo: `Renta orientativa en ${b.barrioShort}: ${b.renta}. Ajustamos segun estado, amueblado y calle.`,
  };
  const pad = `<h2>Operativa mensual en ${b.barrioShort}</h2><p>Liquidacion en ${b.cp}: conciliacion bancaria, archivo de transferencias del inquilino e informe al propietario con saldo y pendientes. Renovaciones con preaviso LAU, revision de indice en zona tensionada y mediacion en averias de fontaneria, electricidad certificada y ascensor comunitario. El inquilino no tiene tu telefono personal: canal unico con gestor en Les Corts (Carrer Mejia Lequerica 42).</p><h2>Impagos y seguro</h2><p>Valoramos seguro de impago cuando el perfil lo requiere. En ${b.barrioNombre} la rotacion genera costes de pintura entre contratos — actuamos con recordatorios formales antes de escalada. No sustituimos abogado en contencioso, pero documentamos comunicaciones y plazos contractuales.</p><h2>Comunidad y obras</h2><p>Derramas, obras de fachada o ascensor fuera de servicio: informamos al inquilino y al propietario con criterio LAU. Coordinacion con administrador de finca sin saturarte de llamadas.</p>`;
  j.argumento_principal = `<p><strong>Administracion de alquiler</strong> en <strong>${b.barrioNombre}</strong> (${b.cp}): propietarios sin tiempo, sin experiencia LAU o desde el extranjero. Renta orientativa <strong>${b.renta}</strong>. <strong>Administracion</strong> mensual una vez alquilado. Equipo <strong>NuevaHabitat</strong> en Les Corts.</p><p>Guia: <a href="/administracion-alquiler-barcelona">Administracion de alquiler Barcelona</a>. Si el piso estaba en venta: <a href="/vender-piso-alquilado-barcelona">vender piso alquilado</a>.</p><h2>Fianza INCASOL y zona tensionada en Barcelona</h2><p>En Barcelona la fianza legal se deposita en el <strong>INCASOL</strong> en un plazo maximo de dos meses desde la firma. Todo el municipio esta en <strong>zona de mercado residencial tensionado</strong>: contratos nuevos deben respetar topes de renta, informar de la renta anterior y justificar mejoras si subes precio.</p>${b.proseLocal}${pad}<h2>Perfil inquilino en ${b.barrioNombre}</h2><p>${b.perfil}</p><h2>Errores que vemos en ${b.cp}</h2><ol>${b.errores.map((e) => `<li>${e}</li>`).join('')}</ol><h2>Documentacion propietario</h2><ul><li>Escritura o nota simple, IBI, certificado energetico.</li><li>Comunidad al dia; derramas comunicadas.</li><li>Seguro hogar arrendador.</li><li>Inventario y fotos al alta del servicio.</li><li>Renta anterior documentada (tensionado).</li></ul><h2>Panel y comunicacion</h2><p>Incidencias, rentas y documentos centralizados. WhatsApp con gestor en horario comercial.</p><h2>Interlinking Barcelona</h2><p>${b.interlink}</p><h2>Proximo paso ${b.slug}</h2><p>Formulario: micro-zona, m2, renta deseada, situacion (libre, alquilado, herencia). Consulta sin compromiso en 24 h laborables desde Carrer Mejia Lequerica 42.</p>`;
  j.como_ayudamos.title = `Administracion en ${b.barrioShort}`;
  j.comparativa_modelos.title = `${b.barrioShort}: quien administra tu alquiler`;
  j.mitos.title = `Mitos administracion ${b.barrioShort}`;
  j.checklist.title = `Checklist propietario ${b.barrioShort}`;
  j.faq[0] = { q: `Trabajais en ${b.barrioNombre}?`, a: `Si. Esta landing cubre ${b.barrioNombre} (Barcelona). Renta orientativa ${b.renta} segun calle, estado y LAU.` };
  j.keywords_footer = `${b.keyword} · ${b.cp} · INCASOL · LAU · NuevaHabitat Les Corts`;
  j.whatsappText = encodeURIComponent(`Hola, consulto administracion de alquiler en ${b.barrioNombre}`);
  j.formPlaceholder = `${b.barrioShort} — m2 y renta deseada`;
  j.form_side_text = `${b.barrioShort}: cuota de administracion por escrito tras revisar contrato y estado.`;
  return j;
}

function patchIntegral(baseIntegral, b) {
  const j = clone(baseIntegral);
  j.slug = b.slug;
  j.servicio = 'integral';
  j.barrioNombre = b.barrioNombre;
  j.keyword_principal = b.keyword;
  j.keyword_aliases = [
    `${b.keyword} gestion`,
    `${b.barrioNombre.toLowerCase()} alquiler propietarios`,
    `alquilar piso ${b.barrioShort}`,
    `alquiler integral ${b.cp}`,
  ];
  j.footerLabel = `Integral ${b.barrioShort}`;
  j.breadcrumbCurrent = b.barrioShort;
  j.origen_lead = b.slug;
  j.postalCodes = [b.cp];
  j.zonas = [b.barrioNombre];
  j.meta = {
    title: `${b.h1} | NuevaHabitat`.slice(0, 120),
    description: `Alquiler integral en ${b.barrioNombre} (${b.cp}). Anuncio, visitas filtradas, LAU e INCASOL. Renta orientativa ${b.renta}.`,
    keywords: b.keyword,
  };
  j.hero = {
    badge: `${b.barrioShort} · ${b.cp} · Integral`,
    h1: b.h1,
    lead: `Propietario en <strong>${b.barrioNombre}</strong> (${b.cp})? Del anuncio al contrato con <strong>LAU</strong> e <strong>INCASOL</strong>. Renta orientativa <strong>${b.renta}</strong>. <strong>NuevaHabitat</strong> — Les Corts.`,
    image: b.image,
    imageAlt: `Alquiler integral ${b.barrioNombre} Barcelona`,
  };
  j.calculadora = {
    precioDefault: b.precioDefault,
    titulo: 'Puesta en alquiler integral',
    subtitulo: `Renta orientativa en ${b.barrioShort}: ${b.renta}. Comparables del barrio, no medias genericas.`,
  };
  const pad = `<h2>Captacion en ${b.barrioShort}</h2><p>Publicacion con fotos honestas, criba de mensajes y visitas en franjas acordadas — menos curiosos, mas perfiles con nomina o aval. Propuesta de renta con comparables de ${b.cp}, no medias genericas de Barcelona. Informe top 3 candidatos, borrador LAU revisado, fianza INCASOL e inventario firmado en entrega de llaves.</p><h2>499 € fijo vs comision clasica</h2><p>En rentas orientativas de ${b.renta}, un mes de comision mas IVA suele superar con creces un pack integral cerrado. Tras firmar, puedes pasar a <a href="/administracion-alquiler-barcelona">administracion mensual</a> con el mismo panel.</p><h2>Plazos orientativos</h2><p>Con pricing correcto y filtro de solvencia, muchos casos cierran en 3–8 semanas. Si el piso necesita pintura ligera o pequena reparacion, lo indicamos antes de publicar para no alargar vacancia.</p><h2>Despues del contrato</h2><p>Seguimiento opcional de incidencias, renovaciones e informes al propietario. Mismo equipo NuevaHabitat que conoce historial del piso si mas adelante decides vender.</p>`;
  j.argumento_principal = `<p><strong>Alquiler integral</strong> en <strong>${b.barrioNombre}</strong> (${b.cp}): propietarios que alquilan sin tiempo o sin experiencia LAU. Renta orientativa <strong>${b.renta}</strong>. Servicio <strong>integral</strong>: del anuncio al contrato. Equipo <strong>NuevaHabitat</strong> en Les Corts.</p><p>Guia: <a href="/alquiler-integral-barcelona">Alquiler integral Barcelona</a>. Si el piso estaba en venta: <a href="/vender-piso-alquilado-barcelona">vender piso alquilado</a>.</p><h2>Fianza INCASOL y zona tensionada en Barcelona</h2><p>Fianza en <strong>INCASOL</strong> y contrato conforme a mercado tensionado en Barcelona ciudad. Revisamos renta anterior y clausulas obligatorias antes de firmar.</p>${b.proseLocal}${pad}<h2>Perfil inquilino en ${b.barrioNombre}</h2><p>${b.perfil}</p><h2>Errores que vemos en ${b.cp}</h2><ol>${b.errores.map((e) => `<li>${e}</li>`).join('')}</ol><h2>Que incluye el pack integral</h2><ul><li>Propuesta de renta con comparables del barrio.</li><li>Anuncio, criba y visitas en tus franjas.</li><li>Informe top 3 perfiles, contrato LAU e inventario.</li><li>Opcion de administracion mensual tras firmar.</li></ul><h2>Interlinking Barcelona</h2><p>${b.interlink}</p><h2>Proximo paso ${b.slug}</h2><p>Formulario: m2, renta deseada y situacion del piso. Respuesta en 24 h laborables.</p>`;
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
  return j;
}

const ADMIN = [
  {
    slug: 'administracion-alquiler-la-sagrera-barcelona',
    barrioNombre: 'La Sagrera',
    barrioShort: 'La Sagrera',
    cp: '08027',
    renta: '920–1.120 €/mes',
    precioDefault: 1020,
    image: 'imagenes/hospitalet5.jpg',
    keyword: 'administracion alquiler la sagrera barcelona',
    h1: 'Administracion de alquiler en La Sagrera: cobro e incidencias junto a estacion y parque',
    proseLocal: '<h2>La Sagrera y estacion AVE</h2><p><strong>La Sagrera</strong> mezcla familias entre Clot y Sant Andreu — ruido ferroviario puntual exige transparencia en contrato. Administracion evita que el propietario sea el buzon de quejas vecinales.</p><h2>Parc de la Sagrera</h2><p>Inquilino familiar valora equipamiento; finca con ascensor en obras requiere seguimiento con comunidad.</p>',
    perfil: 'Familias con metro L1/L5, pendulares Rodalies, herencias alquiladas entre hermanos.',
    errores: ['Pricing El Clot en Sagrera alta.', 'Impago sin protocolo 15 dias.', 'Renovacion sin indice tensionado.', 'WhatsApp propietario-inquilino.', 'No domiciliar renta.'],
    interlink: '<a href="/vender-la-sagrera-barcelona">Vender La Sagrera</a> · <a href="/administracion-alquiler-navas-barcelona">Admin Navas</a> · <a href="/administracion-alquileres-el-clot">Admin El Clot (distrito)</a>.',
  },
  {
    slug: 'administracion-alquiler-verdum-barcelona',
    barrioNombre: 'Verdum',
    barrioShort: 'Verdum',
    cp: '08042',
    renta: '760–940 €/mes',
    precioDefault: 850,
    image: 'imagenes/noubarris1.jpg',
    keyword: 'administracion alquiler verdum barcelona',
    h1: 'Administracion de alquiler en Verdum: gestion mensual en Nou Barris central',
    proseLocal: '<h2>Verdum y parc Central</h2><p><strong>Verdum</strong> concentra bloques 60–70 con ascensor irregular — cobro puntual y actas de incidencias protegen margen del propietario.</p><h2>Metro Roquetes y Trinitat Nova</h2><p>Ticket contenido: rotacion alta si no filtras solvencia al alta.</p>',
    perfil: 'Familias primerizas, inversores en ticket bajo, herencias entre hermanos en Nou Barris.',
    errores: ['Mezclar Verdum y Roquetes en renta.', 'Subarriendo no autorizado.', 'Fianza sin INCASOL.', 'No inventario en cambio inquilino.', 'Ignorar derrama ascensor.'],
    interlink: '<a href="/vender-roquetes-barcelona">Vender Roquetes</a> · <a href="/administracion-alquiler-roquetes-barcelona">Admin Roquetes</a> · <a href="/administracion-alquileres-nou-barris">Admin Nou Barris</a>.',
  },
  {
    slug: 'administracion-alquiler-torre-baro-barcelona',
    barrioNombre: 'Torre Baró',
    barrioShort: 'Torre Baró',
    cp: '08031',
    renta: '680–850 €/mes',
    precioDefault: 760,
    image: 'imagenes/noubarris2.jpg',
    keyword: 'administracion alquiler torre baro barcelona',
    h1: 'Administracion de alquiler en Torre Baró: rentas en la zona alta de Nou Barris',
    proseLocal: '<h2>Torre Baró y pendiente</h2><p><strong>Torre Baró</strong> tiene menos comercio que Verdum — inquilino estable compensa ticket bajo. Administracion documenta estado en entrega por desgaste en escaleras.</p><h2>Acceso bus y metro lejano</h2><p>Contrato LAU claro sobre minutos reales al transporte evita conflictos.</p>',
    perfil: 'Familias locales, parejas con coche, propietarios herederos que no viven en Barcelona.',
    errores: ['Pricing Verdum en Torre Baró sin ascensor.', 'Planta baja sin luz mal explicada.', 'Impago tolerado demasiado.', 'Sin seguro hogar arrendador.', 'Renovacion oral.'],
    interlink: '<a href="/vender-nou-barris">Vender Nou Barris</a> · <a href="/administracion-alquiler-porta-barcelona">Admin Porta</a>.',
  },
  {
    slug: 'administracion-alquiler-provencals-del-poblenou-barcelona',
    barrioNombre: 'Provençals del Poblenou',
    barrioShort: 'Provençals',
    cp: '08005',
    renta: '980–1.220 €/mes',
    precioDefault: 1100,
    image: 'imagenes/poblenou5.jpg',
    keyword: 'administracion alquiler provencals del poblenou barcelona',
    h1: 'Administracion de alquiler en Provençals del Poblenou: gestion entre Verneda y 22@',
    proseLocal: '<h2>Provençals residencial</h2><p><strong>Provençals del Poblenou</strong> fincas 70–80 familiares — no confundir renta con torres Diagonal Mar. Gestor unico para incidencias y renovaciones.</p><h2>Rambla de Prim</h2><p>Ruido en fachada: clausulas y pricing acordes desde el alta del servicio.</p>',
    perfil: 'Familias con tres habitaciones, teletrabajo, inquilino larga duracion en Sant Marti.',
    errores: ['Precio Poblenou tech en Provençals.', 'No informar obras comunidad.', 'Comunicacion directa propietario-inquilino.', 'Fianza en efectivo.', 'Sin archivo de recibos.'],
    interlink: '<a href="/vender-provencals-del-poblenou-barcelona">Vender Provençals</a> · <a href="/administracion-alquiler-verneda-barcelona">Admin Verneda</a> · <a href="/alquiler-integral-el-besos-barcelona">Integral El Besos</a>.',
  },
  {
    slug: 'administracion-alquiler-tetuan-barcelona',
    barrioNombre: 'Tetuan',
    barrioShort: 'Tetuan',
    cp: '08018',
    renta: '1.050–1.320 €/mes',
    precioDefault: 1180,
    image: 'imagenes/eixample5.jpg',
    keyword: 'administracion alquiler tetuan barcelona',
    h1: 'Administracion de alquiler en Tetuan: cobro de rentas junto a Gran Via y Glories',
    proseLocal: '<h2>Tetuan y Gran Via</h2><p><strong>Tetuan</strong> mezcla ensanche y bloques mid-century — inquilino profesional exige respuesta rapida en averias. Panel centraliza sin dar tu movil.</p><h2>Interior vs avenida</h2><p>Dos tickets en el mismo codigo postal: documentar calle en informes al propietario.</p>',
    perfil: 'Profesionales Glories/Diagonal, familias que comparan Fort Pienc, expatriados en contrato anual.',
    errores: ['Pricing Eixample Dreta en Tetuan interior.', 'Renovacion sin renta anterior tensionada.', 'Incidencias ascensor sin proveedor.', 'Impago sin seguro evaluado.', 'Mezclar venta y alquiler sin aviso.'],
    interlink: '<a href="/vender-tetuan-barcelona">Vender Tetuan</a> · <a href="/administracion-alquileres-fort-pienc">Admin Fort Pienc</a> · <a href="/administracion-alquileres-eixample">Admin Eixample</a>.',
  },
];

const INTEGRAL = [
  {
    slug: 'alquiler-integral-montjuic-barcelona',
    barrioNombre: 'Montjuïc',
    barrioShort: 'Montjuïc',
    cp: '08004',
    renta: '880–1.100 €/mes',
    precioDefault: 990,
    image: 'imagenes/poblesec1.jpg',
    keyword: 'alquiler integral montjuic barcelona',
    h1: 'Alquiler integral en Montjuïc: del anuncio al contrato bajo la montaña',
    proseLocal: '<h2>Montjuïc y pendiente</h2><p><strong>Montjuïc</strong> vende verde y silencio — anuncio honesto sobre escaleras y aparcamiento filtra antes de visita.</p><h2>Poble-sec y Paral·lel</h2><p>Comprador compara con Poble-sec: pricing distinto segun minutos reales al metro.</p><h2>Fira y calendario</h2><p>Algunas calles notan trafico en fechas de evento: lo indicamos en ficha para inquilino residente informado, no turistico.</p>',
    perfil: 'Parejas maduras, familias que aceptan bus, teletrabajadores que valoran parque.',
    errores: ['Etiquetar Poble-sec en anuncio Montjuïc.', 'Fotos sin mostrar escaleras.', 'Precio Eixample en finca sin ascensor.', 'Uso turistico confundido con LAU.', 'Inventario incompleto en terraza.'],
    interlink: '<a href="/vender-montjuic-barcelona">Vender Montjuïc</a> · <a href="/vender-como-particular-montjuic-barcelona">Particular Montjuïc</a> · <a href="/alquiler-integral-poble-sec">Integral Poble-sec</a>.',
  },
  {
    slug: 'alquiler-integral-la-sagrera-barcelona',
    barrioNombre: 'La Sagrera',
    barrioShort: 'La Sagrera',
    cp: '08027',
    renta: '920–1.120 €/mes',
    precioDefault: 1020,
    image: 'imagenes/hospitalet5.jpg',
    keyword: 'alquiler integral la sagrera barcelona',
    h1: 'Alquiler integral en La Sagrera: captacion y cierre LAU entre Clot y Sant Andreu',
    proseLocal: '<h2>Estacion y familias</h2><p><strong>La Sagrera</strong> atrae pendulares — visitas filtradas con nomina evitan curiosos del AVE. Comparables Sagrera alta vs calles al Clot.</p><h2>Parc nuevo</h2><p>Argumento familiar valido si minutos caminando son reales en ficha.</p>',
    perfil: 'Familias L1/L5, parejas Rodalies, inquilino estable en contrato anual.',
    errores: ['Confundir Sagrera y Navas en pricing.', 'Anuncio sin mencionar vibracion en calle concreta.', 'Visitas sin filtro aval.', 'Contrato sin INCASOL.', 'Comision opaca no explicada.'],
    interlink: '<a href="/vender-la-sagrera-barcelona">Vender La Sagrera</a> · <a href="/administracion-alquiler-la-sagrera-barcelona">Admin La Sagrera</a> · <a href="/administracion-alquiler-navas-barcelona">Admin Navas</a>.',
  },
  {
    slug: 'alquiler-integral-la-marina-barcelona',
    barrioNombre: 'La Marina',
    barrioShort: 'La Marina',
    cp: '08038',
    renta: '820–1.020 €/mes',
    precioDefault: 920,
    image: 'imagenes/sants2.jpg',
    keyword: 'alquiler integral la marina barcelona',
    h1: 'Alquiler integral en La Marina: puesta en alquiler en primera vivienda del sur',
    proseLocal: '<h2>La Marina del Port</h2><p><strong>La Marina</strong> ticket de entrada en Barcelona ciudad — comparables de manzana, no de Montjuïc premium. Filtro solvencia clave en ticket ajustado.</p><h2>Zona Franca y ruido viario</h2><p>Planta baja a eje: precio y clausulas desde publicacion.</p>',
    perfil: 'Primerizos, familias con coche, trabajadores puerto y logistica.',
    errores: ['Precio Sants en Marina.', 'No mencionar minutos a metro.', 'Curiosos sin hipoteca en visitas.', 'Fianza mal gestionada.', 'Mobiliario no listado.'],
    interlink: '<a href="/vender-la-marina-barcelona">Vender La Marina</a> · <a href="/alquiler-integral-hostafrancs-barcelona">Integral Hostafrancs</a> · <a href="/vender-montjuic-barcelona">Montjuïc venta</a>.',
  },
  {
    slug: 'alquiler-integral-verdum-barcelona',
    barrioNombre: 'Verdum',
    barrioShort: 'Verdum',
    cp: '08042',
    renta: '760–940 €/mes',
    precioDefault: 850,
    image: 'imagenes/noubarris1.jpg',
    keyword: 'alquiler integral verdum barcelona',
    h1: 'Alquiler integral en Verdum: del anuncio al contrato en Nou Barris accesible',
    proseLocal: '<h2>Verdum comercial</h2><p><strong>Verdum</strong> densidad de comercio y metro — pack integral cierra rapido si pricing es realista para 08042.</p><h2>Roquetes limite</h2><p>Misma busqueda “Nou Barris barato”: diferenciar calle en titular.</p><h2>Reforma ligera entre contratos</h2><p>Pintura y pequenas reparaciones antes de publicar acortan vacancia; presupuesto claro al propietario antes de iniciar visitas.</p>',
    perfil: 'Familias primerizas, parejas jovenes, inversores en yield moderado.',
    errores: ['Pricing Gracia en Verdum.', 'Anuncio generico Barcelona.', 'No filtro de impago.', 'LAU sin tensionado.', 'Entrega sin inventario firmado.'],
    interlink: '<a href="/vender-roquetes-barcelona">Vender Roquetes</a> · <a href="/administracion-alquiler-verdum-barcelona">Admin Verdum</a> · <a href="/alquiler-integral-nou-barris">Integral Nou Barris</a>.',
  },
  {
    slug: 'alquiler-integral-tetuan-barcelona',
    barrioNombre: 'Tetuan',
    barrioShort: 'Tetuan',
    cp: '08018',
    renta: '1.050–1.320 €/mes',
    precioDefault: 1180,
    image: 'imagenes/eixample5.jpg',
    keyword: 'alquiler integral tetuan barcelona',
    h1: 'Alquiler integral en Tetuan: inquilino profesional junto a Gran Via',
    proseLocal: '<h2>Tetuan profesional</h2><p><strong>Tetuan</strong> demanda estable si renta respeta tensionado y estado — visitas en franjas laborales, criba de nomina.</p><h2>Glories a pie</h2><p>Inquilino tech/oficina: contrato anual claro, no temporada opaca.</p><h2>Gran Via vs interior</h2><p>Fachada a avenida y patio de manzana no comparten comparables: fijamos renta con cierres de la misma calle antes del primer anuncio.</p>',
    perfil: 'Profesionales Diagonal/Glories, familias tres habitaciones, expatriados documentados.',
    errores: ['Interior de manzana a precio de avenida.', 'Fotos gran angular enganoso.', 'Ignorar derrama en comunidad.', 'No registrar renta anterior.', '499 € no explicado vs comision.'],
    interlink: '<a href="/vender-tetuan-barcelona">Vender Tetuan</a> · <a href="/administracion-alquiler-tetuan-barcelona">Admin Tetuan</a> · <a href="/alquiler-integral-fort-pienc">Integral Fort Pienc</a>.',
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
  const out = path.join(OUT, j.slug + '.json');
  fs.writeFileSync(out, JSON.stringify(j, null, 2));
  console.log('Wrote', j.slug, '—', words, 'words');
});

INTEGRAL.forEach((b) => {
  const j = patchIntegral(integralTpl, b);
  const words = wc(j.argumento_principal);
  if (words < 360) {
    console.error('FAIL', j.slug, words, 'words');
    failed = true;
  }
  const out = path.join(OUT, j.slug + '.json');
  fs.writeFileSync(out, JSON.stringify(j, null, 2));
  console.log('Wrote', j.slug, '—', words, 'words');
});

if (failed) process.exit(1);
