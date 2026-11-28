import { SB_URL, svcHeaders } from './supabase-server.js';
import { idealistaIdsFromNotas } from './comprador-idealista-piso.js';

const SELECT_DEFAULT =
  'id,nombre,notas,presupuesto_max,presupuesto_min,telefono,activo';

export function compradorTieneIdealista(c, interesRows) {
  if (interesRows?.length) return true;
  const notas = String(c?.notas || '');
  if (/\[idealista\s+import\]/i.test(notas)) return true;
  if (/idealista/i.test(notas)) return true;
  if (idealistaIdsFromNotas(notas).length) return true;
  return false;
}

export async function fetchCompradorIdsConInteresIdealista() {
  const ids = new Set();
  const res = await fetch(
    `${SB_URL}/rest/v1/comprador_inmueble_interes?idealista_id=not.is.null&select=comprador_id&limit=2000`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return ids;
  for (const row of await res.json()) {
    if (row.comprador_id) ids.add(row.comprador_id);
  }
  return ids;
}

/**
 * Compradores activos sin rango compraventa completo y con señal Idealista (notas o tabla interés).
 */
export async function fetchCompradoresPendientesCompraventa(opts = {}) {
  const limit = Math.min(Number(opts.limit) || 400, 500);
  const select = opts.select || SELECT_DEFAULT;
  const byId = new Map();

  const pushRows = (rows) => {
    for (const r of rows || []) {
      if (!r?.id) continue;
      if (r.activo === false) continue;
      const needsMax = r.presupuesto_max == null;
      const needsMin = r.presupuesto_min == null;
      if (!needsMax && !needsMin) continue;
      byId.set(r.id, r);
    }
  };

  const qNotas = `${SB_URL}/rest/v1/compradores?activo=eq.true&or=(presupuesto_max.is.null,presupuesto_min.is.null)&select=${select}&order=created_at.desc&limit=${limit}`;
  const rNotas = await fetch(qNotas, { headers: svcHeaders() });
  if (rNotas.ok) pushRows(await rNotas.json());

  const interesIds = await fetchCompradorIdsConInteresIdealista();
  const missingFromInteres = [...interesIds].filter((id) => !byId.has(id));
  const chunk = 80;
  for (let i = 0; i < missingFromInteres.length; i += chunk) {
    const slice = missingFromInteres.slice(i, i + chunk);
    const inList = slice.map((id) => encodeURIComponent(id)).join(',');
    const url = `${SB_URL}/rest/v1/compradores?id=in.(${inList})&activo=eq.true&select=${select}&limit=${chunk}`;
    const res = await fetch(url, { headers: svcHeaders() });
    if (res.ok) pushRows(await res.json());
  }

  if (opts.compradorIds?.length) {
    const want = new Set(opts.compradorIds);
    const extra = [...want].filter((id) => !byId.has(id));
    for (let i = 0; i < extra.length; i += chunk) {
      const slice = extra.slice(i, i + chunk);
      const inList = slice.map((id) => encodeURIComponent(id)).join(',');
      const url = `${SB_URL}/rest/v1/compradores?id=in.(${inList})&select=${select}&limit=${chunk}`;
      const res = await fetch(url, { headers: svcHeaders() });
      if (res.ok) pushRows(await res.json());
    }
  }

  return [...byId.values()].slice(0, limit);
}