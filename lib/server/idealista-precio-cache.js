import { SB_URL, svcHeaders } from './supabase-server.js';
import { getIntegrationSecret } from './integration-secrets.js';

const MAP_KEY = 'idealista_precios_map';
let memMap = { at: 0, map: null };

async function loadMapFromIntegrations() {
  const now = Date.now();
  if (memMap.map && now - memMap.at < 60_000) return memMap.map;
  const raw = await getIntegrationSecret('IDEALISTA_PRECIOS_MAP');
  if (!raw) {
    memMap = { at: now, map: {} };
    return {};
  }
  try {
    const map = JSON.parse(raw);
    memMap = { at: now, map: typeof map === 'object' && map ? map : {} };
    return memMap.map;
  } catch {
    memMap = { at: now, map: {} };
    return {};
  }
}

async function saveMapToIntegrations(map) {
  const res = await fetch(`${SB_URL}/rest/v1/private_integrations?on_conflict=key`, {
    method: 'POST',
    headers: svcHeaders('resolution=merge-duplicates,return=minimal'),
    body: JSON.stringify({
      key: MAP_KEY,
      value: JSON.stringify(map),
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) return { ok: false, error: await res.text() };
  memMap = { at: 0, map: null };
  return { ok: true };
}

async function getFromTable(idealistaId) {
  const res = await fetch(
    `${SB_URL}/rest/v1/idealista_anuncio_cache?idealista_id=eq.${encodeURIComponent(idealistaId)}&select=precio,habitaciones,titulo,fetched_at&limit=1`,
    { headers: svcHeaders() },
  );
  if (res.status === 404 || !res.ok) return null;
  const rows = await res.json();
  const row = rows?.[0];
  if (!row?.precio) return null;
  return row;
}

export async function getIdealistaPrecioCache(idealistaId) {
  const id = String(idealistaId || '').trim();
  if (!id) return null;
  const tableRow = await getFromTable(id);
  if (tableRow) return tableRow;
  const map = await loadMapFromIntegrations();
  const ent = map[id];
  if (!ent?.precio) return null;
  return {
    precio: ent.precio,
    habitaciones: ent.habitaciones ?? null,
    titulo: ent.titulo ?? null,
    fetched_at: ent.fetched_at,
  };
}

export async function upsertIdealistaPrecioCache({ idealista_id, precio, habitaciones, titulo }) {
  const id = String(idealista_id || '').trim();
  if (!id || precio == null) return { ok: false, error: 'datos incompletos' };

  const res = await fetch(`${SB_URL}/rest/v1/idealista_anuncio_cache?on_conflict=idealista_id`, {
    method: 'POST',
    headers: svcHeaders('resolution=merge-duplicates,return=minimal'),
    body: JSON.stringify({
      idealista_id: id,
      precio: Math.round(Number(precio)),
      habitaciones: habitaciones != null ? Number(habitaciones) : null,
      titulo: titulo ? String(titulo).slice(0, 300) : null,
      fetched_at: new Date().toISOString(),
    }),
  });
  if (res.ok) return { ok: true, store: 'table' };

  const map = await loadMapFromIntegrations();
  map[id] = {
    precio: Math.round(Number(precio)),
    habitaciones: habitaciones != null ? Number(habitaciones) : null,
    titulo: titulo ? String(titulo).slice(0, 300) : null,
    fetched_at: new Date().toISOString(),
  };
  const saved = await saveMapToIntegrations(map);
  if (!saved.ok) return saved;
  return { ok: true, store: 'private_integrations' };
}
