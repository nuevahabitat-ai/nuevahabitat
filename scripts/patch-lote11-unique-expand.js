const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const U = {
  'content/landings/barrio/vender-bon-pastor-barcelona.json': `
<h2>Riu Besòs i transformació urbana</h2>
<p>El paseo fluvial cambia la conversación con compradores que vienen de Santa Coloma o Sant Adrià: Barcelona ciudad con hipoteca asumible. No vendemos “futuro incierto”; vendemos dirección concreta hoy.</p>`,
  'content/landings/barrio/vender-navas-barcelona.json': `
<h2>Escoles i equipaments</h2>
<p>Familias preguntan por escuelas entre Navas y Congrés: mapa honesto sin ranking inventado. Parque de la Pegaso u otros equipamientos según calle real.</p>`,
  'content/landings/barrio/vender-montjuic-barcelona.json': `
<h2>Piscina municipal i vida esportiva</h2>
<p>Comprador activo valora instalaciones deportivas del monte. Tiempo en bus a Plaça Espanya documentado si no hay metro a pie.</p>`,
  'content/landings/barrio/vender-pedralbes-barcelona.json': `
<h2>Monestir i entorn verd</h2>
<p>Proximidad al monasterio aporta calma; tráfico en Diagonal alta no. Comprador elige calle según equilibrio jardín-desplazamiento.</p>`,
  'content/landings/barrio/vender-trinitat-vella-barcelona.json': `
<h2>Metro Trinitat Nova i bus</h2>
<p>Conexión L4 y buses hacia centro: minutos en hora punta medidos sin optimismo. Ticket bajo exige comprador con banco ya adelantado.</p>`,
  'content/landings/barrio/vender-vall-d-hebron-barcelona.json': `
<h2>Facultat i estudiantat</h2>
<p>Algunos pisos rotan con estancias de estudiantes de salud: filtro según contrato vigente o entrega vacía. Distribución 4 habitaciones pequeñas vs 3 grandes define target.</p>`,
  'content/landings/barrio/vender-tetuan-barcelona.json': `
<h2>Encants i mercat</h2>
<p>Proximidad a Encants y Glòries: comprador creativo valora mix urbano. Ruido de mercado los lunes: transparencia si afecta tu calle.</p>`,
  'content/landings/barrio/vender-sant-pere-santa-caterina-barcelona.json': `
<h2>Disseny i botigues de barri</h2>
<p>Comercio de diseño y talleres conviven con vecinos de toda la vida. Comprador busca autenticidad, no planta baja para bar.</p>`,
  'content/landings/barrio/vender-la-sagrera-barcelona.json': `
<h2>Camp de l'Arpa proper</h2>
<p>Límite con Camp de l'Arpa: comparables cruzados solo cuando la finca lo pide. Comprador distingue “cerca del Clot” de “cerca del parque”.</p>`,
};

function main() {
  for (const [rel, html] of Object.entries(U)) {
    const file = path.join(ROOT, rel);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.argumento_principal += html.trim();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log('Unique', rel);
  }
}

main();
