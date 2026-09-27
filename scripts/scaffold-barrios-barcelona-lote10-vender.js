/**
 * Lote 10 — solo vender (micro-barrios Barcelona).
 * Uso: node scripts/scaffold-barrios-barcelona-lote10-vender.js
 */
const fs = require('fs');
const path = require('path');
const { buildVender, BARrio_DIR, ROOT } = require('./scaffold-barrios-barcelona-batch.js');

const VENDER = [
  {
    slug: 'vender-camp-den-grassot-barcelona',
    barrio: "Camp d'en Grassot",
    breadcrumbCurrent: "Camp d'en Grassot",
    footerLabel: "Vender en Camp d'en Grassot",
    priority: 0.855,
    postalCodes: ['08025', '08024'],
    zonas: ["Camp d'en Grassot", 'Gràcia nord', 'Sant Salvador', 'El Coll'],
    inmueblesQuery: "Camp d'en Grassot",
    ejemploPrecio: 420000,
    ahorro: '22.000',
    heroImage: 'imagenes/gracia4.jpg',
    heroImageAlt: "Piso en Camp d'en Grassot, Barcelona",
    precioM2: '4.200 – 5.400 €/m²',
    tiempoVenta: '50 – 90 días',
    tendencia: 'Familias que buscan Gràcia con ticket algo más contenido',
    perfilComprador:
      'Parejas y familias que comparan la Vila de Gràcia con Grassot por precio; compradores que valoran comercio de barrio y metro Joanic o Alfons X sin pagar postal de plaza del Sol.',
    tipologiaEdificios:
      'Finca de principios de siglo y bloques del Ensanche secundario con balcones. Plantas sin ascensor en calles en pendiente; estado de comunidad y reforma interior marcan el cierre.',
    keywords:
      "vender piso Camp d'en Grassot, vender piso Grassot Barcelona, inmobiliaria Gràcia nord, vender vivienda 08025, vender piso Joanic",
    whatsappEnc: 'Camp%20d%27en%20Grassot',
    formPlaceholder: "Calle en Camp d'en Grassot",
    intro: [
      "<strong>Camp d'en Grassot</strong> es la puerta de entrada a Gràcia para compradores con presupuesto ajustado: mismas calles de terrazas y vida de barrio, pero rangos orientativos de <strong>4.200–5.400 €/m²</strong> en 2026, por debajo de la Vila en muchas fincas.",
      'Vender aquí exige no mezclar comparables con <a href="/vender-gracia">Gràcia centro</a> ni con <a href="/vender-horta">Horta</a>. El comprador conoce la diferencia entre Joanic y plaza del Sol; el precio debe reflejar calle, ascensor y estado interior.',
      'Honorarios fijos <strong>3.000 € + IVA</strong> en escritura, valoración en 24 h desde Les Corts y visitas solo con hipoteca preaprobada o liquidez contrastada.',
    ],
    sections: [
      { title: 'Gràcia nord vs Vila de Gràcia en pricing', body: '<p>Un piso en Grassot no compite en precio con un piso en plaza del Sol. Valoramos con cierres de la misma calle y antigüedad de finca. Idealista mezcla etiquetas “Gràcia” y distorsiona expectativas del vendedor.</p><p>Si tu vivienda tiene terraza amplia y orientación sur, puede acercarse al ticket de la Vila; si es interior en pendiente, hay que anclar comparables honestos desde el día uno.</p>' },
      { title: 'Metro Joanic, Alfons X y desplazamientos', body: '<p>Compradores que trabajan en Eixample o zona Diagonal valoran minutos reales hasta metro. Cuantificamos en la ficha sin prometer “centro a cinco minutos” si no es cierto caminando.</p><p>Familias preguntan por escuelas y parques del Coll: lo incluimos cuando encaja con tu dirección.</p>' },
      { title: 'Pendiente, escaleras y ascensor', body: '<p>Grassot tiene calles inclinadas. Sin ascensor, el descuento debe estar en el precio publicado, no en negociación de última hora. Filtramos visitas de compradores que no aceptan plantas altas sin lift.</p>' },
      { title: 'Reforma interior y certificado energético', body: '<p>Muchas cocinas y baños son originales de reformas parciales años 90. Documentar obra reciente acorta arras. Certificado energético bajo: anticipamos coste orientativo de mejora.</p>' },
      { title: 'Comunidad y derramas', body: '<p>Actas, ITE y deuda de comunidad antes de visitas con banco al 80–90%. Subimos documentos al panel vendedor para evitar sorpresas.</p>' },
      { title: 'Piso alquilado o herencia', body: '<p>Si vendes <a href="/vender-piso-alquilado-barcelona">con inquilino</a> o entre herederos, separamos perfiles de visita y centralizamos ofertas trazables.</p>' },
      { title: 'Honorarios fijos y ahorro', body: '<p>Sobre 420.000 €, el 6% tradicional supera 25.000 € en comisión. Precio fijo 3.000 € + IVA solo si cierras en notaría.</p>' },
      { title: 'Panel y gestores', body: '<p>Daniel o Sebastián en Les Corts: WhatsApp en horario comercial, calendario de visitas en tus franjas.</p>' },
      { title: 'Compradores de cartera', body: '<p>Activamos demanda cualificada en cartera propia además de revisar pricing si ya publicas en portal.</p>' },
      { title: 'Enlaces útiles', body: '<p><a href="/vender-gracia">Vender en Gràcia</a>, <a href="/comprar-piso-gracia-barcelona">compradores en Gràcia</a>, <a href="/inmobiliaria-precio-fijo-gracia-barcelona">precio fijo Gràcia</a>.</p>' },
    ],
    relacionadas: [
      { slug: 'vender-gracia', label: 'Vender en Gràcia' },
      { slug: 'vender-horta', label: 'Vender en Horta' },
      { slug: 'vender-guinardo-barcelona', label: 'Vender en El Guinardó' },
      { slug: 'inmobiliaria-precio-fijo-gracia-barcelona', label: 'Precio fijo Gràcia' },
    ],
    faq: [
      { q: "¿Grassot es Gràcia?", a: 'Es barrio del distrito de Gràcia con mercado propio. Valoramos con comparables de Grassot, no solo de la Vila.' },
      { q: '¿Cuánto tarda la venta?', a: 'Con precio alineado, 50–90 días es habitual.' },
      { q: '¿Honorarios?', a: '3.000 € + IVA solo en escritura si vendes.' },
    ],
  },
  {
    slug: 'vender-la-bordeta-barcelona',
    barrio: 'La Bordeta',
    breadcrumbCurrent: 'La Bordeta',
    footerLabel: 'Vender en La Bordeta',
    priority: 0.855,
    postalCodes: ['08014', '08028'],
    zonas: ['La Bordeta', 'Magòria', 'Gran Via', 'Límite Hostafrancs'],
    inmueblesQuery: 'Bordeta',
    ejemploPrecio: 340000,
    ahorro: '17.400',
    heroImage: 'imagenes/sants1.jpg',
    heroImageAlt: 'Piso en La Bordeta, Barcelona',
    precioM2: '3.500 – 4.500 €/m²',
    tiempoVenta: '55 – 95 días',
    tendencia: 'Primera vivienda y familias que comparan Sants y Hostafrancs',
    perfilComprador:
      'Compradores primerizos con hipoteca al 80–90% que buscan metros y precio; familias que comparan La Bordeta con L’Hospitalet limítrofe; inversores locales con ticket contenido.',
    tipologiaEdificios:
      'Manzanas del Ensanche secundario y bloques de los 60–70. Ruido de Gran Via y plantas bajas con comercio son el triángulo habitual de objeciones.',
    keywords:
      'vender piso La Bordeta, vender piso Bordeta Barcelona, inmobiliaria La Bordeta, vender vivienda 08014, vender piso Sants Montjuïc',
    whatsappEnc: 'La%20Bordeta',
    formPlaceholder: 'Dirección en La Bordeta',
    intro: [
      '<strong>La Bordeta</strong> concentra vivienda familiar a precio más contenido que <a href="/vender-sants">Sants centro</a> o <a href="/vender-les-corts">Les Corts</a>. Rangos orientativos de <strong>3.500–4.500 €/m²</strong> según planta, ascensor y distancia a ruido viario.',
      'Quien vende debe separar La Bordeta de <a href="/vender-hostafrancs-barcelona">Hostafrancs</a> en la ficha: el comprador de portal suele confundir barrios del mismo distrito. Pricing por micro-zona evita semanas sin visitas serias.',
      'Valoración gratuita en 24 h, precio fijo 3.000 € + IVA en escritura y compradores filtrados desde Les Corts.',
    ],
    sections: [
      { title: 'Magòria y eje de Gran Via', body: '<p>Primera línea viaria vs calle residencial: dos mercados. Visitamos con atención acústica cuando hace falta. Comprador teletrabaja: transparencia sobre ruido entre semana.</p>' },
      { title: 'Metro Mercat Nou y Sants Estació', body: '<p>Conexión rodalies y L1: argumento para comprador que trabaja fuera del barrio. Minutos caminando desde tu portal, no estimaciones optimistas.</p>' },
      { title: 'Tres habitaciones y distribución', body: '<p>Familias buscan dormitorios reales. Reportaje completo: habitaciones, cocina y baño. Muchos anuncios en La Bordeta pierden leads por fotos solo de salón.</p>' },
      { title: 'Comparar con L’Hospitalet', body: '<p>Mismo sábado el comprador visita <a href="/vender-l-hospitalet">L’Hospitalet</a>. Si tu finca gana en ascensor o comunidad, demuéstralo en visita.</p>' },
      { title: 'Documentación y comunidad', body: '<p>Certificado energético, nota simple, actas. Comprador financiado no perdona derrama sorpresa.</p>' },
      { title: 'Piso para reformar', body: '<p>Precio debe reflejar obra. Compradores que reforman piden margen: alineamos salida con tasaciones recientes.</p>' },
      { title: 'Venta encadenada', body: '<p><a href="/vender-piso-antes-comprar-otro-barcelona">Vender antes de comprar otro</a>: plazos de arras coordinados.</p>' },
      { title: 'Honorarios fijos', body: '<p>3.000 € + IVA solo en escritura. Sobre 340.000 € ahorras más de 17.000 € frente al 6%.</p>' },
      { title: 'Sin exclusiva larga', body: '<p>Revisión de pricing y cartera sin obligarte a doce meses de exclusiva si ya estás en otra agencia.</p>' },
      { title: 'Enlaces', body: '<p><a href="/vender-sants">Sants</a>, <a href="/vender-hostafrancs-barcelona">Hostafrancs</a>, <a href="/venta-piso-economica-sants-barcelona">venta económica Sants</a>.</p>' },
    ],
    relacionadas: [
      { slug: 'vender-sants', label: 'Vender en Sants' },
      { slug: 'vender-hostafrancs-barcelona', label: 'Vender en Hostafrancs' },
      { slug: 'vender-la-marina-barcelona', label: 'Vender en La Marina' },
      { slug: 'vender-l-hospitalet', label: "Vender en L'Hospitalet" },
    ],
    faq: [
      { q: '¿La Bordeta es Sants?', a: 'Es barrio del distrito Sants-Montjuïc. Valoramos con comparables de Bordeta, no media genérica de Sants.' },
      { q: '¿Cuánto cuesta vender?', a: '3.000 € + IVA solo en escritura si cierras.' },
      { q: '¿Visitas cualificadas?', a: 'Sí, solo compradores con solvencia contrastada.' },
    ],
  },
  {
    slug: 'vender-provencals-del-poblenou-barcelona',
    barrio: 'Provençals del Poblenou',
    breadcrumbCurrent: 'Provençals del Poblenou',
    footerLabel: 'Vender en Provençals del Poblenou',
    priority: 0.855,
    postalCodes: ['08005', '08020'],
    zonas: ['Provençals del Poblenou', 'Límite Poblenou', 'Límite Verneda', 'Rambla de Prim'],
    inmueblesQuery: 'Provençals',
    ejemploPrecio: 405000,
    ahorro: '21.000',
    heroImage: 'imagenes/poblenou1.jpeg',
    heroImageAlt: 'Piso en Provençals del Poblenou, Barcelona',
    precioM2: '4.000 – 5.200 €/m²',
    tiempoVenta: '50 – 85 días',
    tendencia: 'Familias entre Poblenou reformado y La Verneda',
    perfilComprador:
      'Familias que buscan tres habitaciones sin ticket de torre en Diagonal Mar; compradores que trabajan en oficinas de Poblenou o zona Fòrum y aceptan finca de los 70–80 a cambio de metros.',
    tipologiaEdificios:
      'Manzanas residenciales de los 60–80 y algo de industrial reconvertido en el límite. Ascensor, fachada comunitaria y orientación pesan más que “marca Poblenou”.',
    keywords:
      'vender piso Provençals del Poblenou, vender piso Provençals Barcelona, inmobiliaria Provençals, vender vivienda 08005, vender piso Sant Martí',
    whatsappEnc: 'Proven%C3%A7als',
    formPlaceholder: 'Zona en Provençals del Poblenou',
    intro: [
      '<strong>Provençals del Poblenou</strong> es el tramo donde muchos compradores equilibran precio y cercanía al mar sin pagar Diagonal Mar. Orientativamente <strong>4.000–5.200 €/m²</strong> en 2026 para pisos de tres habitaciones en buen estado.',
      'Error frecuente: pedir precio de <a href="/vender-poblenou">Poblenou</a> industrial reformado estando en bloque de los 70. Valoración por finca concreta desde Les Corts.',
      'Precio fijo 3.000 € + IVA, panel vendedor y visitas en tus franjas.',
    ],
    sections: [
      { title: 'Límite con Poblenou y Verneda', body: '<p>Provençals no es La Verneda ni el Poblenou de oficinas reformadas. Comparables cruzados sin criterio estancan la venta. Micro-zona en cada valoración.</p>' },
      { title: 'Rambla de Prim y comercio', body: '<p>Comprador local valora servicios de proximidad. Lo reflejamos en presentación comercial sin inflar precio como si fuera primera línea de playa.</p>' },
      { title: 'Familias y tres dormitorios', body: '<p>Distribución clásica: enseñar habitaciones en fotos. Comprador compara con <a href="/vender-verneda-barcelona">La Verneda</a> el mismo día.</p>' },
      { title: 'Oficinas en Poblenou y desplazamiento', body: '<p>Profesionales que quieren reducir trayecto: minutos reales a bus o metro, no slogans genéricos.</p>' },
      { title: 'Comunidad en bloques grandes', body: '<p>Portal, ascensor, piscina comunitaria ocasional: revisar actas antes de visitas serias.</p>' },
      { title: 'Reforma parcial documentada', body: '<p>Cocina y baños actualizados acortan negociación frente a anuncios sin reforma al mismo precio.</p>' },
      { title: 'Honorarios y neto', body: '<p>Sobre 405.000 €, ahorro frente al 6% supera 21.000 € en comisión de agencia.</p>' },
      { title: 'Panel digital', body: '<p>Ofertas, documentos y calendario centralizados. WhatsApp con gestor asignado.</p>' },
      { title: 'Herencia y varios titulares', body: '<p>Trazabilidad de ofertas para herederos. Plazos alineados con comprador financiado.</p>' },
      { title: 'Enlaces Sant Martí', body: '<p><a href="/vender-sant-marti">Sant Martí</a>, <a href="/vender-diagonal-mar-barcelona">Diagonal Mar</a>, <a href="/comprar-piso-poblenou-barcelona">compradores Poblenou</a>.</p>' },
    ],
    relacionadas: [
      { slug: 'vender-poblenou', label: 'Vender en Poblenou' },
      { slug: 'vender-verneda-barcelona', label: 'Vender en La Verneda' },
      { slug: 'vender-diagonal-mar-barcelona', label: 'Vender en Diagonal Mar' },
      { slug: 'vender-sant-marti', label: 'Vender en Sant Martí' },
    ],
    faq: [
      { q: '¿Provençals es Poblenou?', a: 'Es barrio oficial de Sant Martí con mercado distinto al Poblenou industrial premium.' },
      { q: '¿Tiempo de venta?', a: '50–85 días con precio alineado es habitual.' },
      { q: '¿Honorarios?', a: '3.000 € + IVA solo en escritura.' },
    ],
  },
  {
    slug: 'vender-el-besos-barcelona',
    barrio: 'El Besòs',
    breadcrumbCurrent: 'El Besòs',
    footerLabel: 'Vender en El Besòs',
    priority: 0.85,
    postalCodes: ['08020', '08030'],
    zonas: ['El Besòs i el Maresme', 'Besòs Mar', 'Provençals de Sant Martí', 'Límite Badalona'],
    inmueblesQuery: 'Besos',
    ejemploPrecio: 295000,
    ahorro: '14.600',
    heroImage: 'imagenes/noubarris2.jpg',
    heroImageAlt: 'Piso en El Besòs, Barcelona',
    precioM2: '3.300 – 4.200 €/m²',
    tiempoVenta: '55 – 100 días',
    tendencia: 'Primera vivienda y familias que comparan Badalona y Sant Martí',
    perfilComprador:
      'Familias con presupuesto contenido que comparan El Besòs con Badalona y La Verneda; compradores que valoran metro L4 Besòs Mar y equipamientos del entorno del Fòrum.',
    tipologiaEdificios:
      'Grandes manzanas de los 60–80, vivienda protegida en algunos tramos y rehabilitaciones recientes. Ascensor y estado de fachada comunitaria condicionan financiación.',
    keywords:
      'vender piso El Besòs, vender piso Besòs Barcelona, inmobiliaria El Besòs, vender vivienda 08020, vender piso Besòs Mar',
    whatsappEnc: 'El%20Bes%C3%B2s',
    formPlaceholder: 'Dirección en El Besòs',
    intro: [
      '<strong>El Besòs</strong> (Besòs i el Maresme) es mercado de primera vivienda y familias que buscan metros en Barcelona ciudad sin ticket de Poblenou. Rangos de <strong>3.300–4.200 €/m²</strong> según finca y orientación.',
      'Vender bien implica honestidad sobre entorno, transporte y comparación con <a href="/vender-badalona">Badalona</a> limítrofe. Pricing por manzana, no “Sant Martí” genérico.',
      'Honorarios fijos 3.000 € + IVA, valoración en 24 h y visitas cualificadas.',
    ],
    sections: [
      { title: 'Besòs Mar y metro L4', body: '<p>Comprador primerizo pregunta por conexión al centro. Cuantificamos minutos reales hasta tu estación de referencia.</p>' },
      { title: 'Comparar con Badalona y Verneda', body: '<p>Mismo presupuesto puede ir a Gorg o a La Verneda. Si tu piso gana en distribución, demuéstralo en visita con datos, no con €/m² copiado.</p>' },
      { title: 'Manzanas amplias y tres habitaciones', body: '<p>Stock familiar de 80–95 m². Fotos de habitaciones y cocina completas en la ficha.</p>' },
      { title: 'Mejoras urbanísticas', body: '<p>Explicamos equipamientos y proyectos con datos públicos, sin promesas vacías. Transparencia acorta negociación.</p>' },
      { title: 'Vivienda protegida y titularidad', body: '<p>Algunos pisos tienen restricciones: revisamos nota simple antes de publicar precio incoherente con la realidad jurídica.</p>' },
      { title: 'Comunidad y derramas', body: '<p>Portal y ascensor en bloques de los 70: actas disponibles antes de visitas con hipoteca.</p>' },
      { title: 'Piso alquilado', body: '<p><a href="/vender-piso-alquilado-barcelona">Con inquilino</a>: filtramos inversor vs usuario final.</p>' },
      { title: 'Honorarios fijos', body: '<p>Sobre 295.000 €, ahorro frente al 6% supera 14.000 €.</p>' },
      { title: 'Panel vendedor', body: '<p>Ofertas trazables y documentación centralizada desde Les Corts.</p>' },
      { title: 'Enlaces', body: '<p><a href="/vender-verneda-barcelona">La Verneda</a>, <a href="/vender-sant-marti">Sant Martí</a>, <a href="/venta-piso-economica-barcelona">venta económica Barcelona</a>.</p>' },
    ],
    relacionadas: [
      { slug: 'vender-badalona', label: 'Vender en Badalona' },
      { slug: 'vender-verneda-barcelona', label: 'Vender en La Verneda' },
      { slug: 'vender-provencals-del-poblenou-barcelona', label: 'Vender Provençals' },
      { slug: 'vender-sant-marti', label: 'Vender en Sant Martí' },
    ],
    faq: [
      { q: '¿El Besòs es barrio de moda?', a: 'Es sobre todo mercado de precio contenido y familias. Estrategia realista en pricing y solvencia.' },
      { q: '¿Cuánto cuesta vender?', a: '3.000 € + IVA solo en escritura si cierras.' },
      { q: '¿Valoración gratuita?', a: 'Sí, en 24 h laborables desde Les Corts.' },
    ],
  },
  {
    slug: 'vender-roquetes-barcelona',
    barrio: 'Roquetes',
    breadcrumbCurrent: 'Roquetes',
    footerLabel: 'Vender en Roquetes',
    priority: 0.85,
    postalCodes: ['08042'],
    zonas: ['Roquetes', 'Trinitat Vella sud', 'Via Favència', 'Límite Nou Barris'],
    inmueblesQuery: 'Roquetes',
    ejemploPrecio: 265000,
    ahorro: '12.800',
    heroImage: 'imagenes/noubarris1.jpg',
    heroImageAlt: 'Piso en Roquetes, Barcelona',
    precioM2: '3.000 – 3.900 €/m²',
    tiempoVenta: '60 – 100 días',
    tendencia: 'Primera vivienda en Nou Barris con buena conexión metro',
    perfilComprador:
      'Familias que buscan precio de entrada en Barcelona ciudad; compradores que comparan Roquetes con Nou Barris y L’Hospitalet por metros y hipoteca.',
    tipologiaEdificios:
      'Bloques de los 60–70 con pisos amplios y muchas plantas sin ascensor. Comunidad, orientación y estado de portal determinan cierre más que diseño interior.',
    keywords:
      'vender piso Roquetes, vender piso Roquetes Barcelona, inmobiliaria Roquetes, vender vivienda 08042, vender piso Nou Barris',
    whatsappEnc: 'Roquetes',
    formPlaceholder: 'Dirección en Roquetes',
    intro: [
      '<strong>Roquetes</strong> es uno de los barrios de <a href="/vender-nou-barris">Nou Barris</a> con mayor stock familiar a ticket contenido: orientativamente <strong>3.000–3.900 €/m²</strong> en 2026.',
      'Vender aquí compite con percepción de “barrio lejano” si la ficha es pobre. Hay que explicar metro L3 Roquetes, equipamientos y metros reales del piso.',
      'Precio fijo 3.000 € + IVA en escritura, visitas filtradas y valoración gratuita.',
    ],
    sections: [
      { title: 'Metro Roquetes y bus a hospital', body: '<p>Comprador primerizo valora conexión. Minutos caminando y líneas de bus hacia centro sanitario o trabajo: datos concretos en la presentación.</p>' },
      { title: 'Pisos amplios sin ascensor', body: '<p>Descuento coherente por planta alta sin lift. Filtramos compradores que no aceptan escaleras.</p>' },
      { title: 'Comparar con Trinitat y Turó de la Peira', body: '<p>Nou Barris no es monolítico. Comparables de Roquetes, no media del distrito entero.</p>' },
      { title: 'Fotos de habitaciones y cocina', body: '<p>Familias deciden en distribución. Reportaje completo evita visitas fallidas.</p>' },
      { title: 'Financiación al 80–90%', body: '<p>Precio alineado con tasación bancaria. Evitamos meses de “probamos a ver” con curiosos sin capacidad.</p>' },
      { title: 'Comunidad y derramas', body: '<p>Actas antes de arras. Comprador financiado agradece transparencia.</p>' },
      { title: 'Venta por herencia', body: '<p>Varios titulares: panel con ofertas visibles. Enlace <a href="/vender-piso-herencia-barcelona">herencia</a> si aplica.</p>' },
      { title: 'Honorarios fijos', body: '<p>Sobre 265.000 €, 6% supera 15.000 €; precio fijo 3.630 € total con IVA orientativo.</p>' },
      { title: 'Gestores Les Corts', body: '<p>Daniel o Sebastián, WhatsApp y visitas en tus franjas.</p>' },
      { title: 'Enlaces', body: '<p><a href="/vender-nou-barris">Nou Barris</a>, <a href="/venta-piso-economica-nou-barris-barcelona">venta económica Nou Barris</a>, <a href="/vender-l-hospitalet">L’Hospitalet</a>.</p>' },
    ],
    relacionadas: [
      { slug: 'vender-nou-barris', label: 'Vender en Nou Barris' },
      { slug: 'vender-l-hospitalet', label: "Vender en L'Hospitalet" },
      { slug: 'vender-el-besos-barcelona', label: 'Vender en El Besòs' },
      { slug: 'venta-piso-economica-nou-barris-barcelona', label: 'Venta económica Nou Barris' },
    ],
    faq: [
      { q: '¿Roquetes es Nou Barris?', a: 'Sí. Valoramos con comparables de Roquetes, no solo etiqueta distrito.' },
      { q: '¿Tiempo de venta?', a: '60–100 días con precio realista es habitual.' },
      { q: '¿Honorarios?', a: '3.000 € + IVA solo en escritura si cierras.' },
    ],
  },
  {
    slug: 'vender-sagrada-familia-barcelona',
    barrio: 'Sagrada Família',
    breadcrumbCurrent: 'Sagrada Família',
    footerLabel: 'Vender junto a la Sagrada Família',
    priority: 0.86,
    postalCodes: ['08025', '08013'],
    zonas: ['Sagrada Família', 'Eixample esquerra', 'Límite Fort Pienc', 'Provença'],
    inmueblesQuery: 'Sagrada Familia',
    ejemploPrecio: 485000,
    ahorro: '26.000',
    heroImage: 'imagenes/eixample1.jpg',
    heroImageAlt: 'Piso cerca de la Sagrada Família, Barcelona',
    precioM2: '4.800 – 6.000 €/m²',
    tiempoVenta: '45 – 80 días',
    tendencia: 'Demanda estable por centralidad e icono turístico',
    perfilComprador:
      'Familias y parejas que buscan Eixample céntrico; compradores internacionales que aceptan turismo de paso a cambio de ubicación; inversores conscientes de normativa de alquiler turístico en la finca.',
    tipologiaEdificios:
      'Eixample clásico con mucha finca regia y algunos bloques reformados. Altura de techo, orientación a patio de manzana vs calle, y estado de ascensor marcan precio.',
    keywords:
      'vender piso Sagrada Família, vender piso Sagrada Familia Barcelona, inmobiliaria Sagrada Família, vender vivienda Eixample Sagrada Família, vender piso Provença',
    whatsappEnc: 'Sagrada%20Fam%C3%ADlia',
    formPlaceholder: 'Calle cerca de la Sagrada Família',
    intro: [
      'Vender piso cerca de la <strong>Sagrada Família</strong> es vender centralidad e icono mundial, pero también ruido turístico y fincas exigentes en comunidad. Rangos de <strong>4.800–6.000 €/m²</strong> según planta, ascensor y reforma.',
      'No mezclar comparables con <a href="/vender-eixample">Eixample</a> genérico ni con <a href="/vender-fort-pienc-barcelona">Fort Pienc</a>: calle concreta y orientación mandan.',
      'Honorarios fijos 3.000 € + IVA, valoración micro-zona y compradores cualificados desde Les Corts.',
    ],
    sections: [
      { title: 'Turismo de paso y vida diaria', body: '<p>Comprador residente pregunta por ruido y colas. Visitas en distintos horarios cuando hace falta. Transparencia evita arras rotas.</p>' },
      { title: 'Finca regia y patio de manzana', body: '<p>Altura de techo y suelo original pueden justificar premium. Interior oscuro a patio: precio distinto a fachada con luz.</p>' },
      { title: 'Normativa de alquiler turístico', body: '<p>Si el comprador pregunta por uso turístico, revisamos estatutos y normativa vigente antes de prometer rentabilidad.</p>' },
      { title: 'Comparar Fort Pienc y Dreta', body: '<p>Mismo comprador cruza barrios. Enlazamos valoración honesta por micro-zona.</p>' },
      { title: 'Reforma de cocina y baño', body: '<p>Eixample clásico sin reforma compite mal con piso reformado en la misma calle. Documentar obra acorta plazo.</p>' },
      { title: 'Comunidad en finca grande', body: '<p>Derramas en fachada modernista o ascensor antiguo: actas antes de visitas serias.</p>' },
      { title: 'Comprador internacional', body: '<p>Plazos NIE y banco: coordinamos calendario con comprador solvente de cartera.</p>' },
      { title: 'Honorarios fijos', body: '<p>Sobre 485.000 €, ahorro frente al 6% supera 26.000 €.</p>' },
      { title: 'Panel y visitas', body: '<p>Solo solvencia contrastada. Calendario en tus franjas.</p>' },
      { title: 'Enlaces', body: '<p><a href="/vender-eixample">Eixample</a>, <a href="/vender-fort-pienc-barcelona">Fort Pienc</a>, <a href="/inmobiliaria-precio-fijo-eixample-barcelona">precio fijo Eixample</a>.</p>' },
    ],
    relacionadas: [
      { slug: 'vender-eixample', label: 'Vender en Eixample' },
      { slug: 'vender-fort-pienc-barcelona', label: 'Vender en Fort Pienc' },
      { slug: 'vender-gracia', label: 'Vender en Gràcia' },
      { slug: 'inmobiliaria-precio-fijo-eixample-barcelona', label: 'Precio fijo Eixample' },
    ],
    faq: [
      { q: '¿Vender junto a la Sagrada Família encarece siempre?', a: 'Depende de calle, planta y ruido. Valoramos finca concreta, no solo el icono.' },
      { q: '¿Cuánto tarda la venta?', a: '45–80 días con precio alineado es habitual.' },
      { q: '¿Honorarios?', a: '3.000 € + IVA solo en escritura si cierras.' },
    ],
  },
];

function main() {
  VENDER.forEach((cfg) => {
    const out = path.join(BARrio_DIR, `${cfg.slug}.json`);
    fs.writeFileSync(out, `${JSON.stringify(buildVender(cfg), null, 2)}\n`, 'utf8');
    console.log('Wrote', path.relative(ROOT, out));
  });
}

main();
