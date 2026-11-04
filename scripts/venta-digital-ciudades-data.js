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
<p>La búsqueda <strong>venta 100 % digital Barcelona</strong> suele venir de propietarios que ya han probado portales solos y quieren <strong>intermediación profesional</strong> sin pagar un 3&nbsp;% o 6&nbsp;% sobre el precio de venta. NuevaHabitat combina difusión en Idealista y resto de portales, <strong>filtro de hipoteca</strong> antes de cada visita y <strong>panel vendedor</strong> donde ves ofertas, documentos y calendario.</p>
<p>En Barcelona el ticket medio orientativo ronda los <strong>380.000–480.000 €</strong> según barrio; una comisión tradicional del 6&nbsp;% + IVA puede superar los <strong>30.000 €</strong>. El plan digital deja el coste en <strong>1.999 € + IVA</strong>, repartido 50&nbsp;% al contratar y 50&nbsp;% en escritura.</p>
<h2>Qué incluye la venta digital en Barcelona</h2>
<ul>
<li>Valoración con comparables de cierre en tu micro-zona (Eixample no es igual que Nou Barris).</li>
<li>Reportaje fotográfico, vídeo y publicación en portales principales.</li>
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
<p>Tras el primer pago (Stripe) activamos expediente: nota simple, certificado energético, borrador de anuncio y calendario de visitas. Compradores de cartera nacional y leads de portales pasan por filtro de financiación. Tú recibes en las franjas que marques — ideal si vives en el piso o tienes horario flexible.</p>
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
      '<details><summary>¿Publicáis en portales de Valencia?</summary><p>Sí: difusión en portales nacionales y locales relevantes para captar compradores en la Comunitat Valenciana y relocation desde Madrid/Barcelona.</p></details>',
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
