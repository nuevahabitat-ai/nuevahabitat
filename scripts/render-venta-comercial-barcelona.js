const { testimonialsSection } = require('./landing-testimonials');
const {
  SITE,
  portalsPublicationBlock,
  planesNavHtml,
  audienceSection,
  faqSection,
  serviceNavLinks,
  scriptsFooter,
  serviceFooter,
  compareThreePlansTable,
  includedExcludedBlock,
  firmacertBlock,
  gestoresStrip,
  jsonLdServiceFaq,
} = require('./venta-planes-shared');

function renderComercialBarcelona() {
  const testimonials = testimonialsSection({
    slug: 'venta-comercial-barcelona',
    cluster: 'intencion',
    footerLabel: 'Barcelona',
  });

  const audience = audienceSection(
    '¿Para quién?',
    'A quién va dirigido digital + comercial',
    'Mismo expediente y panel que el plan 1.999 € + IVA, pero un comercial NuevaHabitat enseña el piso en Barcelona mientras tú sigues tu rutina.',
    [
      {
        h: 'No quieres hacer visitas en casa',
        p: 'Trabajas fuera, vives lejos del piso o prefieres no mezclar vida personal y visitas comerciales.',
      },
      {
        h: 'Quieres ahorrar vs. clásica',
        p: 'Necesitas presencia profesional en visitas sin el paquete integral de agente en negociación (3.500 € + IVA).',
      },
      {
        h: 'Inmueble en Barcelona ciudad',
        p: 'El comercial visita in situ; fuera de Barcelona puedes usar venta digital o clásica en área metropolitana.',
      },
    ]
  );

  const faqItems = [
    {
      q: '¿Qué incluye el plan a 2.500 € + IVA?',
      a: 'Expediente online, publicación en Idealista y pisos.com, filtro de compradores, comercial NH en visitas, negociación, arras y coordinación hasta escritura. 50&nbsp;% + 50&nbsp;%.',
    },
    {
      q: '¿En qué se diferencia del digital puro (1.999 € + IVA)?',
      a: '500 € más de base (+ IVA): un comercial enseña el inmueble y sube informe al panel. En digital tú abres la puerta.',
    },
    {
      q: '¿Y de la venta clásica (3.500 € + IVA)?',
      a: 'La clásica incluye agente en visitas y negociación integral. Aquí el comercial cubre visitas; tú decides ofertas con el equipo vía panel.',
    },
    {
      q: '¿Tengo que estar en la visita?',
      a: 'No es obligatorio. Debes facilitar acceso (llaves, portero, lockbox) y estar disponible para decisiones de precio y ofertas.',
    },
    {
      q: '¿Por qué solo Barcelona?',
      a: 'El comercial desplaza in situ en la ciudad. En otros municipios valora <a href="/venta-digital-barcelona">venta digital</a> o <a href="/venta-clasica-barcelona">clásica</a>.',
    },
    {
      q: '¿Publicáis en Idealista y pisos.com?',
      a: 'Sí, igual que en el resto de planes, más cartera de compradores cualificados.',
    },
    {
      q: '¿Cómo veo qué pasó en cada visita?',
      a: 'Notificación en panel: fecha, comercial, nivel de interés y notas en menos de 24 h.',
    },
    {
      q: '¿Cuándo pago los honorarios?',
      a: '50&nbsp;% al contratar con Stripe; 50&nbsp;% restante en escritura al cerrar la venta.',
    },
    {
      q: '¿Puedo cambiar de plan después?',
      a: 'Antes de activar visitas puedes hablar con el equipo; una vez en marcha el expediente sigue el plan contratado.',
    },
    {
      q: '¿Qué documentación necesito?',
      a: 'Nota simple, certificado energético, datos de titularidad y acceso al inmueble. Todo se sube al panel.',
    },
  ];
  const faqsBlock = faqSection('digital + comercial Barcelona', faqItems);
  const jsonLd = jsonLdServiceFaq({
    serviceName: 'Venta digital + comercial Barcelona · NuevaHabitat',
    url: `${SITE}/venta-comercial-barcelona`,
    price: 2500,
    faqs: faqItems,
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Venta digital + comercial Barcelona · 2.500 € + IVA · NuevaHabitat</title>
  <meta name="description" content="Expediente digital con comercial NuevaHabitat en visitas en Barcelona. 2.500 € + IVA · Idealista y pisos.com · 50 % al contratar y 50 % en escritura."/>
  <link rel="canonical" href="${SITE}/venta-comercial-barcelona"/>
  <meta property="og:title" content="Digital + comercial · NuevaHabitat Barcelona"/>
  <meta property="og:image" content="${SITE}/imagenes/interior5.jpg"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${jsonLd}</script>
</head>
<body>
<nav id="navbar" class="scrolled" style="background:rgba(13,13,13,.97)">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><div class="nav-logo-divider"></div><div class="logo-text"><span class="logo-name">Nueva Habitat</span><span class="logo-sub">Barcelona</span></div></a>
    ${serviceNavLinks('comercial')}
    <div class="nav-actions"><a href="/registro?tipo=vender&amp;plan=digital_comercial_bcn" class="nav-cta">Contratar</a></div>
  </div>
</nav>

<section class="nh-svc-hero">
  <div class="nh-svc-hero-bg" style="background-image:url('imagenes/interior5.jpg')"></div>
  <div class="nh-svc-hero-overlay"></div>
  <div class="container nh-svc-hero-inner fade-up">
    <div class="hero-badge">Exclusivo Barcelona · inmueble en ciudad</div>
    <h1>Digital de verdad, pero sin que tú hagas las visitas</h1>
    <div class="nh-svc-price-chip"><strong>2.500 € + IVA</strong> · <span>50&nbsp;% contrato + 50&nbsp;% escritura</span></div>
    <p>Mismo panel, Idealista y pisos.com y misma cualificación de compradores que el plan <strong>1.999 € + IVA</strong>. Un <strong>comercial NuevaHabitat</strong> enseña el piso in situ mientras tú sigues tu vida.</p>
    <div class="nh-svc-hero-actions">
      <a href="/registro?tipo=vender&amp;plan=digital_comercial_bcn" class="btn btn-gold">Contratar en Barcelona</a>
      <a href="/venta-digital-barcelona" class="btn btn-outline-light">Ver plan más económico</a>
    </div>
  </div>
</section>

${planesNavHtml('comercial')}

<section class="lc-section" style="background:var(--blanco)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:680px;margin:0 auto 2rem">
      <span class="overline">Comparativa honesta</span>
      <h2 class="section-title">Digital puro vs. digital con comercial</h2>
      <p class="section-subtitle">Misma base tecnológica; cambia quién abre la puerta.</p>
    </div>
    <div class="nh-svc-compare-2 fade-up">
      <div class="nh-svc-compare-box">
        <h3>Digital · 1.999 € + IVA</h3>
        <p style="color:var(--gris-texto);line-height:1.65;margin:0 0 1rem">Tú recibes visitas cualificadas en el calendario del panel. Máximo ahorro si puedes enseñar el piso.</p>
        <a href="/venta-digital-barcelona" class="btn btn-outline" style="width:100%;justify-content:center">Ver venta digital</a>
      </div>
      <div class="nh-svc-compare-box is-highlight">
        <h3>Digital + comercial · 2.500 € + IVA</h3>
        <p style="color:var(--gris-texto);line-height:1.65;margin:0 0 1rem">Comercial NH coordina la visita, enseña el inmueble y devuelve feedback al panel. Solo viviendas en <strong>Barcelona</strong>.</p>
        <a href="/registro?tipo=vender&amp;plan=digital_comercial_bcn" class="btn btn-gold" style="width:100%;justify-content:center">Contratar este plan</a>
      </div>
    </div>
  </div>
</section>

${audience}

${portalsPublicationBlock('Barcelona')}

<section class="lc-section" style="background:var(--crema)">
  <div class="container lc-nh-split fade-up">
    <div class="lc-nh-split-media">
      <img src="imagenes/inmobiliario5.jpg" alt="Comercial NuevaHabitat visita piso Barcelona" loading="lazy" width="800" height="600"/>
    </div>
    <div>
      <span class="overline">Qué incluye</span>
      <h2 class="section-title">Todo el digital, más presencia profesional</h2>
      <ul class="lc-nh-checklist">
        <li>Expediente online, documentación y publicación en Idealista y pisos.com.</li>
        <li>Cualificación de compradores antes de agendar (hipoteca, perfil, zona).</li>
        <li>Comercial NH en visita: presentación del inmueble, preguntas técnicas y cierre de interés.</li>
        <li>Informe en panel tras cada visita; tú ves el resumen sin estar presente.</li>
        <li>Negociación, arras y escritura con el mismo equipo hasta el 2.º pago del 50&nbsp;%.</li>
      </ul>
    </div>
  </div>
</section>

<section class="lc-section lc-nh-panel" style="background:var(--blanco)">
  <div class="container">
    <div class="lc-nh-panel-grid fade-up">
      <div>
        <span class="overline">En la práctica</span>
        <h2 class="section-title">Tú sigues el expediente; el comercial ejecuta la visita</h2>
        <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1rem">Recibes notificación de visita confirmada, resultado y nivel de interés.</p>
        <ul class="lc-nh-panel-list">
          <li><strong>Calendario</strong> — acordamos franjas; el comercial confirma con el comprador.</li>
          <li><strong>Acceso</strong> — llaves, portero o lockbox: lo definimos en el onboarding.</li>
          <li><strong>Seguridad</strong> — solo entran compradores registrados en expediente.</li>
        </ul>
      </div>
      <div class="lc-pm-wrap" aria-hidden="true">
        <div class="lc-pm-header">
          <div class="lc-pm-brand"><span class="lc-pm-logo">NH</span><span>Nueva Habitat <small>Panel · Comercial</small></span></div>
          <div class="lc-pm-user"><span class="lc-pm-avatar">MR</span><span>María R. · Vendedor</span></div>
        </div>
        <div class="lc-pm-body">
          <div class="lc-pm-sidebar">
            <div class="lc-pm-nav active">Visitas</div>
            <div class="lc-pm-nav">Resumen</div>
            <div class="lc-pm-nav">Honorarios</div>
          </div>
          <div class="lc-pm-main">
            <div class="lc-pm-card">
              <div class="lc-pm-card-title">Visitas con comercial NH</div>
              <div class="lc-pm-visit"><span>Vie 14 · 17:30</span><strong>Comercial: Daniel · Comprador cualificado</strong></div>
              <div class="lc-pm-visit"><span>Sáb 15 · 12:00</span><strong>Comercial: Daniel · 2.ª visita</strong></div>
            </div>
            <div class="lc-pm-card">
              <div class="lc-pm-card-title">Estado</div>
              <p style="font-size:.75rem;color:var(--gris-texto);margin:0;line-height:1.5">Propietario no necesita estar en casa. Feedback subido al panel en &lt;24h.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:2rem"><span class="overline">Proceso</span><h2 class="section-title">Seis fases hasta escritura</h2></div>
    <div class="lc-steps lc-steps-6 fade-up">
      <div class="lc-step"><div class="lc-step-num">1</div><h4>Contrato + 1.er 50&nbsp;%</h4><p>Registro plan comercial BCN y activación Stripe.</p></div>
      <div class="lc-step"><div class="lc-step-num">2</div><h4>Expediente</h4><p>Documentos, llaves y ficha del inmueble.</p></div>
      <div class="lc-step"><div class="lc-step-num">3</div><h4>Publicación</h4><p>Idealista, pisos.com y cartera de compradores.</p></div>
      <div class="lc-step"><div class="lc-step-num">4</div><h4>Visitas NH</h4><p>Comercial enseña el piso; tú ves el informe.</p></div>
      <div class="lc-step"><div class="lc-step-num">5</div><h4>Oferta y arras</h4><p>Negociación y reserva con comprador filtrado.</p></div>
      <div class="lc-step"><div class="lc-step-num">6</div><h4>Escritura</h4><p>2.º 50&nbsp;% y cierre notarial.</p></div>
    </div>
  </div>
</section>

${includedExcludedBlock('comercial')}

${firmacertBlock()}

${testimonials}

${faqsBlock}

${compareThreePlansTable('comercial')}

${gestoresStrip()}

<section class="lc-section" style="background:var(--negro);color:#fff;text-align:center">
  <div class="container fade-up">
    <h2 class="section-title" style="color:#fff">Vende en Barcelona sin hacer visitas</h2>
    <a href="/registro?tipo=vender&amp;plan=digital_comercial_bcn" class="btn btn-gold" style="margin-top:1rem">Contratar · 2.500 € + IVA</a>
    <p style="margin-top:1rem;font-size:.85rem"><a href="/vender" style="color:var(--oro-claro)">Comparar los 3 planes en Vender →</a></p>
  </div>
</section>

${serviceFooter('Digital + comercial solo Barcelona.')}
<div class="whatsapp-float"><a href="https://wa.me/34603656587?text=Quiero%20el%20plan%20digital%20%2B%20comercial%20Barcelona" class="whatsapp-btn" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a></div>
${scriptsFooter()}
</body>
</html>`;
}

module.exports = { renderComercialBarcelona };
