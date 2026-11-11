/**
 * Evita autofill de email/contraseña en filtros "Zona" y campos similares del panel.
 */
(function () {
  const ZONE_IDS = [
    'cf-zona', 'if-zona', 'pf-zona', 'c-zona', 'w-zona',
    'part-zona', 'lead-man-inmueble',
  ];

  function looksLikeEmail(s) {
    const t = String(s || '').trim();
    return t.includes('@') || /\.(com|es|gmail|hotmail|outlook)\b/i.test(t);
  }

  function hardenInput(el) {
    if (!el || el.dataset.nhNoAutofill === '1') return;
    el.dataset.nhNoAutofill = '1';
    if (el.id === 'cf-zona' || el.id === 'if-zona' || el.id === 'pf-zona') {
      el.type = 'search';
    }
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('autocorrect', 'off');
    el.setAttribute('spellcheck', 'false');
    el.setAttribute('data-lpignore', 'true');
    el.setAttribute('data-1p-ignore', 'true');
    el.setAttribute('data-form-type', 'other');
    el.setAttribute('name', `nh_filter_${el.id || 'zona'}`);
    if (!el.dataset.nhReadonlyTrap) {
      el.dataset.nhReadonlyTrap = '1';
      el.setAttribute('readonly', 'readonly');
      el.addEventListener('focus', () => {
        el.removeAttribute('readonly');
      });
      el.addEventListener('blur', () => {
        if (!el.value) el.setAttribute('readonly', 'readonly');
      });
    }
  }

  function sanitizeEl(el) {
    if (!el) return false;
    if (looksLikeEmail(el.value)) {
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
    return false;
  }

  function sanitizeAll() {
    let changed = false;
    ZONE_IDS.forEach((id) => {
      if (sanitizeEl(document.getElementById(id))) changed = true;
    });
    document.querySelectorAll('#comp-filter-bar input, #inm-filter-bar input, #pf-filter-bar input')
      .forEach((el) => {
        if (el.type === 'text' || el.type === 'search') {
          if (sanitizeEl(el)) changed = true;
        }
      });
    if (changed) {
      if (typeof renderCompradores === 'function') renderCompradores();
      if (typeof renderPublications === 'function') renderPublications();
      if (typeof renderParticulares === 'function') renderParticulares();
    }
  }

  function stripEmailFromFilterGetter(origFn) {
    return function () {
      const f = origFn();
      if (f.zona && looksLikeEmail(f.zona)) f.zona = '';
      return f;
    };
  }

  function patchFilterGetters() {
    if (typeof getCompFilterValues === 'function' && !getCompFilterValues.__nhNoMail) {
      const o = getCompFilterValues;
      getCompFilterValues = stripEmailFromFilterGetter(o);
      getCompFilterValues.__nhNoMail = true;
    }
    if (typeof getInmFilterValues === 'function' && !getInmFilterValues.__nhNoMail) {
      const o = getInmFilterValues;
      getInmFilterValues = stripEmailFromFilterGetter(o);
      getInmFilterValues.__nhNoMail = true;
    }
    if (typeof getPartFilterValues === 'function' && !getPartFilterValues.__nhNoMail) {
      const o = getPartFilterValues;
      getPartFilterValues = stripEmailFromFilterGetter(o);
      getPartFilterValues.__nhNoMail = true;
    }
  }

  function patchClearCompFilters() {
    if (typeof clearCompFilters !== 'function' || clearCompFilters.__nhNoMail) return;
    const orig = clearCompFilters;
    clearCompFilters = function () {
      orig();
      sanitizeAll();
    };
    clearCompFilters.__nhNoMail = true;
  }

  function observeSection(secId) {
    const sec = document.getElementById(secId);
    if (!sec || sec.dataset.nhAutofillObs) return;
    sec.dataset.nhAutofillObs = '1';
    const obs = new MutationObserver(() => sanitizeAll());
    obs.observe(sec, { subtree: true, attributes: true, attributeFilter: ['value'] });
  }

  function watchAutofillPoll() {
    let n = 0;
    const iv = setInterval(() => {
      sanitizeAll();
      if (++n > 20) clearInterval(iv);
    }, 1500);
  }

  function patchClearInmFilters() {
    if (typeof clearInmFilters !== 'function' || clearInmFilters.__nhNoMail) return;
    const orig = clearInmFilters;
    clearInmFilters = function () {
      orig();
      const z = document.getElementById('if-zona');
      if (z && looksLikeEmail(z.value)) z.value = '';
      sanitizeAll();
    };
    clearInmFilters.__nhNoMail = true;
  }

  function boot() {
    ZONE_IDS.forEach((id) => hardenInput(document.getElementById(id)));
    document.querySelectorAll('#comp-filter-bar input[type="text"],#comp-filter-bar input[type="search"],#comp-filter-bar input[type="tel"],#inm-filter-bar input[type="text"],#inm-filter-bar input[type="search"]')
      .forEach(hardenInput);
    patchFilterGetters();
    patchClearCompFilters();
    patchClearInmFilters();
    sanitizeAll();
    observeSection('sec-compradores');
    observeSection('sec-inmuebles');
    watchAutofillPoll();
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(boot, 0);
    setTimeout(boot, 500);
    setTimeout(boot, 2000);
    setTimeout(boot, 5000);
  });
  if (document.readyState !== 'loading') setTimeout(boot, 0);

  const origSwitch = window.switchSection;
  if (typeof origSwitch === 'function' && !origSwitch.__nhNoMail) {
    window.switchSection = function (name) {
      const r = origSwitch.apply(this, arguments);
      if (name === 'compradores' || name === 'inmuebles' || name === 'seguimientos') {
        setTimeout(boot, 100);
        watchAutofillPoll();
      }
      return r;
    };
    window.switchSection.__nhNoMail = true;
  }
})();
