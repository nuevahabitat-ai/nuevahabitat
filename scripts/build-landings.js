const fs = require('fs');
const path = require('path');
const { renderBarrio } = require('./render-barrio');
const { renderPilar } = require('./render-pilar');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'landings');
const SITE = 'https://www.nuevahabitat.com';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || process.env.INFO_EMAIL || 'info@nuevahabitat.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin.nuevahabitat@gmail.com';
const SAME_AS = [
  'https://www.google.com/maps/search/?api=1&query=Carrer+de+Mej%C3%ADa+Lequerica,+42,+08028+Barcelona',
  'https://wa.me/34603656587',
];
const MIN_WORDS_BY_CLUSTER = {
  barrio: 650,
  situacion: 650,
  intencion: 900,
  comparativa: 900,
};
const MIN_WORDS_DEFAULT = 650;
const SIMILARITY_THRESHOLD = 0.38;

function loadJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function wordCount(text) {
  return stripHtml(text).split(' ').filter(Boolean).length;
}

function tokenSet(text) {
  return new Set(stripHtml(text).toLowerCase().split(/\W+/).filter((w) => w.length > 3));
}

function jaccard(a, b) {
  const A = tokenSet(a);
  const B = tokenSet(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  A.forEach((t) => { if (B.has(t)) inter++; });
  return inter / (A.size + B.size - inter);
}

function loadKeywordsMap() {
  const p = path.join(ROOT, 'content', 'keywords-map.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
}

function validateLandings(all) {
  const errors = [];
  const keywords = loadKeywordsMap();
  const canonicals = Object.values(keywords).map((k) => k.canonical);

  all.forEach((L) => {
    const wc = wordCount(L.argumento_principal);
    const min = MIN_WORDS_BY_CLUSTER[L.cluster] || MIN_WORDS_DEFAULT;
    if (!L.indexable && wc >= min) return;
    if (L.indexable && wc < min) {
      errors.push(`${L.slug}: argumento_principal tiene ${wc} palabras (mínimo ${min})`);
    }
    if (!stripHtml(L.argumento_principal)) {
      errors.push(`${L.slug}: argumento_principal vacío`);
    }
  });

  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const sim = jaccard(all[i].argumento_principal, all[j].argumento_principal);
      if (sim > SIMILARITY_THRESHOLD) {
        errors.push(`Similitud ${Math.round(sim * 100)}% entre ${all[i].slug} y ${all[j].slug}`);
      }
    }
  }

  const kwToSlug = {};
  all.forEach((L) => {
    const kw = (L.keyword_principal || '').toLowerCase();
    if (!kw) return;
    if (kwToSlug[kw] && kwToSlug[kw] !== L.slug) {
      errors.push(`Keyword duplicada "${kw}": ${kwToSlug[kw]} vs ${L.slug}`);
    }
    kwToSlug[kw] = L.slug;
  });

  const canonicalUsed = {};
  Object.entries(keywords).forEach(([slug, meta]) => {
    const c = meta.canonical;
    if (!c) return;
    if (canonicalUsed[c] && canonicalUsed[c] !== slug) {
      errors.push(`Canonical duplicado ${c}: ${canonicalUsed[c]} vs ${slug}`);
    }
    canonicalUsed[c] = slug;
  });

  return errors;
}

function faqSchema(faq, slug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

function buildJsonLd(L) {
  const areaServed = L.zonas || L.areaServed || ['Barcelona', 'Área metropolitana de Barcelona'];
  const bcName = L.breadcrumbCurrent || L.barrio || 'Vender';
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: 'NuevaHabitat',
      image: `${SITE}/imagenes/Logo/logosinfondo2.png`,
      telephone: '+34603656587',
      email: CONTACT_EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Carrer de Mejía Lequerica, 42',
        addressLocality: 'Barcelona',
        postalCode: '08028',
        addressCountry: 'ES',
      },
      areaServed: areaServed,
      url: `${SITE}/${L.slug}`,
      sameAs: SAME_AS,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Vender', item: `${SITE}/vender` },
        { '@type': 'ListItem', position: 3, name: bcName, item: `${SITE}/${L.slug}` },
      ],
    },
    faqSchema(L.faq, L.slug),
  ];
  if (L.cluster === 'situacion' && L.como_ayudamos) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: L.como_ayudamos.title,
      step: L.como_ayudamos.steps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title,
        text: s.body,
      })),
    });
  }
  return JSON.stringify(schemas, null, 2);
}

function robotsMeta(L) {
  return L.indexable !== false
    ? 'index, follow, max-snippet:-1, max-image-preview:large'
    : 'noindex, follow';
}

const NH_FEE_EUR = 3630;

function calcInitial(precio) {
  const p = Number(precio) || 420000;
  const tradVal = Math.round(p * 0.06 * 1.21);
  const save = Math.max(0, tradVal - NH_FEE_EUR);
  return {
    precio: p,
    precioFmt: p.toLocaleString('es-ES'),
    tradFmt: tradVal.toLocaleString('es-ES') + ' €',
    saveFmt: save.toLocaleString('es-ES') + ' €',
  };
}

function navBar(L) {
  const ctaLabel = L.cluster === 'comparativa' || L.cluster === 'intencion' ? 'Valorar' : 'Valorar mi piso';
  return `<nav id="navbar"><div class="nav-inner">
  <a href="index.html" class="nav-logo"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><div class="nav-logo-divider"></div><div class="logo-text"><span class="logo-name">Nueva Habitat</span><span class="logo-sub">${navSub(L)}</span></div></a>
  <ul class="nav-links"><li><a href="vender.html" style="color:var(--oro)">Vender</a></li><li><a href="comprar.html">Comprar</a></li><li><a href="inmuebles.html">Inmuebles</a></li><li><a href="contacto.html">Contacto</a></li></ul>
  <div class="nav-actions"><a href="tel:+34603656587" class="nav-tel nh-call-link" data-nh-call="header">603 656 587</a><a href="#valorar" class="nav-cta">${ctaLabel}</a><button class="nav-hamburger" id="menuBtn"><span></span><span></span><span></span></button></div>
</div></nav>
<nav class="mobile-nav" id="mobileNav"><button class="mobile-nav-close" id="menuClose">✕</button><a href="vender.html">Vender</a><a href="comprar.html">Comprar</a><a href="inmuebles.html">Inmuebles</a><a href="tel:+34603656587" class="nh-call-link" data-nh-call="mobile-menu">603 656 587</a><a href="#valorar" style="color:var(--oro)">Valorar →</a></nav>`;
}

function callBanner(variant) {
  const preFaq = variant === 'prefaq';
  const cls = preFaq ? 'lc-call-banner lc-call-banner--prefaq' : 'lc-call-banner';
  return `<section class="${cls}">
  <div class="container">
    <div class="lc-call-banner__inner fade-up">
      <div class="lc-call-banner__text">
        <span class="overline">${preFaq ? 'Antes de irte' : 'Atención directa'}</span>
        <p class="lc-call-banner__title">¿Prefieres hablar con nosotros?</p>
        <p class="lc-call-banner__sub">Te respondemos en horario comercial. Sin compromiso.</p>
      </div>
      <a href="tel:+34603656587" class="btn btn-gold btn-lg nh-call-link" data-nh-call="${preFaq ? 'prefaq' : 'hero'}">Llama ahora · 603 656 587</a>
    </div>
  </div>
</section>`;
}

function relatedBlock(L, ctx) {
  const { barrioSlugs = [], allMap = {} } = ctx || {};
  const manual = L.relacionadas || [];
  const isBarrioSlug = (slug) => allMap[slug]?.cluster === 'barrio';
  const nonBarrio = manual.filter((r) => !isBarrioSlug(r.slug));
  let barrioLinks = manual.filter((r) => isBarrioSlug(r.slug));
  const targetBarrios = L.relacionadas_barrios ?? 2;
  const used = new Set([L.slug, ...manual.map((r) => r.slug)]);
  if (barrioLinks.length < targetBarrios) {
    barrioSlugs.forEach((slug) => {
      if (barrioLinks.length >= targetBarrios) return;
      if (used.has(slug)) return;
      const cfg = allMap[slug];
      if (!cfg) return;
      barrioLinks.push({
        slug,
        label: cfg.footerLabel || ('Vender en ' + (cfg.barrio || slug)),
      });
      used.add(slug);
    });
  }
  const combined = [...nonBarrio, ...barrioLinks].slice(0, 4);
  if (!combined.length) return '';
  const links = combined.map((r) =>
    `<a href="/${r.slug}" class="btn btn-outline" style="margin:.25rem">${r.label} →</a>`
  ).join(' ');
  return `<section class="lc-section" style="background:var(--crema);padding:3rem 0">
  <div class="container text-center fade-up">
    <span class="overline">Relacionado</span>
    <h2 class="section-title" style="margin-bottom:1rem">También te puede interesar</h2>
    <div style="display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center">${links}</div>
  </div>
</section>`;
}

function checklistBlock(title, items, intro) {
  if (!items || !items.length) return '';
  const li = items.map((i) => `<li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>${i}</span></li>`).join('');
  return `<div class="lc-checklist fade-up">
    <h3>${title}</h3>
    ${intro ? `<p class="lc-checklist-intro">${intro}</p>` : ''}
    <ul>${li}</ul>
  </div>`;
}

function marketStatsBlock(L) {
  const m = L.datosMercado;
  if (!m) return '';
  const items = [
    m.precioM2 ? { label: 'Precio orientativo', value: m.precioM2 } : null,
    m.tiempoVenta ? { label: 'Tiempo medio de venta', value: m.tiempoVenta } : null,
    m.tendencia ? { label: 'Tendencia 2026', value: m.tendencia } : null,
  ].filter(Boolean);
  if (!items.length) return '';
  const boxes = items.map((i) => `<div class="lc-stat-box"><div class="lc-stat-label">${i.label}</div><div class="lc-stat-value">${i.value}</div></div>`).join('');
  return `<div class="lc-stats-wrap fade-up"><div class="lc-stats-grid">${boxes}</div><p class="lc-stats-note">Rangos orientativos de mercado 2026 basados en datos públicos del sector. No sustituyen una valoración personalizada de tu vivienda.</p></div>`;
}

function buyerProfileBlock(L) {
  if (!L.perfilComprador && !L.tipologiaEdificios) return '';
  return `<div class="lc-grid-2 lc-buyer-grid fade-up">
    ${L.perfilComprador ? `<div><h3>Perfil de comprador habitual</h3><p>${L.perfilComprador}</p></div>` : ''}
    ${L.tipologiaEdificios ? `<div><h3>Tipología de vivienda</h3><p>${L.tipologiaEdificios}</p></div>` : ''}
  </div>`;
}

function sharedStyles() {
  return `<style>
    .page-breadcrumb{font-size:.8125rem;color:var(--gris-medio);display:flex;align-items:center;flex-wrap:wrap;gap:.35rem;padding:1rem 0 .25rem}
    .page-breadcrumb a{color:var(--gris-medio);transition:color var(--transition)}.page-breadcrumb a:hover{color:var(--negro)}
    .page-breadcrumb span[aria-hidden="true"]{opacity:.45}.page-breadcrumb .bc-current{color:var(--negro);font-weight:500}
    .lc-hero{min-height:68vh;display:flex;align-items:center;position:relative;overflow:hidden}
    .lc-hero-media{position:absolute;inset:0;z-index:0}.lc-hero-media img{width:100%;height:100%;object-fit:cover}
    .lc-hero-overlay{position:absolute;inset:0;background:linear-gradient(to right,rgba(13,13,13,.88) 42%,rgba(13,13,13,.4));z-index:1}
    .lc-hero-content{position:relative;z-index:2;max-width:720px;padding:120px 0 80px}
    .lc-hero-content h1{font-family:var(--font-serif);font-size:clamp(2rem,5vw,3.25rem);color:#fff;line-height:1.12;margin-bottom:1rem}
    .lc-hero-content p{font-size:1.0625rem;color:rgba(255,255,255,.82);line-height:1.75;margin-bottom:1.5rem}
    .lc-badge{display:inline-flex;background:rgba(184,147,106,.18);border:1px solid rgba(184,147,106,.35);color:var(--oro-claro);font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:.45rem .85rem;border-radius:999px;margin-bottom:1rem}
    .lc-section{padding:5rem 0}.lc-prose{max-width:760px}.lc-prose p,.lc-prose li{font-size:1rem;line-height:1.8;color:var(--gris-texto);margin-bottom:1rem}
    .lc-prose h2,.lc-prose h3{font-family:var(--font-serif);color:var(--negro);margin:1.25rem 0 .65rem}
    .lc-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start}
    .lc-form{background:#fff;border-radius:var(--radius-lg);padding:2rem;box-shadow:var(--shadow-md)}
    .lc-form input,.lc-form textarea{width:100%;padding:.85rem 1rem;border:1.5px solid var(--crema-dark);border-radius:var(--radius-sm);font-size:.9375rem;margin-bottom:1rem}
    .lc-legal-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
    .lc-legal-card{background:#fff;border:1px solid var(--crema-dark);border-radius:var(--radius-md);padding:1.35rem}
    .lc-legal-card h3{font-size:1rem;margin:0 0 .5rem;color:var(--negro)}.lc-legal-card p{font-size:.9rem;color:var(--gris-texto);line-height:1.65;margin:0}
    .lc-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
    .lc-step{background:var(--crema);border-radius:var(--radius-md);padding:1.25rem;text-align:center}
    .lc-step-num{font-family:var(--font-serif);font-size:1.75rem;color:var(--oro);font-weight:700}
    .lc-calc{background:#fff;border-radius:var(--radius-lg);padding:2rem;box-shadow:var(--shadow-md);max-width:520px;margin:0 auto}
    .lc-calc input[type=range]{width:100%;margin:1rem 0}.lc-calc-result{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem}
    .lc-calc-box{padding:1rem;border-radius:var(--radius-sm);text-align:center}.lc-calc-box.lose{background:#fef2f2;color:#991b1b}.lc-calc-box.win{background:#f0fdf4;color:#166534}
    .lc-compare{width:100%;border-collapse:collapse;background:#fff;border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm)}
    .lc-compare th,.lc-compare td{padding:.85rem 1rem;text-align:left;border-bottom:1px solid var(--crema-dark);font-size:.875rem;vertical-align:top}
    .lc-compare th{background:var(--negro);color:#fff;font-size:.75rem;text-transform:uppercase}
    .lc-compare .win{background:#f0fdf4;color:#166534;font-weight:600}.lc-compare .lose{background:#fef2f2;color:#991b1b}
    .lc-mito{background:var(--crema);border-radius:var(--radius-md);padding:1.25rem;margin-bottom:1rem}
    .lc-mito strong{display:block;color:var(--negro);margin-bottom:.35rem}
    .lc-kw{font-size:.8125rem;color:var(--gris-medio);line-height:1.7;margin-top:2rem}
    .lc-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
    .lc-card{background:#fff;border-radius:var(--radius-md);padding:1.75rem;box-shadow:var(--shadow-sm);border:1px solid var(--crema-dark);height:100%}
    .lc-card h3{font-size:1.125rem;margin-bottom:.65rem}
    .lc-card p{font-size:.9375rem;color:var(--gris-texto);line-height:1.65;margin:0}
    .lc-pilar-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem}
    .lc-pilar-card{display:block;background:#fff;border:1px solid var(--crema-dark);border-radius:var(--radius-md);padding:1.5rem;text-decoration:none;color:inherit;transition:border-color .2s,box-shadow .2s;height:100%}
    .lc-pilar-card:hover{border-color:var(--oro);box-shadow:var(--shadow-md)}
    .lc-pilar-tag{display:inline-block;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--oro);margin-bottom:.5rem}
    .lc-pilar-card h3{font-family:var(--font-serif);font-size:1.25rem;margin:0 0 .5rem;color:var(--negro)}
    .lc-pilar-card p{font-size:.9rem;color:var(--gris-texto);line-height:1.65;margin:0 0 .75rem}
    .lc-pilar-meta{font-size:.8125rem;color:var(--gris-medio);margin-bottom:.75rem}
    .lc-pilar-link{font-size:.875rem;font-weight:600;color:var(--oro)}
    .lc-stats-wrap{margin-top:2rem}
    .lc-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
    .lc-stat-box{background:#fff;border:1px solid var(--crema-dark);border-radius:var(--radius-md);padding:1.25rem;text-align:center}
    .lc-stat-label{font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;color:var(--gris-medio);margin-bottom:.4rem}
    .lc-stat-value{font-family:var(--font-serif);font-size:1.375rem;color:var(--negro);font-weight:700}
    .lc-stats-note{font-size:.8125rem;color:var(--gris-medio);margin-top:.85rem;text-align:center}
    .lc-buyer-grid h3{font-family:var(--font-serif);color:var(--negro);margin-bottom:.5rem}
    .lc-buyer-grid p{font-size:.9375rem;color:var(--gris-texto);line-height:1.7}
    .lc-checklist{background:var(--crema);border-radius:var(--radius-lg);padding:1.75rem 2rem;margin-top:2rem}
    .lc-checklist h3{font-family:var(--font-serif);color:var(--negro);margin:0 0 .5rem}
    .lc-checklist-intro{font-size:.9375rem;color:var(--gris-texto);margin-bottom:1rem}
    .lc-checklist ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:.65rem 1.5rem}
    .lc-checklist li{display:flex;align-items:flex-start;gap:.5rem;font-size:.9375rem;color:var(--gris-texto);line-height:1.5}
    .lc-checklist li svg{flex-shrink:0;color:var(--oro);margin-top:.15rem}
    @media(max-width:900px){.lc-grid-2,.lc-legal-grid,.lc-steps,.lc-cards,.lc-pilar-grid,.lc-stats-grid,.lc-checklist ul{grid-template-columns:1fr}.lc-hero-overlay{background:rgba(13,13,13,.85)}}
    .nh-sticky-cta{position:fixed;bottom:calc(56px + env(safe-area-inset-bottom,0px));left:0;right:0;z-index:998;padding:.65rem 1rem;background:rgba(255,255,255,.97);backdrop-filter:blur(10px);border-top:1px solid var(--crema-dark);box-shadow:0 -4px 20px rgba(0,0,0,.08);transform:translateY(110%);transition:transform .3s ease;pointer-events:none}
    .nh-sticky-cta.is-visible{transform:translateY(0);pointer-events:auto}
    .nh-sticky-cta__btn{width:100%;justify-content:center}
    @media(min-width:769px){.nh-sticky-cta{display:none!important}}
    @media(max-width:768px){.lc-hero-content{padding:96px 0 48px}.lc-section{padding:3rem 0}.lc-form input,.lc-form textarea{font-size:16px}}
  </style>`;
}

function calcBlock(L) {
  const calc = calcInitial(L.ejemploPrecio || L.calculadora?.precioDefault || 420000);
  const barrio = L.barrio || 'Barcelona';
  const titulo = L.calculadora?.titulo || `¿Cuánto te ahorras en ${barrio}?`;
  const subtitulo = L.calculadora?.subtitulo || 'Mueve el slider y compara comisión tradicional (~6%) vs NuevaHabitat (3.000 € + IVA).';
  return `<section class="lc-section" style="background:var(--crema)" id="calc">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:2rem">
      <span class="overline">Calculadora</span>
      <h2 class="section-title">${titulo}</h2>
      <p style="color:var(--gris-texto)">${subtitulo}</p>
    </div>
    <div class="lc-calc fade-up" data-lc-calc>
      <label for="lc-precio">Precio estimado de venta: <strong id="lc-precio-label">${calc.precioFmt} €</strong></label>
      <input type="range" id="lc-precio" min="150000" max="1200000" step="10000" value="${calc.precio}"/>
      <div class="lc-calc-result">
        <div class="lc-calc-box lose"><div style="font-size:.75rem;text-transform:uppercase">Agencia ~6%</div><div id="lc-trad" style="font-size:1.35rem;font-weight:700">${calc.tradFmt}</div></div>
        <div class="lc-calc-box win"><div style="font-size:.75rem;text-transform:uppercase">NuevaHabitat</div><div style="font-size:1.35rem;font-weight:700">3.630 €</div><div style="font-size:.8rem">Ahorro: <strong id="lc-save">${calc.saveFmt}</strong></div></div>
      </div>
    </div>
  </div>
</section>`;
}

function navSub(L) {
  if (L.municipio) return (L.barrio || L.breadcrumbCurrent) + ' · Área metropolitana';
  if (L.cluster === 'comparativa') return 'Comparativa · Barcelona';
  return (L.breadcrumbCurrent || L.barrio || 'Barcelona') + ' · Barcelona';
}

function formBlock(L) {
  return `<div class="lc-form fade-up" id="valorar">
      <span class="overline">Sin compromiso</span>
      <h2 style="font-size:1.5rem;margin:.35rem 0 1rem">Solicitar valoración gratuita</h2>
      <form id="lcForm" onsubmit="return lcSubmit(event)">
        <input type="text" id="lc-nombre" placeholder="Nombre y apellidos *" required autocomplete="name"/>
        <input type="tel" id="lc-tel" placeholder="Teléfono *" required autocomplete="tel"/>
        <input type="email" id="lc-email" placeholder="Email (opcional)" autocomplete="email"/>
        <input type="text" id="lc-direccion" placeholder="${L.formPlaceholder}"/>
        <textarea id="lc-notas" rows="3" placeholder="Cuéntanos tu situación…"></textarea>
        <button type="submit" id="lc-btn" class="btn btn-gold" style="width:100%;justify-content:center">Solicitar valoración →</button>
      </form>
    </div>`;
}

function faqHtml(faq) {
  return faq.map((item) => `<div class="faq-item">
        <button type="button" class="faq-q">${item.q}</button>
        <div class="faq-a"><div class="faq-a-inner">${item.a}</div></div>
      </div>`).join('');
}

function writeGaConfig() {
  const gaId = (process.env.GA_MEASUREMENT_ID || process.env.NH_GA_ID || '').trim() || 'G-XXXXXXXXXX';
  const contact = CONTACT_EMAIL;
  fs.writeFileSync(
    path.join(ROOT, 'js', 'ga-config.js'),
    '/** Generado por scripts/build-landings.js — ID desde GA_MEASUREMENT_ID en Vercel */\nwindow.NH_GA_ID = ' + JSON.stringify(gaId) + ';\n'
  );
  fs.writeFileSync(
    path.join(ROOT, 'js', 'site-config.js'),
    '/** Generado por scripts/build-landings.js — CONTACT_EMAIL en Vercel */\nwindow.NH_CONTACT_EMAIL = ' + JSON.stringify(contact) + ';\n'
  );
}

function footerAndScripts(L) {
  return `<footer>
  <div class="container">
    <div class="footer-top" style="grid-template-columns:1.5fr 2.5fr 1fr">
      <div class="footer-brand"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><p>Inmobiliaria tecnológica en Barcelona. Precio fijo 3.000€ + IVA, cobro solo en escritura.</p></div>
      <div class="footer-col footer-col--servicios"><h4>Servicios</h4><div data-nh-landing-footer${L.footerExtra ? ` data-nh-footer-extra="${L.footerExtra}"` : ''}></div></div>
      <div class="footer-col"><h4>Contacto</h4><ul><li><a href="tel:+34603656587">603 656 587</a></li><li><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></li></ul></div>
    </div>
    <div class="footer-bottom"><p>© 2026 NuevaHabitat.</p><div class="footer-bottom-links"><a href="privacidad.html">Privacidad</a><a href="aviso-legal.html">Aviso legal</a></div></div>
  </div>
</footer>
<div class="whatsapp-float"><a href="https://wa.me/34603656587?text=${L.whatsappText}" class="whatsapp-btn" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a></div>
<nav class="mbn" id="mbn">
  <a href="index.html" class="mbn-tab" data-tab="inicio" aria-label="Inicio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span>Inicio</span></a>
  <a href="inmuebles.html" class="mbn-tab" data-tab="inmuebles" aria-label="Inmuebles"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35"/></svg><span>Inmuebles</span></a>
  <a href="vender.html" class="mbn-tab active" data-tab="vender" aria-label="Vender"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg><span>Vender</span></a>
  <a href="comprar.html" class="mbn-tab" data-tab="comprar" aria-label="Comprar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg><span>Comprar</span></a>
  <a href="login.html" class="mbn-tab" data-tab="cuenta" aria-label="Mi cuenta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span>Cuenta</span></a>
</nav>
<div id="cookie-banner">
  <div class="cookie-banner-inner">
    <button type="button" class="cookie-btn-close" id="cookie-close" aria-label="Cerrar y usar solo cookies necesarias">&times;</button>
    <p>Usamos cookies propias y de terceros para mejorar tu experiencia. Puedes aceptar todas o solo las necesarias. <a href="cookies.html">Más información</a>.</p>
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
<script src="js/landing-tools.js"></script>
<script src="js/main.js" defer></script>
<script defer src="js/supabase.js"></script>
<script defer src="js/notify.js"></script>
<script defer src="js/leads.js"></script>
<script>
async function lcSubmit(e){
  e.preventDefault();
  const btn = document.getElementById('lc-btn');
  btn.disabled = true; btn.textContent = 'Enviando…';
  const ok = await nhSubmitLead({
    nombre: document.getElementById('lc-nombre').value,
    telefono: document.getElementById('lc-tel').value,
    email: document.getElementById('lc-email').value,
    mensaje: [document.getElementById('lc-direccion').value, document.getElementById('lc-notas').value].filter(Boolean).join(' · '),
    tipo: 'venta',
    origen: '${L.origen_lead}',
    extra: { landing: '${L.slug}', cluster: '${L.cluster}' }
  });
  btn.disabled = false; btn.textContent = 'Solicitar valoración →';
  if(ok){
    const q = new URLSearchParams({ origen: '${L.origen_lead}', landing: '${L.slug}', cluster: '${L.cluster}' });
    window.location.href = '/gracias?' + q.toString();
  }
  return false;
}
</script>`;
}

function renderSituacion(L, ctx) {
  const legal = L.bloque_legal_fiscal.items.map((i) =>
    `<div class="lc-legal-card fade-up"><h3>${i.title}</h3><p>${i.body}</p></div>`
  ).join('');
  const steps = L.como_ayudamos.steps.map((s, i) =>
    `<div class="lc-step fade-up${i ? ' fade-up-delay-' + i : ''}"><div class="lc-step-num">${i + 1}</div><h4 style="margin:.4rem 0">${s.title}</h4><p style="font-size:.875rem;color:var(--gris-texto)">${s.body}</p></div>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${L.meta.title}</title>
  <meta name="description" content="${L.meta.description}"/>
  <meta name="keywords" content="${L.meta.keywords}"/>
  <meta name="robots" content="${robotsMeta(L)}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="${SITE}/${L.slug}"/>
  <meta property="og:title" content="${L.meta.title}"/>
  <meta property="og:description" content="${L.meta.description}"/>
  <meta property="og:image" content="${SITE}/${L.hero.image}"/>
  <link rel="canonical" href="${SITE}/${L.slug}"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${buildJsonLd(L)}</script>
  ${sharedStyles()}
</head>
<body data-nh-cluster="situacion" data-nh-landing-slug="${L.slug}">
${navBar(L)}
<div class="container"><nav class="page-breadcrumb" aria-label="Breadcrumb"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/vender">Vender</a><span aria-hidden="true">/</span><span class="bc-current">${L.breadcrumbCurrent}</span></nav></div>
<section class="lc-hero">
  <div class="lc-hero-media"><img src="${L.hero.image}" alt="${L.hero.imageAlt}" fetchpriority="high"/></div>
  <div class="lc-hero-overlay"></div>
  <div class="container"><div class="lc-hero-content fade-up">
    <span class="lc-badge">${L.hero.badge}</span>
    <h1>${L.hero.h1}</h1>
    <p>${L.hero.lead}</p>
    <a href="#valorar" class="btn btn-gold btn-lg">Valoración gratuita</a>
  </div></div>
</section>
${callBanner()}
<section class="lc-section" style="background:var(--crema)">
  <div class="container lc-grid-2">
    <div class="lc-prose fade-up">${L.argumento_principal}</div>
    ${formBlock(L)}
  </div>
</section>
<section class="lc-section" style="background:var(--blanco)">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:2rem"><span class="overline">Marco legal</span><h2 class="section-title">${L.bloque_legal_fiscal.title}</h2></div>
    <div class="lc-legal-grid fade-up">${legal}</div>
    ${checklistBlock(L.checklist?.title || `Checklist antes de ${L.checklistLabel || 'vender'}`, L.checklist?.items, L.checklist?.intro)}
  </div>
</section>
<section class="lc-section" style="background:var(--negro);color:#fff">
  <div class="container">
    <div class="text-center" style="margin-bottom:2rem"><span class="overline" style="color:var(--oro)">Proceso</span><h2 class="section-title light">${L.como_ayudamos.title}</h2></div>
    <div class="lc-steps">${steps}</div>
  </div>
</section>
${relatedBlock(L, ctx)}
${callBanner('prefaq')}
<section class="lc-section" style="background:var(--blanco)">
  <div class="container" style="max-width:800px">
    <div class="text-center" style="margin-bottom:2rem"><span class="overline">FAQ</span><h2 class="section-title">Preguntas frecuentes</h2></div>
    <div class="faq-list fade-up">${faqHtml(L.faq)}</div>
    <div class="lc-kw"><strong>Búsquedas relacionadas:</strong> ${L.keywords_footer}</div>
  </div>
</section>
<section style="padding:4rem 0;background:var(--negro);text-align:center"><div class="container"><h2 class="section-title light" style="margin-bottom:1rem">¿Hablamos de tu caso?</h2><a href="#valorar" class="btn btn-gold btn-lg">Pedir valoración</a></div></section>
${footerAndScripts(L)}
</body></html>`;
}

function renderIntencion(L, ctx) {
  const rows = L.comparativa_modelos.rows.map((r) =>
    `<tr><td><strong>${r.modelo}</strong></td><td>${r.tiempo}</td><td>${r.coste}</td><td class="${r.tipo === 'win' ? 'win' : r.tipo === 'lose' ? 'lose' : ''}">${r.riesgo}</td></tr>`
  ).join('');
  const mitos = L.mitos.items.map((m) =>
    `<div class="lc-mito fade-up"><strong>Mito: ${m.mito}</strong><span>Realidad: ${m.realidad}</span></div>`
  ).join('');
  const calc = calcInitial(L.calculadora.precioDefault);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${L.meta.title}</title>
  <meta name="description" content="${L.meta.description}"/>
  <meta name="keywords" content="${L.meta.keywords}"/>
  <meta name="robots" content="${robotsMeta(L)}"/>
  <meta property="og:url" content="${SITE}/${L.slug}"/>
  <meta property="og:title" content="${L.meta.title}"/>
  <meta property="og:description" content="${L.meta.description}"/>
  <meta property="og:image" content="${SITE}/${L.hero.image}"/>
  <link rel="canonical" href="${SITE}/${L.slug}"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${buildJsonLd(L)}</script>
  ${sharedStyles()}
</head>
<body data-nh-cluster="${L.cluster}" data-nh-landing-slug="${L.slug}" data-nh-precio-default="${calc.precio}">
${navBar(L)}
<div class="container"><nav class="page-breadcrumb fade-up" aria-label="Breadcrumb"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/vender">Vender</a><span aria-hidden="true">/</span><span class="bc-current">${L.breadcrumbCurrent || L.footerLabel || L.slug}</span></nav></div>
<section class="lc-hero" style="min-height:58vh">
  <div class="lc-hero-media"><img src="${L.hero.image}" alt="${L.hero.imageAlt}"/></div>
  <div class="lc-hero-overlay"></div>
  <div class="container"><div class="lc-hero-content fade-up">
    <span class="lc-badge">${L.hero.badge}</span>
    <h1>${L.hero.h1}</h1>
    <p>${L.hero.lead}</p>
    <a href="#calc" class="btn btn-gold btn-lg">Ver calculadora de ahorro</a>
  </div></div>
</section>
${callBanner()}
<section class="lc-section" style="background:var(--blanco)" id="calc">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:2rem"><span class="overline">Calculadora</span><h2 class="section-title">${L.calculadora.titulo}</h2><p style="color:var(--gris-texto)">${L.calculadora.subtitulo}</p></div>
    <div class="lc-calc fade-up" data-lc-calc>
      <label for="lc-precio">Precio estimado de venta: <strong id="lc-precio-label">${calc.precioFmt} €</strong></label>
      <input type="range" id="lc-precio" min="150000" max="1200000" step="10000" value="${calc.precio}"/>
      <div class="lc-calc-result">
        <div class="lc-calc-box lose"><div style="font-size:.75rem;text-transform:uppercase">Agencia ~6%</div><div id="lc-trad" style="font-size:1.35rem;font-weight:700">${calc.tradFmt}</div></div>
        <div class="lc-calc-box win"><div style="font-size:.75rem;text-transform:uppercase">NuevaHabitat</div><div style="font-size:1.35rem;font-weight:700">3.630 €</div><div style="font-size:.8rem">Ahorro: <strong id="lc-save">${calc.saveFmt}</strong></div></div>
      </div>
    </div>
  </div>
</section>
<section class="lc-section" style="background:var(--crema)">
  <div class="container lc-prose fade-up">${L.argumento_principal}</div>
</section>
<section class="lc-section" style="background:var(--blanco)">
  <div class="container">
    <div class="text-center" style="margin-bottom:2rem"><h2 class="section-title">${L.comparativa_modelos.title}</h2></div>
    <div style="overflow-x:auto"><table class="lc-compare fade-up"><thead><tr><th>Modelo</th><th>Tiempo típico</th><th>Coste</th><th>Riesgo</th></tr></thead><tbody>${rows}</tbody></table></div>
  </div>
</section>
<section class="lc-section" style="background:var(--crema)">
  <div class="container" style="max-width:760px"><h2 class="section-title" style="margin-bottom:1.5rem">${L.mitos.title}</h2>${mitos}
  ${checklistBlock(L.checklist?.title, L.checklist?.items, L.checklist?.intro)}
  </div>
</section>
<section class="lc-section" style="background:var(--blanco)">
  <div class="container lc-grid-2">${formBlock(L)}<div class="lc-prose fade-up"><h2 class="section-title">Valoración gratuita en 24h</h2><p>${L.form_side_text || 'Cuéntanos si vendes como particular o si quieres salir de una exclusiva. Te proponemos un plan realista — sin comisión del 6% ni permanencias abusivas.'}</p></div></div>
</section>
${relatedBlock(L, ctx)}
${callBanner('prefaq')}
<section class="lc-section" style="background:var(--crema)">
  <div class="container" style="max-width:800px"><div class="faq-list fade-up">${faqHtml(L.faq)}</div><div class="lc-kw">${L.keywords_footer}</div></div>
</section>
${footerAndScripts(L)}
</body></html>`;
}

function renderLanding(L, ctx) {
  const rb = () => relatedBlock(L, ctx);
  const deps = { SITE, sharedStyles, faqHtml, formBlock, footerAndScripts, relatedBlock: rb, buildJsonLd, calcBlock, navBar, callBanner, checklistBlock, marketStatsBlock, buyerProfileBlock };
  if (L.pilar) return renderPilar(L, deps);
  if (L.cluster === 'barrio') return renderBarrio(L, deps);
  if (L.cluster === 'situacion') return renderSituacion(L, ctx);
  if (L.cluster === 'intencion' || L.cluster === 'comparativa') return renderIntencion(L, ctx);
  throw new Error(`Cluster no soportado en build: ${L.cluster} (${L.slug})`);
}

function writeLandingsJs(allMap, order) {
  const lines = [
    '/** Generado por scripts/build-landings.js — no editar a mano */',
    'window.NH_LANDING_ORDER = ' + JSON.stringify(order, null, 2) + ';',
    'window.NH_LANDING_CLUSTERS = {',
    "  barrio: { label: 'Por barrio', slugs: [] },",
    "  situacion: { label: 'Por situación', slugs: [] },",
    "  intencion: { label: 'Guías vendedor', slugs: [] },",
    "  comparativa: { label: 'Comparativas', slugs: [] },",
    '};',
    'window.NH_LANDINGS = ' + JSON.stringify(allMap, null, 2) + ';',
    'Object.keys(window.NH_LANDINGS).forEach(function(slug){',
    '  var c = window.NH_LANDINGS[slug].cluster;',
    '  if (c && window.NH_LANDING_CLUSTERS[c]) window.NH_LANDING_CLUSTERS[c].slugs.push(slug);',
    '});',
    'window.NH_LANDING_SLUGS = window.NH_LANDING_ORDER.slice();',
    '',
  ];
  fs.writeFileSync(path.join(ROOT, 'js', 'landings.js'), lines.join('\n'));
}

function main() {
  const generated = loadJsonFiles(path.join(CONTENT_DIR, 'barrio'))
    .concat(loadJsonFiles(path.join(CONTENT_DIR, 'situacion')))
    .concat(loadJsonFiles(path.join(CONTENT_DIR, 'intencion')))
    .concat(loadJsonFiles(path.join(CONTENT_DIR, 'comparativa')));

  const errors = validateLandings(generated);
  if (errors.length) {
    console.error('validate-landings FAILED:\n' + errors.map((e) => '  - ' + e).join('\n'));
    process.exit(1);
  }

  const barrioSlugs = generated
    .filter((L) => L.cluster === 'barrio')
    .sort((a, b) => {
      if (a.pilar && !b.pilar) return -1;
      if (b.pilar && !a.pilar) return 1;
      return (b.priority || 0) - (a.priority || 0);
    })
    .map((L) => L.slug);

  const allMap = {};
  generated.forEach((L) => {
    if (L.cluster === 'barrio') {
      allMap[L.slug] = {
        slug: L.slug,
        cluster: 'barrio',
        barrio: L.barrio,
        footerLabel: L.footerLabel,
        zonas: L.zonas,
        priority: L.priority,
        indexable: L.indexable !== false,
        testimonials: L.testimonials === false ? false : true,
      };
      return;
    }
    allMap[L.slug] = {
      slug: L.slug,
      cluster: L.cluster,
      footerLabel: L.footerLabel,
      priority: L.priority,
      indexable: L.indexable !== false,
      keyword_principal: L.keyword_principal,
      badge: L.hero && L.hero.badge,
      testimonials: false,
    };
  });

  const ctx = { barrioSlugs, allMap };

  generated.forEach((L) => {
    const html = renderLanding(L, ctx);
    const out = path.join(ROOT, L.slug + '.html');
    fs.writeFileSync(out, html, 'utf8');
    console.log('Built', L.slug + '.html');
  });

  const otherLandings = generated.filter((L) => L.cluster !== 'barrio').map((L) => L.slug);
  const order = [...barrioSlugs, ...otherLandings];

  writeLandingsJs(allMap, order);

  const index = {
    updated: new Date().toISOString(),
    landings: order.map((slug) => ({
      slug,
      cluster: allMap[slug].cluster,
      indexable: allMap[slug].indexable !== false,
      priority: allMap[slug].priority || 0.85,
    })),
  };
  fs.writeFileSync(path.join(ROOT, 'content', 'landings-index.json'), JSON.stringify(index, null, 2));
  writeGaConfig();
  console.log('Updated js/landings.js and content/landings-index.json');
}

main();
