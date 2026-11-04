const {
  SITE,
  FEE_BASE,
  tradCommission6,
  tradCommission3,
} = require('./venta-digital-ciudades-data');
const { testimonialsSection } = require('./landing-testimonials');
const {
  esc,
  portalsPublicationBlock,
  audienceSection,
  faqSection,
  digitalStandardFaqs,
  compareThreePlansTable,
  includedExcludedBlock,
  firmacertBlock,
  gestoresStrip,
  serviceNavLinks,
} = require('./venta-planes-shared');

function renderVentaDigitalPage(c) {
  const canonical = `${SITE}/${c.slug}`;
  const trad6 = tradCommission6(c.priceExample);
  const zonesList = c.zones.map((z) => `<li>${esc(z)}</li>`).join('');
  const title = `Venta 100 % digital en ${c.cityName} · 1.999 € + IVA · NuevaHabitat`;
  const kw = c.keyword_principal || `venta 100 por ciento digital ${c.cityName}`;
  const description = `${kw}: vende en ${c.cityName} con honorarios fijos 1.999 € + IVA. Publicación en Idealista y pisos.com, panel vendedor y visitas cualificadas. 50 % contrato + 50 % escritura.`;
  const aliasesMeta = (c.keyword_aliases || []).slice(0, 8).join(', ');
  const trad3 = tradCommission3(c.priceExample);
  const faqItems = digitalStandardFaqs(c.cityName);
  const faqBlock = faqSection(`venta digital ${c.cityName}`, faqItems, c.localFaq || '');
  const audienceBlock = audienceSection(
    '¿Para quién?',
    `¿Es para ti la venta digital en ${c.cityName}?`,
    'Ahorras frente al 6&nbsp;% de agencia, controlas quién entra en casa y delegas anuncio, filtro, negociación y cierre en NuevaHabitat.',
    [
      { h: 'Puedes recibir visitas', p: 'Marcas franjas en el panel; solo entran compradores con solvencia revisada.' },
      { h: 'Buscas precio fijo', p: '1.999 € + IVA, sin comisión sobre el precio de venta del piso.' },
      { h: 'Quieres panel y firma online', p: 'Expediente, Stripe 50/50 y FIRMACERT sin depender de emails sueltos.' },
    ]
  );
  const testimonialBlock = testimonialsSection({
    slug: c.slug,
    cluster: 'intencion',
    footerLabel: c.cityName,
  });
  const waText = encodeURIComponent(
    `Hola, quiero información sobre venta 100 % digital NuevaHabitat en ${c.cityName}`
  );

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `Venta 100 % digital ${c.cityName}`,
        provider: { '@id': `${SITE}/#organization` },
        areaServed: c.areaServed,
        offers: {
          '@type': 'Offer',
          price: FEE_BASE,
          priceCurrency: 'EUR',
          description: '1.999 € + IVA · 50 % al contratar y 50 % en escritura',
        },
      },
      {
        '@type': 'RealEstateAgent',
        '@id': `${SITE}/#organization`,
        name: 'NuevaHabitat',
        url: SITE,
        telephone: '+34603656587',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Carrer de Mejía Lequerica, 42',
          addressLocality: 'Barcelona',
          postalCode: '08028',
          addressCountry: 'ES',
        },
        areaServed: c.areaServed,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Venta digital', item: `${SITE}/venta-digital` },
          { '@type': 'ListItem', position: 3, name: c.cityName, item: canonical },
        ],
      },
      {
        '@type': 'WebPage',
        name: title,
        url: canonical,
        description,
        isPartOf: { '@id': `${SITE}/#website` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `¿Qué es la venta 100 % digital en ${c.cityName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'NuevaHabitat gestiona valoración, anuncio, publicación en Idealista y pisos.com, filtro de compradores y negociación. El propietario recibe en casa solo visitas cualificadas en horarios que marca en el panel. Honorarios fijos 1.999 € + IVA.',
            },
          },
          {
            '@type': 'Question',
            name: `¿Cuánto cuesta vender con el plan digital en ${c.cityName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: '1.999 € + IVA: 50 % al contratar y 50 % en escritura. Sin porcentaje sobre el precio de venta.',
            },
          },
        ],
      },
    ],
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}"/>
  <meta name="keywords" content="${esc(kw)}, ${esc(aliasesMeta)}"/>
  <meta property="og:locale" content="es_ES"/>
  <link rel="canonical" href="${canonical}"/>
  <meta property="og:title" content="${esc(title)}"/>
  <meta property="og:description" content="${esc(description)}"/>
  <meta property="og:url" content="${canonical}"/>
  <meta property="og:image" content="${SITE}/imagenes/interior11.jpg"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${jsonLd}</script>
</head>
<body>
<nav id="navbar" class="scrolled" style="background:rgba(13,13,13,.97)">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><div class="nav-logo-divider"></div><div class="logo-text"><span class="logo-name">Nueva Habitat</span><span class="logo-sub">${esc(c.navSub)}</span></div></a>
    ${serviceNavLinks('digital')}
    <div class="nav-actions"><a href="/registro?tipo=vender&amp;plan=digital&amp;ciudad=${encodeURIComponent(c.cityName)}" class="nav-cta">Contratar</a></div>
  </div>
</nav>

<section class="nh-svc-hero">
  <div class="nh-svc-hero-bg" style="background-image:url('imagenes/interior11.jpg')"></div>
  <div class="nh-svc-hero-overlay"></div>
  <div class="container nh-svc-hero-inner fade-up">
    <p class="nh-breadcrumb" aria-label="Ruta" style="font-size:.75rem;color:rgba(255,255,255,.55);margin:0 0 .75rem"><a href="/" style="color:inherit">Inicio</a> · <a href="/venta-digital" style="color:inherit">Venta digital</a> · <span>${esc(c.cityName)}</span></p>
    <div class="hero-badge">${esc(c.heroBadge)}</div>
    <h1>Venta 100&nbsp;% digital en ${esc(c.cityName)}: tú en las visitas, NuevaHabitat en el resto</h1>
    <div class="nh-svc-price-chip"><strong>1.999 € + IVA</strong> · <span>50&nbsp;% contrato + 50&nbsp;% escritura</span></div>
    <p>${c.marketLead} Publicamos en <strong>Idealista</strong> y <strong>pisos.com</strong>, <strong>cualificamos compradores</strong> y negociamos hasta escritura. Sin comisión del 3&nbsp;% ni sorpresas en factura.</p>
    <div class="nh-svc-hero-actions">
      <a href="/registro?tipo=vender&amp;plan=digital&amp;ciudad=${encodeURIComponent(c.cityName)}" class="btn btn-gold">Contratar venta digital</a>
      <a href="/venta-digital" class="btn btn-outline-light">Ver todas las ciudades</a>
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--negro);padding:2.5rem 0">
  <div class="container nh-svc-planes-nav">
    <a href="/venta-clasica-barcelona"><strong>Venta clásica</strong><span>3.500 € + IVA · equipo NH en visitas</span></a>
    <a href="/${c.slug}" class="is-current"><strong>100 % digital · ${esc(c.cityName)}</strong><span>1.999 € + IVA · visitas en tus horarios</span></a>
    <a href="/venta-comercial-barcelona"><strong>Digital + comercial</strong><span>2.500 € + IVA · Barcelona in situ</span></a>
  </div>
</section>

<section class="lc-section" style="background:var(--blanco)">
  <div class="container lc-nh-split fade-up">
    <div>
      <span class="overline">SEO · ${esc(c.keyword_principal)}</span>
      <h2 class="section-title">Inmobiliaria digital en ${esc(c.cityName)} con precio fijo</h2>
      <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1rem">Muchas búsquedas en Google combinan <strong>venta digital</strong>, <strong>vender piso online</strong> o <strong>inmobiliaria sin comisión porcentual</strong> con ${esc(c.cityName)}. El plan 100&nbsp;% digital de NuevaHabitat responde a eso: honorarios cerrados (<strong>${FEE_BASE} € + IVA</strong>), cobro repartido 50&nbsp;/&nbsp;50 y panel vendedor donde ves visitas, documentos y ofertas.</p>
      <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:.75rem">Mercado orientativo en ${esc(c.cityName)}: <strong>${esc(c.priceM2 || '')}</strong> · plazos habituales <strong>${esc(c.avgDays || '')}</strong>.</p>
      <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1.25rem">En un piso de <strong>${c.priceExample.toLocaleString('es-ES')} €</strong>, agencia al 6&nbsp;% + IVA ≈ <strong>${trad6.toLocaleString('es-ES')} €</strong>; al 3&nbsp;% + IVA ≈ <strong>${trad3.toLocaleString('es-ES')} €</strong>. Venta digital: <strong>1.999 € + IVA</strong> — honorarios fijos, sin porcentaje sobre el precio de venta.</p>
      <ul class="lc-nh-checklist">
        <li>Expediente 100&nbsp;% online: contrato, Stripe y documentación.</li>
        <li>Publicación en Idealista y pisos.com + compradores de cartera.</li>
        <li>Visitas solo con solvencia contrastada; tú eliges franjas horarias.</li>
        <li>Primer 50&nbsp;% al contratar activa el servicio.</li>
      </ul>
    </div>
    <div class="lc-nh-split-media">
      <img src="imagenes/interior4.jpg" alt="Venta digital vivienda ${esc(c.cityName)}" loading="lazy" width="800" height="600"/>
    </div>
  </div>
</section>

${portalsPublicationBlock(c.cityName)}

${audienceBlock}

<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:720px;margin:0 auto 1.5rem">
      <span class="overline">${esc(c.areaServed)}</span>
      <h2 class="section-title">Zonas donde operamos en ${esc(c.cityName)}</h2>
      <p style="color:var(--gris-texto);line-height:1.7">El servicio es el mismo en toda la ciudad: valoración, anuncio profesional, filtro de leads y negociación. Ejemplos de barrios y municipios donde ya encaja el modelo digital:</p>
    </div>
    <ul class="lc-nh-checklist lc-nh-checklist--2col fade-up" style="max-width:640px;margin:0 auto">${zonesList}</ul>
    <p class="text-center fade-up" style="margin-top:1.5rem;font-size:.9rem;color:var(--gris-texto)">¿Tu zona no aparece? <a href="/contacto">Escríbenos</a> — confirmamos cobertura antes de contratar.</p>
  </div>
</section>

<section class="lc-section" style="background:var(--blanco)" id="guia-seo">
  <div class="container lc-nh-prose fade-up" style="max-width:820px;margin:0 auto;color:var(--gris-texto);line-height:1.75;font-size:.95rem">
    ${c.seoExtra || ''}
  </div>
</section>

<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:720px;margin:0 auto 1.5rem">
      <span class="overline">Comparativa de honorarios</span>
      <h2 class="section-title">Venta digital vs agencia tradicional en ${esc(c.cityName)}</h2>
    </div>
    <div class="nh-svc-table-scroll fade-up" style="max-width:720px;margin:0 auto">
      <table class="nh-svc-compare-table">
        <thead><tr><th>Modelo</th><th>Coste orientativo (${c.priceExample.toLocaleString('es-ES')} €)</th><th>Visitas</th></tr></thead>
        <tbody>
          <tr><td>Agencia ~6&nbsp;% + IVA</td><td>~${trad6.toLocaleString('es-ES')} €</td><td>Agencia</td></tr>
          <tr><td>Agencia ~3&nbsp;% + IVA</td><td>~${trad3.toLocaleString('es-ES')} €</td><td>Agencia</td></tr>
          <tr><td><strong>NuevaHabitat digital</strong></td><td><strong>1.999 € + IVA</strong></td><td>Tú (cualificadas)</td></tr>
          <tr><td>Particular solo portal</td><td>Cuota anuncio + tu tiempo</td><td>Tú (sin filtro)</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--blanco)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:640px;margin:0 auto 2rem">
      <span class="overline">Qué hacemos nosotros vs. tú</span>
      <h2 class="section-title">División clara del trabajo</h2>
    </div>
    <div class="nh-svc-pillar-grid fade-up">
      <div class="nh-svc-pillar"><h3>NuevaHabitat</h3><p>Valoración, anuncio, vídeo, Idealista y pisos.com, leads, filtro financiero, negociación, arras, coordinación notaría y panel actualizado.</p></div>
      <div class="nh-svc-pillar"><h3>Tú en ${esc(c.cityName)}</h3><p>Marcas franjas en el calendario del panel y recibes en casa a compradores <strong>ya cualificados</strong>. Sin visitas sorpresa de curiosos.</p></div>
      <div class="nh-svc-pillar"><h3>Pago</h3><p>50&nbsp;% al contratar activa el servicio. 50&nbsp;% restante en escritura cuando cierres la venta. Honorarios fijos, no % sobre precio.</p></div>
    </div>
  </div>
</section>

<section class="lc-section lc-nh-panel" style="background:var(--crema)">
  <div class="container">
    <div class="lc-nh-panel-grid fade-up">
      <div>
        <span class="overline">Panel del vendedor</span>
        <h2 class="section-title">Calendario de visitas en ${esc(c.cityName)}</h2>
        <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1rem">En el plan digital el calendario es la pieza clave: indicas cuándo puedes recibir visitas en tu vivienda y el equipo solo agenda compradores que pasaron el filtro de hipoteca o liquidez.</p>
        <ul class="lc-nh-panel-list">
          <li><strong>Honorarios</strong> — ves el 50&nbsp;% pagado y cuándo se habilita el pago en escritura.</li>
          <li><strong>Documentación</strong> — nota simple, certificados y escrituras en un solo sitio.</li>
          <li><strong>Visitas</strong> — ficha por visita: quién viene, agente y resultado.</li>
          <li><strong>Publicación</strong> — estado del anuncio y enlace a tu ficha cuando esté activa.</li>
        </ul>
        <a href="/registro?tipo=vender&amp;plan=digital&amp;ciudad=${encodeURIComponent(c.cityName)}" class="btn btn-gold">Crear cuenta y pagar 1.er 50&nbsp;%</a>
      </div>
      <div class="lc-pm-wrap" aria-hidden="true">
        <div class="lc-pm-header">
          <div class="lc-pm-brand"><span class="lc-pm-logo">NH</span><span>Nueva Habitat <small>Panel · Digital · ${esc(c.cityName)}</small></span></div>
          <div class="lc-pm-user"><span class="lc-pm-avatar">LP</span><span>Propietario · ${esc(c.cityName)}</span></div>
        </div>
        <div class="lc-pm-body">
          <div class="lc-pm-sidebar">
            <div class="lc-pm-nav active">Resumen</div>
            <div class="lc-pm-nav">Honorarios</div>
            <div class="lc-pm-nav">Visitas</div>
            <div class="lc-pm-nav">Documentación</div>
          </div>
          <div class="lc-pm-main">
            <div class="lc-pm-card">
              <div class="lc-pm-card-title">Próximas visitas (tú en casa)</div>
              <div class="lc-pm-visit"><span>Mar 18 · 19:00</span><strong>Comprador — hipoteca preaprobada</strong></div>
              <div class="lc-pm-visit"><span>Sáb 20 · 11:30</span><strong>Pareja — 2.ª visita</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:2rem">
      <span class="overline">Proceso</span>
      <h2 class="section-title">Cómo funciona la venta digital en ${esc(c.cityName)}, paso a paso</h2>
    </div>
    <div class="lc-steps lc-steps-6 fade-up">
      <div class="lc-step"><div class="lc-step-num">1</div><h4>Registro y 1.er pago</h4><p>Eliges plan digital, pagas 50&nbsp;% con Stripe y se activa el expediente.</p></div>
      <div class="lc-step"><div class="lc-step-num">2</div><h4>Alta del inmueble</h4><p>Dirección, documentación y nota registral en el panel.</p></div>
      <div class="lc-step"><div class="lc-step-num">3</div><h4>Anuncio y portales</h4><p>Fotografía, vídeo y publicación en Idealista y pisos.com.</p></div>
      <div class="lc-step"><div class="lc-step-num">4</div><h4>Visitas cualificadas</h4><p>Tú recibes en ${esc(c.cityName)} en las franjas que marques.</p></div>
      <div class="lc-step"><div class="lc-step-num">5</div><h4>Oferta y arras</h4><p>Negociación, reserva y contrato con comprador preparado.</p></div>
      <div class="lc-step"><div class="lc-step-num">6</div><h4>Escritura</h4><p>Segundo 50&nbsp;% y firma. Honorarios cerrados.</p></div>
    </div>
  </div>
</section>

${testimonialBlock}

${includedExcludedBlock('digital')}

${firmacertBlock()}

${faqBlock}

${compareThreePlansTable('digital')}

${gestoresStrip()}

<section class="lc-section" style="background:var(--negro);color:#fff;text-align:center">
  <div class="container fade-up">
    <h2 class="section-title" style="color:#fff;margin-bottom:1rem">Empieza la venta digital en ${esc(c.cityName)}</h2>
    <p style="color:rgba(255,255,255,.7);max-width:520px;margin:0 auto 1.5rem;line-height:1.65">Registro, contrato online y primer pago en minutos. Sin comisión oculta sobre el precio de tu piso.</p>
    <a href="/registro?tipo=vender&amp;plan=digital&amp;ciudad=${encodeURIComponent(c.cityName)}" class="btn btn-gold">Contratar · 1.999 € + IVA</a>
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-top" style="grid-template-columns:1.5fr 2fr 1fr">
      <div class="footer-brand"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><p>Venta 100&nbsp;% digital en ${esc(c.cityName)} · precio fijo y panel en tiempo real.</p></div>
      <div class="footer-col footer-col--servicios"><h4>Planes venta</h4><ul><li><a href="/venta-digital-barcelona">Digital · 1.999 € + IVA</a></li><li><a href="/venta-comercial-barcelona">Comercial · 2.500 € + IVA</a></li><li><a href="/venta-clasica-barcelona">Clásica · 3.500 € + IVA</a></li><li><a href="/vender">Hub vender</a></li></ul></div>
      <div class="footer-col"><h4>Contacto</h4><ul><li><a href="tel:+34603656587">603 656 587</a></li><li><a href="mailto:info@nuevahabitat.com">info@nuevahabitat.com</a></li></ul></div>
    </div>
    <div class="footer-bottom"><p>© 2026 NuevaHabitat</p><div class="footer-bottom-links"><a href="/privacidad">Privacidad</a><a href="/aviso-legal">Aviso legal</a></div></div>
  </div>
</footer>
<div class="whatsapp-float"><div class="whatsapp-tooltip">¿Dudas del plan digital?</div><a href="https://wa.me/34603656587?text=${waText}" class="whatsapp-btn" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a></div>
<script src="js/leads.js"></script>
<script src="js/site-config.js"></script>
<script src="js/ga-config.js"></script>
<script src="js/gtag-init.js"></script>
<script src="js/analytics-events.js"></script>
<script src="js/seo.js"></script>
<script src="js/main.js"></script>
</body>
</html>
`;
}

module.exports = { renderVentaDigitalPage };
