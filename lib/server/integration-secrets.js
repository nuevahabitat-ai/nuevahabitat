/**
 * Secretos de integración en Supabase (fallback si faltan env en Vercel).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';

const GOOGLE_KEYS = {
  GOOGLE_CLIENT_ID: 'google_client_id',
  GOOGLE_CLIENT_SECRET: 'google_client_secret',
  GOOGLE_REFRESH_TOKEN: 'google_refresh_token',
  GOOGLE_CALENDAR_ID: 'google_calendar_id',
};

/** Env var → columna `private_integrations.key` (fallback si Vercel no tiene el secreto). */
const INTEGRATION_ENV_MAP = {
  ...GOOGLE_KEYS,
  GEMINI_API_KEY: 'gemini_api_key',
};

let cache = { at: 0, map: {} };
const CACHE_MS = 60_000;

async function fetchIntegrationMap() {
  const now = Date.now();
  if (now - cache.at < CACHE_MS && Object.keys(cache.map).length) return cache.map;
  const keys = Object.values(INTEGRATION_ENV_MAP).join(',');
  const res = await fetch(
    `${SB_URL}/rest/v1/private_integrations?key=in.(${keys})&select=key,value`,
    { headers: svcHeaders() }
  );
  if (!res.ok) {
    cache = { at: now, map: {} };
    return {};
  }
  const rows = await res.json();
  const map = {};
  for (const row of rows || []) {
    if (row?.key && row.value != null) map[row.key] = String(row.value).trim();
  }
  cache = { at: now, map };
  return map;
}

export async function getIntegrationSecret(envName) {
  const fromEnv = String(process.env[envName] || '').trim();
  if (fromEnv) return fromEnv;
  const dbKey = INTEGRATION_ENV_MAP[envName];
  if (!dbKey) return '';
  const map = await fetchIntegrationMap();
  return map[dbKey] || '';
}

export async function saveGoogleCalendarIntegration({
  clientId,
  clientSecret,
  refreshToken,
  calendarId,
}) {
  const rows = [];
  if (clientId) rows.push({ key: GOOGLE_KEYS.GOOGLE_CLIENT_ID, value: clientId.trim() });
  if (clientSecret) rows.push({ key: GOOGLE_KEYS.GOOGLE_CLIENT_SECRET, value: clientSecret.trim() });
  if (refreshToken) rows.push({ key: GOOGLE_KEYS.GOOGLE_REFRESH_TOKEN, value: refreshToken.trim() });
  if (calendarId) rows.push({ key: GOOGLE_KEYS.GOOGLE_CALENDAR_ID, value: calendarId.trim() });
  if (!rows.length) return { ok: false, error: 'Nada que guardar' };

  for (const row of rows) {
    const res = await fetch(`${SB_URL}/rest/v1/private_integrations?on_conflict=key`, {
      method: 'POST',
      headers: svcHeaders('resolution=merge-duplicates,return=minimal'),
      body: JSON.stringify({ ...row, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) {
      const err = await res.text();
      if (/relation.*does not exist|42P01/i.test(err)) {
        return { ok: false, error: 'Ejecuta migración 062_private_integrations.sql en Supabase', raw: err };
      }
      return { ok: false, error: err };
    }
  }
  cache = { at: 0, map: {} };
  return { ok: true };
}

export function defaultGoogleClientId() {
  return '311723462282-lva0ig636e0387g12b1r51in9fceoru2.apps.googleusercontent.com';
}

export async function saveGeminiIntegration(apiKey) {
  const value = String(apiKey || '').trim();
  if (value.length < 10) return { ok: false, error: 'API key demasiado corta' };
  const res = await fetch(`${SB_URL}/rest/v1/private_integrations?on_conflict=key`, {
    method: 'POST',
    headers: svcHeaders('resolution=merge-duplicates,return=minimal'),
    body: JSON.stringify({
      key: INTEGRATION_ENV_MAP.GEMINI_API_KEY,
      value,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    if (/relation.*does not exist|42P01/i.test(err)) {
      return { ok: false, error: 'Ejecuta migración 062_private_integrations.sql en Supabase', raw: err };
    }
    return { ok: false, error: err };
  }
  cache = { at: 0, map: {} };
  return { ok: true };
}

export async function clearGoogleCalendarIntegration() {
  const keys = Object.values(GOOGLE_KEYS);
  for (const dbKey of keys) {
    const res = await fetch(`${SB_URL}/rest/v1/private_integrations?key=eq.${encodeURIComponent(dbKey)}`, {
      method: 'DELETE',
      headers: svcHeaders('return=minimal'),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err };
    }
  }
  cache = { at: 0, map: {} };
  return { ok: true };
}
