/**
 * Tarjetas compradores: precio máx. compraventa vs honorarios NH.
 */
(function () {
  var STYLE_ID = 'nh-comp-presupuesto-ui-style';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '.adm-comp-compraventa{font-size:1.12rem;font-weight:700;color:var(--gold);margin:.2rem 0 .5rem;line-height:1.3}' +
      '.adm-comp-compraventa small{font-size:.62rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:.12rem}' +
      '.adm-comp-compraventa--missing{font-size:.82rem;font-weight:600;color:var(--muted)}' +
      '.adm-comp-compraventa--missing .adm-comp-compraventa-warn{color:#fdba74;font-weight:600}';
    document.head.appendChild(s);
  }

  function esc(t) {
    if (typeof dashEsc === 'function') return dashEsc(t);
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function fmtPresupuesto(c) {
    if (c.presupuesto_min != null && c.presupuesto_max != null) {
      return Number(c.presupuesto_min).toLocaleString('es-ES') + ' – ' + Number(c.presupuesto_max).toLocaleString('es-ES') + ' €';
    }
    if (c.presupuesto_max != null) return '≤ ' + Number(c.presupuesto_max).toLocaleString('es-ES') + ' €';
    if (c.presupuesto_min != null) return 'desde ' + Number(c.presupuesto_min).toLocaleString('es-ES') + ' €';
    return null;
  }

  function presupuestoHtml(c) {
    var txt = fmtPresupuesto(c);
    if (txt) {
      return '<div class="adm-comp-compraventa nh-comp-presupuesto-block"><small>Precio compraventa (máx.)</small>' + esc(txt) + '</div>';
    }
    return '<div class="adm-comp-compraventa adm-comp-compraventa--missing nh-comp-presupuesto-block"><small>Precio compraventa</small><span class="adm-comp-compraventa-warn">Sin presupuesto máx. · edita o importa precio Idealista</span></div>';
  }

  function compIdFromCard(card) {
    var m = (card.getAttribute('onclick') || '').match(/openCompCardModal\('([^']+)'\)/);
    return m ? m[1] : null;
  }

  function getComp(id) {
    var data = typeof _compData !== 'undefined' ? _compData : window._compData;
    return data && id ? data.find(function (x) { return x.id === id; }) : null;
  }

  function relabelHonorarios(card, c) {
    var badge = card.querySelector('.adm-pay-badge');
    if (!badge || badge.dataset.nhHonorariosLbl) return;
    var amt = c.honorarios != null ? Number(c.honorarios).toLocaleString('es-ES') + ' €' : '';
    if (c.honorarios_pagado) {
      badge.textContent = 'Honorarios ✓' + (amt ? ' · ' + amt : '');
      badge.title = 'Honorarios del comprador pagados';
    } else if (c.honorarios_transferencia_pendiente) {
      badge.textContent = 'Honorarios · transf. pend.' + (amt ? ' · ' + amt : '');
      badge.title = 'Honorarios — transferencia anunciada';
    } else if (c.honorarios != null) {
      badge.textContent = 'Honorarios pend.' + (amt ? ' · ' + amt : '');
      badge.title = 'Honorarios NH (no es precio de compra del inmueble)';
    } else {
      badge.remove();
      return;
    }
    badge.dataset.nhHonorariosLbl = '1';
  }

  function injectPresupuestoAfterTitle(card, c) {
    var title = card.querySelector('.pub-title');
    if (!title) return;
    var existing = title.parentElement.querySelector('.nh-comp-presupuesto-block');
    if (existing) {
      existing.outerHTML = presupuestoHtml(c);
      return;
    }
    var oldPrice = title.nextElementSibling;
    if (oldPrice && oldPrice.classList && oldPrice.classList.contains('pub-price')) oldPrice.remove();
    title.insertAdjacentHTML('afterend', presupuestoHtml(c));
  }

  function patchCompGrid() {
    var grid = document.getElementById('comp-grid');
    if (!grid) return;
    grid.querySelectorAll('.pub-card').forEach(function (card) {
      var c = getComp(compIdFromCard(card));
      if (!c) return;
      relabelHonorarios(card, c);
      injectPresupuestoAfterTitle(card, c);
    });
  }

  function wrap(name) {
    var fn = window[name];
    if (typeof fn !== 'function') return;
    window[name] = function () {
      var ret = fn.apply(this, arguments);
      patchCompGrid();
      return ret;
    };
  }

  function wrapBuildCompCard() {
    var fn = window.buildCompCardDetailHtml;
    if (typeof fn !== 'function') return;
    window.buildCompCardDetailHtml = function (c) {
      var html = fn(c);
      if (html.indexOf('nh-comp-presupuesto-block') >= 0) return html;
      return presupuestoHtml(c) + html;
    };
  }

  injectStyle();
  wrap('renderCompradores');
  wrapBuildCompCard();
  setTimeout(patchCompGrid, 0);
})();
