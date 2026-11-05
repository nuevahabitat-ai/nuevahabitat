/** Datos SEO · venta 100 % digital por ciudad (plan 1.999 € + IVA) */
const SITE = 'https://www.nuevahabitat.com';
const FEE_BASE = 1999;
const FEE_IVA = 2418.79;
const FEE_HALF = 1209.4;

const CIUDADES = [
  {
    slug: 'venta-digital-barcelona',
    cityName: 'Barcelona',
    navSub: 'Barcelona',
    keyword_principal: 'venta 100 por ciento digital Barcelona',
    keyword_aliases: [
      'vender piso online barcelona',
      'inmobiliaria digital barcelona',
      'agencia venta digital barcelona',
      'vender casa sin comisión barcelona',
      'venta piso 100 digital barcelona',
      'vender piso particular digital barcelona',
    ],
    priority: 0.96,
    areaServed: 'Barcelona ciudad y área metropolitana',
    heroBadge: 'Plan digital · Barcelona y área metropolitana',
    marketLead:
      'Desde Les Corts gestionamos expedientes en el Eixample, Gràcia, L\'Hospitalet, Badalona y el resto del área metropolitana: mismos portales, mismo panel y visitas que tú programas en tu calendario.',
    zones: ['Eixample', 'Gràcia', 'Sants', 'Les Corts', 'Sant Martí', 'L\'Hospitalet', 'Badalona', 'Poblenou', 'Sarrià'],
    priceExample: 420000,
    priceM2: '3.800 – 5.800 €/m² (orientativo 2026)',
    avgDays: '45 – 90 días según zona y precio',
    relatedGuides: [
      { href: '/inmobiliaria-precio-fijo-barcelona', label: 'Inmobiliaria precio fijo Barcelona' },
      { href: '/venta-piso-economica-barcelona', label: 'Venta económica Barcelona' },
      { href: '/vender-como-particular-barcelona', label: 'Vender como particular' },
      { href: '/venta-clasica-barcelona', label: 'Venta clásica (visitas NH)' },
      { href: '/venta-comercial-barcelona', label: 'Digital + comercial in situ' },
    ],
    localFaq:
      '<details><summary>¿Hay comercial NH en visitas en Barcelona?</summary><p>En el plan 100&nbsp;% digital tú recibes las visitas. Si prefieres comercial in situ en Barcelona, mira el <a href="/venta-comercial-barcelona">plan digital + comercial</a> (2.500&nbsp;€ + IVA).</p></details>' +
      '<details><summary>¿En qué barrios de Barcelona operáis?</summary><p>Barcelona ciudad y área metropolitana (L\'Hospitalet, Badalona, Cornellà, Esplugues, Sant Cugat, etc.). Guías por zona en <a href="/vender">hub vender</a> e <a href="/inmobiliaria-precio-fijo-barcelona">inmobiliaria precio fijo</a>.</p></details>',
    seoExtra: `<h2>Vender piso en Barcelona con agencia digital y precio fijo</h2>
<p>La búsqueda <strong>venta 100 % digital Barcelona</strong> suele venir de propietarios que ya han probado portales solos y quieren <strong>intermediación profesional</strong> sin pagar un 3&nbsp;% o 6&nbsp;% sobre el precio de venta. NuevaHabitat publica en <strong>Idealista</strong> y <strong>pisos.com</strong>, aplica <strong>filtro de hipoteca</strong> antes de cada visita y te da un <strong>panel vendedor</strong> donde ves ofertas, documentos y calendario.</p>
<p>En Barcelona el ticket medio orientativo ronda los <strong>380.000–480.000 €</strong> según barrio; una comisión tradicional del 6&nbsp;% + IVA puede superar los <strong>30.000 €</strong>. El plan digital deja el coste en <strong>1.999 € + IVA</strong>, repartido 50&nbsp;% al contratar y 50&nbsp;% en escritura.</p>
<h2>Qué incluye la venta digital en Barcelona</h2>
<ul>
<li>Valoración con comparables de cierre en tu micro-zona (Eixample no es igual que Nou Barris).</li>
<li>Reportaje fotográfico, vídeo y publicación en Idealista y pisos.com.</li>
<li>Registro de cada visita en panel; tú eliges franjas (tardes, fines de semana).</li>
<li>Negociación, arras, coordinación con banco del comprador y hasta notaría.</li>
<li>Oficina física en Les Corts (Mejía Lequerica 42) para reuniones si lo necesitas.</li>
</ul>
<h2>Digital vs clásica vs digital + comercial</h2>
<p>Si no puedes hacer visitas, valora <a href="/venta-clasica-barcelona">venta clásica</a> (equipo NH en casa) o <a href="/venta-comercial-barcelona">digital + comercial</a> solo en Barcelona. Si quieres máximo ahorro y control del calendario, el plan 100&nbsp;% digital es el adecuado.</p>`,
  },
  {
    slug: 'venta-digital-madrid',
    cityName: 'Madrid',
    navSub: 'Madrid',
    keyword_principal: 'venta 100 por ciento digital Madrid',
    keyword_aliases: [
      'vender piso online madrid',
      'inmobiliaria digital madrid',
      'agencia venta digital madrid',
      'vender casa sin comisión madrid',
      'venta piso 100 digital madrid',
      'vender piso particular madrid digital',
    ],
    priority: 0.96,
    areaServed: 'Madrid capital y área metropolitana',
    heroBadge: 'Plan digital · Madrid capital y área',
    marketLead:
      'Vendes en Madrid con la misma arquitectura que en Barcelona: expediente online, difusión en portales nacionales, filtro de compradores y tú abres la puerta en Salamanca, Chamartín, Retiro, Carabanchel o tu municipio del sur metropolitano.',
    zones: ['Salamanca', 'Chamartín', 'Retiro', 'Arganzuela', 'Carabanchel', 'Latina', 'Getafe', 'Móstoles', 'Pozuelo'],
    priceExample: 380000,
    priceM2: '3.200 – 5.500 €/m² (orientativo 2026)',
    avgDays: '50 – 95 días',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital España' },
      { href: '/venta-digital-barcelona', label: 'Venta digital Barcelona' },
      { href: '/vender', label: 'Cómo vender con NuevaHabitat' },
    ],
    localFaq:
      '<details><summary>¿Atendéis solo Madrid capital?</summary><p>El plan digital cubre Madrid capital y municipios del área donde puedas recibir visitas cualificadas (Alcorcón, Getafe, Leganés, Pozuelo, Fuenlabrada, etc.). Confirmamos cobertura en la valoración inicial.</p></details>' +
      '<details><summary>¿La sede está en Madrid?</summary><p>Operamos con sede en Barcelona y equipo remoto + portales nacionales. El expediente, pagos Stripe y panel son los mismos en Madrid; las visitas las haces tú en tu vivienda.</p></details>',
    seoExtra: `<h2>Venta digital de piso en Madrid sin comisión porcentual</h2>
<p>Madrid concentra millones de búsquedas de <strong>vender piso online</strong>, <strong>inmobiliaria digital</strong> y alternativas al 3&nbsp;% de honorarios. NuevaHabitat no es un portal: es agencia con <strong>precio fijo 1.999 € + IVA</strong>, cobro 50&nbsp;/&nbsp;50 y filtro de solvencia antes de abrir tu puerta.</p>
<p>En distritos como Salamanca o Chamberí el ticket puede superar los 400.000 €; el 6&nbsp;% + IVA de una agencia clásica supera fácilmente <strong>29.000 €</strong>. El plan digital mantiene el coste cerrado aunque negocies bien el precio final.</p>
<h2>Cómo vendemos en Madrid desde el panel</h2>
<p>Tras el primer pago (Stripe) activamos expediente: nota simple, certificado energético, borrador de anuncio y calendario de visitas. Publicamos en Idealista y pisos.com; compradores de cartera y leads de esos portales pasan por filtro de financiación. Tú recibes en las franjas que marques — ideal si vives en el piso o tienes horario flexible.</p>
<h2>Municipios del área metropolitana</h2>
<p>Getafe, Móstoles, Alcorcón, Leganés, Pozuelo, Las Rozas: mismo servicio si puedes atender visitas o un familiar autorizado. Negociación y documentación las centralizamos en el panel, sin depender de emails sueltos.</p>`,
  },
  {
    slug: 'venta-digital-valencia',
    cityName: 'Valencia',
    navSub: 'Valencia',
    keyword_principal: 'venta 100 por ciento digital Valencia',
    keyword_aliases: [
      'vender piso online valencia',
      'inmobiliaria digital valencia',
      'agencia venta digital valencia',
      'vender casa sin comisión valencia',
      'venta piso 100 digital valencia',
      'vender piso particular valencia',
    ],
    priority: 0.95,
    areaServed: 'Valencia capital y l\'Horta',
    heroBadge: 'Plan digital · Valencia y l\'Horta',
    marketLead:
      'En Valencia capital, Campanar, Benimaclet, Ruzafa o Mislata: publicamos tu piso, cualificamos demanda y coordinamos visitas en las franjas que marques en el panel — sin comisión del 3&nbsp;% sobre el precio de venta.',
    zones: ['Ciutat Vella', 'Eixample', 'Campanar', 'Benimaclet', 'Ruzafa', 'Algirós', 'Mislata', 'Paterna'],
    priceExample: 290000,
    priceM2: '2.200 – 3.800 €/m² (orientativo 2026)',
    avgDays: '55 – 100 días',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-madrid', label: 'Venta digital Madrid' },
      { href: '/vender', label: 'Información para vendedores' },
    ],
    localFaq:
      '<details><summary>¿Funciona para pisos en la playa o l\'Horta?</summary><p>Sí, si puedes atender visitas o delegar en un familiar. La operativa (anuncio, leads, negociación, arras) la llevamos nosotros de forma remota con el mismo panel vendedor.</p></details>' +
      '<details><summary>¿Publicáis en portales de Valencia?</summary><p>Sí: anuncio en <strong>Idealista</strong> y <strong>pisos.com</strong>, más cartera de compradores, para captar demanda en la Comunitat Valenciana y relocation desde Madrid/Barcelona.</p></details>',
    seoExtra: `<h2>Inmobiliaria 100 % digital en Valencia</h2>
<p>Valencia mezcla demanda local, teletrabajo y compradores de otras CCAA. Buscar <strong>venta digital Valencia</strong> implica querer <strong>honorarios claros</strong> y menos curiosos en visita. NuevaHabitat cualifica hipoteca o liquidez antes de agendar contigo.</p>
<p>Con un piso orientativo de <strong>290.000 €</strong>, el 6&nbsp;% + IVA tradicional ronda <strong>21.000 €</strong>; el plan digital son <strong>1.999 € + IVA</strong> de honorarios fijos si cierras en escritura.</p>
<h2>Ruzafa, Benimaclet, Eixample valenciano</h2>
<p>Cada micro-mercado tiene ritmo distinto: stock en Ruzafa compite con reformas; Benimaclet atrae jóvenes profesionales. Ajustamos precio de salida con comparables reales, no con el anuncio más caro del portal.</p>
<h2>Expediente online desde el primer día</h2>
<p>Contrato digital, primer 50&nbsp;% con tarjeta, subida de documentos y seguimiento por panel y WhatsApp con tu gestor. Misma plataforma que usan vendedores en Barcelona y Madrid.</p>`,
  },
  {
    slug: 'venta-digital-sevilla',
    cityName: 'Sevilla',
    navSub: 'Sevilla',
    keyword_principal: 'venta 100 por ciento digital Sevilla',
    keyword_aliases: [
      'vender piso online sevilla',
      'inmobiliaria digital sevilla',
      'agencia venta digital sevilla',
      'vender casa sin comisión sevilla',
      'venta piso 100 digital sevilla',
      'vender piso particular sevilla',
    ],
    priority: 0.95,
    areaServed: 'Sevilla capital y área metropolitana',
    heroBadge: 'Plan digital · Sevilla y área',
    marketLead:
      'Triana, Nervión, Los Remedios, Macarena o Sevilla Este: honorarios fijos 1.999&nbsp;€ + IVA, 50&nbsp;% al contratar y 50&nbsp;% en escritura. Tú enseñas el inmueble; NuevaHabitat filtra compradores y cierra la operativa hasta notaría.',
    zones: ['Triana', 'Nervión', 'Los Remedios', 'Macarena', 'Sevilla Este', 'Cerro-Amate', 'Dos Hermanas', 'Alcalá de Guadaíra'],
    priceExample: 265000,
    priceM2: '2.000 – 3.400 €/m² (orientativo 2026)',
    avgDays: '60 – 105 días',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-valencia', label: 'Venta digital Valencia' },
      { href: '/vender', label: 'Hub vender' },
    ],
    localFaq:
      '<details><summary>¿Hay diferencia con una inmobiliaria de barrio en Sevilla?</summary><p>El modelo es precio fijo y digital: no pagas un porcentaje sobre tu venta. Mantienes control del calendario de visitas; nosotros aportamos marketing, filtro y negociación profesional.</p></details>' +
      '<details><summary>¿Puedo vender si estoy fuera de Sevilla?</summary><p>Sí, si un familiar o persona de confianza puede recibir visitas cualificadas. Toda la negociación y documentación la ves en panel.</p></details>',
    seoExtra: `<h2>Vender piso en Sevilla con agencia digital</h2>
<p>Sevilla capital y área metropolitana (Dos Hermanas, Alcalá, Camas) tienen buen volumen de <strong>primera vivienda</strong> y herencias. La <strong>venta 100 % digital</strong> encaja cuando quieres evitar exclusivas largas y comisiones opacas.</p>
<p>Sobre un precio orientativo de <strong>265.000 €</strong>, ahorras más de <strong>17.000 €</strong> frente a un 6&nbsp;% + IVA tradicional, manteniendo acompañamiento hasta arras y escritura.</p>
<h2>Triana, Nervión, Los Remedios</h2>
<p>Barrios con personalidad distinta: en Triana el comprador valora estado y terraza; en Nervión, parking y conexión. Publicamos con reportaje profesional y filtramos visitas para no saturar tu agenda.</p>
<h2>Proceso transparente</h2>
<p>50&nbsp;% al contratar activa publicación y gestión de leads. 50&nbsp;% en escritura solo si vendes. Sin venta, no hay segundo cobro de agencia más allá del servicio ya activado tras el primer pago (condiciones en contrato).</p>`,
  },
  {
    slug: 'venta-digital-malaga',
    cityName: 'Málaga',
    navSub: 'Málaga',
    keyword_principal: 'venta 100 por ciento digital Málaga',
    keyword_aliases: [
      'vender piso online malaga',
      'inmobiliaria digital malaga',
      'agencia venta digital malaga',
      'vender casa sin comisión malaga',
      'venta piso 100 digital malaga',
      'vender piso particular malaga digital',
    ],
    priority: 0.94,
    areaServed: 'Málaga capital y Costa del Sol occidental',
    heroBadge: 'Plan digital · Málaga y área',
    marketLead:
      'Centro histórico, Teatinos, El Palo o Rincón de la Victoria: mismo expediente online, portales nacionales y visitas en tus horarios — sin pagar un 3&nbsp;% sobre el precio de venta.',
    zones: ['Centro', 'Teatinos', 'La Malagueta', 'El Palo', 'Carretera de Cádiz', 'Ronda', 'Torremolinos', 'Rincón de la Victoria'],
    priceExample: 310000,
    priceM2: '2.400 – 4.200 €/m² (orientativo 2026)',
    avgDays: '55 – 100 días',
    cardTeaser: 'Venta digital en Málaga y Costa del Sol: 1.999 € + IVA, panel y visitas del propietario.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital España' },
      { href: '/venta-digital-sevilla', label: 'Venta digital Sevilla' },
      { href: '/vender', label: 'Hub vender' },
    ],
    localFaq:
      '<details><summary>¿Atendéis la Costa del Sol?</summary><p>El plan digital cubre Málaga capital y municipios cercanos donde puedas recibir visitas cualificadas (Torremolinos, Rincón, Benalmádena, etc.). Lo confirmamos en valoración.</p></details>' +
      '<details><summary>¿Hay mucha demanda internacional en Málaga?</summary><p>Sí; por eso filtramos solvencia antes de visita. Tú controlas calendario; nosotros negociación y documentación en panel.</p></details>',
    seoExtra: `<h2>Vender piso en Málaga con inmobiliaria digital</h2>
<p>Málaga combina mercado local, segunda residencia y compradores europeos. Buscar <strong>venta 100 % digital Málaga</strong> suele significar querer <strong>honorarios fijos</strong> frente al 6&nbsp;% de agencia de barrio. NuevaHabitat publica en Idealista y pisos.com, filtra hipoteca y tú recibes solo visitas preparadas.</p>
<p>Con un ticket orientativo de <strong>310.000 €</strong>, el 6&nbsp;% + IVA tradicional supera <strong>22.000 €</strong>; el plan digital son <strong>1.999 € + IVA</strong> repartidos 50&nbsp;/&nbsp;50.</p>
<h2>Teatinos, centro y litoral</h2>
<p>No mezclamos comparables de chalet en Rincón con piso en Carretera de Cádiz: el pricing y el reportaje cambian. El panel centraliza documentación para arras sin sorpresas.</p>
<h2>Teletrabajo y plazos</h2>
<p>Muchos vendedores siguen viviendo en el piso: marcas franjas concretas en calendario y evitas sábados perdidos con curiosos sin financiación.</p>`,
  },
  {
    slug: 'venta-digital-bilbao',
    cityName: 'Bilbao',
    navSub: 'Bilbao',
    keyword_principal: 'venta 100 por ciento digital Bilbao',
    keyword_aliases: [
      'vender piso online bilbao',
      'inmobiliaria digital bilbao',
      'agencia venta digital bilbao',
      'vender casa sin comisión bilbao',
      'venta piso 100 digital bilbao',
      'vender piso particular bilbao',
    ],
    priority: 0.94,
    areaServed: 'Bilbao, Bizkaia y área metropolitana',
    heroBadge: 'Plan digital · Bilbao y área',
    marketLead:
      'Abando, Indautxu, Deusto, Basurto o Getxo: precio fijo 1.999&nbsp;€ + IVA, publicación en portales, filtro de compradores y negociación remota con panel vendedor.',
    zones: ['Abando', 'Indautxu', 'Deusto', 'Basurto', 'Rekalde', 'Santutxu', 'Getxo', 'Portugalete'],
    priceExample: 340000,
    priceM2: '3.000 – 4.800 €/m² (orientativo 2026)',
    avgDays: '50 – 95 días',
    cardTeaser: 'Inmobiliaria digital en Bilbao y área: honorarios fijos, Idealista y visitas cualificadas.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-madrid', label: 'Venta digital Madrid' },
      { href: '/vender', label: 'Información vendedores' },
    ],
    localFaq:
      '<details><summary>¿Operáis en municipios del Gran Bilbao?</summary><p>Sí, si puedes atender visitas en Getxo, Barakaldo, Portugalete u otros. Expediente y negociación son los mismos que en Barcelona o Madrid.</p></details>' +
      '<details><summary>¿Documentación en euskera o castellano?</summary><p>Gestionamos expediente en castellano; coordinamos con notaría y banco del comprador en la CAE como en cualquier operación estatal.</p></details>',
    seoExtra: `<h2>Venta digital de vivienda en Bilbao</h2>
<p>El mercado bilbaíno es sensible al pricing inicial y al estado de finca y comunidad. <strong>Vender piso online Bilbao</strong> con NuevaHabitat mantiene <strong>1.999 € + IVA</strong> cerrados y filtra compradores antes de cada visita.</p>
<p>Sobre <strong>340.000 €</strong>, una comisión del 6&nbsp;% + IVA ronda <strong>24.600 €</strong>; el plan digital evita que los honorarios crezcan si negocias bien el precio final.</p>
<h2>Indautxu y expansión hacia margen derecha</h2>
<p>Compradores comparan parking, ITE y derramas. Subimos actas y certificados al panel antes de abrir visitas masivas.</p>
<h2>Mismo panel que el resto de España</h2>
<p>Contrato digital, Stripe 50/50 y seguimiento con Daniel o Sebastián desde Barcelona — sin depender de cadenas de email sueltas.</p>`,
  },
  {
    slug: 'venta-digital-zaragoza',
    cityName: 'Zaragoza',
    navSub: 'Zaragoza',
    keyword_principal: 'venta 100 por ciento digital Zaragoza',
    keyword_aliases: [
      'vender piso online zaragoza',
      'inmobiliaria digital zaragoza',
      'agencia venta digital zaragoza',
      'vender casa sin comisión zaragoza',
      'venta piso 100 digital zaragoza',
      'vender piso particular zaragoza',
    ],
    priority: 0.93,
    areaServed: 'Zaragoza capital y área metropolitana',
    heroBadge: 'Plan digital · Zaragoza',
    marketLead:
      'Centro, Delicias, Valdespartera, Las Fuentes o Utebo: vende con agencia digital, portales nacionales y tú en las visitas cualificadas.',
    zones: ['Centro', 'Delicias', 'Actur', 'Valdespartera', 'Las Fuentes', 'San José', 'Utebo', 'Cuarte de Huerva'],
    priceExample: 220000,
    priceM2: '1.800 – 2.800 €/m² (orientativo 2026)',
    avgDays: '60 – 105 días',
    cardTeaser: 'Venta 100 % digital en Zaragoza: precio fijo 1.999 € + IVA y panel vendedor.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-valencia', label: 'Venta digital Valencia' },
      { href: '/vender', label: 'Hub vender' },
    ],
    localFaq:
      '<details><summary>¿Cubrís Utebo y Cuarte?</summary><p>Sí, dentro del plan digital si puedes recibir visitas. Confirmamos en la valoración inicial.</p></details>' +
      '<details><summary>¿Publicáis en Idealista Zaragoza?</summary><p>Anuncio en Idealista y pisos.com con reportaje profesional; leads pasan por filtro de solvencia.</p></details>',
    seoExtra: `<h2>Inmobiliaria digital en Zaragoza sin comisión porcentual</h2>
<p>Zaragoza mueve mucho stock de <strong>primera vivienda</strong> y herencias. El modelo <strong>venta 100 % digital</strong> encaja cuando quieres honorarios claros: <strong>1.999 € + IVA</strong>, no un 3&nbsp;% sobre el precio.</p>
<p>En <strong>220.000 €</strong>, el 6&nbsp;% + IVA supera <strong>15.900 €</strong>; el ahorro frente a agencia tradicional es evidente aunque el ticket sea moderado.</p>
<h2>Valdespartera vs casco antiguo</h2>
<p>Comprador joven vs familia en ensanche: cambian titular del anuncio y comparables. Valoramos con cierres reales, no solo anuncios activos.</p>
<h2>Expediente remoto</h2>
<p>Ideal si trabajas fuera de Zaragoza pero un familiar puede abrir en visitas filtradas: todo lo demás lo ves en panel.</p>`,
  },
  {
    slug: 'venta-digital-alicante',
    cityName: 'Alicante',
    navSub: 'Alicante',
    keyword_principal: 'venta 100 por ciento digital Alicante',
    keyword_aliases: [
      'vender piso online alicante',
      'inmobiliaria digital alicante',
      'agencia venta digital alicante',
      'vender casa sin comisión alicante',
      'venta piso 100 digital alicante',
      'vender piso particular alicante',
    ],
    priority: 0.93,
    areaServed: 'Alicante capital y área metropolitana',
    heroBadge: 'Plan digital · Alicante',
    marketLead:
      'Centro, Playa de San Juan, Cabo de las Huertas, San Blas o Elche: mismos portales, mismo panel y visitas en franjas que tú marcas.',
    zones: ['Centro', 'Playa de San Juan', 'Cabo de las Huertas', 'San Blas', 'Carolinas', 'San Gabriel', 'Elche', 'San Juan de Alicante'],
    priceExample: 275000,
    priceM2: '2.100 – 3.600 €/m² (orientativo 2026)',
    avgDays: '55 – 100 días',
    cardTeaser: 'Vender en Alicante con venta digital NuevaHabitat: 1.999 € + IVA y filtro de compradores.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-valencia', label: 'Venta digital Valencia' },
      { href: '/venta-digital-murcia', label: 'Venta digital Murcia' },
    ],
    localFaq:
      '<details><summary>¿Incluye playa y Elche?</summary><p>Cubrimos Alicante capital y municipios del área si puedes atender visitas cualificadas. Playa de San Juan y Elche se confirman en valoración.</p></details>' +
      '<details><summary>¿Compradores internacionales?</summary><p>Frecuentes en litoral; por eso verificamos solvencia antes de agendar contigo.</p></details>',
    seoExtra: `<h2>Venta 100 % digital en Alicante</h2>
<p>Alicante mezcla residente todo el año, segunda residencia y compradores de otras CCAA. <strong>Vender piso online Alicante</strong> con precio fijo evita exclusivas largas y comisiones opacas.</p>
<p>Sobre <strong>275.000 €</strong>, el 6&nbsp;% + IVA ronda <strong>19.900 €</strong>; honorarios NuevaHabitat: <strong>1.999 € + IVA</strong> en escritura si cierras.</p>
<h2>Playa vs centro</h2>
<p>El comprador de línea de playa no es el de Carolinas Altas: segmentamos anuncio y difusión. Reportaje profesional incluido.</p>
<h2>Panel y FIRMACERT</h2>
<p>Arras y reservas con trazabilidad; menos riesgo que gestionar todo como particular en portal.</p>`,
  },
  {
    slug: 'venta-digital-murcia',
    cityName: 'Murcia',
    navSub: 'Murcia',
    keyword_principal: 'venta 100 por ciento digital Murcia',
    keyword_aliases: [
      'vender piso online murcia',
      'inmobiliaria digital murcia',
      'agencia venta digital murcia',
      'vender casa sin comisión murcia',
      'venta piso 100 digital murcia',
      'vender piso particular murcia',
    ],
    priority: 0.93,
    areaServed: 'Murcia capital y área metropolitana',
    heroBadge: 'Plan digital · Murcia',
    marketLead:
      'Centro, El Carmen, Vistabella, Churra o Molina de Segura: agencia digital con 1.999&nbsp;€ + IVA, Idealista, pisos.com y tú en visitas filtradas.',
    zones: ['Centro', 'El Carmen', 'Vistabella', 'La Flota', 'San Andrés', 'Churra', 'Molina de Segura', 'Alcantarilla'],
    priceExample: 240000,
    priceM2: '1.700 – 2.600 €/m² (orientativo 2026)',
    avgDays: '60 – 110 días',
    cardTeaser: 'Venta digital Murcia: honorarios fijos, portales y acompañamiento hasta notaría.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-alicante', label: 'Venta digital Alicante' },
      { href: '/vender', label: 'Hub vender' },
    ],
    localFaq:
      '<details><summary>¿Atendéis Molina de Segura o Alcantarilla?</summary><p>Sí en plan digital si puedes recibir visitas. Misma operativa remota que en otras capitales.</p></details>' +
      '<details><summary>¿Cuándo pago?</summary><p>50&nbsp;% al contratar (activa servicio) y 50&nbsp;% en escritura. Sin porcentaje sobre precio de venta.</p></details>',
    seoExtra: `<h2>Vender piso en Murcia con agencia 100 % digital</h2>
<p>Murcia capital y área metropolitana tienen tickets contenidos pero plazos que se alargan si el anuncio atrae curiosos. <strong>Inmobiliaria digital Murcia</strong> con NuevaHabitat = <strong>1.999 € + IVA</strong> y filtro previo a cada visita.</p>
<p>En <strong>240.000 €</strong>, ahorras más de <strong>15.000 €</strong> frente a un 6&nbsp;% + IVA tradicional.</p>
<h2>Universidad y familias</h2>
<p>Compradores jóvenes comparan metro bus y metros útiles; familias priorizan colegios y parking. Ajustamos ficha comercial al perfil real del activo.</p>
<h2>Herencias y varios titulares</h2>
<p>Panel único para documentación y ofertas; útil cuando varios herederos deben alinearse antes de rebajar precio.</p>`,
  },
];

function tradCommission6(price) {
  return Math.round(price * 0.06 * 1.21);
}

function tradCommission3(price) {
  return Math.round(price * 0.03 * 1.21);
}

function savingsVs6(price) {
  return tradCommission6(price) - FEE_IVA;
}

function otherCityLinks(currentSlug) {
  return CIUDADES.filter((c) => c.slug !== currentSlug)
    .map(
      (c) =>
        `<a href="/${c.slug}"><strong>${c.cityName}</strong><span>Venta 100&nbsp;% digital · 1.999&nbsp;€ + IVA</span></a>`
    )
    .join('\n      ');
}

module.exports = {
  SITE,
  FEE_BASE,
  FEE_IVA,
  FEE_HALF,
  CIUDADES,
  tradCommission6,
  tradCommission3,
  savingsVs6,
  otherCityLinks,
};
