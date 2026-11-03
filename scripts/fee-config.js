/** Honorarios venta particulares — fuente única para build y calculadora (plan clásico) */
const NH_FEE_BASE_EUR = 3500;
const NH_FEE_TOTAL_EUR = Math.round(NH_FEE_BASE_EUR * 1.21 * 100) / 100;
const NH_FEE_LABEL = '3.500 € + IVA';
const NH_FEE_LABEL_ESCRITURA = `3.500 € + IVA (${NH_FEE_TOTAL_EUR.toLocaleString('es-ES')} € IVA incl.)`;
const NH_FEE_LABEL_COMPACT = '3.500€ + IVA';

module.exports = {
  NH_FEE_BASE_EUR,
  NH_FEE_TOTAL_EUR,
  NH_FEE_EUR: NH_FEE_TOTAL_EUR,
  NH_FEE_LABEL,
  NH_FEE_LABEL_ESCRITURA,
  NH_FEE_LABEL_COMPACT,
};
