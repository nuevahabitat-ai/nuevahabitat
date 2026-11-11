/**
 * Infiere criterios del comprador desde pisos que ha consultado (interés Idealista, NH en notas, José…).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { normalizeIdealistaId } from './idealista-id.js';
import { getIdealistaPrecioCache } from './idealista-precio-cache.js';
import { parseWhatsappCompradorPatch } from './alfredo-comprador-parse.js';

export const PRESUPUESTO_MARGEN_INFER = 50_000;

function parseEuroFromText(text) {
  const s = String(text || '');
  const found = [];
  const entre = s.match(
    /entre\s+(\d{1,3}(?:\.\d{3})*|\d{5,7})\s*(?:€|euros?)?\s*y\s*(\d{1,3}(?:\.\d{3})*|\d{5,7})\s*(?:€|euros?)/i,
  );
  if (entre) {
    for (const g of [entre[1], entre[2]]) {
      const n = parseInt(String(g).replace(/\./g, ''), 10);
      if (n >= 40_000 && n <= 9_000_000) found.push(n);
    }
  }
  const hasta = s.match(/(?:hasta|m[aá]ximo|presupuesto)\s*(?:de\s*)?(\d{1,3}(?:\.\d{3})+|\d{5,7})\s*(?:€|euros?)/i);
  if (hasta) {
    const n = parseInt(String(hasta[1]).replace(/\./g, ''), 10);
    if (n >= 40_000 && n <= 9_000_000) found.push(n);
  }
  for (const m of s.matchAll(/(\d{1,3}(?:\.\d{3})+|\d{5,7})\s*(?:€|euros?)/gi)) {
    const n = parseInt(String(m[1]).replace(/\./g, ''), 10);
    if (n >= 40_000 && n <= 9_000_000) found.push(n);
  }
  for (const m of s.matchAll(/(?:precio|venta)\s*[:\s]*(\d{1,3}(?:\.\d{3})+)/gi)) {
    const n = parseInt(String(m[1]).replace(/\./g, ''), 10);
    if (n >= 40_000 && n <= 9_000_000) found.push(n);
  }
  return found;
}

function parseHabFromText(text) {
  const m = String(text || '').match(/(\d+)\s*hab/i);
  return m ? parseInt(m[1], 10) : null;
}

const NH_REF = /\b(NH-\d{4}-\d+)\b/gi;

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

async function fetchInmueblesByIds(ids) {
  if (!ids.length) return [];
  const inList = ids.map((id) => encodeURIComponent(id)).join(',');
  const res = await fetch(
    `${SB_URL}/rest/v1/inmuebles?id=in.(${inList})&select=id,ref,precio,habitaciones,banos,m2_utiles,m2_construidos,ascensor,tipo,barrio,municipio,balcon,terraza&limit=200`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return [];
  return res.json();
}

async function fetchInmueblesByRefs(refs) {
  if (!refs.length) return [];
  const or = refs.map((r) => `ref.eq.${encodeURIComponent(r)}`).join(',');
  const res = await fetch(
    `${SB_URL}/rest/v1/inmuebles?or=(${or})&select=id,ref,precio,habitaciones,banos,m2_utiles,m2_construidos,ascensor,tipo,barrio,municipio,balcon,terraza,idealista_id&limit=200`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return [];
  return res.json();
}

async function fetchInmueblesByIdealistaIds(ids) {
  if (!ids.length) return [];
  const or = ids.map((id) => `idealista_id.eq.${encodeURIComponent(id)}`).join(',');
  const res = await fetch(
    `${SB_URL}/rest/v1/inmuebles?or=(${or})&select=id,ref,precio,habitaciones,banos,m2_utiles,m2_construidos,ascensor,tipo,barrio,municipio,balcon,terraza,idealista_id&limit=200`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return [];
  return res.json();
}

async function scrapeIdealistaListing(idealistaId) {
  const id = String(idealistaId || '').trim();
  if (!id) return null;
  try {
    const base = process.env.NH_PUBLIC_URL || 'https://www.nuevahabitat.com';
    const res = await fetch(`${base}/api/import-particular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: `https://www.idealista.com/es/inmueble/${id}/` }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok || !json.data) return null;
    const d = json.data;
    const precio = d.precio != null ? Number(d.precio) : parseEuroFromText(String(d.titulo || ''))[0];
    return {
      precio: Number.isFinite(precio) ? precio : null,
      habitaciones: d.habitaciones != null ? Number(d.habitaciones) : null,
      m2: d.m2 != null ? Number(d.m2) : null,
      ascensor: d.ascensor === true || d.ascensor === 'si',
      zona: [d.barrio, d.municipio, d.zona].filter(Boolean).join(', '),
      tipo: d.tipo || 'piso',
    };
  } catch {
    return null;
  }
}

async function fetchInteres(compradorId) {
  const q = (cols) =>
    `${SB_URL}/rest/v1/comprador_inmueble_interes?comprador_id=eq.${encodeURIComponent(compradorId)}&select=${cols}&limit=100`;
  let res = await fetch(q('inmueble_id,inmueble_ref,idealista_id,descripcion,mensaje,precio_consultado'), {
    headers: svcHeaders(),
  });
  if (!res.ok) {
    const err = await res.text();
    if (/precio_consultado/.test(err)) {
      res = await fetch(q('inmueble_id,inmueble_ref,idealista_id,descripcion,mensaje'), { headers: svcHeaders() });
    }
    if (!res.ok) return [];
  }
  return res.json();
}

function snapshotFromInmueble(inm) {
  if (!inm) return null;
  const precio = inm.precio != null ? Number(inm.precio) : null;
  const m2 = Number(inm.m2_utiles) || Number(inm.m2_construidos) || null;
  return {
    ref: inm.ref,
    precio: Number.isFinite(precio) ? precio : null,
    habitaciones: inm.habitaciones != null ? Number(inm.habitaciones) : null,
    banos: inm.banos != null ? Number(inm.banos) : null,
    m2,
    ascensor: !!inm.ascensor,
    tipo: inm.tipo || null,
    zona: [inm.barrio, inm.municipio].filter(Boolean).join(', '),
    balcon: !!(inm.balcon || inm.terraza),
  };
}

/**
 * @returns {{ signals: object[], refs: string[] }}
 */
export async function collectCompradorPropertySignals(comprador, opts = {}) {
  const signals = [];
  const notas = String(comprador.notas || '');

  for (const p of parseEuroFromText(notas)) {
    signals.push({ precio: p, source: 'notas_precio' });
  }
  const habN = parseHabFromText(notas);
  if (habN) signals.push({ habitaciones: habN, source: 'notas_hab' });

  const refs = unique([...notas.matchAll(NH_REF)].map((m) => m[1].toUpperCase()));
  const interes = await fetchInteres(comprador.id);
  const inmIds = unique(interes.map((r) => r.inmueble_id).filter(Boolean));
  const refs2 = unique(interes.map((r) => r.inmueble_ref).filter(Boolean));
  const idealistaIds = unique([
    ...interes.map((r) => r.idealista_id).filter(Boolean),
    ...[...notas.matchAll(/\bIdealista\s+(\d{6,})\b/gi)].map((m) => normalizeIdealistaId(m[1])),
    ...[...notas.matchAll(/idealista\.com\/[^/]*\/inmueble\/(\d{5,})/gi)].map((m) =>
      normalizeIdealistaId(m[1]),
    ),
  ].filter(Boolean));
  const allRefs = unique([...refs, ...refs2]);

  const inmuebles = [
    ...(await fetchInmueblesByIds(inmIds)),
    ...(await fetchInmueblesByRefs(allRefs)),
    ...(await fetchInmueblesByIdealistaIds(idealistaIds)),
  ];
  const byId = new Map();
  for (const inm of inmuebles) {
    if (inm?.id) byId.set(inm.id, inm);
    if (inm?.ref) byId.set(inm.ref, inm);
  }

  for (const inm of inmuebles) {
    const snap = snapshotFromInmueble(inm);
    if (snap) signals.push({ ...snap, source: 'inmueble_nh' });
  }

  for (const iid of idealistaIds) {
    const cached = await getIdealistaPrecioCache(iid);
    if (cached?.precio) {
      signals.push({
        precio: Number(cached.precio),
        habitaciones: cached.habitaciones,
        source: 'idealista_cache',
      });
    }
  }

  const hasPrice = signals.some((s) => s.precio != null);
  if (!hasPrice && !opts.skipScrape && idealistaIds.length) {
    for (const iid of idealistaIds.slice(0, 4)) {
      const snap = await scrapeIdealistaListing(iid);
      if (snap) {
        signals.push({ ...snap, source: 'idealista_scrape' });
        if (snap.precio) break;
      }
    }
  }

  for (const row of interes) {
    if (row.precio_consultado != null && Number(row.precio_consultado) > 0) {
      signals.push({ precio: Number(row.precio_consultado), source: 'interes_precio' });
    }
    const blob = [row.descripcion, row.mensaje].filter(Boolean).join(' ');
    for (const p of parseEuroFromText(blob)) signals.push({ precio: p, source: 'idealista_texto' });
    if (row.mensaje) {
      const parsed = parseWhatsappCompradorPatch(row.mensaje);
      if (parsed.presupuesto_max != null) {
        signals.push({ precio: Number(parsed.presupuesto_max), source: 'mensaje_presupuesto' });
      }
    }
    const hab = parseHabFromText(blob);
    if (hab) signals.push({ habitaciones: hab, source: 'idealista_hab' });
    if (row.descripcion) {
      const zona = String(row.descripcion)
        .replace(/.*en venta en\s+/i, '')
        .replace(/\s*·.*$/, '')
        .trim()
        .slice(0, 120);
      if (zona.length > 5 && !/^piso en /i.test(zona)) signals.push({ zona, source: 'idealista_zona' });
    }
    if (row.inmueble_id && byId.has(row.inmueble_id)) continue;
    if (row.inmueble_ref && byId.has(row.inmueble_ref)) continue;
  }

  return { signals, refs: allRefs };
}

export function aggregateInferredCriteria(signals, opts = {}) {
  const margen = opts.margen ?? PRESUPUESTO_MARGEN_INFER;
  const precios = signals.map((s) => s.precio).filter((p) => Number.isFinite(p));
  const habs = signals.map((s) => s.habitaciones).filter((h) => Number.isFinite(h) && h > 0);
  const banos = signals.map((s) => s.banos).filter((b) => Number.isFinite(b) && b > 0);
  const m2s = signals.map((s) => s.m2).filter((m) => Number.isFinite(m) && m > 0);
  const ascensorVotes = signals.filter((s) => s.ascensor === true);
  const balconVotes = signals.filter((s) => s.balcon === true);
  const zonas = signals.map((s) => s.zona).filter(Boolean);
  const tipos = signals.map((s) => s.tipo).filter(Boolean);

  const out = { labels: [], refs: [] };
  if (precios.length) {
    const pMax = Math.max(...precios);
    const pMin = Math.max(0, pMax - margen);
    out.presupuesto_max = pMax;
    out.presupuesto_min = pMin;
    out.labels.push(`${pMin.toLocaleString('es-ES')}–${pMax.toLocaleString('es-ES')} €`);
  }
  if (habs.length) {
    out.habitaciones_min = Math.max(...habs);
    out.labels.push(`${out.habitaciones_min} hab (consultados)`);
  }
  if (banos.length) {
    out.banos_min = Math.min(3, Math.max(...banos));
    out.labels.push(`${out.banos_min} baños`);
  }
  if (m2s.length) {
    out.m2_min = Math.round(Math.min(...m2s) * 0.92);
    out.labels.push(`≥ ${out.m2_min} m²`);
  }
  if (ascensorVotes.length >= 1 && ascensorVotes.length === signals.filter((s) => s.ascensor != null).length) {
    out.ascensor = true;
    out.labels.push('ascensor');
  } else if (ascensorVotes.length >= 2) {
    out.ascensor = true;
    out.labels.push('ascensor');
  }
  if (balconVotes.length >= 2) out.balcon_terraza_indispensable = true;
  if (tipos.length) {
    const counts = {};
    for (const t of tipos) counts[t] = (counts[t] || 0) + 1;
    out.tipo_inmueble = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }
  if (zonas.length) {
    const uniq = unique(zonas);
    out.zona_buscada = uniq.slice(0, 6).join(', ');
    out.labels.push('zona ' + uniq[0]);
  }
  return out;
}

function mergeZonaInfer(existing, incoming) {
  const base = String(existing || '').trim();
  if (!incoming) return base || null;
  if (!base) return incoming;
  const parts = unique([...base.split(/,\s*/), ...incoming.split(/,\s*/)]).filter((p) => p.length > 2);
  return parts.join(', ');
}

/**
 * Mezcla inferencia con ficha actual (no baja presupuesto_max del cuestionario; amplía si consultó pisos más caros).
 */
export function buildPatchFromInference(comprador, inferred) {
  const patch = {};
  if (inferred.presupuesto_max != null) {
    const cur = comprador.presupuesto_max != null ? Number(comprador.presupuesto_max) : null;
    const nextMax = Math.max(cur ?? 0, inferred.presupuesto_max);
    if (cur == null || cur === 0 || nextMax > cur) patch.presupuesto_max = nextMax;
    else if (cur != null) patch.presupuesto_max = cur;
    const curMin = comprador.presupuesto_min != null ? Number(comprador.presupuesto_min) : null;
    const nextMin = inferred.presupuesto_min;
    if (nextMin != null && (curMin == null || curMin === 0 || nextMin < curMin)) patch.presupuesto_min = nextMin;
    if (patch.presupuesto_max != null && patch.presupuesto_min == null) {
      patch.presupuesto_min = Math.max(0, patch.presupuesto_max - PRESUPUESTO_MARGEN_INFER);
    }
  }
  if (inferred.habitaciones_min != null) {
    const cur = comprador.habitaciones_min;
    const next = Math.max(cur ?? 0, inferred.habitaciones_min);
    if (cur == null || next > cur) patch.habitaciones_min = next;
  }
  if (inferred.banos_min != null) {
    const cur = comprador.banos_min;
    if (cur == null || cur === 0) patch.banos_min = inferred.banos_min;
  }
  if (inferred.m2_min != null) {
    const cur = comprador.m2_min;
    if (cur == null || cur === 0) patch.m2_min = inferred.m2_min;
  }
  if (inferred.ascensor === true && !comprador.ascensor) patch.ascensor = true;
  if (inferred.balcon_terraza_indispensable && !comprador.balcon_terraza_indispensable)
    patch.balcon_terraza_indispensable = true;
  if (inferred.tipo_inmueble && !comprador.tipo_inmueble) patch.tipo_inmueble = inferred.tipo_inmueble;
  if (inferred.zona_buscada) {
    const z = mergeZonaInfer(comprador.zona_buscada, inferred.zona_buscada);
    if (z && z !== (comprador.zona_buscada || '').trim()) patch.zona_buscada = z;
  }
  return patch;
}

export async function inferCompradorCriterios(comprador, opts = {}) {
  const { signals, refs } = await collectCompradorPropertySignals(comprador, opts);
  const priceSignals = signals.filter((s) => s.precio != null);
  if (priceSignals.length < (opts.minSignals ?? 1)) {
    return { ok: true, skipped: 'sin pisos con precio', signalCount: signals.length };
  }
  const inferred = aggregateInferredCriteria(signals, opts);
  const patch = buildPatchFromInference(comprador, inferred);
  if (!Object.keys(patch).length) {
    return { ok: true, skipped: 'nada que actualizar', inferred, signalCount: signals.length };
  }

  let notas = comprador.notas || '';
  const label = inferred.labels.join(' · ');
  const marker = 'Inferencia auto (pisos consultados):';
  if (label && !notas.includes(marker)) {
    const stamp = new Date().toLocaleString('es-ES');
    const refsTxt = refs.length ? ` · ${refs.slice(0, 4).join(', ')}` : '';
    notas = [notas, `[${stamp}] ${marker} ${label}${refsTxt}`].filter(Boolean).join('\n');
    patch.notas = notas;
  }

  if (opts.dryRun) {
    return { ok: true, dryRun: true, patch, inferred, signalCount: signals.length };
  }

  let body = { ...patch };
  let res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(comprador.id)}`, {
    method: 'PATCH',
    headers: { ...svcHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  });
  if (!res.ok && body.presupuesto_min != null) {
    const errTxt = await res.text();
    if (/presupuesto_min/i.test(errTxt)) {
      delete body.presupuesto_min;
      res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(comprador.id)}`, {
        method: 'PATCH',
        headers: { ...svcHeaders(), Prefer: 'return=minimal' },
        body: JSON.stringify(body),
      });
    } else return { ok: false, error: errTxt };
  }
  if (!res.ok) return { ok: false, error: await res.text() };
  return { ok: true, patch, inferred, signalCount: signals.length };
}

export async function inferAllCompradoresCriterios(opts = {}) {
  const onlyMissing = opts.onlySinPresupuesto === true;
  let url = `${SB_URL}/rest/v1/compradores?select=id,nombre,telefono,notas,presupuesto_max,presupuesto_min,habitaciones_min,m2_min,banos_min,ascensor,balcon_terraza_indispensable,exterior_indispensable,tipo_inmueble,zona_buscada&limit=${opts.limit ?? 500}&order=created_at.desc`;
  if (onlyMissing) url += '&presupuesto_max=is.null';
  const res = await fetch(url, { headers: svcHeaders() });
  if (!res.ok) throw new Error(await res.text());
  let rows = await res.json();
  if (res.headers.get('content-range')) {
    /* single page ok */
  }
  const stats = { total: rows.length, updated: 0, skipped: 0, errors: [] };
  for (const c of rows) {
    try {
      const r = await inferCompradorCriterios(c, opts);
      if (!r.ok) stats.errors.push(`${c.nombre}: ${r.error}`);
      else if (r.skipped) stats.skipped++;
      else if (r.patch && Object.keys(r.patch).length) stats.updated++;
      else stats.skipped++;
    } catch (e) {
      stats.errors.push(`${c.nombre}: ${e.message}`);
    }
  }
  return stats;
}
