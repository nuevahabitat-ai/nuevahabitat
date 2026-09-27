const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const E4 = {
  'content/landings/barrio/vender-trinitat-vella-barcelona.json': `<p>Comparables por bloque evitan anuncio estancado. Filtramos curiosos sin preaprobación. Enlace venta económica Nou Barris para contexto de ticket de entrada en Barcelona ciudad.</p>`,
  'content/landings/barrio/vender-vall-d-hebron-barcelona.json': `<p>Sanitarios en guardia: visitas tarde-noche posibles. Montbau pendiente: ascensor operativo imprescindible para comprador mayor. Informe valoración con comparables Montbau y Vall en misma semana.</p>`,
  'content/landings/barrio/vender-tetuan-barcelona.json': `<p>Profesional Glòries compara Tetuan y Fort Pienc: dos salidas distintas mismo sábado. Certificado energético C acelera banco. Panel vendedor centraliza ofertas y documentos comunidad.</p>`,
  'content/landings/barrio/vender-sant-pere-santa-caterina-barcelona.json': `<p>Born turístico no es pricing automático para interior Sant Pere. Estatutos turismo revisados antes de prometer rentabilidad inversor. Herencia: panel compartido herederos.</p>`,
  'content/landings/barrio/vender-la-sagrera-barcelona.json': `<p>Clot céntrico ticket superior: no mezclar. AVE vibración: visita horario tren si aplica. Cartera Sant Andreu activada con precio alineado tasación típica barrio.</p>`,
};

function main() {
  for (const [rel, html] of Object.entries(E4)) {
    const file = path.join(ROOT, rel);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.argumento_principal += html.trim();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }
}

main();
