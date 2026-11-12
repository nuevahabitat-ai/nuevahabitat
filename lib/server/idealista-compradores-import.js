/**
 * Importar contactos Idealista (.xls export) → compradores activos + interés por inmueble.
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { normalizePhoneES, findCompradorByTelefono, insertComprador } from './compradores-api.js';
import { normalizeIdealistaId } from './idealista-id.js';
import {
  parseEuroFromText,
  patchFromIdealistaInterests,
  resolveIdealistaLeadPiso,
} from './comprador-idealista-piso.js';
import { seedIdealistaPrecioCacheFromLeads, warmIdealistaPrecioCache } from './idealista-listing-snapshot.js';
import { upsertIdealistaPrecioCache } from './idealista-precio-cache.js';
import { finalizeIdealistaCompradorFichas } from './idealista-compradores-post-import.js';

function parseIdealistaRef(val) {
  return normalizeIdealistaId(val);
}

function parseFechaES(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (!m) return null;
  const [, dd, mm, yyyy, hh = '12', mi = '0', ss = '0'] = m;
  const d = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${hh.padStart(2, '0')}:${mi.padStart(2, '0')}:${ss.padStart(2, '0')}`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function parseNhRef(val) {
  const s = String(val || '').trim();
  if (!s) return null;
  const m = s.match(/\b(NH-\d{4}-\d+)\b/i);
  return m ? m[1].toUpperCase() : null;
}

function dedupeNormalizedRows(rows) {
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const key = [
      r.telefono,
      r.idealista_id || '',
      r.fecha_contacto || '',
      (r.mensaje || '').slice(0, 48),
      r.tipo_mensaje || '',
    ].join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

function normRow(raw) {
  const get = (...keys) => {
    for (const k of keys) {
      if (raw[k] != null && String(raw[k]).trim() !== '') return raw[k];
    }
    return null;
  };
  const telefono = normalizePhoneES(get('TELÉFONO', 'TELEFONO', 'telefono', 'Teléfono'));
  if (!telefono) return null;
  return {
    idealista_id: parseIdealistaRef(get('REF. IDEALISTA', 'REF IDEALISTA', 'idealista_id')),
    ref_cliente: get('REF. CLIENTE', 'REF CLIENTE', 'ref_cliente') != null
      ? String(get('REF. CLIENTE', 'REF CLIENTE', 'ref_cliente')).trim() || null
      : null,
    descripcion: get('DESCRIPCIÓN', 'DESCRIPCION', 'descripcion') != null
      ? String(get('DESCRIPCIÓN', 'DESCRIPCION', 'descripcion')).trim()
      : null,
    nombre: get('USUARIO', 'usuario', 'nombre') != null
      ? String(get('USUARIO', 'usuario', 'nombre')).trim()
      : null,
    origen: get('ORIGEN', 'origen') != null ? String(get('ORIGEN', 'origen')).trim() : null,
    estado_contacto: get('ESTADO', 'estado') != null ? String(get('ESTADO', 'estado')).trim() : null,
    email: get('EMAIL', 'email') != null ? String(get('EMAIL', 'email')).trim().toLowerCase() || null : null,
    telefono,
    mensaje: get('MENSAJE', 'mensaje') != null ? String(get('MENSAJE', 'mensaje')).trim() : null,
    tipo_mensaje: get('TIPO DE MENSAJE', 'tipo_mensaje') != null
      ? String(get('TIPO DE MENSAJE', 'tipo_mensaje')).trim()
      : null,
    fecha_contacto: parseFechaES(get('FECHA', 'fecha')),
    idioma: get('IDIOMA', 'idioma'),
    precio_anuncio: (() => {
      const raw = get(
        'PRECIO',
        'PRECIO ANUNCIO',
        'PRECIO VENTA',
        'PRECIO DEL INMUEBLE',
        'IMPORTE',
        'precio',
        'Precio',
      );
      if (raw != null) {
        const n = parseInt(String(raw).replace(/\D/g, ''), 10);
        if (n >= 30_000 && n <= 15_000_000) return n;
      }
      const blob = [
        get('DESCRIPCIÓN', 'DESCRIPCION', 'descripcion'),
        get('MENSAJE', 'mensaje'),
      ]
        .filter(Boolean)
        .join(' ');
      const parsed = parseEuroFromText(blob);
      return parsed.length ? Math.max(...parsed) : null;
    })(),
  };
}

async function fetchInmueblesByIdealistaIds(ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return new Map();
  const q = `${SB_URL}/rest/v1/inmuebles?idealista_id=in.(${unique.map((id) => encodeURIComponent(id)).join(',')})&select=id,idealista_id,precio,titulo,ref,barrio,municipio,habitaciones,banos,m2_utiles,m2_construidos,ascensor,tipo,balcon,terraza`;
  const res = await fetch(q, { headers: svcHeaders() });
  if (!res.ok) {
    if (res.status === 400) return new Map();
    throw new Error(`inmuebles idealista_id: ${res.status}`);
  }
  const rows = await res.json();
  const map = new Map();
  for (const r of rows || []) {
    if (r.idealista_id) map.set(String(r.idealista_id), r);
  }
  return map;
}

async function fetchInmueblesByRefs(refs) {
  const unique = [...new Set(refs.filter(Boolean))];
  if (!unique.length) return new Map();
  const q = `${SB_URL}/rest/v1/inmuebles?ref=in.(${unique.map((id) => encodeURIComponent(id)).join(',')})&select=id,ref,idealista_id,precio,titulo,barrio,municipio,habitaciones,banos,m2_utiles,m2_construidos,ascensor,tipo,balcon,terraza`;
  const res = await fetch(q, { headers: svcHeaders() });
  if (!res.ok) {
    if (res.status === 400) return new Map();
    throw new Error(`inmuebles ref: ${res.status}`);
  }
  const rows = await res.json();
  const map = new Map();
  for (const r of rows || []) {
    if (r.ref) map.set(String(r.ref).toUpperCase(), r);
  }
  return map;
}

function resolveInmueble(row, inmByIdealista, inmByRef) {
  if (row.idealista_id && inmByIdealista.has(row.idealista_id)) {
    return inmByIdealista.get(row.idealista_id);
  }
  const nh = parseNhRef(row.ref_cliente);
  if (nh && inmByRef.has(nh)) return inmByRef.get(nh);
  return null;
}

async function interesAlreadyExists(compradorId, idealistaId, inmuebleId) {
  if (idealistaId) {
    const res = await fetch(
      `${SB_URL}/rest/v1/comprador_inmueble_interes?comprador_id=eq.${encodeURIComponent(compradorId)}&idealista_id=eq.${encodeURIComponent(idealistaId)}&select=id&limit=1`,
      { headers: svcHeaders() }
    );
    if (res.ok) {
      const rows = await res.json();
      if (rows?.length) return true;
    }
  }
  if (inmuebleId && !idealistaId) {
    const res = await fetch(
      `${SB_URL}/rest/v1/comprador_inmueble_interes?comprador_id=eq.${encodeURIComponent(compradorId)}&inmueble_id=eq.${encodeURIComponent(inmuebleId)}&select=id&limit=1`,
      { headers: svcHeaders() }
    );
    if (res.ok) {
      const rows = await res.json();
      if (rows?.length) return true;
    }
  }
  return false;
}

async function patchComprador(id, data) {
  const res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: svcHeaders('return=minimal'),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
}

async function insertInteres(row) {
  if (!row.comprador_id) return 'skip';
  const body = {
    comprador_id: row.comprador_id,
    inmueble_id: row.inmueble_id || null,
    inmueble_ref: row.inmueble_ref || null,
    idealista_id: row.idealista_id || null,
    ref_cliente: row.ref_cliente || null,
    descripcion: row.descripcion || null,
    origen: row.origen || null,
    estado_contacto: row.estado_contacto || null,
    mensaje: row.mensaje || null,
    tipo_mensaje: row.tipo_mensaje || null,
    fecha_contacto: row.fecha_contacto || null,
  };
  if (row.precio_consultado != null || row.precio_anuncio != null || row.precio_inmueble != null) {
    body.precio_consultado = Number(
      row.precio_consultado ?? row.precio_anuncio ?? row.precio_inmueble,
    );
  }
  const res = await fetch(`${SB_URL}/rest/v1/comprador_inmueble_interes`, {
    method: 'POST',
    headers: svcHeaders('return=minimal'),
    body: JSON.stringify(body),
  });
  if (res.ok) return 'created';
  const t = await res.text();
  if (res.status === 404 || /comprador_inmueble_interes/.test(t)) return 'no_table';
  if (/duplicate|unique|23505/i.test(t)) return 'duplicate';
  if (/inmueble_ref/.test(t)) {
    const { inmueble_ref, ...rest } = body;
    const res2 = await fetch(`${SB_URL}/rest/v1/comprador_inmueble_interes`, {
      method: 'POST',
      headers: svcHeaders('return=minimal'),
      body: JSON.stringify(rest),
    });
    if (res2.ok) return 'created';
    const t2 = await res2.text();
    if (/duplicate|unique|23505/i.test(t2)) return 'duplicate';
    if (res2.status === 404) return 'no_table';
    throw new Error(t2);
  }
  throw new Error(t);
}

function buildInteresNotas(interests) {
  const lines = interests.map((i) => {
    const parts = [
      i.idealista_id ? `Idealista ${i.idealista_id}` : null,
      i.descripcion,
      i.inmueble_ref ? `NH ${i.inmueble_ref}` : (i.inmueble_id ? 'Inmueble vinculado' : 'Sin vincular NH'),
      (i.precio_consultado ?? i.precio_inmueble ?? i.precio_anuncio) != null
        ? `${Number(i.precio_consultado ?? i.precio_inmueble ?? i.precio_anuncio).toLocaleString('es-ES')} €`
        : null,
      i.fecha_contacto ? new Date(i.fecha_contacto).toLocaleString('es-ES') : null,
      i.origen,
      i.estado_contacto,
    ].filter(Boolean);
    return `· ${parts.join(' · ')}`;
  });
  return `[Idealista import]\n${lines.join('\n')}`;
}

/**
 * @param {object[]} rawRows — filas del Excel (claves como en export Idealista)
 */
export async function importIdealistaCompradores(rawRows) {
  const normalized = (rawRows || []).map(normRow).filter(Boolean);
  const rows = dedupeNormalizedRows(normalized);
  const stats = {
    filasConTelefono: rows.length,
    compradoresCreados: 0,
    compradoresActualizados: 0,
    compradoresDuplicadosOmitidos: 0,
    interesesRegistrados: 0,
    interesesDuplicadosOmitidos: 0,
    filasOmitidas: (rawRows || []).length - rows.length,
    filasDuplicadasArchivo: normalized.length - rows.length,
    sinVinculoInmueble: 0,
    idealistaSinMatch: new Set(),
    compradorIds: [],
    errores: [],
  };

  const idealistaIds = rows.map((r) => r.idealista_id).filter(Boolean);
  const nhRefs = rows.map((r) => parseNhRef(r.ref_cliente)).filter(Boolean);
  let inmByIdealista = new Map();
  let inmByRef = new Map();
  try {
    inmByIdealista = await fetchInmueblesByIdealistaIds(idealistaIds);
    inmByRef = await fetchInmueblesByRefs(nhRefs);
  } catch (e) {
    stats.errores.push(`No se pudo cargar inmuebles: ${e.message}`);
  }

  try {
    stats.cacheDesdeImport = await seedIdealistaPrecioCacheFromLeads(rows);
    stats.cacheAnuncios = await warmIdealistaPrecioCache(idealistaIds, {
      maxScrape: Math.min(idealistaIds.length, 55),
      delayMs: 300,
    });
  } catch (e) {
    stats.errores.push(`Caché anuncios Idealista: ${e.message}`);
  }

  const byPhone = new Map();
  for (const r of rows) {
    const key = r.telefono;
    if (!byPhone.has(key)) byPhone.set(key, { telefono: key, rows: [] });
    byPhone.get(key).rows.push(r);
  }

  for (const [, group] of byPhone) {
    const contactRows = group.rows;
    let nombre = contactRows.map((r) => r.nombre).find(Boolean);
    if (!nombre) nombre = `Cliente Idealista (${group.telefono.slice(-4)})`;
    const email = contactRows.map((r) => r.email).find(Boolean) || null;

    const interests = contactRows.map((r) => {
      const inm = resolveInmueble(r, inmByIdealista, inmByRef);
      if (r.idealista_id && !inm) stats.idealistaSinMatch.add(r.idealista_id);
      if (r.idealista_id && !inm) stats.sinVinculoInmueble += 1;
      return {
        ...r,
        inmueble_id: inm?.id || null,
        inmueble_ref: inm?.ref || null,
        precio_inmueble:
          inm?.precio != null
            ? Number(inm.precio)
            : r.precio_anuncio != null
              ? Number(r.precio_anuncio)
              : null,
        precio_anuncio: r.precio_anuncio ?? null,
        precio_consultado: null,
      };
    });

    for (const inter of interests) {
      const inm =
        (inter.idealista_id && inmByIdealista.get(inter.idealista_id)) ||
        (inter.inmueble_ref && inmByRef.get(String(inter.inmueble_ref).toUpperCase())) ||
        null;
      const { precio } = await resolveIdealistaLeadPiso(
        { ...inter, inmueble: inm },
        { fetchListing: false },
      );
      if (precio != null) {
        inter.precio_consultado = precio;
        if (inter.idealista_id) {
          try {
            await upsertIdealistaPrecioCache({
              idealista_id: inter.idealista_id,
              precio,
              titulo: inter.descripcion,
            });
          } catch (_) {
            /* noop */
          }
        }
      }
    }

    const notas = buildInteresNotas(interests);

    const compradorBase = {
      nombre,
      telefono: group.telefono,
      email,
      activo: true,
      notas,
      estado_expediente: 'visitas',
    };

    try {
      let compradorId;
      const existing = await findCompradorByTelefono(group.telefono);
      const idealistaPatch = await patchFromIdealistaInterests(
        interests,
        inmByIdealista,
        inmByRef,
        existing || null,
        { fetchListing: false },
      );

      if (existing?.id) {
        compradorId = existing.id;
        stats.compradoresDuplicadosOmitidos += 1;
        const mergedNotas = [existing.notas, notas].filter(Boolean).join('\n').trim();
        const patch = { ...idealistaPatch };
        if (mergedNotas && mergedNotas !== (existing.notas || '').trim()) patch.notas = mergedNotas;
        if (Object.keys(patch).length) {
          try {
            await patchComprador(compradorId, patch);
            stats.compradoresActualizados += 1;
          } catch (_) {
            /* noop */
          }
        }
      } else {
        Object.assign(compradorBase, idealistaPatch);
        let created;
        try {
          created = await insertComprador(compradorBase);
        } catch (e) {
          if (/estado_expediente/.test(e.message)) {
            const { estado_expediente, ...sinExp } = compradorBase;
            created = await insertComprador(sinExp);
          } else if (/duplicate|unique|23505/i.test(e.message)) {
            const again = await findCompradorByTelefono(group.telefono);
            if (!again?.id) throw e;
            compradorId = again.id;
            stats.compradoresDuplicadosOmitidos += 1;
            created = null;
          } else throw e;
        }
        if (created?.id) {
          compradorId = created.id;
          stats.compradoresCreados += 1;
        }
      }

      if (!compradorId) continue;
      stats.compradorIds.push(compradorId);

      for (const inter of interests) {
        const dup = await interesAlreadyExists(compradorId, inter.idealista_id, inter.inmueble_id);
        if (dup) {
          stats.interesesDuplicadosOmitidos += 1;
          continue;
        }
        const st = await insertInteres({ ...inter, comprador_id: compradorId });
        if (st === 'created') stats.interesesRegistrados += 1;
        if (st === 'duplicate') stats.interesesDuplicadosOmitidos += 1;
        if (st === 'no_table') {
          stats.errores.push('Tabla comprador_inmueble_interes no existe — ejecuta migración 066 en Supabase.');
          break;
        }
      }
    } catch (e) {
      stats.errores.push(`${nombre} (${group.telefono}): ${e.message}`);
    }
  }

  try {
    stats.fichasCompletadas = await finalizeIdealistaCompradorFichas(stats.compradorIds, {
      fetchListing: false,
    });
  } catch (e) {
    stats.errores.push(`Completar fichas: ${e.message}`);
  }

  return {
    ok: true,
    ...stats,
    idealistaSinMatch: [...stats.idealistaSinMatch],
    compradorIds: undefined,
  };
}
