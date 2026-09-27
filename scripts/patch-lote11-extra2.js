const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const E2 = {
  'content/landings/barrio/vender-montjuic-barcelona.json': `<p>Hostafrancs y la frontera con Sants compiten en mapa mental del comprador: si tu dirección roza plaza de Sants, lo indicamos en ficha para visitas ordenadas. Calculadora de neto con plusvalía municipal incluida en conversación inicial evita sorpresa en notaría.</p>`,
  'content/landings/barrio/vender-pedralbes-barcelona.json': `<p>Chalet adosado vs piso en torre: dos mercados dentro de Pedralbes. Trastero grande y plaza doble pueden mover la operación más que diez m² extra en salón. Cancelación hipoteca vendedor coordinada con banco comprador en panel.</p>`,
  'content/landings/barrio/vender-trinitat-vella-barcelona.json': `<p>Baró de Viver en búsquedas de portal: no mezclar comparables. Metro L4 y buses nocturnos cuantificados para comprador que trabaja en turnos. Pintura neutra pre-reportaje en ticket bajo suele tener mejor ROI que reforma mayor.</p>`,
  'content/landings/barrio/vender-vall-d-hebron-barcelona.json': `<p>Camp de l'Arpa próximo en mapa: pricing cruzado solo si finca lo exige. Investigadores y residentes rotativos: contrato vigente explicado. Derrama fachada en bloque 70–80: presupuesto visible antes de arras.</p>`,
  'content/landings/barrio/vender-tetuan-barcelona.json': `<p>Obra en calle por remodelación urbana: indicar en anuncio. Comprador corporativo Glòries valora minutos caminando real. Derrama ascensor: actas PDF. Neto tras 3.630 € fijos vs comisión variable sobre precio negociado final.</p>`,
  'content/landings/barrio/vender-sant-pere-santa-caterina-barcelona.json': `<p>Elementos originales bien conservados vs reforma genérica: asesoramos antes de reportaje. Plaça de la Catedral cerca no convierte interior oscuro en premium Born. Ofertas trazables en panel para herederos.</p>`,
  'content/landings/barrio/vender-la-sagrera-barcelona.json': `<p>Camp de l'Arpa límite: comparables honestos. Comprador AVE pregunta frecuencia; visita en horario tren si calle lo requiere. Dos activos familia Navas+Sagrera: dos pricing, panel opcional unificado.</p>`,
};

function main() {
  for (const [rel, html] of Object.entries(E2)) {
    const file = path.join(ROOT, rel);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.argumento_principal += html.trim();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log('E2', rel);
  }
}

main();
