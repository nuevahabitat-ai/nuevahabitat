/**
 * Evita que el navegador rellene el filtro Zona (compradores) con email/contraseña.
 */
(function () {
  function looksLikeEmail(s) {
    return /@/.test(String(s || ''));
  }

  function fixZonaInput() {
    const el = document.getElementById('cf-zona');
    if (!el) return;
    el.type = 'search';
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('autocorrect', 'off');
    el.setAttribute('spellcheck', 'false');
    el.setAttribute('data-lpignore', 'true');
    el.setAttribute('data-1p-ignore', 'true');
    el.setAttribute('name', 'nh_comp_zona_filter');
    el.setAttribute('inputmode', 'search');
    if (looksLikeEmail(el.value)) {
      el.value = '';
      if (typeof renderCompradores === 'function') renderCompradores();
    }
  }

  function wrapGetCompFilterValues() {
    if (typeof getCompFilterValues !== 'function' || getCompFilterValues.__nhZonaFix) return;
    const orig = getCompFilterValues;
    getCompFilterValues = function () {
      const f = orig();
      if (looksLikeEmail(f.zona)) {
        fixZonaInput();
        f.zona = '';
      }
      return f;
    };
    getCompFilterValues.__nhZonaFix = true;
  }

  function boot() {
    fixZonaInput();
    wrapGetCompFilterValues();
    document.getElementById('cf-zona')?.addEventListener('focus', fixZonaInput);
  }

  document.addEventListener('DOMContentLoaded', () => {
    boot();
    setTimeout(boot, 400);
    setTimeout(boot, 1500);
  });
  if (document.readyState !== 'loading') boot();
})();
