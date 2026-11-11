/**
 * Rellena comprador_inmueble_interes desde notas del import (sin volver a subir CSV).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { normalizeIdealistaId } from './idealista-id.js';

function parseNotasLines(notas, idealistaFilter) {
  const out = [];
  const text = String(notas || '');
  if (!text.trim()) return out;

  if (idealistaFilter && text.includes(idealistaFilter)) {
    const nh = text.match(/NH-20\d{2}-\d+/i);
    if (!out.some((x) => x.idealista_id === idealistaFilter)) {
      out.push({
        idealista_id: idealistaFilter,
        inmueble_ref: nh ? nh[0].toUpperCase() : null,
        descripcion: 'Desde notas comprador',
      });
    }
  }

  const hasIdealista =
    /Idealista\s+\d{6,}/i.test(text) || /\[Idealista\s+Import\]/i.test(text);
  if (!hasIdealista && !idealistaFilter) {
    return out;
  }

  for (const line of text.split(/\n/)) {
    const m = line.match(/Idealista\s+(\d{6,})/i) || line.match(/(\d{8,})/);
    if (!m) continue;
    const idealista_id = normalizeIdealistaId(m[1]);
    if (!idealista_id) continue;
    if (idealistaFilter && idealista_id !== idealistaFilter) continue;
    const nh = line.match(/NH-20\d{2}-\d+/i);
    out.push({
      idealista_id,
      inmueble_ref: nh ? nh[0].toUpperCase() : null,
      descripcion: line.replace(/^·\s*/, '').trim(),
    });
  }
  return out;
}

async function fetchCompradoresNotasCandidates(idealistaFilter) {
  const byId = new Map();
  const patterns = new Set(['%Idealista%']);
  if (idealistaFilter) {
    patterns.add(`%${idealistaFilter}%`);
    patterns.add(`%Idealista ${idealistaFilter}%`);
  }
  for (const pat of patterns) {
    const q = `${SB_URL}/rest/v1/compradores?notas=ilike.${encodeURIComponent(pat)}&select=id,notas&limit=1000`;
    const res = await fetch(q, { headers: svcHeaders() });
    if (!res.ok) continue;
    for (const c of await res.json()) byId.set(c.id, c);
  }
  return [...byId.values()];
}

export async function backfillInteresFromCompradorNotas(opts = {}) {
  const idealistaFilter = opts.idealista_id ? normalizeIdealistaId(opts.idealista_id) : null;
  const compradores = await fetchCompradoresNotasCandidates(idealistaFilter);
  let created = 0;
  let skipped = 0;
  const errors = [];

  const inmCache = new Map();
  async function inmForIdealista(id) {
    if (inmCache.has(id)) return inmCache.get(id);
    const q = `${SB_URL}/rest/v1/inmuebles?idealista_id=eq.${encodeURIComponent(id)}&select=id,ref&limit=1`;
    const r = await fetch(q, { headers: svcHeaders() });
    const row = r.ok ? (await r.json())?.[0] : null;
    inmCache.set(id, row || null);
    return row || null;
  }

  if (opts.inmueble_ref && idealistaFilter) {
    const q = `${SB_URL}/rest/v1/inmuebles?ref=eq.${encodeURIComponent(opts.inmueble_ref)}&select=id,ref,idealista_id&limit=1`;
    const r = await fetch(q, { headers: svcHeaders() });
    const row = r.ok ? (await r.json())?.[0] : null;
    if (row && !row.idealista_id) {
      await fetch(`${SB_URL}/rest/v1/inmuebles?id=eq.${row.id}`, {
        method: 'PATCH',
        headers: svcHeaders('return=minimal'),
        body: JSON.stringify({ idealista_id: idealistaFilter }),
      });
    }
  }

  for (const c of compradores) {
    for (const item of parseNotasLines(c.notas, idealistaFilter)) {
      if (!item.idealista_id) continue;
      const inm =
        item.inmueble_ref
          ? await (async () => {
              const q = `${SB_URL}/rest/v1/inmuebles?ref=eq.${encodeURIComponent(item.inmueble_ref)}&select=id,ref&limit=1`;
              const r = await fetch(q, { headers: svcHeaders() });
              return r.ok ? (await r.json())?.[0] : null;
            })()
          : await inmForIdealista(item.idealista_id);

      const body = {
        comprador_id: c.id,
        idealista_id: item.idealista_id,
        inmueble_id: inm?.id || null,
        inmueble_ref: item.inmueble_ref || inm?.ref || opts.inmueble_ref || null,
        descripcion: item.descripcion,
        origen: 'idealista_import',
      };

      const exists = await fetch(
        `${SB_URL}/rest/v1/comprador_inmueble_interes?comprador_id=eq.${c.id}&idealista_id=eq.${encodeURIComponent(item.idealista_id)}&select=id&limit=1`,
        { headers: svcHeaders() }
      );
      if (exists.ok && (await exists.json())?.length) {
        skipped += 1;
        continue;
      }

      const ins = await fetch(`${SB_URL}/rest/v1/comprador_inmueble_interes`, {
        method: 'POST',
        headers: svcHeaders('return=minimal'),
        body: JSON.stringify(body),
      });
      if (ins.ok) created += 1;
      else if (!/duplicate|unique|23505/i.test(await ins.text())) errors.push(`${c.id}/${item.idealista_id}`);
    }
  }

  return {
    ok: true,
    created,
    skipped,
    errors: errors.slice(0, 20),
    compradoresScanned: compradores.length,
    idealista_id: idealistaFilter,
  };
}
