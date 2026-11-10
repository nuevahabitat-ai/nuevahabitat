/**
 * Importar contactos Idealista (.xls export) → compradores activos + interés por inmueble.
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { normalizePhoneES, findCompradorByTelefono, insertComprador } from './compradores-api.js';

function parseIdealistaRef(val) {
  if (val == null || val === '') return null;
  const n = Number(val);
  if (Number.isFinite(n)) return String(Math.trunc(n));
  const s = String(val).trim();
  return s || null;
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

function tipoFromDescripcion(desc) {
  const s = String(desc || '').toLowerCase();
  if (/\bático\b|\batico\b/.test(s)) return 'atico';
  if (/\bdúplex\b|\bduplex\b/.test(s)) return 'duplex';
  if (/\bcasa\b|\bchalet\b|\badosado\b/.test(s)) return 'casa';
  if (/\blocal\b/.test(s)) return 'local';
  if (/\bgaraje\b/.test(s)) return 'garaje';
  if (/\bpiso\b|\bapartamento\b/.test(s)) return 'piso';
  return null;
}

function zonaFromDescripcion(desc) {
  const s = String(desc || '').trim();
  if (!s) return null;
  const m = s.match(/en venta en\s+(.+)/i);
  if (m) return m[1].slice(0, 240).trim();
  return s.slice(0, 240);
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
  };
}

async function fetchInmueblesByIdealistaIds(ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return new Map();
  const q = `${SB_URL}/rest/v1/inmuebles?idealista_id=in.(${unique.map((id) => encodeURIComponent(id)).join(',')})&select=id,idealista_id,precio,titulo,ref,barrio,municipio`;
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

async function patchComprador(id, data) {
  const res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: svcHeaders('return=minimal'),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
}

async function upsertInteres(row) {
  if (!row.comprador_id) return;
  const body = {
    comprador_id: row.comprador_id,
    inmueble_id: row.inmueble_id || null,
    idealista_id: row.idealista_id || null,
    ref_cliente: row.ref_cliente || null,
    descripcion: row.descripcion || null,
    origen: row.origen || null,
    estado_contacto: row.estado_contacto || null,
    mensaje: row.mensaje || null,
    tipo_mensaje: row.tipo_mensaje || null,
    fecha_contacto: row.fecha_contacto || null,
  };
  if (body.idealista_id) {
    const existing = await fetch(
      `${SB_URL}/rest/v1/comprador_inmueble_interes?comprador_id=eq.${encodeURIComponent(row.comprador_id)}&idealista_id=eq.${encodeURIComponent(body.idealista_id)}&select=id&limit=1`,
      { headers: svcHeaders() }
    );
    if (existing.ok) {
      const ex = await existing.json();
      if (ex?.[0]?.id) {
        const res = await fetch(`${SB_URL}/rest/v1/comprador_inmueble_interes?id=eq.${encodeURIComponent(ex[0].id)}`, {
          method: 'PATCH',
          headers: svcHeaders('return=minimal'),
          body: JSON.stringify(body),
        });
        if (!res.ok && res.status !== 404) throw new Error(await res.text());
        return 'updated';
      }
    }
  }
  const res = await fetch(`${SB_URL}/rest/v1/comprador_inmueble_interes`, {
    method: 'POST',
    headers: svcHeaders('return=minimal'),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    if (/duplicate|unique|23505/i.test(t)) return 'skipped';
    if (res.status === 404 || /comprador_inmueble_interes/.test(t)) return 'no_table';
    throw new Error(t);
  }
  return 'created';
}

function buildInteresNotas(interests) {
  const lines = interests.map((i) => {
    const parts = [
      i.idealista_id ? `Idealista ${i.idealista_id}` : null,
      i.descripcion,
      i.inmueble_ref ? `NH ${i.inmueble_ref}` : (i.inmueble_id ? 'Inmueble vinculado' : 'Sin vincular NH'),
      i.precio_inmueble != null ? `${Number(i.precio_inmueble).toLocaleString('es-ES')} €` : null,
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
  const rows = (rawRows || []).map(normRow).filter(Boolean);
  const stats = {
    filasConTelefono: rows.length,
    compradoresCreados: 0,
    compradoresActualizados: 0,
    interesesRegistrados: 0,
    filasOmitidas: (rawRows || []).length - rows.length,
    sinVinculoInmueble: 0,
    idealistaSinMatch: new Set(),
    errores: [],
  };

  const idealistaIds = rows.map((r) => r.idealista_id).filter(Boolean);
  let inmMap = new Map();
  try {
    inmMap = await fetchInmueblesByIdealistaIds(idealistaIds);
  } catch (e) {
    stats.errores.push(`No se pudo cargar inmuebles por idealista_id: ${e.message}`);
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
      const inm = r.idealista_id ? inmMap.get(r.idealista_id) : null;
      if (r.idealista_id && !inm) stats.idealistaSinMatch.add(r.idealista_id);
      if (r.idealista_id && !inm) stats.sinVinculoInmueble += 1;
      return {
        ...r,
        inmueble_id: inm?.id || null,
        inmueble_ref: inm?.ref || null,
        precio_inmueble: inm?.precio != null ? Number(inm.precio) : null,
      };
    });

    const precios = interests.map((i) => i.precio_inmueble).filter((p) => p != null && Number.isFinite(p));
    const presupuesto_max = precios.length ? Math.max(...precios) : null;
    const tipo_inmueble = interests.map((i) => tipoFromDescripcion(i.descripcion)).find(Boolean) || null;
    const zona_buscada = interests.map((i) => zonaFromDescripcion(i.descripcion)).find(Boolean) || null;
    const notas = buildInteresNotas(interests);

    const compradorBase = {
      nombre,
      telefono: group.telefono,
      email,
      activo: true,
      presupuesto_max,
      tipo_inmueble,
      zona_buscada,
      notas,
      estado_expediente: 'visitas',
    };

    try {
      let compradorId;
      const existing = await findCompradorByTelefono(group.telefono);
      if (existing?.id) {
        compradorId = existing.id;
        const patch = { ...compradorBase };
        if (existing.presupuesto_max != null && presupuesto_max != null) {
          patch.presupuesto_max = Math.max(Number(existing.presupuesto_max), presupuesto_max);
        }
        const prevNotas = existing.notas || '';
        if (!prevNotas.includes('[Idealista import]')) {
          patch.notas = prevNotas ? `${prevNotas}\n\n${notas}` : notas;
        } else {
          delete patch.notas;
        }
        try {
          await patchComprador(compradorId, patch);
        } catch (e) {
          if (/estado_expediente/.test(e.message)) {
            delete patch.estado_expediente;
            await patchComprador(compradorId, patch);
          } else throw e;
        }
        stats.compradoresActualizados += 1;
      } else {
        let created;
        try {
          created = await insertComprador(compradorBase);
        } catch (e) {
          if (/estado_expediente/.test(e.message)) {
            const { estado_expediente, ...sinExp } = compradorBase;
            created = await insertComprador(sinExp);
          } else throw e;
        }
        compradorId = created.id;
        stats.compradoresCreados += 1;
      }

      for (const inter of interests) {
        const st = await upsertInteres({ ...inter, comprador_id: compradorId });
        if (st === 'created' || st === 'updated') stats.interesesRegistrados += 1;
        if (st === 'no_table') {
          stats.errores.push('Tabla comprador_inmueble_interes no existe — ejecuta migración 066 en Supabase.');
          break;
        }
      }
    } catch (e) {
      stats.errores.push(`${nombre} (${group.telefono}): ${e.message}`);
    }
  }

  return {
    ok: true,
    ...stats,
    idealistaSinMatch: [...stats.idealistaSinMatch],
  };
}
