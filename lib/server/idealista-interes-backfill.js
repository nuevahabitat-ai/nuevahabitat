/**
 * Rellena comprador_inmueble_interes desde notas [Idealista import] tras migración 066.
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { normalizeIdealistaId } from './idealista-id.js';

const LINE_RE = /·\s*Idealista\s+(\d{6,})/gi;

function parseNotasLines(notas) {
  const out = [];
  const text = String(notas || '');
  if (!text.includes('[Idealista import]') && !/Idealista\s+\d{6,}/i.test(text)) return out;
  const blocks = text.split(/\n/);
  for (const line of blocks) {
    const m = line.match(/Idealista\s+(\d{6,})/i);
    if (!m) continue;
    const idealista_id = normalizeIdealistaId(m[1]);
    const nh = line.match(/NH-20\d{2}-\d+/i);
    out.push({
      idealista_id,
      inmueble_ref: nh ? nh[0].toUpperCase() : null,
      descripcion: line.replace(/^·\s*/, '').trim(),
    });
  }
  return out;
}

export async function backfillInteresFromCompradorNotas(opts = {}) {
  const idealistaFilter = opts.idealista_id ? normalizeIdealistaId(opts.idealista_id) : null;
  const limit = Math.min(Number(opts.limit) || 500, 2000);
  const res = await fetch(
    `${SB_URL}/rest/v1/compradores?notas=ilike.${encodeURIComponent('%Idealista%')}&select=id,notas&limit=${limit}`,
    { headers: svcHeaders() }
  );
  if (!res.ok) throw new Error(`compradores: ${res.status} ${(await res.text()).slice(0, 120)}`);

  const compradores = await res.json();
  let created = 0;
  let skipped = 0;
  let errors = [];

  const inmCache = new Map();
  async function inmForIdealista(id) {
    if (inmCache.has(id)) return inmCache.get(id);
    const q = `${SB_URL}/rest/v1/inmuebles?idealista_id=eq.${encodeURIComponent(id)}&select=id,ref&limit=1`;
    const r = await fetch(q, { headers: svcHeaders() });
    const row = r.ok ? (await r.json())?.[0] : null;
    inmCache.set(id, row || null);
    return row || null;
  }

  for (const c of compradores || []) {
    for (const item of parseNotasLines(c.notas)) {
      if (!item.idealista_id) continue;
      if (idealistaFilter && item.idealista_id !== idealistaFilter) continue;
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
        inmueble_ref: item.inmueble_ref || inm?.ref || null,
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

  return { ok: true, created, skipped, errors: errors.slice(0, 20), compradoresScanned: compradores.length };
}
