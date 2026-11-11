/**
 * Completa fichas compradores desde respuestas cuestionario Alfredo (notas / Excel / interés).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { normalizePhoneES, findCompradorByTelefono } from './compradores-api.js';
import { parseWhatsappCompradorPatch } from './alfredo-comprador-parse.js';

function esZonaDireccion(z) {
  const s = String(z ?? '')
    .trim()
    .replace(/\s+/g, ' ');
  if (!s) return false;
  if (/^(paseo|passeig|passatge)\s+de\s+gr[àa]cia$/i.test(s)) return false;
  if (
    /^(calle|c\/|c\.|carrer|avinguda|avda\.?|av\.|paseo|passeig|plaza|pla[çc]a|carretera|via|diagonal|gran\s+via|travessera|passatge|mol[ií]|pol[ií]gono|ronda|traves[íi]a)\b/i.test(
      s,
    )
  )
    return true;
  if (/\d{1,4}\s*,\s*\d{1,4}\s*$/.test(s)) return true;
  return false;
}

export function dedupeRespuestaCliente(text) {
  const raw = String(text || '').trim();
  if (!raw) return '';
  const parts = raw
    .split(/\s*\|\s*/)
    .map((p) => p.trim())
    .filter((p) => p.length > 8);
  const uniq = [];
  for (const p of parts) {
    const key = p.toLowerCase().slice(0, 80);
    if (uniq.some((u) => u.toLowerCase().slice(0, 80) === key)) continue;
    uniq.push(p);
  }
  if (!uniq.length) return raw.slice(0, 3500);
  return uniq.sort((a, b) => b.length - a.length)[0].slice(0, 3500);
}

export function respuestasEnNotas(notas) {
  const out = [];
  const n = String(notas || '');
  for (const m of n.matchAll(/WhatsApp comprador:\s*«([^»]{2,900})»/g)) {
    const t = m[1]?.trim();
    if (t) out.push(t);
  }
  return out;
}

export function fichasEnNotas(notas) {
  const out = [];
  for (const m of String(notas || '').matchAll(/Ficha:\s*([^\n]{2,220})/g)) {
    const t = m[1]?.trim();
    if (t) out.push(t);
  }
  return out;
}

function respuestaYaRegistrada(notas, texto) {
  const t = String(texto || '').trim().toLowerCase();
  if (!t) return true;
  const needle = t.slice(0, 60);
  if (respuestasEnNotas(notas).some((r) => r.toLowerCase().includes(needle))) return true;
  if (String(notas || '').toLowerCase().includes(needle)) return true;
  return false;
}

function mergeZona(existing, incoming) {
  const baseZ = esZonaDireccion(existing) ? '' : String(existing || '').trim();
  const parts = [...baseZ.split(/,\s*/), ...String(incoming || '').split(/,\s*/)]
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !esZonaDireccion(p));
  const uniq = [];
  for (const p of parts) {
    if (!uniq.some((u) => u.toLowerCase() === p.toLowerCase())) uniq.push(p);
  }
  return uniq.join(', ') || null;
}

function patchFromParsed(parsed, comprador) {
  const p = parsed?.patch || {};
  const db = {};
  if (p.presupuesto_max != null && (comprador.presupuesto_max == null || comprador.presupuesto_max === 0))
    db.presupuesto_max = p.presupuesto_max;
  else if (
    p.presupuesto_max != null &&
    comprador.presupuesto_max != null &&
    p.presupuesto_max > comprador.presupuesto_max
  )
    db.presupuesto_max = p.presupuesto_max;

  if (p.habitaciones_min != null) {
    const cur = comprador.habitaciones_min;
    if (cur == null || cur === 0) db.habitaciones_min = p.habitaciones_min;
    else db.habitaciones_min = Math.max(cur, p.habitaciones_min);
  }
  if (p.m2_minimos != null) {
    const cur = comprador.m2_min;
    if (cur == null || cur === 0) db.m2_min = p.m2_minimos;
    else db.m2_min = Math.max(Number(cur), p.m2_minimos);
  }
  if (p.banos_min != null) {
    const cur = comprador.banos_min;
    if (cur == null || cur === 0) db.banos_min = Math.min(3, p.banos_min);
    else db.banos_min = Math.max(cur, Math.min(3, p.banos_min));
  }
  if (p.ascensor_indispensable === true && !comprador.ascensor) db.ascensor = true;
  if (p.balcon_terraza_indispensable === true && !comprador.balcon_terraza_indispensable)
    db.balcon_terraza_indispensable = true;
  if (p.exterior_indispensable === true && !comprador.exterior_indispensable)
    db.exterior_indispensable = true;
  if (p.exterior_indispensable === false && comprador.exterior_indispensable !== true)
    db.exterior_indispensable = false;
  if (p.tipo_inmueble && !comprador.tipo_inmueble) db.tipo_inmueble = p.tipo_inmueble;
  if (p.zona_buscada) {
    const merged = mergeZona(comprador.zona_buscada, p.zona_buscada);
    if (merged && merged !== (comprador.zona_buscada || '').trim()) db.zona_buscada = merged;
  }
  if (p.planta_max_sin_ascensor != null && comprador.ascensor !== true) {
    db.planta_max_sin_ascensor = p.planta_max_sin_ascensor;
  }
  return db;
}

function buildFichaLine(labels) {
  const parts = (labels || []).filter(Boolean);
  if (!parts.length) return null;
  return `Ficha: ${parts.join(' · ')}`;
}

async function fetchInteresMensajes(compradorId) {
  const res = await fetch(
    `${SB_URL}/rest/v1/comprador_inmueble_interes?comprador_id=eq.${encodeURIComponent(compradorId)}&select=mensaje&limit=50`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data || []).map((r) => r.mensaje).filter(Boolean);
}

async function updateComprador(id, payload) {
  const res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { ...svcHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify(payload),
  });
  return res.ok ? null : await res.text();
}

/**
 * Enriquece un comprador desde textos de respuesta (cuestionario WA).
 * @returns {{ ok: boolean, id?: string, patch?: object, notasAdded?: string[], error?: string, skipped?: string }}
 */
export async function enrichCompradorFromTextos(comprador, textos, opts = {}) {
  if (!comprador?.id) return { ok: false, error: 'sin comprador' };
  const joined = textos.map((t) => String(t).trim()).filter(Boolean).join('\n---\n');
  if (!joined) return { ok: false, skipped: 'sin texto' };

  const parsed = parseWhatsappCompradorPatch(joined);
  const dbPatch = patchFromParsed(parsed, comprador);
  const notasAdded = [];
  let notas = comprador.notas || '';

  const respuestaPrincipal = dedupeRespuestaCliente(
    textos.find((t) => t.length > 40) || textos[textos.length - 1] || joined,
  );
  if (respuestaPrincipal && !respuestaYaRegistrada(notas, respuestaPrincipal) && !opts.skipNotaRespuesta) {
    const stamp = new Date().toLocaleString('es-ES');
    const line = `[${stamp}] WhatsApp comprador: «${respuestaPrincipal.replace(/»/g, "'")}»`;
    notas = [notas, line].filter(Boolean).join('\n');
    notasAdded.push('respuesta');
  }

  const fichaLine = buildFichaLine(parsed.labels);
  const fichaNueva =
    fichaLine && !fichasEnNotas(notas).some((f) => f.toLowerCase() === fichaLine.slice(7).toLowerCase());
  if (fichaNueva) {
    const stamp = new Date().toLocaleString('es-ES');
    notas = [notas, `[${stamp}] ${fichaLine}`].filter(Boolean).join('\n');
    notasAdded.push('ficha');
  }

  const payload = { ...dbPatch };
  if (notas !== (comprador.notas || '')) payload.notas = notas;

  if (!Object.keys(dbPatch).length && !notasAdded.length) {
    return { ok: true, skipped: 'nada que actualizar', id: comprador.id };
  }

  if (opts.dryRun) {
    return { ok: true, dryRun: true, id: comprador.id, patch: dbPatch, notasAdded, notasPreview: notas.slice(-400) };
  }

  const err = await updateComprador(comprador.id, payload);
  if (err) return { ok: false, error: err, id: comprador.id };
  return { ok: true, id: comprador.id, patch: dbPatch, notasAdded };
}

export async function enrichCompradorById(compradorId, extraTextos = [], opts = {}) {
  const res = await fetch(
    `${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(compradorId)}&select=*`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return { ok: false, error: `GET ${res.status}` };
  const rows = await res.json();
  const c = rows?.[0];
  if (!c) return { ok: false, error: 'comprador no encontrado' };
  const textos = [
    ...respuestasEnNotas(c.notas),
    ...fichasEnNotas(c.notas),
    ...(await fetchInteresMensajes(c.id)),
    ...extraTextos,
  ];
  return enrichCompradorFromTextos(c, textos, opts);
}

export async function enrichAllCompradoresFromNotas(opts = {}) {
  const limit = opts.limit ?? 3000;
  const res = await fetch(
    `${SB_URL}/rest/v1/compradores?select=id,nombre,telefono,email,zona_buscada,presupuesto_max,habitaciones_min,m2_min,banos_min,ascensor,balcon_terraza_indispensable,exterior_indispensable,tipo_inmueble,planta_max_sin_ascensor,notas&limit=${limit}`,
    { headers: svcHeaders() },
  );
  if (!res.ok) throw new Error(`compradores ${res.status}`);
  const rows = await res.json();
  const stats = { total: rows.length, updated: 0, skipped: 0, errors: [] };
  for (const c of rows) {
    const textos = [...respuestasEnNotas(c.notas), ...(await fetchInteresMensajes(c.id))];
    if (!textos.length && !opts.forceAll) {
      stats.skipped++;
      continue;
    }
    const r = await enrichCompradorFromTextos(c, textos, opts);
    if (!r.ok) stats.errors.push(`${c.nombre || c.telefono}: ${r.error}`);
    else if (r.skipped) stats.skipped++;
    else if (r.patch && Object.keys(r.patch).length) stats.updated++;
    else if (r.notasAdded?.length) stats.updated++;
    else stats.skipped++;
  }
  return stats;
}

function parseEuroCell(val) {
  const s = String(val || '').replace(/\./g, '').replace(/[^\d]/g, '');
  const n = parseInt(s, 10);
  return Number.isFinite(n) && n >= 20000 ? n : null;
}

function siNoCell(val) {
  const s = String(val || '').trim().toUpperCase();
  if (s === 'SI' || s === 'SÍ') return true;
  if (s === 'NO') return false;
  return null;
}

/**
 * Fila del Excel fichas-compradores (hojas 1–3).
 */
export function rowToEnrichPayload(row) {
  const telefono = normalizePhoneES(row.Telefono || row.telefono);
  const respuesta = dedupeRespuestaCliente(row['Respuesta del cliente'] || '');
  const textos = respuesta ? [respuesta] : [];
  const manualPatch = {};
  const zona = String(row['Ficha guardada - zona'] || '').trim();
  const pres = parseEuroCell(row['Ficha guardada - presupuesto']);
  const hab = parseInt(row['Ficha guardada - habitaciones min'], 10);
  const m2 = parseFloat(row['Ficha guardada - m2 min']);
  const banos = parseInt(row['Ficha guardada - banos min'], 10);
  if (zona) manualPatch._zona_hint = zona;
  if (pres) manualPatch._presupuesto_hint = pres;
  if (Number.isFinite(hab) && hab > 0) manualPatch._hab_hint = hab;
  if (Number.isFinite(m2) && m2 > 0) manualPatch._m2_hint = m2;
  if (Number.isFinite(banos) && banos > 0) manualPatch._banos_hint = banos;
  const asc = siNoCell(row['Ficha guardada - ascensor']);
  const bal = siNoCell(row['Ficha guardada - balcon/terraza']);
  const ext = siNoCell(row['Ficha guardada - exterior']);
  if (asc === true) manualPatch._ascensor = true;
  if (bal === true) manualPatch._balcon = true;
  if (ext === true) manualPatch._exterior = true;
  if (ext === false) manualPatch._exterior_false = true;
  const faltan = String(row['Faltan por añadir'] || row['Faltan por anadir'] || '').trim();
  return { telefono, textos, faltan, nombre: row.Nombre || row.nombre, manualPatch };
}

function applyManualHints(comprador, hints) {
  if (!hints || !comprador) return comprador;
  const c = { ...comprador };
  if (hints._presupuesto_hint && (c.presupuesto_max == null || c.presupuesto_max === 0))
    c.presupuesto_max = hints._presupuesto_hint;
  if (hints._hab_hint && (c.habitaciones_min == null || c.habitaciones_min === 0))
    c.habitaciones_min = hints._hab_hint;
  if (hints._m2_hint && (c.m2_min == null || c.m2_min === 0)) c.m2_min = hints._m2_hint;
  if (hints._banos_hint && (c.banos_min == null || c.banos_min === 0)) c.banos_min = hints._banos_hint;
  if (hints._ascensor && !c.ascensor) c.ascensor = true;
  if (hints._balcon && !c.balcon_terraza_indispensable) c.balcon_terraza_indispensable = true;
  if (hints._exterior && !c.exterior_indispensable) c.exterior_indispensable = true;
  if (hints._exterior_false && c.exterior_indispensable !== true) c.exterior_indispensable = false;
  if (hints._zona_hint) c.zona_buscada = mergeZona(c.zona_buscada, hints._zona_hint);
  return c;
}

export async function enrichFromExcelRows(rows, opts = {}) {
  const stats = { rows: rows.length, matched: 0, updated: 0, skipped: 0, notFound: [], errors: [] };
  for (const row of rows) {
    const { telefono, textos, faltan, manualPatch } = rowToEnrichPayload(row);
    if (!telefono) {
      stats.skipped++;
      continue;
    }
    if (!textos.length && !faltan) {
      stats.skipped++;
      continue;
    }
    let comprador = await findCompradorByTelefono(telefono);
    if (!comprador) {
      stats.notFound.push(`${row.Nombre || '?'} ${telefono}`);
      continue;
    }
    stats.matched++;
  comprador = applyManualHints(comprador, manualPatch);
    const r = await enrichCompradorFromTextos(comprador, textos, opts);
    if (!r.ok) stats.errors.push(`${comprador.nombre}: ${r.error}`);
    else if (r.skipped && !r.notasAdded?.length) stats.skipped++;
    else stats.updated++;
  }
  return stats;
}
