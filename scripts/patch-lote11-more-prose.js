/**
 * Segunda pasada de prosa lote 11 (≥650 palabras cada landing).
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const MORE = {
  'content/landings/barrio/vender-bon-pastor-barcelona.json': `
<h2>Historial industrial i habitatge mixt</h2>
<p>Bon Pastor conserva trazas de barrio obrero junto al río: casas bajas, patios y vecindad que no aparece en fotos de stock de “Barcelona moderna”. Comprador que viene de alquiler en Sant Adrià o Santa Coloma busca sentir municipio Barcelona con cuota contenida; vendedor que compara con precios de la Dreta de l'Eixample se frustra en negociación. Nuestra valoración separa manzana a manzana.</p>
<p>Promociones más recientes cerca de la Maquinista atraen familias que priorizan supermercado y cine sobre postal turística. Si tu piso está en bloque con ascensor reformado, el ticket puede acercarse al techo del rango; sin ascensor en tercera, el comprador exige descuento desde el anuncio, no en la última semana.</p>
<h2>Arras, plusvàlua i timing</h2>
<p>Plusvalía municipal en ticket de 285.000 € puede sorprender si no se calcula antes de fijar precio neto deseado. Panel vendedor muestra ofertas brutas y ayuda a comparar con deuda hipotecaria pendiente. Arras con condición suspensiva de hipoteca al 85% es estándar: filtramos comprador sin preaprobación para no perder sábados.</p>
<p>Enlace útil: <a href="/vender-piso-rapido-barcelona">vender rápido</a> cuando el calendario es ajustado por herencia o traslado laboral fuera del área metropolitana.</p>`,
  'content/landings/barrio/vender-navas-barcelona.json': `
<h2>Meridiana, busos i soroll</h2>
<p>Navas vive con la Meridiana de fondo en muchas fincas. Comprador informado pregunta por ventanas y doble acristalamiento; vendedor que oculta ruido pierde arras cuando el comprador trae decibelímetro o simplemente visita a las ocho de la tarde un martes laborable. Precio honesto desde publicación evita regateo de 15.000 € en notaría.</p>
<p>Distribución 3 habitaciones reales (dormitorios con ventana y armario empotrado) compite mejor que “dos más estudio” en Navas: familia joven con hijo pequeño no negocia eternamente si el plano es claro. Fotos de pasillos y cocina con medidas orientativas ayudan.</p>
<h2>Comparables Fabra i Puig</h2>
<p>Idealista etiqueta “Sant Andreu” y mezcla Navas con Bon Pastor. Usamos cierres y visitas cualificadas en calles paralelas a Fabra i Puig, no con anuncios del Clot a 4.800 €/m². Calculadora 6% vs 3.630 € fijos sobre 310.000 €: argumento que muchos vendedores no ven hasta comparar tres agencias.</p>
<p>Coordinación con <a href="/inmobiliaria-precio-fijo-barcelona">precio fijo Barcelona</a> para entender honorarios antes de firmar mandato.</p>`,
  'content/landings/barrio/vender-montjuic-barcelona.json': `
<h2>Accessibilitat i gent gran</h2>
<p>Montjuïc atrae parejas maduras que buscan silencio; también compradores mayores que no aceptan escaleras sin fin. Sin ascensor en planta cuarta, filtramos visitas antes de agendar. Planta baja con terraza y orientación sur puede captar premium moderado frente a interior húmedo en pendiente.</p>
<p>Aparcamiento en calle en zona residencial: comprador con coche pregunta por zona azul, vecindario y distancia al metro Paral·lel o espacios en Poble-sec. Cuantificamos minutos reales caminando, no “cinco minutos” genéricos.</p>
<h2>Fira, esdeveniments i estacionalitat</h2>
<p>Algunas calles notan tráfico en fechas de Fira o eventos en el anillo de Montjuïc. Transparencia en ficha comercial evita reclamaciones post-visita. Verano sin ascensor: comprador pregunta por ventilación cruzada; fotos en julio cuando la brisa es argumento de venta.</p>
<p>Contexto Sants: <a href="/vender-sants">vender en Sants</a> para compradores que comparan distrito entero el mismo fin de semana.</p>`,
  'content/landings/barrio/vender-pedralbes-barcelona.json': `
<h2>Operacions patrimonials i fiscalitat</h2>
<p>Pedralbes concentra operaciones con planificación patrimonial: usufructo, sociedad, o comprador extranjero con NIE en trámite. No prometemos escritura en treinta días si hay cancelación registral compleja; sí calendario realista con abogado en copia cuando hace falta.</p>
<p>Plusvalía y transmisiones en ticket alto: comprador y vendedor consultan asesor. Nos centramos en pricing de mercado y neto tras comisión fija: sobre 720.000 €, diferencia con 6% supera 40.000 € que pueden financiar reforma en nueva vivienda o aportación a herederos.</p>
<h2>Comparativa Sarrià el mateix dissabte</h2>
<p>Mismo comprador visita Sarrià village y Pedralbes en secuencia. Argumentos: colegio, minutos a Diagonal, parking doble, calidad de portal. Reportaje sin exponer alarmas; visitas concertadas, no open house masivo que quema exclusividad percibida en prime.</p>
<p>Segunda residencia: <a href="/vender-segunda-residencia-barcelona">guía segunda residencia</a> si el uso no era habitual.</p>`,
  'content/landings/barrio/vender-trinitat-vella-barcelona.json': `
<h2>Grandes conjunts i comunitats</h2>
<p>Trinitat Vella es síntesis de conjunto residencial grande: portal, ascensor comunitario y percepción de seguridad preguntada sin rodeos. Comprador joven compara cuota hipotecaria con alquiler en mismo bloque; vendedor debe mostrar IBI, comunidad y comparables de cierre en el edificio, no solo en portal web.</p>
<p>Piso 90 m² mal distribuido vs 75 m² bien planteado: plano en PDF evita diez visitas de quien necesita tres dormitorios cerrados. Inversor pregunta por rentabilidad bruta; usuario final pregunta por escuela y metro Trinitat Nova.</p>
<h2>Roquetes, Bon Pastor i filtre de preu</h2>
<p>Misma búsqueda “Barcelona barato” mezcla Trinitat, Roquetes y Bon Pastor. Pricing por bloque evita anuncio estancado seis meses. Enlace <a href="/vender-piso-hipoteca-pendiente-barcelona">hipoteca pendiente</a> cuando el vendedor aún cancela deuda.</p>
<p>Venta económica distrito: <a href="/venta-piso-economica-nou-barris-barcelona">Nou Barris económica</a>.</p>`,
  'content/landings/barrio/vender-vall-d-hebron-barcelona.json': `
<h2>Campus, guàrdies i horaris de visita</h2>
<p>Profesional sanitario en guardia no puede visitar pisos entre semana a mediodía. Ofrecemos franjas tarde-noche y sábado cuando el vendedor acepta. Proximidad caminando al hospital es ventaja para residente; para otros compradores puede ser objeción de ambulancias — honestidad por calle concreta.</p>
<p>Montbau en pendiente: ascensor averiado paraliza operación en bloque de 120 viviendas. Actas de comunidad y presupuesto de reparación antes de visitas con banco al 90%.</p>
<h2>Horta, Guinardó i Collserola</h2>
<p>Vall d'Hebron no es Horta plaza del mercado ni Guinardó teatro: comparables propios. Vista parcial Collserola en terraza orientada oeste: premium moderado; interior húmedo en planta baja: descuento en precio publicado.</p>
<p>Artículo relacionado: <a href="/blog/vender-piso-horta-guia">guía Horta-Guinardó</a> para contexto de distrito.</p>`,
  'content/landings/barrio/vender-tetuan-barcelona.json': `
<h2>Glòries, Gran Via i perfil professional</h2>
<p>Tetuan vende minutos a oficinas Glòries y conexión Gran Via sin ticket Eixample Dreta. Comprador híbrido teletrabaja tres días: valora bici por carril o metro Marina/Bogatell según calle. Interior de manzana tranquilo vs fachada a avenida: dos precios de salida distintos el mismo día.</p>
<p>Encants y mercado los lunes: si tu balcón mira al aparcamiento del mercado, dilo. Comprador creativo puede ver ventaja urbana; familia con bebé puede rechazar — filtro honesto en anuncio.</p>
<h2>Fort Pienc, Eixample i Sant Martí</h2>
<p>Etiqueta administrativa Sant Martí, comparables mixtos con Fort Pienc y Eixample esquerra. Reforma cocina abierta y certificado C aceleran banco comprador. Staging ligero (pintura neutra, retirar muebles voluminosos) mejora reportaje sin obra mayor.</p>
<p>Distrito: <a href="/vender-sant-marti">vender en Sant Martí</a>.</p>`,
  'content/landings/barrio/vender-sant-pere-santa-caterina-barcelona.json': `
<h2>Casco estrecho, ITE y humedades</h2>
<p>Sant Pere y Santa Caterina exigen due diligence de humedad en planta baja y semi-sótano. Informe y presupuesto de solución antes de visitas financiadas: ocultar mancha en techo solo retrasa arras tres semanas. ITE desfavorable en finca protegida: comprador con abogado exige descuento o condición suspensiva de obras.</p>
<p>Escalera estrecha: visitas en grupos pequeños, no siete personas subiendo a la vez. Comprador residente valora mercado Santa Caterina a pie; no confundir con precio Born turístico si tu piso es interior sin luz.</p>
<h2>Born, Gòtic i Ciutat Vella</h2>
<p>Enlaces cruzados: <a href="/vender-piso-born-barcelona">Born</a>, <a href="/vender-piso-gotic-barcelona">Gòtic</a>, <a href="/vender-piso-ciutat-vella-barcelona">Ciutat Vella</a>. Normativa alquiler turístico en estatutos: no prometemos licencia si comunidad lo prohíbe.</p>
<p>Herencia entre hermanos en piso del casco: panel único de ofertas y plazos alineados.</p>`,
  'content/landings/barrio/vender-la-sagrera-barcelona.json': `
<h2>Estació, parc i famílies</h2>
<p>La Sagrera combina interés por Parc de la Sagrera, estación AVE/Rodalies y familias que no pagan ticket Clot céntrico. Comprador pendular pregunta por frecuencia tren y vibración en edificios muy próximos a vía: visita en horario de paso si la calle lo requiere.</p>
<p>Sagrera alta vs calles más próximas a Navas: dos tickets en código postal 08027. Comparables por manzana, no media Sant Andreu. Enlace <a href="/vender-navas-barcelona">Navas</a> cuando comprador compara el domingo.</p>
<h2>Clot, Camp de l'Arpa i urbanisme</h2>
<p>Obra urbana delante del edificio: indicar en ficha antes de arras. Límite Camp de l'Arpa: comparables cruzados solo si finca lo exige. Guía combo: <a href="/vender-el-clot-la-sagrera-barcelona">El Clot</a> como referencia, landing Sagrera para buscador explícito “La Sagrera”.</p>
<p>Calculadora honorarios sobre 335.000 €: 6% supera 20.000 €; precio fijo 3.630 € total protege neto si comprador negocia bien.</p>`,
};

function main() {
  for (const [rel, html] of Object.entries(MORE)) {
    const file = path.join(ROOT, rel);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.argumento_principal += html.trim();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log('More', rel);
  }
}

main();
