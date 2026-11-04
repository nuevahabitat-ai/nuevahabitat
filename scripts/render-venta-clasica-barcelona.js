const { testimonialsSection } = require('./landing-testimonials');
const {
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
  includedExcludedBlock,
  firmacertBlock,
  gestoresStrip,
  jsonLdServiceFaq,
} = require('./venta-planes-shared');

function renderClasicaBarcelona() {
  const testimonials = testimonialsSection({
    slug: 'venta-clasica-barcelona',
    cluster: 'intencion',
    footerLabel: 'Barcelona',
  });

  const audience = audienceSection(
    '¿Para quién?',
    'A quién va dirigida la venta clásica',
    'El plan más completo de NuevaHabitat: delegas visitas, negociación y cierre en el equipo, con el mismo panel digital que el resto de planes.',
    [
      {
        h: 'Quieres un agente en cada visita',
        p: 'Daniel o Sebastián presentan el inmueble, recogen feedback y negocian ofertas contigo, sin depender solo de portales.',
      },
      {
        h: 'Herencia o varios titulares',
        p: 'Panel con historial de visitas, ofertas y documentos para que todos vean el avance sin cadenas de email.',
      },
      {
        h: 'Barcelona y área metropolitana',
        p: 'Cobertura en ciudad y municipios donde el equipo puede acompañarte presencialmente hasta escritura.',
      },
    ]
  );

  const faqItems = [
    {
      q: '¿Qué incluye exactamente la venta clásica?',
      a: 'Valoración con comparables, reportaje foto/vídeo, publicación en Idealista y pisos.com, difusión a cartera, visitas con agente NH, negociación, arras (FIRMACERT), coordinación con notaría y panel vendedor hasta escritura.',
    },
    {
      q: '¿Cuánto cuesta y cuándo se paga?',
      a: '<strong>3.500 € + IVA</strong> repartidos: 50&nbsp;% al contratar (Stripe) y 50&nbsp;% en escritura. Honorarios fijos, no porcentaje sobre el precio de venta.',
    },
    {
      q: '¿Quién hace las visitas?',
      a: 'Un gestor del equipo (Daniel o Sebastián) acompaña a compradores ya cualificados. Tú marcas disponibilidad en el calendario del panel.',
    },
    {
      q: '¿Publicáis en Idealista y pisos.com?',
      a: 'Sí. La publicación se hace en ambos portales más nuestra cartera de demanda, para maximizar compradores serios.',
    },
    {
      q: '¿En qué se diferencia del plan digital (1.999 € + IVA)?',
      a: 'En digital tú abres la puerta; en clásica el agente NH va a todas las visitas y lleva la negociación activa con más presencia humana.',
    },
    {
      q: '¿Y del digital + comercial (2.500 € + IVA)?',
      a: 'El comercial enseña el piso pero el paquete clásico incluye estrategia de precio integral, más visitas de agente y negociación de principio a fin.',
    },
    {
      q: '¿Necesito exclusiva de doce meses?',
      a: 'No trabajamos con exclusivas abusivas. El servicio se activa con contrato y primer 50&nbsp;%; condiciones claras en el expediente online.',
    },
    {
      q: '¿Qué es el panel del vendedor?',
      a: 'Área privada con visitas, ofertas, documentación, estado de pagos y timeline del proceso. Misma plataforma en los tres planes.',
    },
    {
      q: '¿Qué pasa si no vendo?',
      a: 'El segundo 50&nbsp;% solo se cobra en escritura. Si la operación no cierra, no pagas la parte final de honorarios.',
    },
    {
      q: '¿Atendéis solo Barcelona capital?',
      a: 'Barcelona ciudad y área metropolitana donde podamos operar visitas con el equipo (L\'Hospitalet, Badalona, Sant Cugat, etc.). Lo confirmamos en valoración.',
    },
  ];
  const faqsBlock = faqSection('venta clásica Barcelona', faqItems);
  const jsonLd = jsonLdServiceFaq({
    serviceName: 'Venta clásica Barcelona · NuevaHabitat',
    url: `${SITE}/venta-clasica-barcelona`,
    price: 3500,
    faqs: faqItems,
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Venta clásica Barcelona · 3.500 € + IVA · Acompañamiento integral · NuevaHabitat</title>
  <meta name="description" content="Venta clásica con equipo NuevaHabitat: visitas, negociación, Idealista y pisos.com, panel vendedor y gestión hasta escritura. 3.500 € + IVA · 50 % al contratar y 50 % en escritura."/>
  <link rel="canonical" href="${SITE}/venta-clasica-barcelona"/>
  <meta property="og:title" content="Venta clásica · NuevaHabitat"/>
  <meta property="og:image" content="${SITE}/imagenes/inmobiliario1.jpg"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${jsonLd}</script>
</head>
<body>
<nav id="navbar" class="scrolled" style="background:rgba(13,13,13,.97)">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><div class="nav-logo-divider"></div><div class="logo-text"><span class="logo-name">Nueva Habitat</span><span class="logo-sub">Barcelona</span></div></a>
    ${serviceNavLinks('clasica')}
    <div class="nav-actions"><a href="/registro?tipo=vender&amp;plan=clasico" class="nav-cta">Contratar</a></div>
  </div>
</nav>

<section class="nh-svc-hero">
  <div class="nh-svc-hero-bg" style="background-image:url('imagenes/inmobiliario1.jpg')"></div>
  <div class="nh-svc-hero-overlay"></div>
  <div class="container nh-svc-hero-inner fade-up">
    <div class="hero-badge">Acompañamiento integral · Barcelona y área metropolitana</div>
    <h1>Venta clásica: equipo NH en visitas, negociación y cierre</h1>
    <div class="nh-svc-price-chip"><strong>3.500 € + IVA</strong> · <span>50&nbsp;% contrato + 50&nbsp;% escritura</span></div>
    <p>El servicio más completo: <strong>Daniel o Sebastián</strong> como gestores, reportaje profesional, Idealista y pisos.com, compradores de cartera, visitas presenciales del equipo, arras y escritura. Mismo panel digital que los otros planes.</p>
    <div class="nh-svc-hero-actions">
      <a href="/registro?tipo=vender&amp;plan=clasico" class="btn btn-gold">Contratar venta clásica</a>
      <a href="/vender#valorar" class="btn btn-outline-light">Valoración gratuita</a>
    </div>
  </div>
</section>

${planesNavHtml('clasica')}

<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:720px;margin:0 auto 2rem">
      <span class="overline">Cómo funciona</span>
      <h2 class="section-title">De la valoración a la escritura, con agente dedicado</h2>
      <p style="color:var(--gris-texto);line-height:1.7">Contratas online, activamos expediente y te acompañamos en cada fase. Tú ves todo en el panel; el equipo ejecuta visitas y negociación.</p>
    </div>
    <div class="lc-steps lc-steps-6 fade-up">
      <div class="lc-step"><div class="lc-step-num">1</div><h4>Registro y 1.er pago</h4><p>Plan clásico, contrato digital y 50&nbsp;% con Stripe.</p></div>
      <div class="lc-step"><div class="lc-step-num">2</div><h4>Valoración formal</h4><p>Informe de mercado y precio de salida consensuado.</p></div>
      <div class="lc-step"><div class="lc-step-num">3</div><h4>Reportaje y anuncio</h4><p>Foto, vídeo y textos optimizados para portales.</p></div>
      <div class="lc-step"><div class="lc-step-num">4</div><h4>Idealista y pisos.com</h4><p>Publicación + cartera de compradores cualificados.</p></div>
      <div class="lc-step"><div class="lc-step-num">5</div><h4>Visitas y ofertas</h4><p>Agente NH en visitas; negociación de ofertas serias.</p></div>
      <div class="lc-step"><div class="lc-step-num">6</div><h4>Escritura</h4><p>Arras, notaría y 2.º 50&nbsp;% de honorarios.</p></div>
    </div>
  </div>
</section>

${audience}

${portalsPublicationBlock('Barcelona')}

<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:720px;margin:0 auto 2rem">
      <span class="overline">Diferencia clave</span>
      <h2 class="section-title">No es solo publicar: es vender contigo</h2>
      <p class="section-subtitle">Frente al plan digital (tú en visitas) o digital+comercial (un comercial), la clásica incluye <strong>estrategia de precio, negociación activa y presencia del equipo</strong> en todo el ciclo.</p>
    </div>
    <div class="nh-svc-pillar-grid fade-up">
      <div class="nh-svc-pillar"><h3>Valoración y precio</h3><p>Informe de mercado con comparables reales en Barcelona. Definimos precio de salida y estrategia de rebajas si hace falta.</p></div>
      <div class="nh-svc-pillar"><h3>Marketing completo</h3><p>Reportaje fotográfico y vídeo, publicación en Idealista y pisos.com y presentación a compradores de cartera.</p></div>
      <div class="nh-svc-pillar"><h3>Cierre profesional</h3><p>Visitas con agente, gestión de ofertas, arras (FIRMACERT), documentación y acompañamiento en notaría.</p></div>
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--blanco)">
  <div class="container lc-nh-split fade-up">
    <div>
      <span class="overline">Ecosistema compradores</span>
      <h2 class="section-title">Visitas con compradores preparados, no curiosos</h2>
      <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1rem">Quien visita tu piso con el plan clásico suele venir de nuestra <strong>cartera de compradores</strong> con perfil financiero revisado. El agente presenta el inmueble, recoge feedback y lo deja en tu panel.</p>
      <ul class="lc-nh-checklist">
        <li>Registro de cada visita: fecha, comprador, agente y resultado.</li>
        <li>Calendario: tú marcas disponibilidad; el agente agenda dentro de tus franjas.</li>
        <li>Contratos, arras y tasación centralizados en documentación del panel.</li>
        <li>Pago 50&nbsp;% al contratar (Stripe) y 50&nbsp;% en escritura al cerrar.</li>
      </ul>
      <a href="/comprar" class="btn btn-outline" style="margin-top:1rem">Cómo funciona la cartera compradores →</a>
    </div>
    <div class="lc-nh-split-media">
      <img src="imagenes/interior2.jpg" alt="Equipo NuevaHabitat visita vivienda Barcelona" loading="lazy" width="800" height="600"/>
    </div>
  </div>
</section>

<section class="lc-section lc-nh-panel" style="background:var(--crema)">
  <div class="container">
    <div class="lc-nh-panel-grid fade-up">
      <div>
        <span class="overline">Panel del vendedor</span>
        <h2 class="section-title">Tu expediente, controlado al milímetro</h2>
        <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1rem">Transparencia total sobre visitas, ofertas y pagos, con un gestor dedicado al teléfono cuando lo necesites.</p>
        <ul class="lc-nh-panel-list">
          <li><strong>Gestor dedicado</strong> — Daniel o Sebastián siguen tu operación.</li>
          <li><strong>Mi proceso</strong> — timeline desde valoración hasta escritura.</li>
          <li><strong>Honorarios</strong> — estado del 1.er y 2.º pago visible en tiempo real.</li>
        </ul>
        <a href="/registro?tipo=vender&amp;plan=clasico" class="btn btn-gold">Acceder al panel clásico</a>
      </div>
      <div class="lc-pm-wrap" aria-hidden="true">
        <div class="lc-pm-header">
          <div class="lc-pm-brand"><span class="lc-pm-logo">NH</span><span>Nueva Habitat <small>Panel · Clásica</small></span></div>
          <div class="lc-pm-user"><span class="lc-pm-avatar">MR</span><span>María R. · Vendedor</span></div>
        </div>
        <div class="lc-pm-body">
          <div class="lc-pm-sidebar">
            <div class="lc-pm-nav active">Resumen</div>
            <div class="lc-pm-nav">Mi proceso</div>
            <div class="lc-pm-nav">Visitas</div>
            <div class="lc-pm-nav">Contratos</div>
          </div>
          <div class="lc-pm-main">
            <div class="lc-pm-card">
              <div class="lc-pm-card-title">Resumen expediente</div>
              <div class="lc-pm-stats">
                <div class="lc-pm-stat"><div class="lc-pm-stat-val lc-pm-stat-pub">Publicado</div><div class="lc-pm-stat-lbl">Estado</div></div>
                <div class="lc-pm-stat"><div class="lc-pm-stat-val">12</div><div class="lc-pm-stat-lbl">Visitas</div></div>
                <div class="lc-pm-stat"><div class="lc-pm-stat-val">2</div><div class="lc-pm-stat-lbl">Ofertas</div></div>
              </div>
            </div>
            <div class="lc-pm-card">
              <div class="lc-pm-card-title">Próximas visitas (agente NH)</div>
              <div class="lc-pm-visit"><span>Vie 18 · 11:00</span><strong>Agente Daniel · Comprador cartera</strong></div>
              <div class="lc-pm-visit"><span>Lun 21 · 18:00</span><strong>Agente Daniel · Hipoteca OK</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

${includedExcludedBlock('clasica')}

${firmacertBlock()}

${testimonials}

${faqsBlock}

${compareThreePlansTable('clasica')}

${gestoresStrip()}

<section class="lc-section" style="background:var(--negro);color:#fff;text-align:center">
  <div class="container fade-up">
    <h2 class="section-title" style="color:#fff">Contrata la venta clásica</h2>
    <p style="color:rgba(255,255,255,.7);max-width:540px;margin:0 auto 1.25rem">Precio fijo, sin comisión del 3&nbsp;% sobre el precio de venta. Área metropolitana de Barcelona.</p>
    <a href="/registro?tipo=vender&amp;plan=clasico" class="btn btn-gold">Contratar · 3.500 € + IVA</a>
    <p style="margin-top:1rem;font-size:.85rem"><a href="/vender" style="color:var(--oro-claro)">Comparar los 3 planes en Vender →</a></p>
  </div>
</section>

${serviceFooter('Venta clásica Barcelona y área metropolitana.')}
<div class="whatsapp-float"><a href="https://wa.me/34603656587?text=Quiero%20venta%20cl%C3%A1sica%20NuevaHabitat" class="whatsapp-btn" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a></div>
${scriptsFooter()}
</body>
</html>`;
}

module.exports = { renderClasicaBarcelona };
