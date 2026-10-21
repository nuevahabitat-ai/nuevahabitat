/**
 * Lote 5: 9 landings — Raval (admin+integral); emparejar Guinardó, Montjuïc, Putxet, ZU (admin);
 * Ciutat Meridiana, Trinitat Nova, Verneda (integral).
 * node scripts/scaffold-alquiler-barrios-lote5-9.js && node scripts/build-landings.js
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
    slug: 'administracion-alquiler-raval-barcelona',
    barrioNombre: 'El Raval',
    barrioShort: 'Raval',
    cp: '08001',
    renta: '880–1.150 €/mes',
    precioDefault: 1010,
    image: 'imagenes/barcelona1.jpeg',
    keyword: 'administracion alquiler raval barcelona',
    h1: 'Administracion de alquiler en el Raval: gestion LAU entre MACBA y Drassanes',
    proseLocal: '<h2>Raval norte y sur</h2><p><strong>El Raval</strong> no es un solo mercado: la franja MACBA–Tallers no comparte renta ni perfil con el sur mas residencial. Administracion mensual con comparables de calle evita conflictos en renovacion tensionada.</p><h2>Uso habitual</h2><p>Contrato LAU claro, sin subarriendo opaco; incidencias con actas cuando hay ruido o convivencia compleja en fincas estrechas.</p><h2>Propietarios a distancia</h2><p>Herencias y propietarios fuera de Barcelona delegan cobro e incidencias sin dar el movil al inquilino — canal unico con gestor en Les Corts.</p>',
    perfil: 'Creativos y estudiantes cualificados en zona MACBA, familias en calles residenciales, inversores con piso ya alquilado.',
    errores: ['Pricing Gotic en Raval sur.', 'Contrato temporada encubierto.', 'Fianza no INCASOL.', 'Impago sin acta previa.', 'WhatsApp propietario-inquilino.'],
    interlink: '<a href="/vender-piso-raval-barcelona">Vender Raval</a> · <a href="/alquiler-integral-raval-barcelona">Integral Raval</a> · <a href="/administracion-alquileres-ciutat-vella">Admin Ciutat Vella (distrito)</a>.',
  },
  {
    slug: 'administracion-alquiler-guinardo-barcelona',
    barrioNombre: 'El Guinardó',
    barrioShort: 'Guinardó',
    cp: '08041',
    renta: '900–1.150 €/mes',
    precioDefault: 1020,
    image: 'imagenes/horta2.jpg',
    keyword: 'administracion alquiler guinardo barcelona',
    h1: 'Administracion de alquiler en el Guinardó: cobro e incidencias en fincas de pendiente',
    proseLocal: '<h2>Guinardó y pendiente</h2><p><strong>El Guinardó</strong> mezcla vistas, escaleras y fincas 60–70 — incidencias de humedad y ascensor requieren seguimiento. Liquidacion mensual al propietario con archivo de transferencias.</p><h2>Hospital de Sant Pau</h2><p>Personal sanitario y familias buscan estabilidad; renovaciones con indice cuando aplica tensionado.</p>',
    perfil: 'Familias, personal sanitario, teletrabajadores, propietarios herederos.',
    errores: ['Confundir Guinardo con Carmel en renta.', 'Renovacion sin preaviso LAU.', 'No domiciliar renta.', 'Incidencias ascensor sin proveedor.', 'Gestion informal sin panel.'],
    interlink: '<a href="/vender-guinardo-barcelona">Vender Guinardó</a> · <a href="/alquiler-integral-guinardo-barcelona">Integral Guinardó</a> · <a href="/administracion-alquileres-horta">Admin Horta-Guinardó (distrito)</a>.',
  },
  {
    slug: 'administracion-alquiler-montjuic-barcelona',
    barrioNombre: 'Montjuïc',
    barrioShort: 'Montjuïc',
    cp: '08004',
    renta: '880–1.100 €/mes',
    precioDefault: 990,
    image: 'imagenes/poblesec1.jpg',
    keyword: 'administracion alquiler montjuic barcelona',
    h1: 'Administracion de alquiler en Montjuïc: gestion mensual bajo la montaña',
    proseLocal: '<h2>Montjuïc y silencio</h2><p><strong>Montjuïc</strong> atrae quien prioriza espacio y calma — administracion documenta inventario en entrega por desgaste en familias largas.</p><h2>Limites con Poble-sec</h2><p>Comparables separados: misma CP no implica misma renta segun calle y ruido.</p>',
    perfil: 'Familias, parejas maduras, propietarios con piso alquilado desde el extranjero.',
    errores: ['Pricing Poble-sec en Montjuïc alto.', 'Impago tolerado.', 'No informe mensual al propietario.', 'LAU sin revision INCASOL.', 'Incidencias comunidad sin acta.'],
    interlink: '<a href="/vender-montjuic-barcelona">Vender Montjuïc</a> · <a href="/alquiler-integral-montjuic-barcelona">Integral Montjuïc</a> · <a href="/administracion-alquiler-poble-sec-barcelona">Admin Poble-sec</a>.',
  },
  {
    slug: 'administracion-alquiler-putxet-farro-barcelona',
    barrioNombre: 'El Putxet i el Farró',
    barrioShort: 'Putxet',
    cp: '08017',
    renta: '1.200–1.650 €/mes',
    precioDefault: 1420,
    image: 'imagenes/eixample2.jpg',
    keyword: 'administracion alquiler putxet farro barcelona',
    h1: 'Administracion de alquiler en Putxet i Farró: discrecion y LAU en finca señorial',
    proseLocal: '<h2>Putxet residencial</h2><p><strong>Putxet i Farró</strong> ticket alto — inquilino solvente y contrato impecable. Administracion 59 €/mes sin comision sobre renta.</p><h2>Vecindad exigente</h2><p>Mediacion en incidencias con criterio antes de escalada; renovaciones con documentacion tensionada completa.</p>',
    perfil: 'Familias consolidadas, expatriados, propietarios con segunda residencia alquilada.',
    errores: ['Pricing Sarria extrapolado mal.', 'Mobiliario de lujo no listado.', 'Renovacion sin indice.', 'Seguro hogar desactualizado.', 'Canal directo propietario-inquilino.'],
    interlink: '<a href="/alquiler-integral-putxet-farro-barcelona">Integral Putxet</a> · <a href="/administracion-alquileres-sarria">Admin Sarrià (distrito)</a> · <a href="/administracion-alquiler-vallcarca-barcelona">Admin Vallcarca</a>.',
  },
  {
    slug: 'administracion-alquiler-zona-universitaria-barcelona',
    barrioNombre: 'Zona Universitaria',
    barrioShort: 'Zona Univ.',
    cp: '08028',
    renta: '900–1.150 €/mes',
    precioDefault: 1020,
    image: 'imagenes/lescorts1.jpg',
    keyword: 'administracion alquiler zona universitaria barcelona',
    h1: 'Administracion de alquiler en la Zona Universitaria: mas alla del piso de estudiantes',
    proseLocal: '<h2>ZU y perfiles mixtos</h2><p><strong>Zona Universitaria</strong> mezcla piso familiar y demanda academica — contrato LAU de uso habitual claro. Cobro puntual e informes al propietario inversor.</p><h2>Metro y facultades</h2><p>Rotacion moderada si filtro de solvencia en alta; renovaciones documentadas.</p>',
    perfil: 'Familias Les Corts, investigadores, propietarios con varios pisos en el distrito.',
    errores: ['Contrato opaco por habitaciones.', 'Pricing Pedralbes en ZU interior.', 'Impago sin seguro.', 'No renta anterior en renovacion.', 'WhatsApp sin gestor.'],
    interlink: '<a href="/alquiler-integral-zona-universitaria-barcelona">Integral Zona Univ.</a> · <a href="/administracion-alquileres-les-corts">Admin Les Corts (distrito)</a> · <a href="/vender-les-corts">Vender Les Corts</a>.',
  },
];

const INTEGRAL = [
  {
    slug: 'alquiler-integral-raval-barcelona',
    barrioNombre: 'El Raval',
    barrioShort: 'Raval',
    cp: '08001',
    renta: '880–1.150 €/mes',
    precioDefault: 1010,
    image: 'imagenes/barcelona1.jpeg',
    keyword: 'alquiler integral raval barcelona',
    h1: 'Alquiler integral en el Raval: del anuncio al contrato con criba seria',
    proseLocal: '<h2>Captacion en Raval</h2><p><strong>El Raval</strong> genera mucho ruido en portales — criba previa y visitas filtradas ahorran fines de semana. Anuncio honesto sobre planta, ruido y orientacion.</p><h2>MACBA vs sur</h2><p>Comparables de la misma calle, no mezclar norte creativo con sur residencial en una sola renta.</p><h2>499 € fijo</h2><p>En ticket orientativo 880–1.150 €, suele compensar frente a comision clasica mas IVA.</p>',
    perfil: 'Perfiles con nomina o aval, familias estables, inquilino larga duracion fuera de temporada opaca.',
    errores: ['Anuncio generico Ciutat Vella.', 'Curiosos sin filtro.', 'Fotos enganosas en calle estrecha.', 'Contrato sin INCASOL.', 'No inventario firmado.'],
    interlink: '<a href="/administracion-alquiler-raval-barcelona">Admin Raval</a> · <a href="/vender-piso-raval-barcelona">Vender Raval</a> · <a href="/alquiler-integral-ciutat-vella">Integral Ciutat Vella (distrito)</a>.',
  },
  {
    slug: 'alquiler-integral-ciutat-meridiana-barcelona',
    barrioNombre: 'Ciutat Meridiana',
    barrioShort: 'Ciutat Meridiana',
    cp: '08033',
    renta: '750–920 €/mes',
    precioDefault: 835,
    image: 'imagenes/noubarris2.jpg',
    keyword: 'alquiler integral ciutat meridiana barcelona',
    h1: 'Alquiler integral en Ciutat Meridiana: captacion en el eje Meridiana–Torre Baró',
    proseLocal: '<h2>Ciutat Meridiana</h2><p><strong>Ciutat Meridiana</strong> ticket contenido — pack 499 € fijo vs comision suele compensar. Fotos reales y filtro de solvencia antes de visitas.</p><h2>Familias</h2><p>Demanda estable si estado y renta alineados con tensionado; informe top 3 perfiles al propietario.</p>',
    perfil: 'Familias locales, parejas jovenes, propietarios primerizos en alquiler.',
    errores: ['Pricing Nou Barris generico.', 'No mencionar ascensor.', 'Impago por mala criba.', 'LAU mal redactada.', 'Rotacion por pricing alto.'],
    interlink: '<a href="/administracion-alquiler-ciutat-meridiana-barcelona">Admin Ciutat Meridiana</a> · <a href="/administracion-alquiler-torre-baro-barcelona">Admin Torre Baró</a> · <a href="/administracion-alquileres-nou-barris">Admin Nou Barris (distrito)</a>.',
  },
  {
    slug: 'alquiler-integral-trinitat-nova-barcelona',
    barrioNombre: 'La Trinitat Nova',
    barrioShort: 'Trinitat Nova',
    cp: '08033',
    renta: '720–880 €/mes',
    precioDefault: 800,
    image: 'imagenes/noubarris3.jpg',
    keyword: 'alquiler integral trinitat nova barcelona',
    h1: 'Alquiler integral en la Trinitat Nova: del anuncio al contrato en el Turó de la Peira',
    proseLocal: '<h2>Trinitat Nova</h2><p><strong>La Trinitat Nova</strong> exige comparables locales — no mezclar con Roquetes o Meridiana en el anuncio. Visitas en franjas acordadas.</p><h2>Ticket contenido</h2><p>Criba de aval y nomina acorta plazo hasta primer ingreso; inventario en entrega reduce disputas de fianza.</p>',
    perfil: 'Familias numerosas, herencias, inversores en yield moderado.',
    errores: ['Confundir Trinitat Nova y Vella.', 'Anuncio sin fotos de cocina/bano.', 'Comision opaca.', 'Fianza en efectivo.', 'No registrar renta anterior.'],
    interlink: '<a href="/administracion-alquiler-trinitat-nova-barcelona">Admin Trinitat Nova</a> · <a href="/alquiler-integral-roquetes-barcelona">Integral Roquetes</a> · <a href="/administracion-alquiler-turo-peira-barcelona">Admin Turó de la Peira</a>.',
  },
  {
    slug: 'alquiler-integral-verneda-barcelona',
    barrioNombre: 'La Verneda i la Pau',
    barrioShort: 'La Verneda',
    cp: '08020',
    renta: '880–1.080 €/mes',
    precioDefault: 980,
    image: 'imagenes/noubarris1.jpg',
    keyword: 'alquiler integral verneda barcelona',
    h1: 'Alquiler integral en la Verneda i la Pau: inquilino estable junto a Gran Via',
    proseLocal: '<h2>La Verneda</h2><p><strong>La Verneda i la Pau</strong> concentra familias y comercio — pricing honesto por calle y estado. Pack integral con informe top 3 antes de decision del propietario.</p><h2>Gran Via</h2><p>Inquilino valora movilidad; contrato LAU claro y domiciliacion de renta.</p><h2>Entrega</h2><p>Inventario firmado y lecturas de suministros el dia de llaves evitan sorpresas al final del contrato.</p>',
    perfil: 'Familias, parejas con hijos, personal comercial de la zona.',
    errores: ['Confundir Verneda y Porta en renta.', 'Interior vs Gran Via mal priced.', 'Visitas sin preaprobacion.', 'Ignorar derrama.', '499 € no explicado.'],
    interlink: '<a href="/administracion-alquiler-verneda-barcelona">Admin La Verneda</a> · <a href="/alquiler-integral-porta-barcelona">Integral Porta</a> · <a href="/administracion-alquileres-sant-andreu">Admin Sant Andreu (distrito)</a>.',
  },
];

const adminTpl = JSON.parse(fs.readFileSync(TEMPLATE, 'utf8'));
const integralTpl = JSON.parse(fs.readFileSync(path.join(OUT, 'alquiler-integral-el-carmel-barcelona.json'), 'utf8'));

let failed = false;
ADMIN.forEach((b) => {
  const outPath = path.join(OUT, b.slug + '.json');
  if (fs.existsSync(outPath)) {
    console.error('SKIP exists', b.slug);
    failed = true;
    return;
  }
  const j = patchAdmin(adminTpl, b);
  const words = wc(j.argumento_principal);
  if (words < 360) {
    console.error('FAIL', j.slug, words, 'words');
    failed = true;
  }
  fs.writeFileSync(outPath, JSON.stringify(j, null, 2));
  console.log('Wrote', j.slug, '—', words, 'words');
});

INTEGRAL.forEach((b) => {
  const outPath = path.join(OUT, b.slug + '.json');
  if (fs.existsSync(outPath)) {
    console.error('SKIP exists', b.slug);
    failed = true;
    return;
  }
  const j = patchIntegral(integralTpl, b);
  const words = wc(j.argumento_principal);
  if (words < 360) {
    console.error('FAIL', j.slug, words, 'words');
    failed = true;
  }
  fs.writeFileSync(outPath, JSON.stringify(j, null, 2));
  console.log('Wrote', j.slug, '—', words, 'words');
});

if (failed) process.exit(1);
