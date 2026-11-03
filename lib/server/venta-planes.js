/** Planes de venta vendedor — base + IVA, cobro 50 % contrato + 50 % escritura */

export const VENTA_IVA = 0.21;

export const VENTA_PLANES = {
  clasico: {
    id: 'clasico',
    baseEur: 3500,
    title: 'Venta clásica',
    shortTitle: 'Clásica',
    scope: 'Barcelona y área metropolitana',
    visitsBy: 'Equipo NuevaHabitat',
  },
  digital: {
    id: 'digital',
    baseEur: 1999,
    title: 'Venta 100 % digital',
    shortTitle: 'Digital',
    scope: 'Barcelona (expansión nacional)',
    visitsBy: 'Propietario (visitas cualificadas)',
  },
  digital_comercial_bcn: {
    id: 'digital_comercial_bcn',
    baseEur: 2500,
    title: 'Venta digital + comercial',
    shortTitle: 'Digital + comercial',
    scope: 'Solo Barcelona',
    visitsBy: 'Comercial NuevaHabitat in situ',
  },
};

export function totalConIva(baseEur) {
  return Math.round(Number(baseEur) * (1 + VENTA_IVA) * 100) / 100;
}

export function eurosToCents(amount) {
  return Math.round(Number(amount) * 100);
}

/** Mitad 1 y mitad 2 en céntimos (suma exacta al total). */
export function mitadImporteCents(totalConIvaEur, fase) {
  const totalCents = eurosToCents(totalConIvaEur);
  const first = Math.floor(totalCents / 2);
  if (fase === 1) return first;
  return totalCents - first;
}

export function mitadImporteEur(totalConIvaEur, fase) {
  return mitadImporteCents(totalConIvaEur, fase) / 100;
}

export function getVentaPlan(planId) {
  return VENTA_PLANES[planId] || VENTA_PLANES.clasico;
}

export function honorariosTotalForPlan(planId) {
  return totalConIva(getVentaPlan(planId).baseEur);
}

export function vendedorLegacyFullyPaid(row) {
  return !!row?.honorarios_pagado && !row?.honorarios_pago_inicial_pagado && !row?.honorarios_pago_final_pagado;
}

export function vendedorServicioActivo(row) {
  if (!row) return false;
  if (vendedorLegacyFullyPaid(row)) return true;
  if (row.honorarios_pagado && row.honorarios_pago_inicial_pagado && row.honorarios_pago_final_pagado) return true;
  return !!row.honorarios_pago_inicial_pagado;
}

export function vendedorPagoFaseActual(row) {
  if (!row) return 1;
  if (row.honorarios_pagado || (row.honorarios_pago_inicial_pagado && row.honorarios_pago_final_pagado)) return 0;
  if (row.honorarios_pago_inicial_pagado) return 2;
  return 1;
}

export function vendedorPuedePagarFase2(row) {
  if (!row?.honorarios_pago_inicial_pagado || row.honorarios_pago_final_pagado) return false;
  if (row.pago_final_habilitado) return true;
  return row.estado_expediente === 'escritura' || row.estado_expediente === 'cerrado';
}
