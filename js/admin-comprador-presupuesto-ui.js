/**
 * Tarjetas compradores: precio compraventa del piso consultado.
 */
(function () {
  var STYLE_ID = 'nh-comp-presupuesto-ui-style';
  var _precioPisoByCompId = new Map();
  var _enriching = false;
  var _enrichedOnce = false;

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '.adm-comp-compraventa{font-size:1.12rem;font-weight:700;color:var(--gold);margin:.2rem 0 .5rem;line-height:1.3}' +
      '.adm-comp-compraventa small{font-size:.62rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:.12rem}';
    document.head.appendChild(s);
  }

  function esc(t) {
    if (typeof dashEsc === 'function') return dashEsc(t);
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function parseEuroAmount(raw) {
    var n = parseInt(String(raw).replace(/\./g, '').replace(/,/g, ''), 10);
    return n >= 40000 && n <= 15000000 ? n : null;
  }

  function precioFromNotas(notas) {
    var text = String(notas || '');
    if (!text.trim()) return null;
    var prices = [];
    var m;
    var re = /(\d{1,3}(?:\.\d{3})+|\d{5,7})\s*€/g;
    while ((m = re.exec(text))) {
      var p = parseEuroAmount(m[1]);
      if (p) prices.push(p);
    }
    if (!prices.length) return null;
    return Math.max.apply(null, prices);
  }

  function getCompData() {
    return typeof _compData !== 'undefined' ? _compData : window._compData || [];
  }

  function localPrecioPiso(c) {
    if (_precioPisoByCompId.has(c.id)) return _precioPisoByCompId.get(c.id);
    if (c.presupuesto_max != null && Number(c.presupuesto_max) > 0) return Number(c.presupuesto_max);
    var fromNotas = precioFromNotas(c.notas);
    if (fromNotas) return fromNotas;
    if (typeof _pubData !== 'undefined' && _pubData && _pubData.length) {
      var idM = String(c.notas || '').match(/Idealista\s+(\d{6,})/i);
      if (idM) {
        var inm = _pubData.find(function (p) {
          return String(p.idealista_id || '') === idM[1];
        });
        if (inm && inm.precio != null) return Number(inm.precio);
      }
      var refM = String(c.notas || '').match(/\b(NH-\d{4}-\d+)\b/i);
      if (refM) {
        var inm2 = _pubData.find(function (p) {
          return String(p.ref || '').toUpperCase() === refM[0].toUpperCase();
        });
        if (inm2 && inm2.precio != null) return Number(inm2.precio);
      }
    }
    return null;
  }

  function presupuestoHtml(c) {
    var piso = localPrecioPiso(c);
    if (piso == null) return '';
    return (
      '<div class="adm-comp-compraventa nh-comp-presupuesto-block"><small>Precio compraventa (piso)</small>' +
      esc(Number(piso).toLocaleString('es-ES') + ' €') +
      '</div>'
    );
  }

  async function enrichPreciosPisoFromApi() {
    if (_enriching || !window.nhSupabase) return;
    var data = getCompData();
    if (!data.length) return;
    _enriching = true;
    try {
      var session = (await window.nhSupabase.auth.getSession()).data.session;
      if (!session || !session.access_token) return;
      var ids = data.map(function (c) {
        return c.id;
      });
      var res = await fetch('/api/notify?__action=admin-comprador-precio-piso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({ ids: ids, all: true, limit: 250, persist: true }),
      });
      var json = await res.json().catch(function () {
        return {};
      });
      if (json && json.precios) {
        Object.keys(json.precios).forEach(function (id) {
          var p = Number(json.precios[id]);
          if (p > 0) {
            _precioPisoByCompId.set(id, p);
            var row = data.find(function (x) {
              return x.id === id;
            });
            if (row && (row.presupuesto_max == null || row.presupuesto_max === 0)) row.presupuesto_max = p;
          }
        });
      }
      _enrichedOnce = true;
      if (json && json.updated > 0 && typeof loadCompradores === 'function') {
        loadCompradores(true);
      }
    } catch (e) {
      console.warn('enrichPreciosPisoFromApi', e);
    } finally {
      _enriching = false;
    }
  }

  function compIdFromCard(card) {
    var m = (card.getAttribute('onclick') || '').match(/openCompCardModal\('([^']+)'\)/);
    return m ? m[1] : null;
  }

  function getComp(id) {
    return getCompData().find(function (x) {
      return x.id === id;
    });
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
    var html = presupuestoHtml(c);
    var existing = title.parentElement.querySelector('.nh-comp-presupuesto-block');
    if (!html) {
      if (existing) existing.remove();
      return;
    }
    if (existing) {
      existing.outerHTML = html;
      return;
    }
    var oldPrice = title.nextElementSibling;
    if (oldPrice && oldPrice.classList && oldPrice.classList.contains('pub-price')) oldPrice.remove();
    title.insertAdjacentHTML('afterend', html);
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

  function wrap(name, after) {
    var fn = window[name];
    if (typeof fn !== 'function') return;
    window[name] = function () {
      var ret = fn.apply(this, arguments);
      if (after === 'async') {
        return Promise.resolve(ret).then(function () {
          patchCompGrid();
          if (!_enrichedOnce) {
            return enrichPreciosPisoFromApi().then(function () {
              patchCompGrid();
              if (typeof renderCompradores === 'function') renderCompradores();
            });
          }
        });
      }
      patchCompGrid();
      return ret;
    };
  }

  function wrapBuildCompCard() {
    var fn = window.buildCompCardDetailHtml;
    if (typeof fn !== 'function') return;
    window.buildCompCardDetailHtml = function (c) {
      var html = fn(c);
      var block = presupuestoHtml(c);
      if (!block) return html.replace(/nh-comp-presupuesto-block[\s\S]*?<\/div>/, '');
      if (html.indexOf('nh-comp-presupuesto-block') >= 0) return html;
      return block + html;
    };
  }

  injectStyle();
  wrap('loadCompradores', 'async');
  wrap('renderCompradores');
  wrapBuildCompCard();
  setTimeout(patchCompGrid, 0);
})();
