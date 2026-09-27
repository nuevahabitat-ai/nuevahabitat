/**
 * Lote 9 — vender + comprador (micro-barrios Barcelona).
 * Uso: node scripts/scaffold-barrios-barcelona-lote9.js
 */
const fs = require('fs');
const path = require('path');
const { buildVender, buildComprador, BARrio_DIR, COMPRADOR_DIR, ROOT } = require('./scaffold-barrios-barcelona-batch.js');

const VENDER = [
  {
    slug: 'vender-vila-olimpica-barcelona',
    barrio: 'Vila Olímpica',
    breadcrumbCurrent: 'Vila Olímpica',
    footerLabel: 'Vender en Vila Olímpica',
    priority: 0.86,
    postalCodes: ['08005'],
    zonas: ['Vila Olímpica', 'Port Olímpic', 'Nova Icària', 'Límite Poblenou'],
    inmueblesQuery: 'Vila Olimpica',
    ejemploPrecio: 520000,
    ahorro: '28.200',
    heroImage: 'imagenes/barcelona2.jpg',
    heroImageAlt: 'Piso en la Vila Olímpica, Barcelona',
    precioM2: '5.000 – 6.800 €/m²',
    tiempoVenta: '45 – 80 días',
    tendencia: 'Demanda estable por playa, ocio y familias que comparan con Diagonal Mar',
    perfilComprador:
      'Familias y parejas con financiación cerrada que buscan piscina comunitaria, terraza y minutos a la playa; profesionales que teletrabajan y valoran luz; compradores que cruzan el mismo fin de semana promociones de los noventa con obra nueva de Poblenou.',
    tipologiaEdificios:
      'Vivienda olímpica de los 90 con muchas plantas medias, terrazas y comunidades con piscina. El estado de fachada, ascensor y parking condiciona más que en barrios del Eixample clásico.',
    keywords:
      'vender piso Vila Olímpica, vender piso Vila Olimpica Barcelona, inmobiliaria Vila Olímpica, vender vivienda 08005, vender piso playa Barcelona',
    whatsappEnc: 'Vila%20Ol%C3%ADmpica',
    formPlaceholder: 'Edificio o calle en Vila Olímpica',
    intro: [
      '<strong>Vila Olímpica</strong> concentra uno de los pocos barrios de Barcelona donde la playa es argumento comercial real, no metáfora de marketing. En 2026 el rango orientativo ronda <strong>5.000–6.800 €/m²</strong> según orientación, parking y estado interior — por encima de La Verneda y por debajo de las torres más premium de Diagonal Mar.',
      'Vender aquí implica competir con anuncios que mezclan Nova Icària, Poblenou industrial y promociones con piscina. El comprador compara terraza, gastos de comunidad y ruido nocturno del Port Olímpic. Un precio medio del distrito de Sant Martí suele fallar en la primera quincena de visitas.',
      'Honorarios fijos <strong>3.000 € + IVA</strong> solo en escritura, valoración en 24 h desde Les Corts y visitas solo con solvencia contrastada. Daniel o Sebastián te responden por WhatsApp en horario comercial.',
    ],
    sections: [
      {
        title: 'Nova Icària vs edificios del Port Olímpic',
        body: '<p>No todos los pisos de la Vila Olímpica compiten en la misma liga. Las calles más próximas al puerto reciben más turismo de fin de semana; las de Nova Icària suelen atraer familias que priorizan parque y piscina. Valoramos con comparables de la misma manzana, no con el anuncio más caro de Idealista.</p><p>Si tu terraza da a un eje con terrazas nocturnas, conviene ser transparentes en la ficha: el comprador que busca silencio absoluto descartará solo, y el que acepta ocio a cambio de playa llegará con expectativas alineadas.</p>',
      },
      {
        title: 'Parking, trastero y ticket total',
        body: '<p>En la Vila Olímpica la plaza de garaje puede mover varios miles de euros la operación. Compradores con coche de familia suelen exigir parking subterráneo; si vendes sin plaza, el descuento debe estar en el precio desde el día uno. Revisamos titularidad, cuota separada y lista de espera en la comunidad.</p><p>El trastero incluido reduce fricción en mudanzas de piso grande: lo explicitamos en la presentación comercial para no perder visitas por “falta de espacio” cuando sí existe en comunidad.</p>',
      },
      {
        title: 'Comunidad con piscina y conserjería',
        body: '<p>Muchas fincas olímpicas tienen piscina comunitaria y conserje. El comprador financiado pide actas, derramas previstas y estado de instalaciones antes de arras. Anticipar ITE de finca y deuda de comunidad acorta plazos.</p><p>Subimos documentación al panel vendedor junto con visitas y ofertas para que no haya sorpresas a quince días de firma.</p>',
      },
      {
        title: 'Comparar con Diagonal Mar y Poblenou',
        body: '<p>El mismo comprador suele visitar <a href="/vender-diagonal-mar-barcelona">Diagonal Mar</a> el sábado por la mañana y tu piso por la tarde. Allí prima stock más reciente; aquí, terraza amplia y playa a pie. Si no tienes vistas al mar, no compitas en precio con torres que sí las tienen.</p><p>Enlazamos también con <a href="/vender-poblenou">Poblenou</a> cuando el activo está en el límite urbanístico.</p>',
      },
      {
        title: 'Reforma interior en pisos de los 90',
        body: '<p>Cocina y baños originales pueden parecer anticuados frente a promociones nuevas. Una reforma parcial documentada —facturas, licencias si aplican— suele acortar negociación. Evitamos fotos de stock: mostramos dormitorios, terraza y salón con luz real.</p><p>Certificado energético en clase media-baja: anticipamos coste orientativo de mejora para que no sea palanca de última hora.</p>',
      },
      {
        title: 'Ruido, ocio y horarios de visita',
        body: '<p>Conviene agendar visitas en distintos horarios cuando la calle tiene ocio nocturno. El comprador que teletrabaja valora silencio entre semana; el que busca vida social acepta más ruido si el precio encaja.</p><p>Filtramos curiosos sin hipoteca para no saturar tu fin de semana.</p>',
      },
      {
        title: 'Honorarios fijos desde Les Corts',
        body: '<p>3.000 € + IVA solo en escritura. Sobre 520.000 €, un 6% tradicional supera 31.000 € en comisión; el importe fijo protege tu neto si el comprador negocia bien.</p><p>Sin venta, no pagas honorarios de agencia.</p>',
      },
      {
        title: 'Panel, ofertas y arras',
        body: '<p>Ves calendario, documentos y ofertas en el panel vendedor. Solo entran visitas con hipoteca preaprobada o liquidez contrastada.</p><p>Coordinamos arras y plazos de escritura con tu banco si hay hipoteca pendiente.</p>',
      },
      {
        title: 'Vender sin exclusiva larga',
        body: '<p>Si ya estás en portal con otra agencia, podemos revisar pricing y activar compradores de cartera sin encadenarte a doce meses de exclusiva.</p><p>Valoración gratuita con dirección aproximada, estado interior y carga hipotecaria.</p>',
      },
      {
        title: 'Enlaces útiles en Sant Martí',
        body: '<p>Guía amplia <a href="/vender-sant-marti">vender en Sant Martí</a>, <a href="/inmobiliaria-precio-fijo-barcelona">precio fijo Barcelona</a> y <a href="/comprar-piso-sant-marti-barcelona">compradores en Sant Martí</a>.</p>',
      },
    ],
    relacionadas: [
      { slug: 'vender-diagonal-mar-barcelona', label: 'Vender en Diagonal Mar' },
      { slug: 'vender-poblenou', label: 'Vender en Poblenou' },
      { slug: 'comprar-piso-vila-olimpica-barcelona', label: 'Comprar en Vila Olímpica' },
      { slug: 'vender-piso-barceloneta', label: 'Vender en Barceloneta' },
    ],
    faq: [
      { q: '¿Vila Olímpica es lo mismo que Barceloneta?', a: 'No en tipología ni en precio. La Vila Olímpica es sobre todo vivienda de los 90 con piscina comunitaria; Barceloneta mezcla finca más antigua y turismo intenso.' },
      { q: '¿Cuánto tarda una venta bien de precio?', a: 'Entre 45 y 80 días es habitual si el ticket encaja con financiación del comprador tipo.' },
      { q: '¿Cuánto cuesta vender?', a: '3.000 € + IVA en escritura. Sin venta, no pagas honorarios de agencia.' },
    ],
  },
  {
    slug: 'vender-camp-de-larpa-barcelona',
    barrio: "Camp de l'Arpa",
    breadcrumbCurrent: "Camp de l'Arpa",
    footerLabel: "Vender en Camp de l'Arpa",
    priority: 0.855,
    postalCodes: ['08041', '08025'],
    zonas: ["Camp de l'Arpa", 'Sant Martí de Provençals', 'El Clot sud', 'Gran Via'],
    inmueblesQuery: "Camp de l'Arpa",
    ejemploPrecio: 385000,
    ahorro: '19.800',
    heroImage: 'imagenes/santmarti1.webp',
    heroImageAlt: "Piso en Camp de l'Arpa, Barcelona",
    precioM2: '3.800 – 4.900 €/m²',
    tiempoVenta: '50 – 90 días',
    tendencia: 'Familias que buscan tres habitaciones y metro sin ticket de Poblenou reformado',
    perfilComprador:
      'Familias con hijos que comparan El Clot, La Verneda y Camp de l\'Arpa por metros y precio; compradores que trabajan en zona Fòrum o Poblenou y aceptan diez minutos más de metro a cambio de más dormitorios.',
    tipologiaEdificios:
      'Manzanas amplias de los 60–80, muchos pisos de 80–100 m² con balcón corrido. Portal, ascensor y orientación pesan más que en micro-barrios premium.',
    keywords:
      "vender piso Camp de l'Arpa, vender piso Camp de l Arpa Barcelona, inmobiliaria Camp de l'Arpa, vender vivienda 08041, vender piso Sant Martí",
    whatsappEnc: 'Camp%20de%20l%27Arpa',
    formPlaceholder: "Calle o zona en Camp de l'Arpa",
    intro: [
      "<strong>Camp de l'Arpa</strong> es el barrio residencial que muchos compradores descubren cuando Poblenou y el Clot se les quedan cortos en metros o largos en precio. Rangos orientativos de <strong>3.800–4.900 €/m²</strong> en 2026 para pisos de tres habitaciones en buen estado.",
      'Quien vende aquí compite con <a href="/vender-el-clot-la-sagrera-barcelona">El Clot</a> y <a href="/vender-verneda-barcelona">La Verneda</a> en la misma búsqueda de portal. Hay que explicar metro L2/L5, escuelas y distribución real, no solo “Sant Martí”.',
      'Precio fijo 3.000 € + IVA en escritura, panel con visitas filtradas y valoración en 24 h desde Les Corts.',
    ],
    sections: [
      {
        title: 'Tres habitaciones como argumento central',
        body: '<p>El comprador tipo busca 80–95 m² con tres dormitorios. Si tu distribución es clásica, la ficha debe enseñar habitaciones y cocina — no solo salón luminoso. Muchos anuncios pierden leads por reportaje incompleto.</p>',
      },
      {
        title: 'El Clot a un lado, Verneda al otro',
        body: '<p>El Clot vende nodo de transporte; Camp de l\'Arpa vende barrio dormitorio con más calma. Mezclar comparables de El Clot sin ajuste deja el piso fuera de mercado. Valoración por micro-zona desde Mejía Lequerica 42.</p>',
      },
      {
        title: 'Finca de los 70: portal y ascensor',
        body: '<p>En bloques maduros, portal y ascensor condicionan la primera impresión. Derrama anunciada o ITE desfavorable debe gestionarse antes de visitas con hipoteca al 90%.</p>',
      },
      {
        title: 'Planta baja y locales comerciales',
        body: '<p>Plantas bajas junto a comercio exigen visita con oído atento al ruido. Lo indicamos en la ficha para no romper arras por sorpresas.</p>',
      },
      {
        title: 'Compradores desde Poblenou',
        body: '<p>Algunos bajan presupuesto desde <a href="/vender-poblenou">Poblenou</a> buscando más metros. El discurso comercial debe ser honesto sobre minutos reales hasta la playa o hasta la oficina.</p>',
      },
      {
        title: 'Documentación antes de publicar',
        body: '<p>Nota simple, certificado energético, actas de comunidad y estado de cargas. Centralizamos en panel para compradores financiados.</p>',
      },
      {
        title: 'Honorarios y ahorro frente al 6%',
        body: '<p>Sobre 385.000 €, el 6% tradicional supera 23.000 € solo en comisión. Precio fijo 3.000 € + IVA solo si cierras.</p>',
      },
      {
        title: 'Visitas en tus franjas',
        body: '<p>Solo agendamos compradores con preaprobación o liquidez. Tú eliges sábados o tardes entre semana.</p>',
      },
      {
        title: 'Venta encadenada',
        body: '<p>Si vendes para comprar fuera, revisa <a href="/vender-piso-antes-comprar-otro-barcelona">venta antes de comprar otro</a> y plazos de arras.</p>',
      },
      {
        title: 'Sant Martí sin confusión',
        body: '<p>Consulta <a href="/vender-sant-marti">vender en Sant Martí</a> para el distrito completo y <a href="/comprar-piso-sant-marti-barcelona">compradores activos</a>.</p>',
      },
    ],
    relacionadas: [
      { slug: 'vender-el-clot-la-sagrera-barcelona', label: 'Vender en El Clot' },
      { slug: 'vender-verneda-barcelona', label: 'Vender en La Verneda' },
      { slug: 'vender-poblenou', label: 'Vender en Poblenou' },
      { slug: 'comprar-piso-sant-marti-barcelona', label: 'Comprar en Sant Martí' },
    ],
    faq: [
      { q: "¿Camp de l'Arpa es Sant Martí?", a: 'Sí, pero el mercado no es el de Diagonal Mar. Valoramos con comparables del propio barrio.' },
      { q: '¿Tiempo de venta?', a: 'Con precio alineado, 50–90 días es habitual.' },
      { q: '¿Honorarios?', a: '3.000 € + IVA solo en escritura si cierras.' },
    ],
  },
  {
    slug: 'vender-hostafrancs-barcelona',
    barrio: 'Hostafrancs',
    breadcrumbCurrent: 'Hostafrancs',
    footerLabel: 'Vender en Hostafrancs',
    priority: 0.855,
    postalCodes: ['08014'],
    zonas: ['Hostafrancs', 'La Bordeta sud', 'Gran Via', 'Plaça Espanya'],
    inmueblesQuery: 'Hostafrancs',
    ejemploPrecio: 355000,
    ahorro: '18.000',
    heroImage: 'imagenes/sants2.jpg',
    heroImageAlt: 'Piso en Hostafrancs, Barcelona',
    precioM2: '3.600 – 4.600 €/m²',
    tiempoVenta: '50 – 95 días',
    tendencia: 'Demanda de familias y parejas por conexión con Sants y Montjuïc',
    perfilComprador:
      'Familias que comparan Hostafrancs con La Bordeta y Sants por precio; compradores que trabajan en Fira, Gran Via o zona Sants y buscan metro L1/L8 sin pagar postal de Les Corts.',
    tipologiaEdificios:
      'Eixample de l’ampliació y manzanas del Sants-Montjuïc con mezcla de finca con ascensor y bloques sin lift. Orientación y ruido de Gran Via son objeciones frecuentes.',
    keywords:
      'vender piso Hostafrancs, vender piso Hostafrancs Barcelona, inmobiliaria Hostafrancs, vender vivienda 08014, vender piso Sants Montjuïc',
    whatsappEnc: 'Hostafrancs',
    formPlaceholder: 'Dirección en Hostafrancs',
    intro: [
      '<strong>Hostafrancs</strong> suele aparecer en la shortlist del comprador que descarta el Eixample por precio pero no quiere salir de Barcelona ciudad. Rangos de <strong>3.600–4.600 €/m²</strong> según planta, ascensor y distancia a ruido de Gran Via.',
      'Vender bien implica separar tu piso de <a href="/vender-sants">Sants</a> y <a href="/vender-poble-sec">Poble-sec</a> en la narrativa: aquí pesan Carrer de la Creu Coberta, mercado de Hostafrancs y minutos a Plaça Espanya.',
      'Honorarios fijos, valoración en 24 h y visitas cualificadas desde Les Corts.',
    ],
    sections: [
      {
        title: 'Gran Via y segunda línea',
        body: '<p>Pisos en primera línea de eje viario exigen precio ajustado o comprador que acepte ruido. En segunda línea, el mismo m² puede cerrar más rápido. Lo medimos con visitas reales, no con medias del distrito.</p>',
      },
      {
        title: 'Metro L1, L8 y Fira',
        body: '<p>Compradores vinculados a Fira de Barcelona o Sants Estació valoran Hostafrancs por conexión. Cuantificamos minutos caminando hasta la estación en la presentación comercial.</p>',
      },
      {
        title: 'Ascensor y planta sin lift',
        body: '<p>Sin ascensor, el ticket debe reflejar descuento desde el día uno. Compradores mayores o familias con carrito descartan plantas altas sin lift — filtramos expectativas antes de visitar.</p>',
      },
      {
        title: 'Comparar con La Bordeta',
        body: '<p>La Bordeta compite en precio similar. Si tu comunidad está más cuidada o tienes mejor orientación, hay que demostrarlo en visita, no solo en titular del anuncio.</p>',
      },
      {
        title: 'Reforma y certificado energético',
        body: '<p>Cocina y ventanas antiguas: reservamos en la negociación margen realista de obra. Certificado energético bajo: anticipamos coste orientativo.</p>',
      },
      {
        title: 'Piso alquilado',
        body: '<p>Si vendes <a href="/vender-piso-alquilado-barcelona">con inquilino</a>, separamos visitas de inversor y de familia que busca posesión libre.</p>',
      },
      {
        title: 'Pricing con comparables de Hostafrancs',
        body: '<p>Idealista mezcla Sants, Hostafrancs y Bordeta. Usamos cierres y visitas cualificadas en la misma finca o calle paralela.</p>',
      },
      {
        title: 'Panel vendedor',
        body: '<p>Ofertas, documentos y calendario en un solo sitio. WhatsApp con Daniel o Sebastián.</p>',
      },
      {
        title: 'Precio fijo',
        body: '<p>3.000 € + IVA en escritura. Sobre 355.000 € ahorras más de 18.000 € frente al 6% tradicional.</p>',
      },
      {
        title: 'Enlaces',
        body: '<p><a href="/vender-sants">Vender en Sants</a>, <a href="/vender-poble-sec">Poble-sec</a>, <a href="/venta-piso-economica-sants-barcelona">venta económica Sants</a>.</p>',
      },
    ],
    relacionadas: [
      { slug: 'vender-sants', label: 'Vender en Sants' },
      { slug: 'vender-poble-sec', label: 'Vender en Poble-sec' },
      { slug: 'vender-la-marina-barcelona', label: 'Vender en La Marina' },
      { slug: 'comprar-piso-sants-barcelona', label: 'Comprar en Sants' },
    ],
    faq: [
      { q: '¿Hostafrancs es Sants?', a: 'Es barrio del distrito Sants-Montjuïc con mercado propio. Valoramos con comparables de Hostafrancs, no solo “Sants” genérico.' },
      { q: '¿Cuánto cuesta vender?', a: '3.000 € + IVA solo en escritura si cierras.' },
      { q: '¿Visitas fines de semana?', a: 'Tú defines franjas; solo entran compradores contrastados.' },
    ],
  },
  {
    slug: 'vender-guinardo-barcelona',
    barrio: 'El Guinardó',
    breadcrumbCurrent: 'El Guinardó',
    footerLabel: 'Vender en El Guinardó',
    priority: 0.855,
    postalCodes: ['08041', '08025'],
    zonas: ['El Guinardó', 'Can Baró', 'El Carmel sud', 'Hospital de Sant Pau'],
    inmueblesQuery: 'Guinardo',
    ejemploPrecio: 395000,
    ahorro: '20.400',
    heroImage: 'imagenes/horta2.jpg',
    heroImageAlt: 'Piso en El Guinardó, Barcelona',
    precioM2: '3.900 – 5.100 €/m²',
    tiempoVenta: '55 – 95 días',
    tendencia: 'Familias que buscan vistas, pendiente y precio por debajo de Gràcia',
    perfilComprador:
      'Familias que aceptan pendiente a cambio de terraza y luz; compradores que comparan Guinardó con Horta y el Carmel por metros; parejas que quieren Hospital de Sant Pau o metro Guinardó cerca.',
    tipologiaEdificios:
      'Edificios en pendiente con muchas escaleras, balcones amplios y algunas fincas sin ascensor en tramos altos. Vistas y orientación pueden justificar premium frente a pisos solo interiores.',
    keywords:
      'vender piso Guinardó, vender piso El Guinardó Barcelona, inmobiliaria Guinardó, vender vivienda 08041, vender piso Horta Guinardó',
    whatsappEnc: 'Guinard%C3%B3',
    formPlaceholder: 'Calle o zona en El Guinardó',
    intro: [
      '<strong>El Guinardó</strong> mezcla pendiente, vistas y vivienda familiar a minutos de <a href="/vender-horta">Horta</a> y del modernismo del Hospital de Sant Pau. Rangos orientativos de <strong>3.900–5.100 €/m²</strong> según planta, ascensor y calidad de terraza.',
      'Vender aquí no es lo mismo que vender en Gràcia: el comprador evalúa escaleras, aparcamiento en calle y tiempo real hasta metro. Un precio copiado de un piso plano en el Eixample estanca la venta.',
      'Valoración gratuita, precio fijo 3.000 € + IVA en escritura y compradores filtrados desde Les Corts.',
    ],
    sections: [
      {
        title: 'Pendiente, escaleras y ascensor',
        body: '<p>En tramos altos sin ascensor, el descuento debe ser coherente desde la publicación. Compradores con carrito o movilidad reducida descartan tarde — mejor filtrar en la ficha que perder arras.</p><p>Con ascensor parcial o finca en batería, documentamos claramente cuántos tramos quedan sin lift.</p>',
      },
      {
        title: 'Vistas y terraza',
        body: '<p>Una terraza con vista despejada puede justificar premium frente a pisos en hoya. Fotos al atardecer y en día nublado ayudan a vender la orientación sin exagerar.</p>',
      },
      {
        title: 'Can Baró y límites con el Carmel',
        body: '<p>Micro-zonas no comparten la misma percepción de seguridad ni de ruido. Valoramos calle a calle, no etiqueta “Guinardó” genérica.</p>',
      },
      {
        title: 'Hospital de Sant Pau y servicios',
        body: '<p>Familias y profesionales sanitarios buscan proximidad al recinto modernista. Lo usamos en presentación cuando encaja con tu calle concreta.</p>',
      },
      {
        title: 'Comparar con Horta y Gràcia',
        body: '<p>Enlaces a <a href="/vender-horta">Horta</a> y <a href="/vender-gracia">Gràcia</a> cuando el comprador sube o baja presupuesto en la misma visita.</p>',
      },
      {
        title: 'Finca y comunidad en pendiente',
        body: '<p>Portales en desnivel, ITE y derramas pesan. Actas disponibles antes de visitas serias con hipoteca.</p>',
      },
      {
        title: 'Reforma en pisos de los 70–80',
        body: '<p>Instalación eléctrica y ventanas: reservamos margen en negociación si el interior es original pero la estructura es sólida.</p>',
      },
      {
        title: 'Honorarios fijos',
        body: '<p>3.000 € + IVA solo en escritura. Sobre 395.000 € el ahorro frente al 6% supera 20.000 €.</p>',
      },
      {
        title: 'Panel y visitas',
        body: '<p>Solo compradores con solvencia. Calendario en tus franjas habituales.</p>',
      },
      {
        title: 'Comprador en Guinardó',
        body: '<p>Consulta <a href="/comprar-piso-guinardo-barcelona">comprar en El Guinardó</a> para entender el otro lado de la mesa.</p>',
      },
    ],
    relacionadas: [
      { slug: 'vender-horta', label: 'Vender en Horta' },
      { slug: 'vender-gracia', label: 'Vender en Gràcia' },
      { slug: 'comprar-piso-guinardo-barcelona', label: 'Comprar en El Guinardó' },
      { slug: 'comprar-piso-horta-barcelona', label: 'Comprar en Horta' },
    ],
    faq: [
      { q: '¿Guinardó es Horta-Guinardó?', a: 'Sí, es uno de los barrios del distrito. El pricing es distinto al de la Vila de Gràcia.' },
      { q: '¿Vender sin ascensor?', a: 'Sí, con precio alineado desde el inicio y comprador que acepte planta.' },
      { q: '¿Honorarios?', a: 'Precio fijo 3.000 € + IVA solo en escritura.' },
    ],
  },
];

const COMPRADOR = [
  {
    slug: 'comprar-piso-diagonal-mar-barcelona',
    barrio: 'Diagonal Mar',
    priority: 0.86,
    postalCodes: ['08019'],
    zonas: ['Diagonal Mar', 'Parc de Diagonal Mar', 'Front marítim', 'Poblenou nord'],
    inmueblesQuery: 'Diagonal Mar',
    heroImage: 'imagenes/barcelona7.webp',
    keyword: 'comprar piso diagonal mar barcelona',
    precioM2: '4.800 – 6.200 €/m²',
    whatsapp: 'Diagonal%20Mar',
    heroH1: 'Comprar piso en Diagonal Mar: servicios, mar y ticket premium',
    heroLead:
      'Diagonal Mar concentra promociones con piscina y parking. Te ayudamos a comparar orientación, comunidad y precio frente a <strong>Poblenou</strong> con preaprobación real, visitas con checklist y negociación hasta escritura. <strong>5.000 € + IVA</strong>, solo al firmar.',
    intro: [
      'Comprar piso en <strong>Diagonal Mar</strong> suele ser la decisión de quien ya descartó el Eixample por precio pero no quiere renunciar a servicios comunitarios y proximidad al mar. El mercado mueve rangos orientativos de <strong>4.800–6.200 €/m²</strong> según torre, planta y parking incluido.',
      'El error habitual es comparar anuncios de Diagonal Mar con los de Poblenou industrial sin mirar antigüedad de finca, cuota de comunidad y minutos reales caminando. NuevaHabitat filtra incoherencias, revisa actas en comunidades grandes y negocia con cierres del mismo entorno.',
      'Desde Les Corts: alertas en cartera, panel comprador y respuesta en 24 h laborables cuando registras presupuesto y plazo. Honorarios solo en escritura.',
    ],
    sections: [
      {
        title: 'Torre con vistas vs segunda línea',
        body: '<p>Sin vistas al mar no pagues precio de torre premium. Definimos techo de oferta con comparables de la misma promoción y orientación.</p><p>Parking y trastero incluidos cambian el ticket total: lo desglosamos antes de señal.</p>',
      },
      {
        title: 'Comunidad con piscina y conserje',
        body: '<p>Pedimos actas, derramas y estado de instalaciones antes de ocupar tu sábado. Comprador financiado no perdona sorpresas a quince días de arras.</p>',
      },
      {
        title: 'Financiación en tickets altos',
        body: '<p>Con preaprobación sólida negocias desde posición de fuerza; sin ella, el vendedor prioriza comprador cash. Alineamos oferta con tasación probable del banco.</p>',
      },
      {
        title: 'Cruzar con Poblenou y Vila Olímpica',
        body: '<p>Mismo día suelen visitarse <a href="/comprar-piso-poblenou-barcelona">Poblenou</a> y Diagonal Mar. Te ayudamos a decidir con datos, no con fotos de portal.</p>',
      },
      {
        title: 'Certificado energético y obra nueva cercana',
        body: '<p>Si compites con promoción nueva, la reforma interior y la etiqueta energética deben estar alineadas con el precio pedido.</p>',
      },
      {
        title: 'Oferta y arras',
        body: '<p>Comparables de cierre, revisión de penalizaciones y plazos de escritura coordinados con tu entidad.</p>',
      },
      {
        title: 'Honorarios comprador',
        body: '<p><strong>5.000 € + IVA</strong> solo en escritura cuando compras. Sin compra, no facturamos.</p>',
      },
      {
        title: 'Registro de búsqueda',
        body: '<p>Indica presupuesto, habitaciones y si necesitas parking. Activamos alertas en <a href="/inmuebles#q=Diagonal%20Mar">inmuebles Diagonal Mar</a>.</p>',
      },
      {
        title: 'Guía vendedor',
        body: '<p><a href="/vender-diagonal-mar-barcelona">Vender en Diagonal Mar</a> explica el otro lado del mercado local.</p>',
      },
    ],
    faq: [
      { q: '¿Diagonal Mar encaja con hipoteca estándar?', a: 'Depende del ticket y de la tasación. Cerramos techo realista con tu banco antes de ofertar.' },
      { q: '¿Cuánto cuesta el servicio?', a: '5.000 € + IVA al comprador, solo en escritura.' },
      { q: '¿Negociáis con promotoras y particulares?', a: 'Sí, preparamos y presentamos la oferta contigo.' },
    ],
    relacionadas: [
      { slug: 'vender-diagonal-mar-barcelona', label: 'Vender en Diagonal Mar' },
      { slug: 'comprar-piso-poblenou-barcelona', label: 'Comprar en Poblenou' },
      { slug: 'comprar-piso-sant-marti-barcelona', label: 'Comprar en Sant Martí' },
    ],
  },
  {
    slug: 'comprar-piso-fort-pienc-barcelona',
    barrio: 'Fort Pienc',
    priority: 0.86,
    postalCodes: ['08013', '08018'],
    zonas: ['Fort Pienc', 'Estació del Nord', 'Arc de Triomf', 'Límite Eixample'],
    inmueblesQuery: 'Fort Pienc',
    heroImage: 'imagenes/eixample2.jpg',
    keyword: 'comprar piso fort pienc barcelona',
    precioM2: '4.500 – 5.800 €/m²',
    whatsapp: 'Fort%20Pienc',
    heroH1: 'Comprar en Fort Pienc: centralidad, parques y Eixample a un paso',
    heroLead:
      'Fort Pienc atrae a familias que quieren <strong>Arc de Triomf</strong>, Estació del Nord y precio por m² más contenido que el Eixample central. Búsqueda filtrada, visitas con checklist y <strong>5.000 € + IVA</strong> solo al cerrar.',
    intro: [
      'Comprar piso en <strong>Fort Pienc</strong> es la opción habitual de quien busca Barcelona céntrica sin ticket de Dreta de l’Eixample. Rangos de <strong>4.500–5.800 €/m²</strong> según finca, ascensor y orientación a parque.',
      'Mezclar anuncios de Fort Pienc con el Eixample sin criterio lleva a ofertas rechazadas o tasaciones bajas. Filtramos ruido de Gran Via, revisamos comunidad en bloques de los 60–70 y negociamos con cierres del barrio.',
      'Panel comprador desde Les Corts, gestor humano y alertas en cartera privada.',
    ],
    sections: [
      {
        title: 'Parc de l’Estació del Nord y entorno',
        body: '<p>Familias valoran espacio verde y pista de baloncesto. Visitamos contigo pisos a distintas horas para medir ruido de eventos.</p>',
      },
      {
        title: 'Límite con Eixample y Sagrada Família',
        body: '<p>El comprador compara Fort Pienc con <a href="/comprar-piso-eixample-barcelona">Eixample</a> el mismo fin de semana. Definimos qué micro-calles encajan con tu presupuesto.</p>',
      },
      {
        title: 'Finca con ascensor',
        body: '<p>En bloques sin lift, el descuento debe estar en el precio. No gastamos señal en pisos que tu banco no tasará.</p>',
      },
      {
        title: 'Locales en planta baja',
        body: '<p>Revisamos impacto acústico de bares o talleres antes de ofertar.</p>',
      },
      {
        title: 'Financiación',
        body: '<p>Preaprobación alineada con ITP, notaría y reserva de reforma si el interior es de los 80.</p>',
      },
      {
        title: 'Oferta fundamentada',
        body: '<p>Comparables de la misma calle, no precio de portal inflado.</p>',
      },
      {
        title: 'Honorarios',
        body: '<p>5.000 € + IVA solo en escritura.</p>',
      },
      {
        title: 'Vendedor local',
        body: '<p><a href="/vender-fort-pienc-barcelona">Guía vender Fort Pienc</a>.</p>',
      },
    ],
    faq: [
      { q: '¿Fort Pienc es barrio tranquilo?', a: 'Depende de calle. Definimos criterios en la primera conversación y visitamos con checklist acústico.' },
      { q: '¿Honorarios comprador?', a: '5.000 € + IVA solo en escritura.' },
      { q: '¿Plazo de búsqueda?', a: 'Depende de presupuesto; activamos alertas en cartera y filtramos portal.' },
    ],
    relacionadas: [
      { slug: 'vender-fort-pienc-barcelona', label: 'Vender en Fort Pienc' },
      { slug: 'comprar-piso-eixample-barcelona', label: 'Comprar en Eixample' },
      { slug: 'comprar-piso-el-clot-barcelona', label: 'Comprar en El Clot' },
    ],
  },
  {
    slug: 'comprar-piso-vila-olimpica-barcelona',
    barrio: 'Vila Olímpica',
    priority: 0.855,
    postalCodes: ['08005'],
    zonas: ['Vila Olímpica', 'Port Olímpic', 'Nova Icària', 'Platja'],
    inmueblesQuery: 'Vila Olimpica',
    heroImage: 'imagenes/barcelona2.jpg',
    keyword: 'comprar piso vila olimpica barcelona',
    precioM2: '5.000 – 6.800 €/m²',
    whatsapp: 'Vila%20Ol%C3%ADmpica',
    heroH1: 'Comprar en la Vila Olímpica: playa, terraza y piscina comunitaria',
    heroLead:
      'La Vila Olímpica mezcla vivienda de los 90, piscina comunitaria y ocio del Port Olímpic. Te guiamos con <strong>visitas en distintos horarios</strong>, revisión de comunidad y negociación. <strong>5.000 € + IVA</strong> al firmar.',
    intro: [
      'Comprar piso en la <strong>Vila Olímpica</strong> atrae a familias que quieren playa a pie y terraza amplia, y a parejas que comparan con Barceloneta y Diagonal Mar. Tickets orientativos de <strong>5.000–6.800 €/m²</strong>.',
      'No es el mismo mercado que Poblenou industrial: aquí pesan piscina, gastos de comunidad y ruido nocturno. Descartamos anuncios incoherentes antes de tu sábado.',
      'Honorarios solo en escritura; panel comprador y gestor en Les Corts.',
    ],
    sections: [
      {
        title: 'Ocio nocturno y teletrabajo',
        body: '<p>Visitas matutinas y nocturnas cuando hace falta. Comprador que trabaja desde casa necesita saber si la terraza es usable entre semana.</p>',
      },
      {
        title: 'Parking y trastero',
        body: '<p>Desglosamos ticket con y sin plaza. Muchas operaciones se rompen por aparcamiento, no por m².</p>',
      },
      {
        title: 'Comunidad olímpica',
        body: '<p>Actas, piscina y derramas: checklist antes de arras.</p>',
      },
      {
        title: 'Cruzar con Barceloneta',
        body: '<p><a href="/comprar-piso-ciutat-vella-barcelona">Ciutat Vella</a> incluye Barceloneta en comparativas de estilo de vida.</p>',
      },
      {
        title: 'Financiación premium',
        body: '<p>Tasación conservadora en algunas entidades: alineamos oferta con histórico de la finca.</p>',
      },
      {
        title: 'Negociación',
        body: '<p>Oferta con cierres de la misma promoción o calle paralela.</p>',
      },
      {
        title: 'Honorarios',
        body: '<p>5.000 € + IVA solo en escritura.</p>',
      },
      {
        title: 'Vendedor',
        body: '<p><a href="/vender-vila-olimpica-barcelona">Vender Vila Olímpica</a>.</p>',
      },
    ],
    faq: [
      { q: '¿Es barrio turístico?', a: 'Hay ocio y playa; elegimos calles según tu tolerancia a ruido.' },
      { q: '¿Coste del servicio?', a: '5.000 € + IVA al comprador en escritura.' },
      { q: '¿Piso para familia?', a: 'Sí, priorizamos piscina comunitaria, habitaciones y colegios cercanos según tu lista.' },
    ],
    relacionadas: [
      { slug: 'vender-vila-olimpica-barcelona', label: 'Vender en Vila Olímpica' },
      { slug: 'comprar-piso-poblenou-barcelona', label: 'Comprar en Poblenou' },
      { slug: 'comprar-piso-diagonal-mar-barcelona', label: 'Comprar Diagonal Mar' },
    ],
  },
  {
    slug: 'comprar-piso-guinardo-barcelona',
    barrio: 'El Guinardó',
    priority: 0.855,
    postalCodes: ['08041', '08025'],
    zonas: ['El Guinardó', 'Can Baró', 'Hospital de Sant Pau', 'El Carmel sud'],
    inmueblesQuery: 'Guinardo',
    heroImage: 'imagenes/horta2.jpg',
    keyword: 'comprar piso guinardo barcelona',
    precioM2: '3.900 – 5.100 €/m²',
    whatsapp: 'Guinard%C3%B3',
    heroH1: 'Comprar en El Guinardó: vistas, terraza y precio por debajo de Gràcia',
    heroLead:
      'El Guinardó ofrece pisos familiares en pendiente con terraza y luz. Visitas que miden <strong>escaleras y aparcamiento</strong>, filtro de finca y negociación hasta escritura. <strong>5.000 € + IVA</strong> solo al cerrar.',
    intro: [
      'Comprar piso en <strong>El Guinardó</strong> suele ser la alternativa a Gràcia cuando el presupuesto no alcanza pero se quieren metros y terraza. Rangos de <strong>3.900–5.100 €/m²</strong> muy variables por planta y ascensor.',
      'El comprador imprudente sube calle sin valorar tramos sin lift. Nosotros visitamos con checklist de pendiente, humedad en planta baja y estado de portal.',
      'Desde Les Corts: búsqueda filtrada, panel documental y honorarios solo en escritura.',
    ],
    sections: [
      {
        title: 'Ascensor parcial y tramos',
        body: '<p>Documentamos cuántos escalones quedan sin ascensor. Evita sorpresas el día de mudanza.</p>',
      },
      {
        title: 'Vistas vs hoya',
        body: '<p>Premium justificado solo con terraza usable y orientación. Comparables de la misma calle en distintas plantas.</p>',
      },
      {
        title: 'Can Baró y micro-zonas',
        body: '<p>No mezclamos precios de Can Baró con Guinardó bajo sin criterio.</p>',
      },
      {
        title: 'Hospital de Sant Pau',
        body: '<p>Perfil sanitario y familias: priorizamos calles con servicios y bus a metro.</p>',
      },
      {
        title: 'Comparar Horta y Gràcia',
        body: '<p><a href="/comprar-piso-horta-barcelona">Horta</a> y <a href="/comprar-piso-gracia-barcelona">Gràcia</a> en la misma planificación si dudas de distrito.</p>',
      },
      {
        title: 'Reforma necesaria',
        body: '<p>Reserva 8–12% del precio para cocina y ventanas si la finca es sólida pero interior anticuado.</p>',
      },
      {
        title: 'Oferta y banco',
        body: '<p>Tasación alineada antes de señal.</p>',
      },
      {
        title: 'Honorarios',
        body: '<p>5.000 € + IVA en escritura.</p>',
      },
    ],
    faq: [
      { q: '¿Comprar sin ascensor?', a: 'Sí, si el precio refleja planta y aceptas el esfuerzo diario.' },
      { q: '¿Honorarios?', a: '5.000 € + IVA solo en escritura.' },
      { q: '¿Encaja con niños?', a: 'Muchas familias sí; evaluamos parques, escuelas y tramos peligrosos en visita.' },
    ],
    relacionadas: [
      { slug: 'vender-guinardo-barcelona', label: 'Vender en El Guinardó' },
      { slug: 'comprar-piso-horta-barcelona', label: 'Comprar en Horta' },
      { slug: 'comprar-piso-gracia-barcelona', label: 'Comprar en Gràcia' },
    ],
  },
];

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

main();
