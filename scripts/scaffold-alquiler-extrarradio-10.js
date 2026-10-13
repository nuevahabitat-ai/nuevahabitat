/**
 * Lote extrarradio Barcelona: 5 integral + 5 administracion (slugs -barcelona).
 * node scripts/scaffold-alquiler-extrarradio-10.js && node scripts/build-landings.js
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
    slug: 'administracion-alquiler-bon-pastor-barcelona',
    barrioNombre: 'Bon Pastor',
    barrioShort: 'Bon Pastor',
    cp: '08030',
    renta: '820–1.000 €/mes',
    precioDefault: 900,
    image: 'imagenes/noubarris1.jpg',
    keyword: 'administracion alquiler bon pastor barcelona',
    h1: 'Administracion de alquiler en Bon Pastor: cobro de rentas en Sant Andreu nord',
    proseLocal: '<h2>Bon Pastor y rio Besos</h2><p><strong>Bon Pastor</strong> mezcla casas bajas y bloques junto al Besos — incidencias humedad y comunidad activa. Gestor intermediario evita conflictos vecinales.</p><h2>Metro Bon Pastor</h2><p>Inquilino familiar valora L10; contrato LAU claro reduce rotacion.</p>',
    perfil: 'Familias numerosas, trabajadores industriales y logisticos, herencias alquiladas entre hermanos.',
    errores: ['Confundir Bon Pastor con La Sagrera en renta.', 'Impago sin actuar en 15 dias.', 'No domiciliar renta.', 'Renovacion sin indice tensionado.', 'Mezclar venta y alquiler sin avisar inquilino.'],
    interlink: '<a href="/vender-como-particular-bon-pastor-barcelona">Vender como particular Bon Pastor</a> si dudas entre alquilar o vender.',
  },
  {
    slug: 'administracion-alquiler-navas-barcelona',
    barrioNombre: 'Navas',
    barrioShort: 'Navas',
    cp: '08027',
    renta: '900–1.100 €/mes',
    precioDefault: 1000,
    image: 'imagenes/santmarti1.webp',
    keyword: 'administracion alquiler navas barcelona',
    h1: 'Administracion de alquiler en Navas: gestion mensual en Sant Andreu sur',
    proseLocal: '<h2>Navas y Fabra i Puig</h2><p><strong>Navas</strong> concentra fincas de los 60–70 con ascensor irregular. Administracion incluye seguimiento de averias y mediacion con comunidad.</p><h2>Proximidad Sagrera</h2><p>Pricing distinto a Congres — documentar calle concreta.</p>',
    perfil: 'Familias locales, parejas que buscan tres habitaciones, inquilino estable en metro.',
    errores: ['Pricing de Eixample en Navas.', 'WhatsApp del propietario al inquilino.', 'Sin archivo de recibos.', 'Obras en finca sin informar.', 'Fianza sin INCASOL.'],
    interlink: '<a href="/vender-como-particular-navas-barcelona">Particular Navas</a> · <a href="/vender-como-particular-la-sagrera-barcelona">La Sagrera</a>.',
  },
  {
    slug: 'administracion-alquiler-roquetes-barcelona',
    barrioNombre: 'Roquetes',
    barrioShort: 'Roquetes',
    cp: '08042',
    renta: '780–950 €/mes',
    precioDefault: 860,
    image: 'imagenes/noubarris2.jpg',
    keyword: 'administracion alquiler roquetes barcelona',
    h1: 'Administracion de alquiler en Roquetes: control de rentas en Nou Barris sur',
    proseLocal: '<h2>Roquetes y parc Central</h2><p><strong>Roquetes</strong> comparte ticket contenido con Verdum — cobro puntual protege margen del propietario.</p><h2>Comunidades amplias</h2><p>Ascensor e incidencias comunes requieren proveedores habituales en la zona.</p>',
    perfil: 'Familias primerizas, parejas jovenes, inversores en ticket bajo en Barcelona ciudad.',
    errores: ['Mezclar Roquetes y Trinitat Vella en anuncio.', 'Subarriendo no autorizado.', 'No inventario en cambio inquilino.', 'Impago tolerado demasiado.', 'Renovacion mal redactada.'],
    interlink: '<a href="/vender-roquetes-barcelona">Vender en Roquetes</a> · <a href="/administracion-alquiler-porta-barcelona">Admin Porta</a>.',
  },
  {
    slug: 'administracion-alquiler-trinitat-vella-barcelona',
    barrioNombre: 'Trinitat Vella',
    barrioShort: 'Trinitat Vella',
    cp: '08020',
    renta: '750–920 €/mes',
    precioDefault: 830,
    image: 'imagenes/noubarris2.jpg',
    keyword: 'administracion alquiler trinitat vella barcelona',
    h1: 'Administracion de alquiler en Trinitat Vella: propietario sin estrés en el limite con Sant Adria',
    proseLocal: '<h2>Trinitat Vella y Besos</h2><p><strong>Trinitat Vella</strong> mezcla bloques y casas — propietarios lejanos delegan cobro e incidencias.</p><h2>Acceso R2 y metro</h2><p>Inquilino puede trabajar fuera del barrio; contrato estable LAU habitual.</p>',
    perfil: 'Familias locales, herencias entre hermanos, inversores conservadores.',
    errores: ['Herencia sin acuerdo quien cobra.', 'No actualizar IBAN en renovacion.', 'Precio tensionado mal aplicado.', 'Incidencias ascensor ignoradas.', 'Falta informe anual al propietario.'],
    interlink: '<a href="/vender-como-particular-trinitat-vella-barcelona">Particular Trinitat Vella</a>.',
  },
  {
    slug: 'administracion-alquiler-verneda-barcelona',
    barrioNombre: 'La Verneda i la Pau',
    barrioShort: 'La Verneda',
    cp: '08020',
    renta: '880–1.080 €/mes',
    precioDefault: 980,
    image: 'imagenes/santmarti1.webp',
    keyword: 'administracion alquiler verneda barcelona',
    h1: 'Administracion de alquiler en La Verneda: gestion en Sant Marti extrarradio',
    proseLocal: '<h2>Verneda y Gran Via</h2><p><strong>La Verneda</strong> conecta con Besos y Fabra i Puig — demanda familiar estable si el piso esta bien mantenido.</p><h2>Parc de la Pau</h2><p>Inquilino valora equipamientos; finca deteriorada alarga vacancia.</p>',
    perfil: 'Familias, trabajadores en zona Besos, parejas con hijos en escuela publica.',
    errores: ['Confundir Verneda con Clot en renta.', 'No filtrar solvencia en visitas ajenas.', 'Comunidad en conflicto sin actas.', 'Seguro hogar desactualizado.', 'Gestion informal sin panel.'],
    interlink: '<a href="/vender-verneda-barcelona">Vender Verneda</a> · <a href="/administracion-alquileres-el-clot">Admin El Clot (distrito)</a>.',
  },
];

const INTEGRAL = [
  {
    slug: 'alquiler-integral-guinardo-barcelona',
    barrioNombre: 'El Guinardo',
    barrioShort: 'Guinardo',
    cp: '08041',
    renta: '900–1.150 €/mes',
    precioDefault: 1020,
    image: 'imagenes/horta2.jpg',
    keyword: 'alquiler integral guinardo barcelona',
    h1: 'Alquiler integral en El Guinardo: del anuncio al contrato en fincas de pendiente',
    proseLocal: '<h2>Guinardo y vistas</h2><p><strong>El Guinardo</strong> mezcla familias y teletrabajo — planta y ascensor deben ser honestos en anuncio.</p><h2>Hospital Sant Pau cercano</h2><p>Sanitarios buscan contrato anual estable, no temporada opaca. Documentamos minutos reales al metro o bus en ficha y contrato.</p>',
    perfil: 'Familias, sanitarios, teletrabajadores que aceptan bus hacia metro.',
    errores: ['Precio Gracia en Guinardo.', 'Fotos sin mostrar escaleras.', 'Visitas sin filtro de nomina.', 'Fianza en mano del propietario.', 'Contrato sin clausula tensionada.'],
    interlink: '<a href="/vender-guinardo-barcelona">Vender Guinardo</a> · <a href="/alquiler-integral-el-carmel-barcelona">Integral El Carmel</a>.',
  },
  {
    slug: 'alquiler-integral-hostafrancs-barcelona',
    barrioNombre: 'Hostafrancs',
    barrioShort: 'Hostafrancs',
    cp: '08014',
    renta: '950–1.200 €/mes',
    precioDefault: 1070,
    image: 'imagenes/sants1.jpg',
    keyword: 'alquiler integral hostafrancs barcelona',
    h1: 'Alquiler integral en Hostafrancs: inquilino estable junto a Sants Estacio',
    proseLocal: '<h2>Hostafrancs y Placa Espanya</h2><p><strong>Hostafrancs</strong> atrae parejas y familias por metro y FGC — filtro de solvencia evita rotacion.</p><h2>Carrer de la Creu Coberta</h2><p>Ruido en planta baja: precio y clausulas acordes. Inventario detallado en planta baja reduce disputas en fianza al final.</p>',
    perfil: 'Profesionales, familias e inquilino de larga duracion en Sants-Montjuic con nomina estable en Barcelona.',
    errores: ['Mezclar Hostafrancs y Bordeta en pricing.', 'Anuncio sin certificado energetico.', 'Comision opaca no explicada.', 'Inventario incompleto.', 'Ignorar derrama en comunidad.'],
    interlink: '<a href="/vender-hostafrancs-barcelona">Vender Hostafrancs</a> · <a href="/alquiler-integral-poble-sec">Integral Poble-sec (distrito)</a>.',
  },
  {
    slug: 'alquiler-integral-la-bordeta-barcelona',
    barrioNombre: 'La Bordeta',
    barrioShort: 'La Bordeta',
    cp: '08014',
    renta: '920–1.150 €/mes',
    precioDefault: 1030,
    image: 'imagenes/sants2.jpg',
    keyword: 'alquiler integral la bordeta barcelona',
    h1: 'Alquiler integral en La Bordeta: captacion y cierre LAU en Sants sur',
    proseLocal: '<h2>Bordeta y Mercat del Ninot cercano</h2><p><strong>La Bordeta</strong> fincas del primer tercio del XX — estado interior manda en renta.</p><h2>Gran Via sud</h2><p>Inquilino laboral valora conexion rapida con zona universitaria. Caldera y instalacion revisadas antes de visitas evitan sorpresas en negociacion.</p>',
    perfil: 'Familias, parejas jovenes y trabajadores en poligonos del Llobregat que buscan contrato anual claro.',
    errores: ['Pricing Sant Antoni en Bordeta.', 'No mencionar ascensor o falta de el.', 'Curiosos sin filtro en visitas.', 'LAU mal redactada.', 'No registrar renta anterior.'],
    interlink: '<a href="/vender-la-bordeta-barcelona">Vender La Bordeta</a>.',
  },
  {
    slug: 'alquiler-integral-camp-de-larpa-barcelona',
    barrioNombre: 'Camp de l\'Arpa del Clot',
    barrioShort: 'Camp de l\'Arpa',
    cp: '08018',
    renta: '980–1.220 €/mes',
    precioDefault: 1100,
    image: 'imagenes/santmarti1.webp',
    keyword: 'alquiler integral camp de larpa barcelona',
    h1: 'Alquiler integral en Camp de l\'Arpa: alquiler en Sant Marti residencial',
    proseLocal: '<h2>Camp de l\'Arpa y Rambla Guipuscoa</h2><p><strong>Camp de l\'Arpa</strong> mezcla familias consolidadas y demanda de larga duracion — visitas filtradas ahorran fines de semana.</p><h2>Proximidad Clot</h2><p>Diferenciar pricing de El Clot estacion en calle concreta.</p>',
    perfil: 'Familias, parejas con hijos, teletrabajo en piso tranquilo.',
    errores: ['Confundir Camp de l\'Arpa y El Clot en anuncio.', 'Fotos con gran angular enganoso.', 'No filtro de aval.', 'Contrato sin INCASOL.', 'Mobiliario no listado.'],
    interlink: '<a href="/vender-camp-de-larpa-barcelona">Vender Camp de l\'Arpa</a> · <a href="/alquiler-integral-el-clot">Integral El Clot</a>.',
  },
  {
    slug: 'alquiler-integral-el-besos-barcelona',
    barrioNombre: 'El Besos i el Maresme',
    barrioShort: 'El Besos',
    cp: '08019',
    renta: '900–1.120 €/mes',
    precioDefault: 1010,
    image: 'imagenes/santmarti1.webp',
    keyword: 'alquiler integral el besos barcelona',
    h1: 'Alquiler integral en El Besos: del anuncio al contrato en el front maritim norte',
    proseLocal: '<h2>Besos i Maresme y Diagonal Mar</h2><p><strong>El Besos</strong> combina torres y fincas familiares — comparables de la misma manzana, no de Diagonal Mar premium.</p><h2>Parc del Forum</h2><p>Inquilino joven y familiar segun tipologia; contrato claro de uso habitual.</p>',
    perfil: 'Familias, parejas, trabajadores en zona Besos forum y Poblenou industrial.',
    errores: ['Precio Diagonal Mar en Besos interior.', 'Uso turistico confundido con LAU.', 'Sin filtro ruido en planta baja.', 'Fianza mal gestionada.', 'Renovacion sin preaviso.'],
    interlink: '<a href="/vender-el-besos-barcelona">Vender El Besos</a> · <a href="/vender-vila-olimpica-barcelona">Vila Olimpica venta</a>.',
  },
];

const adminTpl = JSON.parse(fs.readFileSync(TEMPLATE, 'utf8'));
const integralTpl = JSON.parse(fs.readFileSync(path.join(OUT, 'alquiler-integral-el-carmel-barcelona.json'), 'utf8'));

ADMIN.forEach((b) => {
  const j = patchAdmin(adminTpl, b);
  const out = path.join(OUT, j.slug + '.json');
  fs.writeFileSync(out, JSON.stringify(j, null, 2));
  console.log('Wrote', j.slug, '—', wc(j.argumento_principal), 'words');
});

INTEGRAL.forEach((b) => {
  const j = patchIntegral(integralTpl, b);
  const out = path.join(OUT, j.slug + '.json');
  fs.writeFileSync(out, JSON.stringify(j, null, 2));
  console.log('Wrote', j.slug, '—', wc(j.argumento_principal), 'words');
});
