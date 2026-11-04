/** Generado por scripts/build-landings.js — no editar a mano */
(function () {
  const NH_PLANS = {"digital":{"totalEur":2418.79,"label":"1.999 € + IVA"},"comercial":{"totalEur":3025,"label":"2.500 € + IVA"},"clasica":{"totalEur":4235,"label":"3.500 € + IVA"}};
  const DEFAULT_PLAN = "clasica";
  const NH_FEE = 4235;
  const DEFAULT_PCT = 6;

  function planFee(key) {
    const p = NH_PLANS[key] || NH_PLANS[DEFAULT_PLAN];
    return p ? p.totalEur : NH_FEE;
  }

  function planLabel(key) {
    const p = NH_PLANS[key] || NH_PLANS[DEFAULT_PLAN];
    return p ? p.label : '';
  }

  function formatEuro(n) {
    return Math.round(n).toLocaleString('es-ES') + ' €';
  }

  function calc(precio, pct, planKey) {
    const p = Number(precio) || 420000;
    const rate = Number(pct) || DEFAULT_PCT;
    const nhFee = planFee(planKey);
    const tradVal = Math.round(p * (rate / 100) * 1.21);
    const saveVal = Math.max(0, tradVal - nhFee);
    const total = tradVal + nhFee;
    const tradPct = Math.min(100, Math.round((tradVal / total) * 100)) || 50;
    return { p, rate, tradVal, saveVal, tradPct, nhPct: Math.max(8, 100 - tradPct), nhFee, nhLabel: planLabel(planKey) };
  }

  function track(eventName, params) {
    window.nhSeo?.track(eventName, params);
    window.nhAnalytics?.track?.(eventName, params);
  }

  function bindRoot(root) {
    const range = root.querySelector('#nh-sc-precio, #lc-precio, [data-lc-precio]');
    if (!range) return;

    const label = root.querySelector('#nh-sc-precio-label, #lc-precio-label');
    const saveEl = root.querySelector('#nh-sc-save, #lc-save');
    const tradEl = root.querySelector('#nh-sc-trad, #lc-trad');
    const tradInline = root.querySelector('#nh-sc-trad-inline');
    const barAgency = root.querySelector('#nh-sc-bar-agency');
    const barNh = root.querySelector('#nh-sc-bar-nh');
    const barNhAmt = root.querySelector('.nh-sc-bar-amount--gold');
    const nhBreakdown = root.querySelector('.nh-sc-breakdown-item--nh strong');
    const hint = root.querySelector('.nh-sc-save-hint');
    const pctBtns = root.querySelectorAll('.nh-sc-pct');
    const planSelect = root.querySelector('#nh-sc-plan');
    let pct = DEFAULT_PCT;
    let planKey = planSelect ? planSelect.value : DEFAULT_PLAN;
    let tracked = false;

    if (pctBtns.length) {
      const active = root.querySelector('.nh-sc-pct.is-active');
      if (active) pct = Number(active.dataset.pct) || DEFAULT_PCT;
    }

    function setPct(next) {
      pct = next;
      pctBtns.forEach((btn) => {
        const on = Number(btn.dataset.pct) === pct;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      upd();
    }

    function upd() {
      if (planSelect) planKey = planSelect.value || DEFAULT_PLAN;
      const { p, rate, tradVal, saveVal, tradPct, nhPct, nhLabel } = calc(range.value, pct, planKey);
      if (label) label.textContent = formatEuro(p);
      if (tradEl) tradEl.textContent = formatEuro(tradVal);
      if (tradInline) tradInline.textContent = formatEuro(tradVal);
      if (saveEl) {
        saveEl.textContent = formatEuro(saveVal);
        saveEl.dataset.value = String(saveVal);
      }
      if (barAgency) barAgency.style.width = tradPct + '%';
      if (barNh) barNh.style.width = nhPct + '%';
      if (barNhAmt) barNhAmt.textContent = nhLabel;
      if (nhBreakdown) nhBreakdown.textContent = nhLabel;
      if (hint) hint.textContent = 'respecto a agencia al ' + rate + '% + IVA';
      range.setAttribute('aria-valuenow', String(p));
    }

    range.addEventListener('input', () => {
      upd();
      if (!tracked) {
        tracked = true;
        track('calculator_interaction', {
          event_category: 'conversion',
          calculator_type: 'savings_vs_agency',
          precio: Number(range.value),
          comision_pct: pct,
        });
      }
    });

    pctBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        setPct(Number(btn.dataset.pct) || DEFAULT_PCT);
        track('calculator_commission_change', {
          event_category: 'engagement',
          comision_pct: pct,
          precio: Number(range.value),
        });
      });
    });

    if (planSelect) {
      planSelect.addEventListener('change', () => {
        upd();
        track('calculator_plan_change', {
          event_category: 'engagement',
          plan: planSelect.value,
          precio: Number(range.value),
        });
      });
    }

    upd();
  }

  function init() {
    document.querySelectorAll('[data-nh-savings-calc], [data-lc-calc], .nh-savings-calc').forEach(bindRoot);
    if (document.getElementById('nh-sc-precio') && !document.querySelector('[data-nh-savings-calc]')) {
      bindRoot(document);
    }
  }

  window.nhSavingsCalc = { init, calc, NH_PLANS, NH_FEE: planFee(DEFAULT_PLAN) };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
