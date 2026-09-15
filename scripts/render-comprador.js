const { heroPicture, ogImage } = require('./render-barrio');

function heroMedia(L) {
  if (L.heroImage && L.compradorTipo === 'barrio') return heroPicture(L);
  const img = L.heroImage || (L.hero && L.hero.image);
  const alt = L.heroImageAlt || (L.hero && L.hero.imageAlt) || L.meta.title;
  if (!img) return '';
  return `<div class="lc-hero-media"><img src="${img}" alt="${alt}" fetchpriority="high" decoding="async"/></div>`;
}

function buyerFormBlock(L) {
  const ph = L.formPlaceholder || 'Zona que buscas (Eixample, Gràcia…)';
  return `<div class="lc-form fade-up" id="registro-comprador">
      <span class="overline">Sin compromiso</span>
      <h2 style="font-size:1.5rem;margin:.35rem 0 1rem">Empezar búsqueda de piso</h2>
      <form id="lcForm" onsubmit="return lcSubmitComprador(event)">
        <input type="text" id="lc-nombre" placeholder="Nombre y apellidos *" required autocomplete="name"/>
        <input type="tel" id="lc-tel" placeholder="Teléfono *" required autocomplete="tel"/>
        <input type="email" id="lc-email" placeholder="Email (opcional)" autocomplete="email"/>
        <input type="text" id="lc-zona" placeholder="${ph}"/>
        <input type="text" id="lc-presupuesto" placeholder="Presupuesto máx. orientativo (€)"/>
        <textarea id="lc-notas" rows="3" placeholder="Habitaciones, ascensor, plazo para comprar…"></textarea>
        <button type="submit" id="lc-btn" class="btn btn-gold" style="width:100%;justify-content:center">Registrar búsqueda →</button>
      </form>
      <p style="font-size:.75rem;color:var(--gris-medio);margin-top:.75rem;line-height:1.5">Honorarios comprador: <strong>5.000 € + IVA</strong>, solo en escritura. Acceso a cartera privada y panel 24/7.</p>
    </div>`;
}

function buyerFooterScripts(L, deps) {
  const { CONTACT_EMAIL, footerPhonesLi } = deps;
  const wa = encodeURIComponent(L.whatsappText || 'Hola, busco piso en Barcelona con NuevaHabitat');
  return `<footer>
  <div class="container">
    <div class="footer-top" style="grid-template-columns:1.5fr 2.5fr 1fr">
      <div class="footer-brand"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><p>Compra en Barcelona con acompañamiento total. Precio fijo 5.000€ + IVA, cobro solo en escritura.</p></div>
      <div class="footer-col footer-col--servicios"><h4>Servicios</h4><div data-nh-landing-footer data-nh-footer-extra="comprar,vender"></div></div>
      <div class="footer-col"><h4>Contacto</h4><ul><li>${footerPhonesLi()}</li><li><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></li></ul></div>
    </div>
    <div class="footer-bottom"><p>© 2026 NuevaHabitat.</p><div class="footer-bottom-links"><a href="/privacidad">Privacidad</a><a href="/aviso-legal">Aviso legal</a></div></div>
  </div>
</footer>
<div class="whatsapp-float"><a href="https://wa.me/34603656587?text=${wa}" class="whatsapp-btn" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a></div>
<nav class="mbn" id="mbn">
  <a href="/" class="mbn-tab" data-tab="inicio" aria-label="Inicio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span>Inicio</span></a>
  <a href="/inmuebles" class="mbn-tab" data-tab="inmuebles" aria-label="Inmuebles"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35"/></svg><span>Inmuebles</span></a>
  <a href="/vender" class="mbn-tab" data-tab="vender" aria-label="Vender"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg><span>Vender</span></a>
  <a href="/comprar" class="mbn-tab active" data-tab="comprar" aria-label="Comprar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg><span>Comprar</span></a>
  <a href="/registro" class="mbn-tab" data-tab="cuenta" aria-label="Mi cuenta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span>Cuenta</span></a>
</nav>
<div id="cookie-banner">
  <div class="cookie-banner-inner">
    <button type="button" class="cookie-btn-close" id="cookie-close" aria-label="Cerrar">&times;</button>
    <p>Usamos cookies propias y de terceros. <a href="/cookies">Más información</a>.</p>
    <div class="cookie-btns">
      <button type="button" class="cookie-btn-accept" id="cookie-accept">Aceptar todo</button>
      <button type="button" class="cookie-btn-reject" id="cookie-reject">Solo necesarias</button>
    </div>
  </div>
</div>
<script src="js/site-config.js"></script>
<script src="js/ga-config.js"></script>
<script src="js/landings.js"></script>
<script src="js/landings-ui.js"></script>
<script src="js/seo.js"></script>
<script src="js/analytics-events.js"></script>
<script src="js/landing-tools.js"></script>
<script src="js/main.js" defer></script>
<script defer src="js/supabase.js"></script>
<script defer src="js/notify.js"></script>
<script defer src="js/leads.js"></script>
<script>
async function lcSubmitComprador(e){
  e.preventDefault();
  const btn = document.getElementById('lc-btn');
  btn.disabled = true; btn.textContent = 'Enviando…';
  const ok = await nhSubmitLead({
    nombre: document.getElementById('lc-nombre').value,
    telefono: document.getElementById('lc-tel').value,
    email: document.getElementById('lc-email').value,
    mensaje: ['Zona: '+document.getElementById('lc-zona').value, 'Presupuesto: '+document.getElementById('lc-presupuesto').value, document.getElementById('lc-notas').value].filter(Boolean).join(' · '),
    tipo: 'compra',
    origen: '${L.origen_lead}',
    extra: { landing: '${L.slug}', cluster: 'comprador', presupuesto: document.getElementById('lc-presupuesto').value || null, zona: document.getElementById('lc-zona').value || null }
  });
  btn.disabled = false; btn.textContent = 'Registrar búsqueda →';
  if(ok){
    const q = new URLSearchParams({ origen: '${L.origen_lead}', landing: '${L.slug}', tipo: 'comprador' });
    window.location.href = '/registro?' + q.toString();
  }
  return false;
}
</script>`;
}

function renderCompradorBarrio(L, ctx, deps) {
  const {
    SITE, sharedStyles, faqHtml, relatedBlock, buildJsonLd, navBar, callBanner,
    checklistBlock, marketStatsBlock, nhBuyerPlatformBundle,
  } = deps;
  const rb = () => relatedBlock(L, ctx);
  const steps = (L.como_ayudamos && L.como_ayudamos.steps || []).map((s, i) =>
    `<div class="lc-step fade-up${i ? ' fade-up-delay-' + i : ''}"><div class="lc-step-num">${i + 1}</div><h4 style="margin:.4rem 0">${s.title}</h4><p style="font-size:.875rem;color:var(--gris-texto)">${s.body}</p></div>`
  ).join('');
  const stepsSection = steps ? `<section class="lc-section" style="background:var(--negro);color:#fff">
  <div class="container">
    <div class="text-center" style="margin-bottom:2rem"><span class="overline" style="color:var(--oro)">Acompañamiento integral</span><h2 class="section-title light">${L.como_ayudamos.title}</h2></div>
    <div class="lc-steps">${steps}</div>
  </div>
</section>` : '';
  const cp = (L.postalCodes && L.postalCodes[0]) || '08000';
  const areaLabel = L.municipio ? 'Área metropolitana' : 'Barcelona';
  const badge = `${L.barrio} · ${cp} · ${areaLabel}`;
  const og = ogImage(L);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${L.meta.title}</title>
  <meta name="description" content="${L.meta.description}"/>
  <meta name="keywords" content="${L.meta.keywords}"/>
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"/>
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="${SITE}/${L.slug}"/>
  <meta property="og:title" content="${L.meta.title.replace(' · NuevaHabitat', '')}"/>
  <meta property="og:description" content="${L.meta.description}"/>
  <meta property="og:image" content="${SITE}/${og}"/>
  <link rel="canonical" href="${SITE}/${L.slug}"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${buildJsonLd(L)}</script>
  ${sharedStyles()}
</head>
<body data-nh-cluster="comprador" data-nh-landing-slug="${L.slug}">
${navBar(L)}
<div class="container"><nav class="page-breadcrumb fade-up" aria-label="Breadcrumb"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/comprar">Comprar</a><span aria-hidden="true">/</span><span class="bc-current">${L.breadcrumbCurrent || L.barrio}</span></nav></div>
<section class="lc-hero">
  ${heroPicture(L)}
  <div class="lc-hero-overlay"></div>
  <div class="container"><div class="lc-hero-content fade-up">
    <span class="lc-badge">${badge}</span>
    <h1>${L.hero.h1}</h1>
    <p>${L.hero.lead}</p>
    <div style="display:flex;gap:.75rem;flex-wrap:wrap">
      <a href="#registro-comprador" class="btn btn-gold btn-lg">Registrar búsqueda en ${L.barrio}</a>
      <a href="/inmuebles#q=${encodeURIComponent(L.inmueblesQuery || L.barrio)}" class="btn btn-outline-light btn-lg">Ver inmuebles</a>
    </div>
  </div></div>
</section>
${callBanner()}
<section class="lc-section" style="background:var(--crema)">
  <div class="container lc-grid-2">
    <div class="lc-prose lc-prose--cols fade-up">
      <span class="overline">Comprar en ${L.barrio}</span>
      <h2>Comprar piso en ${L.barrio} con acompañamiento y precio fijo</h2>
      ${L.argumento_principal}
      <p style="font-size:.9375rem;color:var(--gris-medio)"><strong>Micro-zonas:</strong> ${(L.zonas || []).join(', ')}.</p>
      ${marketStatsBlock(L)}
    </div>
    ${buyerFormBlock(L)}
  </div>
</section>
${stepsSection}
${nhBuyerPlatformBundle()}
<section class="lc-section" style="background:var(--blanco);padding-top:3rem;padding-bottom:3rem">
  <div class="container text-center fade-up">
    <span class="overline">Cartera activa</span>
    <h2 class="section-title">Inmuebles en venta en ${L.barrio}</h2>
    <a href="/inmuebles#q=${encodeURIComponent(L.inmueblesQuery || L.barrio)}" class="btn btn-gold btn-lg">Explorar ${L.barrio} →</a>
  </div>
</section>
${rb()}
${callBanner('prefaq')}
<section class="lc-section" style="background:var(--crema)">
  <div class="container" style="max-width:800px">
    ${checklistBlock(L.checklist?.title || `Checklist antes de comprar en ${L.barrio}`, L.checklist?.items, L.checklist?.intro)}
    <div class="text-center fade-up" style="margin-bottom:2rem;margin-top:${L.checklist?.items?.length ? '3rem' : '0'}"><span class="overline">FAQ</span><h2 class="section-title">Comprar en ${L.barrio} — preguntas frecuentes</h2></div>
    <div class="faq-list fade-up">${faqHtml(L.faq)}</div>
    <div class="lc-kw fade-up"><strong>Búsquedas relacionadas:</strong> ${L.keywords_footer}</div>
  </div>
</section>
<section style="padding:4rem 0;background:var(--negro);text-align:center"><div class="container"><h2 class="section-title light">¿Empezamos tu búsqueda en ${L.barrio}?</h2><a href="#registro-comprador" class="btn btn-gold btn-lg">Registrar búsqueda gratuita</a></div></section>
${buyerFooterScripts(L, deps)}
</body></html>`;
}

function renderComprador(L, ctx, deps) {
  if (L.compradorTipo === 'barrio' && L.barrio && L.heroImage) {
    return renderCompradorBarrio(L, ctx, deps);
  }

  const {
    SITE, sharedStyles, faqHtml, relatedBlock, buildJsonLd, navBar, callBanner,
    checklistBlock, marketStatsBlock, nhBuyerPlatformBundle,
  } = deps;
  const rb = () => relatedBlock(L, ctx);

  const steps = (L.como_ayudamos && L.como_ayudamos.steps || []).map((s, i) =>
    `<div class="lc-step fade-up${i ? ' fade-up-delay-' + i : ''}"><div class="lc-step-num">${i + 1}</div><h4 style="margin:.4rem 0">${s.title}</h4><p style="font-size:.875rem;color:var(--gris-texto)">${s.body}</p></div>`
  ).join('');
  const stepsSection = steps ? `<section class="lc-section" style="background:var(--negro);color:#fff">
  <div class="container">
    <div class="text-center" style="margin-bottom:2rem"><span class="overline" style="color:var(--oro)">Proceso</span><h2 class="section-title light">${L.como_ayudamos.title}</h2></div>
    <div class="lc-steps">${steps}</div>
  </div>
</section>` : '';

  const ogImg = L.heroImage || (L.hero && L.hero.image) || 'imagenes/familia2.jpg';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${L.meta.title}</title>
  <meta name="description" content="${L.meta.description}"/>
  <meta name="keywords" content="${L.meta.keywords}"/>
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"/>
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="${SITE}/${L.slug}"/>
  <meta property="og:title" content="${L.meta.title}"/>
  <meta property="og:description" content="${L.meta.description}"/>
  <meta property="og:image" content="${SITE}/${ogImg}"/>
  <link rel="canonical" href="${SITE}/${L.slug}"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${buildJsonLd(L)}</script>
  ${sharedStyles()}
</head>
<body data-nh-cluster="comprador" data-nh-landing-slug="${L.slug}">
${navBar(L)}
<div class="container"><nav class="page-breadcrumb fade-up" aria-label="Breadcrumb"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/comprar">Comprar</a><span aria-hidden="true">/</span><span class="bc-current">${L.breadcrumbCurrent || L.footerLabel || L.slug}</span></nav></div>
<section class="lc-hero">
  ${heroMedia(L)}
  <div class="lc-hero-overlay"></div>
  <div class="container"><div class="lc-hero-content fade-up">
    <span class="lc-badge">${L.hero.badge}</span>
    <h1>${L.hero.h1}</h1>
    <p>${L.hero.lead}</p>
    <div style="display:flex;gap:.75rem;flex-wrap:wrap">
      <a href="#registro-comprador" class="btn btn-gold btn-lg">Empezar mi búsqueda</a>
      <a href="/registro" class="btn btn-outline-light btn-lg">Crear cuenta comprador</a>
    </div>
  </div></div>
</section>
${callBanner()}
<section class="lc-section" style="background:var(--crema)">
  <div class="container lc-grid-2">
    <div class="lc-prose lc-prose--cols fade-up">${L.argumento_principal}</div>
    ${buyerFormBlock(L)}
  </div>
</section>
${marketStatsBlock(L)}
${checklistBlock(L.checklist?.title, L.checklist?.items, L.checklist?.intro)}
${stepsSection}
${nhBuyerPlatformBundle()}
${rb()}
${callBanner('prefaq')}
<section class="lc-section" style="background:var(--blanco)">
  <div class="container" style="max-width:800px">
    <div class="text-center" style="margin-bottom:2rem"><span class="overline">FAQ</span><h2 class="section-title">Preguntas frecuentes</h2></div>
    <div class="faq-list fade-up">${faqHtml(L.faq)}</div>
    <div class="lc-kw"><strong>Búsquedas relacionadas:</strong> ${L.keywords_footer}</div>
  </div>
</section>
<section style="padding:4rem 0;background:var(--negro);text-align:center"><div class="container"><h2 class="section-title light">¿Empezamos tu búsqueda?</h2><a href="#registro-comprador" class="btn btn-gold btn-lg">Registrar búsqueda gratuita</a></div></section>
${buyerFooterScripts(L, deps)}
</body></html>`;
}

module.exports = { renderComprador, buyerFormBlock };
