/** SEO · Nueva Hábitat Patrimonial por barrio (Barcelona) y ciudades */
const SITE = 'https://www.nuevahabitat.com';

const ZONAS = [
  {
    slug: 'patrimonial-eixample-barcelona',
    zoneType: 'barrio',
    zoneName: 'Eixample',
    navSub: 'Eixample',
    keyword_principal: 'administración fincas empresas Eixample Barcelona',
    keyword_aliases: [
      'gestión patrimonial Eixample',
      'sociedad patrimonial pisos alquiler Barcelona',
      'administrador fincas locales Eixample',
      'cartera inmuebles empresa Eixample',
      'gestión locales comerciales Eixample',
      'family office inmuebles Barcelona centro',
    ],
    priority: 0.9,
    areaServed: 'Eixample, Barcelona',
    heroBadge: 'Patrimonial · Eixample',
    heroImage: 'imagenes/eixample1.jpg',
    marketLead:
      'Sociedades patrimoniales con pisos en alquiler, locales en planta baja y oficinas en finca de ensanche: un responsable de cuenta, reporting y operativa LAU en todo el distrito.',
    microZones: ['Eixample Derecho', 'Esquerre', 'Passeig de Gràcia', 'Sagrada Família', 'Sant Antoni', 'Fort Pienc'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-eixample', label: 'Vender en Eixample' },
      { href: '/administracion-alquiler-barcelona', label: 'Administración alquileres' },
    ],
    localFaq:
      '<details><summary>¿Gestionáis varios pisos en distintas manzanas del Eixample?</summary><p>Sí. Inventario por activo, mismos criterios de respuesta y tarifas unitarias (59 €/mes administración · 599 € integral por vacío).</p></details>' +
      '<details><summary>¿Locales comerciales en la misma finca que viviendas?</summary><p>Carteras mixtas habituales: contratos y reporting separados por uso pero un solo interlocutor comercial.</p></details>',
    cardTeaser: 'Patrimonial Eixample: gestión de cartera viviendas, locales y oficinas para empresas.',
    seoExtra: `<h2>Administrador de fincas para empresas en el Eixample</h2>
<p>El Eixample concentra fincas de ensanche con viviendas en alquiler, locales en planta baja y oficinas heredadas en la misma escalera. Una <strong>sociedad patrimonial</strong> no puede permitirse un gestor distinto por activo: <strong>Nueva Hábitat Patrimonial</strong> centraliza contratos LAU, vacíos, incidencias y, si toca, <a href="/vender-eixample">venta con precio fijo</a>.</p>
<h2>Locales y vivienda en la misma cartera</h2>
<p>Passeig de Gràcia y entorno mueven tickets altos; Sant Antoni y Fort Pienc mezclan uso residencial y comercial. Ajustamos pricing de salida en alquiler, filtro de inquilino y plan de vacíos por tipología, no por media del distrito.</p>
<h2>Reporting para dirección</h2>
<p>Ocupación, rentas, renovaciones y disposal en un formato útil para tu asesoría: menos emails sueltos, más datos para decidir.</p>`,
  },
  {
    slug: 'patrimonial-gracia-barcelona',
    zoneType: 'barrio',
    zoneName: 'Gràcia',
    navSub: 'Gràcia',
    keyword_principal: 'gestión patrimonio inmobiliario Gràcia empresas',
    keyword_aliases: [
      'administración fincas Gracia Barcelona',
      'patrimonial locales alquiler Gracia',
      'empresa gestión pisos Gracia',
      'cartera viviendas sociedad patrimonial Gracia',
      'administrador fincas Gracia',
    ],
    priority: 0.89,
    areaServed: 'Gràcia, Barcelona',
    heroBadge: 'Patrimonial · Gràcia',
    heroImage: 'imagenes/gracia1.jpg',
    marketLead:
      'Carteras en Vila de Gràcia, Camp d\'en Grassot y Vallcarca: administración mensual, ocupación de vacíos y venta alineada con el ritmo del barrio.',
    microZones: ['Vila de Gràcia', 'Camp d\'en Grassot', 'La Salut', 'Vallcarca', 'El Coll'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-gracia', label: 'Vender en Gràcia' },
      { href: '/alquiler-integral-gracia', label: 'Alquiler integral Gràcia' },
    ],
    localFaq:
      '<details><summary>¿Pisos sin ascensor en cartera?</summary><p>Frecuente en Gràcia: plan de rotación y pricing realista para reducir vacío.</p></details>',
    cardTeaser: 'Patrimonial Gràcia: cartera mixta y un interlocutor para empresas.',
    seoExtra: `<h2>Patrimonial en Gràcia: vivienda, local y oficina pequeña</h2>
<p>Muchas <strong>patrimoniales familiares</strong> heredan varios pisos en el mismo bloque o un local en planta baja con viviendas arriba. Unificamos criterio de contrato, fianza INCASÒL y comunicación con inquilinos vía Nueva Habitat.</p>
<h2>Vacíos entre inquilinos</h2>
<p>Gràcia rota rápido si el precio y el filtro son correctos. Activamos <a href="/alquiler-integral">alquiler integral</a> por unidad y pasamos a administración cuando hay contrato.</p>`,
  },
  {
    slug: 'patrimonial-les-corts-barcelona',
    zoneType: 'barrio',
    zoneName: 'Les Corts',
    navSub: 'Les Corts',
    keyword_principal: 'administración patrimonial Les Corts empresas',
    keyword_aliases: [
      'gestión inmuebles empresa Les Corts',
      'sociedad patrimonial Barcelona Les Corts',
      'administrador fincas oficinas Les Corts',
      'cartera alquiler Les Corts',
    ],
    priority: 0.91,
    areaServed: 'Les Corts, Barcelona',
    heroBadge: 'Patrimonial · Les Corts · sede NH',
    heroImage: 'imagenes/lescorts1.jpg',
    marketLead:
      'Oficina Nueva Hábitat en Mejía Lequerica 42: diagnóstico de cartera en Les Corts, Pedralbes, la Maternitat y Diagonal con equipo de campo.',
    microZones: ['Les Corts', 'La Maternitat', 'Pedralbes', 'Zona Universitària', 'Diagonal'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-les-corts', label: 'Vender Les Corts' },
      { href: '/administracion-alquiler-les-corts', label: 'Administración Les Corts' },
    ],
    localFaq:
      '<details><summary>¿Reunión presencial en la oficina?</summary><p>Sí, en Carrer de Mejía Lequerica 42 (Les Corts) para mapear cartera y activos.</p></details>',
    cardTeaser: 'Patrimonial Les Corts: sede NH y gestión de cartera en el distrito.',
    seoExtra: `<h2>Gestión de cartera junto a nuestra sede</h2>
<p>Les Corts combina vivienda de zona universitaria, oficinas en Diagonal y activos prime en Pedralbes. Operamos desde la misma zona: reuniones de cartera sin depender solo de videollamada.</p>
<h2>Empresas con sede y pisos en propiedad</h2>
<p>Pymes que tienen local u oficina más viviendas en alquiler suelen externalizar todo el bloque inmobiliario. Mismas tarifas unitarias escalables.</p>`,
  },
  {
    slug: 'patrimonial-sants-barcelona',
    zoneType: 'barrio',
    zoneName: 'Sants',
    navSub: 'Sants',
    keyword_principal: 'administración fincas Sants empresas Barcelona',
    keyword_aliases: [
      'patrimonial alquiler Sants',
      'gestión locales Sants Badal',
      'cartera inmuebles Sants Montjuïc',
      'sociedad patrimonial Sants',
    ],
    priority: 0.88,
    areaServed: 'Sants-Montjuïc, Barcelona',
    heroBadge: 'Patrimonial · Sants',
    heroImage: 'imagenes/sants1.jpg',
    marketLead:
      'Sants, Hostafrancs y la franja de Montjuïc: pisos en cartera, locales en eje comercial y naves puntuales con un plan único de vacíos y administración.',
    microZones: ['Sants', 'Hostafrancs', 'La Bordeta', 'Poble-sec', 'Montjuïc'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-sants', label: 'Vender Sants' },
      { href: '/alquiler-integral-hostafrancs-barcelona', label: 'Alquiler integral Hostafrancs' },
    ],
    localFaq:
      '<details><summary>¿Activos industriales o naves?</summary><p>Evaluamos encaje caso a caso; vivienda y local son el core operativo habitual.</p></details>',
    cardTeaser: 'Patrimonial Sants: cartera residencial y comercial coordinada.',
    seoExtra: `<h2>Cartera en Sants y entorno</h2>
<p>Sants concentra bloques de alquiler estable y locales en calles de paso. Las <strong>patrimoniales</strong> con stock en Hostafrancs o La Bordeta necesitan filtro de solvencia homogéneo y calendario de renovaciones visible para dirección.</p>`,
  },
  {
    slug: 'patrimonial-sarria-barcelona',
    zoneType: 'barrio',
    zoneName: 'Sarrià · Sant Gervasi',
    navSub: 'Sarrià',
    keyword_principal: 'gestión patrimonial Sarrià empresas Barcelona',
    keyword_aliases: [
      'administración fincas Sant Gervasi',
      'family office Sarria Barcelona',
      'cartera viviendas alquiler Sarria',
      'patrimonial Pedralbes locales',
    ],
    priority: 0.89,
    areaServed: 'Sarrià-Sant Gervasi, Barcelona',
    heroBadge: 'Patrimonial · Sarrià',
    heroImage: 'imagenes/eixample5.jpg',
    marketLead:
      'Activos en Sarrià, Sant Gervasi, Putxet y Pedralbes: tickets altos, inquilinos exigentes y reporting claro para consejo o family office.',
    microZones: ['Sarrià', 'Sant Gervasi', 'Putxet', 'Bonanova', 'Pedralbes'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-sarria', label: 'Vender Sarrià' },
      { href: '/vender-pedralbes-barcelona', label: 'Pedralbes' },
    ],
    localFaq:
      '<details><summary>¿Operaciones con compradores internacionales en venta de cartera?</summary><p>Sí, planes de venta a precio fijo y filtro de solvencia alineados con venta premium.</p></details>',
    cardTeaser: 'Patrimonial Sarrià: carteras prime y family offices.',
    seoExtra: `<h2>Patrimoniales en zona prime</h2>
<p>En Sarrià y Sant Gervasi las carteras suelen mezclar vivienda de larga duración, locales de barrio y pisos en rotación tras herencia. El coste de un vacío mal gestionado es alto: priorizamos ocupación con criterio, no precio de anuncio inflado.</p>`,
  },
  {
    slug: 'patrimonial-sant-marti-barcelona',
    zoneType: 'barrio',
    zoneName: 'Sant Martí',
    navSub: 'Sant Martí',
    keyword_principal: 'administración patrimonial Sant Martí empresas',
    keyword_aliases: [
      'gestión inmuebles Poblenou empresa',
      'patrimonial 22@ locales',
      'cartera alquiler Sant Martí',
      'administrador fincas Diagonal Mar',
    ],
    priority: 0.89,
    areaServed: 'Sant Martí, Barcelona',
    heroBadge: 'Patrimonial · Sant Martí',
    heroImage: 'imagenes/poblenou1.jpg',
    marketLead:
      'Poblenou, 22@, Diagonal Mar y el Besòs: vivienda en alquiler, oficinas y locales en zonas en transformación — una cartera con criterio de reporting unificado.',
    microZones: ['Poblenou', '22@', 'Diagonal Mar', 'El Clot', 'La Verneda', 'El Besòs'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-poblenou', label: 'Vender Poblenou' },
      { href: '/vender-diagonal-mar-barcelona', label: 'Diagonal Mar' },
    ],
    localFaq:
      '<details><summary>¿Locales en edificios mixtos 22@?</summary><p>Gestionamos uso oficina/comercio y contratos según encaje LAU y normativa de la finca.</p></details>',
    cardTeaser: 'Patrimonial Sant Martí: Poblenou, 22@ y litoral.',
    seoExtra: `<h2>Cartera en distrito en cambio</h2>
<p>Sant Martí combina stock residencial pre-92, torres nuevas y locales en eje Glories–Besòs. Las empresas con varios activos aquí necesitan comparables por edificio, no por distrito entero, y un plan de vacíos cuando termina un contrato en planta baja.</p>`,
  },
  {
    slug: 'patrimonial-poblenou-barcelona',
    zoneType: 'barrio',
    zoneName: 'Poblenou',
    navSub: 'Poblenou',
    keyword_principal: 'gestión patrimonial Poblenou empresas',
    keyword_aliases: [
      'administración fincas Poblenou',
      'patrimonial locales 22 Barcelona',
      'cartera inmuebles tecnológico Poblenou',
      'alquiler empresas Poblenou',
    ],
    priority: 0.88,
    areaServed: 'Poblenou, Barcelona',
    heroBadge: 'Patrimonial · Poblenou',
    heroImage: 'imagenes/poblenou1.jpg',
    marketLead:
      'Patrimoniales con pisos en Provençals, vivienda cerca de 22@ o locales en Rambla del Poblenou: ocupación, administración y venta con conocimiento micro-zona.',
    microZones: ['Provençals del Poblenou', 'Vila Olímpica', 'Diagonal Mar', 'La Plaça', 'Rambla Poblenou'],
    relatedGuides: [
      { href: '/patrimonial-sant-marti-barcelona', label: 'Patrimonial Sant Martí' },
      { href: '/vender-poblenou', label: 'Vender Poblenou' },
      { href: '/patrimonial', label: 'Hub Patrimonial' },
    ],
    localFaq:
      '<details><summary>¿Inversores con pisos para alquiler a profesionales 22@?</summary><p>Filtro de perfil y solvencia antes de visita; contratos LAU y topes tensionados cuando aplican.</p></details>',
    cardTeaser: 'Patrimonial Poblenou: cartera cerca de 22@.',
    seoExtra: `<h2>Micro-mercado Poblenou</h2>
<p>Poblenou no es un solo mercado: Provençals, Vila Olímpica y frente marino compiten con compradores distintos. Para una <strong>sociedad patrimonial</strong> con varios pisos, unificar gestión evita que cada activo siga reglas distintas de contrato o comunicación.</p>`,
  },
  {
    slug: 'patrimonial-ciutat-vella-barcelona',
    zoneType: 'barrio',
    zoneName: 'Ciutat Vella',
    navSub: 'Ciutat Vella',
    keyword_principal: 'administración fincas Ciutat Vella empresas',
    keyword_aliases: [
      'patrimonial Gòtic locales',
      'gestión cartera Raval empresa',
      'sociedad patrimonial Born Barcelona',
      'administrador fincas Barceloneta',
    ],
    priority: 0.88,
    areaServed: 'Ciutat Vella, Barcelona',
    heroBadge: 'Patrimonial · Ciutat Vella',
    heroImage: 'imagenes/gotic1.jpg',
    marketLead:
      'Gòtic, Born, Raval y Barceloneta: fincas históricas, locales turísticos y vivienda en alquiler con LAU y tensiones de mercado bien gestionadas.',
    microZones: ['Gòtic', 'El Born', 'Raval', 'Barceloneta', 'Sant Pere'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-piso-ciutat-vella-barcelona', label: 'Vender Ciutat Vella' },
      { href: '/administracion-alquiler-raval-barcelona', label: 'Administración Raval' },
    ],
    localFaq:
      '<details><summary>¿Licencias y uso turístico en edificio?</summary><p>Revisamos restricciones de finca antes de renovar o publicar; coordinamos con tu asesoría.</p></details>',
    cardTeaser: 'Patrimonial Ciutat Vella: cartera en casco histórico.',
    seoExtra: `<h2>Patrimonio en casco antiguo</h2>
<p>Ciutat Vella mezcla locales de hostelería, vivienda antigua y activos con protección patrimonial. Las carteras corporativas necesitan documentación de comunidad, ITE y contratos claros — especialmente cuando hay rotación alta de inquilinos.</p>`,
  },
  {
    slug: 'patrimonial-sant-andreu-barcelona',
    zoneType: 'barrio',
    zoneName: 'Sant Andreu',
    navSub: 'Sant Andreu',
    keyword_principal: 'gestión patrimonial Sant Andreu empresas',
    keyword_aliases: [
      'administración fincas Sant Andreu',
      'patrimonial alquiler Fabra i Coats',
      'cartera inmuebles Sant Andreu',
    ],
    priority: 0.87,
    areaServed: 'Sant Andreu, Barcelona',
    heroBadge: 'Patrimonial · Sant Andreu',
    heroImage: 'imagenes/barcelona5.jpg',
    marketLead:
      'Carteras en el Clot, Navas, Congrés y Bon Pastor: vivienda familiar, locales de barrio y pisos heredados con plan de vacíos coordinado.',
    microZones: ['Sant Andreu de Palomar', 'El Clot', 'Navas', 'Congrés', 'Bon Pastor'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-sant-andreu', label: 'Vender Sant Andreu' },
      { href: '/comprar-piso-sant-andreu-barcelona', label: 'Comprar Sant Andreu' },
    ],
    localFaq: '',
    cardTeaser: 'Patrimonial Sant Andreu: cartera residencial y comercial.',
    seoExtra: `<h2>Empresas con stock en Sant Andreu</h2>
<p>Distrito con mezcla de bloques de alquiler estable y regeneración en Fabra i Coats. Las <strong>patrimoniales</strong> con varios pisos aquí ganan con inventario único, mismas plantillas de contrato y reporting de rentas para dirección.</p>`,
  },
  {
    slug: 'patrimonial-nou-barris-barcelona',
    zoneType: 'barrio',
    zoneName: 'Nou Barris',
    navSub: 'Nou Barris',
    keyword_principal: 'administración patrimonial Nou Barris',
    keyword_aliases: [
      'gestión pisos alquiler Nou Barris empresa',
      'sociedad patrimonial Verdum',
      'cartera inmuebles Nou Barris',
    ],
    priority: 0.86,
    areaServed: 'Nou Barris, Barcelona',
    heroBadge: 'Patrimonial · Nou Barris',
    heroImage: 'imagenes/noubarris1.jpg',
    marketLead:
      'Carteras en Verdun, Roquetes, Trinitat Nova y Torre Baró: gestión de alquileres, vacíos y venta sin dispersar proveedores.',
    microZones: ['Verdum', 'Roquetes', 'Trinitat Nova', 'Ciutat Meridiana', 'Torre Baró'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-nou-barris', label: 'Vender Nou Barris' },
      { href: '/alquiler-integral-roquetes-barcelona', label: 'Alquiler integral Roquetes' },
    ],
    localFaq: '',
    cardTeaser: 'Patrimonial Nou Barris: carteras de alquiler en el distrito.',
    seoExtra: `<h2>Cartera de alquiler en periferia consolidada</h2>
<p>Nou Barris mueve mucho stock de inversión en pisos. Una empresa con 10–30 unidades necesita filtro de inquilino homogéneo y respuesta rápida a incidencias — el modelo de administración a 59 €/mes por unidad escala sin perder control.</p>`,
  },
  {
    slug: 'patrimonial-horta-barcelona',
    zoneType: 'barrio',
    zoneName: 'Horta-Guinardó',
    navSub: 'Horta',
    keyword_principal: 'gestión patrimonial Horta Guinardó empresas',
    keyword_aliases: [
      'administración fincas Horta Barcelona',
      'patrimonial Vall d\'Hebron',
      'cartera alquiler El Carmel empresa',
    ],
    priority: 0.87,
    areaServed: 'Horta-Guinardó, Barcelona',
    heroBadge: 'Patrimonial · Horta',
    heroImage: 'imagenes/horta1.jpg',
    marketLead:
      'Horta, Guinardó, El Carmel y Vall d\'Hebron: vivienda en alquiler y locales de proximidad con un único responsable de cartera.',
    microZones: ['Horta', 'El Carmel', 'El Guinardó', 'Vall d\'Hebron', 'Montbau'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-horta', label: 'Vender Horta' },
      { href: '/administracion-alquiler-el-carmel-barcelona', label: 'Administración El Carmel' },
    ],
    localFaq: '',
    cardTeaser: 'Patrimonial Horta-Guinardó: gestión de cartera en el distrito.',
    seoExtra: `<h2>Patrimoniales en zona residencial amplia</h2>
<p>Horta-Guinardó combina bloques con ascensor, fincas en pendiente y stock familiar. Coordinamos renovaciones, vacíos y eventual venta de activos rezagados en cartera con comparables de barrio.</p>`,
  },
  {
    slug: 'patrimonial-l-hospitalet-barcelona',
    zoneType: 'barrio',
    zoneName: "L'Hospitalet",
    navSub: "L'Hospitalet",
    keyword_principal: 'administración fincas L Hospitalet empresas',
    keyword_aliases: [
      'gestión patrimonial Hospitalet',
      'sociedad patrimonial Llobregat',
      'cartera locales Hospitalet',
      'administrador fincas Bellvitge',
    ],
    priority: 0.88,
    areaServed: "L'Hospitalet de Llobregat y área",
    heroBadge: "Patrimonial · L'Hospitalet",
    heroImage: 'imagenes/hospitalet1.jpg',
    marketLead:
      'Empresas y patrimoniales con pisos en Centre, Bellvitge, Collblanc o gran eje: administración, vacíos y venta desde operativa barcelonesa.',
    microZones: ['Centre', 'Bellvitge', 'Collblanc', 'La Florida', 'Granvia'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-l-hospitalet', label: "Vender L'Hospitalet" },
      { href: '/alquiler-integral-l-hospitalet', label: 'Alquiler integral' },
    ],
    localFaq:
      '<details><summary>¿Mismo servicio que en Barcelona ciudad?</summary><p>Sí: tarifas unitarias y panel; municipio metropolitano con equipo Les Corts.</p></details>',
    cardTeaser: "Patrimonial L'Hospitalet: cartera en el primer cinturón.",
    seoExtra: `<h2>Cartera en el área metropolitana</h2>
<p>Muchas patrimoniales tienen más unidades en L'Hospitalet que en Barcelona ciudad por ticket y rentabilidad. Unificamos criterio con activos en ambos municipios: mismo reporting y mismo contacto comercial.</p>`,
  },
  {
    slug: 'patrimonial-badalona-barcelona',
    zoneType: 'barrio',
    zoneName: 'Badalona',
    navSub: 'Badalona',
    keyword_principal: 'gestión patrimonial Badalona empresas',
    keyword_aliases: [
      'administración fincas Badalona',
      'patrimonial alquiler Badalona',
      'cartera inmuebles Litoral',
      'empresa locales Badalona',
    ],
    priority: 0.87,
    areaServed: 'Badalona y litoral',
    heroBadge: 'Patrimonial · Badalona',
    heroImage: 'imagenes/interior11.jpg',
    marketLead:
      'Carteras en centro, Gorg, Montigalà o Pompeu Fabra: vivienda en alquiler, locales comerciales y coordinación con Barcelona.',
    microZones: ['Centre', 'Gorg', 'Montigalà', 'Pompeu Fabra', 'La Salut'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/vender-badalona', label: 'Vender Badalona' },
      { href: '/venta-digital-barcelona', label: 'Venta digital' },
    ],
    localFaq: '',
    cardTeaser: 'Patrimonial Badalona: gestión de cartera en el litoral.',
    seoExtra: `<h2>Patrimoniales en Badalona</h2>
<p>Badalona concentra bloques de alquiler e inversores con varios pisos en la misma finca. Externalizar administración evita que cada piso dependa de un familiar distinto para incidencias e impagos.</p>`,
  },
  {
    slug: 'patrimonial-madrid',
    zoneType: 'ciudad',
    zoneName: 'Madrid',
    navSub: 'Madrid',
    keyword_principal: 'administración patrimonial inmobiliaria Madrid empresas',
    keyword_aliases: [
      'gestión cartera inmuebles Madrid sociedad patrimonial',
      'administrador fincas empresa Madrid',
      'family office inmuebles Madrid Barcelona operador',
      'gestión alquileres cartera Madrid',
    ],
    priority: 0.88,
    areaServed: 'Madrid capital y área metropolitana',
    heroBadge: 'Patrimonial · Madrid',
    heroImage: 'imagenes/interior11.jpg',
    marketLead:
      'Patrimoniales con activos en Madrid y operativa desde Barcelona: diagnóstico remoto, visitas coordinadas y reporting centralizado hasta alianza local en campo.',
    microZones: ['Centro', 'Salamanca', 'Chamartín', 'Carabanchel', 'Getafe', 'Móstoles'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/venta-digital-madrid', label: 'Venta digital Madrid' },
      { href: '/patrimonial-eixample-barcelona', label: 'Patrimonial Barcelona' },
    ],
    localFaq:
      '<details><summary>¿Tenéis equipo en Madrid?</summary><p>Sede en Barcelona; carteras en Madrid con responsable de cuenta, portales y coordinación de proveedores locales validados en cada activo.</p></details>',
    cardTeaser: 'Patrimonial Madrid: gestión de cartera con operador Barcelona.',
    seoExtra: `<h2>Cartera en Madrid con operador en Barcelona</h2>
<p>Muchas sociedades patrimoniales catalanas tienen pisos en Madrid (o al revés). <strong>Nueva Hábitat Patrimonial</strong> centraliza estrategia, contratos tipo, reporting y venta con honorarios fijos; en campo coordinamos visitas y incidencias según el activo.</p>`,
  },
  {
    slug: 'patrimonial-valencia',
    zoneType: 'ciudad',
    zoneName: 'Valencia',
    navSub: 'Valencia',
    keyword_principal: 'gestión patrimonial inmobiliaria Valencia empresas',
    keyword_aliases: [
      'administración fincas cartera Valencia',
      'patrimonial alquiler Valencia',
      'operador inmuebles Valencia Barcelona',
    ],
    priority: 0.86,
    areaServed: 'Valencia capital y l\'Horta',
    heroBadge: 'Patrimonial · Valencia',
    heroImage: 'imagenes/interior2.jpg',
    marketLead:
      'Inversores y patrimoniales con stock en Valencia: un interlocutor, expedientes digitales y planes de vacío y venta alineados con el resto de España.',
    microZones: ['Ciutat Vella', 'Eixample', 'Ruzafa', 'Benimaclet', 'Mislata'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/venta-digital-valencia', label: 'Venta digital Valencia' },
    ],
    localFaq: '',
    cardTeaser: 'Patrimonial Valencia: cartera y reporting centralizado.',
    seoExtra: `<h2>Patrimonial en la Comunitat Valenciana</h2>
<p>Valencia mueve carteras de alquiler residencial y locales en centros históricos. Delegar en un operador con panel y tarifas unitarias claras reduce fricción con asesorías que revisan varias CCAA.</p>`,
  },
  {
    slug: 'patrimonial-zaragoza',
    zoneType: 'ciudad',
    zoneName: 'Zaragoza',
    navSub: 'Zaragoza',
    keyword_principal: 'administración patrimonial Zaragoza empresas',
    keyword_aliases: [
      'gestión cartera inmuebles Zaragoza',
      'sociedad patrimonial Zaragoza',
      'administrador fincas empresa Zaragoza',
    ],
    priority: 0.85,
    areaServed: 'Zaragoza capital y área',
    heroBadge: 'Patrimonial · Zaragoza',
    heroImage: 'imagenes/interior8.jpg',
    marketLead:
      'Patrimoniales aragonesas con varios pisos o locales: administración escalable, alquiler integral en vacíos y venta sin comisión porcentual.',
    microZones: ['Centro', 'Delicias', 'Actur', 'Valdespartera'],
    relatedGuides: [
      { href: '/patrimonial', label: 'Hub Patrimonial' },
      { href: '/venta-digital-zaragoza', label: 'Venta digital Zaragoza' },
    ],
    localFaq: '',
    cardTeaser: 'Patrimonial Zaragoza: gestión de cartera para empresas.',
    seoExtra: `<h2>Cartera en Zaragoza</h2>
<p>Tickets moderados pero volumen de herencias y patrimoniales familiares. Un plan de cartera unificado evita que cada activo se gestione con criterios distintos de fianza, contrato o renovación.</p>`,
  },
];

function barrioZonas() {
  return ZONAS.filter((z) => z.zoneType === 'barrio');
}

function ciudadZonas() {
  return ZONAS.filter((z) => z.zoneType === 'ciudad');
}

function otherZonaLinks(currentSlug) {
  return ZONAS.filter((z) => z.slug !== currentSlug)
    .map(
      (z) =>
        `<a href="/${z.slug}"><strong>${z.zoneName}</strong><span>Patrimonial · cartera empresas</span></a>`
    )
    .join('\n      ');
}

module.exports = {
  SITE,
  ZONAS,
  barrioZonas,
  ciudadZonas,
  otherZonaLinks,
};
