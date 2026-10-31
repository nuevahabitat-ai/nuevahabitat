/** Precios públicos — import estático para funciones Vercel (evita createRequire). */
export const VENTA_HONORARIOS_BASE_EUR = 3000;
/** Total a cobrar vendedor (base + 21% IVA), p. ej. Stripe / operaciones. */
export const VENTA_HONORARIOS_TOTAL_IVA_EUR = 3630;
export const COMPRADOR_HONORARIOS_TOTAL_IVA_EUR = 6050;
export const VENTA_HONORARIOS_LABEL = '3.000 € + IVA (3.630 € en escritura)';

export const ADMIN_ALQUILER_MENSUAL_EUR = 59;
export const ALQUILER_INTEGRAL_EUR = 599;
export const ADMIN_ALQUILER_MENSUAL_LABEL = `${ADMIN_ALQUILER_MENSUAL_EUR} €/mes`;
export const ADMIN_ALQUILER_MENSUAL_IVA = `${ADMIN_ALQUILER_MENSUAL_EUR} €/mes IVA incluido`;
export const ALQUILER_INTEGRAL_LABEL = `${ALQUILER_INTEGRAL_EUR} € IVA incluido · pago único`;
export const ALQUILER_INTEGRAL_BADGE = `${ALQUILER_INTEGRAL_EUR} € IVA incluido · pago único`;
