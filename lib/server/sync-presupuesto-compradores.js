import { backfillInteresFromCompradorNotas } from './idealista-interes-backfill.js';
import { inferAllCompradoresCriterios } from './comprador-infer-criterios.js';
import { warmYCompletarFichasIdealista } from './idealista-compradores-post-import.js';

export async function runSyncPresupuestoCompradores(opts = {}) {
  const backfill = await backfillInteresFromCompradorNotas({});
  const idealista = await warmYCompletarFichasIdealista({
    maxScrape: opts.maxScrape ?? 55,
    limit: opts.limit ?? 500,
  });
  const inferencia = await inferAllCompradoresCriterios({
    dryRun: opts.dryRun === true,
    onlySinPresupuesto: opts.all !== true,
    limit: opts.limit ?? 500,
  });
  return { ok: true, backfill, idealista, inferencia };
}
