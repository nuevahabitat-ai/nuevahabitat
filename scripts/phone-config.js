/** Teléfonos de contacto NuevaHabitat — fuente única para build y parches */
const PHONES = [
  { e164: '+34603656587', display: '603 656 587', wa: '34603656587' },
  { e164: '+34643877644', display: '643 877 644', wa: '34643877644' },
];

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

module.exports = {
  PHONES,
  PRIMARY: PHONES[0],
  WA_PRIMARY: PHONES[0],
  displayBoth,
  telLink,
  telLinksInline,
  footerPhonesLi,
  schemaTelephones,
};
