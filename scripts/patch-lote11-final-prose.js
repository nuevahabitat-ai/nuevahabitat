const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const FINAL = {
  'content/landings/barrio/vender-navas-barcelona.json': `
<h2>Panel venedor i WhatsApp Les Corts</h2>
<p>Daniel o Sebastián responden en horario comercial desde Mejía Lequerica 42. Ves visitas concertadas, documentos de comunidad subidos y ofertas con fecha. Vendedor que trabaja fuera de Barcelona no necesita acudir a cada visita si autoriza acceso con llaves en agencia de confianza — lo acordamos caso a caso.</p>
<p>Fotografía sin filtros exagerados: suelo, cocina y dormitorios con luz natural. Comprador de Navas detecta photoshop de “vistas” que no existen. Mejor una ficha honesta que arras rota.</p>`,
  'content/landings/barrio/vender-montjuic-barcelona.json': `
<h2>Certificat energètic i comunitat</h2>
<p>Edificios 60–70 con caldera colectiva: comprador pregunta por derrama de cambio a gas o aerotermia. Certificado energético E o F: anticipamos mejora orientativa. Comunidad al día acorta due diligence del banco una semana entera.</p>
<p>Piso alquilado: <a href="/vender-piso-alquilado-barcelona">venta con inquilino</a> con visitas solo inversor solvente. Piso vacío para familia: entrega pintada puede cerrar arras rápido.</p>`,
  'content/landings/barrio/vender-pedralbes-barcelona.json': `
<h2>Tasació bancària i margen de negociació</h2>
<p>Comprador prime llega con tasador del banco que puede quedar 8% por debajo del precio de salida optimista. Valoración inicial alineada a tasación típica evita re-trabajo a los 45 días. Parking incluido: verificar titularidad separada en nota simple antes de publicar.</p>
<p>Honorarios fijos no suben si el comprador regatea 30.000 €: tu neto mejora vs comisión porcentual sobre precio final negociado.</p>`,
  'content/landings/barrio/vender-trinitat-vella-barcelona.json': `
<h2>Fotos portal i ascensor</h2>
<p>Primera foto debe ser portal limpio y ascensor funcionando si existe. Comprador de Trinitat Vella asocia estado de entrada con estado de vecindad. Planta alta sin lift: precio publicado ya descontado.</p>
<p>Neto vendedor: restar hipoteca, plusvalía, comunidad pendiente y comisión. Sobre 245.000 €, 3.630 € fijos vs 14.700 € al 6% ordena expectativas desde primera llamada.</p>`,
  'content/landings/barrio/vender-vall-d-hebron-barcelona.json': `
<h2>Estudiants, lloguer i rotació</h2>
<p>Algún piso rota con estancias cortas de estudiantes de medicina: contrato vigente explicado. Cuatro habitaciones pequeñas vs tres grandes define target familia vs inversor. Distancia a facultad caminando en ficha cuando aplica.</p>
<p>Reforma baño y cocina años 90: documentar facturas acorta negociación. Enlace <a href="/vender-piso-traslado-barcelona">traslado</a> si vendes por mudanza fuera de zona.</p>`,
  'content/landings/barrio/vender-tetuan-barcelona.json': `
<h2>Metro Marina, Bogatell i cronòmetre</h2>
<p>Comprador mide caminando hasta L1 con cronómetro en primera visita. Si son doce minutos, no escribir “metro al lado”. Bici por carril hacia 22@: argumento para perfil tech sin pagar Poblenou prime.</p>
<p>Derrama ascensor en finca 70–80: actas PDF antes de visitas serias. Calculadora 6% sobre 410.000 € vs precio fijo en primera reunión Les Corts.</p>`,
  'content/landings/barrio/vender-sant-pere-santa-caterina-barcelona.json': `
<h2>Reforma respectuosa i elements originals</h2>
<p>Suelo hidráulico o vigas vistas bien conservadas suman valor en comprador que busca autenticidad. Reforma años 2000 genérica puede no recuperarse en precio. Asesoramos qué pintar y qué no tocar antes de reportaje.</p>
<p>Separación: <a href="/vender-piso-separacion-divorcio-barcelona">venta por divorcio</a> con ofertas visibles para ambos titulares. Visitas en franjas sin aglomerar escalera.</p>`,
  'content/landings/barrio/vender-la-sagrera-barcelona.json': `
<h2>Pairing Navas–Sagrera i dos actius</h2>
<p>Familia que vende herencia de padres en Navas y piso propio en Sagrera: dos landings, dos pricing, un panel si lo deseas. Comprador domingo compara ambos: fichas honestas evitan confusión.</p>
<p>Cartera compradora Sant Andreu activada cuando precio encaja preaprobación. Sin venta, no facturamos. Valoración gratuita 24 h laborables desde Les Corts.</p>`,
};

function main() {
  for (const [rel, html] of Object.entries(FINAL)) {
    const file = path.join(ROOT, rel);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.argumento_principal += html.trim();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log('Final', rel);
  }
}

main();
