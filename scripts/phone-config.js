/** Teléfonos de contacto NuevaHabitat — fuente única para build y parches */
const PHONE_SEBASTIAN = { e164: '+34603656587', display: '603 656 587', wa: '34603656587' };
const PHONE_DANIEL = { e164: '+34643877644', display: '643 877 644', wa: '34643877644' };

const PHONES = [PHONE_SEBASTIAN, PHONE_DANIEL];

function displayBoth(sep = ' · ') {
  return PHONES.map((p) => p.display).join(sep);
}

function telLink(p, extraClass = '', callAttr = '') {
  const cls = ['nh-call-link', extraClass].filter(Boolean).join(' ');
  const attr = callAttr ? ` data-nh-call="${callAttr}"` : '';
  return `<a href="tel:${p.e164}" class="${cls.trim()}"${attr}>${p.display}</a>`;
}

function telLinksInline(extraClass = '', callAttr = '') {
  return PHONES.map((p) => telLink(p, extraClass, callAttr)).join(' · ');
}

function footerPhonesLi() {
  return PHONES.map((p) => `<a href="tel:${p.e164}">${p.display}</a>`).join(' · ');
}

function schemaTelephones() {
  return PHONES.map((p) => p.e164);
}

/** Botón flotante y CTAs genéricos → Sebastián (603) */
function waMeUrl(text) {
  const base = `https://wa.me/${PHONE_SEBASTIAN.wa}`;
  if (text == null || text === '') return base;
  const t = typeof text === 'string' && text.includes('%') ? decodeURIComponent(text) : text;
  return `${base}?text=${encodeURIComponent(t)}`;
}

module.exports = {
  PHONES,
  PHONE_SEBASTIAN,
  PHONE_DANIEL,
  PRIMARY: PHONE_SEBASTIAN,
  WA_PRIMARY: PHONE_SEBASTIAN,
  WA_FLOAT: PHONE_SEBASTIAN,
  displayBoth,
  telLink,
  telLinksInline,
  footerPhonesLi,
  schemaTelephones,
  waMeUrl,
};
