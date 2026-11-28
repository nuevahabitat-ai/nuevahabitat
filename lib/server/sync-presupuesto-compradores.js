import { backfillInteresFromCompradorNotas } from './idealista-interes-backfill.js';
import { inferAllCompradoresCriterios } from './comprador-infer-criterios.js';
import { warmYCompletarFichasIdealista } from './idealista-compradores-post-import.js';
import { backfillPresupuestoByIdealistaIds } from './comprador-presupuesto-idealista-id.js';

export async function runSyncPresupuestoCompradores(opts = {}) {
  const backfill = await backfillInteresFromCompradorNotas({});
  const porIdealistaId = await backfillPresupuestoByIdealistaIds({
    limit: opts.limit ?? 500,
    maxScrape: opts.maxScrape ?? 100,
    dryRun: opts.dryRun === true,
    forceAll: opts.all === true || opts.forceAll === true,
  });
  const idealista = await warmYCompletarFichasIdealista({
    maxScrape: opts.maxScrape ?? 80,
    limit: opts.limit ?? 500,
    fetchListing: opts.skipScrape !== true,
  });
  const inferencia = await inferAllCompradoresCriterios({
    dryRun: opts.dryRun === true,
    onlySinPresupuesto: opts.all !== true,
    limit: opts.limit ?? 500,
  });
  const { batchPrecioPisoCompradores } = await import('./comprador-precio-piso.js');
  const batch = await batchPrecioPisoCompradores({
    onlySinPresupuesto: true,
    limit: opts.limit ?? 250,
    persist: opts.dryRun !== true,
    skipScrape: opts.skipScrape === true,
    idealistaOnly: opts.all !== true && opts.forceAll !== true,
    onlyIfEmpty: false,
    fillAllFromPiso: true,
    alwaysPresupuesto: true,
  });
  return { ok: true, backfill, porIdealistaId, idealista, inferencia, batch };
}
