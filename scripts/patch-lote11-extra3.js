const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const E3 = {
  'content/landings/barrio/vender-montjuic-barcelona.json': `<p>Daniel o Sebastián coordinan visitas en franjas amplias incluido sábado cuando el vendedor lo permite. Sin venta no hay honorarios de agencia; con venta el neto mejora frente al porcentaje clásico sobre precio final negociado.</p>`,
  'content/landings/barrio/vender-pedralbes-barcelona.json': `<p>Valoración presencial en Pedralbes respeta privacidad: cita concertada, comparables Sarrià y Les Corts alta en el mismo informe. Mandato flexible sin exclusiva de doce meses cuando el vendedor ya publica en portal.</p>`,
  'content/landings/barrio/vender-trinitat-vella-barcelona.json': `<p>Oficina Les Corts en Mejía Lequerica 42: valoración gratuita veinticuatro horas laborables. WhatsApp horario comercial para dudas de comunidad o timing de arras con hipoteca compradora al ochenta por ciento.</p>`,
  'content/landings/barrio/vender-vall-d-hebron-barcelona.json': `<p>Collserola en terraza: fotos hora dorada. Interior húmedo: descuento publicado. Cartera compradora Horta-Guinardó activada si precio encaja preaprobación bancaria típica del barrio.</p>`,
  'content/landings/barrio/vender-tetuan-barcelona.json': `<p>Marina y Bogatell en cronómetro: honestidad en ficha. Encants lunes: transparencia si afecta balcón. Precio fijo solo escritura; valoración gratuita desde Les Corts sin compromiso de exclusiva larga.</p>`,
  'content/landings/barrio/vender-sant-pere-santa-caterina-barcelona.json': `<p>Ciutat Vella residencial: mercado Santa Caterina a pie, escalera estrecha, visitas pequeñas. ITE y humedad resueltas antes de banco comprador. Neto con 3.630 € fijos vs comisión variable sobre ticket medio cuatrocientos cincuenta mil.</p>`,
  'content/landings/barrio/vender-la-sagrera-barcelona.json': `<p>Parc de la Sagrera y estación: minutos caminando honestos. Navas límite: comparables separados. Plusvalía e hipoteca en calculadora neto antes de publicar. Valoración 24 h Les Corts.</p>`,
};

function main() {
  for (const [rel, html] of Object.entries(E3)) {
    const file = path.join(ROOT, rel);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.argumento_principal += html.trim();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log('E3', rel);
  }
}

main();
