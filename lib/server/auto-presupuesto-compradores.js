/**
 * Compraventa automática: máx. = precio anuncio consultado, mín. = máx. − 50.000 €.
 */
import { backfillPresupuestoByIdealistaIds } from './comprador-presupuesto-idealista-id.js';
import { batchPrecioPisoCompradores } from './comprador-precio-piso.js';
import { autoLinkIdealistaInmuebles } from './link-idealista-inmuebles.js';
import { syncCompradorFichasDesdeAnuncio } from './comprador-ficha-idealista-sync.js';

export async function runAutoPresupuestoCompradores(opts = {}) {
  const maxScrape = Math.min(Number(opts.maxScrape) || 100, 150);
  const limit = Math.min(Number(opts.limit) || 500, 500);
  const skipLinkInmuebles = opts.skipLinkInmuebles === true;

  let vinculos = null;
  if (!skipLinkInmuebles && opts.dryRun !== true) {
    try {
      vinculos = await autoLinkIdealistaInmuebles({ dryRun: false, onlySinId: true });
    } catch (e) {
      vinculos = { ok: false, error: e.message };
    }
  }

  const fichas = await syncCompradorFichasDesdeAnuncio({
    limit,
    maxScrape,
    dryRun: opts.dryRun === true,
    compradorIds: opts.compradorIds,
    fetchListing: opts.skipScrape !== true,
  });

  const porIdealistaId = await backfillPresupuestoByIdealistaIds({
    limit,
    maxScrape,
    dryRun: opts.dryRun === true,
    compradorIds: opts.compradorIds,
  });

  let batch = null;
  if (opts.dryRun !== true) {
    batch = await batchPrecioPisoCompradores({
      ids: opts.compradorIds,
      onlySinPresupuesto: true,
      limit: opts.compradorIds?.length ? Math.min(opts.compradorIds.length, 250) : 200,
      persist: true,
      skipScrape: opts.skipScrape === true,
      idealistaOnly: false,
      onlyIfEmpty: false,
      fillAllFromPiso: true,
      alwaysPresupuesto: true,
    });
  }

  return {
    ok: true,
    vinculos,
    fichas,
    porIdealistaId,
    batch,
    actualizados:
      (fichas?.actualizadas ?? 0) +
      (porIdealistaId?.actualizados ?? 0) +
      (batch?.updated ?? 0) +
      (vinculos?.vinculados ?? 0),
  };
}