/** Import Idealista por lotes (evita timeout serverless). */
window.NH_IDEALISTA_CHUNK = 18;

window.mergeIdealistaImportStats = function (acc, part) {
  const out = acc || {
    ok: true,
    compradoresCreados: 0,
    compradoresActualizados: 0,
    interesesRegistrados: 0,
    sinVinculoInmueble: 0,
    idealistaSinMatch: [],
    errores: [],
  };
  if (!part) return out;
  out.compradoresCreados += part.compradoresCreados || 0;
  out.compradoresActualizados += part.compradoresActualizados || 0;
  out.interesesRegistrados += part.interesesRegistrados || 0;
  out.sinVinculoInmueble += part.sinVinculoInmueble || 0;
  const extra = part.idealistaSinMatch || [];
  const set = new Set([...(out.idealistaSinMatch || []), ...extra]);
  out.idealistaSinMatch = [...set];
  if (part.errores?.length) out.errores = out.errores.concat(part.errores);
  if (part.ok === false) out.ok = false;
  return out;
};

window.importIdealistaCompradoresChunked = async function (allRows, accessToken, opts) {
  const chunk = opts?.chunkSize || window.NH_IDEALISTA_CHUNK || 18;
  const onProgress = opts?.onProgress;
  const total = allRows.length;
  let acc = window.mergeIdealistaImportStats(null, {});
  for (let i = 0; i < total; i += chunk) {
    const slice = allRows.slice(i, i + chunk);
    const done = Math.min(i + slice.length, total);
    onProgress?.(done, total);
    const res = await fetch('/api/notify?__action=admin-import-idealista-compradores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify({ rows: slice }),
      signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout
        ? AbortSignal.timeout(90000)
        : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) {
      const err = new Error(json.error || `Error lote ${i / chunk + 1} (filas ${i + 1}-${done})`);
      err.partial = acc;
      throw err;
    }
    acc = window.mergeIdealistaImportStats(acc, json);
  }
  acc.ok = true;
  return acc;
};
