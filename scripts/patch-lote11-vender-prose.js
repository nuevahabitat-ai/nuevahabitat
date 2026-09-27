/**
 * Amplía argumento_principal lote 11 vender (≥650 palabras).
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const EXTRA = {
  'content/landings/barrio/vender-bon-pastor-barcelona.json': `
<h2>Casal de barri i veïnat</h2>
<p>El casal de barrio y las fiestas locales anclan identidad que Idealista no captura. Comprador que viene de alquiler en Sant Adrià valora sentir “Barcelona ciudad” sin ticket de la Verneda alta. Si tu piso tiene patio compartido o acceso a plaza pequeña, conviene medirlo en la visita.</p>
<p>Venta entre hermanos tras herencia de los padres en el mismo bloque: centralizamos ofertas para evitar malentendidos. Plazo de arras alineado con hipoteca al 85% es habitual en este ticket.</p>
<h2>Neto després de comissió variable</h2>
<p>Sobre 285.000 €, restar plusvalía municipal, hipoteca pendiente y más de 17.000 € de comisión al 6% deja un neto que muchos vendedores no calculan hasta tarde. El precio fijo 3.000 € + IVA solo en escritura ordena la conversación desde el primer café en Les Corts.</p>`,
  'content/landings/barrio/vender-navas-barcelona.json': `
<h2>Congrés i Fabra i Puig</h2>
<p>Comprador que trabaja en Congrés o en polígonos de la Meridiana mide bus 19 y metro en hora punta. Si tu piso está a siete minutos de Fabra i Puig, dilo; si está a quince, no uses “metro al lado”.</p>
<p>Piso con office real (puerta y ventana) atrae teletrabajo híbrido post-2024. Plano con medidas evita visitas de quien necesita tres dormitorios cerrados.</p>
<h2>Calculadora i portal</h2>
<p>Si ya publicas en portal, revisamos título y fotos para que digan Navas, no solo Sant Andreu. Pricing A/B con visitas cualificadas, no con curiosos sin banco.</p>`,
  'content/landings/barrio/vender-montjuic-barcelona.json': `
<h2>Telefèric, MNAC i turisme de passada</h2>
<p>Montjuïc convive con turismo de día; comprador residente pregunta si el verano es soportible en su calle concreta. Visitas en sábado de primavera y tarde de julio cuando la orientación lo exige.</p>
<p>Piso con terraza orientada al puerto puede captar premium moderado; interior hacia patio de manzana en pendiente necesita precio distinto desde la publicación.</p>
<h2>Font de la Guatlla i límits</h2>
<p>Algunas direcciones rozan Font de la Guatlla o Sants: comparables por portal, no por intuición. Enlace traslado laboral si vendes por mudanza fuera de Barcelona.</p>`,
  'content/landings/barrio/vender-pedralbes-barcelona.json': `
<h2>Colegis i expatriats</h2>
<p>Familias expatriadas comparan distancia a colegios internacionales y tiempo en coche a Diagonal. Parking doble o trastero grande puede ser la objeción resuelta antes de la segunda visita.</p>
<p>Operación con usufructo o nuda propiedad: abogado en la mesa desde la oferta. No prometemos plazos de escritura imposibles si hay cancelación registral compleja.</p>
<h2>Reportatge i privacitat</h2>
<p>Fotografía de calidad sin enseñar sistemas de alarma. Visitas en franjas, máximo dos operaciones serias en paralelo para no quemar el activo en prime.</p>`,
  'content/landings/barrio/vender-trinitat-vella-barcelona.json': `
<h2>Baró de Viver i percepció</h2>
<p>Trinitat Vella comparte búsquedas con Baró de Viver en algunos filtros de portal: separamos comparables por bloque y año de construcción. Comprador joven pregunta por equipamientos y conexión metro Trinitat Nova.</p>
<p>Piso de 95 m² en conjunto grande puede ser la alternativa a piso caro pequeño en Gràcia: enseñar distribución honesta acorta negociación.</p>
<h2>Inversió lloguer</h2>
<p>Rentabilidad bruta atractiva en ticket bajo: visitas solo inversor con liquidez o preaprobación clara. Contrato vigente explicado en anuncio.</p>`,
  'content/landings/barrio/vender-vall-d-hebron-barcelona.json': `
<h2>Recerca i rotació professional</h2>
<p>Residentes del campus valoran poder caminar al hospital en guardia. Horarios de visita flexibles y discreción en portal (sin anunciar “frente a urgencias” si genera objeciones de ruido de ambulancias en calle concreta).</p>
<p>Montbau en pendiente: comprador mayor pregunta por ascensor y acera. Planta baja con jardín comunitario puede ser nicho familiar.</p>
<h2>Collserola i qualitat de l'aire</h2>
<p>Orientación norte fresca en verano; sur con ventilación cruzada. Fotos en hora dorada cuando hay vista parcial a Collserola.</p>`,
  'content/landings/barrio/vender-tetuan-barcelona.json': `
<h2>Can Dragó i esport</h2>
<p>Familias con hijos en escuelas de zona valoran polideportivo y parques. No inflamos precio como Eixample Dreta; Tetuan vende conexión Gran Via-Glòries con ticket contenido.</p>
<p>Obra en calle por remodelación urbana: indicarlo en ficha. Comprador informado agradece transparencia antes de arras.</p>
<h2>Staging lleuger</h2>
<p>Pintura gris claro y retirar muebles voluminosos en salón estrecho: mejora fotos sin obra mayor. Certificado energético C o mejor acelera banco comprador.</p>`,
  'content/landings/barrio/vender-sant-pere-santa-caterina-barcelona.json': `
<h2>Plaça de la Catedral i límits</h2>
<p>Distancia caminando a la catedral no convierte tu piso en “postal turística” si es interior. Comprador residente busca mercado y plazas tranquilas, no souvenir shop en portal.</p>
<p>Humedad en planta baja: informe y presupuesto de solución antes de visitas con financiación. Ocultar mancha en techo solo retrasa arras.</p>
<h2>Community of owners petita</h2>
<p>Escalera estrecha: una vecina conflictiva puede ser tema en visita. Actas y acuerdos de comunidad disponibles para comprador serio.</p>`,
  'content/landings/barrio/vender-la-sagrera-barcelona.json': `
<h2>Meridianes i Sagrera alta</h2>
<p>Sagrera alta vs calles más próximas al Clot: tickets distintos en la misma búsqueda “08027”. Comparables de cierre en tu manzana, no media del distrito.</p>
<p>Comprador AVE pregunta por frecuencia y vibración en edificios muy próximos a vía: visita en horario de paso de tren si es necesario.</p>
<h2>Pairing amb Navas</h2>
<p>Mismo comprador compara Navas y Sagrera el domingo: dos fichas honestas, dos precios de salida distintos. Panel único si vendes dos activos familiares.</p>`,
};

function main() {
  for (const [rel, html] of Object.entries(EXTRA)) {
    const file = path.join(ROOT, rel);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.argumento_principal = (data.argumento_principal || '') + html.trim();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log('Patched', rel);
  }
}

main();
