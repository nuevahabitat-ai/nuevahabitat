/** Honorarios venta particulares — fuente única para build y calculadora */
const NH_FEE_BASE_EUR = 3000;
const NH_FEE_TOTAL_EUR = 3630; // base + 21% IVA, cobro en escritura
const NH_FEE_LABEL = '3.000 € + IVA';
const NH_FEE_LABEL_ESCRITURA = '3.000 € + IVA (3.630 € en escritura)';
const NH_FEE_LABEL_COMPACT = '3.000€ + IVA';

module.exports = {
  NH_FEE_BASE_EUR,
  NH_FEE_TOTAL_EUR,
  NH_FEE_EUR: NH_FEE_TOTAL_EUR,
  NH_FEE_LABEL,
  NH_FEE_LABEL_ESCRITURA,
  NH_FEE_LABEL_COMPACT,
};
