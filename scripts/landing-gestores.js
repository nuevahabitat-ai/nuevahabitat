const { PHONE_DANIEL, PHONE_SEBASTIAN } = require('./phone-config');

/** Gestores comerciales — fuente única para landings */
const GESTORES = [
  {
    id: 'daniel',
    name: 'Daniel Hernández',
    short: 'Daniel',
    phone: PHONE_DANIEL,
    waText: 'Hola Daniel, vengo desde la web de NuevaHabitat y quiero hablar sobre mi piso',
  },
  {
    id: 'sebastian',
    name: 'Juan Sebastián Cárdenas',
    short: 'Sebastián',
    phone: PHONE_SEBASTIAN,
    waText: 'Hola Sebastián, vengo desde la web de NuevaHabitat y quiero hablar con un gestor',
  },
];

function waUrl(g) {
  return `https://wa.me/${g.phone.wa}?text=${encodeURIComponent(g.waText)}`;
}

function waBannerButtons(prefix = '') {
  const daniel = GESTORES[0];
  const sebastian = GESTORES[1];
  const p = prefix ? `${prefix}-` : '';
  return `<a href="${waUrl(daniel)}" class="btn btn-gold lc-wa-banner-btn" data-nh-wa-custom="1" data-nh-call="${p}wa-daniel" target="_blank" rel="noopener">WhatsApp Daniel</a>
      <a href="${waUrl(sebastian)}" class="btn btn-outline lc-wa-banner-btn" data-nh-wa-custom="1" data-nh-call="${p}wa-sebastian" target="_blank" rel="noopener">WhatsApp Sebastián</a>`;
}

const BANNER_LINES = {
  default: 'Escríbenos por WhatsApp — valoración y plan sin compromiso.',
  postCalc: '¿Te cuadra el ahorro? Pregunta a Daniel o Sebastián.',
  postPanel: '¿Quieres activar tu expediente? WhatsApp con tu gestor.',
  postArticle: '¿Seguimos por WhatsApp? Te orientamos en tu caso.',
  preForm: 'Prefieres WhatsApp antes del formulario:',
};

/** Franja compacta — sin fotos ni tarjetas */
function gestoresContactBanner(L, variant = 'default') {
  const line = BANNER_LINES[variant] || BANNER_LINES.default;
  return `<section class="lc-gestor-wa-strip lc-gestor-wa-strip--${variant}">
  <div class="container lc-gestor-wa-strip__inner fade-up">
    <p class="lc-gestor-wa-strip__text">${line}</p>
    <div class="lc-gestor-wa-strip__btns">${waBannerButtons(variant)}</div>
  </div>
</section>`;
}

function gestoresCallBannerContent(preFaq) {
  return `<div class="lc-call-gestores fade-up lc-call-gestores--wa">
    <div class="lc-call-gestores__text">
      <span class="overline">${preFaq ? 'Antes de irte' : 'Contacto directo'}</span>
      <p class="lc-call-banner__title">WhatsApp con Daniel o Sebastián</p>
      <p class="lc-call-banner__sub">Horario comercial lun–sáb 9–20h · Oficina Les Corts</p>
    </div>
    <div class="lc-call-gestores__btns">${waBannerButtons(preFaq ? 'prefaq' : 'banner')}</div>
  </div>`;
}

function gestoresStyles() {
  return `
    .lc-gestor-wa-strip{padding:1.35rem 0;background:var(--blanco);border-top:1px solid var(--crema-dark);border-bottom:1px solid var(--crema-dark)}
    .lc-gestor-wa-strip--postCalc,.lc-gestor-wa-strip--postPanel{background:var(--crema)}
    .lc-gestor-wa-strip--postArticle{background:var(--negro);border-color:rgba(255,255,255,.08)}
    .lc-gestor-wa-strip--postArticle .lc-gestor-wa-strip__text{color:rgba(255,255,255,.88)}
    .lc-gestor-wa-strip--postArticle .btn-outline{border-color:rgba(255,255,255,.4);color:#fff}
    .lc-gestor-wa-strip--postArticle .btn-outline:hover{background:rgba(255,255,255,.08)}
    .lc-gestor-wa-strip__inner{display:flex;align-items:center;justify-content:space-between;gap:1.25rem;flex-wrap:wrap}
    .lc-gestor-wa-strip__text{margin:0;font-size:1rem;line-height:1.5;color:var(--gris-texto);flex:1;min-width:200px}
    .lc-gestor-wa-strip__btns{display:flex;flex-wrap:wrap;gap:.5rem}
    .lc-wa-banner-btn{white-space:nowrap}
    .lc-call-gestores{display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;width:100%}
    .lc-call-gestores__text{flex:1;min-width:200px}
    .lc-call-gestores__btns{display:flex;flex-wrap:wrap;gap:.5rem}
    .lc-call-banner--prefaq .lc-call-gestores .btn-outline{border-color:var(--negro);color:var(--negro)}
    @media(max-width:640px){.lc-gestor-wa-strip__inner{flex-direction:column;align-items:stretch;text-align:center}.lc-gestor-wa-strip__btns,.lc-call-gestores__btns{flex-direction:column}.lc-call-gestores{flex-direction:column;text-align:center}}
  `;
}

module.exports = {
  GESTORES,
  gestoresContactBanner,
  gestoresCallBannerContent,
  gestoresStyles,
};
