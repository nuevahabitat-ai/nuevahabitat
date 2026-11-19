/**
 * Panel · sección Estadísticas (leads, compradores, inmuebles)
 */
(function () {
  let _estMode = 'mes';
  let _estWeekMonth = '';
  let _estTableSeg = '';
  let _estTableDays = '90';

  const SEG_LABEL = {
    vendedor: 'Vendedor',
    comprador: 'Comprador',
    alquiler_admin: 'Alquiler administración',
    alquiler_integral: 'Alquiler integral',
    otros: 'Otros',
  };

  function injectStyles() {
    if (document.getElementById('nh-est-styles')) return;
    const s = document.createElement('style');
    s.id = 'nh-est-styles';
    s.textContent = `
      .nh-est-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.75rem;margin-bottom:1.25rem}
      .nh-est-kpi{padding:.85rem 1rem;border-radius:10px;border:1px solid rgba(184,147,106,.22);background:rgba(0,0,0,.25)}
      .nh-est-kpi strong{display:block;font-size:1.65rem;color:#f3f4f6;line-height:1.1}
      .nh-est-kpi span{font-size:.72rem;color:var(--muted,#9ca3af)}
      .nh-est-card{margin-bottom:1rem;padding:1rem 1.1rem;border:1px solid rgba(184,147,106,.2);border-radius:10px;background:rgba(0,0,0,.18)}
      .nh-est-card h4{margin:0 0 .65rem;font-size:.92rem;color:var(--gold,#b8936a)}
      .nh-est-bars{display:flex;align-items:flex-end;gap:.4rem;min-height:110px;padding:.35rem 0;overflow-x:auto}
      .nh-est-bar-col{flex:1 1 0;min-width:38px;max-width:64px;display:flex;flex-direction:column;align-items:center;gap:.3rem}
      .nh-est-bar{width:100%;max-width:44px;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,rgba(184,147,106,.92),rgba(184,147,106,.4));min-height:3px}
      .nh-est-bar.muted-bar{background:rgba(100,100,100,.35)}
      .nh-est-bar-lbl{font-size:.62rem;color:var(--muted);text-align:center;line-height:1.1}
      .nh-est-bar-n{font-size:.7rem;font-weight:600}
      .nh-est-tools{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-bottom:.75rem}
      .nh-est-pills{display:flex;gap:.35rem}
      .nh-est-pills button.active{background:rgba(184,147,106,.2);border-color:var(--gold);color:var(--gold)}
      .nh-est-seg{font-size:.78rem;color:var(--muted);margin-top:.5rem}
      .nh-est-table-wrap{margin-top:.5rem;border:1px solid rgba(255,255,255,.06);border-radius:8px}
      .nh-est-leads-table th{position:sticky;top:0;background:#1a1a1a;z-index:1}
      .nh-est-lead-row:hover td{background:rgba(184,147,106,.08)}
      .nh-est-filters{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin:.5rem 0 .75rem;font-size:.8rem}
    `;
    document.head.appendChild(s);
  }

  function parseDate(row) {
    const iso = row?.created_at || row?.updated_at || row?.fecha_alta;
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
    return `${start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`;
  }

  function monthSeries(rows, monthsBack) {
    const now = new Date();
    const keys = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(ymKey(d));
    }
    const counts = Object.fromEntries(keys.map((k) => [k, 0]));
    for (const r of rows) {
      const d = parseDate(r);
      if (!d) continue;
      const k = ymKey(d);
      if (counts[k] != null) counts[k]++;
    }
    return keys.map((k) => {
      const [y, m] = k.split('-').map(Number);
      return {
        key: k,
        label: new Date(y, m - 1, 1).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        n: counts[k] || 0,
      };
    });
  }

  function weeksInMonth(ym) {
    const [y, m] = ym.split('-').map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);
    const weeks = [];
    let cur = weekStartMonday(start);
    while (cur <= end) {
      weeks.push(new Date(cur));
      cur = new Date(cur);
      cur.setDate(cur.getDate() + 7);
    }
    return weeks;
  }

  function weekSeries(rows, ymOrNull) {
    let starts;
    if (ymOrNull) {
      starts = weeksInMonth(ymOrNull);
    } else {
      const cur = weekStartMonday(new Date());
      starts = [];
      for (let i = 11; i >= 0; i--) {
        const w = new Date(cur);
        w.setDate(w.getDate() - i * 7);
        starts.push(w);
      }
    }
    const buckets = starts.map((start) => ({ start, label: formatWeekLabel(start), n: 0 }));
    for (const r of rows) {
      const d = parseDate(r);
      if (!d) continue;
      const ws = weekStartMonday(d).getTime();
      const b = buckets.find((x) => x.start.getTime() === ws);
      if (b) b.n++;
    }
    return buckets;
  }

  function barsHtml(buckets) {
    const max = Math.max(1, ...buckets.map((b) => b.n));
    return buckets
      .map((b) => {
        const h = Math.round((b.n / max) * 88) || (b.n ? 6 : 3);
        return `<div class="nh-est-bar-col" title="${b.label}: ${b.n}">
          <span class="nh-est-bar-n">${b.n}</span>
          <div class="nh-est-bar${b.n ? '' : ' muted-bar'}" style="height:${h}px"></div>
          <span class="nh-est-bar-lbl">${b.label}</span>
        </div>`;
      })
      .join('');
  }

  function leadRowsForStats(leads) {
    const fn = window.isAdminLeadsListRow;
    if (typeof fn !== 'function') return leads || [];
    return (leads || []).filter(fn);
  }

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function leadSegKey(l) {
    return typeof window.leadSegment === 'function' ? window.leadSegment(l) : 'otros';
  }

  function leadTipoLabel(l) {
    if (typeof window.leadCategoriaLabel === 'function') return window.leadCategoriaLabel(l);
    return SEG_LABEL[leadSegKey(l)] || 'Otros';
  }

  function formatFechaLead(d) {
    if (!d) return '—';
    return d.toLocaleString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function filterLeadsForTable(leadStats) {
    let rows = leadStats.slice();
    if (_estTableSeg) rows = rows.filter((l) => leadSegKey(l) === _estTableSeg);
    const now = new Date();
    if (_estTableDays === 'week') {
      const ws = weekStartMonday(now).getTime();
      rows = rows.filter((l) => {
        const d = parseDate(l);
        return d && weekStartMonday(d).getTime() === ws;
      });
    } else if (_estTableDays === 'month') {
      const tm = ymKey(now);
      rows = rows.filter((l) => {
        const d = parseDate(l);
        return d && ymKey(d) === tm;
      });
    } else if (_estTableDays !== 'all') {
      const days = parseInt(_estTableDays, 10) || 90;
      const cut = new Date(now);
      cut.setDate(cut.getDate() - days);
      cut.setHours(0, 0, 0, 0);
      rows = rows.filter((l) => {
        const d = parseDate(l);
        return d && d >= cut;
      });
    }
    rows.sort((a, b) => (parseDate(b)?.getTime() || 0) - (parseDate(a)?.getTime() || 0));
    return rows;
  }

  function leadsDetailTableHtml(rows) {
    if (!rows.length) return '<p class="text-muted">Ningún lead con estos filtros.</p>';
    const body = rows
      .map((l) => {
        const d = parseDate(l);
        const id = l.id || '';
        const canal =
          typeof window.leadEsRegistroPanel === 'function' && window.leadEsRegistroPanel(l)
            ? 'Panel admin'
            : 'Formulario web';
        return `<tr class="nh-est-lead-row" data-lead-id="${esc(id)}" title="Abrir en Leads">
          <td>${esc(formatFechaLead(d))}</td>
          <td><strong>${esc(l.nombre || 'Sin nombre')}</strong></td>
          <td>${esc(leadTipoLabel(l))}</td>
          <td>${esc(l.estado || '—')}</td>
          <td>${esc(canal)}</td>
          <td>${esc(l.telefono || '—')}</td>
          <td>${esc(l.email || '—')}</td>
        </tr>`;
      })
      .join('');
    return `<div class="nh-est-table-wrap">
      <table class="adm-table nh-est-leads-table">
        <thead><tr>
          <th>Fecha de llegada</th><th>Nombre</th><th>Tipo de lead</th><th>Estado</th><th>Canal</th><th>Teléfono</th><th>Email</th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
  }

  function bindLeadsTableClicks(root) {
    root.querySelectorAll('.nh-est-lead-row').forEach((tr) => {
      tr.onclick = () => {
        const id = tr.dataset.leadId;
        if (!id || String(id).startsWith('pa:')) {
          window.nhToast?.('Lead de alquiler: ábrelo desde la sección Leads.', 'info');
          if (typeof window.switchSection === 'function') window.switchSection('leads');
          return;
        }
        if (typeof window.switchSection === 'function') window.switchSection('leads');
        setTimeout(() => {
          if (typeof window.openLeadModal === 'function') window.openLeadModal(id);
        }, 180);
      };
    });
  }

  function leadSegmentCounts(leads) {
    const seg = (l) => (typeof window.leadSegment === 'function' ? window.leadSegment(l) : 'otros');
    const m = {};
    for (const l of leads) {
      const k = seg(l);
      m[k] = (m[k] || 0) + 1;
    }
    return m;
  }

  function countThisMonthWeek(rows) {
    const tm = ymKey(new Date());
    const ws = weekStartMonday(new Date()).getTime();
    let month = 0;
    let week = 0;
    for (const r of rows) {
      const d = parseDate(r);
      if (!d) continue;
      if (ymKey(d) === tm) month++;
      if (weekStartMonday(d).getTime() === ws) week++;
    }
    return { month, week };
  }

  async function fetchRows() {
    let leads = window._leadsData || [];
    if (!leads.length && typeof window.fetchAdminLeads === 'function') {
      try {
        const p = await window.fetchAdminLeads({ limit: 1000 });
        leads = p.data || [];
        window._leadsData = leads;
      } catch (e) {
        console.warn('estadisticas leads', e);
      }
    }
    let compradores = window._compData || [];
    if (!compradores.length && window.nhSupabase) {
      const { data } = await window.nhSupabase
        .from('compradores')
        .select('id,activo,created_at,descartado_at')
        .limit(2000);
      compradores = data || [];
    }
    let inmuebles = [];
    if (window.nhSupabase) {
      const { data } = await window.nhSupabase
        .from('inmuebles')
        .select('id,estado,created_at')
        .limit(2000);
      inmuebles = data || [];
    }
    const leadStats = leadRowsForStats(leads);
    return { leads, leadStats, compradores, inmuebles };
  }

  function monthOptionsFromRows(rows) {
    const set = new Set();
    for (const r of rows) {
      const d = parseDate(r);
      if (d) set.add(ymKey(d));
    }
    return [...set].sort().reverse();
  }

  async function renderEstadisticas(root) {
    injectStyles();
    root.innerHTML = '<p class="text-muted">Cargando estadísticas…</p>';
    const { leads, leadStats, compradores, inmuebles } = await fetchRows();

    const compActivos = compradores.filter((c) => c.activo !== false && !c.descartado_at).length;
    const compTotal = compradores.length;
    const inmPub = inmuebles.filter((i) => ['disponible', 'reservado'].includes(i.estado)).length;
    const inmTotal = inmuebles.length;
    const leadTw = countThisMonthWeek(leadStats);
    const compTw = countThisMonthWeek(compradores);
    const inmTw = countThisMonthWeek(inmuebles);

    const thisMonth = ymKey(new Date());
    if (!_estWeekMonth) _estWeekMonth = thisMonth;

    let leadBuckets;
    let weekSelect = '';
    if (_estMode === 'mes') {
      leadBuckets = monthSeries(leadStats, 12);
    } else {
      const months = monthOptionsFromRows(leadStats);
      if (months.length && !months.includes(_estWeekMonth)) _estWeekMonth = months[0];
      const opts = months
        .map((m) => {
          const [y, mo] = m.split('-');
          const lab = new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
          return `<option value="${m}"${m === _estWeekMonth ? ' selected' : ''}>${lab}</option>`;
        })
        .join('');
      weekSelect = `<label class="text-muted" style="font-size:.78rem">Mes: <select id="est-week-month" class="adm-control">${opts}</select></label>`;
      leadBuckets = weekSeries(leadStats, _estWeekMonth || thisMonth);
    }

    const seg = leadSegmentCounts(leadStats);
    const segTxt = Object.entries(seg)
      .map(([k, n]) => `${k}: ${n}`)
      .join(' · ');

    const sinFecha = leadStats.filter((l) => !parseDate(l)).length;
    const tableRows = filterLeadsForTable(leadStats);

    const segFilter = `
      <div class="nh-est-filters">
        <label class="text-muted">Tipo:
          <select id="est-lead-seg" class="adm-control" style="min-width:200px">
            <option value="">Todos los tipos</option>
            <option value="vendedor"${_estTableSeg === 'vendedor' ? ' selected' : ''}>Vendedor</option>
            <option value="comprador"${_estTableSeg === 'comprador' ? ' selected' : ''}>Comprador</option>
            <option value="alquiler_admin"${_estTableSeg === 'alquiler_admin' ? ' selected' : ''}>Alquiler administración</option>
            <option value="alquiler_integral"${_estTableSeg === 'alquiler_integral' ? ' selected' : ''}>Alquiler integral</option>
            <option value="otros"${_estTableSeg === 'otros' ? ' selected' : ''}>Otros</option>
          </select>
        </label>
        <label class="text-muted">Periodo:
          <select id="est-lead-days" class="adm-control">
            <option value="week"${_estTableDays === 'week' ? ' selected' : ''}>Esta semana</option>
            <option value="month"${_estTableDays === 'month' ? ' selected' : ''}>Este mes</option>
            <option value="30"${_estTableDays === '30' ? ' selected' : ''}>Últimos 30 días</option>
            <option value="90"${_estTableDays === '90' ? ' selected' : ''}>Últimos 90 días</option>
            <option value="all"${_estTableDays === 'all' ? ' selected' : ''}>Todos (con fecha)</option>
          </select>
        </label>
        <span class="text-muted">${tableRows.length} fila(s)</span>
      </div>`;

    root.innerHTML = `
      <div class="nh-est-tools">
        <div class="nh-est-pills">
          <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm${_estMode === 'mes' ? ' active' : ''}" data-est-mode="mes">Leads · mensual</button>
          <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm${_estMode === 'sem' ? ' active' : ''}" data-est-mode="sem">Leads · semanal</button>
        </div>
        ${weekSelect}
        <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" id="est-refresh">Actualizar</button>
      </div>
      <div class="nh-est-grid">
        <div class="nh-est-kpi"><strong>${leadStats.length}</strong><span>Leads (listado panel)${sinFecha ? ` · ${sinFecha} sin fecha` : ''}</span></div>
        <div class="nh-est-kpi"><strong>${leadTw.month}</strong><span>Leads este mes</span></div>
        <div class="nh-est-kpi"><strong>${leadTw.week}</strong><span>Leads esta semana</span></div>
        <div class="nh-est-kpi"><strong>${compActivos}</strong><span>Compradores activos (${compTotal} total)</span></div>
        <div class="nh-est-kpi"><strong>${inmPub}</strong><span>Inmuebles publicados (${inmTotal} total)</span></div>
        <div class="nh-est-kpi"><strong>${compTw.month}</strong><span>Altas compradores · mes</span></div>
        <div class="nh-est-kpi"><strong>${inmTw.month}</strong><span>Altas inmuebles · mes</span></div>
      </div>
      <div class="nh-est-card">
        <h4>Llegada de leads (resumen)</h4>
        <div class="nh-est-bars">${barsHtml(leadBuckets)}</div>
        <p class="nh-est-seg">${segTxt || 'Sin desglose'}</p>
      </div>
      <div class="nh-est-card">
        <h4>Detalle de leads</h4>
        <p class="text-muted" style="font-size:.78rem;margin:0 0 .5rem">Nombre, día y hora de llegada, tipo (vendedor, comprador, alquiler…) y canal. Clic en una fila → abrir en Leads.</p>
        ${segFilter}
        ${leadsDetailTableHtml(tableRows)}
      </div>
      <div class="nh-est-card">
        <h4>Altas de compradores (últimos 12 meses)</h4>
        <div class="nh-est-bars">${barsHtml(monthSeries(compradores, 12))}</div>
      </div>
      <div class="nh-est-card">
        <h4>Altas de inmuebles en cartera (últimos 12 meses)</h4>
        <div class="nh-est-bars">${barsHtml(monthSeries(inmuebles, 12))}</div>
      </div>
      <p class="text-muted" style="font-size:.72rem;margin-top:.5rem">Las fechas usan <code>created_at</code> (o <code>updated_at</code> si falta). Los leads sin fecha no entran en las barras.</p>`;

    root.querySelectorAll('[data-est-mode]').forEach((btn) => {
      btn.onclick = () => {
        _estMode = btn.dataset.estMode === 'sem' ? 'sem' : 'mes';
        renderEstadisticas(root);
      };
    });
    const sel = root.querySelector('#est-week-month');
    if (sel) {
      sel.onchange = () => {
        _estWeekMonth = sel.value;
        renderEstadisticas(root);
      };
    }
    root.querySelector('#est-refresh')?.addEventListener('click', () => {
      window._leadsData = [];
      window._compData = [];
      renderEstadisticas(root);
    });
    const segSel = root.querySelector('#est-lead-seg');
    const daysSel = root.querySelector('#est-lead-days');
    if (segSel) {
      segSel.onchange = () => {
        _estTableSeg = segSel.value || '';
        renderEstadisticas(root);
      };
    }
    if (daysSel) {
      daysSel.onchange = () => {
        _estTableDays = daysSel.value || '90';
        renderEstadisticas(root);
      };
    }
    bindLeadsTableClicks(root);
  }

  window.loadEstadisticas = async function () {
    const root = document.getElementById('estadisticas-root');
    if (!root) return;
    await renderEstadisticas(root);
  };

  /** Desactiva el widget antiguo dentro de Leads */
  window.renderLeadStats = function () {
    const old = document.getElementById('leads-stats-wrap');
    if (old) old.remove();
  };
})();