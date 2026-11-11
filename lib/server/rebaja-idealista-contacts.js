/**
 * Contactos rebaja = import Idealista con el mismo idealista_id del anuncio.
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { normalizeIdealistaId } from './idealista-id.js';

function normTel(t) {
  const d = String(t || '').replace(/\D/g, '');
  return d.length >= 9 ? d.slice(-9) : d;
}

function rowFromComprador(c, idealistaId, fuente) {
  if (!c?.telefono && !c?.email) return null;
  return {
    visita_id: `${fuente}:${c.id}:${idealistaId}`,
    nombre: c.nombre || '',
    email: c.email || '',
    telefono: c.telefono || '',
    estado: 'realizada',
    comprador_id: c.id,
    fuente,
  };
}

async function loadCompradoresMap(ids) {
  const uniq = [...new Set(ids.filter(Boolean))];
  if (!uniq.length) return new Map();
  const inList = uniq.map((id) => encodeURIComponent(id)).join(',');
  const res = await fetch(
    `${SB_URL}/rest/v1/compradores?id=in.(${inList})&select=id,nombre,email,telefono&limit=500`,
    { headers: svcHeaders() }
  );
  if (!res.ok) return new Map();
  const map = new Map();
  for (const c of await res.json()) map.set(c.id, c);
  return map;
}

/**
 * @param {string} idealistaIdRaw
 * @returns {Promise<{ visitantes: object[], meta: object }>}
 */
export async function getIdealistaRebajaContacts(idealistaIdRaw, inmuebleId = null) {
  const idealistaId = normalizeIdealistaId(idealistaIdRaw);
  const meta = { idealistaId, interes: 0, notas: 0, serviceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY };
  if (!idealistaId) {
    return { visitantes: [], meta: { ...meta, warn: 'Sin ref. Idealista en el inmueble o en el modal' } };
  }

  const seen = new Set();
  const out = [];
  function push(row) {
    if (!row) return;
    const key = row.comprador_id
      ? `c:${row.comprador_id}`
      : normTel(row.telefono) || String(row.email || '').toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(row);
  }

  const interesRes = await fetch(
    `${SB_URL}/rest/v1/comprador_inmueble_interes?idealista_id=eq.${encodeURIComponent(idealistaId)}&select=comprador_id,idealista_id,fecha_contacto&limit=800`,
    { headers: svcHeaders() }
  );
  if (interesRes.status === 404) {
    meta.warn = 'Tabla comprador_inmueble_interes no existe (migración 066)';
  } else if (interesRes.ok) {
    const intereses = await interesRes.json();
    meta.interes = intereses.length;
    const cmap = await loadCompradoresMap(intereses.map((r) => r.comprador_id));
    for (const r of intereses) {
      push(rowFromComprador(cmap.get(r.comprador_id), idealistaId, 'idealista_import'));
    }
  }

  const patterns = [`%Idealista ${idealistaId}%`, `%${idealistaId}%`];
  for (const pat of patterns) {
    const res = await fetch(
      `${SB_URL}/rest/v1/compradores?notas=ilike.${encodeURIComponent(pat)}&select=id,nombre,email,telefono,notas&limit=500`,
      { headers: svcHeaders() }
    );
    if (!res.ok) continue;
    for (const c of await res.json()) {
      if (!String(c.notas || '').includes(idealistaId)) continue;
      if (push(rowFromComprador(c, idealistaId, 'idealista_notas'))) meta.notas += 1;
    }
  }

  if (inmuebleId && !meta.warn) {
    await fetch(`${SB_URL}/rest/v1/inmuebles?id=eq.${encodeURIComponent(inmuebleId)}`, {
      method: 'PATCH',
      headers: svcHeaders('return=minimal'),
      body: JSON.stringify({ idealista_id: idealistaId }),
    });
  }

  return { visitantes: out, meta };
}
