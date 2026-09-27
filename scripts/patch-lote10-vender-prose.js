/**
 * Amplía argumento_principal lote 10 vender (≥650 palabras).
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const EXTRA = {
  'content/landings/barrio/vender-camp-den-grassot-barcelona.json': `
<h2>Mercat de Grassot i teixit comercial</h2>
<p>El mercado de Grassot ancla compradores que quieren vivir en Gràcia sin pagar plaza del Sol. Si tu piso está a diez minutos del mercado, conviene decirlo con claridad: reduce objeciones de “zona anónima” cuando el visitante viene de alquiler en Eixample.</p>
<p>Comercios de proximidad, farmacia y paradas de bus hacia el Coll completan el mapa. No inflamos precio como si fueras la Vila; vendemos finca concreta con comparables de Joanic y calles paralelas.</p>
<h2>Herència, separació i diversos titulars</h2>
<p>Venta entre hermanos o pareja en separación: panel con ofertas visibles para todos. Plazos de arras alineados con comprador financiado al 80–90%.</p>
<p>Enlace con <a href="/vender-piso-separacion-divorcio-barcelona">venta por separación</a> cuando el calendario es sensible.</p>
<h2>Fotos, luz y estacionalidad</h2>
<p>Grassot tiene calles con sol de tarde excelente y otras en hoya. Fotos en invierno y verano cuando la orientación lo merece. Comprador inteligente pregunta por luz en diciembre.</p>
<p>Evitamos fotos de stock: dormitorios, cocina y terraza con medidas orientativas si ayudan a decidir.</p>
<h2>Neto al vendedor y gastos</h2>
<p>Antes de publicar: hipoteca pendiente, plusvalía municipal, comunidad al día. Sobre 420.000 €, ahorrar más de 22.000 € en comisión frente al 6% puede financiar mudanza o pintura pre-entrega.</p>
<p>Cobramos honorarios solo si cierras en notaría. Valoración gratuita en veinticuatro horas laborables.</p>`,
  'content/landings/barrio/vender-la-bordeta-barcelona.json': `
<h2>Equipaments i escoles</h2>
<p>Familias con niños preguntan por escuelas y parques entre La Bordeta y Magòria. Respondemos con mapa honesto, no ranking inventado de “mejor barrio”.</p>
<p>Obra en calle: si hay zanja prevista del ayuntamiento, lo indicamos antes de visitas para negociaciones limpias.</p>
<h2>Inversor frente a usuari final</h2>
<p>Piso alquilado con contrato estable: visitas solo inversor solvente. Piso vacío para familia: pintura y entrega rápida pueden cerrar arras en la misma semana.</p>
<p>Filtramos curiosos sin preaprobación hipotecaria para no perder sábados.</p>
<h2>Calculadora 6% vs precio fijo</h2>
<p>En tickets de 340.000 € la diferencia entre comisión variable y 3.000 € + IVA es argumento que muchos vendedores no calculan hasta tarde. Lo mostramos en la primera conversación.</p>
<p>Panel digital: visitas, ofertas y documentos en un solo lugar. WhatsApp con Daniel o Sebastián desde Les Corts.</p>
<h2>Encadenar venda i compra</h2>
<p>Si compras después en otro barrio de Barcelona o en área metropolitana, revisamos plazos para no pagar doble alquiler meses extra. <a href="/vender-piso-traslado-barcelona">Traslado</a> cuando el destino ya está elegido.</p>`,
  'content/landings/barrio/vender-provencals-del-poblenou-barcelona.json': `
<h2>Grandes manzanas y portal</h2>
<p>En bloques extensos de Provençals, la primera impresión es portal y ascensor. Una derrama anunciada puede tumbar operación al 90% de hipoteca. Pedimos actas antes de agendar visitas serias.</p>
<p>Planta baja con comercio: visita con oído atento; comprador teletrabaja agradece transparencia.</p>
<h2>Parking i traster</h2>
<p>Plaza de garaje y trastero incluidos mueven miles de euros. Si vendes sin plaza, descuento desde publicación. Revisamos titularidad de parking separado.</p>
<h2>Competir amb anuncis de portal</h2>
<p>Muchos vendedores ya están en Idealista con precio optimista. Revisamos pricing y activamos cartera sin obligarte a retirar otras vías el primer mes.</p>
<p>Compradores cualificados: hipoteca preaprobada o liquidez acreditada antes de la primera visita.</p>
<h2>Documentació abans de publicar</h2>
<p>Certificado energético, nota simple, cédula, actas. Subida al panel vendedor para comprador financiado.</p>
<p>Honorarios 3.000 € + IVA solo en escritura. Sin venta, sin factura de agencia.</p>`,
  'content/landings/barrio/vender-el-besos-barcelona.json': `
<h2>Primera vivenda i hipoteca</h2>
<p>El Besòs vive de comprador primerizo con hipoteca al 80–90%. Si el precio está por encima de tasación bancaria, la operación cae aunque el vendedor acepte. Alineamos salida con cierres reales del barrio.</p>
<p>Comparación honesta con Badalona limítrofe: metros, finca y minutos a trabajo pesan más que código postal “Barcelona”.</p>
<h2>Grans habitatges familiars</h2>
<p>Pisos de 85–95 m² con tres dormitorios: enseñar distribución completa. Comprador compara con La Verneda el mismo sábado.</p>
<h2>Millores urbanes sense promeses buides</h2>
<p>Explicamos equipamientos y transporte con datos. Transparencia acorta plazo aunque el ticket sea contenido.</p>
<h2>Panel, visites i WhatsApp</h2>
<p>Calendario en tus franjas. Ofertas trazables. Daniel o Sebastián en Mejía Lequerica 42.</p>
<h2>Venda amb lloguer o herència</h2>
<p>Casos con inquilino o herederos: estrategia distinta. Enlaces <a href="/vender-piso-alquilado-barcelona">piso alquilado</a> y <a href="/vender-piso-herencia-barcelona">herencia</a> cuando aplica.</p>
<p>Valoración gratuita sin compromiso en 24 h laborables.</p>`,
  'content/landings/barrio/vender-roquetes-barcelona.json': `
<h2>Nou Barris i percepció del comprador</h2>
<p>Roquetes sufre etiquetas genéricas de “Nou Barris lejano”. Cuantificamos minutos en metro L3 hasta destino habitual del comprador: muchas familias aceptan trayecto a cambio de metros interiores y precio.</p>
<p>Comparar con L’Hospitalet el mismo fin de semana: si tu finca gana en ascensor o comunidad, demuéstralo en visita.</p>
<h2>Plantes altes sense ascensor</h2>
<p>Descuento coherente desde día uno. Filtramos compradores que no aceptan escaleras. Mejor descartar en portal que perder arras.</p>
<h2>Comunitat i ITE</h2>
<p>Bloques de los 60–70: portal, ascensor y derramas. Documentación antes de visitas con banco.</p>
<h2>Preu fix i estalvi</h2>
<p>3.000 € + IVA solo en escritura. Sobre 265.000 € el 6% supera 15.000 € solo en comisión.</p>
<h2>Següent pas</h2>
<p>Formulario con dirección aproximada y estado interior. Respuesta en 24 h con plan realista para Roquetes.</p>`,
  'content/landings/barrio/vender-sagrada-familia-barcelona.json': `
<h2>Carrer concret i orientació</h2>
<p>Dos calles a cien metros de la basílica no comparten precio: ruido, orientación y estado de finca mandan. Valoración micro-zona, no “Sagrada Família” genérico en titular.</p>
<p>Patio de manzana vs fachana: luz distinta, ticket distinto. Visitas en horario turístico y en horario laboral cuando hace falta.</p>
<h2>Comprador internacional</h2>
<p>Plazos NIE, cuenta y banco: coordinamos con comprador solvente de cartera. No prometemos rentabilidad turística sin revisar estatutos.</p>
<h2>Reforma i elements originals</h2>
<p>Suelo de mosaico, molduras y altura de techo: premium si están bien conservados. Cocina sin reforma compite mal en la misma calle.</p>
<h2>Comunitat en finca gran</h2>
<p>Derramas de fachada o ascensor antiguo: actas antes de arras. Comprador financiado agradece paquete documental completo.</p>
<h2>Honoraris fixos des de Les Corts</h2>
<p>3.000 € + IVA solo en escritura. Sobre 485.000 € ahorras más de 26.000 € frente al 6% tradicional.</p>
<p>Valoración gratuita, visitas en tus franjas y compradores filtrados por solvencia.</p>`,
};

const COMMON = `
<h2>Estrategia comercial honesta</h2>
<p>Vender bien no es publicar al precio más alto del portal y esperar. Es alinear finca, documentación y comprador correcto desde la primera semana. Revisamos contigo comparables de cierre — no anuncios inflados — y definimos techo de negociación antes de abrir visitas masivas.</p>
<p>Si ya tienes anuncio activo, auditamos fotos, titular y descripción: muchos pisos en Barcelona pierden leads por reportajes incompletos o por mezclar barrios en la etiqueta geográfica.</p>
<h2>Visitas en franjas reales</h2>
<p>Tú eliges mañanas, tardes o sábados. Solo entran compradores con hipoteca preaprobada o liquidez contrastada. Así no pierdes tiempo con curiosos que no pueden cerrar a tu precio.</p>
<p>WhatsApp directo con Daniel o Sebastián desde la oficina de Les Corts: Mejía Lequerica 42. Respuesta en horario comercial, sin call center anónimo.</p>
<h2>Panel vendedor y trazabilidad</h2>
<p>Ofertas, documentos, calendario y estado del expediente en panel digital. Útil si sois varios herederos o si quieres comparar postores con datos, no con memoria de conversaciones sueltas.</p>
<p>Honorarios fijos 3.000 euros más IVA únicamente en escritura si vendes. Sin cierre, sin factura de agencia. Calculadora de ahorro frente al seis por ciento incluida en la landing.</p>`;

const TAIL = {
  'content/landings/barrio/vender-camp-den-grassot-barcelona.json':
    '<p>En Camp d\'en Grassot, el comprador suele llegar después de descartar la Vila por precio: tu ventaja son metros y terraza si los tienes; nuestra ventaja es explicarlo sin confundir barrios.</p>',
  'content/landings/barrio/vender-la-bordeta-barcelona.json':
    '<p>La Bordeta compite con Hostafrancs y Sants en la misma búsqueda: diferenciamos tu finca por ruido, ascensor y estado de comunidad en la primera visita.</p>',
  'content/landings/barrio/vender-provencals-del-poblenou-barcelona.json':
    '<p>Provençals del Poblenou es puente entre Verneda y Poblenou: pricing honesto evita meses de estancamiento con curiosos que buscaban otra tipología.</p>',
  'content/landings/barrio/vender-el-besos-barcelona.json':
    '<p>El Besòs recompensa al vendedor paciente con precio realista: comprador primerizo con financiación cerrada cierra si la tasación encaja.</p>',
  'content/landings/barrio/vender-roquetes-barcelona.json':
    '<p>Roquetes premia pisos bien explicados: distribución, metro L3 y comunidad al día acortan plazo en tickets contenidos.</p>',
  'content/landings/barrio/vender-sagrada-familia-barcelona.json':
    '<p>Junto al templo, la transparencia sobre ruido y finca antigua evita arras rotas: visitamos contigo con criterio de comprador residente, no solo inversor.</p>',
};

for (const [rel, html] of Object.entries(EXTRA)) {
  const p = path.join(ROOT, rel);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  let prose = (j.argumento_principal || '').trim() + html;
  if (!prose.includes('Estrategia comercial honesta')) {
    prose += COMMON + (TAIL[rel] || '');
  }
  j.argumento_principal = prose;
  fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`, 'utf8');
  console.log('Patched', rel);
}
