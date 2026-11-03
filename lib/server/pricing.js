/** Precios públicos — import estático para funciones Vercel (evita createRequire). */
import {
  VENTA_PLANES,
  honorariosTotalForPlan,
  totalConIva,
} from './venta-planes.js';

export const VENTA_HONORARIOS_BASE_EUR = VENTA_PLANES.clasico.baseEur;
/** Total a cobrar vendedor plan clásico (base + 21% IVA). */
export const VENTA_HONORARIOS_TOTAL_IVA_EUR = honorariosTotalForPlan('clasico');
export const VENTA_DIGITAL_BASE_EUR = VENTA_PLANES.digital.baseEur;
export const VENTA_DIGITAL_TOTAL_IVA_EUR = honorariosTotalForPlan('digital');
export const VENTA_DIGITAL_COMERCIAL_BASE_EUR = VENTA_PLANES.digital_comercial_bcn.baseEur;
export const VENTA_DIGITAL_COMERCIAL_TOTAL_IVA_EUR = honorariosTotalForPlan('digital_comercial_bcn');
export const COMPRADOR_HONORARIOS_TOTAL_IVA_EUR = 6050;
export const VENTA_HONORARIOS_LABEL = `${VENTA_PLANES.clasico.baseEur.toLocaleString('es-ES')} € + IVA (${VENTA_HONORARIOS_TOTAL_IVA_EUR.toLocaleString('es-ES')} € IVA incl.)`;
export { VENTA_PLANES, honorariosTotalForPlan, totalConIva };

export const ADMIN_ALQUILER_MENSUAL_EUR = 59;
export const ALQUILER_INTEGRAL_EUR = 599;
export const ADMIN_ALQUILER_MENSUAL_LABEL = `${ADMIN_ALQUILER_MENSUAL_EUR} €/mes`;
export const ADMIN_ALQUILER_MENSUAL_IVA = `${ADMIN_ALQUILER_MENSUAL_EUR} €/mes IVA incluido`;
export const ALQUILER_INTEGRAL_LABEL = `${ALQUILER_INTEGRAL_EUR} € IVA incluido · pago único`;
export const ALQUILER_INTEGRAL_BADGE = `${ALQUILER_INTEGRAL_EUR} € IVA incluido · pago único`;
