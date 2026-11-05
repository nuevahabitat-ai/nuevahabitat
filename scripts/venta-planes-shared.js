const SITE = 'https://www.nuevahabitat.com';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function portalsPublicationBlock(cityName = 'Barcelona') {
  const city = esc(cityName);
  return `
<section class="lc-section nh-svc-portals" style="background:var(--blanco)">
  <div class="container fade-up">
    <div class="nh-svc-portals-inner">
      <div class="nh-svc-portals-copy">
        <span class="overline">Publicación</span>
        <h2 class="section-title">Idealista y pisos.com</h2>
        <p class="nh-svc-portals-lead">La publicación se hará con <strong>Idealista</strong> y con <strong>pisos.com</strong>, con lo que tendremos el máximo de clientes interesados en tu inmueble en ${city}.</p>
        <p class="nh-svc-portals-note">A eso sumamos nuestra cartera de compradores y el filtro de solvencia antes de cada visita.</p>
      </div>
      <div class="nh-svc-portals-logos">
        <img src="imagenes/portales/idealista.jpg" alt="Idealista" width="254" height="157" loading="lazy" class="nh-svc-portal-logo nh-svc-portal-logo--idealista"/>
        <img src="imagenes/portales/pisos-com.png" alt="pisos.com" width="200" height="80" loading="lazy" class="nh-svc-portal-logo nh-svc-portal-logo--pisos"/>
      </div>
    </div>
  </div>
</section>`;
}

function planesNavHtml(current) {
  const mk = (key, href, title, sub) => {
    const cur = current === key ? ' class="is-current"' : '';
    return `<a href="${href}"${cur}><strong>${title}</strong><span>${sub}</span></a>`;
  };
  return `<section class="lc-section" style="background:var(--negro);padding:2.5rem 0">
  <div class="container nh-svc-planes-nav">
    ${mk('digital', '/venta-digital-barcelona', '100 % digital', '1.999 € + IVA · tú en visitas')}
    ${mk('comercial', '/venta-comercial-barcelona', 'Digital + comercial', '2.500 € + IVA · visitas NH · Barcelona')}
    ${mk('clasica', '/venta-clasica-barcelona', 'Venta clásica', '3.500 € + IVA · equipo NH integral')}
  </div>
</section>`;
}

function audienceSection(overline, title, intro, items) {
  const cards = items
    .map(
      (it) =>
        `<div class="nh-svc-pillar"><h3>${esc(it.h)}</h3><p>${it.p}</p></div>`
    )
    .join('');
  return `
<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:720px;margin:0 auto 2rem">
      <span class="overline">${esc(overline)}</span>
      <h2 class="section-title">${esc(title)}</h2>
      <p style="color:var(--gris-texto);line-height:1.75;margin:0">${intro}</p>
    </div>
    <div class="nh-svc-pillar-grid fade-up">${cards}</div>
  </div>
</section>`;
}

function faqSection(cityLabel, faqs, extraHtml = '') {
  const items = faqs
    .map(
      (f) =>
        `<details><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`
    )
    .join('');
  return `
<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:1.5rem">
      <h2 class="section-title">Preguntas frecuentes · ${esc(cityLabel)}</h2>
    </div>
    <div class="nh-svc-faq fade-up">${items}${extraHtml}</div>
  </div>
</section>`;
}

function serviceNavLinks(currentPlan, digitalHref = '/venta-digital-barcelona') {
  const links = [
    { href: '/venta-clasica-barcelona', label: 'Clásica', key: 'clasica' },
    { href: digitalHref, label: 'Digital', key: 'digital' },
    { href: '/venta-comercial-barcelona', label: 'Digital + comercial', key: 'comercial' },
  ];
  const lis = links
    .map((l) => {
      const cur =
        l.key === currentPlan ? ' aria-current="page"' : '';
      return `<li><a href="${l.href}"${cur}>${l.label}</a></li>`;
    })
    .join('');
  return `<ul class="nav-links">${lis}<li><a href="/vender">Hub vender</a></li></ul>`;
}

function scriptsFooter() {
  return `<script src="js/leads.js"></script>
<script src="js/site-config.js"></script>
<script src="js/ga-config.js"></script>
<script src="js/gtag-init.js"></script>
<script src="js/analytics-events.js"></script>
<script src="js/seo.js"></script>
<script src="js/main.js"></script>`;
}

function compareThreePlansTable(highlight = '') {
  const hi = (k) => (highlight === k ? ' style="background:rgba(184,147,106,.12)"' : '');
  return `
<section class="lc-section" style="background:var(--blanco)">
  <div class="container fade-up">
    <div class="text-center" style="max-width:720px;margin:0 auto 1.5rem">
      <span class="overline">Comparativa</span>
      <h2 class="section-title">Los tres planes de venta en un vistazo</h2>
      <p style="color:var(--gris-texto);line-height:1.65;margin:0">Mismo panel, Idealista y pisos.com, filtro de compradores y cobro <strong>50&nbsp;% al contratar + 50&nbsp;% en escritura</strong>.</p>
    </div>
    <div class="nh-svc-table-scroll" style="max-width:920px;margin:0 auto">
      <table class="nh-svc-compare-table nh-svc-compare-table--plans">
        <thead><tr><th>Plan</th><th>Honorarios</th><th>Visitas</th><th>Negociación</th><th>Cobertura</th></tr></thead>
        <tbody>
          <tr${hi('digital')}><td><strong>100&nbsp;% digital</strong></td><td>1.999 € + IVA</td><td>Tú (cualificadas)</td><td>NuevaHabitat</td><td>España (digital)</td></tr>
          <tr${hi('comercial')}><td><strong>Digital + comercial</strong></td><td>2.500 € + IVA</td><td>Comercial NH</td><td>NuevaHabitat</td><td>Barcelona ciudad</td></tr>
          <tr${hi('clasica')}><td><strong>Venta clásica</strong></td><td>3.500 € + IVA</td><td>Agente NH</td><td>Agente NH integral</td><td>BCN + área metropolitana</td></tr>
        </tbody>
      </table>
    </div>
    <p class="text-center" style="margin-top:1.25rem;font-size:.9rem;color:var(--gris-texto)"><a href="/vender">Comparar en hub Vender</a> · <a href="/blog">Guías por barrio en el blog</a></p>
  </div>
</section>`;
}

function planChooserSection() {
  return `
<section class="lc-section" id="que-plan" style="background:var(--crema);padding:3.5rem 0">
  <div class="container">
    <div class="text-center fade-up" style="max-width:680px;margin:0 auto 2rem">
      <span class="overline">Decisión rápida</span>
      <h2 class="section-title">¿Qué plan te conviene?</h2>
    </div>
    <div class="nh-svc-pillar-grid fade-up">
      <div class="nh-svc-pillar"><h3>Puedes enseñar el piso</h3><p>Elige <strong>digital (1.999 € + IVA)</strong>: máximo ahorro, tú en visitas con compradores filtrados.</p><a href="/venta-digital-barcelona" class="btn btn-outline" style="margin-top:.75rem">Ver digital</a></div>
      <div class="nh-svc-pillar"><h3>No quieres visitas en casa</h3><p>En Barcelona: <strong>digital + comercial (2.500 € + IVA)</strong>. Comercial NH en visitas, tú sigues el panel.</p><a href="/venta-comercial-barcelona" class="btn btn-outline" style="margin-top:.75rem">Ver comercial</a></div>
      <div class="nh-svc-pillar"><h3>Quieres agente en todo el ciclo</h3><p><strong>Clásica (3.500 € + IVA)</strong>: visitas, estrategia de precio y negociación con Daniel o Sebastián.</p><a href="/venta-clasica-barcelona" class="btn btn-outline" style="margin-top:.75rem">Ver clásica</a></div>
    </div>
  </div>
</section>`;
}

function includedExcludedBlock(plan) {
  const blocks = {
    digital: {
      title: 'Venta 100 % digital · qué incluye',
      included: [
        'Expediente online, contrato y pagos Stripe (50 % + 50 %).',
        'Publicación en Idealista y pisos.com + cartera de compradores.',
        'Reportaje foto/vídeo y textos del anuncio.',
        'Filtro de solvencia antes de cada visita.',
        'Negociación, arras (FIRMACERT) y coordinación hasta notaría.',
        'Panel vendedor con calendario de visitas.',
      ],
      excluded: [
        'Visitas presenciales de agente o comercial (las haces tú).',
        'Gestión presencial de llaves por comercial (plan comercial aparte).',
      ],
    },
    comercial: {
      title: 'Digital + comercial · qué incluye',
      included: [
        'Todo el expediente digital (panel, documentos, pagos).',
        'Idealista, pisos.com y cartera cualificada.',
        'Comercial NH en visitas in situ en Barcelona.',
        'Informe de visita en panel en menos de 24 h.',
        'Negociación y cierre hasta escritura.',
      ],
      excluded: [
        'Negociación “integral” con agente dedicado en cada fase (plan clásica).',
        'Visitas fuera de Barcelona ciudad (usar digital o clásica en área).',
      ],
    },
    clasica: {
      title: 'Venta clásica · qué incluye',
      included: [
        'Agente NH (Daniel o Sebastián) en visitas y negociación.',
        'Valoración con comparables, reportaje y anuncio en Idealista y pisos.com.',
        'Cartera de compradores con hipoteca o liquidez verificada.',
        'Panel, arras FIRMACERT, documentación y notaría.',
        'Estrategia de precio y seguimiento de ofertas.',
      ],
      excluded: [
        'Comercial solo en visitas sin agente (plan 2.500 €).',
        'Honorarios porcentuales sobre precio de venta.',
      ],
    },
  };
  const b = blocks[plan] || blocks.digital;
  const inc = b.included.map((x) => `<li>${x}</li>`).join('');
  const exc = b.excluded.map((x) => `<li>${x}</li>`).join('');
  return `
<section class="lc-section" style="background:var(--crema)">
  <div class="container lc-nh-split fade-up" style="align-items:start">
    <div>
      <span class="overline">Transparencia</span>
      <h2 class="section-title">${esc(b.title)}</h2>
      <p style="font-weight:600;margin-bottom:.5rem;color:var(--negro)">Incluido</p>
      <ul class="lc-nh-checklist">${inc}</ul>
    </div>
    <div>
      <p style="font-weight:600;margin:1rem 0 .5rem;color:var(--negro)">No incluido (elige otro plan si lo necesitas)</p>
      <ul class="lc-nh-checklist" style="opacity:.92">${exc}</ul>
    </div>
  </div>
</section>`;
}

function firmacertBlock() {
  return `
<section class="lc-section" style="background:var(--blanco);padding:2.5rem 0">
  <div class="container fade-up" style="max-width:820px">
    <span class="overline">Firma y pagos</span>
    <h2 class="section-title">Stripe, panel y FIRMACERT</h2>
    <p style="color:var(--gris-texto);line-height:1.75">Primer <strong>50&nbsp;%</strong> al contratar con tarjeta (Stripe). Segundo <strong>50&nbsp;%</strong> en escritura. Reservas y arras con <strong>FIRMACERT</strong> (firma electrónica avanzada eIDAS), incluido en el servicio.</p>
  </div>
</section>`;
}

function gestoresStrip() {
  return `
<section class="lc-gestor-wa-strip">
  <div class="container lc-gestor-wa-strip__inner fade-up">
    <p class="lc-gestor-wa-strip__text">¿Dudas sobre qué plan contratar? WhatsApp con <strong>Daniel</strong> o <strong>Sebastián</strong> (Les Corts).</p>
    <div class="lc-gestor-wa-strip__btns">
      <a href="https://wa.me/34603656587?text=${encodeURIComponent('Hola, quiero información sobre los planes de venta NuevaHabitat')}" class="btn btn-gold" target="_blank" rel="noopener">WhatsApp Daniel</a>
      <a href="https://wa.me/34643877644?text=${encodeURIComponent('Hola, quiero información sobre los planes de venta NuevaHabitat')}" class="btn btn-outline" target="_blank" rel="noopener">WhatsApp Sebastián</a>
    </div>
  </div>
</section>`;
}

function jsonLdServiceFaq({ serviceName, url, price, faqs }) {
  const mainEntity = faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() },
  }));
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: serviceName,
        url,
        provider: { '@type': 'RealEstateAgent', name: 'NuevaHabitat', url: SITE },
        offers: {
          '@type': 'Offer',
          price,
          priceCurrency: 'EUR',
          description: 'Honorarios fijos + IVA · 50 % al contratar y 50 % en escritura',
        },
      },
      { '@type': 'FAQPage', mainEntity },
    ],
  });
}

function digitalStandardFaqs(cityName) {
  const city = esc(cityName);
  return [
    {
      q: '¿Tengo que hacer todas las visitas yo?',
      a: `Sí, en el plan digital tú abres la puerta en ${city}. Solo programamos compradores que cumplen criterios de solvencia e intención.`,
    },
    {
      q: '¿En qué portales publicáis el anuncio?',
      a: 'La publicación se hace con <strong>Idealista</strong> y <strong>pisos.com</strong>, más nuestra cartera de demanda cualificada.',
    },
    {
      q: '¿Cuánto cuesta y cuándo se paga?',
      a: '<strong>1.999 € + IVA</strong>: 50&nbsp;% al contratar (Stripe) y 50&nbsp;% en escritura. Sin comisión % sobre el precio de venta.',
    },
    {
      q: '¿Es lo mismo que publicar en Idealista como particular?',
      a: 'No. Filtramos demanda, negociamos, gestionamos arras y centralizamos documentación con panel vendedor.',
    },
    {
      q: '¿Hay comercial NH en visitas?',
      a: 'En digital no. En Barcelona puedes contratar <a href="/venta-comercial-barcelona">digital + comercial (2.500 € + IVA)</a>.',
    },
    {
      q: '¿Qué pasa si no vendo?',
      a: 'El segundo 50&nbsp;% solo se cobra en escritura. El primer pago activa el servicio (anuncio, filtro, gestión).',
    },
    {
      q: '¿Qué documentación necesito?',
      a: 'Nota simple, certificado energético, datos de titularidad y acceso para visitas. Todo en el panel.',
    },
    {
      q: '¿Necesito exclusiva larga?',
      a: 'No trabajamos con exclusivas abusivas. Condiciones claras en el contrato online.',
    },
    {
      q: '¿Dónde leo guías por barrio?',
      a: 'Contenido local y SEO por zona está en el <a href="/blog">blog</a>, no mezclado con la contratación del plan.',
    },
    {
      q: '¿Cuándo pago el resto?',
      a: 'El segundo 50&nbsp;% se cobra en escritura cuando la operación cierra.',
    },
  ];
}

function venderHubFaqs() {
  return [
    {
      q: '¿Cuánto cuesta vender con NuevaHabitat?',
      a: 'Tres planes fijos + IVA: <strong>1.999 €</strong> (digital), <strong>2.500 €</strong> (digital + comercial, Barcelona) y <strong>3.500 €</strong> (clásica integral). Sin comisión del 3–6&nbsp;% sobre el precio de venta.',
    },
    {
      q: '¿Cuándo pago los honorarios?',
      a: '<strong>50&nbsp;% al contratar</strong> (Stripe, activa el servicio) y <strong>50&nbsp;% en escritura</strong>. El segundo pago solo si cierras la venta.',
    },
    {
      q: '¿Publicáis en Idealista y pisos.com?',
      a: 'Sí, en los tres planes. Además difundimos a nuestra cartera de compradores cualificados.',
    },
    {
      q: '¿Qué plan elijo si no quiero hacer visitas?',
      a: 'En Barcelona: <a href="/venta-comercial-barcelona">digital + comercial</a>. Si quieres agente en negociación y visitas: <a href="/venta-clasica-barcelona">clásica</a>.',
    },
    {
      q: '¿Qué plan es más económico?',
      a: '<a href="/venta-digital-barcelona">100&nbsp;% digital (1.999 € + IVA)</a>: tú en visitas cualificadas; mismo panel y portales.',
    },
    {
      q: '¿Cuánto tarda en venderse un piso?',
      a: 'Depende de zona y precio. Trabajamos con compradores filtrados; plazos orientativos en valoración inicial.',
    },
    {
      q: '¿Qué es FIRMACERT y está incluido?',
      a: 'Sí. Firma electrónica avanzada (eIDAS) para reservas y arras, incluida en el servicio.',
    },
    {
      q: '¿Cuánto ahorro frente a una agencia al 6 %?',
      a: 'Usa la <a href="#calc">calculadora</a> en esta página: compara comisión + IVA con el plan que elijas.',
    },
    {
      q: '¿Guías por barrio dónde están?',
      a: 'En el <a href="/blog">blog</a> y contenidos SEO, separados del hub de contratación de los 3 planes.',
    },
    {
      q: '¿Cómo empiezo?',
      a: '<a href="#valorar">Valoración gratuita</a> o registro directo: <a href="/venta-digital-barcelona">digital</a>, <a href="/venta-comercial-barcelona">comercial</a>, <a href="/venta-clasica-barcelona">clásica</a>.',
    },
  ];
}

function venderFaqSectionHtml() {
  const items = venderHubFaqs()
    .map(
      (f) =>
        `<div class="faq-item"><button class="faq-q" type="button">${esc(f.q)}<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg></button><div class="faq-a"><p class="faq-a-inner">${f.a}</p></div></div>`
    )
    .join('\n      ');
  return items;
}

function serviceFooter(blurb) {
  return `<footer>
  <div class="container">
    <div class="footer-top" style="grid-template-columns:1.5fr 2fr 1fr">
      <div class="footer-brand"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><p>${blurb}</p></div>
      <div class="footer-col"><h4>Planes venta</h4><ul><li><a href="/venta-clasica-barcelona">Clásica · 3.500 € + IVA</a></li><li><a href="/venta-digital-barcelona">Digital · 1.999 € + IVA</a></li><li><a href="/venta-comercial-barcelona">Digital + comercial · 2.500 € + IVA</a></li><li><a href="/vender">Hub vender</a></li></ul></div>
      <div class="footer-col"><h4>Contacto</h4><ul><li><a href="tel:+34603656587">603 656 587</a></li><li><a href="mailto:info@nuevahabitat.com">info@nuevahabitat.com</a></li></ul></div>
    </div>
    <div class="footer-bottom"><p>© 2026 NuevaHabitat</p><div class="footer-bottom-links"><a href="/blog">Blog</a><a href="/privacidad">Privacidad</a></div></div>
  </div>
</footer>`;
}

module.exports = {
  SITE,
  esc,
  portalsPublicationBlock,
  planesNavHtml,
  audienceSection,
  faqSection,
  serviceNavLinks,
  scriptsFooter,
  serviceFooter,
  compareThreePlansTable,
  planChooserSection,
  includedExcludedBlock,
  firmacertBlock,
  gestoresStrip,
  jsonLdServiceFaq,
  digitalStandardFaqs,
  venderHubFaqs,
  venderFaqSectionHtml,
};
