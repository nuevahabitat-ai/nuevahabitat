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
@media(max-width:900px){
  .nh-vp1900-hero{grid-template-columns:1fr;padding-top:3rem}
  .nh-vp1900-savings{grid-template-columns:1fr}
  .nh-vp1900-step,.nh-vp1900-step:nth-child(even){grid-template-columns:1fr;direction:ltr}
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

function illustratedJourneyBlock(c) {
  const city = esc(c.cityLabel || c.cityName);
  const steps = JOURNEY_STEPS.map((s, i) => {
    const tu = s.tu.replace('en el piso', `en ${city === 'España' ? 'tu ciudad' : city}`);
    return `<article class="nh-vp1900-step fade-up">
      <div>
        <div class="nh-vp1900-step-num">Paso ${i + 1} de ${JOURNEY_STEPS.length}</div>
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
      <h2 class="section-title">8 pasos ilustrados: de contratar a escritura${city !== 'España' ? ` en ${city}` : ''}</h2>
      <p style="color:var(--gris-texto);line-height:1.75">Esta landing no es un folleto genérico: es la <strong>misma operativa</strong> que el plan venta digital, explicada acción por acción con fotos reales del proceso NuevaHabitat (panel, gestores, portales y cierre).</p>
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

function angleIntroBlock(c) {
  const city = esc(c.cityLabel || c.cityName);
  return `<section class="lc-section" style="background:var(--negro);color:#fff">
  <div class="container fade-up" style="max-width:820px;margin:0 auto;text-align:center">
    <span class="overline" style="color:var(--oro)">Enfoque distinto</span>
    <h2 class="section-title light" style="margin-bottom:1rem">No buscamos repetir otra landing de «venta digital»</h2>
    <p style="color:rgba(255,255,255,.78);line-height:1.8;font-size:1.02rem">Aquí el eje es <strong>transparencia de acciones</strong>: qué hace la agencia, qué haces tú y en qué foto del proceso estás. El precio que ves en Google (~1.900–1.990&nbsp;€) se traduce en <strong>1.999 € + IVA</strong> en contrato — sin porcentaje sobre el precio de venta${city !== 'España' ? ` en ${city}` : ''}.</p>
  </div>
</section>`;
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
};
