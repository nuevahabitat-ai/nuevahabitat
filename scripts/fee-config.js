/** Honorarios venta particulares — fuente única para build y calculadora */
const NH_PLANS = {
  digital: {
    key: 'digital',
    baseEur: 1999,
    totalEur: Math.round(1999 * 1.21 * 100) / 100,
    label: '1.999 € + IVA',
    registro: 'digital',
  },
  comercial: {
    key: 'comercial',
    baseEur: 2500,
    totalEur: Math.round(2500 * 1.21 * 100) / 100,
    label: '2.500 € + IVA',
    registro: 'digital_comercial_bcn',
  },
  clasica: {
    key: 'clasica',
    baseEur: 3500,
    totalEur: Math.round(3500 * 1.21 * 100) / 100,
    label: '3.500 € + IVA',
    registro: 'clasico',
  },
};

const NH_FEE_BASE_EUR = NH_PLANS.clasica.baseEur;
const NH_FEE_TOTAL_EUR = NH_PLANS.clasica.totalEur;
const NH_FEE_LABEL = NH_PLANS.clasica.label;
const NH_FEE_LABEL_ESCRITURA = `${NH_FEE_LABEL} (honorarios fijos · 50 % contrato + 50 % escritura)`;
const NH_FEE_LABEL_COMPACT = '3.500€ + IVA';

module.exports = {
  NH_PLANS,
  NH_FEE_BASE_EUR,
  NH_FEE_TOTAL_EUR,
  NH_FEE_EUR: NH_FEE_TOTAL_EUR,
  NH_FEE_LABEL,
  NH_FEE_LABEL_ESCRITURA,
  NH_FEE_LABEL_COMPACT,
};
