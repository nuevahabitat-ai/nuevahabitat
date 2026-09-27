/**
 * Amplía argumento_principal del lote 9 para validación build (≥650 palabras, baja similitud).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const PATCHES = {
  'content/landings/barrio/vender-vila-olimpica-barcelona.json': `
<h2>Passeig de Joan de Borbó y vida de barrio</h2>
<p>La venta en Vila Olímpica no se explica solo con “cerca del mar”. Compradores habituales caminan por el passeig, comparan terrazas en calles como Salvador Espriu o la trama de Nova Icària, y preguntan por supermercados, escuelas y rutas en bici hacia el Port Olímpic. Si tu piso está a dos calles del paseo, el discurso comercial es distinto al de un edificio en segunda línea: menos ocio peatonal, más tranquilidad entre semana.</p>
<p>Documentamos ese matiz en la ficha para que quien busca restaurantes y ambiente no se decepcione, y quien busca dormir con ventanas cerradas en martes no descarte tu vivienda por fotos tomadas un sábado de verano.</p>
<h2>Anella Olímpica, parques y familias</h2>
<p>Familias con niños pequeños valoran acceso al parque del Anella Olímpica, pistas y espacio para patinete. No compiten en la misma liga que el comprador soltero que prioriza bares del puerto. Separar visitas por perfil evita negociaciones que mueren porque el comprador “no imaginaba tantas familias” o, al revés, porque esperaba vida nocturna constante.</p>
<p>Si vendes piso de tres habitaciones con terraza corrida, enseñamos distribución completa: muchos anuncios en la zona pierden leads por no mostrar dormitorios.</p>
<h2>Herencia olímpica y tipo de finca</h2>
<p>La arquitectura de los Juegos de 1992 define manzanas repetitivas con balcones generosos. El comprador europeo conoce el modelo; el nacional compara con obra nueva de Poblenou. Tu ventaja suele ser metros exteriores y piscina comunitaria ya amortizada, no “lujo de diseño”. Lo contamos con honestidad para no competir en precio con torres de cristal que no son tu producto.</p>
<p>ITE, revisión de fachada comunitaria y fondo de reserva: tres documentos que aceleran arras cuando el banco financia al 80%.</p>`,
  'content/landings/barrio/vender-camp-de-larpa-barcelona.json': `
<h2>Mercat de Camp de l'Arpa y tejido comercial</h2>
<p>El mercado de barrio concentra compradores locales que buscan piso para quedarse, no flip inversor. Si tu vivienda está a cinco minutos a pie del mercado, conviene decirlo con claridad: reduce objeciones de “zona anónima” cuando el visitante viene de otro distrito.</p>
<p>Comercios de proximidad, farmacia y parada de bus hacia el Fòrum completan el mapa mental del comprador familia. Lo reflejamos en la presentación comercial sin inflar el precio como si fuera Poblenou beachfront.</p>
<h2>Gran Via i Creu Coberta: ruido real</h2>
<p>Camp de l'Arpa tiene ejes viarios que condicionan plantas bajas y primeras. Visitamos con atención acústica cuando hace falta; el comprador que teletrabaja agradece transparencia sobre doble acristalamiento o calle en segunda línea.</p>
<p>Pricing distinto para piso interior luminoso pero sin vistas: no usamos comparables de fachada a parque si el tuyo da a patio de manzana.</p>
<h2>Inversor frente a usuario final</h2>
<p>Algún piso se vende a quien mantiene alquiler estable. Pedimos contrato, renta y solvencia del inquilino antes de mezclar visitas de familia que necesita vivienda libre. Si vendes vacío, el timing de pintura y entrega puede cerrar arras en la misma semana.</p>
<p>Panel vendedor con ofertas trazables: útil cuando hay varios herederos o un hermano vive fuera de Catalunya.</p>
<h2>Encadenar venta y compra en Sant Martí</h2>
<p>Muchos vendedores de Camp de l'Arpa compran después en Badalona, Cornellà o en otro barrio de Barcelona. Revisamos plazos de arras para que no firmes compra sin haber cerrado venta, o viceversa. Enlazamos con guías de traslado cuando el destino ya está elegido.</p>`,
  'content/landings/barrio/vender-hostafrancs-barcelona.json': `
<h2>Creu Coberta y eje comercial</h2>
<p>Hostafrancs tiene identidad propia alrededor de la Creu Coberta y el mercado: compradores que buscan “Sants” a veces no conocen el barrio hasta la primera visita. Explicar metro Hostafrancs, L1 y conexión con Plaça Espanya reduce desplazamientos fallidos de curiosos que creían estar comprando en Les Corts.</p>
<p>Pisos en eje comercial vs calle residencial en segunda línea: dos precios, dos velocidades de venta. Ajustamos salida con comparables honestos.</p>
<h2>Montjuïc a diez minutos</h2>
<p>Parques, Fira y anillo olímpico de Montjuïc son argumento para parejas activas. No vendemos Montjuïc como “centro histórico”, sino como equipamiento deportivo y cultural accesible en bici o bus.</p>
<p>Si tu terraza tiene sol de tarde, lo medimos en visita de invierno: el comprador inteligente pregunta por luz en diciembre, no solo en julio.</p>
<h2>Comunidad y derramas en finca ampliable</h2>
<p>Bloques de ampliación del Ensanche secundario mezclan alturas. Portal en rampa, ascensor estrecho o patio de luces: checklist antes de publicar para que el banco no tase por sorpresa.</p>
<p>Honorarios fijos 3.000 € + IVA: sobre 355.000 € el ahorro frente al 6% financia parte de la mudanza a otro barrio o la pintura pre-entrega.</p>
<h2>Alquiler temporal y OKUPAS</h2>
<p>Si tu caso es delicado —herencia, okupación o alquiler— enlazamos con guías específicas y filtramos compradores según plazo de posesión. Vender Hostafrancs no es urgencia genérica: cada finca tiene calendario propio.</p>`,
  'content/landings/barrio/vender-guinardo-barcelona.json': `
<h2>Metro Guinardó i Hospital de Sant Pau</h2>
<p>La parada de metro y el paseo modernista del hospital son referencias que el comprador de fuera de Barcelona entiende rápido. Cuantificamos minutos caminando desde tu portal, no “cerca del hospital” en mapa aerial.</p>
<p>Bus hacia Gràcia o Horta: útil para familias que reparten colegios y abuelos entre distritos.</p>
<h2>Humitat en planta baixa i enjut</h2>
<p>En pendiente, plantas bajas pueden tener humedad lateral. Si hubo tratamiento, mostramos facturas; si no, ajustamos precio antes de visitas. El comprador que reforma entero prefiere saberlo el día uno.</p>
<p>Cubierta y bajantes comunitarias: preguntamos actas de comunidad sobre filtraciones recientes.</p>
<h2>Apartment amb traster o sense ascensor complet</h2>
<p>Trastero en finca en batería compensa falta de ascensor en planta 3 para algunos compradores. Otros descartan cualquier tramo de escaleras: filtramos en portal para no perder horas.</p>
<p>Vistas a Collserola desde terraza: premium moderado si el camino a metro es largo. Equilibrio honesto en pricing.</p>
<h2>Venda per herència o separació</h2>
<p>Varios titulares, herencia o divorcio: centralizamos documentación y ofertas en panel para decisiones trazables. WhatsApp con Daniel o Sebastián para dudas puntuales sin pasar por call center.</p>
<p>Si compras después en zona plana (Les Corts, Sants), planificamos venta Guinardó con calendario de arras alineado.</p>`,
  'content/landings/comprador/comprar-piso-diagonal-mar-barcelona.json': `
<h2>Promoció concreta, no “Sant Martí” genérico</h2>
<p>Diagonal Mar se vende por edificio: misma calle puede tener dos comunidades con cuotas muy distintas. Pedimos actas de los últimos tres años, obras aprobadas y estado de garaje comunitario antes de que reserves un euro de señal.</p>
<p>Comparas tres anuncios el sábado: te ayudamos a ordenarlos por coste total (hipoteca + ITP + comunidad + parking), no solo por €/m² de cartel.</p>
<h2>Comprador internacional y NIE</h2>
<p>Si compras desde el extranjero, plazos de NIE, cuenta bancaria y cambio de divisa condicionan arras. Coordinamos calendario con notaría y entidad para no perder piso por burocracia evitable.</p>
<p>Visitas en inglés o castellano según necesidad; documentación traducida cuando el vendedor es herencia múltiple.</p>
<h2>Obra nueva al lado: negociar amb dades</h2>
<p>Cuando al lado hay promoción en comercialización, el vendedor particular compite con incentivos de promotor. Preparamos oferta con argumentos de finca madura, comunidad estable y entrega inmediata.</p>
<p>Registro gratuito de búsqueda en panel comprador: alertas cuando entra stock compatible en Diagonal Mar y Poblenou nord.</p>`,
  'content/landings/comprador/comprar-piso-fort-pienc-barcelona.json': `
<h2>Estació del Nord i ús del parc</h2>
<p>Familias compran Fort Pienc por parque deportivo y espacio verde, no por postal premium. Visitamos pisos en horario de entrenamientos locales si tu miedo es ruido de pista: mejor saberlo antes que después.</p>
<p>Arc de Triomf a pie: útil para quien trabaja en zona Urquinaona o Born con desplazamiento a pie o bici.</p>
<h2>Edifici dels anys 60 i 70</h2>
<p>Muchas fincas tienen distribuciones amplias pero instalaciones viejas. Reservamos en tu Excel de compra partida de reforma eléctrica y ventanas si el precio inicial es atractivo.</p>
<p>Comunidad con pocos propietarios vs bloques grandes: actas cortas o largas, revisamos ambas.</p>
<h2>Compareu amb Sant Martí i Clot</h2>
<p>Mismo presupuesto puede llevarte a <a href="/comprar-piso-el-clot-barcelona">El Clot</a> con metro directo o a Fort Pienc con parque. Decidimos contigo con minutos reales a tu trabajo.</p>
<p>Oferta con comparables de cierre en Fort Pienc, no con el anuncio más optimista del portal.</p>
<h2>ITP, notaria i despeses</h2>
<p>Segunda mano en Barcelona: ITP según tabla autonómica, notaría y registro. Cerramos techo de precio incluyendo gastos para que no te quedes sin liquidez el día de firma.</p>
<p>5.000 € + IVA honorarios comprador solo en escritura: sin compra, sin factura de agencia.</p>
<h2>Checklist abans d'arras</h2>
<p>Preaprobación hipotecaria, revisión de cargas, certificado energético y estado de alquiler si hay inquilino. No firmamos arras “a ciegas” con penalización alta.</p>
<p>Gestor en Les Corts responde en 24 h laborables cuando activas búsqueda con presupuesto máximo y habitaciones.</p>`,
  'content/landings/comprador/comprar-piso-vila-olimpica-barcelona.json': `
<h2>Platja de la Nova Icària i horaris</h2>
<p>Comprar cerca de la playa implica preguntar por verano y invierno. Visitamos si hace falta en viernes noche y domingo mediodía: perfil distinto de ruido.</p>
<p>Turismo de piso turístico en la finca: revisamos estatutos y actas por restricciones de alquiler vacacional.</p>
<h2>Edificis olímpics: comunidad i piscina</h2>
<p>Piscina cerrada por obra, cuota extra de mantenimiento o conserje a tiempo parcial: detalles que no salen en fotos. Checklist comunitario antes de ofertar.</p>
<p>Parking subterráneo con columna estrecha: comprador con SUV grande descarta; mejor saberlo antes.</p>
<h2>Negociar amb particulars i herències</h2>
<p>Muchos pisos olímpicos son segunda vivienda o herencia. Plazos de aceptación de legados o usufructo pueden retrasar escritura: lo detectamos en nota simple.</p>
<p>Oferta apoyada en cierres de la misma manzana olímpica, no en chalet de Garraf.</p>
<h2>Connectivitat cap al centre</h2>
<p>Ciutadella, Born y Arc de Triomf en bici o bus. Cuantificamos para tu rutina real, no Google Maps a las 3 de la mañana.</p>
<p>Panel comprador con documentos centralizados y alertas en cartera privada NuevaHabitat.</p>`,
  'content/landings/comprador/comprar-piso-guinardo-barcelona.json': `
<h2>Pendiente, aparcamiento y mudanza</h2>
<p>Comprar en Guinardó implica simular mudanza: muebles grandes, carrito de bebé, maletas. Si hay tramos sin ascensor, negociamos descuento coherente o descartamos antes de señal.</p>
<p>Aparcamiento en calle: rotación y zona azul condicionan vida diaria; lo hablamos en visita.</p>
<h2>Barrio Can Baró vs Guinardó bajo</h2>
<p>No mezclamos precios de Can Baró con calles más próximas al hospital. Mapa calle a calle en la primera reunión.</p>
<p>Ruido de bares en calles específicas: visita nocturna opcional.</p>
<h2>Reforma integral o parcial</h2>
<p>Piso a reformar con buena estructura: reserva 10–15% del presupuesto total. Humedades en fachada: perito si hace falta antes de arras.</p>
<p>Comparar con <a href="/comprar-piso-horta-barcelona">Horta</a> si buscas más planitud y mismos metros.</p>
<h2>Finançament i taxació</h2>
<p>Bancos pueden tasar conservador en fincas en pendiente. Alineamos oferta con histórico de tasaciones en la calle.</p>
<p>5.000 € + IVA solo al firmar compra; registro de búsqueda gratuito para activar alertas.</p>
<h2>Escritura i lliurament</h2>
<p>Coordinación notarial, ITP y checklist de llaves. Acompañamiento hasta firma sin comisiones cruzadas opacas con el vendedor.</p>`,
};

const EXTRA = {
  'content/landings/barrio/vender-camp-de-larpa-barcelona.json': `<h2>Franjas de visita y familia numerosa</h2><p>Muchos compradores de Camp de l'Arpa visitan después del trabajo entre semana. Si solo puedes recibir visitas el sábado, lo indicamos en la ficha para no perder leads laborales. Familias numerosas preguntan por habitaciones dobles y armarios empotrados: el reportaje debe responder sin inventar metros.</p><p>Calculadora 6% vs 3.630 € fijos en la landing: sobre 385.000 € el ahorro en comisión financia pintura o parte de la plusvalía municipal.</p>`,
  'content/landings/barrio/vender-guinardo-barcelona.json': `<h2>Fotos en invierno y verano</h2><p>La luz en Guinardó cambia mucho entre estaciones. Subimos fotos representativas y, si hace falta, visita en día nublado para que el comprador no idealice sol permanent. Terraza con toldo vs sin toldo: detalle de coste anual.</p><p>Vecinos de larga data a veces conocen historial de humedades del edificio: lo contrastamos con actas, no con rumores.</p><h2>Servicios de Les Corts</h2><p>Gestión desde Mejía Lequerica 42: valoración, pricing y cartera compradora sin desplazarte a múltiples oficinas. WhatsApp directo con quien conoce el barrio, no un número genérico.</p>`,
  'content/landings/barrio/vender-hostafrancs-barcelona.json': `<h2>Escuelas y equipamientos</h2><p>Compradores con hijos preguntan por escuelas y parques infantiles entre Hostafrancs y la Bordeta. Respondemos con mapa honesto, no promesas de “mejor colegio de Barcelona”.</p><p>Obra en calle: si el ayuntamiento tiene zanja prevista, lo mencionamos para negociaciones limpias.</p><h2>Segunda residencia y herencia</h2><p>Pisos heredados entre hermanos: panel con ofertas visibles para todos. Plazos de aceptación de legado alineados con arras del comprador.</p>`,
  'content/landings/comprador/comprar-piso-diagonal-mar-barcelona.json': `<h2>Visites en franques reales</h2><p>Agendamos contigo mañanas laborables o sábados según tu calendario. En tickets altos, repetir visita con perito o arquitecto amigo es habitual: no hay prisa artificial.</p><p>Descartamos pisos con cargas ocultas, deudas de comunidad desproporcionadas o precio de portal sin histórico de cierres.</p><h2>Después de la compra</h2><p>Coordinación hasta notaría; checklist de suministros y cambio de titularidad. El servicio termina en escritura, no en la primera visita bonita.</p>`,
  'content/landings/comprador/comprar-piso-fort-pienc-barcelona.json': `<h2>Primera reunión sin compromiso</h2><p>Presupuesto máximo, habitaciones, ascensor sí/no y tolerancia a reforma. Con eso definimos radar de calles viables en Fort Pienc y límite con Eixample.</p><p>Alertas automáticas cuando entra anuncio coherente; descartamos los que el banco no tasaría.</p><h2>Comprador con mascota o teletrabajo</h2><p>Parque del Nord y calles tranquilas vs Gran Via: criterios explícitos en búsqueda. Teletrabajo: medimos ruido en horario laboral.</p>`,
  'content/landings/comprador/comprar-piso-vila-olimpica-barcelona.json': `<h2>Presupuesto total realista</h2><p>ITP, notaría, registro, comunidad trimestral y posible reforma de cocina entran en la hoja de cálculo antes de enamorarte de una terraza.</p><p>Comparamos contigo Vila Olímpica y otras playas urbanas solo si encajan con tu vida diaria, no por moda de verano.</p><h2>Seguimiento humano</h2><p>Daniel o Sebastián en Les Corts: no un bot. Respuesta en 24 h laborables al registrar búsqueda.</p>`,
  'content/landings/comprador/comprar-piso-guinardo-barcelona.json': `<h2>Primera visita con checklist</h2><p>Portal, cubierta, bajantes, ascensor, humedad en baño, ruido de calle, minutos caminando a metro Guinardó. Marcamos descartes explícitos en panel para no repetir errores.</p><p>Oferta razonada con comparables de la misma pendiente, no de Eixample plano.</p><h2>Plazo de mudanza</h2><p>Si vendes en otro sitio simultáneamente, alineamos arras de compra y venta para no pagar doble alquiler meses extra.</p>`,
};

for (const [rel, html] of Object.entries(PATCHES)) {
  const p = path.join(ROOT, rel);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  j.argumento_principal = (j.argumento_principal || '').trim() + html;
  if (EXTRA[rel]) j.argumento_principal += EXTRA[rel];
  if (rel.includes('vender-vila-olimpica')) {
    j.argumento_principal = j.argumento_principal.replace(
      /<h2>Comparar con Diagonal Mar y Poblenou<\/h2>[\s\S]*?<h2>Reforma interior/,
      `<h2>Port Olímpic y calendario veraniego</h2><p>Quien compra en la Vila Olímpica suele preguntar por terrazas abiertas en julio y por calles más tranquilas en enero. Vendemos con ese calendario en mente: no es lo mismo un piso en primera línea de ocio que uno en Nova Icària orientado al parque.</p><p>Si el comprador viene de Sarrià o de zona alta, explicamos cambio de ritmo urbano con datos, no con eslóganes de “vida playera”.</p><h2>Reforma interior`
    );
  }
  fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`, 'utf8');
  console.log('Patched', rel);
}
