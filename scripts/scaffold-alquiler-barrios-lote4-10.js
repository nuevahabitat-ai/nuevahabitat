/**
 * Lote 4: 5 admin + 5 integral — Carmel, Poble Sec, Sant Antoni, Fort Pienc, Barceloneta;
 * Bon Pastor, Navas, Porta, Vallcarca, Roquetes (integral donde ya hay admin).
 * node scripts/scaffold-alquiler-barrios-lote4-10.js && node scripts/build-landings.js
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
  j.argumento_principal = `<p><strong>Administracion de alquiler</strong> en <strong>${b.barrioNombre}</strong> (${b.cp}): propietarios sin tiempo, sin experiencia LAU o desde el extranjero. Renta orientativa <strong>${b.renta}</strong>. <strong>Administracion</strong> mensual una vez alquilado. Equipo <strong>NuevaHabitat</strong> en Les Corts.</p><p>Guia: <a href="/administracion-alquiler-barcelona">Administracion de alquiler Barcelona</a>. Si el piso estaba en venta: <a href="/vender-piso-alquilado-barcelona">vender piso alquilado</a>.</p><h2>Fianza INCASOL y zona tensionada</h2><p>${b.tensionado || 'En Barcelona ciudad la fianza legal se deposita en el <strong>INCASOL</strong> en un plazo maximo de dos meses. Todo el municipio esta en mercado tensionado: contratos nuevos deben respetar topes, informar renta anterior y justificar mejoras.'}</p>${b.proseLocal}${pad}<h2>Perfil inquilino en ${b.barrioNombre}</h2><p>${b.perfil}</p><h2>Errores que vemos en ${b.cp}</h2><ol>${b.errores.map((e) => `<li>${e}</li>`).join('')}</ol><h2>Documentacion propietario</h2><ul><li>Escritura o nota simple, IBI, certificado energetico.</li><li>Comunidad al dia; derramas comunicadas.</li><li>Seguro hogar arrendador.</li><li>Inventario y fotos al alta del servicio.</li><li>Renta anterior documentada cuando aplica tensionado.</li></ul><h2>Panel y comunicacion</h2><p>Incidencias, rentas y documentos centralizados. WhatsApp con gestor en horario comercial.</p><h2>Interlinking</h2><p>${b.interlink}</p><h2>Proximo paso ${b.slug}</h2><p>Formulario: micro-zona, m2, renta deseada, situacion (libre, alquilado, herencia). Consulta sin compromiso en 24 h laborables desde Carrer Mejia Lequerica 42.</p>`;
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
  const pad = `<h2>Captacion en ${b.barrioShort}</h2><p>Publicacion con fotos honestas, criba de mensajes y visitas en franjas acordadas — menos curiosos, mas perfiles con nomina o aval. Propuesta de renta con comparables de ${b.cp}, no medias genericas de Barcelona. Informe top 3 candidatos, borrador LAU revisado, fianza INCASOL e inventario firmado en entrega de llaves.</p><h2>499 € fijo vs comision clasica</h2><p>En rentas orientativas de ${b.renta}, un mes de comision mas IVA suele superar con creces un pack integral cerrado. Tras firmar, puedes pasar a <a href="/administracion-alquiler-barcelona">administracion mensual</a> con el mismo panel.</p><h2>Plazos orientativos</h2><p>Con pricing correcto y filtro de solvencia, muchos casos cierran en 3–8 semanas. Si el piso necesita pintura ligera o pequena reparacion, lo indicamos antes de publicar para no alargar vacancia.</p><h2>Despues del contrato</h2><p>Seguimiento opcional de incidencias, renovaciones e informes al propietario. Mismo equipo NuevaHabitat que conoce historial del piso si mas adelante decides vender.</p>`;
  j.argumento_principal = `<p><strong>Alquiler integral</strong> en <strong>${b.barrioNombre}</strong> (${b.cp}): propietarios que alquilan sin tiempo o sin experiencia LAU. Renta orientativa <strong>${b.renta}</strong>. Servicio <strong>integral</strong>: del anuncio al contrato. Equipo <strong>NuevaHabitat</strong> en Les Corts.</p><p>Guia: <a href="/alquiler-integral-barcelona">Alquiler integral Barcelona</a>. Si el piso estaba en venta: <a href="/vender-piso-alquilado-barcelona">vender piso alquilado</a>.</p><h2>Fianza INCASOL y contrato LAU</h2><p>${b.tensionado || 'Fianza en <strong>INCASOL</strong> y contrato conforme a mercado tensionado en Barcelona ciudad. Revisamos renta anterior y clausulas obligatorias antes de firmar.'}</p>${b.proseLocal}${pad}<h2>Perfil inquilino en ${b.barrioNombre}</h2><p>${b.perfil}</p><h2>Errores que vemos en ${b.cp}</h2><ol>${b.errores.map((e) => `<li>${e}</li>`).join('')}</ol><h2>Que incluye el pack integral</h2><ul><li>Propuesta de renta con comparables del barrio.</li><li>Anuncio, criba y visitas en tus franjas.</li><li>Informe top 3 perfiles, contrato LAU e inventario.</li><li>Opcion de administracion mensual tras firmar.</li></ul><h2>Interlinking</h2><p>${b.interlink}</p><h2>Proximo paso ${b.slug}</h2><p>Formulario: m2, renta deseada y situacion del piso. Respuesta en 24 h laborables.</p>`;
  j.como_ayudamos.title = `Alquiler integral en ${b.barrioShort}`;
  j.comparativa_modelos.title = `${b.barrioShort}: formas de alquilar`;
  j.mitos.title = `Mitos alquiler integral ${b.barrioShort}`;
  j.checklist.title = `Checklist propietario ${b.barrioShort}`;
  j.faq[0] = { q: `Trabajais en ${b.barrioNombre}?`, a: `Si. Cubrimos ${b.barrioNombre}. Renta orientativa ${b.renta}.` };
  j.faq[6] = { q: 'Plazo hasta primer ingreso?', a: 'Orientativamente 3–8 semanas con pricing correcto y filtro de solvencia.' };
  j.relacionadas[0] = { slug: 'alquiler-integral-barcelona', label: 'Alquiler integral Barcelona' };
  j.keywords_footer = `${b.keyword} · ${b.cp} · INCASOL · LAU · NuevaHabitat Les Corts`;
  j.whatsappText = encodeURIComponent(`Hola, consulto alquiler integral en ${b.barrioNombre}`);
  j.formPlaceholder = `${b.barrioShort} — m2 y renta deseada`;
  j.form_side_text = `${b.barrioShort}: plan integral por escrito tras revisar estado del piso.`;
  if (b.priority) j.priority = b.priority;
  return j;
}

const ADMIN = [
  {
    slug: 'administracion-alquiler-el-carmel-barcelona',
    barrioNombre: 'El Carmel',
    barrioShort: 'El Carmel',
    cp: '08032',
    renta: '850–1.050 €/mes',
    precioDefault: 950,
    image: 'imagenes/horta2.jpg',
    keyword: 'administracion alquiler el carmel barcelona',
    h1: 'Administracion de alquiler en El Carmel: gestion mensual en la ladera del Turó de la Rovira',
    proseLocal: '<h2>El Carmel en pendiente</h2><p><strong>El Carmel</strong> mezcla fincas 60–70 con vistas y bloques en reforma — incidencias de humedad y ascensor requieren seguimiento. Administracion evita que el propietario en el extranjero gestione averias a distancia.</p><h2>Metro L5 Guinardo</h2><p>Inquilino familiar valora transporte; contrato LAU claro y domiciliacion de renta reducen impagos.</p><h2>Comparables por calle</h2><p>La misma orientacion y planta no comparten renta: liquidamos con criterio de cierres recientes en la calle, no medias de Horta-Guinardo.</p>',
    perfil: 'Familias locales, herencias entre hermanos, inversores en ticket medio-alto con piso ya alquilado.',
    errores: ['Confundir Carmel con Guinardo en pricing.', 'Impago tolerado demasiado.', 'Renovacion sin indice tensionado.', 'WhatsApp directo propietario-inquilino.', 'No inventario al cambio de inquilino.'],
    interlink: '<a href="/alquiler-integral-el-carmel-barcelona">Integral El Carmel</a> · <a href="/alquiler-integral-guinardo-barcelona">Integral Guinardo</a> · <a href="/administracion-alquileres-horta">Admin Horta-Guinardo (distrito)</a>.',
  },
  {
    slug: 'administracion-alquiler-poble-sec-barcelona',
    barrioNombre: 'Poble-sec',
    barrioShort: 'Poble-sec',
    cp: '08004',
    renta: '950–1.200 €/mes',
    precioDefault: 1070,
    image: 'imagenes/sants2.jpg',
    keyword: 'administracion alquiler poble sec barcelona',
    h1: 'Administracion de alquiler en Poble-sec: cobro e incidencias junto a Montjuic y Paral·lel',
    proseLocal: '<h2>Poble-sec y vida de barrio</h2><p><strong>Poble-sec</strong> concentra demanda joven y familiar cerca de teatros y metro — rotacion moderada si el precio respeta tensionado. Gestor unico sin dar tu movil al inquilino.</p><h2>Plantas bajas y ruido</h2><p>Calles comerciales vs interior de manzana: mediacion en quejas vecinales con actas y plazos LAU.</p>',
    perfil: 'Profesionales Paral·lel, familias, propietarios que alquilan piso heredado en finca sin ascensor.',
    errores: ['Pricing Eixample en Poble-sec.', 'Subarriendo no autorizado.', 'Fianza en mano del propietario.', 'No registrar renta anterior.', 'Incidencias ascensor sin proveedor.'],
    interlink: '<a href="/vender-poble-sec">Vender Poble-sec</a> · <a href="/alquiler-integral-poble-sec">Integral Poble-sec (distrito)</a> · <a href="/administracion-alquileres-sants">Admin Sants-Montjuic</a>.',
  },
  {
    slug: 'administracion-alquiler-sant-antoni-barcelona',
    barrioNombre: 'Sant Antoni',
    barrioShort: 'Sant Antoni',
    cp: '08015',
    renta: '1.000–1.280 €/mes',
    precioDefault: 1140,
    image: 'imagenes/eixample3.jpg',
    keyword: 'administracion alquiler sant antoni barcelona',
    h1: 'Administracion de alquiler en Sant Antoni: gestion mensual en el mercado del domingo',
    proseLocal: '<h2>Sant Antoni en transformacion</h2><p><strong>Sant Antoni</strong> mezcla fincas reformadas y pisos pendientes de actualizar — administracion documenta estado en alta para disputas de fianza. Mercado tensionado estricto en renovaciones.</p><h2>Comercio y ruido</h2><p>Plantas sobre Ronda o mercado: clausulas de uso habitual y horarios en actas de incidencias.</p>',
    perfil: 'Parejas profesionales, familias, propietarios expatriados con piso en alquiler larga duracion.',
    errores: ['Precio Dreta Eixample en Sant Antoni.', 'Renovacion sin preaviso 30 dias.', 'Impago sin acta.', 'Mobiliario no listado.', 'Ignorar derrama en comunidad.'],
    interlink: '<a href="/vender-sant-antoni">Vender Sant Antoni</a> · <a href="/administracion-alquileres-eixample">Admin Eixample</a> · <a href="/alquiler-integral-sant-antoni">Integral Sant Antoni (distrito)</a>.',
  },
  {
    slug: 'administracion-alquiler-fort-pienc-barcelona',
    barrioNombre: 'Fort Pienc',
    barrioShort: 'Fort Pienc',
    cp: '08018',
    renta: '1.050–1.320 €/mes',
    precioDefault: 1180,
    image: 'imagenes/eixample5.jpg',
    keyword: 'administracion alquiler fort pienc barcelona',
    h1: 'Administracion de alquiler en Fort Pienc: gestion junto a Glories y Marina',
    proseLocal: '<h2>Fort Pienc y Arc de Triomf</h2><p><strong>Fort Pienc</strong> atrae inquilino profesional por proximidad a Glories y transporte — cobro puntual e informes mensuales al propietario inversor.</p><h2>Estacion del Nord</h2><p>Demanda estable si renta y estado alineados con tensionado; renovaciones con indice documentado.</p>',
    perfil: 'Profesionales 22@/Glories, familias, propietarios con segundo piso en alquiler.',
    errores: ['Interior vs fachada a Gran Via en renta.', 'Confundir Fort Pienc y Tetuan.', 'No domiciliar renta.', 'LAU mal redactada.', 'Gestion informal sin panel.'],
    interlink: '<a href="/alquiler-integral-fort-pienc">Integral Fort Pienc (distrito)</a> · <a href="/administracion-alquiler-tetuan-barcelona">Admin Tetuan</a> · <a href="/administracion-alquileres-fort-pienc">Admin Fort Pienc (hub)</a>.',
  },
  {
    slug: 'administracion-alquiler-barceloneta-barcelona',
    barrioNombre: 'La Barceloneta',
    barrioShort: 'Barceloneta',
    cp: '08003',
    renta: '1.100–1.450 €/mes',
    precioDefault: 1270,
    image: 'imagenes/barcelona1.jpeg',
    keyword: 'administracion alquiler barceloneta barcelona',
    h1: 'Administracion de alquiler en la Barceloneta: gestion en fincas maritimas y uso habitual',
    proseLocal: '<h2>Barceloneta y temporada</h2><p><strong>La Barceloneta</strong> exige contrato LAU de larga duracion claro — vigilamos clausulas de uso habitual y evitamos subarriendos opacos. Humedad y salitre: incidencias tecnicas con proveedores acreditados.</p><h2>Comunidad pequena</h2><p>Vecindad consolidada: mediacion con criterio antes de escalada legal.</p>',
    perfil: 'Familias locales, profesionales Ciutat Vella, propietarios herederos de piso en finca historica.',
    errores: ['Uso turistico encubierto.', 'Pricing Born en Barceloneta.', 'Fianza no INCASOL.', 'Inventario incompleto.', 'Impago en verano sin acta.'],
    interlink: '<a href="/vender-piso-barceloneta">Vender Barceloneta</a> · <a href="/administracion-alquileres-barceloneta">Admin Barceloneta (distrito)</a> · <a href="/alquiler-integral-barceloneta">Integral Barceloneta (distrito)</a>.',
  },
];

const INTEGRAL = [
  {
    slug: 'alquiler-integral-bon-pastor-barcelona',
    barrioNombre: 'Bon Pastor',
    barrioShort: 'Bon Pastor',
    cp: '08030',
    renta: '750–950 €/mes',
    precioDefault: 850,
    image: 'imagenes/noubarris1.jpg',
    keyword: 'alquiler integral bon pastor barcelona',
    h1: 'Alquiler integral en Bon Pastor: del anuncio al contrato en Sant Andreu sud',
    proseLocal: '<h2>Bon Pastor industrial</h2><p><strong>Bon Pastor</strong> ticket contenido — filtro de solvencia acorta plazo hasta primer ingreso. Fotos reales en bloques junto al Besos.</p><h2>Familias numerosas</h2><p>Demanda estable si estado y renta honestos; pack 499 € fijo vs comision compensa en este ticket.</p>',
    perfil: 'Familias locales, parejas jovenes, propietarios primerizos en alquiler.',
    errores: ['Anuncio generico Sant Andreu.', 'No mencionar ascensor.', 'Curiosos sin criba.', 'Contrato sin INCASOL.', 'Pricing Sant Marti en Bon Pastor.'],
    interlink: '<a href="/administracion-alquiler-bon-pastor-barcelona">Admin Bon Pastor</a> · <a href="/administracion-alquileres-sant-andreu">Admin Sant Andreu (distrito)</a> · <a href="/alquiler-integral-congres-indians-barcelona">Integral Congres</a>.',
  },
  {
    slug: 'alquiler-integral-navas-barcelona',
    barrioNombre: 'Navas',
    barrioShort: 'Navas',
    cp: '08030',
    renta: '820–1.020 €/mes',
    precioDefault: 920,
    image: 'imagenes/noubarris2.jpg',
    keyword: 'alquiler integral navas barcelona',
    h1: 'Alquiler integral en Navas: captacion en el eje Meridiana–Fabra i Puig',
    proseLocal: '<h2>Navas y comercio</h2><p><strong>Navas</strong> concentra pisos funcionales — visitas en franjas laborales y criba de nomina antes de abrir agenda. Comparables por calle, no medias de Nou Barris.</p><h2>Conexion Sant Andreu</h2><p>Inquilino familiar valora metro; contrato claro reduce rotacion.</p>',
    perfil: 'Familias, personal comercial de la zona, inversores en yield moderado.',
    errores: ['Confundir Navas y La Sagrera en renta.', 'Fotos gran angular.', 'Impago sin filtro previo.', 'LAU sin renta anterior.', '499 € no explicado vs comision.'],
    interlink: '<a href="/administracion-alquiler-navas-barcelona">Admin Navas</a> · <a href="/administracion-alquiler-la-sagrera-barcelona">Admin La Sagrera</a> · <a href="/alquiler-integral-la-sagrera-barcelona">Integral La Sagrera</a>.',
  },
  {
    slug: 'alquiler-integral-porta-barcelona',
    barrioNombre: 'Porta',
    barrioShort: 'Porta',
    cp: '08016',
    renta: '850–1.050 €/mes',
    precioDefault: 950,
    image: 'imagenes/noubarris1.jpg',
    keyword: 'alquiler integral porta barcelona',
    h1: 'Alquiler integral en Porta: inquilino estable en Fabra i Puig–Valldaura',
    proseLocal: '<h2>Porta y familias</h2><p><strong>Porta</strong> demanda tres habitaciones si pricing correcto — anuncio honesto sobre planta y ruido en eje comercial. Informe top 3 perfiles antes de decision del propietario.</p><h2>Metro multilinea</h2><p>Argumento de movilidad en ficha; domiciliacion obligatoria en contrato.</p><h2>Entrega de llaves</h2><p>Inventario firmado y lecturas de suministros el dia de entrega evitan disputas meses despues cuando el inquilino pide devolucion de fianza.</p>',
    perfil: 'Familias numerosas, parejas con hijos, trabajadores con desplazamiento en metro.',
    errores: ['Confundir Porta y Verdum.', 'No domiciliar renta.', 'Incidencias sin proveedor.', 'Olvidar inspeccion pre-entrega.', 'Comision opaca.'],
    interlink: '<a href="/administracion-alquiler-porta-barcelona">Admin Porta</a> · <a href="/administracion-alquiler-verdum-barcelona">Admin Verdum</a> · <a href="/administracion-alquileres-nou-barris">Admin Nou Barris (distrito)</a>.',
  },
  {
    slug: 'alquiler-integral-vallcarca-barcelona',
    barrioNombre: 'Vallcarca i els Penitents',
    barrioShort: 'Vallcarca',
    cp: '08023',
    renta: '950–1.200 €/mes',
    precioDefault: 1070,
    image: 'imagenes/gracia2.jpg',
    keyword: 'alquiler integral vallcarca barcelona',
    h1: 'Alquiler integral en Vallcarca: del anuncio al contrato en la ladera de Gracia',
    proseLocal: '<h2>Vallcarca en pendiente</h2><p><strong>Vallcarca</strong> mezcla vistas y escaleras — fotos y descripcion honestas filtran curiosos. Pricing distinto a Vila de Gracia en finca sin ascensor.</p><h2>Metro Penitents</h2><p>Profesionales y familias; visitas concertadas en franjas claras.</p>',
    perfil: 'Teletrabajadores, familias, parejas que buscan Gracia con ticket algo menor.',
    errores: ['Precio Vila de Gracia en Vallcarca interior.', 'Ocultar plantas sin ascensor.', 'No filtro de solvencia.', 'Contrato sin clausula uso habitual.', 'Ignorar derrama.'],
    interlink: '<a href="/administracion-alquiler-vallcarca-barcelona">Admin Vallcarca</a> · <a href="/alquiler-integral-gracia">Integral Gracia (distrito)</a> · <a href="/alquiler-integral-camp-den-grassot-barcelona">Integral Camp d\'en Grassot</a>.',
  },
  {
    slug: 'alquiler-integral-roquetes-barcelona',
    barrioNombre: 'Roquetes',
    barrioShort: 'Roquetes',
    cp: '08020',
    renta: '780–980 €/mes',
    precioDefault: 880,
    image: 'imagenes/noubarris3.jpg',
    keyword: 'alquiler integral roquetes barcelona',
    h1: 'Alquiler integral en Roquetes: captacion en la falda de Turó de la Peira',
    proseLocal: '<h2>Roquetes residencial</h2><p><strong>Roquetes</strong> ticket contenido — pack integral 499 € fijo suele ganar a comision clasica. Criba de aval y nomina antes de visitas.</p><h2>Limites con Nou Barris</h2><p>Comparables de la misma calle, no mezclar con Trinitat Nova en anuncio.</p><h2>Estado del piso</h2><p>Pintura ligera y pequenas reparaciones antes de publicar: presupuesto claro al propietario para no alargar vacancia en mercados de rotacion moderada.</p>',
    perfil: 'Familias locales, herencias, inversores en alquiler larga duracion.',
    errores: ['Pricing Trinitat en Roquetes.', 'Anuncio sin fotos de cocina/bano.', 'Rotacion por mala criba.', 'Fianza mal gestionada.', 'No inventario firmado.'],
    interlink: '<a href="/administracion-alquiler-roquetes-barcelona">Admin Roquetes</a> · <a href="/administracion-alquiler-turo-peira-barcelona">Admin Turó de la Peira</a> · <a href="/administracion-alquiler-trinitat-nova-barcelona">Admin Trinitat Nova</a>.',
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
