/**
 * WhatsApp rebaja: nombre y comprador_id desde ficha (teléfono), no duplicado API.
 */
(function () {
  const enrich =
    typeof window.nhEnrichRebajaVisitor === 'function'
      ? window.nhEnrichRebajaVisitor
      : (v) => v;

  const origMatch = window.matchCompradorIdForVisitor;
  window.matchCompradorIdForVisitor = function (v) {
    const ev = enrich(v || {});
    if (ev.comprador_id) return ev.comprador_id;
    if (typeof origMatch === 'function') return origMatch(ev);
    return null;
  };

  const origBuild = window.buildRebajaWhatsAppMsg;
  if (typeof origBuild === 'function' && !origBuild.__nhNombreFicha) {
    window.buildRebajaWhatsAppMsg = function (v, inm, precioAnterior, precioNuevo) {
      return origBuild(enrich(v), inm, precioAnterior, precioNuevo);
    };
    window.buildRebajaWhatsAppMsg.__nhNombreFicha = true;
  }
})();
