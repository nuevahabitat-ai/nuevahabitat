const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const TOP = {
  'content/landings/barrio/vender-navas-barcelona.json': `<p>Navas premia transparencia sobre eslóganes: minutos a metro, estado de portal y comparables de Fabra i Puig en la misma semana de valoración. Sin venta no cobramos; con venta tu neto gana frente al porcentaje tradicional.</p>`,
  'content/landings/barrio/vender-montjuic-barcelona.json': `<h2>Resum operatiu</h2><p>Montjuïc exige filtrar comprador por pendiente, ascensor y ruido puntual de eventos. Pricing honesto con Poble-sec y Sants en paralelo acorta plazo. Panel vendedor, documentación anticipada y honorarios 3.000 € + IVA solo en escritura completan la estrategia desde Les Corts.</p><p>Valoración gratuita en veinticuatro horas laborables cuando nos envías dirección y metros útiles aproximados.</p><p>Teletrabajo híbrido: comprador valora silencio diurno en calle residencial frente a Poble-sec nocturno. Terraza con orientación sur puede justificar premium moderado si fotos muestran luz real en invierno.</p>`,
  'content/landings/barrio/vender-pedralbes-barcelona.json': `<h2>Resum operatiu</h2><p>Pedralbes demanda discreción, parking trazado y comparables con Sarrià el mismo día de visitas. Comisión fija protege neto en operaciones grandes aunque el comprador negocie fuerte. Reportaje de calidad sin comprometer seguridad.</p><p>Contacto WhatsApp en horario comercial y calendario de visitas en tus franjas, sin open house masivo en finca prime.</p><p>Jardín comunitario o vistas parcial al monasterio: argumentos de calma urbana. Comprador expatriado pregunta por colegios y tiempo en coche a Diagonal — respondemos con mapa, no con marketing genérico.</p>`,
  'content/landings/barrio/vender-trinitat-vella-barcelona.json': `<h2>Resum operatiu</h2><p>Trinitat Vella vende metros y cuota hipotecaria baja: comparables por bloque, portal en fotos reales y filtro de comprador con banco adelantado. Enlace Roquetes solo como referencia cruzada, no como pricing único.</p><p>Honorarios fijos y valoración sin compromiso desde oficina Les Corts para decidir precio de salida realista.</p><p>Inversor pregunta por rentabilidad bruta; familia pregunta por escuela y metro. Dos guiones de visita distintos según target que elijas como vendedor.</p>`,
  'content/landings/barrio/vender-vall-d-hebron-barcelona.json': `<h2>Resum operatiu</h2><p>Vall d'Hebron mezcla sanitarios, familias y vistas: no usar ticket de Horta plaza sin más. Actas de comunidad en bloques 70–80, visitas en franjas flexibles y certificado energético al día acortan camino a arras.</p><p>Guía Horta enlazada para contexto; pricing siempre por dirección concreta en Montbau o Vall d'Hebron.</p><p>Bus hacia Diagonal o L5: minutos en hora punta documentados. Comprador mayor valora ascensor operativo y acera ancha en calles en pendiente.</p>`,
  'content/landings/barrio/vender-tetuan-barcelona.json': `<h2>Resum operatiu</h2><p>Tetuan conecta Gran Via, Glòries y ticket inferior al Eixample central. Interior vs avenida define precio desde día uno. Staging ligero y certificado C ayudan banco comprador.</p><p>Comparar Fort Pienc en visitas el mismo sábado es normal: dos fichas honestas, dos salidas distintas. Precio fijo NuevaHabitat solo en escritura.</p>`,
  'content/landings/barrio/vender-sant-pere-santa-caterina-barcelona.json': `<h2>Resum operatiu</h2><p>Casco estrecho: ITE, humedad y estatutos sobre turismo antes de prometer plazo corto. Mercado Santa Caterina como ancla residencial, no turística. Herencia y separación con panel compartido.</p><p>Visitas pequeñas en escalera, comprador con financiación contrastada. Honorarios 3.000 € + IVA y valoración micro-zona Ciutat Vella.</p>`,
  'content/landings/barrio/vender-la-sagrera-barcelona.json': `<h2>Resum operatiu</h2><p>La Sagrera gana por parque, estación y familias entre Clot y Sant Andreu. Vibración en calles muy próximas a vía: transparencia en visita. Comparables Navas y Sagrera alta separados.</p><p>Calculadora neto con plusvalía e hipoteca antes de publicar. Cartera compradora y precio fijo solo si cierras en notaría.</p>`,
};

function main() {
  for (const [rel, html] of Object.entries(TOP)) {
    const file = path.join(ROOT, rel);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.argumento_principal += html.trim();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log('Topup', rel);
  }
}

main();
