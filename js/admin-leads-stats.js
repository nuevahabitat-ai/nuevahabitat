/**
 * Estadísticas de llegada de leads (mes / semana) — panel admin
 */
(function () {
  let _leadStatsMode = 'mes';
  let _leadStatsMonth = ''; // YYYY-MM, vacío = últimos 12 meses

  function ensureLeadStatsStyles() {
    if (document.getElementById('lead-stats-styles')) return;
    const s = document.createElement('style');
    s.id = 'lead-stats-styles';
    s.textContent = `
      .lead-stats-card{margin-bottom:1rem;padding:1rem 1.15rem;border:1px solid rgba(184,147,106,.25);border-radius:10px;background:rgba(0,0,0,.2)}
      .lead-stats-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.65rem;margin-bottom:.85rem}
      .lead-stats-head h4{margin:0;font-size:.95rem;color:var(--gold,#b8936a)}
      .lead-stats-total{font-size:.82rem;color:var(--muted,#9ca3af)}
      .lead-stats-toggles{display:flex;gap:.35rem;flex-wrap:wrap}
      .lead-stats-toggles button{font-size:.78rem;padding:.35rem .65rem}
      .lead-stats-toggles button.active{background:rgba(184,147,106,.22);border-color:var(--gold,#b8936a);color:var(--gold,#b8936a)}
      .lead-stats-bars{display:flex;align-items:flex-end;gap:.45rem;min-height:120px;padding:.5rem 0 .25rem;overflow-x:auto}
      .lead-stats-bar-wrap{flex:1 1 0;min-width:42px;max-width:72px;display:flex;flex-direction:column;align-items:center;gap:.35rem}
      .lead-stats-bar{width:100%;max-width:48px;border-radius:6px 6px 2px 2px;background:linear-gradient(180deg,rgba(184,147,106,.95),rgba(184,147,106,.45));min-height:4px;transition:height .2s}
      .lead-stats-bar.zero{opacity:.25;background:rgba(120,120,120,.35)}
      .lead-stats-bar-lbl{font-size:.65rem;color:var(--muted);text-align:center;line-height:1.15;word-break:break-word}
      .lead-stats-bar-n{font-size:.72rem;font-weight:600;color:#f3f4f6}
      .lead-stats-month-pick{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem;font-size:.8rem}
      .lead-stats-month-pick select{max-width:200px}
      @media(max-width:640px){.lead-stats-bar-wrap{min-width:36px}}
    `;
    document.head.appendChild(s);
  }

  function leadsForStats() {
    const rows = (window._leadsData || []).filter((l) =>
      typeof window.isAdminLeadsListRow === 'function' ? window.isAdminLeadsListRow(l) : true,
    );
    const seg = window._leadFilterSegment;
    const canal = window._leadFilterCanal;
    const tipo = window._leadFilterTipo;
    return rows.filter((l) => {
      if (seg && typeof window.leadSegment === 'function' && window.leadSegment(l) !== seg) return false;
      if (tipo && l.tipo !== tipo) return false;
      if (canal === 'registro_panel' && typeof window.leadEsRegistroPanel === 'function' && !window.leadEsRegistroPanel(l)) return false;
      if (canal === 'formulario' && typeof window.leadEsRegistroPanel === 'function' && window.leadEsRegistroPanel(l)) return false;
      return true;
    });
  }

  function leadCreatedDate(l) {
    const iso = l.created_at || l.updated_at;
    if (!iso) return null;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function ymKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  function weekStartMonday(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const day = x.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    x.setDate(x.getDate() + diff);
    return x;
  }

  function formatWeekLabel(start) {
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const a = start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const b = end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    return `${a} – ${b}`;
  }

  function monthBuckets(leads, monthsBack) {
    const now = new Date();
    const keys = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(ymKey(d));
    }
    const counts = Object.fromEntries(keys.map((k) => [k, 0]));
    for (const l of leads) {
      const d = leadCreatedDate(l);
      if (!d) continue;
      const k = ymKey(d);
      if (counts[k] != null) counts[k]++;
    }
    return keys.map((k) => {
      const [y, m] = k.split('-').map(Number);
      const label = new Date(y, m - 1, 1).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      return { key: k, label, n: counts[k] || 0 };
    });
  }

  function weeksInMonth(ym) {
    const [y, m] = ym.split('-').map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);
    const weeks = [];
    let cur = weekStartMonday(start);
    while (cur <= end) {
      const wEnd = new Date(cur);
      wEnd.setDate(wEnd.getDate() + 6);
      if (wEnd >= start) weeks.push(new Date(cur));
      cur = new Date(cur);
      cur.setDate(cur.getDate() + 7);
    }
    return weeks;
  }

  function weekBuckets(leads, ymOrNull) {
    let weekStarts;
    if (ymOrNull) {
      weekStarts = weeksInMonth(ymOrNull);
    } else {
      const now = new Date();
      weekStarts = [];
      const cur = weekStartMonday(now);
      for (let i = 11; i >= 0; i--) {
        const w = new Date(cur);
        w.setDate(w.getDate() - i * 7);
        weekStarts.push(w);
      }
    }
    const buckets = weekStarts.map((start) => ({
      start,
      key: start.toISOString().slice(0, 10),
      label: formatWeekLabel(start),
      n: 0,
    }));
    for (const l of leads) {
      const d = leadCreatedDate(l);
      if (!d) continue;
      const ws = weekStartMonday(d);
      const hit = buckets.find((b) => b.start.getTime() === ws.getTime());
      if (hit) hit.n++;
      else if (ymOrNull) {
        const [y, m] = ymOrNull.split('-').map(Number);
        if (d.getFullYear() === y && d.getMonth() + 1 === m) {
          /* cae en mes pero fuera etiqueta — ignorar */
        }
      }
    }
    return buckets;
  }

  function renderBars(buckets) {
    const max = Math.max(1, ...buckets.map((b) => b.n));
    return buckets
      .map((b) => {
        const h = Math.round((b.n / max) * 96) || (b.n ? 8 : 4);
        return `<div class="lead-stats-bar-wrap" title="${b.label}: ${b.n}">
          <span class="lead-stats-bar-n">${b.n}</span>
          <div class="lead-stats-bar${b.n ? '' : ' zero'}" style="height:${h}px"></div>
          <span class="lead-stats-bar-lbl">${b.label}</span>
        </div>`;
      })
      .join('');
  }

  function availableMonths(leads) {
    const set = new Set();
    for (const l of leads) {
      const d = leadCreatedDate(l);
      if (d) set.add(ymKey(d));
    }
    return [...set].sort().reverse();
  }

  function renderLeadStats() {
    ensureLeadStatsStyles();
    let wrap = document.getElementById('leads-stats-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'leads-stats-wrap';
      const sec = document.getElementById('sec-leads');
      const card = sec && sec.querySelector('.adm-card');
      const anchor = card && card.querySelector('.adm-subtabs');
      if (anchor) anchor.parentNode.insertBefore(wrap, anchor);
      else return;
    }
    const leads = leadsForStats();
    const withDate = leads.filter((l) => leadCreatedDate(l));
    const thisMonth = ymKey(new Date());
    const thisWeekStart = weekStartMonday(new Date());
    const nMonth = withDate.filter((l) => ymKey(leadCreatedDate(l)) === thisMonth).length;
    const nWeek = withDate.filter((l) => weekStartMonday(leadCreatedDate(l)).getTime() === thisWeekStart.getTime()).length;

    let buckets;
    let monthPicker = '';
    if (_leadStatsMode === 'mes') {
      buckets = monthBuckets(withDate, 12);
      if (!_leadStatsMonth) _leadStatsMonth = thisMonth;
    } else {
      const months = availableMonths(withDate);
      if (!_leadStatsMonth && months.length) _leadStatsMonth = months[0];
      const opts = months
        .map((m) => {
          const [y, mo] = m.split('-');
          const lab = new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
          return `<option value="${m}"${m === _leadStatsMonth ? ' selected' : ''}>${lab}</option>`;
        })
        .join('');
      monthPicker = `<div class="lead-stats-month-pick">
        <span class="text-muted">Semanas del mes:</span>
        <select id="lead-stats-month-select" class="adm-control">${opts}</select>
      </div>`;
      buckets = weekBuckets(withDate, _leadStatsMonth || thisMonth);
    }

    wrap.innerHTML = `
      <div class="lead-stats-card">
        <div class="lead-stats-head">
          <div style="flex:1">
            <h4>📊 Llegada de leads</h4>
            <div class="lead-stats-total">Este mes: <strong>${nMonth}</strong> · Esta semana: <strong>${nWeek}</strong> · Base: ${withDate.length} con fecha (${leads.length} en filtros actuales)</div>
          </div>
          <div class="lead-stats-toggles">
            <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm${_leadStatsMode === 'mes' ? ' active' : ''}" data-lstats="mes">Por mes</button>
            <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm${_leadStatsMode === 'sem' ? ' active' : ''}" data-lstats="sem">Por semana</button>
          </div>
        </div>
        ${monthPicker}
        <div class="lead-stats-bars" role="img" aria-label="Gráfico de leads">${renderBars(buckets)}</div>
      </div>`;

    wrap.querySelectorAll('[data-lstats]').forEach((btn) => {
      btn.onclick = () => {
        _leadStatsMode = btn.dataset.lstats === 'sem' ? 'sem' : 'mes';
        renderLeadStats();
      };
    });
    const sel = document.getElementById('lead-stats-month-select');
    if (sel) {
      sel.onchange = () => {
        _leadStatsMonth = sel.value;
        renderLeadStats();
      };
    }
  }

  window.renderLeadStats = renderLeadStats;
})();