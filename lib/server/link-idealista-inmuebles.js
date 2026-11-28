/**
 * Vincula idealista_id a inmuebles NH por coincidencia título/barrio (export estadísticas).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { idealistaIdsOnInmueble, normalizeIdealistaId } from './idealista-id.js';

/** Reglas derivadas del export estadísticas.xls (contactos Idealista). */
export const ESTADISTICA_IDEALISTA_RULES = [
  {
    idealista_id: '113064573',
    label: 'Calle de Sant Joan Bosco, 39',
    needles: ['bosco', 'sant joan bosco'],
    weight: 3,
  },
  {
    idealista_id: '112923386',
    label: "Calle de les Muses, 26 / Torrassa",
    needles: ['muses', 'torrassa', 'torrasa', 'alegria', "l'alegria", 'alegría'],
    municipioHint: ['hospitalet', 'llobregat'],
    weight: 2,
  },
  {
    idealista_id: '113139927',
    label: 'Ático Calle Olesa',
    needles: ['olesa'],
    tipoHint: ['atico', 'ático', 'atic'],
    weight: 3,
  },
  {
    idealista_id: '113133231',
    label: 'Piso Badal (Badalona)',
    needles: ['badal'],
    municipioHint: ['badalona'],
    weight: 2,
  },
  {
    idealista_id: '112928263',
    label: 'Calle Jardí, 20',
    needles: ['jardi', 'jardí', 'jardí,', 'jardí '],
    weight: 2,
  },
];

function normText(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ');
}

function scoreInmuebleForRule(inm, rule) {
  const blob = normText(
    [inm.titulo, inm.barrio, inm.municipio, inm.direccion, inm.ref].filter(Boolean).join(' '),
  );
  if (!blob.trim()) return 0;
  let score = 0;
  for (const n of rule.needles || []) {
    const needle = normText(n);
    if (needle && blob.includes(needle)) score += rule.weight || 1;
  }
  if (rule.municipioHint?.length) {
    const hit = rule.municipioHint.some((m) => blob.includes(normText(m)));
    if (hit) score += 2;
    else if (score > 0) score -= 1;
  }
  if (rule.tipoHint?.length) {
    const hit = rule.tipoHint.some((t) => blob.includes(normText(t)));
    if (hit) score += 2;
  }
  return score;
}

async function fetchInmueblesCatalog() {
  const res = await fetch(
    `${SB_URL}/rest/v1/inmuebles?select=id,ref,titulo,barrio,municipio,direccion,tipo,idealista_id,idealista_id_2,estado&estado=neq.retirado&order=ref.asc&limit=500`,
    { headers: svcHeaders() },
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function idealistaIdTaken(id, exceptInmuebleId) {
  const rid = normalizeIdealistaId(id);
  if (!rid) return false;
  const or = `or=(idealista_id.eq.${encodeURIComponent(rid)},idealista_id_2.eq.${encodeURIComponent(rid)})`;
  const res = await fetch(`${SB_URL}/rest/v1/inmuebles?${or}&select=id,ref,idealista_id,idealista_id_2&limit=4`, {
    headers: svcHeaders(),
  });
  if (!res.ok) return false;
  const rows = await res.json();
  return rows.some((r) => r.id !== exceptInmuebleId);
}

export async function autoLinkIdealistaInmuebles(opts = {}) {
  const rules = (opts.rules?.length ? opts.rules : ESTADISTICA_IDEALISTA_RULES).map((r) => ({
    ...r,
    idealista_id: normalizeIdealistaId(r.idealista_id),
  }));
  const onlySinId = opts.onlySinId !== false;
  const dryRun = opts.dryRun === true;
  const minScore = Number(opts.minScore) || 2;

  const inmuebles = await fetchInmueblesCatalog();
  const usedInm = new Set();
  const planned = [];

  const sortedRules = [...rules].sort((a, b) => (b.needles?.length || 0) - (a.needles?.length || 0));

  for (const rule of sortedRules) {
    if (!rule.idealista_id) continue;
    let best = null;
    let bestScore = 0;
    for (const inm of inmuebles) {
      if (usedInm.has(inm.id)) continue;
      if (onlySinId && idealistaIdsOnInmueble(inm).length) continue;
      if (idealistaIdsOnInmueble(inm).includes(rule.idealista_id)) {
        usedInm.add(inm.id);
        planned.push({
          inmueble_id: inm.id,
          ref: inm.ref,
          titulo: inm.titulo,
          idealista_id: rule.idealista_id,
          score: 99,
          skip: 'ya_vinculado',
        });
        best = null;
        break;
      }
      const sc = scoreInmuebleForRule(inm, rule);
      if (sc > bestScore) {
        bestScore = sc;
        best = inm;
      }
    }
    if (best && bestScore >= minScore) {
      usedInm.add(best.id);
      planned.push({
        inmueble_id: best.id,
        ref: best.ref,
        titulo: best.titulo,
        idealista_id: rule.idealista_id,
        idealista_label: rule.label,
        score: bestScore,
      });
    } else if (!planned.some((p) => p.idealista_id === rule.idealista_id)) {
      planned.push({
        idealista_id: rule.idealista_id,
        idealista_label: rule.label,
        error: 'sin_inmueble_candidato',
        bestScore,
      });
    }
  }

  const updates = [];
  const errors = [];

  for (const row of planned) {
    if (row.skip || row.error || !row.inmueble_id) continue;
    const taken = await idealistaIdTaken(row.idealista_id, row.inmueble_id);
    if (taken) {
      errors.push(`ID ${row.idealista_id} ya está en otro inmueble NH`);
      continue;
    }
    if (dryRun) {
      updates.push({ ...row, dryRun: true });
      continue;
    }
    const res = await fetch(`${SB_URL}/rest/v1/inmuebles?id=eq.${encodeURIComponent(row.inmueble_id)}`, {
      method: 'PATCH',
      headers: svcHeaders('return=minimal'),
      body: JSON.stringify({
        idealista_id: row.idealista_id,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      errors.push(`${row.ref}: ${await res.text()}`);
      continue;
    }
    updates.push(row);
  }

  return {
    ok: true,
    dryRun,
    totalInmuebles: inmuebles.length,
    vinculados: updates.length,
    plan: planned,
    errors,
  };
}