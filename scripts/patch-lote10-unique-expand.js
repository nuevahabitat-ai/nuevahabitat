const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const U = {
  'content/landings/barrio/vender-camp-den-grassot-barcelona.json': `
<h2>Coll, Vallcarca i límit nord</h2>
<p>En el límite con El Coll, algunos pisos ganan silencio y pierden minutos a metro. Comprador que teletrabaja valora calle sin escalones interminables; familia con carrito descarta tramos empinados. Lo medimos en visita y lo reflejamos en pricing.</p>
<p>Vallcarca queda cerca en mapa pero no comparte ticket: no mezclamos comparables. Grassot vende comercio de barrio y vida en terraza más que vistas a Collserola.</p>
<h2>Arras, banco i cancel·lació</h2>
<p>Coordinamos arras con entidad del comprador y cancelación de tu hipoteca si aplica. Panel con ofertas para decidir sin presión del primer postor.</p>`,
  'content/landings/barrio/vender-la-bordeta-barcelona.json': `
<h2>Magòria-La Bordeta i Fira</h2>
<p>Proximidad a recintos feriales condiciona algunas calles en fechas concretas: lo indicamos sin dramatizar. Comprador que trabaja en logística o servicios valora acceso rodado a Gran Via.</p>
<p>Piso con patio interior en manzana del Ensanche secundario: argumento de luz y ventilación frente a pisos solo a calle ruidosa.</p>
<h2>Neto després de comissió</h2>
<p>Sobre 340.000 €, calcular neto tras hipoteca, plusvalía y 3.000 € + IVA fijos evita sorpresas el día de firma. Te ayudamos a ordenar números antes de publicar.</p>`,
  'content/landings/barrio/vender-provencals-del-poblenou-barcelona.json': `
<h2>Industrial reconvertit al límit</h2>
<p>En el límite con Poblenou antiguo, algunos edificios mezclan uso y alturas. Comprador pide claridad sobre actividad en planta baja y ventilación. Visitas con checklist acústico cuando hace falta.</p>
<p>Tres habitaciones reales vs dos más estudio: titular honesto atrae familia correcta y evita negociación infinita.</p>
<h2>Cartera compradora Sant Martí</h2>
<p>Activamos demanda en cartera propia además de revisar anuncio en portal si ya publicas. Pricing alineado con tasación bancaria típica del barrio.</p>`,
  'content/landings/barrio/vender-el-besos-barcelona.json': `
<h2>Besòs Mar i primera línia de metro</h2>
<p>Parada Besòs Mar concentra compradores que comparan tiempo hasta Plaça Catalunya con precio de Badalona. Si tu piso está a ocho minutos caminando, dilo; si está a quince, no escribas “metro al lado”.</p>
<p>Manzanas del Maresme mezclan familias establecidas y rotación de alquiler: filtramos comprador según estado de entrega que ofreces.</p>
<h2>Documentació comunitària</h2>
<p>En bloques grandes, derrama de fachada puede ser la objeción principal. Actas disponibles antes de visitas con financiación al 90%.</p>
<h2>Venda ràpida vs preu alt</h2>
<p>Si necesitas liquidez en sesenta días, prefijamos precio de salida agresivo pero realista. Si puedes esperar, test A/B de pricing con datos de visitas cualificadas, no con curiosos.</p>`,
  'content/landings/barrio/vender-roquetes-barcelona.json': `
<h2>Trinitat Vella sud i entorn</h2>
<p>Roquetes comparte percepción con Trinitat en algunas búsquedas de portal: separamos comparables por manzana. Comprador que conoce Nou Barris pregunta por seguridad y equipamientos: respondemos con calle concreta, no estereotipos.</p>
<p>Piso de 90 m² bien distribuido puede ganar a piso premium pequeño en otro distrito: enseñar plano ayuda.</p>
<h2>Hipoteca pendent del venedor</h2>
<p>Vender con deuda activa es habitual: timing con banco comprador y vendedor en panel centralizado. Enlace <a href="/vender-piso-hipoteca-pendiente-barcelona">hipoteca pendiente</a> cuando proceda.</p>`,
  'content/landings/barrio/vender-sagrada-familia-barcelona.json': `
<h2>Eixample esquerra i pati d'illa</h2>
<p>Pisos a patio de manzana del Eixample cerca del templo pueden ser muy luminosos o muy oscuros según planta. Fotos al mediodía y a las cinco de tarde cuando la orientación lo requiere.</p>
<p>Comprador internacional pregunta por doble cristal y aislamiento: detalle que acorta negociación en finca antigua.</p>
<h2>Comparativa amb Dreta de l'Eixample</h2>
<p>No compitas con Dreta si tu calle tiene ruido turístico constante: comprador que busca Sagrada Família como postal paga; residente que huye de colas paga menos. Segmentamos visitas.</p>
<h2>Valoració gratuïta 24 h</h2>
<p>Dirección aproximada, estado interior, cargas y plazo deseado. Daniel o Sebastián responden con techo de mercado y plan de visitas filtradas.</p>`,
};

for (const [rel, html] of Object.entries(U)) {
  const p = path.join(ROOT, rel);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  j.argumento_principal = (j.argumento_principal || '').trim() + html;
  fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`, 'utf8');
  console.log('expand', rel);
}
