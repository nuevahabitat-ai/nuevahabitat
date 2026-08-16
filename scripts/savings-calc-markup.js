/** Markup compartido calculadora ahorro — build landings + vender.html */
const NH_FEE_EUR = 3630;
const DEFAULT_PCT = 6;

function calcValues(precio, pct = DEFAULT_PCT) {
  const p = Number(precio) || 420000;
  const rate = Number(pct) || DEFAULT_PCT;
  const tradVal = Math.round(p * (rate / 100) * 1.21);
  const save = Math.max(0, tradVal - NH_FEE_EUR);
  const pctLabel = rate.toFixed(rate % 1 ? 1 : 0);
  return {
    precio: p,
    pct: rate,
    precioFmt: p.toLocaleString('es-ES'),
    tradFmt: tradVal.toLocaleString('es-ES') + ' €',
    saveFmt: save.toLocaleString('es-ES') + ' €',
    tradVal,
    saveVal: save,
    nhFmt: NH_FEE_EUR.toLocaleString('es-ES') + ' €',
    tradPct: Math.min(100, Math.round((tradVal / (tradVal + NH_FEE_EUR)) * 100)) || 50,
    nhPct: Math.max(8, 100 - Math.min(100, Math.round((tradVal / (tradVal + NH_FEE_EUR)) * 100))),
  };
}

function savingsCalcMarkup(opts = {}) {
  const c = calcValues(opts.precio || opts.precioDefault || 420000, opts.pct || DEFAULT_PCT);
  const titulo = opts.titulo || 'Compara honorarios de agencia vs precio fijo';
  const subtitulo = opts.subtitulo || 'Introduce el precio de venta estimado y el porcentaje de comisión habitual en Barcelona. NuevaHabitat cobra 3.000 € + IVA, solo en escritura.';
  const dark = opts.dark !== false;
  const sectionCls = dark ? 'nh-savings-calc-section nh-savings-calc-section--dark' : 'nh-savings-calc-section';
  const cta = opts.ctaHref || '#valorar';
  const ctaLabel = opts.ctaLabel || 'Solicitar valoración gratuita';

  const pctBtn = (n) => {
    const on = n === c.pct ? ' is-active' : '';
    return `<button type="button" class="nh-sc-pct${on}" data-pct="${n}" aria-pressed="${n === c.pct}">${n}%</button>`;
  };

  return `<section class="${sectionCls}" id="calc">
  <div class="container">
    <div class="nh-savings-calc-head fade-up">
      <span class="overline">Comparativa de honorarios</span>
      <h2 class="section-title${dark ? ' light' : ''}">${titulo}</h2>
      <p class="nh-savings-calc-sub${dark ? ' light' : ''}">${subtitulo}</p>
    </div>
    <div class="nh-savings-calc fade-up" data-nh-savings-calc data-lc-calc>
      <div class="nh-sc-panel nh-sc-panel--controls">
        <div class="nh-sc-field">
          <div class="nh-sc-field-top">
            <label for="nh-sc-precio">Precio de venta estimado</label>
            <output id="nh-sc-precio-label" for="nh-sc-precio" class="nh-sc-price-out">${c.precioFmt} €</output>
          </div>
          <input type="range" id="nh-sc-precio" class="nh-sc-range" min="150000" max="1500000" step="10000" value="${c.precio}" aria-valuemin="150000" aria-valuemax="1500000" aria-valuenow="${c.precio}"/>
          <div class="nh-sc-range-labels"><span>150.000 €</span><span>1,5 M€</span></div>
        </div>
        <div class="nh-sc-field">
          <span class="nh-sc-field-label">Comisión agencia tradicional</span>
          <div class="nh-sc-pct-row" role="group" aria-label="Porcentaje de comisión">
            ${pctBtn(3)}${pctBtn(4)}${pctBtn(5)}${pctBtn(6)}
          </div>
        </div>
        <p class="nh-sc-note">Cálculo orientativo: comisión + IVA (21%) frente a 3.000 € + IVA de NuevaHabitat, cobrados únicamente en escritura.</p>
      </div>
      <div class="nh-sc-panel nh-sc-panel--viz">
        <div class="nh-sc-save-block">
          <span class="nh-sc-save-label">Ahorro estimado</span>
          <div class="nh-sc-save-value" id="nh-sc-save" data-value="${c.saveVal}">${c.saveFmt}</div>
          <span class="nh-sc-save-hint">respecto a agencia al ${c.pct}% + IVA</span>
        </div>
        <div class="nh-sc-bars" aria-hidden="true">
          <div class="nh-sc-bar-row">
            <span class="nh-sc-bar-name">Agencia ~${c.pct}% + IVA</span>
            <div class="nh-sc-bar-track"><div class="nh-sc-bar-fill nh-sc-bar-fill--agency" id="nh-sc-bar-agency" style="width:${c.tradPct}%"></div></div>
            <span class="nh-sc-bar-amount" id="nh-sc-trad">${c.tradFmt}</span>
          </div>
          <div class="nh-sc-bar-row">
            <span class="nh-sc-bar-name">NuevaHabitat</span>
            <div class="nh-sc-bar-track"><div class="nh-sc-bar-fill nh-sc-bar-fill--nh" id="nh-sc-bar-nh" style="width:${c.nhPct}%"></div></div>
            <span class="nh-sc-bar-amount nh-sc-bar-amount--gold">${c.nhFmt}</span>
          </div>
        </div>
        <div class="nh-sc-breakdown">
          <div class="nh-sc-breakdown-item">
            <span>Honorarios agencia</span>
            <strong id="nh-sc-trad-inline">${c.tradFmt}</strong>
          </div>
          <div class="nh-sc-breakdown-item nh-sc-breakdown-item--nh">
            <span>NuevaHabitat (escritura)</span>
            <strong>${c.nhFmt}</strong>
          </div>
        </div>
        <a href="${cta}" class="btn btn-gold nh-sc-cta">${ctaLabel}</a>
      </div>
    </div>
  </div>
</section>`;
}

module.exports = { savingsCalcMarkup, calcValues, NH_FEE_EUR };
