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
  {
    slug: 'venta-digital-palma',
    cityName: 'Palma',
    navSub: 'Palma',
    keyword_principal: 'venta 100 por ciento digital Palma',
    keyword_aliases: [
      'vender piso online palma mallorca',
      'inmobiliaria digital palma',
      'agencia venta digital mallorca',
      'vender casa sin comisión palma',
      'venta piso 100 digital mallorca',
      'vender piso particular palma',
    ],
    priority: 0.93,
    areaServed: 'Palma y área de la bahía (Mallorca)',
    heroBadge: 'Plan digital · Palma',
    marketLead:
      'Ciutat, Son Armadams, Calatrava o Playa de Palma: mismo expediente online, Idealista y pisos.com, y visitas que tú programas con compradores ya filtrados.',
    zones: ['Ciutat Antiga', 'Jaume III', 'Son Armadams', 'Genova', 'Playa de Palma', 'Coll den Rabassa', 'Palmanova', 'Calvià'],
    priceExample: 385000,
    priceM2: '3.200 – 5.500 €/m² (orientativo 2026)',
    avgDays: '55 – 100 días',
    cardTeaser: 'Venta digital en Palma y Mallorca: 1.999 € + IVA, panel y visitas del propietario.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-valencia', label: 'Venta digital Valencia' },
      { href: '/venta-digital-barcelona', label: 'Venta digital Barcelona' },
    ],
    localFaq:
      '<details><summary>¿Trabajáis en toda Mallorca?</summary><p>El plan digital funciona donde puedas recibir visitas cualificadas (Palma, calvià, etc.). Confirmamos cobertura en valoración.</p></details>' +
      '<details><summary>¿Compradores internacionales?</summary><p>Frecuentes; revisamos solvencia y plazo antes de cada visita.</p></details>',
    seoExtra: `<h2>Vender piso en Palma con inmobiliaria digital</h2>
<p>Mallorca combina demanda local, nacional y europea. <strong>Venta 100 % digital Palma</strong> mantiene <strong>1.999 € + IVA</strong> fijos y evita pagar 3&nbsp;–&nbsp;6&nbsp;% sobre un ticket que en zonas céntricas supera con facilidad los 350.000&nbsp;€.</p>
<h2>Son Armadams vs Playa de Palma</h2>
<p>No mezclamos comparables de segunda residencia con vivienda habitual: el pricing y el anuncio cambian. NuevaHabitat valora con cierres reales de tu micro-zona.</p>
<h2>Panel y remoto</h2>
<p>Si no resides todo el año en la isla, coordinamos visitas en franjas concretas y llevas el expediente desde el móvil.</p>`,
  },
  {
    slug: 'venta-digital-las-palmas',
    cityName: 'Las Palmas de Gran Canaria',
    navSub: 'Las Palmas',
    keyword_principal: 'venta 100 por ciento digital Las Palmas',
    keyword_aliases: [
      'vender piso online las palmas',
      'inmobiliaria digital gran canaria',
      'agencia venta digital las palmas',
      'vender casa sin comisión las palmas',
      'venta piso 100 digital gran canaria',
      'vender piso particular las palmas',
    ],
    priority: 0.93,
    areaServed: 'Las Palmas de Gran Canaria y área metropolitana',
    heroBadge: 'Plan digital · Las Palmas',
    marketLead:
      'Las Canteras, Guanarteme, Vegueta o Telde: precio fijo 1.999&nbsp;€ + IVA, difusión en portales y tú en visitas con solvencia revisada.',
    zones: ['Las Canteras', 'Guanarteme', 'Vegueta', 'Alcaravaneras', 'Schamann', 'Tafira', 'Telde', 'Vecindario'],
    priceExample: 260000,
    priceM2: '2.300 – 4.000 €/m² (orientativo 2026)',
    avgDays: '60 – 110 días',
    cardTeaser: 'Venta digital Las Palmas: honorarios fijos, Idealista y compradores filtrados.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-santa-cruz-de-tenerife', label: 'Venta digital Tenerife' },
      { href: '/venta-digital-malaga', label: 'Venta digital Málaga' },
    ],
    localFaq:
      '<details><summary>¿Incluís sur de Gran Canaria?</summary><p>Sí si puedes atender visitas (Telde, Vecindario…). Lo validamos al inicio.</p></details>' +
      '<details><summary>¿Idealista Canarias?</summary><p>Publicación en Idealista y pisos.com con reportaje; leads pasan por filtro.</p></details>',
    seoExtra: `<h2>Vender piso en Las Palmas sin comisión porcentual</h2>
<p>El mercado canario mueve segundas residencias y compradores insulares. <strong>Vender piso online Las Palmas</strong> con NuevaHabitat = intermediación con <strong>honorarios cerrados</strong>, no un porcentaje opaco.</p>
<h2>Zona costera vs interior urbano</h2>
<p>Las Canteras y Guanarteme no compiten en el mismo comprador que Schamann: ajustamos ficha y precio de salida.</p>
<h2>Visitas en tu calendario</h2>
<p>Filtramos antes de agendar; evitas turistas curiosos sin financiación.</p>`,
  },
  {
    slug: 'venta-digital-santa-cruz-de-tenerife',
    cityName: 'Santa Cruz de Tenerife',
    navSub: 'Santa Cruz',
    keyword_principal: 'venta 100 por ciento digital Santa Cruz de Tenerife',
    keyword_aliases: [
      'vender piso online santa cruz tenerife',
      'inmobiliaria digital tenerife',
      'agencia venta digital santa cruz',
      'vender casa sin comisión tenerife',
      'venta piso 100 digital tenerife',
      'vender piso particular santa cruz',
    ],
    priority: 0.93,
    areaServed: 'Santa Cruz de Tenerife y área metropolitana',
    heroBadge: 'Plan digital · Santa Cruz',
    marketLead:
      'Centro, Rambla, La Laguna o El Rosario: mismo panel, portales nacionales y negociación hasta escritura con visitas que tú recibes.',
    zones: ['Centro', 'Zona Rambla', 'Añaza', 'Único', 'La Laguna', 'El Rosario', 'Tacoronte', 'Puerto de la Cruz'],
    priceExample: 255000,
    priceM2: '2.200 – 3.900 €/m² (orientativo 2026)',
    avgDays: '60 – 110 días',
    cardTeaser: 'Venta digital Tenerife · Santa Cruz: 1.999 € + IVA y panel vendedor.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-las-palmas', label: 'Venta digital Las Palmas' },
      { href: '/vender', label: 'Hub vender' },
    ],
    localFaq:
      '<details><summary>¿Atendéis La Laguna y norte?</summary><p>Sí en plan digital si puedes recibir visitas cualificadas. Confirmamos desplazamientos del comprador.</p></details>',
    seoExtra: `<h2>Inmobiliaria digital en Santa Cruz de Tenerife</h2>
<p>Tenerife mezcla mercado insular y compradores de península. El plan <strong>venta 100 % digital</strong> mantiene <strong>1.999 € + IVA</strong> aunque el precio final suba o baje tras negociación.</p>
<h2>Precio y comparables</h2>
<p>Valoramos con cierres por barrio; no usamos solo el anuncio más alto del portal.</p>
<h2>Remoto + visitas locales</h2>
<p>Gestión desde panel; tú abres en las franjas que marcas.</p>`,
  },
  {
    slug: 'venta-digital-vigo',
    cityName: 'Vigo',
    navSub: 'Vigo',
    keyword_principal: 'venta 100 por ciento digital Vigo',
    keyword_aliases: [
      'vender piso online vigo',
      'inmobiliaria digital vigo',
      'agencia venta digital vigo',
      'vender casa sin comisión vigo',
      'venta piso 100 digital vigo',
      'vender piso particular vigo',
    ],
    priority: 0.92,
    areaServed: 'Vigo y área metropolitana (Pontevedra)',
    heroBadge: 'Plan digital · Vigo',
    marketLead:
      'Casco, Coya, Navia o Redondela: agencia digital con portales, cartera y filtro antes de cada visita en tu domicilio.',
    zones: ['Casco', 'Coya', 'Navia', 'Teis', 'Valadares', 'Cambre', 'Redondela', 'Porriño'],
    priceExample: 235000,
    priceM2: '1.900 – 2.900 €/m² (orientativo 2026)',
    avgDays: '55 – 105 días',
    cardTeaser: 'Venta digital Vigo: precio fijo 1.999 € + IVA, Idealista y panel.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-a-coruna', label: 'Venta digital A Coruña' },
      { href: '/vender', label: 'Hub vender' },
    ],
    localFaq:
      '<details><summary>¿Cubrís comarca de Vigo?</summary><p>Sí si puedes recibir visitas (Redondela, Porriño…). Lo confirmamos en valoración.</p></details>',
    seoExtra: `<h2>Vender piso en Vigo con precio fijo</h2>
<p>Galicia mueve demanda conservadora en financiación: por eso <strong>filtramos antes de visita</strong>. <strong>Venta digital Vigo</strong> evita comisiones del 6&nbsp;% sobre tickets orientativos de 200.000–280.000&nbsp;€.</p>
<h2>Puerto vs ensanche</h2>
<p>Cambia el comprador (inversión, joven, familiar). Ajustamos reportaje y titular del anuncio.</p>`,
  },
  {
    slug: 'venta-digital-a-coruna',
    cityName: 'A Coruña',
    navSub: 'A Coruña',
    keyword_principal: 'venta 100 por ciento digital A Coruña',
    keyword_aliases: [
      'vender piso online a coruña',
      'inmobiliaria digital coruña',
      'agencia venta digital coruña',
      'vender casa sin comisión coruña',
      'venta piso 100 digital a coruña',
      'vender piso particular coruña',
    ],
    priority: 0.92,
    areaServed: 'A Coruña y comarca',
    heroBadge: 'Plan digital · A Coruña',
    marketLead:
      'Centro, Os Castros, Eiris o Oza: venta con honorarios 1.999&nbsp;€ + IVA y expediente online hasta notaría.',
    zones: ['Centro', 'Os Castros', 'Los Rosales', 'Eiris', 'Oza', 'Culleredo', 'Oleiros', 'Sada'],
    priceExample: 245000,
    priceM2: '2.000 – 3.200 €/m² (orientativo 2026)',
    avgDays: '55 – 100 días',
    cardTeaser: 'Venta digital A Coruña: inmobiliaria online con visitas cualificadas.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-vigo', label: 'Venta digital Vigo' },
      { href: '/vender', label: 'Hub vender' },
    ],
    localFaq:
      '<details><summary>¿Atendéis Oleiros y metrópoli?</summary><p>Sí en digital si puedes abrir en visitas. Mismos portales y panel.</p></details>',
    seoExtra: `<h2>Venta 100 % digital en A Coruña</h2>
<p>La Coruña combina mercado local y compradores por traslado laboral. <strong>Inmobiliaria digital</strong> con NuevaHabitat centraliza negociación y documentos: menos fricción que gestionar todo como particular.</p>
<h2>Casco vs ampliación</h2>
<p>ITE, ascensor y orientación marcan el ticket. Subimos documentación al panel antes de abrir puerta.</p>`,
  },
  {
    slug: 'venta-digital-cordoba',
    cityName: 'Córdoba',
    navSub: 'Córdoba',
    keyword_principal: 'venta 100 por ciento digital Córdoba',
    keyword_aliases: [
      'vender piso online cordoba',
      'inmobiliaria digital cordoba',
      'agencia venta digital cordoba',
      'vender casa sin comisión cordoba',
      'venta piso 100 digital cordoba',
      'vender piso particular cordoba',
    ],
    priority: 0.92,
    areaServed: 'Córdoba capital y área metropolitana',
    heroBadge: 'Plan digital · Córdoba',
    marketLead:
      'Centro histórico, Ciudad Jardín, Sector Sur o El Brillante: publicación profesional, filtro y tú en visitas en tus franjas.',
    zones: ['Judería', 'Centro', 'Ciudad Jardín', 'Sector Sur', 'El Brillante', 'Asomadilla', 'Santa Cruz', 'Villafranca'],
    priceExample: 225000,
    priceM2: '1.900 – 2.800 €/m² (orientativo 2026)',
    avgDays: '60 – 105 días',
    cardTeaser: 'Venta digital Córdoba: 1.999 € + IVA, panel y portales.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-sevilla', label: 'Venta digital Sevilla' },
      { href: '/venta-digital-malaga', label: 'Venta digital Málaga' },
    ],
    localFaq:
      '<details><summary>¿Idealista Córdoba?</summary><p>Sí, más pisos.com y cartera con filtro previo.</p></details>',
    seoExtra: `<h2>Vender piso en Córdoba con agencia digital</h2>
<p>Patrimonio y fincas con patios atraen perfiles distintos a las ampliaciones modernas. Segmentamos anuncio y comparables por tipología, no por capital genérica.</p>
<p>Honorarios <strong>1.999 € + IVA</strong> sin porcentaje sobre el precio cerrado.</p>`,
  },
  {
    slug: 'venta-digital-granada',
    cityName: 'Granada',
    navSub: 'Granada',
    keyword_principal: 'venta 100 por ciento digital Granada',
    keyword_aliases: [
      'vender piso online granada',
      'inmobiliaria digital granada',
      'agencia venta digital granada',
      'vender casa sin comisión granada',
      'venta piso 100 digital granada',
      'vender piso particular granada',
    ],
    priority: 0.92,
    areaServed: 'Granada capital y vega',
    heroBadge: 'Plan digital · Granada',
    marketLead:
      'Albaicín, Realejo, Zaidín o Armilla: venta digital con Idealista, cartera y visitas solo con hipoteca o liquidez OK.',
    zones: ['Albaicín', 'Realejo', 'Centro', 'Zaidín', 'Bola de Oro', 'La Chana', 'Armilla', 'Las Gabias'],
    priceExample: 230000,
    priceM2: '1.900 – 2.900 €/m² (orientativo 2026)',
    avgDays: '60 – 110 días',
    cardTeaser: 'Venta digital Granada: honorarios fijos y filtro de compradores.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-malaga', label: 'Venta digital Málaga' },
      { href: '/venta-digital-cordoba', label: 'Venta digital Córdoba' },
    ],
    localFaq:
      '<details><summary>¿Turismo y segunda residencia?</summary><p>Sí; por eso contratamos solvencia antes de visita.</p></details>',
    seoExtra: `<h2>Inmobiliaria 100 % digital en Granada</h2>
<p>El comprador del Albaicín no es el de la vega: precisamos en ficha y en valoración. <strong>Venta 100 % digital Granada</strong> mantiene coste fijo aunque el precio final se negocie.</p>
<h2>Estudiantes y familias</h2>
<p>Explicitamos uso y rendimiento según zona para atraer el perfil adecuado.</p>`,
  },
  {
    slug: 'venta-digital-valladolid',
    cityName: 'Valladolid',
    navSub: 'Valladolid',
    keyword_principal: 'venta 100 por ciento digital Valladolid',
    keyword_aliases: [
      'vender piso online valladolid',
      'inmobiliaria digital valladolid',
      'agencia venta digital valladolid',
      'vender casa sin comisión valladolid',
      'venta piso 100 digital valladolid',
      'vender piso particular valladolid',
    ],
    priority: 0.92,
    areaServed: 'Valladolid capital y área metropolitana',
    heroBadge: 'Plan digital · Valladolid',
    marketLead:
      'Centro, Delicias, Parquesol o Laguna: mismos portales, mismo panel y tú en visitas con horarios claros.',
    zones: ['Centro', 'Huerta del Rey', 'Parquesol', 'Delicias', 'La Overuela', 'Pajarillos', 'Laguna', 'Simancas'],
    priceExample: 210000,
    priceM2: '1.600 – 2.400 €/m² (orientativo 2026)',
    avgDays: '65 – 115 días',
    cardTeaser: 'Venta digital Valladolid: 1.999 € + IVA y expediente online.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-madrid', label: 'Venta digital Madrid' },
      { href: '/venta-digital-bilbao', label: 'Venta digital Bilbao' },
    ],
    localFaq:
      '<details><summary>¿Ave y compradores de Madrid?</summary><p>Frecuentes; agenda visitas en franjas y filtramos antes de abrir.</p></details>',
    seoExtra: `<h2>Venta digital de vivienda en Valladolid</h2>
<p>Mercado interior con tickets moderados pero comisiones porcentuales caras en relación al precio. <strong>1.999 € + IVA</strong> deja el coste predecible.</p>
<h2>Centro vs ensanche</h2>
<p>Comparables por finca y ascensor, no solo €/m² medio de provincia.</p>`,
  },
  {
    slug: 'venta-digital-pamplona',
    cityName: 'Pamplona',
    navSub: 'Pamplona',
    keyword_principal: 'venta 100 por ciento digital Pamplona',
    keyword_aliases: [
      'vender piso online pamplona',
      'inmobiliaria digital pamplona',
      'agencia venta digital pamplona iruña',
      'vender casa sin comisión pamplona',
      'venta piso 100 digital navarra',
      'vender piso particular pamplona',
    ],
    priority: 0.92,
    areaServed: 'Pamplona-Iruña y comarca',
    heroBadge: 'Plan digital · Pamplona',
    marketLead:
      'Casco viejo, Rochapea, Yamaguchi o Barañáin: precio fijo, portales y compradores cualificados antes de cada visita.',
    zones: ['Casco viejo', 'Rochapea', 'Milagrosa', 'Yamaguchi', 'Echavacoiz', 'Barañáin', 'Burlada', 'Huarte'],
    priceExample: 295000,
    priceM2: '2.700 – 4.100 €/m² (orientativo 2026)',
    avgDays: '50 – 95 días',
    cardTeaser: 'Venta digital Pamplona: panel, Idealista y visitas filtradas.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-bilbao', label: 'Venta digital Bilbao' },
      { href: '/venta-digital-san-sebastian', label: 'Venta digital San Sebastián' },
    ],
    localFaq:
      '<details><summary>¿Compradores con hipoteca?</summary><p>Sí; verificamos antes de agendar en tu calendario.</p></details>',
    seoExtra: `<h2>Vender piso en Pamplona con honorarios fijos</h2>
<p>Pamplona tiene mercado tensionado en determinadas zonas: el 6&nbsp;% + IVA sobre 300.000&nbsp;€ duele. El plan digital mantiene <strong>1.999 € + IVA</strong>.</p>
<h2>Rochapea vs casco</h2>
<p>Diferente comprador y estado de finca. Ajustamos argumentario y reportaje.</p>`,
  },
  {
    slug: 'venta-digital-san-sebastian',
    cityName: 'San Sebastián',
    navSub: 'Donostia',
    keyword_principal: 'venta 100 por ciento digital San Sebastián',
    keyword_aliases: [
      'vender piso online san sebastian',
      'inmobiliaria digital donostia',
      'agencia venta digital gipuzkoa',
      'vender casa sin comisión donostia',
      'venta piso 100 digital san sebastian',
      'vender piso particular gipuzkoa',
    ],
    priority: 0.92,
    areaServed: 'Donostia-San Sebastián y comarca',
    heroBadge: 'Plan digital · San Sebastián',
    marketLead:
      'Centro, Gros, Amara o Antiguo: venta digital con precio fijo; tú en visitas y NuevaHabitat en marketing y cierre.',
    zones: ['Parte Vieja', 'Gros', 'Centro', 'Amara', 'Antiguo', 'Loiola', 'Pasajes', 'Hernani'],
    priceExample: 455000,
    priceM2: '4.500 – 7.000 €/m² (orientativo 2026)',
    avgDays: '50 – 90 días',
    cardTeaser: 'Venta digital San Sebastián: 1.999 € + IVA frente a comisión porcentual.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-bilbao', label: 'Venta digital Bilbao' },
      { href: '/venta-digital-pamplona', label: 'Venta digital Pamplona' },
    ],
    localFaq:
      '<details><summary>¿Ticket alto y negociación?</summary><p>Honorarios siguen siendo 1.999&nbsp;€ + IVA; no un % del precio final.</p></details>',
    seoExtra: `<h2>Venta 100 % digital en Donostia</h2>
<p>En zonas prime el 3&nbsp;%–6&nbsp;% de agencia representa decenas de miles de euros. El modelo NuevaHabitat con <strong>honorarios fijos</strong> mantiene coste predecible.</p>
<h2>Comprador local e internacional</h2>
<p>Filtramos capacidad de pago y plazo antes de visita; tú controlas franjas en el panel.</p>`,
  },
  {
    slug: 'venta-digital-gijon',
    cityName: 'Gijón',
    navSub: 'Gijón',
    keyword_principal: 'venta 100 por ciento digital Gijón',
    keyword_aliases: [
      'vender piso online gijon',
      'inmobiliaria digital gijon',
      'agencia venta digital asturias',
      'vender casa sin comisión gijon',
      'venta piso 100 digital asturias',
      'vender piso particular gijon',
    ],
    priority: 0.91,
    areaServed: 'Gijón y área central de Asturias',
    heroBadge: 'Plan digital · Gijón',
    marketLead:
      'Cimadevilla, Natahoyo, Llarena o Somió: publicación profesional, filtro de compradores y tú abres en las franjas del panel.',
    zones: ['Cimadevilla', 'Centro', 'Natahoyo', 'La Calzada', 'Deva', 'Somió', 'Monteana', 'Villaviciosa'],
    priceExample: 195000,
    priceM2: '1.500 – 2.400 €/m² (orientativo 2026)',
    avgDays: '60 – 115 días',
    cardTeaser: 'Venta digital Gijón: 1.999 € + IVA, Idealista y visitas filtradas.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-oviedo', label: 'Venta digital Oviedo' },
      { href: '/venta-digital-bilbao', label: 'Venta digital Bilbao' },
    ],
    localFaq:
      '<details><summary>¿Incluye zona rural o concejos?</summary><p>Sí en plan digital si puedes recibir visitas; confirmamos desplazamientos del comprador.</p></details>',
    seoExtra: `<h2>Vender piso en Gijón con agencia digital</h2>
<p>Asturias tiene demanda mixta (local, Madrid, norte). <strong>Venta 100 % digital Gijón</strong> mantiene <strong>1.999 € + IVA</strong> sin porcentaje sobre el precio cerrado.</p>
<h2>Casco vs ensanche</h2>
<p>Alturas, ascensor y estado de fachada cambian el perfil del comprador: lo reflejamos en ficha y reportaje.</p>`,
  },
  {
    slug: 'venta-digital-oviedo',
    cityName: 'Oviedo',
    navSub: 'Oviedo',
    keyword_principal: 'venta 100 por ciento digital Oviedo',
    keyword_aliases: [
      'vender piso online oviedo',
      'inmobiliaria digital oviedo',
      'agencia venta digital oviedo',
      'vender casa sin comisión asturias',
      'venta piso 100 digital oviedo',
      'vender piso particular oviedo',
    ],
    priority: 0.91,
    areaServed: 'Oviedo capital y área urbana',
    heroBadge: 'Plan digital · Oviedo',
    marketLead:
      'Centro, El Naranco, Teatinos o Lugones: mismo panel, portales y negociación hasta escritura con visitas que gestionas tú.',
    zones: ['Centro', 'El Naranco', 'Teatinos', 'Pumard', 'Buenavista', 'Colloto', 'Lugones', 'Siero'],
    priceExample: 210000,
    priceM2: '1.600 – 2.500 €/m² (orientativo 2026)',
    avgDays: '60 – 110 días',
    cardTeaser: 'Venta digital Oviedo: honorarios fijos y expediente online.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-gijon', label: 'Venta digital Gijón' },
      { href: '/venta-digital-valladolid', label: 'Venta digital Valladolid' },
    ],
    localFaq:
      '<details><summary>¿Compradores desde otras provincias?</summary><p>Frecuentes; agendamos con criterio y filtro de solvencia antes de abrir.</p></details>',
    seoExtra: `<h2>Inmobiliaria digital en Oviedo</h2>
<p>Oviedo mueve mercado estable con tickets moderados: una comisión del 6&nbsp;% + IVA pesa mucho en relación al precio. El plan digital deja el coste cerrado en <strong>1.999 € + IVA</strong>.</p>
<h2>Universidad y familias</h2>
<p>Ajustamos mensaje según uso (inversión, vivienda habitual, herencia) para atraer leads serios.</p>`,
  },
  {
    slug: 'venta-digital-santander',
    cityName: 'Santander',
    navSub: 'Santander',
    keyword_principal: 'venta 100 por ciento digital Santander',
    keyword_aliases: [
      'vender piso online santander',
      'inmobiliaria digital cantabria',
      'agencia venta digital santander',
      'vender casa sin comisión cantabria',
      'venta piso 100 digital santander',
      'vender piso particular santander',
    ],
    priority: 0.91,
    areaServed: 'Santander y bahía',
    heroBadge: 'Plan digital · Santander',
    marketLead:
      'Centro, Sardinero, Peñacastillo o El Alisal: venta digital con filtro, Idealista y tú en visitas en tu calendario.',
    zones: ['Centro', 'Perines', 'El Alisal', 'Sardinero', 'Cueto', 'Peñacastillo', 'Valdenoja', 'Santa Cruz de Bezana'],
    priceExample: 265000,
    priceM2: '2.400 – 3.600 €/m² (orientativo 2026)',
    avgDays: '55 – 100 días',
    cardTeaser: 'Venta digital Santander: 1.999 € + IVA y panel vendedor.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-bilbao', label: 'Venta digital Bilbao' },
      { href: '/venta-digital-vigo', label: 'Venta digital Vigo' },
    ],
    localFaq:
      '<details><summary>¿Segunda residencia en la bahía?</summary><p>Sí; por eso verificamos solvencia y plazo antes de cada visita.</p></details>',
    seoExtra: `<h2>Venta digital de vivienda en Santander</h2>
<p>La bahía concentra vistas y turismo residencial: necesitas anuncio sólido y menos curiosos en casa. <strong>Inmobiliaria digital</strong> con NuevaHabitat combina portales, cartera y filtro.</p>
<h2>Honorarios fijos</h2>
<p><strong>1.999 € + IVA</strong> en dos pagos 50/50, sin comisión sobre el precio final.</p>`,
  },
  {
    slug: 'venta-digital-burgos',
    cityName: 'Burgos',
    navSub: 'Burgos',
    keyword_principal: 'venta 100 por ciento digital Burgos',
    keyword_aliases: [
      'vender piso online burgos',
      'inmobiliaria digital burgos',
      'agencia venta digital burgos',
      'vender casa sin comisión burgos',
      'venta piso 100 digital burgos',
      'vender piso particular burgos',
    ],
    priority: 0.91,
    areaServed: 'Burgos capital y comarca',
    heroBadge: 'Plan digital · Burgos',
    marketLead:
      'Centro histórico, Gamonal, Parque o Villimar: precio fijo, portales nacionales y negociación centralizada en el panel.',
    zones: ['Centro', 'Gamonal', 'San Pedro', 'Villimar', 'Parque', 'Fuentes Blancas', 'Aranda de Duero', 'Miranda de Ebro'],
    priceExample: 185000,
    priceM2: '1.400 – 2.200 €/m² (orientativo 2026)',
    avgDays: '65 – 120 días',
    cardTeaser: 'Venta digital Burgos: precio fijo y filtro antes de visita.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-valladolid', label: 'Venta digital Valladolid' },
      { href: '/venta-digital-bilbao', label: 'Venta digital Bilbao' },
    ],
    localFaq:
      '<details><summary>¿Aranda o Miranda?</summary><p>Plan digital si puedes recibir visitas; confirmamos en valoración.</p></details>',
    seoExtra: `<h2>Vender piso en Burgos sin comisión porcentual</h2>
<p>Mercado interior con rotación más lenta si el anuncio atrae poca demanda cualificada. <strong>Venta 100 % digital Burgos</strong> suma difusión profesional y filtro previo.</p>
<h2>Centro vs ensanche</h2>
<p>Comparables por finca y estado, no solo €/m² medio provincial.</p>`,
  },
  {
    slug: 'venta-digital-leon',
    cityName: 'León',
    navSub: 'León',
    keyword_principal: 'venta 100 por ciento digital León',
    keyword_aliases: [
      'vender piso online leon',
      'inmobiliaria digital leon',
      'agencia venta digital leon',
      'vender casa sin comisión leon',
      'venta piso 100 digital leon',
      'vender piso particular leon',
    ],
    priority: 0.91,
    areaServed: 'León capital y alfoz',
    heroBadge: 'Plan digital · León',
    marketLead:
      'Casco, Eras de Renueva, Pinilla o La Lastra: agencia digital remota, tú en visitas y mismo expediente Stripe + panel.',
    zones: ['Casco', 'Eras de Renueva', 'Pinilla', 'La Lastra', 'La Palomera', 'Villaobispo', 'San Andrés del Rabanedo', 'Valverde'],
    priceExample: 175000,
    priceM2: '1.300 – 2.000 €/m² (orientativo 2026)',
    avgDays: '65 – 120 días',
    cardTeaser: 'Venta digital León: 1.999 € + IVA, Idealista y panel.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-valladolid', label: 'Venta digital Valladolid' },
      { href: '/venta-digital-burgos', label: 'Venta digital Burgos' },
    ],
    localFaq:
      '<details><summary>¿Piso heredado o varios titulares?</summary><p>Panel único para documentos y ofertas; alineamos pasos antes de bajar precio.</p></details>',
    seoExtra: `<h2>Inmobiliaria digital en León</h2>
<p>León compite con oferta dispersa en portales: sin filtro, se alargan visitas vacías. NuevaHabitat publica en <strong>Idealista y pisos.com</strong> y revisa hipoteca o liquidez antes de agendar.</p>
<h2>Coste predecible</h2>
<p>Honorarios <strong>1.999 € + IVA</strong>, sin porcentaje sobre el precio de venta.</p>`,
  },
  {
    slug: 'venta-digital-salamanca',
    cityName: 'Salamanca',
    navSub: 'Salamanca',
    keyword_principal: 'venta 100 por ciento digital Salamanca',
    keyword_aliases: [
      'vender piso online salamanca',
      'inmobiliaria digital salamanca',
      'agencia venta digital salamanca',
      'vender casa sin comisión salamanca',
      'venta piso 100 digital salamanca',
      'vender piso particular salamanca',
    ],
    priority: 0.91,
    areaServed: 'Salamanca capital y alfoz',
    heroBadge: 'Plan digital · Salamanca',
    marketLead:
      'Centro histórico, Garrido, Parque o Santa Marta: venta digital con demanda universitaria y turística filtrada antes de cada visita.',
    zones: ['Centro', 'Arrabal', 'Garrido Norte', 'Garrido Sur', 'San José', 'Parque', 'Villares', 'Carbajosa'],
    priceExample: 215000,
    priceM2: '1.700 – 2.800 €/m² (orientativo 2026)',
    avgDays: '60 – 110 días',
    cardTeaser: 'Venta digital Salamanca: honorarios fijos y compradores cualificados.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-valladolid', label: 'Venta digital Valladolid' },
      { href: '/venta-digital-madrid', label: 'Venta digital Madrid' },
    ],
    localFaq:
      '<details><summary>¿Inversión y alquiler vacacional?</summary><p>Explicitamos uso en ficha para atraer el perfil adecuado y filtramos curiosos.</p></details>',
    seoExtra: `<h2>Vender piso en Salamanca con precio fijo</h2>
<p>Patrimonio y zona universitaria atraen perfiles distintos. <strong>Venta 100 % digital Salamanca</strong> segmenta mensaje y comparables sin cobrar un % del precio final.</p>
<h2>Panel y pagos</h2>
<p>50&nbsp;% al contratar y 50&nbsp;% en escritura; sin sorpresas si negociais el precio.</p>`,
  },
  {
    slug: 'venta-digital-logrono',
    cityName: 'Logroño',
    navSub: 'Logroño',
    keyword_principal: 'venta 100 por ciento digital Logroño',
    keyword_aliases: [
      'vender piso online logroño',
      'inmobiliaria digital logroño',
      'agencia venta digital la rioja',
      'vender casa sin comisión logroño',
      'venta piso 100 digital logroño',
      'vender piso particular la rioja',
    ],
    priority: 0.91,
    areaServed: 'Logroño y comarca',
    heroBadge: 'Plan digital · Logroño',
    marketLead:
      'Centro, Gran Vía, Yagüe o La Chabola de la Grajera: publicación, filtro y visitas en tus horarios con expediente online.',
    zones: ['Centro', 'Gran Vía', 'Zabalgana', 'Yagüe', 'Madre de Dios', 'La Laurel', 'La Chabola de la Grajera', 'Lardero'],
    priceExample: 205000,
    priceM2: '1.700 – 2.600 €/m² (orientativo 2026)',
    avgDays: '60 – 115 días',
    cardTeaser: 'Venta digital Logroño: 1.999 € + IVA y portales nacionales.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-pamplona', label: 'Venta digital Pamplona' },
      { href: '/venta-digital-bilbao', label: 'Venta digital Bilbao' },
    ],
    localFaq:
      '<details><summary>¿Compradores desde País Vasco o Navarra?</summary><p>Frecuentes; coordinamos franjas y filtro de financiación.</p></details>',
    seoExtra: `<h2>Venta digital en Logroño (La Rioja)</h2>
<p>Logroño recibe flujo regional y nacional. Con NuevaHabitat evitas comisiones porcentuales sobre tickets que rondan 180.000–240.000&nbsp;€ en muchas zonas: <strong>honorarios fijos 1.999 € + IVA</strong>.</p>
<h2>Ribera y barrios nuevos</h2>
<p>Comparables por antigüedad y garaje; no solo superficie bruta.</p>`,
  },
  {
    slug: 'venta-digital-tarragona',
    cityName: 'Tarragona',
    navSub: 'Tarragona',
    keyword_principal: 'venta 100 por ciento digital Tarragona',
    keyword_aliases: [
      'vender piso online tarragona',
      'inmobiliaria digital tarragona',
      'agencia venta digital tarragona',
      'vender casa sin comisión tarragona',
      'venta piso 100 digital camp de tarragona',
      'vender piso particular tarragona',
    ],
    priority: 0.91,
    areaServed: 'Tarragona ciudad y Camp de Tarragona',
    heroBadge: 'Plan digital · Tarragona',
    marketLead:
      'Part Alta, Eixample, Campclar o Salou: mismos portales que en Barcelona, visitas que marcas tú y negociación hasta notaría.',
    zones: ['Part Alta', 'Eixample', 'Campclar', 'Bonavista', 'Les Gavarres', 'Reus', 'Vila-seca', 'Salou'],
    priceExample: 240000,
    priceM2: '1.900 – 3.200 €/m² (orientativo 2026)',
    avgDays: '55 – 105 días',
    cardTeaser: 'Venta digital Tarragona: plan fijo 1.999 € + IVA y panel.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-barcelona', label: 'Venta digital Barcelona' },
      { href: '/venta-digital-valencia', label: 'Venta digital Valencia' },
    ],
    localFaq:
      '<details><summary>¿Costa Dorada y Reus?</summary><p>Sí en digital si puedes recibir visitas cualificadas; confirmamos en valoración.</p></details>',
    seoExtra: `<h2>Inmobiliaria digital en Tarragona</h2>
<p>Camp de Tarragona mezcla vivienda habitual, playa y inversión. <strong>Venta 100 % digital Tarragona</strong> alinea ficha y fotos al perfil real del comprador y mantiene <strong>1.999 € + IVA</strong> aunque el precio final cambie.</p>
<h2>Comparables locales</h2>
<p>No usamos solo anuncios caros del portal: miramos cierres por zona y tipología.</p>`,
  },
  {
    slug: 'venta-digital-almeria',
    cityName: 'Almería',
    navSub: 'Almería',
    keyword_principal: 'venta 100 por ciento digital Almería',
    keyword_aliases: [
      'vender piso online almeria',
      'inmobiliaria digital almeria',
      'agencia venta digital almeria',
      'vender casa sin comisión almeria',
      'venta piso 100 digital almeria',
      'vender piso particular almeria',
    ],
    priority: 0.91,
    areaServed: 'Almería capital y Poniente',
    heroBadge: 'Plan digital · Almería',
    marketLead:
      'Centro, La Chanca, Torrecárdenas o Roquetas de Mar: honorarios fijos 1.999&nbsp;€ + IVA, Idealista, pisos.com y visitas en el calendario que marcas en el panel.',
    zones: ['Centro', 'La Chanca', 'Torrecárdenas', 'Nueva Andalucía', 'El Zapillo', 'Roquetas de Mar', 'El Ejido', 'Adra'],
    priceExample: 195000,
    priceM2: '1.500 – 2.400 €/m² (orientativo 2026)',
    avgDays: '60 – 115 días',
    cardTeaser: 'Venta digital Almería: 1.999 € + IVA, panel y filtro de compradores.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-granada', label: 'Venta digital Granada' },
      { href: '/venta-digital-murcia', label: 'Venta digital Murcia' },
    ],
    localFaq:
      '<details><summary>¿Poniente y costa?</summary><p>El plan digital funciona donde puedas recibir visitas cualificadas (Roquetas, El Ejido, etc.). Lo confirmamos en valoración.</p></details>' +
      '<details><summary>¿Compradores de otras provincias?</summary><p>Frecuentes en litoral; verificamos hipoteca o liquidez antes de cada visita.</p></details>',
    seoExtra: `<h2>Vender piso en Almería con inmobiliaria digital</h2>
<p>Almería mezcla vivienda habitual, inversión en Poniente y compradores que llegan desde Murcia o Granada. <strong>Venta 100 % digital Almería</strong> mantiene <strong>1.999 € + IVA</strong> sin comisión sobre el precio de cierre.</p>
<h2>Centro vs litoral</h2>
<p>No publicamos con comparables de Roquetas si vendes en el centro: el comprador y el pricing cambian. Reportaje profesional y filtro previo a cada visita.</p>`,
  },
  {
    slug: 'venta-digital-cadiz',
    cityName: 'Cádiz',
    navSub: 'Cádiz',
    keyword_principal: 'venta 100 por ciento digital Cádiz',
    keyword_aliases: [
      'vender piso online cadiz',
      'inmobiliaria digital cadiz',
      'agencia venta digital cadiz',
      'vender casa sin comisión cadiz',
      'venta piso 100 digital cadiz',
      'vender piso particular cadiz',
    ],
    priority: 0.91,
    areaServed: 'Cádiz capital y Bahía de Cádiz',
    heroBadge: 'Plan digital · Cádiz',
    marketLead:
      'Casco antiguo, El Rosario, La Unión o San Fernando: expediente online, portales nacionales y tú en visitas con compradores ya filtrados.',
    zones: ['Casco antiguo', 'El Rosario', 'Alameda', 'El Pópulo', 'San Fernando', 'Puerto Real', 'Chiclana', 'El Puerto de Santa María'],
    priceExample: 245000,
    priceM2: '2.000 – 3.400 €/m² (orientativo 2026)',
    avgDays: '55 – 105 días',
    cardTeaser: 'Venta digital Cádiz y bahía: honorarios fijos y panel vendedor.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-sevilla', label: 'Venta digital Sevilla' },
      { href: '/venta-digital-malaga', label: 'Venta digital Málaga' },
    ],
    localFaq:
      '<details><summary>¿Incluye San Fernando o El Puerto?</summary><p>Sí en plan digital si puedes recibir visitas. Misma operativa remota que en otras capitales.</p></details>' +
      '<details><summary>¿Casco histórico con particularidades?</summary><p>Gestionamos expediente con la documentación habitual de fincas antiguas; negociación y arras en panel.</p></details>',
    seoExtra: `<h2>Inmobiliaria 100 % digital en Cádiz</h2>
<p>La bahía concentra demanda de primera vivienda, segunda residencia y traslados laborales. Buscar <strong>vender piso online Cádiz</strong> suele significar querer honorarios claros frente al 6&nbsp;% + IVA tradicional.</p>
<p>En <strong>245.000 €</strong>, el plan digital son <strong>1.999 € + IVA</strong> repartidos 50&nbsp;/&nbsp;50.</p>
<h2>Casco vs ensanche</h2>
<p>Orientación, alturas y estado de fachada condicionan el ticket; valoramos con comparables de tu calle, no solo medias provinciales.</p>`,
  },
  {
    slug: 'venta-digital-huelva',
    cityName: 'Huelva',
    navSub: 'Huelva',
    keyword_principal: 'venta 100 por ciento digital Huelva',
    keyword_aliases: [
      'vender piso online huelva',
      'inmobiliaria digital huelva',
      'agencia venta digital huelva',
      'vender casa sin comisión huelva',
      'venta piso 100 digital huelva',
      'vender piso particular huelva',
    ],
    priority: 0.9,
    areaServed: 'Huelva capital y área metropolitana',
    heroBadge: 'Plan digital · Huelva',
    marketLead:
      'Centro, Ciudad Jardín, El Torrejón o Punta Umbría: precio fijo 1.999&nbsp;€ + IVA, filtro de solvencia y negociación hasta escritura.',
    zones: ['Centro', 'Ciudad Jardín', 'El Torrejón', 'Marismas del Odiel', 'La Orden', 'Aljaraque', 'Moguer', 'Punta Umbría'],
    priceExample: 185000,
    priceM2: '1.400 – 2.200 €/m² (orientativo 2026)',
    avgDays: '65 – 120 días',
    cardTeaser: 'Venta digital Huelva: 1.999 € + IVA, Idealista y visitas filtradas.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-sevilla', label: 'Venta digital Sevilla' },
      { href: '/venta-digital-cadiz', label: 'Venta digital Cádiz' },
    ],
    localFaq:
      '<details><summary>¿Costa de la Luz?</summary><p>Cubrimos municipios cercanos si puedes atender visitas cualificadas. Confirmamos en la valoración inicial.</p></details>',
    seoExtra: `<h2>Venta digital de vivienda en Huelva</h2>
<p>Huelva capital y área mueven tickets moderados donde una comisión del 6&nbsp;% + IVA pesa desproporcionadamente. <strong>Honorarios fijos 1.999 € + IVA</strong> dejan el coste predecible.</p>
<h2>Panel y plazos</h2>
<p>Contrato digital, publicación en portales y calendario de visitas que tú controlas desde el móvil.</p>`,
  },
  {
    slug: 'venta-digital-jaen',
    cityName: 'Jaén',
    navSub: 'Jaén',
    keyword_principal: 'venta 100 por ciento digital Jaén',
    keyword_aliases: [
      'vender piso online jaen',
      'inmobiliaria digital jaen',
      'agencia venta digital jaen',
      'vender casa sin comisión jaen',
      'venta piso 100 digital jaen',
      'vender piso particular jaen',
    ],
    priority: 0.9,
    areaServed: 'Jaén capital y comarca',
    heroBadge: 'Plan digital · Jaén',
    marketLead:
      'Centro, Plaza de la Constitución, La Magdalena o Martos: agencia digital con portales nacionales y visitas solo con financiación revisada.',
    zones: ['Centro', 'La Magdalena', 'Belén', 'San Juan de Dios', 'El Valle', 'Mengíbar', 'Martos', 'Linares'],
    priceExample: 165000,
    priceM2: '1.200 – 1.900 €/m² (orientativo 2026)',
    avgDays: '70 – 125 días',
    cardTeaser: 'Venta digital Jaén: precio fijo y compradores cualificados.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-granada', label: 'Venta digital Granada' },
      { href: '/venta-digital-cordoba', label: 'Venta digital Córdoba' },
    ],
    localFaq:
      '<details><summary>¿Linares y Martos?</summary><p>Sí en digital si puedes recibir visitas. Leads y negociación centralizados en panel.</p></details>',
    seoExtra: `<h2>Vender piso en Jaén sin comisión porcentual</h2>
<p>Mercado interior con rotación que se alarga si el anuncio atrae curiosos. NuevaHabitat filtra antes de agendar y mantiene <strong>1.999 € + IVA</strong> aunque negociéis el precio final.</p>
<h2>Herencias y varios titulares</h2>
<p>Útil cuando varios propietarios deben alinearse: documentos y ofertas en un solo expediente online.</p>`,
  },
  {
    slug: 'venta-digital-badajoz',
    cityName: 'Badajoz',
    navSub: 'Badajoz',
    keyword_principal: 'venta 100 por ciento digital Badajoz',
    keyword_aliases: [
      'vender piso online badajoz',
      'inmobiliaria digital badajoz',
      'agencia venta digital badajoz',
      'vender casa sin comisión extremadura',
      'venta piso 100 digital badajoz',
      'vender piso particular badajoz',
    ],
    priority: 0.9,
    areaServed: 'Badajoz capital y área metropolitana',
    heroBadge: 'Plan digital · Badajoz',
    marketLead:
      'Centro, San Fernando, El Pilar o Valverde de Leganés: mismos portales, mismo panel y tú abres en las franjas que marques.',
    zones: ['Centro', 'San Fernando', 'El Pilar', 'La Estación', 'Ronda del Pilar', 'Valverde de Leganés', 'Mérida', 'Montijo'],
    priceExample: 175000,
    priceM2: '1.300 – 2.000 €/m² (orientativo 2026)',
    avgDays: '65 – 120 días',
    cardTeaser: 'Venta digital Badajoz: 1.999 € + IVA y expediente online.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-caceres', label: 'Venta digital Cáceres' },
      { href: '/venta-digital-sevilla', label: 'Venta digital Sevilla' },
    ],
    localFaq:
      '<details><summary>¿Atendéis Mérida?</summary><p>En plan digital sí, si puedes recibir visitas cualificadas. Confirmamos cobertura al inicio.</p></details>',
    seoExtra: `<h2>Inmobiliaria digital en Badajoz</h2>
<p>Extremadura mueve demanda local y compradores que comparan con Cáceres o Sevilla. <strong>Venta 100 % digital Badajoz</strong> combina difusión profesional y filtro de solvencia.</p>
<p>Sobre <strong>175.000 €</strong>, ahorras más de <strong>11.000 €</strong> frente a un 6&nbsp;% + IVA tradicional.</p>`,
  },
  {
    slug: 'venta-digital-caceres',
    cityName: 'Cáceres',
    navSub: 'Cáceres',
    keyword_principal: 'venta 100 por ciento digital Cáceres',
    keyword_aliases: [
      'vender piso online caceres',
      'inmobiliaria digital caceres',
      'agencia venta digital caceres',
      'vender casa sin comisión extremadura',
      'venta piso 100 digital caceres',
      'vender piso particular caceres',
    ],
    priority: 0.9,
    areaServed: 'Cáceres capital y comarca',
    heroBadge: 'Plan digital · Cáceres',
    marketLead:
      'Casco antiguo, San Jorge, El Rosario o Valdesalor: precio fijo, reportaje profesional y visitas con hipoteca o liquidez revisada.',
    zones: ['Casco antiguo', 'San Jorge', 'El Rosario', 'Río Seco', 'Valdesalor', 'Plasencia', 'Trujillo', 'Miajadas'],
    priceExample: 168000,
    priceM2: '1.250 – 2.000 €/m² (orientativo 2026)',
    avgDays: '70 – 125 días',
    cardTeaser: 'Venta digital Cáceres: honorarios fijos y panel vendedor.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-badajoz', label: 'Venta digital Badajoz' },
      { href: '/venta-digital-salamanca', label: 'Venta digital Salamanca' },
    ],
    localFaq:
      '<details><summary>¿Plasencia y comarca?</summary><p>Sí si puedes atender visitas; operativa remota idéntica a otras capitales.</p></details>',
    seoExtra: `<h2>Venta 100 % digital en Cáceres</h2>
<p>Patrimonio y ensanches modernos atraen compradores distintos: ajustamos anuncio y comparables. Honorarios <strong>1.999 € + IVA</strong>, no porcentaje sobre venta.</p>`,
  },
  {
    slug: 'venta-digital-toledo',
    cityName: 'Toledo',
    navSub: 'Toledo',
    keyword_principal: 'venta 100 por ciento digital Toledo',
    keyword_aliases: [
      'vender piso online toledo',
      'inmobiliaria digital toledo',
      'agencia venta digital castilla la mancha',
      'vender casa sin comisión toledo',
      'venta piso 100 digital toledo',
      'vender piso particular toledo',
    ],
    priority: 0.91,
    areaServed: 'Toledo capital y área metropolitana',
    heroBadge: 'Plan digital · Toledo',
    marketLead:
      'Casco, Santa Bárbara, Azucaica o Talavera de la Reina: venta digital con Idealista, cartera y filtro antes de cada visita.',
    zones: ['Casco', 'Santa Bárbara', 'Azucaica', 'Palomarejos', 'Ensanche', 'Talavera de la Reina', 'Illescas', 'Torrijos'],
    priceExample: 198000,
    priceM2: '1.400 – 2.300 €/m² (orientativo 2026)',
    avgDays: '60 – 115 días',
    cardTeaser: 'Venta digital Toledo: 1.999 € + IVA y compradores filtrados.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-madrid', label: 'Venta digital Madrid' },
      { href: '/venta-digital-albacete', label: 'Venta digital Albacete' },
    ],
    localFaq:
      '<details><summary>¿Compradores desde Madrid?</summary><p>Frecuentes por AVE y teletrabajo; filtramos solvencia antes de abrir tu puerta.</p></details>' +
      '<details><summary>¿Talavera o sur de provincia?</summary><p>Plan digital si puedes recibir visitas; lo validamos en valoración.</p></details>',
    seoExtra: `<h2>Vender piso en Toledo con agencia digital</h2>
<p>Toledo recibe demanda mixta: familiar local, teletrabajo desde Madrid y turismo residencial en casco. <strong>Venta 100 % digital Toledo</strong> mantiene coste cerrado en <strong>1.999 € + IVA</strong>.</p>
<h2>Casco vs periferia</h2>
<p>Diferente regulación de fincas y expectativas de precio: segmentamos ficha comercial al activo real.</p>`,
  },
  {
    slug: 'venta-digital-albacete',
    cityName: 'Albacete',
    navSub: 'Albacete',
    keyword_principal: 'venta 100 por ciento digital Albacete',
    keyword_aliases: [
      'vender piso online albacete',
      'inmobiliaria digital albacete',
      'agencia venta digital albacete',
      'vender casa sin comisión castilla la mancha',
      'venta piso 100 digital albacete',
      'vender piso particular albacete',
    ],
    priority: 0.9,
    areaServed: 'Albacete capital y área metropolitana',
    heroBadge: 'Plan digital · Albacete',
    marketLead:
      'Centro, Carretas, Feria o La Paz: publicación en portales, panel vendedor y visitas en franjas que tú defines.',
    zones: ['Centro', 'Carretas', 'Feria', 'Industriales', 'La Paz', 'Villafranca', 'Hellín', 'Villarrobledo'],
    priceExample: 155000,
    priceM2: '1.100 – 1.800 €/m² (orientativo 2026)',
    avgDays: '70 – 125 días',
    cardTeaser: 'Venta digital Albacete: precio fijo y portales nacionales.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-valencia', label: 'Venta digital Valencia' },
      { href: '/venta-digital-murcia', label: 'Venta digital Murcia' },
    ],
    localFaq:
      '<details><summary>¿Hellín o Villarrobledo?</summary><p>Sí en digital con visitas locales. Confirmamos en valoración.</p></details>',
    seoExtra: `<h2>Inmobiliaria 100 % digital en Albacete</h2>
<p>Tickets contenidos pero plazos largos si no hay filtro de compradores. NuevaHabitat publica profesionalmente y revisa financiación antes de cada visita.</p>`,
  },
  {
    slug: 'venta-digital-lleida',
    cityName: 'Lleida',
    navSub: 'Lleida',
    keyword_principal: 'venta 100 por ciento digital Lleida',
    keyword_aliases: [
      'vender piso online lleida',
      'inmobiliaria digital lleida',
      'agencia venta digital lerida',
      'vender casa sin comisión lleida',
      'venta piso 100 digital lleida',
      'vender piso particular lleida',
    ],
    priority: 0.91,
    areaServed: 'Lleida capital y comarca',
    heroBadge: 'Plan digital · Lleida',
    marketLead:
      'Centre històric, Pardinyes, Cappont o Mollerussa: mismos portales que en Barcelona, precio fijo y negociación en panel.',
    zones: ['Centre històric', 'Pardinyes', 'Cappont', 'Balafia', 'Segrià', 'Mollerussa', 'Tàrrega', 'Balaguer'],
    priceExample: 178000,
    priceM2: '1.350 – 2.100 €/m² (orientativo 2026)',
    avgDays: '60 – 115 días',
    cardTeaser: 'Venta digital Lleida: 1.999 € + IVA y visitas cualificadas.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-barcelona', label: 'Venta digital Barcelona' },
      { href: '/venta-digital-tarragona', label: 'Venta digital Tarragona' },
    ],
    localFaq:
      '<details><summary>¿Cataluña y castellano en expediente?</summary><p>Gestionamos en castellano; anuncios pueden adaptarse bilingüe si el activo lo requiere.</p></details>',
    seoExtra: `<h2>Venta digital de piso en Lleida</h2>
<p>Lleida conecta con Aragón y Barcelona: compradores comparan precios entre provincias. <strong>1.999 € + IVA</strong> fijos independientemente del ticket final.</p>
<h2>Segrià y comarca</h2>
<p>Valoramos con cierres locales, no solo medias autonómicas.</p>`,
  },
  {
    slug: 'venta-digital-girona',
    cityName: 'Girona',
    navSub: 'Girona',
    keyword_principal: 'venta 100 por ciento digital Girona',
    keyword_aliases: [
      'vender piso online girona',
      'inmobiliaria digital girona',
      'agencia venta digital girona',
      'vender casa sin comisión girona',
      'venta piso 100 digital girona',
      'vender piso particular girona',
    ],
    priority: 0.91,
    areaServed: 'Girona ciudad y comarca',
    heroBadge: 'Plan digital · Girona',
    marketLead:
      'Barri Vell, Devesa, Montjuïc o Salt: venta digital con honorarios fijos; tú en visitas y NuevaHabitat en marketing y cierre.',
    zones: ['Barri Vell', 'Devesa', 'Montjuïc', 'Pedret', 'Fontajau', 'Salt', 'Sarrià de Ter', 'Platja d\'Aro'],
    priceExample: 285000,
    priceM2: '2.400 – 3.800 €/m² (orientativo 2026)',
    avgDays: '55 – 100 días',
    cardTeaser: 'Venta digital Girona: panel, Idealista y filtro de compradores.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-barcelona', label: 'Venta digital Barcelona' },
      { href: '/venta-digital-tarragona', label: 'Venta digital Tarragona' },
    ],
    localFaq:
      '<details><summary>¿Costa Brava y Platja d\'Aro?</summary><p>Plan digital si puedes recibir visitas cualificadas; confirmamos en valoración.</p></details>' +
      '<details><summary>¿Compradores internacionales?</summary><p>Frecuentes; revisamos solvencia y plazo antes de cada visita.</p></details>',
    seoExtra: `<h2>Vender piso en Girona con precio fijo</h2>
<p>Girona mezcla residente, teletrabajo desde Barcelona y compradores europeos. El 6&nbsp;% + IVA sobre 280.000&nbsp;€ supera <strong>20.000 €</strong>; el plan digital mantiene <strong>1.999 € + IVA</strong>.</p>
<h2>Casco vs periferia</h2>
<p>Parking, ascensor y estado de finca marcan el perfil del comprador: lo reflejamos en reportaje y titular del anuncio.</p>`,
  },
  {
    slug: 'venta-digital-castellon',
    cityName: 'Castellón de la Plana',
    navSub: 'Castellón',
    keyword_principal: 'venta 100 por ciento digital Castellón',
    keyword_aliases: [
      'vender piso online castellon',
      'inmobiliaria digital castellon de la plana',
      'agencia venta digital castellon',
      'vender casa sin comisión castellon',
      'venta piso 100 digital castellon',
      'vender piso particular castellon',
    ],
    priority: 0.91,
    areaServed: 'Castellón de la Plana y comarca',
    heroBadge: 'Plan digital · Castellón',
    marketLead:
      'Centro, Grao, Benimaclet castellonense o Vila-real: Idealista, pisos.com y visitas en horarios que marcas en el panel.',
    zones: ['Centro', 'Grao', 'Zona Nord', 'La Salera', 'Ronda Este', 'Vila-real', 'Borriol', 'Almassora'],
    priceExample: 198000,
    priceM2: '1.500 – 2.500 €/m² (orientativo 2026)',
    avgDays: '60 – 110 días',
    cardTeaser: 'Venta digital Castellón: 1.999 € + IVA y panel vendedor.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-valencia', label: 'Venta digital Valencia' },
      { href: '/venta-digital-tarragona', label: 'Venta digital Tarragona' },
    ],
    localFaq:
      '<details><summary>¿Plana Baixa y Grao?</summary><p>Sí en digital si puedes recibir visitas. Misma operativa que Valencia o Tarragona.</p></details>',
    seoExtra: `<h2>Inmobiliaria digital en Castellón de la Plana</h2>
<p>Castellón compite con Valencia y Tarragona por el mismo comprador AVE. <strong>Venta 100 % digital</strong> cualifica demanda antes de saturar tu agenda.</p>
<h2>Grao vs centro</h2>
<p>Segmentamos comparables y mensaje comercial por micro-zona.</p>`,
  },
  {
    slug: 'venta-digital-jerez',
    cityName: 'Jerez de la Frontera',
    navSub: 'Jerez',
    keyword_principal: 'venta 100 por ciento digital Jerez',
    keyword_aliases: [
      'vender piso online jerez',
      'inmobiliaria digital jerez de la frontera',
      'agencia venta digital jerez',
      'vender casa sin comisión jerez',
      'venta piso 100 digital jerez',
      'vender piso particular jerez',
    ],
    priority: 0.91,
    areaServed: 'Jerez de la Frontera y Bahía de Cádiz',
    heroBadge: 'Plan digital · Jerez',
    marketLead:
      'Centro, La Plata, La Milagrosa o El Puerto: precio fijo 1.999&nbsp;€ + IVA, filtro de compradores y negociación hasta notaría.',
    zones: ['Centro', 'La Plata', 'La Milagrosa', 'Picaduey', 'El Brillante', 'El Puerto de Santa María', 'Sanlúcar', 'Chiclana'],
    priceExample: 210000,
    priceM2: '1.600 – 2.600 €/m² (orientativo 2026)',
    avgDays: '55 – 105 días',
    cardTeaser: 'Venta digital Jerez: honorarios fijos, portales y panel.',
    relatedGuides: [
      { href: '/venta-digital', label: 'Hub venta digital' },
      { href: '/venta-digital-cadiz', label: 'Venta digital Cádiz' },
      { href: '/venta-digital-sevilla', label: 'Venta digital Sevilla' },
    ],
    localFaq:
      '<details><summary>¿Diferencia con vender en Cádiz capital?</summary><p>Mismo plan y honorarios; ajustamos comparables y anuncio al mercado jerezano.</p></details>',
    seoExtra: `<h2>Venta 100 % digital en Jerez de la Frontera</h2>
<p>Jerez mueve volumen de primera vivienda y herencias en la bahía. NuevaHabitat evita comisiones opacas con <strong>1.999 € + IVA</strong> y filtro previo a cada visita.</p>
<h2>Compradores de Sevilla y Cádiz</h2>
<p>Comparan precio y plazo: negociación centralizada en panel sin hilos de email perdidos.</p>`,
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
