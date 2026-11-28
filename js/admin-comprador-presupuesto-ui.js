/**
 * Tarjetas compradores: precio compraventa del piso consultado.
 */
(function () {
  var STYLE_ID = 'nh-comp-presupuesto-ui-style';
  var _precioPisoByCompId = new Map();
  var _enriching = false;

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

  function preciosFromNotas(notas) {
    var text = String(notas || '');
    if (!text.trim()) return [];
    var prices = [];
    var m;
    var re = /(\d{1,3}(?:\.\d{3})+|\d{5,7})\s*€/g;
    while ((m = re.exec(text))) {
      var p = parseEuroAmount(m[1]);
      if (p) prices.push(p);
    }
    return prices;
  }

  function precioFromNotas(notas) {
    var prices = preciosFromNotas(notas);
    if (!prices.length) return null;
    return Math.max.apply(null, prices);
  }

  function getCompData() {
    return typeof _compData !== 'undefined' ? _compData : window._compData || [];
  }

  function idealistaIdsFromNotas(notas) {
    var ids = [];
    var text = String(notas || '');
    var re = /idealista\s+(\d{6,})/gi;
    var m;
    while ((m = re.exec(text))) ids.push(m[1]);
    return ids;
  }

  function primaryIdealistaId(c) {
    var ids = idealistaIdsFromNotas(c.notas);
    return ids.length ? ids[0] : null;
  }

  function aggregatePresupuesto(precios) {
    var valid = (precios || []).filter(function (p) {
      return p >= 40000;
    });
    if (!valid.length) return null;
    var max = Math.max.apply(null, valid);
    var min = valid.length > 1 ? Math.min.apply(null, valid) : Math.max(0, max - 50000);
    return { presupuesto_max: max, presupuesto_min: min };
  }

  function applyPrecioToComprador(c, precio, precioMin) {
    if (!c || !(precio >= 40000)) return;
    var max = Math.round(precio);
    var min =
      precioMin != null && precioMin >= 40000
        ? Math.round(precioMin)
        : Math.max(0, max - 50000);
    _precioPisoByCompId.set(c.id, max);
    c.presupuesto_max = max;
    c.presupuesto_min = min;
  }

  async function persistPrecioComprador(c) {
    if (!c || !window.nhSupabase || !(c.presupuesto_max >= 40000)) return;
    var body = {
      presupuesto_max: c.presupuesto_max,
      presupuesto_min: c.presupuesto_min != null ? c.presupuesto_min : Math.max(0, c.presupuesto_max - 50000),
    };
    var { error } = await window.nhSupabase.from('compradores').update(body).eq('id', c.id);
    if (error) {
      await window.nhSupabase.from('compradores').update({ presupuesto_max: body.presupuesto_max }).eq('id', c.id);
    }
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
          return (
            String(p.idealista_id || '') === idM[1] ||
            String(p.idealista_id_2 || '') === idM[1]
          );
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
    var min = c.presupuesto_min != null ? Number(c.presupuesto_min) : null;
    var max = c.presupuesto_max != null ? Number(c.presupuesto_max) : null;
    var line = '';
    if (min != null && max != null && min > 0 && max >= min) {
      line = Number(min).toLocaleString('es-ES') + ' – ' + Number(max).toLocaleString('es-ES') + ' €';
    } else if (max != null && max > 0) {
      line = Number(max).toLocaleString('es-ES') + ' €';
    } else {
      var piso = localPrecioPiso(c);
      if (piso == null) return '';
      var inferredMin = Math.max(0, piso - 50000);
      line =
        Number(inferredMin).toLocaleString('es-ES') + ' – ' + Number(piso).toLocaleString('es-ES') + ' €';
    }
    return (
      '<div class="adm-comp-compraventa nh-comp-presupuesto-block"><small>Precio compraventa (piso)</small>' +
      esc(line) +
      '</div>'
    );
  }

  async function enrichFromNotasLocales(need) {
    var toSave = [];
    need.forEach(function (c) {
      if (c.presupuesto_max >= 40000 && c.presupuesto_min >= 40000) return;
      var prices = preciosFromNotas(c.notas);
      if (!prices.length) return;
      var agg = aggregatePresupuesto(prices);
      if (!agg) return;
      applyPrecioToComprador(c, agg.presupuesto_max, agg.presupuesto_min);
      toSave.push(c);
    });
    for (var i = 0; i < toSave.length; i++) {
      await persistPrecioComprador(toSave[i]);
    }
    return toSave.length;
  }

  async function enrichPreciosPisoFromApi() {
    if (_enriching || !window.nhSupabase) return;
    var data = getCompData();
    if (!data.length) return;
    _enriching = true;
    var need = data.filter(function (c) {
      if (c.activo === false) return false;
      return !(c.presupuesto_max >= 40000) || c.presupuesto_min == null || Number(c.presupuesto_min) <= 0;
    });
    if (!need.length) {
      _enriching = false;
      patchCompGrid();
      return;
    }
    await enrichFromNotasLocales(need);
    need = getCompData().filter(function (c) {
      if (c.activo === false) return false;
      return !(c.presupuesto_max >= 40000) || c.presupuesto_min == null || Number(c.presupuesto_min) <= 0;
    });
    if (!need.length) {
      _enriching = false;
      patchCompGrid();
      return;
    }
    try {
      var session = (await window.nhSupabase.auth.getSession()).data.session;
      if (!session || !session.access_token) return;

      var compIds = need.map(function (c) {
        return c.id;
      });
      var idealistaIds = new Set();
      var compToIid = new Map();
      need.forEach(function (c) {
        var iid = primaryIdealistaId(c);
        if (iid) {
          idealistaIds.add(iid);
          compToIid.set(c.id, iid);
        }
      });

      var priceByIid = new Map();

      var chunks = function (arr, n) {
        var out = [];
        for (var i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
        return out;
      };

      var allInterRows = [];
      if (compIds.length) {
        for (var ci = 0; ci < compIds.length; ci += 80) {
          var cChunk = compIds.slice(ci, ci + 80);
          var interRes = await window.nhSupabase
            .from('comprador_inmueble_interes')
            .select('comprador_id,idealista_id,precio_consultado')
            .in('comprador_id', cChunk);
          var interRows = interRes.data || [];
          allInterRows = allInterRows.concat(interRows);
          interRows.forEach(function (row) {
            if (row.idealista_id) idealistaIds.add(String(row.idealista_id));
          });
        }
      }

      var iidList = [...idealistaIds];
      for (var ii = 0; ii < iidList.length; ii += 40) {
        var iChunk = iidList.slice(ii, ii + 40);
        var inmRes1 = await window.nhSupabase
          .from('inmuebles')
          .select('idealista_id,idealista_id_2,precio')
          .in('idealista_id', iChunk);
        var inmRes2 = await window.nhSupabase
          .from('inmuebles')
          .select('idealista_id,idealista_id_2,precio')
          .in('idealista_id_2', iChunk);
        (inmRes1.data || []).concat(inmRes2.data || []).forEach(function (inm) {
          if (!(inm.precio >= 40000)) return;
          if (inm.idealista_id) priceByIid.set(String(inm.idealista_id), Number(inm.precio));
          if (inm.idealista_id_2) priceByIid.set(String(inm.idealista_id_2), Number(inm.precio));
        });
      }

      var missingIids = iidList.filter(function (id) {
        return !priceByIid.has(String(id));
      });
      if (missingIids.length) {
        var res = await fetch('/api/notify?__action=admin-idealista-precios-bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + session.access_token,
          },
          body: JSON.stringify({ idealista_ids: missingIids }),
        });
        var json = await res.json().catch(function () {
          return {};
        });
        if (json && json.precios) {
          Object.keys(json.precios).forEach(function (id) {
            var p = Number(json.precios[id]);
            if (p >= 40000) priceByIid.set(String(id), p);
          });
        }
      }

      var compPrecios = new Map();
      need.forEach(function (c) {
        compPrecios.set(c.id, []);
      });
      allInterRows.forEach(function (row) {
        if (!compPrecios.has(row.comprador_id)) return;
        if (row.precio_consultado >= 40000) compPrecios.get(row.comprador_id).push(Number(row.precio_consultado));
        if (row.idealista_id) {
          var px = priceByIid.get(String(row.idealista_id));
          if (px) compPrecios.get(row.comprador_id).push(px);
        }
      });
      var toSave = [];
      need.forEach(function (c) {
        var prices = compPrecios.get(c.id) || [];
        if (!prices.length) {
          var iid = compToIid.get(c.id);
          if (iid) {
            var p = priceByIid.get(String(iid));
            if (p) prices.push(p);
          }
        }
        var agg = aggregatePresupuesto(prices);
        if (agg) {
          applyPrecioToComprador(c, agg.presupuesto_max, agg.presupuesto_min);
          toSave.push(c);
        }
      });

      for (var si = 0; si < toSave.length; si++) {
        await persistPrecioComprador(toSave[si]);
      }

      patchCompGrid();
      if (typeof renderCompradores === 'function') renderCompradores();
    } catch (e) {
      console.warn('enrichPreciosPiso', e);
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
          return enrichPreciosPisoFromApi();
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

(function () {
  if (document.querySelector('script[data-nh-admin-seo-patrimonial]')) return;
  var s = document.createElement('script');
  s.src = 'js/admin-seo-patrimonial.js';
  s.dataset.nhAdminSeoPatrimonial = '1';
  s.async = false;
  document.body.appendChild(s);
})();
