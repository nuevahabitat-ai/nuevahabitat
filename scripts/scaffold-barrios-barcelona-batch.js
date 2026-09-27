/**
 * Nuevas landings barrio (vender + comprador) — Barcelona y área.
 * Uso: node scripts/scaffold-barrios-barcelona-batch.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BARrio_DIR = path.join(ROOT, 'content', 'landings', 'barrio');
const COMPRADOR_DIR = path.join(ROOT, 'content', 'landings', 'comprador');

function proseParagraphs(paragraphs, sections) {
  let html = paragraphs.map((p) => `<p>${p}</p>`).join('');
  sections.forEach(({ title, body }) => {
    html += `<h2>${title}</h2>${body}`;
  });
  return html;
}

const VENDER = [
  {
    slug: 'vender-diagonal-mar-barcelona',
    barrio: 'Diagonal Mar',
    breadcrumbCurrent: 'Diagonal Mar',
    footerLabel: 'Vender en Diagonal Mar',
    priority: 0.86,
    postalCodes: ['08019'],
    zonas: ['Diagonal Mar', 'Parc de Diagonal Mar', 'Front marítim', 'Poblenou nord'],
    inmueblesQuery: 'Diagonal Mar',
    ejemploPrecio: 495000,
    ahorro: '26.500',
    heroImage: 'imagenes/poblenou5.jpg',
    heroImageAlt: 'Piso en Diagonal Mar, Barcelona',
    precioM2: '4.800 – 6.200 €/m²',
    tiempoVenta: '50 – 85 días',
    tendencia: 'Demanda premium por servicios, mar y oficinas del 22@',
    perfilComprador:
      'Compradores con hipoteca alta o liquidez que comparan Diagonal Mar con Eixample y Poblenou reformado: familias que buscan piscina comunitaria, parking y proximidad al mar; profesionales del 22@ que quieren reducir desplazamientos.',
    tipologiaEdificios:
      'Promociones de los 2000–2010 con servicios comunitarios, algunas torres con vistas al mar y plantas bajas con terraza. El estado de la comunidad y la calidad de acabados pesa más que en barrios obreros.',
    keywords:
      'vender piso Diagonal Mar, vender piso Diagonal Mar Barcelona, inmobiliaria Diagonal Mar, vender vivienda 08019, vender piso front marítim Barcelona',
    whatsappEnc: 'Diagonal%20Mar',
    formPlaceholder: 'Dirección o edificio en Diagonal Mar',
    intro: [
      '<strong>Diagonal Mar</strong> concentra parte del stock más premium de Sant Martí: promociones con piscina, parking subterráneo y minutos a pie del centro comercial y del front marítim. En 2026 el rango orientativo ronda <strong>4.800–6.200 €/m²</strong> según planta, orientación y estado interior.',
      'Vender aquí no es lo mismo que vender en El Besòs o en un bloque industrial de Poblenou: el comprador compara acabados, gastos de comunidad y vistas. Un pricing basado en la media del distrito suele fallar.',
    ],
    sections: [
      {
        title: 'Comprador objetivo en Diagonal Mar',
        body: '<p>El perfil suele llegar con financiación cerrada o patrimonio líquido y compara tres anuncios el mismo fin de semana. Valora piscina, conserje, parking y minutos reales al 22@ o a la playa. Si tu piso compite con obra nueva, la reforma interior y el certificado energético deben estar alineados con el ticket.</p>',
      },
      {
        title: 'Pricing con comparables de la misma promoción',
        body: '<p>Idealista mezcla Diagonal Mar con Poblenou antiguo. Usamos cierres y visitas cualificadas en edificios similares — misma antigüedad, servicios y orientación — para fijar salida y margen de negociación. Evitas meses de “probamos a ver” con curiosos sin capacidad de compra.</p>',
      },
      {
        title: 'Documentación en comunidades grandes',
        body: '<p>En comunidades con piscina y garaje comunitario, el comprador financiado pide actas, derramas previstas y estado de instalaciones. Anticipar ITE de finca y deuda de comunidad acorta el camino a arras. Lo centralizamos en el panel vendedor junto con visitas y ofertas.</p>',
      },
      {
        title: 'Enlaces útiles en Sant Martí',
        body: '<p>Si tu activo está en el límite con Poblenou, consulta también <a href="/vender-poblenou">vender en Poblenou</a> o la guía amplia de <a href="/vender-sant-marti">Sant Martí</a>. Para comparar honorarios, <a href="/inmobiliaria-precio-fijo-barcelona">precio fijo Barcelona</a>.</p>',
      },
      {
        title: 'Honorarios fijos desde Les Corts',
        body: '<p>3.000 € + IVA solo en escritura. Sobre 495.000 €, un 6% tradicional supera 29.000 € en comisión; el importe fijo protege tu neto si el comprador negocia bien. Valoración gratuita en 24 h, visitas en tus franjas y compradores filtrados por solvencia.</p>',
      },
      {
        title: 'Panel y visitas sin ruido comercial',
        body: '<p>Ves calendario, documentos y ofertas en el panel vendedor. Solo entran visitas con hipoteca preaprobada o liquidez contrastada. Daniel o Sebastián responden por WhatsApp en horario comercial desde la oficina de Les Corts.</p>',
      },
      {
        title: 'Diagonal Mar frente a Vila Olímpica',
        body: '<p>Muchos compradores cruzan Diagonal Mar con promociones de la Vila Olímpica el mismo sábado. Allí el argumento suele ser playa a pie y años 90; aquí, servicios más recientes y centro comercial. Si tu piso no tiene vistas al mar, no compitas en precio con torres que sí las tienen: ajustamos la ficha y el comparativo por planta y orientación.</p><p>En plantas medias con orientación este, la luz de mañana y la brisa suelen justificar un premium frente a bloques en segunda línea. Lo medimos con visitas reales, no con el anuncio más caro del portal.</p>',
      },
      {
        title: 'Parking, trastero y ticket total',
        body: '<p>En Diagonal Mar la plaza de garaje puede mover la operación varios miles de euros. Compradores con coche valoran parking subterráneo y trastero incluidos; si vendes sin plaza, el descuento debe estar en el precio desde el día uno. Revisamos titularidad de la plaza, cuota de comunidad separada y si hay lista de espera en el edificio.</p><p>Para familias que vienen del 22@, el tiempo caminando hasta la oficina pesa tanto como un m² extra en el salón. Lo explicitamos en la presentación comercial para atraer al comprador correcto.</p>',
      },
      {
        title: 'Reforma interior en promociones recientes',
        body: '<p>Aunque el edificio sea de los 2000, cocina y baños de origen pueden parecer anticuados frente a obra nueva de la misma calle. Una reforma parcial bien documentada —facturas, licencias si aplican— suele acortar negociación. Evitamos fotos genéricas de stock: mostramos distribución, dormitorios y terraza con luz natural real.</p><p>Si hay certificado energético en clase baja, anticipamos el coste orientativo de mejora para que el comprador financiado no use la etiqueta como palanca de última hora sin haberlo previsto.</p>',
      },
      {
        title: 'Cuándo tiene sentido vender sin exclusiva larga',
        body: '<p>En tickets premium algunos propietarios ya están en Idealista con otra agencia. Podemos activar compradores de cartera y revisar pricing sin obligarte a firmar exclusivas de doce meses. El objetivo es cerrar con datos de mercado local, no encadenarte a un anuncio mal posicionado.</p><p>Valoración gratuita en 24 h desde Les Corts: dirección aproximada, estado interior y si hay hipoteca pendiente. Con eso definimos salida, techo de negociación y calendario de visitas en tus franjas.</p>',
      },
    ],
    relacionadas: [
      { slug: 'vender-poblenou', label: 'Vender en Poblenou' },
      { slug: 'vender-sant-marti', label: 'Vender en Sant Martí' },
      { slug: 'comprar-piso-sant-marti-barcelona', label: 'Comprar en Sant Martí' },
      { slug: 'inmobiliaria-precio-fijo-barcelona', label: 'Precio fijo Barcelona' },
    ],
    faq: [
      { q: '¿Diagonal Mar es lo mismo que Poblenou?', a: 'No en precio ni en tipología. Diagonal Mar es stock más reciente con servicios; Poblenou mezcla finca obrero e industrial. Valoramos con comparables del mismo entorno.' },
      { q: '¿Cuánto tarda una venta bien de precio?', a: 'Entre 50 y 85 días es habitual si el ticket encaja con financiación del comprador tipo y la documentación está lista.' },
      { q: '¿Trabajáis desde Les Corts?', a: 'Sí. Mejía Lequerica 42. Atendemos todo Sant Martí y área metropolitana.' },
      { q: '¿Cuánto cuesta vender?', a: '3.000 € + IVA en escritura. Sin venta, no pagas honorarios de agencia.' },
    ],
  },
  {
    slug: 'vender-fort-pienc-barcelona',
    barrio: 'Fort Pienc',
    breadcrumbCurrent: 'Fort Pienc',
    footerLabel: 'Vender en Fort Pienc',
    priority: 0.86,
    postalCodes: ['08013', '08018'],
    zonas: ['Fort Pienc', 'Estació del Nord', 'Arc de Triomf', 'Límite Eixample'],
    inmueblesQuery: 'Fort Pienc',
    ejemploPrecio: 465000,
    ahorro: '24.800',
    heroImage: 'imagenes/eixample2.jpg',
    heroImageAlt: 'Piso en Fort Pienc, Barcelona',
    precioM2: '4.500 – 5.800 €/m²',
    tiempoVenta: '45 – 80 días',
    tendencia: 'Demanda de familias y parejas por centralidad y parques',
    perfilComprador:
      'Compradores que buscan Eixample céntrico con algo más de tranquilidad que la Dreta: familias con hijos por proximidad a parques, profesionales que trabajan en 22@ o centro y valoran metro Arc de Triomf y Estació del Nord.',
    tipologiaEdificios:
      'Eixample clásico con algunas fincas de principios del XX y rehabilitaciones recientes. Plantas altas con luz y edificios en segunda línea respecto a Gran Via condicionan el precio por m².',
    keywords:
      'vender piso Fort Pienc, vender piso Fort Pienc Barcelona, inmobiliaria Fort Pienc, vender vivienda 08013, vender piso Arc de Triomf',
    whatsappEnc: 'Fort%20Pienc',
    formPlaceholder: 'Calle o zona en Fort Pienc',
    intro: [
      '<strong>Fort Pienc</strong> es la puerta norte del Eixample: Arc de Triomf, Estació del Nord y parques que atraen a compradores que quieren vivir cerca del centro sin el ruido de algunas calles de la Dreta. Precio orientativo <strong>4.500–5.800 €/m²</strong> según planta, ascensor y estado de reforma.',
      'Muchos vendedores comparan su piso con anuncios del Eixample genérico y se quedan fuera de mercado. Fort Pienc tiene micro-mercado propio: segunda línea vs primera, vistas a interior de manzana vs parque.',
      'En NuevaHabitat cruzamos tu activo con compradores de cartera que ya buscan Fort Pienc o Eixample norte, valoración en 24 h y panel vendedor sin exclusiva obligatoria de doce meses cuando ya publicas en portal.',
    ],
    sections: [
      {
        title: 'Fort Pienc vs Dreta de l’Eixample',
        body: '<p>El comprador suele visitar ambos el mismo día. Si tu precio está anclado a la Dreta premium sin tener la misma orientación o estado, pierdes visitas. Ajustamos salida con comparables de Fort Pienc y calles limítrofes, no con medias de todo el distrito.</p>',
      },
      {
        title: 'Parques, colegios y perfil familiar',
        body: '<p>Parc de l’Estació del Nord y la proximidad a equipamientos explican parte de la demanda familiar. En la ficha conviene destacar minutos reales a metro L1 Arc de Triomf y autobuses hacia el 22@. Filtramos visitas para no abrir a quien busca solo inversión turística — poco habitual aquí pero ocurre.</p>',
      },
      {
        title: 'Fincas con ascensor y reforma',
        body: '<p>En edificios sin ascensor, plantas tercera y cuarta negocian distinto. Una reforma integral de cocina y baño suele mover el precio final más que en barrios periféricos porque el comprador compara con alternativas ya reformadas en el Eixample.</p>',
      },
      {
        title: 'Guías relacionadas',
        body: '<p>Amplía contexto en <a href="/vender-eixample">vender en el Eixample</a>, <a href="/vender-sant-marti">Sant Martí</a> limítrofe o <a href="/vender-poblenou">Poblenou</a> si el comprador viene del lado mar.</p>',
      },
      {
        title: 'Precio fijo NuevaHabitat',
        body: '<p>3.630 € en escritura vs más de 27.000 € en comisión del 6% sobre 465.000 €. Cartera de compradores con hipoteca preaprobada, panel vendedor y valoración en 24 h desde Les Corts.</p>',
      },
      {
        title: 'Próximo paso',
        body: '<p>Cuéntanos dirección aproximada y estado del piso. Te devolvemos rango de mercado y plan de venta sin exclusiva abusiva.</p>',
      },
      {
        title: 'Gran Via, Estació del Nord y ruido',
        body: '<p>Las calles que respiran Gran Via tienen un comprador distinto al de interior de manzana hacia el parque. En visita medimos ruido a hora punta y ventanas al patio: muchas objeciones vienen de comparar tu piso con uno en segunda línea sin haber pisado la calle un martes a las 19:00.</p><p>La Estació del Nord y el Arc de Triomf atraen compradores que usan bus hacia el 22@ o bici por carril. Cuantificar minutos reales al metro L1 Arc de Triomf ayuda a sostener precio frente a anuncios genéricos del Eixample.</p>',
      },
      {
        title: 'Herencia, separación y venta rápida',
        body: '<p>En Fort Pienc no es raro vender por <a href="/vender-piso-herencia-barcelona">herencia</a> o <a href="/vender-piso-separacion-divorcio-barcelona">separación</a> con varios herederos o titulares. Centralizar documentación, poderes y calendario de visitas evita que la operación se alargue meses por falta de coordinación. El panel vendedor deja trazabilidad de ofertas para todos los firmantes.</p>',
      },
      {
        title: 'Fotografía y staging en finca clásica',
        body: '<p>Suelos hidráulicos, molduras y techos altos venden si la luz se ve en las fotos. Evitamos gran angular que infla metros y decepciona en visita. Si hay habitación en suite reciente, la mostramos antes que el pasillo: el comprador familiar decide en los dormitorios, no en el recibidor.</p>',
      },
      {
        title: 'Comparar honorarios antes de firmar exclusiva',
        body: '<p>Sobre 465.000 €, un 6% tradicional supera 27.000 € en comisión; nuestros 3.630 € fijos en escritura protegen tu neto si el comprador negocia bien. Calcula con nuestra herramienta en la landing y contrasta con lo que te proponga cualquier otra agencia antes de comprometerte doce meses.</p>',
      },
      {
        title: 'Sant Martí limítrofe y compradores cruzados',
        body: '<p>Parte del interés en Fort Pienc viene de quien no alcanza Poblenou reformado pero quiere metro rápido hacia el mar o el 22@. Si tu piso compite con ese radar, la ficha debe destacar silencio nocturno y parque antes que “cerca de la playa” — mentira que se paga en visita. Cruzamos demanda con compradores que también miran <a href="/vender-sant-marti">Sant Martí</a> norte sin mezclar precios de Diagonal Mar.</p>',
      },
    ],
    relacionadas: [
      { slug: 'vender-eixample', label: 'Vender en Eixample' },
      { slug: 'vender-sant-marti', label: 'Vender en Sant Martí' },
      { slug: 'comprar-piso-eixample-barcelona', label: 'Comprar en Eixample' },
      { slug: 'vender-poblenou', label: 'Vender en Poblenou' },
    ],
    faq: [
      { q: '¿Fort Pienc entra en el Eixample?', a: 'Urbanísticamente sí, pero el mercado lo trata como micro-zona con precio y comprador propios. Valoramos con comparables locales.' },
      { q: '¿Atendéis desde Les Corts?', a: 'Sí. Visitas concertadas en tu horario.' },
      { q: '¿Puedo vender si ya estoy en portal?', a: 'Sí. Revisamos precio y activamos compradores filtrados sin obligarte a exclusiva larga.' },
      { q: '¿Honorarios?', a: '3.000 € + IVA solo al cerrar en notaría.' },
    ],
  },
  {
    slug: 'vender-la-marina-barcelona',
    barrio: 'La Marina',
    breadcrumbCurrent: 'La Marina',
    footerLabel: 'Vender en La Marina',
    priority: 0.855,
    postalCodes: ['08038', '08039'],
    zonas: ['La Marina del Port', 'La Marina de Port', 'Zona Franca', 'Montjuïc sud'],
    inmueblesQuery: 'Marina',
    ejemploPrecio: 285000,
    ahorro: '13.500',
    heroImage: 'imagenes/poblesec1.jpg',
    heroImageAlt: 'Vivienda en La Marina, Barcelona',
    precioM2: '3.200 – 4.100 €/m²',
    tiempoVenta: '55 – 95 días',
    tendencia: 'Revalorización gradual por mejoras urbanísticas y demanda de primera vivienda',
    perfilComprador:
      'Primerizos y familias que buscan precio de entrada en Barcelona ciudad, aceptando más desplazamiento a la playa central pero ganando metros interiores; algunos compradores vinculados al puerto y logística.',
    tipologiaEdificios:
      'Bloques de los 60–80, algunas rehabilitaciones de vivienda pública y edificios con poca altura. Ascensor, orientación y ruido de ejes viarios son el triángulo de objeciones.',
    keywords:
      'vender piso La Marina Barcelona, vender piso Zona Franca, inmobiliaria La Marina, vender vivienda 08038, vender piso Montjuïc',
    whatsappEnc: 'La%20Marina',
    formPlaceholder: 'Zona (Marina del Port, Marina de Port…)',
    intro: [
      '<strong>La Marina</strong> (Marina del Port y Marina de Port) ofrece uno de los tickets más accesibles para vender piso en Barcelona ciudad, con rangos orientativos de <strong>3.200–4.100 €/m²</strong> según finca y estado. El comprador compara con <a href="/vender-l-hospitalet">L’Hospitalet</a> y <a href="/vender-poble-sec">Poble-sec</a>: busca metros y precio, no postal premium.',
      'Vender bien aquí explica entorno real — transporte, equipamientos, mejoras urbanísticas — y filtra visitas sin hipoteca. Muchos anuncios se estancan por fotos pobres o precio copiado de un piso reformado en otra cuadra.',
      'Honorarios fijos 3.000 € + IVA en escritura, visitas en tus franjas y compradores cualificados desde Les Corts. Si ya tienes anuncio publicado, revisamos pricing y activamos demanda sin obligarte a retirar otras vías el primer mes. Valoración sin compromiso.',
    ],
    sections: [
      {
        title: 'Dos Marinas, dos conversaciones',
        body: '<p>Marina del Port y Marina de Port no comparten la misma percepción de comprador. Separar comparables por manzana evita bajar precio de forma innecesaria o, al revés, inflar y quedarte sin visitas serias.</p>',
      },
      {
        title: 'Primera vivienda y financiación',
        body: '<p>El comprador suele ir con hipoteca al 80–90%. Si la tasación baja, la operación cae. Alineamos precio de salida con lo que el banco suele aceptar en la zona, no con el anuncio más caro del portal.</p>',
      },
      {
        title: 'Montjuïc y Poble-sec al lado',
        body: '<p>Enlazamos con guías de <a href="/vender-poble-sec">Poble-sec</a> cuando el comprador viene de barrios limítrofes. Si vendes para comprar fuera, mira también <a href="/vender-piso-traslado-barcelona">venta por traslado</a>.</p>',
      },
      {
        title: 'Documentación en fincas maduras',
        body: '<p>ITE, comunidad con derramas y certificado energético pesan. Subir documentación al panel antes de visitas evita sorpresas a dos semanas de arras.</p>',
      },
      {
        title: 'Honorarios fijos',
        body: '<p>3.000 € + IVA en escritura. En 285.000 € ahorras más de 13.000 € frente al 6% tradicional. Sin venta, no facturamos honorarios de agencia.</p>',
      },
      {
        title: 'Gestores en Les Corts',
        body: '<p>Valoración gratuita, visitas en tus franjas y WhatsApp con Daniel o Sebastián. Compradores cualificados desde cartera, no solo curiosos de portal.</p>',
      },
      {
        title: 'Zona Franca, puerto y empleo local',
        body: '<p>Parte de la demanda en La Marina viene de hogares vinculados al puerto, logística y servicios de la Zona Franca. No es el mismo discurso comercial que en Sarrià: aquí pesan metros interiores, ascensor y cuota de comunidad contenida. Si tu piso tiene tres habitaciones reales, la ficha debe enseñarlas — muchos anuncios pierden leads por fotos solo del salón.</p>',
      },
      {
        title: 'Mejoras urbanísticas y percepción del comprador',
        body: '<p>El comprador de primera vivienda compara La Marina con <a href="/venta-piso-economica-barcelona">alternativas económicas</a> en Barcelona ciudad y área metropolitana. Explicar equipamientos, líneas de bus hacia Montjuïc o Sants y proyectos de mejora del entorno reduce objeciones de “barrio difícil” sin mentir: vendemos con datos, no con promesas vacías.</p>',
      },
      {
        title: 'Piso alquilado o con inquilino',
        body: '<p>Si vendes <a href="/vender-piso-alquilado-barcelona">con inquilino</a>, el comprador inversor pide renta, contrato y solvencia del arrendatario. Si vendes vacío a familia, el timing de entrega y estado de pintura pueden cerrar o romper arras. Filtramos visitas según tu situación para no mezclar perfiles incompatibles.</p>',
      },
      {
        title: 'Escritura y neto al vendedor',
        body: '<p>Antes de publicar, calcula hipoteca pendiente, plusvalía municipal y comisión de agencia. En tickets de 285.000 €, ahorrar más de 13.000 € en honorarios frente al 6% tradicional puede financiar parte de la mudanza o una reforma en la vivienda de destino. Cobramos solo si cierras en notaría.</p>',
      },
      {
        title: 'Transporte público y narrativa honesta',
        body: '<p>La Marina se defiende con líneas de bus hacia Sants, Montjuïc y el centro, no con promesas de “Barcelona premium”. Cuantificamos minutos reales a tu estación de referencia y lo reflejamos en la presentación: el comprador primerizo perdona lejanía si el precio y los metros cuadran con su hipoteca.</p><p>Si hay obra en el entorno, lo indicamos antes de visitas para que la negociación no se rompa por sorpresas urbanísticas. Transparencia acorta plazos aunque el ticket sea contenido.</p>',
      },
      {
        title: 'Hipoteca pendiente y venta encadenada',
        body: '<p>Vender con <a href="/vender-piso-hipoteca-pendiente-barcelona">hipoteca pendiente</a> en La Marina es habitual: coordinamos timing con el banco y compradores que cierran financiación al 80–90%. El panel concentra ofertas para que compares neto después de cancelación y gastos, no solo precio bruto de publicación.</p>',
      },
    ],
    relacionadas: [
      { slug: 'vender-poble-sec', label: 'Vender en Poble-sec' },
      { slug: 'vender-sants', label: 'Vender en Sants' },
      { slug: 'vender-l-hospitalet', label: "Vender en L'Hospitalet" },
      { slug: 'venta-piso-economica-barcelona', label: 'Venta económica Barcelona' },
    ],
    faq: [
      { q: '¿La Marina es barrio de moda?', a: 'Es sobre todo mercado de primera vivienda y precio contenido. La estrategia es realismo en pricing y filtro de solvencia.' },
      { q: '¿Cuánto cuesta vender?', a: '3.000 € + IVA solo en escritura si cierras.' },
      { q: '¿Visitas los fines de semana?', a: 'Tú defines franjas; solo agendamos compradores contrastados.' },
    ],
  },
  {
    slug: 'vender-verneda-barcelona',
    barrio: 'La Verneda',
    breadcrumbCurrent: 'La Verneda',
    footerLabel: 'Vender en La Verneda',
    priority: 0.855,
    postalCodes: ['08020', '08005'],
    zonas: ['La Verneda i la Pau', 'Provençals del Poblenou', 'El Clot nord'],
    inmueblesQuery: 'Verneda',
    ejemploPrecio: 310000,
    ahorro: '15.200',
    heroImage: 'imagenes/santmarti1.webp',
    heroImageAlt: 'Piso en La Verneda, Barcelona',
    precioM2: '3.400 – 4.300 €/m²',
    tiempoVenta: '50 – 90 días',
    tendencia: 'Demanda estable de familias por amplitud y metro',
    perfilComprador:
      'Familias que buscan piso de tres habitaciones con presupuesto inferior a Poblenou; compradores que valoran L2 Verneda y conexión rápida al centro.',
    tipologiaEdificios:
      'Grandes manzanas de los 60–70 con muchos pisos de 80–95 m². Ascensor, estado de fachada comunitaria y orientación determinan el cierre.',
    keywords:
      'vender piso La Verneda, vender piso Verneda Barcelona, inmobiliaria La Verneda, vender vivienda 08020, vender piso Sant Martí Verneda',
    whatsappEnc: 'La%20Verneda',
    formPlaceholder: 'Dirección o zona en La Verneda',
    intro: [
      '<strong>La Verneda i la Pau</strong> es uno de los barrios más residenciales de Sant Martí: manzanas amplias, familias y precio por m² más contenido que Poblenou o el 22@. Orientativamente <strong>3.400–4.300 €/m²</strong> en 2026 para pisos de tres habitaciones en buen estado.',
      'Quien vende aquí compite con <a href="/vender-el-clot-la-sagrera-barcelona">El Clot</a> y <a href="/vender-sant-andreu">Sant Andreu</a> en la cabeza del comprador. Hay que explicar metro L2, servicios y metros reales, no solo “Sant Martí” genérico.',
      'Valoración gratuita en 24 h, panel con ofertas trazables y WhatsApp con Daniel o Sebastián. Cobramos solo si cierras: sobre 310.000 € el ahorro frente al 6% tradicional suele superar 15.000 € en comisión de agencia. Visitas concertadas en tus franjas habituales, incluso sábados por la mañana si lo necesitas.',
    ],
    sections: [
      {
        title: 'Familias y tres habitaciones',
        body: '<p>El comprador tipo busca escuelas, parques y metro. Si tu piso tiene distribución clásica de tres dormitorios, la ficha debe mostrarlo con claridad — muchos anuncios pierden leads por fotos que no enseñan habitaciones.</p>',
      },
      {
        title: 'Comparar con El Clot sin mezclar precios',
        body: '<p>El Clot tiene percepción de nodo de transporte; La Verneda, de barrio dormitorio. Usar comparables cruzados sin criterio deja el piso fuera de mercado. Valoración por micro-zona desde Les Corts.</p>',
      },
      {
        title: 'Finca y comunidad',
        body: '<p>En bloques de los 70, portal y ascensor importan. Una derrama anunciada o ITE desfavorable debe gestionarse antes de la primera visita seria.</p>',
      },
      {
        title: 'Enlaces',
        body: '<p>Ver también <a href="/vender-sant-marti">vender en Sant Martí</a>, <a href="/vender-poblenou">Poblenou</a> si el comprador sube presupuesto, o <a href="/vender-badalona">Badalona</a> limítrofe.</p>',
      },
      {
        title: 'Precio fijo y panel',
        body: '<p>3.000 € + IVA en escritura, panel con visitas filtradas y documentación centralizada. Sobre 310.000 €, el 6% tradicional supera 18.000 € solo en comisión.</p>',
      },
      {
        title: 'Valoración en 24 h',
        body: '<p>Sin exclusiva obligatoria. Daniel o Sebastián te responden con plan realista y compradores de cartera cuando el precio encaja.</p>',
      },
      {
        title: 'Metro L2 Verneda y conexión al centro',
        body: '<p>La Verneda se vende bien cuando el comprador entiende que L2 Verneda y L4 Besòs Mar ponen el centro a pocos minutos. Muchos comparan con Sant Andreu por precio similar: allí pesa el mercado de Rambla; aquí, manzanas amplias y pisos de 85–95 m². Ajustamos comparables por habitaciones, no solo por código postal 08020.</p>',
      },
      {
        title: 'Provençals del Poblenou y límite con Poblenou',
        body: '<p>En el límite con Provençals del Poblenou algunos vendedores creen que pueden pedir precio de 22@. Si tu finca es bloque de los 70 sin servicios premium, el comprador lo detecta en la primera visita. Mejor anclar expectativas desde la valoración que bajar precio tras ocho semanas de poca actividad.</p>',
      },
      {
        title: 'Comunidad grande: portal, ascensor y derramas',
        body: '<p>En manzanas extensas, el estado del portal y del ascensor condiciona la primera impresión. Pedimos actas y presupuestos de obra comunitaria antes de agendar visitas con hipoteca al 90%: un comprador primerizo no perdona una derrama sorpresa a quince días de arras.</p>',
      },
      {
        title: 'Vender para comprar en otro barrio',
        body: '<p>Si encadenas venta y compra, revisa plazos de arras y alquiler temporal. Enlazamos con guías de <a href="/vender-piso-traslado-barcelona">traslado</a> cuando el destino es fuera de Sant Martí. El panel concentra ofertas entrantes para que decidas con calma, no bajo presión del primer postor.</p>',
      },
      {
        title: 'Badalona limítrofe y comprador comparador',
        body: '<p>Muchos compradores de La Verneda comparan el mismo sábado con <a href="/vender-badalona">Badalona</a> por metros y precio. Si tu piso gana en distribución o comunidad, hay que demostrarlo en visita — no con €/m² copiado de un anuncio de Gorg. Valoración por finca concreta, no por etiqueta “Sant Martí” genérica.</p><p>Para vendedores que vienen de alquiler a familia, explicamos plazos de desalojo y estado de entrega antes de publicar, evitando visitas con compradores que necesitan posesión inmediata.</p>',
      },
      {
        title: 'Fotos de habitaciones y cocina',
        body: '<p>En pisos familiares de tres dormitorios, el comprador decide en la cocina y en el dormitorio principal. Priorizamos reportaje que enseñe armarios empotrados, baño completo y orientación del salón — no solo fachada genérica del bloque.</p><p>Si hay terraza o balcón corrido, lo medimos en metros útiles: en La Verneda muchas familias lo usan como comedor exterior y puede justificar un pequeño premium frente a pisos solo interiores.</p>',
      },
    ],
    relacionadas: [
      { slug: 'vender-el-clot-la-sagrera-barcelona', label: 'Vender en El Clot' },
      { slug: 'vender-sant-marti', label: 'Vender en Sant Martí' },
      { slug: 'vender-sant-andreu', label: 'Vender en Sant Andreu' },
      { slug: 'comprar-piso-sant-marti-barcelona', label: 'Comprar en Sant Martí' },
    ],
    faq: [
      { q: '¿La Verneda es Sant Martí?', a: 'Sí, pero el mercado no es el de Poblenou. Valoramos con comparables de Verneda y Pau.' },
      { q: '¿Tiempo de venta?', a: 'Con precio alineado, 50–90 días es habitual.' },
      { q: '¿Honorarios?', a: 'Precio fijo 3.000 € + IVA solo en escritura.' },
    ],
  },
];

function buildVender(cfg) {
  const argumento_principal = proseParagraphs(cfg.intro, cfg.sections);
  return {
    slug: cfg.slug,
    cluster: 'barrio',
    indexable: true,
    municipio: false,
    barrio: cfg.barrio,
    footerLabel: cfg.footerLabel,
    breadcrumbCurrent: cfg.breadcrumbCurrent,
    priority: cfg.priority,
    postalCodes: cfg.postalCodes,
    zonas: cfg.zonas,
    inmueblesQuery: cfg.inmueblesQuery,
    ejemploPrecio: cfg.ejemploPrecio,
    ahorro: cfg.ahorro,
    datosMercado: {
      precioM2: cfg.precioM2,
      tiempoVenta: cfg.tiempoVenta,
      tendencia: cfg.tendencia,
    },
    perfilComprador: cfg.perfilComprador,
    tipologiaEdificios: cfg.tipologiaEdificios,
    origen_lead: cfg.slug,
    heroImage: cfg.heroImage,
    heroImageAlt: cfg.heroImageAlt,
    meta: {
      title: `Vender piso en ${cfg.barrio}, Barcelona · Precio fijo · NuevaHabitat`,
      description: `¿Vendes en ${cfg.barrio}? Honorarios fijos 3.000€ + IVA, compradores filtrados y valoración en 24 h desde Les Corts. ${cfg.precioM2}.`,
      keywords: cfg.keywords,
    },
    hero: {
      h1: `¿Vendes tu piso en ${cfg.barrio}?`,
      lead: `Vende en ${cfg.barrio} con <strong>honorarios fijos de 3.000€ + IVA</strong>, valoración por micro-zona (${cfg.precioM2}) y compradores con solvencia contrastada — desde Les Corts.`,
    },
    argumento_principal,
    checklist: {
      title: `Checklist antes de vender en ${cfg.barrio}`,
      intro: 'Documentación y pricing local antes de publicar.',
      items: [
        'Comparables de cierre en la misma micro-zona',
        'Certificado energético y cédula al día',
        'Nota simple y estado de comunidad',
        'Fotos que muestren distribución real',
        'Hipoteca del comprador verificada antes de visitas',
        'Calcular 6% vs 3.630 € fijos',
      ],
    },
    faq: cfg.faq,
    relacionadas: cfg.relacionadas,
    keywords_footer: cfg.keywords.replace(/,/g, ' ·'),
    whatsappText: `Hola%2C%20quiero%20vender%20mi%20piso%20en%20${cfg.whatsappEnc}`,
    formPlaceholder: cfg.formPlaceholder,
  };
}

const COMPRADOR = [
  {
    slug: 'comprar-piso-cornella-barcelona',
    barrio: 'Cornellà',
    priority: 0.855,
    postalCodes: ['08940'],
    zonas: ['Centre', 'Sant Ildefons', 'Almeda', 'Can Mercader'],
    inmueblesQuery: 'Cornella',
    heroImage: 'imagenes/hospitalet3.jpg',
    keyword: 'comprar piso cornella barcelona',
    precioM2: '2.600 – 3.400 €/m²',
    whatsapp: 'Cornell%C3%A0',
    heroH1: 'Comprar piso en Cornellà: metro, familias y ticket metropolitano',
    heroLead:
      'Cornellà no compite con el Eixample en postal, pero sí con <strong>L’Hospitalet</strong> y Esplugues en la cabeza del comprador. Te ayudamos a elegir entre Centre, Sant Ildefons o Almeda con <strong>preaprobación real</strong>, visitas con checklist y negociación hasta escritura. <strong>5.000 € + IVA</strong>, solo al comprar.',
    intro: [
      'Comprar piso en <strong>Cornellà de Llobregat</strong> suele ser la respuesta a un presupuesto que en Barcelona ciudad solo alcanza para planta baja ruidosa o finca sin ascensor. El municipio concentra familias que valoran <strong>metro L5</strong>, colegios, parques y pisos de 75–95 m² a rangos orientativos de <strong>2.600–3.400 €/m²</strong> — muy distintos según estés en Centre, cerca de la Rambla de Cornellà, o en Sant Ildefons con conexión rápida a la estación.',
      'El error habitual es comparar anuncios de Cornellà con los de Barcelona sin mirar finca, orientación y minutos reales hasta tu trabajo. NuevaHabitat filtra incoherencias de portal, revisa comunidad en bloques de los 70–80 y negocia con cierres del mismo entorno, no con el precio de salida más optimista.',
      'Desde Les Corts coordinamos visitas en franjas que te permitan ver tráfico y ruido real, panel comprador con documentación centralizada y respuesta en 24 h laborables cuando registras presupuesto y plazo. No cobramos honorarios hasta escritura: tu riesgo es tiempo bien usado, no comisión adelantada. Te enviamos comparables de cierre cuando existan en la misma finca o calle paralela.',
    ],
    sections: [
      {
        title: 'Centre vs Sant Ildefons vs Almeda',
        body: '<p><strong>Centre</strong> y la Rambla concentran comercio y vida de barrio; Sant Ildefons atrae a quien prioriza Rodalies y L5 hacia Barcelona; Almeda y Can Mercader mezclan chalets adosados y pisos más recientes con otro perfil de ruido y aparcamiento. Antes de visitar, cerramos contigo qué micro-zona encaja con tu presupuesto y plazo de mudanza.</p><p>Un piso en Centre puede costar más por m² que uno en Almeda con mejor distribución: definimos techo de precio con ITP, notaría y reserva de reforma si la cocina es de los 90.</p>',
      },
      {
        title: 'Financiación en tickets de Cornellà',
        body: '<p>Con preaprobación para 220.000–280.000 €, un 80 m² bien orientado puede encajar; con 180.000 €, el radar debe ir a plantas medias sin ascensor o a reformar. El banco tasa por comparables del municipio: si ofertas por encima del mercado, la operación cae aunque el vendedor acepte.</p><p>Revisamos contigo si el precio pedido encaja con tasaciones recientes en la misma finca antes de entregar señal.</p>',
      },
      {
        title: 'Finca, comunidad y ITE',
        body: '<p>En bloques maduros, portal, ascensor y derramas pesan tanto como la reforma interior. Pedimos actas, última ITE y deuda de comunidad antes de ocupar tu sábado. Planta baja junto a local comercial exige visita con oído atento — no basta con fotos luminosas de mañana.</p>',
      },
      {
        title: 'Enlace con Barcelona y área',
        body: '<p>Si Cornellà es plan B frente a <a href="/comprar-piso-l-hospitalet-barcelona">L’Hospitalet</a> o <a href="/comprar-piso-barcelona">Barcelona ciudad</a>, comparamos desplazamientos y coste total (hipoteca + impuestos + reforma). También puedes explorar <a href="/inmuebles#q=Cornella">inmuebles en Cornellà</a> mientras activamos alertas en cartera.</p>',
      },
      {
        title: 'Negociación y arras sin prisas',
        body: '<p>Preparamos oferta con comparables de cierre en la misma calle o promoción, revisamos penalizaciones en arras y plazos de escritura. Coordinamos con tu entidad para que la tasación no llegue tarde.</p>',
      },
      {
        title: 'Honorarios y panel comprador',
        body: '<p><strong>5.000 € + IVA</strong> solo en escritura cuando compras. Panel con alertas, documentación centralizada y gestor en Les Corts — no comisiones cruzadas opacas con el vendedor.</p>',
      },
      {
        title: 'Próximo paso',
        body: '<p>Indica presupuesto máximo, habitaciones y si necesitas parking o colegio cercano. Respuesta en 24 h laborables con plan de búsqueda realista para Cornellà.</p>',
      },
      {
        title: 'Reforma y coste total de entrada',
        body: '<p>Muchos pisos en Cornellà necesitan actualizar cocina, ventanas o instalación eléctrica. Reservamos en tu plan financiero un 8–15% del precio de compra para obra si la finca es sólida pero interior anticuado — así no agotas liquidez el día de escritura. Visitamos contigo priorizando estructura, humedades y cubierta antes de estética.</p><p>Si el vendedor es particular, revisamos que la documentación de obra menor esté archivada; evita problemas en registro años después.</p>',
      },
      {
        title: 'Comparar con Esplugues y L’Hospitalet',
        body: '<p>El comprador metropolitano suele alternar Cornellà con <a href="/comprar-piso-esplugues-barcelona">Esplugues</a> y L’Hospitalet en la misma hoja de cálculo. Te ayudamos a decidir con desplazamientos reales, impuestos idénticos en segunda mano y diferencial de €/m² por calidad de finca — no por moda de barrio.</p><p>Guardamos en el panel tus descartes explícitos — planta baja, sin ascensor, calle ruidosa — para no repetir errores en alertas automáticas de portal.</p>',
      },
    ],
    comoSteps: [
      { title: 'Micro-zona Cornellà', body: 'Centre, Ildefons o Almeda según ticket y transporte.' },
      { title: 'Alertas filtradas', body: 'Descartamos anuncios fuera de tasación antes de visitar.' },
      { title: 'Visitas con checklist', body: 'Finca, ruido, comunidad e ITE en bloques 70–80.' },
      { title: 'Oferta con datos', body: 'Comparables municipales, no precio de portal inflado.' },
      { title: 'Escritura coordinada', body: 'Notaría, registro y checklist de firma.' },
    ],
    faq: [
      { q: '¿Cornellà encaja si trabajo en Barcelona?', a: 'Muchos compradores usan L5 o Rodalies; cuantificamos minutos reales a tu destino antes de fijar micro-zona.' },
      { q: '¿Cuánto cuesta el servicio?', a: '5.000 € + IVA al comprador, solo en escritura.' },
      { q: '¿Podéis negociar con particulares?', a: 'Sí, preparamos y presentamos la oferta contigo.' },
    ],
    relacionadas: [
      { slug: 'vender-cornella', label: 'Vender en Cornellà' },
      { slug: 'comprar-piso-l-hospitalet-barcelona', label: "Comprar en L'Hospitalet" },
      { slug: 'comprar-piso-barcelona', label: 'Comprar en Barcelona' },
    ],
  },
  {
    slug: 'comprar-piso-ciutat-vella-barcelona',
    barrio: 'Ciutat Vella',
    priority: 0.87,
    postalCodes: ['08002', '08003', '08001'],
    zonas: ['Gòtic', 'Born', 'Barceloneta', 'Raval', 'Sant Pere'],
    inmueblesQuery: 'Ciutat Vella',
    heroImage: 'imagenes/ciutatvella2.jpg',
    keyword: 'comprar piso ciutat vella barcelona',
    precioM2: '4.000 – 6.500 €/m²',
    whatsapp: 'Ciutat%20Vella',
    heroH1: 'Comprar en Ciutat Vella: Gòtic, Born, Barceloneta y Raval no son el mismo mercado',
    heroLead:
      'Un piso en el <strong>Born</strong> no compite con uno en <strong>Barceloneta</strong> ni con planta baja en el <strong>Gòtic</strong>. Separamos micro-zonas, revisamos licencias turísticas en finca y negociamos con cierres de manzana. <strong>5.000 € + IVA</strong> solo al firmar.',
    intro: [
      '<strong>Ciutat Vella</strong> concentra cinco conversaciones distintas en pocos kilómetros: calles señoriales del Born, densidad turística del Gòtic, brisa y humedad en Barceloneta, gentrificación en el Raval norte y fincas protegidas en Sant Pere. Comprar aquí con la media del distrito en la cabeza suele acabar en tasación baja o en arras con sorpresas de comunidad.',
      'Rangos orientativos <strong>4.000–6.500 €/m²</strong> en 2026: un mismo número de habitaciones puede variar el doble según calle, planta, ascensor y ruido nocturno. NuevaHabitat trabaja desde Les Corts con visitas en horario que permita oír el barrio de verdad — no solo verlo a las 11:00 un domingo.',
      'Si vienes de otra ciudad, te orientamos sobre impuestos catalanes, reserva de entrada extra para tasación conservadora y calendario realista de búsqueda en Ciutat Vella — suele llevar más visitas filtradas que en barrios periféricos, pero cada una con criterio claro de descarte. Puedes combinar esta guía con visitas presenciales concertadas desde nuestra oficina en Les Corts. Te enviamos resumen escrito tras cada visita con pros, contras y siguiente paso recomendado, sin coste extra para ti.',
    ],
    sections: [
      {
        title: 'Born y Gòtic: patrimonio y ruido',
        body: '<p>En el Born compradores buscan techos altos y calles peatonales; en el Gòtic, cuidado con entresuelos húmedos y locales de ocio nocturno. Revisamos protección patrimonial, obras en finca y si hay concentración de licencias turísticas en planta baja que afecten al portal.</p><p>La luz en patio de manzana puede ser aceptable en invierno y asfixiante en verano: visitamos a distintas horas cuando la calle es comercial.</p>',
      },
      {
        title: 'Barceloneta: humedad, sal y temporada',
        body: '<p>Barceloneta premia la proximidad al mar pero castiga humedad, ruido estival y fincas sin ascensor en plantas altas. Compradores que vienen de zona interior subestiman el coste de ventanas, aislamiento y comunidad en edificios expuestos al viento.</p><p>Comparamos con <a href="/comprar-piso-poble-sec-barcelona">Poble-sec</a> si buscas playa con ticket algo más flexible.</p>',
      },
      {
        title: 'Raval y Sant Pere en el radar',
        body: '<p>El Raval no es homogéneo: MACBA y calles reformadas no comparten perfil con tramos más densos. Si tu presupuesto apunta a Ciutat Vella, definimos si el Raval norte encaja o si conviene ampliar a <a href="/comprar-piso-raval-barcelona">guía específica del Raval</a> o Eixample limítrofe.</p>',
      },
      {
        title: 'Documentación pre-arras imprescindible',
        body: '<p>Nota simple, estatutos, actas, certificado energético y cédula. En edificios antiguos, ITE y obras de fachada pueden retrasar hipotecas. No reservamos hasta revisar lo básico — evita perder señal por cargas descubiertas tarde.</p>',
      },
      {
        title: 'Competir con hipoteca cerrada',
        body: '<p>Los mejores pisos del Born salen en días. Llevar preaprobación, señal lista y flexibilidad en fecha de escritura te coloca delante de compradores aún negociando con el banco. Alertas en cartera privada cuando encaja tu checklist.</p>',
      },
      {
        title: 'Honorarios transparentes',
        body: '<p><strong>5.000 € + IVA</strong> al comprador en escritura. Sin inflar el precio del piso con comisiones cruzadas. Enlaza con <a href="/comprar-piso-barcelona">comprar en Barcelona</a> para criterios comunes de ITP y plazos.</p>',
      },
      {
        title: 'Registro comprador',
        body: '<p>Presupuesto, habitaciones y calles que descartas (ruido, turismo, sin ascensor). En 24 h laborables proponemos micro-zonas viables y primeros inmuebles filtrados o <a href="/inmuebles#q=Ciutat%20Vella">búsqueda en cartera</a>.</p>',
      },
      {
        title: 'ITP y gastos en Ciutat Vella',
        body: '<p>Reserva 10–12% sobre precio de compra para ITP, notaría, registro y gestoría en vivienda usada. En tickets altos del Born, un error de 30.000 € en precio de oferta se nota en liquidez post-firma. Cerramos techo negociable con tu banco antes de enamorarte de un salón con vigas vistas.</p><p>Si la vivienda está en régimen de protección o tiene limitaciones de uso, lo detectamos en nota simple antes de señal — no todas las fincas señoriales son libres de restricciones.</p>',
      },
      {
        title: 'Ascensor añadido y fincas sin lift',
        body: '<p>Muchas fincas del Gòtic carecen de ascensor original; algunas lo tienen añadido con cuota extra en comunidad. Comparamos precio por planta con edificios similares: una cuarta sin ascensor no compite con una segunda en finca con lift, aunque el anuncio pida lo mismo.</p><p>Si tienes movilidad reducida o carrito de bebé, descartamos de entrada plantas altas sin ascensor fiable — ahorras visitas imposibles y negociaciones que acaban en cancelación por tasación o accesibilidad.</p>',
      },
    ],
    comoSteps: [
      { title: 'Micro-zonas Ciutat Vella', body: 'Born, Gòtic, Barceloneta, Raval o Sant Pere según ticket.' },
      { title: 'Filtro turístico y ruido', body: 'Licencias en finca, locales y horarios de visita.' },
      { title: 'Finca protegida', body: 'ITE, derramas y normativa patrimonial.' },
      { title: 'Oferta con cierres', body: 'Comparables de manzana, no anuncio premium.' },
      { title: 'Hasta escritura', body: 'Coordinación banco, notaría y registro.' },
    ],
    faq: [
      { q: '¿Puedo comprar en Barceloneta para alquiler turístico?', a: 'Revisamos normativa y licencias en finca antes de recomendar una operación; no asumimos rentabilidad turística sin datos.' },
      { q: '¿Honorarios?', a: '5.000 € + IVA solo en escritura cuando compras.' },
      { q: '¿Visitas fuera de horario laboral?', a: 'Concertamos franjas donde se note ruido real del barrio.' },
    ],
    relacionadas: [
      { slug: 'vender-piso-ciutat-vella-barcelona', label: 'Vender Ciutat Vella' },
      { slug: 'comprar-piso-raval-barcelona', label: 'Comprar en el Raval' },
      { slug: 'comprar-piso-barcelona', label: 'Comprar Barcelona' },
    ],
  },
  {
    slug: 'comprar-piso-el-clot-barcelona',
    barrio: 'El Clot',
    priority: 0.86,
    postalCodes: ['08018', '08026'],
    zonas: ['El Clot', 'La Sagrera', 'Navas', 'Plaça de les Glòries'],
    inmueblesQuery: 'Clot',
    heroImage: 'imagenes/poblenou2.jfif',
    keyword: 'comprar piso el clot barcelona',
    precioM2: '3.700 – 4.800 €/m²',
    whatsapp: 'El%20Clot',
    heroH1: 'Comprar en El Clot: nodo L1, L2 y Rodalies con fincas muy distintas',
    heroLead:
      'El Clot atrae familias por <strong>metro, Rodalies y mercado</strong>, pero Navas, Sagrera y el entorno de <strong>Glòries</strong> no comparten el mismo €/m². Visitas con checklist en bloques 60–70, negociación con cierres locales y trámites hasta escritura. <strong>5.000 € + IVA</strong> solo al comprar.',
    intro: [
      'Comprar piso en <strong>El Clot</strong> es comprar conectividad: estación de metro Clot, intercambiador con Rodalies y autobuses hacia el 22@ o el centro en pocos minutos. Eso sostiene demanda de familias que comparan El Clot con <a href="/vender-el-clot-la-sagrera-barcelona">La Sagrera</a>, La Verneda o Poblenou según presupuesto — rangos orientativos <strong>3.700–4.800 €/m²</strong> según finca y reforma.',
      'El error es tratar “El Clot” como etiqueta única: un piso en Navas puede tener otro ruido y orientación que uno en la Rambla del Clot; cerca de Glòries el paisaje urbano cambia rápido. NuevaHabitat acota micro-zona antes de llenarte el fin de semana de visitas irrelevantes.',
      'Trabajamos con alertas en cartera privada y filtro de portales: cuando aparece un piso coherente con tu hipoteca en El Clot o Sagrera, te avisamos con ficha documental mínima revisada. Honorarios 5.000 € + IVA solo si compras; hasta entonces, acompañamiento sin presión comercial cruzada con el vendedor. Revisamos borrador de arras contigo antes de firmar cualquier señal.',
    ],
    sections: [
      {
        title: 'Familias, metros y colegios',
        body: '<p>Compradores tipo buscan tres habitaciones, ascensor y menos de quince minutos a su trabajo en Barcelona. Valoramos distancia real a L1/L2 Clot, parques y equipamientos. Si vienes de alquiler en Sant Martí, definimos si El Clot mejora desplazamiento sin subir ticket de forma desproporcionada.</p>',
      },
      {
        title: 'Bloques de los 60–70: portal y ascensor',
        body: '<p>Mucho stock son manzanas amplias con pisos de 80–95 m². Portal descuidado o ascensor en avería persistente negocian fuerte. Pedimos actas y presupuestos de obra comunitaria; un comprador con hipoteca al 90% no absorbe una derrama sorpresa.</p>',
      },
      {
        title: 'Glòries y transformación urbana',
        body: '<p>El entorno de Plaça de les Glòries cambia percepción calle a calle. Visitamos con criterio de ruido de obra y tráfico futuro, sin vender humo: contrastamos con comparables de cierre en la misma cuadra.</p>',
      },
      {
        title: 'No confundir con Poblenou premium',
        body: '<p>Algunos anuncios mezclan El Clot con precios de Poblenou reformado. Si tu presupuesto es Clot, filtramos outliers. Guía amplia: <a href="/comprar-piso-sant-marti-barcelona">comprar en Sant Martí</a>.</p>',
      },
      {
        title: 'Oferta, arras y tasación',
        body: '<p>Oferta basada en cierres recientes en la misma finca o calle paralela. Revisamos arras, plazos y penalizaciones. Alineamos precio con lo que el banco suele tasar en El Clot antes de señal.</p>',
      },
      {
        title: 'Servicio 5.000 € + IVA',
        body: '<p>Honorarios al comprador solo en escritura. Búsqueda activa, panel con alertas y acompañamiento burocrático. Explora <a href="/inmuebles#q=Clot">inmuebles en El Clot</a> mientras activamos cartera.</p>',
      },
      {
        title: 'Cuéntanos tu perfil',
        body: '<p>Presupuesto, habitaciones, necesidad de parking y fecha de mudanza. Respuesta en 24 h con plan de búsqueda en El Clot, Sagrera o Navas según encaje financiero.</p>',
      },
      {
        title: 'Parking comunitario y lista de espera',
        body: '<p>En El Clot muchos bloques tienen plaza de garaje en comunidad con lista de espera. Si necesitas coche, verificamos estatutos y cuota antes de ofertar — un piso barato sin plaza puede salir caro si pagas parking privado mensual. Lo incluimos en el coste total de vida, no solo en el precio de compra.</p>',
      },
      {
        title: 'Reformas integrales vs listos para entrar',
        body: '<p>El mercado mezcla pisos originales de los 70 con reformas de cocina abierta. Definimos contigo cuánta obra estás dispuesto a asumir: en algunos casos conviene pagar más por piso ya reformado si tu hipoteca no deja margen de liquidez post-escritura. Visitamos buscando humedades en baños antiguos y estado de tuberías comunitarias.</p><p>Rodalies y metro no compensan una finca con ITE desfavorable: descartamos antes de visita cuando la documentación disponible ya advierte riesgo.</p>',
      },
      {
        title: 'Mercado de alquiler y vivienda habitual',
        body: '<p>Parte del stock en El Clot rota entre comprador habitual e inversor que mira renta estable cerca de nodo de transporte. Si buscas vivienda propia, filtramos pisos con historial turístico en comunidad o contratos conflictivos. Si compras para alquilar larga duración, contrastamos renta achievable con cierres recientes en la calle — no con anuncios aspiracionales.</p><p>La Sagrera alta y Navas baja no comparten perfil de inquilino: te ayudamos a no mezclar comparables cuando negociamos precio con el vendedor o con la comunidad de propietarios.</p><p>En verano, conviene visitar pisos con orientación oeste para comprobar calor en salón — detalle que en invierno no se ve y condiciona factura y confort.</p>',
      },
    ],
    comoSteps: [
      { title: 'Clot vs Sagrera vs Navas', body: 'Micro-zona según ticket y transporte.' },
      { title: 'Búsqueda activa', body: 'Alertas off-market y filtro de portales.' },
      { title: 'Visitas en bloques 60–70', body: 'Ascensor, portal, luz y ruido.' },
      { title: 'Negociación local', body: 'Comparables de manzana en Sant Martí norte.' },
      { title: 'Escritura', body: 'ITP, notaría y checklist comprador.' },
    ],
    faq: [
      { q: '¿El Clot es buena opción con niños?', a: 'Muchas familias eligen por metro y superficie; definimos calles según colegio y parque prioritarios.' },
      { q: '¿Cuánto cuesta acompañamiento?', a: '5.000 € + IVA solo en escritura.' },
      { q: '¿Y La Sagrera?', a: 'La tratamos como micro-zona distinta dentro del mismo radar de búsqueda.' },
    ],
    relacionadas: [
      { slug: 'vender-el-clot-la-sagrera-barcelona', label: 'Vender El Clot' },
      { slug: 'comprar-piso-sant-marti-barcelona', label: 'Comprar Sant Martí' },
      { slug: 'comprar-piso-barcelona', label: 'Comprar Barcelona' },
    ],
  },
  {
    slug: 'comprar-piso-raval-barcelona',
    barrio: 'El Raval',
    priority: 0.86,
    postalCodes: ['08001', '08002'],
    zonas: ['Raval sud', 'Raval nord', 'MACBA', 'Rambla del Raval'],
    inmueblesQuery: 'Raval',
    heroImage: 'imagenes/raval1.jpg',
    keyword: 'comprar piso raval barcelona',
    precioM2: '3.500 – 5.200 €/m²',
    whatsapp: 'Raval',
    heroH1: 'Comprar en el Raval: MACBA, Rambla del Raval y dos mercados en uno',
    heroLead:
      'El <strong>Raval nord</strong> cerca de MACBA no comparte comprador con tramos más densos del sud. Revisamos ruido, finca y comunidad antes de ofertar; negociamos con datos y llegamos a escritura con checklist completo. <strong>5.000 € + IVA</strong> solo al firmar.',
    intro: [
      'Comprar piso en el <strong>Raval</strong> exige honestidad sobre calle, planta y horario: es uno de los barrios con mayor contraste entre renovación cultural (MACBA, CCCB, Rambla del Raval) y patologías clásicas de Ciutat Vella densa — humedad, ruido nocturno, plantas bajas con poca ventilación. Rangos orientativos <strong>3.500–5.200 €/m²</strong> según reforma, ascensor y orientación.',
      'Compradores jóvenes y creativos compiten con inversores que miran alquiler; familias exigen calles concretas y horarios de visita que muestren la realidad acústica. NuevaHabitat no romanticiza el barrio: filtra anuncios incoherentes, revisa comunidad y prepara ofertas con cierres del mismo tramo, no con el piso premium de portal fotogénico.',
      'El panel comprador concentra alertas, borradores de oferta y checklist pre-arras. Desde Mejía Lequerica 42 en Les Corts respondemos en horario comercial con criterio de calle, no con promesas de rentabilidad genérica. Si el Raval no encaja tras las primeras visitas, reorientamos presupuesto hacia Poble-sec o Eixample sur sin empezar de cero. Coordinamos cita notarial y entrega de llaves en el calendario acordado en arras.',
    ],
    sections: [
      {
        title: 'Raval nord vs sud: criterio de calle',
        body: '<p>Cerca de MACBA y Hospital Clínic muchos pisos reformados compiten con compradores con preaprobación media-alta; hacia el puerto y Rambla del Raval cambian objeciones de ruido y percepción de seguridad — sin generalizar, calle a calle. Definimos contigo calles objetivo y calles descartadas antes de la primera visita.</p>',
      },
      {
        title: 'Planta baja, entresuelo y patio',
        body: '<p>En el Raval, planta baja puede ser oportunidad de precio o trampa de humedad. Visitamos con checklist de ventilación, olores y luz a las 18:00. Entresuelo sobre bar con horario nocturno se descarta pronto si buscas dormitorios para niños.</p>',
      },
      {
        title: 'Comunidad y convivencia en finca densa',
        body: '<p>Edificios con mezcla de usos, locales en planta baja y historial de impagos en comunidad requieren lectura de actas. No ofertamos hasta entender derramas y conflictos recurrentes que el anuncio no menciona.</p>',
      },
      {
        title: 'Relación con Gòtic y Poble-sec',
        body: '<p>Si el Raval se queda corto en luz o silencio, ampliamos radar a <a href="/comprar-piso-ciutat-vella-barcelona">Ciutat Vella</a> limítrofe o <a href="/comprar-piso-poble-sec-barcelona">Poble-sec</a> con mejor orientación. Comparar desplazamientos al trabajo cierra la decisión.</p>',
      },
      {
        title: 'Inversión vs primera vivienda',
        body: '<p>Si compras para alquilar, revisamos normativa vigente y realismo de renta en la calle concreta — no proyecciones genéricas de “Barcelona centro”. Si es vivienda habitual, priorizamos finca con ascensor y distribución que no requiera obra integral el primer año.</p>',
      },
      {
        title: 'Negociación y honorarios',
        body: '<p><strong>5.000 € + IVA</strong> en escritura. Oferta apoyada en comparables del tramo, revisión de arras y coordinación con banco. <a href="/vender-piso-raval-barcelona">Guía vendedor Raval</a> para entender el otro lado de la mesa.</p>',
      },
      {
        title: 'Activa búsqueda',
        body: '<p>Formulario con presupuesto, calles preferidas y tolerancia a reforma. Alertas en <a href="/inmuebles#q=Raval">inmuebles Raval</a> y cartera privada cuando encaje checklist.</p>',
      },
      {
        title: 'Obra en vivienda protegida o convivencia con locales',
        body: '<p>Si compras para reformar, confirmamos licencias posibles y restricciones de fachada antes de presupuestar obra interior. Un local de ocio en planta baja puede condicionar ventilación y ruido años — lo evaluamos en visita nocturna cuando la calle lo requiere.</p><p>Compradores que vienen del Eixample por precio deben entender que el Raval exige más filtro calle a calle; no es “Eixample barato”, es otro mercado con otros riesgos y oportunidades.</p>',
      },
      {
        title: 'Financiación y tasación en Ciutat Vella densa',
        body: '<p>Algunas entidades tasen conservador en edificios antiguos del Raval: alineamos oferta con histórico de tasaciones en la finca o calle paralela. Llevar preaprobación sólida y entrada extra del 5–10% te evita perder el piso en favor de un comprador cash que no depende del banco.</p>',
      },
      {
        title: 'Cultura, servicios y calidad de vida real',
        body: '<p>El Raval ofrece museos, mercados y vida de barrio densa — también colas, terrazas nocturnas y calles con mucho tránsito peatonal. Si priorizas silencio absoluto, cruzamos candidatos con Sant Antoni o Poble-sec en la misma sesión de planificación. Si priorizas centralidad creativa, acotamos calles donde la convivencia encaja con tu horario de sueño y teletrabajo.</p><p>No vendemos lifestyle de postal: visitamos contigo y marcamos descartes explícitos para no repetir errores de portal infinito.</p><p>Hospital Clínic y universidades cercanas atraen compradores que aceptan densidad a cambio de minutos a pie — otro perfil distinto al de familia que busca colegio y parque infantil en la misma manzana.</p>',
      },
    ],
    comoSteps: [
      { title: 'Mapa calle a calle', body: 'Nord MACBA vs tramos sud según perfil.' },
      { title: 'Visitas acústicas', body: 'Horarios que revelan ruido real.' },
      { title: 'Finca densa', body: 'Actas, locales en bajo y ascensor.' },
      { title: 'Oferta fundamentada', body: 'Cierres del mismo tramo del Raval.' },
      { title: 'Escritura', body: 'ITP Ciutat Vella y checklist firma.' },
    ],
    faq: [
      { q: '¿Es seguro comprar en el Raval?', a: 'Depende de calle, planta y uso que des del piso; definimos criterios realistas en la primera conversación, no promesas genéricas.' },
      { q: '¿Honorarios?', a: '5.000 € + IVA al comprador solo en escritura.' },
      { q: '¿Piso para reformar?', a: 'Sí, si el precio refleja obra, humedad y licencias necesarias.' },
    ],
    relacionadas: [
      { slug: 'vender-piso-raval-barcelona', label: 'Vender en el Raval' },
      { slug: 'comprar-piso-ciutat-vella-barcelona', label: 'Comprar Ciutat Vella' },
      { slug: 'comprar-piso-poble-sec-barcelona', label: 'Comprar Poble-sec' },
    ],
  },
];

function buildComprador(cfg) {
  const b = cfg.barrio;
  const sections = cfg.sections;
  const intro = cfg.intro;
  const defaultSteps = [
    { title: 'Presupuesto real', body: 'Cerramos techo de precio con tu banco y gastos de compra (ITP, notaría).' },
    { title: 'Búsqueda filtrada', body: 'Alertas en cartera y filtro de anuncios incoherentes.' },
    { title: 'Visitas con checklist', body: 'Finca, luz, ruido, comunidad e ITE antes de ofertar.' },
    { title: 'Oferta y negociación', body: 'Comparables de cierre y estrategia de arras.' },
    { title: 'Escritura', body: 'Coordinación notarial y checklist de firma.' },
  ];
  return {
    slug: cfg.slug,
    cluster: 'comprador',
    compradorTipo: 'barrio',
    indexable: true,
    barrio: b,
    footerLabel: `Comprar en ${b}`,
    breadcrumbCurrent: b,
    postalCodes: cfg.postalCodes,
    zonas: cfg.zonas,
    inmueblesQuery: cfg.inmueblesQuery,
    heroImage: cfg.heroImage,
    heroImageAlt: `Comprar piso en ${b} con NuevaHabitat`,
    origen_lead: cfg.slug,
    priority: cfg.priority,
    keyword_principal: cfg.keyword,
    meta: {
      title: `Comprar piso en ${b}, Barcelona · Acompañamiento comprador · NuevaHabitat`,
      description: `Comprar en ${b} con guía experto: búsqueda, negociación, trámites hasta escritura. ${cfg.precioM2}. 5.000€ + IVA solo al cerrar.`,
      keywords: `${cfg.keyword}, agente comprador ${b}, comprar vivienda Barcelona`,
    },
    hero: {
      h1: cfg.heroH1 || `Comprar piso en ${b} con acompañamiento de principio a fin`,
      lead:
        cfg.heroLead ||
        `En ${b} el mercado castiga al comprador improvisado. Te ayudamos a <strong>encontrar piso</strong>, negociar con datos y llegar a escritura con garantías. <strong>5.000 € + IVA</strong>, solo al firmar.`,
    },
    datosMercado: {
      precioM2: cfg.precioM2,
      tiempoVenta: 'Operaciones rápidas si la financiación está cerrada',
      tendencia: 'Alta competencia entre compradores en tickets medios',
    },
    como_ayudamos: {
      title: `Servicio integral para comprar en ${b}`,
      steps: cfg.comoSteps || defaultSteps,
    },
    argumento_principal: proseParagraphs(intro, sections),
    checklist: {
      title: `Checklist comprador en ${b}`,
      intro: 'Antes de ofertar:',
      items: [
        'Preaprobación hipotecaria o liquidez acreditada',
        'Presupuesto total con impuestos y notaría',
        'Criterios de planta y ascensor',
        'Revisión de comunidad e ITE',
        'Plazo de mudanza alineado con arras',
      ],
    },
    faq:
      cfg.faq || [
        { q: '¿Cuánto cuesta el servicio?', a: '5.000 € + IVA al comprador, solo en escritura cuando cierras.' },
        { q: '¿Negociáis con el vendedor?', a: 'Sí, preparamos y negociamos la oferta contigo.' },
        { q: '¿Gestionáis trámites?', a: 'Acompañamos documentación y coordinación hasta firma.' },
      ],
    relacionadas: cfg.relacionadas,
    keywords_footer: `${cfg.keyword} · acompañamiento comprador ${b} · trámites compra Barcelona`,
    whatsappText: `Hola%2C%20quiero%20comprar%20piso%20en%20${cfg.whatsapp}`,
    formPlaceholder: `Zona en ${b} (opcional)`,
  };
}

function main() {
  VENDER.forEach((cfg) => {
    const out = path.join(BARrio_DIR, `${cfg.slug}.json`);
    fs.writeFileSync(out, `${JSON.stringify(buildVender(cfg), null, 2)}\n`, 'utf8');
    console.log('Wrote', path.relative(ROOT, out));
  });
  COMPRADOR.forEach((cfg) => {
    const out = path.join(COMPRADOR_DIR, `${cfg.slug}.json`);
    fs.writeFileSync(out, `${JSON.stringify(buildComprador(cfg), null, 2)}\n`, 'utf8');
    console.log('Wrote', path.relative(ROOT, out));
  });
}

if (require.main === module) {
  main();
}

module.exports = { buildVender, buildComprador, proseParagraphs, BARrio_DIR, COMPRADOR_DIR, ROOT };
