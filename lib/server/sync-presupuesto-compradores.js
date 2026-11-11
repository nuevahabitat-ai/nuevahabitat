import { backfillInteresFromCompradorNotas } from './idealista-interes-backfill.js';
import { inferAllCompradoresCriterios } from './comprador-infer-criterios.js';

export async function runSyncPresupuestoCompradores(opts = {}) {
  const backfill = await backfillInteresFromCompradorNotas({});
  const inferencia = await inferAllCompradoresCriterios({
    dryRun: opts.dryRun === true,
    onlySinPresupuesto: opts.all !== true,
    limit: opts.limit ?? 500,
  });
  return { ok: true, backfill, inferencia };
}
