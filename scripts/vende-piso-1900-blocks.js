/**
 * Bloques únicos · landings «vende tu piso por ~1.900 €» (distintas de venta-digital-{ciudad}).
 */
const { esc } = require('./venta-planes-shared');
const { FEE_BASE } = require('./venta-digital-ciudades-data');
const { tradCommission6, tradCommission3 } = require('./venta-digital-ciudades-data');

const JOURNEY_STEPS = [
  {
    title: 'Contratas el plan digital',
    img: 'imagenes/alquiler-proceso-02-contrato-presupuesto.jpg',
    nh: 'Te enviamos presupuesto cerrado (1.999 € + IVA), contrato y enlace de pago Stripe del primer 50 %.',
    tu: 'Eliges plan, revisas condiciones y abonas la mitad para activar el expediente.',
  },
  {
    title: 'Firma y alta en panel vendedor',
    img: 'imagenes/alquiler-proceso-01-llamada-gestor.jpg',
    nh: 'Contrato con firma electrónica (FIRMACERT), creación de usuario y asignación de gestor.',
    tu: 'Firmas online y subes datos básicos del inmueble y tu disponibilidad para visitas.',
  },
  {
    title: 'Documentación del inmueble',
    img: 'imagenes/alquiler-proceso-03-expediente-documentacion.jpg',
    nh: 'Solicitamos nota simple, certificado energético, estatutos/comunidad y checklist legal.',
    tu: 'Facilitas copias o autorizaciones; firmas lo que pida la comunidad o notaría.',
  },
  {
    title: 'Valoración y precio de salida',
    img: 'imagenes/equipo1.jpg',
    nh: 'Análisis de comparables cerrados en tu barrio, estrategia de precio y calendario de difusión.',
    tu: 'Validas el rango propuesto o ajustamos con tu margen mínimo acordado.',
  },
  {
    title: 'Reportaje foto y vídeo',
    img: 'imagenes/pexels-fotografiagmazg-10050066.jpg',
    nh: 'Sesión profesional, plano, copy del anuncio y ficha optimizada para portales.',
    tu: 'Preparas el piso (orden, luz) y das acceso en la fecha acordada.',
  },
  {
    title: 'Publicación Idealista y pisos.com',
    img: 'imagenes/comercial1.jpg',
    nh: 'Publicamos en ambos portales y cruzamos con compradores de cartera compatibles.',
    tu: 'Sigues el estado en panel (visitas, mensajes, estadísticas).',
  },
  {
    title: 'Visitas cualificadas en casa',
    img: 'imagenes/agente inmobiliario1.jpg',
    nh: 'Filtramos hipoteca/liquidez, agendamos en tus franjas y registramos cada visita.',
    tu: 'Recibes al comprador en el piso en el horario que marcaste en el panel.',
  },
  {
    title: 'Oferta, arras y escritura',
    img: 'imagenes/alquiler-proceso-04-panel-propietario.jpg',
    nh: 'Negociación, contrato de arras, coordinación con banco del comprador y notaría.',
    tu: 'Firmas arras y escritura; segundo 50 % de honorarios al cierre de la venta.',
  },
];

/** Todas las acciones del servicio venta 100 % digital */
const ALL_ACTIONS = [
  { action: 'Presupuesto y condiciones del plan digital', who: 'NH' },
  { action: 'Cobro 50 % inicial (Stripe) y factura', who: 'NH' },
  { action: 'Firma contrato de intermediación', who: 'Mixto' },
  { action: 'Alta expediente y panel vendedor', who: 'NH' },
  { action: 'Solicitud nota simple y registral', who: 'NH' },
  { action: 'Certificado energético (gestión o coordinación)', who: 'NH' },
  { action: 'Revisión comunidad, ITE u otra doc. si aplica', who: 'Mixto' },
  { action: 'Valoración comparables micro-zona', who: 'NH' },
  { action: 'Definir precio de salida y estrategia', who: 'Mixto' },
  { action: 'Coordinar reportaje fotográfico y vídeo', who: 'NH' },
  { action: 'Redactar y publicar anuncio', who: 'NH' },
  { action: 'Publicar Idealista y pisos.com', who: 'NH' },
  { action: 'Difundir a cartera compradores', who: 'NH' },
  { action: 'Responder y filtrar leads', who: 'NH' },
  { action: 'Verificar solvencia (hipoteca / liquidez)', who: 'NH' },
  { action: 'Agendar visitas en franjas del propietario', who: 'NH' },
  { action: 'Recibir comprador en el inmueble', who: 'Tú' },
  { action: 'Registrar feedback post-visita', who: 'NH' },
  { action: 'Presentar y negociar ofertas', who: 'NH' },
  { action: 'Redactar contrato de arras', who: 'NH' },
  { action: 'Firma arras (FIRMACERT si aplica)', who: 'Mixto' },
  { action: 'Seguimiento hipoteca comprador', who: 'NH' },
  { action: 'Coordinación pre-escritura y notaría', who: 'NH' },
  { action: 'Escritura pública de compraventa', who: 'Mixto' },
  { action: 'Cobro 50 % final de honorarios', who: 'NH' },
];

function nhVp1900Styles() {
  return `
.nh-vp1900-hero{display:grid;grid-template-columns:1.05fr .95fr;gap:2.5rem;align-items:center;padding:4.5rem 0 3rem}
.nh-vp1900-hero-media{border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-lg);aspect-ratio:4/3}
.nh-vp1900-hero-media img{width:100%;height:100%;object-fit:cover;display:block}
.nh-vp1900-savings{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2rem}
.nh-vp1900-sav-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:var(--radius-md);padding:1.25rem;text-align:center}
.nh-vp1900-sav-card strong{display:block;font-family:var(--font-serif);font-size:1.35rem;color:var(--oro-claro)}
.nh-vp1900-sav-card.is-win{border-color:var(--oro);background:rgba(184,147,106,.12)}
.nh-vp1900-sav-card.is-win strong{color:#fff;font-size:1.5rem}
.nh-vp1900-timeline{display:grid;gap:2rem;max-width:900px;margin:0 auto}
.nh-vp1900-step{display:grid;grid-template-columns:1fr 1.1fr;gap:1.75rem;align-items:center;padding:1.25rem 0;border-bottom:1px solid var(--crema-dark)}
.nh-vp1900-step:nth-child(even){direction:rtl}
.nh-vp1900-step:nth-child(even) > *{direction:ltr}
.nh-vp1900-step img{width:100%;border-radius:var(--radius-md);object-fit:cover;aspect-ratio:16/10;box-shadow:var(--shadow-md)}
.nh-vp1900-step-num{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--oro-oscuro)}
.nh-vp1900-step h3{margin:.35rem 0 .75rem;font-size:1.2rem}
.nh-vp1900-dual{display:grid;gap:.65rem;font-size:.875rem;line-height:1.55;color:var(--gris-texto)}
.nh-vp1900-dual span{display:block;padding:.5rem .75rem;background:var(--crema);border-radius:8px;border-left:3px solid var(--oro)}
.nh-vp1900-actions-wrap{overflow-x:auto}
.nh-vp1900-actions{width:100%;border-collapse:collapse;font-size:.875rem}
.nh-vp1900-actions th,.nh-vp1900-actions td{padding:.65rem .85rem;text-align:left;border-bottom:1px solid var(--crema-dark)}
.nh-vp1900-actions th{background:var(--negro);color:#fff;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em}
.nh-vp1900-who{display:inline-block;font-size:.65rem;font-weight:700;text-transform:uppercase;padding:.2rem .5rem;border-radius:999px}
.nh-vp1900-who--nh{background:rgba(59,130,246,.15);color:#1d4ed8}
.nh-vp1900-who--tu{background:rgba(249,115,22,.15);color:#c2410c}
.nh-vp1900-who--mix{background:rgba(34,197,94,.15);color:#15803d}
.nh-vp1900-cities{display:flex;flex-wrap:wrap;gap:.65rem;justify-content:center;margin-top:1.25rem}
.nh-vp1900-cities a{display:inline-flex;flex-direction:column;padding:.65rem 1rem;background:#fff;border:1px solid var(--crema-dark);border-radius:var(--radius-md);font-size:.8125rem;text-decoration:none;color:inherit;min-width:140px}
.nh-vp1900-cities a.is-current{border-color:var(--oro);box-shadow:0 0 0 1px var(--oro)}
.nh-vp1900-cities a strong{color:var(--negro)}
.nh-vp1900-pilars{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.nh-vp1900-pilar{background:#fff;border:1px solid var(--crema-dark);border-radius:var(--radius-md);overflow:hidden}
.nh-vp1900-pilar img{width:100%;height:140px;object-fit:cover;display:block}
.nh-vp1900-pilar div{padding:1rem;font-size:.8125rem;line-height:1.55;color:var(--gris-texto)}
.nh-vp1900-pilar strong{display:block;color:var(--negro);margin-bottom:.35rem}
.nh-vp1900-compact{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem}
.nh-vp1900-compact-card{background:var(--crema);border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--crema-dark)}
.nh-vp1900-compact-card img{width:100%;height:160px;object-fit:cover}
.nh-vp1900-compact-card div{padding:1rem}
.nh-vp1900-split{display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start}
.nh-vp1900-split-col{background:#fff;border-radius:var(--radius-lg);padding:1.5rem;border:1px solid var(--crema-dark)}
.nh-vp1900-split-col img{width:100%;border-radius:var(--radius-md);margin-bottom:1rem;aspect-ratio:16/10;object-fit:cover}
.nh-vp1900-myths{display:grid;gap:.75rem;max-width:720px;margin:0 auto}
.nh-vp1900-myth{border-left:4px solid var(--oro);padding:.85rem 1rem;background:#fff;border-radius:0 var(--radius-md) var(--radius-md) 0;border:1px solid var(--crema-dark);border-left:4px solid #c2410c}
.nh-vp1900-myth strong{color:var(--negro)}
.nh-vp1900-zones{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin:1.25rem 0}
.nh-vp1900-zone-tag{padding:.45rem .85rem;background:var(--negro);color:#fff;border-radius:999px;font-size:.8125rem}
.nh-vp1900-text-steps{counter-reset:vpstep;max-width:680px;margin:0 auto;padding:0;list-style:none}
.nh-vp1900-text-steps li{counter-increment:vpstep;padding:.75rem 0 .75rem 3rem;position:relative;border-bottom:1px solid var(--crema-dark);line-height:1.55;color:var(--gris-texto)}
.nh-vp1900-text-steps li::before{content:counter(vpstep);position:absolute;left:0;top:.7rem;width:2rem;height:2rem;border-radius:50%;background:var(--oro);color:var(--negro);font-weight:700;font-size:.85rem;display:grid;place-items:center}
.nh-vp1900-hero--centered .nh-vp1900-hero-media{display:none}
.nh-vp1900-hero--centered{grid-template-columns:1fr;max-width:820px;margin:0 auto;text-align:center}
.nh-vp1900-hero--centered .nh-svc-hero-actions{justify-content:center}
@media(max-width:900px){
  .nh-vp1900-hero{grid-template-columns:1fr;padding-top:3rem}
  .nh-vp1900-savings{grid-template-columns:1fr}
  .nh-vp1900-step,.nh-vp1900-step:nth-child(even){grid-template-columns:1fr;direction:ltr}
  .nh-vp1900-pilars,.nh-vp1900-compact,.nh-vp1900-split{grid-template-columns:1fr}
}
`;
}

function whoBadge(who) {
  const map = { NH: 'nh', Tú: 'tu', Mixto: 'mix' };
  const label = who === 'NH' ? 'NuevaHabitat' : who;
  return `<span class="nh-vp1900-who nh-vp1900-who--${map[who] || 'mix'}">${esc(label)}</span>`;
}

function savingsStrip(c) {
  const ex = c.priceExample || 280000;
  const t6 = tradCommission6(ex);
  const t3 = tradCommission3(ex);
  const exFmt = ex.toLocaleString('es-ES');
  return `<div class="nh-vp1900-savings fade-up">
    <div class="nh-vp1900-sav-card"><span style="font-size:.75rem;color:rgba(255,255,255,.6)">Agencia ~6 % + IVA</span><strong>~${t6.toLocaleString('es-ES')} €</strong><span style="font-size:.72rem;color:rgba(255,255,255,.55)">sobre ${exFmt} €</span></div>
    <div class="nh-vp1900-sav-card"><span style="font-size:.75rem;color:rgba(255,255,255,.6)">Agencia ~3 % + IVA</span><strong>~${t3.toLocaleString('es-ES')} €</strong><span style="font-size:.72rem;color:rgba(255,255,255,.55)">sobre ${exFmt} €</span></div>
    <div class="nh-vp1900-sav-card is-win"><span style="font-size:.75rem;color:rgba(255,255,255,.75)">Plan digital NuevaHabitat</span><strong>${FEE_BASE} € + IVA</strong><span style="font-size:.72rem;color:rgba(255,255,255,.7)">fijo · 50 % + 50 %</span></div>
  </div>`;
}

function illustratedJourneyBlock(c, opts = {}) {
  const city = esc(c.cityLabel || c.cityName);
  const pool = opts.stepIndexes
    ? opts.stepIndexes.map((i) => JOURNEY_STEPS[i]).filter(Boolean)
    : JOURNEY_STEPS;
  const title =
    opts.title ||
    `8 pasos ilustrados: de contratar a escritura${city !== 'España' ? ` en ${city}` : ''}`;
  const intro =
    opts.intro ||
    'Esta landing no es un folleto genérico: es la <strong>misma operativa</strong> que el plan venta digital, explicada acción por acción con fotos reales del proceso NuevaHabitat (panel, gestores, portales y cierre).';
  const steps = pool.map((s, i) => {
    const tu = s.tu.replace('en el piso', `en ${city === 'España' ? 'tu ciudad' : city}`);
    return `<article class="nh-vp1900-step fade-up">
      <div>
        <div class="nh-vp1900-step-num">Paso ${i + 1} de ${pool.length}</div>
        <h3>${esc(s.title)}</h3>
        <div class="nh-vp1900-dual">
          <span><strong style="color:var(--negro)">NuevaHabitat:</strong> ${s.nh}</span>
          <span><strong style="color:var(--negro)">Tú:</strong> ${tu}</span>
        </div>
      </div>
      <img src="${s.img}" alt="${esc(s.title)} — venta digital NuevaHabitat" loading="lazy" width="640" height="400"/>
    </article>`;
  }).join('');

  return `<section class="lc-section" style="background:var(--blanco)" id="pasos-ilustrados">
  <div class="container">
    <div class="text-center fade-up" style="max-width:720px;margin:0 auto 2.5rem">
      <span class="overline">Recorrido visual</span>
      <h2 class="section-title">${title}</h2>
      <p style="color:var(--gris-texto);line-height:1.75">${intro}</p>
    </div>
    <div class="nh-vp1900-timeline">${steps}</div>
  </div>
</section>`;
}

function allActionsBlock(c) {
  const rows = ALL_ACTIONS.map(
    (a) =>
      `<tr><td>${esc(a.action)}</td><td>${whoBadge(a.who)}</td></tr>`
  ).join('');
  const city = esc(c.cityLabel || c.cityName);
  return `<section class="lc-section" style="background:var(--crema)" id="todas-las-acciones">
  <div class="container fade-up">
    <div class="text-center" style="max-width:760px;margin:0 auto 1.5rem">
      <span class="overline">Checklist completo</span>
      <h2 class="section-title">Todas las acciones del servicio${city !== 'España' ? ` (${city})` : ''}</h2>
      <p style="color:var(--gris-texto);line-height:1.7;margin-top:.75rem"><strong>${ALL_ACTIONS.length} acciones</strong> entre contratación y escritura. La columna «Quién» marca si las ejecuta NuevaHabitat, tú o ambos. Mismo alcance en Barcelona, Madrid, Valencia y el resto de ciudades digital.</p>
    </div>
    <div class="nh-vp1900-actions-wrap adm-table-wrap" style="max-width:880px;margin:0 auto;background:#fff;border-radius:var(--radius-md);border:1px solid var(--crema-dark)">
      <table class="nh-vp1900-actions">
        <thead><tr><th>Acción</th><th>Quién</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="text-center" style="margin-top:1.25rem;font-size:.875rem;color:var(--gris-texto)">¿Quieres la ficha técnica por ciudad? <a href="/${esc(c.ventaDigitalSlug || 'venta-digital')}">Venta digital${city !== 'España' ? ` · ${city}` : ''}</a></p>
  </div>
</section>`;
}

function citySwitcherBlock(currentSlug, landings) {
  const links = landings
    .map((L) => {
      const cur = L.slug === currentSlug ? ' is-current' : '';
      const label = L.switcherLabel || L.cityName;
      return `<a href="/${esc(L.slug)}" class="${cur.trim()}"><strong>${esc(label)}</strong><span>Guía ~1.900 €</span></a>`;
    })
    .join('');
  return `<div class="nh-vp1900-cities">${links}</div>`;
}

function mythsRealityBlock(c) {
  const city = esc(c.cityLabel || c.cityName);
  const myths = c.myths || [
    { myth: '«1.900 €» es solo publicar en Idealista', fact: 'Es el plan digital completo: valoración, foto, filtro, negociación y escritura (1.999 € + IVA en contrato).' },
    { myth: 'Sin comisión = sin agencia', fact: 'Hay intermediación profesional; el ahorro está en no pagar 3–6 % sobre el precio de venta.' },
    { myth: 'Las visitas las hace cualquiera', fact: `Solo entran compradores con solvencia revisada; tú abres en ${city === 'España' ? 'tu ciudad' : city} en tus franjas.` },
  ];
  const rows = myths
    .map(
      (m) =>
        `<div class="nh-vp1900-myth"><strong>Mito:</strong> ${m.myth}<br/><strong style="color:#15803d">Realidad:</strong> ${m.fact}</div>`
    )
    .join('');
  return `<section class="lc-section" style="background:var(--blanco)">
  <div class="container fade-up">
    <div class="text-center" style="max-width:640px;margin:0 auto 1.5rem">
      <span class="overline">Antes de contratar</span>
      <h2 class="section-title">Lo que muchos confunden al buscar «vender por 1.900 €»</h2>
    </div>
    <div class="nh-vp1900-myths">${rows}</div>
  </div>
</section>`;
}

function pillarsPhotoBlock(c) {
  const city = esc(c.cityLabel || c.cityName);
  const items = c.pillars || [
    { img: 'imagenes/equipo1.jpg', t: 'Precio cerrado', p: `1.999 € + IVA en ${city}; sin % sobre el precio de venta.` },
    { img: 'imagenes/comercial1.jpg', t: 'Portales + cartera', p: 'Idealista, pisos.com y demanda filtrada.' },
    { img: 'imagenes/agente inmobiliario1.jpg', t: 'Visitas tuyas', p: 'Solo compradores preparados en tu calendario.' },
    { img: 'imagenes/firma1.jpg', t: 'Hasta escritura', p: 'Arras, panel y coordinación notarial.' },
  ];
  const cards = items
    .map(
      (it) =>
        `<article class="nh-vp1900-pilar"><img src="${it.img}" alt="${esc(it.t)}" loading="lazy"/><div><strong>${esc(it.t)}</strong><p style="margin:0">${it.p}</p></div></article>`
    )
    .join('');
  return `<section class="lc-section" style="background:var(--crema)">
  <div class="container fade-up">
    <div class="text-center" style="max-width:720px;margin:0 auto 1.25rem">
      <span class="overline">En 4 fotos</span>
      <h2 class="section-title">Qué compras cuando no quieres pagar comisión del 6 %</h2>
    </div>
    <div class="nh-vp1900-pilars">${cards}</div>
  </div>
</section>`;
}

function compactJourneyBlock(c) {
  const city = esc(c.cityLabel || c.cityName);
  const idx = c.compactStepIndexes || [0, 3, 5, 7];
  const cards = idx
    .map((i) => JOURNEY_STEPS[i])
    .filter(Boolean)
    .map(
      (s, n) =>
        `<article class="nh-vp1900-compact-card fade-up"><img src="${s.img}" alt="${esc(s.title)}" loading="lazy"/><div><strong>Paso ${n + 1} · ${esc(s.title)}</strong><p style="margin:.5rem 0 0;font-size:.8125rem;color:var(--gris-texto)">${esc(s.nh)}</p></div></article>`
    )
    .join('');
  return `<section class="lc-section" style="background:var(--blanco)" id="pasos-ilustrados">
  <div class="container fade-up">
    <div class="text-center" style="max-width:720px;margin:0 auto 1.5rem">
      <span class="overline">Resumen visual</span>
      <h2 class="section-title">4 momentos clave para vender en ${city}</h2>
      <p style="color:var(--gris-texto);line-height:1.7">Versión condensada del proceso completo (25 acciones en el checklist). Mismo plan digital 1.999&nbsp;€ + IVA.</p>
    </div>
    <div class="nh-vp1900-compact">${cards}</div>
  </div>
</section>`;
}

function teamSplitBlock(c) {
  const city = esc(c.cityLabel || c.cityName);
  return `<section class="lc-section" style="background:var(--crema)">
  <div class="container fade-up">
    <div class="text-center" style="max-width:720px;margin:0 auto 1.5rem">
      <span class="overline">División del trabajo</span>
      <h2 class="section-title">Quién hace qué en ${city} (plan ~1.900 €)</h2>
    </div>
    <div class="nh-vp1900-split">
      <div class="nh-vp1900-split-col">
        <img src="imagenes/danielhernandez.jpg" alt="Gestor NuevaHabitat" loading="lazy"/>
        <h3 style="margin:0 0 .75rem">NuevaHabitat</h3>
        <ul class="lc-nh-checklist" style="font-size:.875rem">
          <li>Valoración, anuncio, Idealista y pisos.com</li>
          <li>Filtro hipoteca/liquidez y agenda de visitas</li>
          <li>Negociación, arras, FIRMACERT y notaría</li>
          <li>Panel vendedor actualizado 24/7</li>
        </ul>
      </div>
      <div class="nh-vp1900-split-col">
        <img src="imagenes/interior4.jpg" alt="Propietario en visita" loading="lazy"/>
        <h3 style="margin:0 0 .75rem">Tú en ${city}</h3>
        <ul class="lc-nh-checklist" style="font-size:.875rem">
          <li>Recibir compradores cualificados en casa</li>
          <li>Marcar franjas en el panel (tardes/fines de semana)</li>
          <li>Facilitar documentación y firmar arras/escritura</li>
          <li>Pagar 50 % al contratar y 50 % al cerrar venta</li>
        </ul>
      </div>
    </div>
  </div>
</section>`;
}

function zonesSpotlightBlock(c) {
  const city = esc(c.cityLabel || c.cityName);
  const zones = (c.zones || []).slice(0, 12);
  const tags = zones.map((z) => `<span class="nh-vp1900-zone-tag">${esc(z)}</span>`).join('');
  return `<section class="lc-section" style="background:var(--negro);color:#fff">
  <div class="container text-center fade-up">
    <span class="overline" style="color:var(--oro)">Cobertura ${city}</span>
    <h2 class="section-title light">¿Vendes en alguna de estas zonas?</h2>
    <p style="color:rgba(255,255,255,.75);max-width:640px;margin:.75rem auto;line-height:1.7">${esc(c.areaServed || city)} — mismo honorario fijo donde puedas atender visitas.</p>
    <div class="nh-vp1900-zones">${tags}</div>
    <p style="margin-top:1.25rem;font-size:.875rem;color:rgba(255,255,255,.6)">Mercado: <strong style="color:#fff">${esc(c.priceM2 || '')}</strong> · plazos ${esc(c.avgDays || '')}</p>
  </div>
</section>`;
}

function textOnlyStepsBlock(c) {
  const city = esc(c.cityLabel || c.cityName);
  const items = JOURNEY_STEPS.map((s) => `<li><strong>${esc(s.title)}</strong> — ${esc(s.nh)}</li>`).join('');
  return `<section class="lc-section" style="background:var(--blanco)" id="pasos-ilustrados">
  <div class="container fade-up">
    <div class="text-center" style="max-width:640px;margin:0 auto 1.25rem">
      <span class="overline">Proceso en lista</span>
      <h2 class="section-title">8 fases del servicio en ${city} (sin sorpresas)</h2>
    </div>
    <ol class="nh-vp1900-text-steps">${items}</ol>
    <p class="text-center" style="margin-top:1.5rem;font-size:.875rem"><a href="#todas-las-acciones">Ver las ${ALL_ACTIONS.length} acciones detalladas</a></p>
  </div>
</section>`;
}

function angleIntroBlock(c) {
  const city = esc(c.cityLabel || c.cityName);
  if (c.angleIntroHtml) return c.angleIntroHtml;
  return `<section class="lc-section" style="background:var(--negro);color:#fff">
  <div class="container fade-up" style="max-width:820px;margin:0 auto;text-align:center">
    <span class="overline" style="color:var(--oro)">Enfoque distinto</span>
    <h2 class="section-title light" style="margin-bottom:1rem">No buscamos repetir otra landing de «venta digital»</h2>
    <p style="color:rgba(255,255,255,.78);line-height:1.8;font-size:1.02rem">Aquí el eje es <strong>transparencia de acciones</strong>: qué hace la agencia, qué haces tú y en qué foto del proceso estás. El precio que ves en Google (~1.900–1.990&nbsp;€) se traduce en <strong>1.999 € + IVA</strong> en contrato — sin porcentaje sobre el precio de venta${city !== 'España' ? ` en ${city}` : ''}.</p>
  </div>
</section>`;
}

function composeVariantBody(c) {
  const v = c.layoutVariant || 'guia';
  const journeyFull = () => illustratedJourneyBlock(c, c.journeyOpts);
  const actions = () => allActionsBlock(c);
  switch (v) {
    case 'checklist-first':
      return `${actions()}${mythsRealityBlock(c)}${journeyFull()}`;
    case 'pilares':
      return `${pillarsPhotoBlock(c)}${journeyFull()}${actions()}`;
    case 'compact4':
      return `${compactJourneyBlock(c)}${actions()}`;
    case 'split-equipo':
      return `${teamSplitBlock(c)}${journeyFull()}${actions()}`;
    case 'zonas-texto':
      return `${zonesSpotlightBlock(c)}${textOnlyStepsBlock(c)}${actions()}`;
    default:
      return `${angleIntroBlock(c)}${journeyFull()}${actions()}`;
  }
}

module.exports = {
  JOURNEY_STEPS,
  ALL_ACTIONS,
  nhVp1900Styles,
  savingsStrip,
  illustratedJourneyBlock,
  allActionsBlock,
  citySwitcherBlock,
  angleIntroBlock,
  composeVariantBody,
  mythsRealityBlock,
  pillarsPhotoBlock,
  compactJourneyBlock,
  teamSplitBlock,
  zonesSpotlightBlock,
  textOnlyStepsBlock,
};
