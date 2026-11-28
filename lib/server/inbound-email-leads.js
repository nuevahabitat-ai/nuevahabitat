/**
 * Crear lead desde correo entrante (Gmail API o Resend Receiving).
 */
import { insertLeadServer } from './leads-api.js';
import { SB_URL, svcHeaders } from './supabase-server.js';

export function extractEmailAddress(from) {
  const m = String(from || '').match(/<([^>]+)>/);
  return (m ? m[1] : from || '').trim().toLowerCase();
}

export function extractDisplayName(from) {
  const s = String(from || '').trim();
  const m = s.match(/^(.+?)\s*<[^>]+>/);
  if (m) return m[1].replace(/^["']|["']$/g, '').trim();
  const addr = extractEmailAddress(s);
  return addr.split('@')[0] || 'Correo entrante';
}

export function extractPhoneES(text) {
  const s = String(text || '');
  const m = s.match(/(?:\+34|0034)?[\s.-]*([6789]\d{2})[\s.-]*(\d{3})[\s.-]*(\d{3})/);
  if (!m) return null;
  return `+34${m[1]}${m[2]}${m[3]}`;
}

export function placeholderTelefono(messageKey, email) {
  let n = 0;
  const seed = String(messageKey || email || 'x');
  for (let i = 0; i < seed.length; i++) n = (n * 31 + seed.charCodeAt(i)) >>> 0;
  return `6${String(n % 10_000_000).padStart(7, '0')}`;
}

export function shouldSkipInboundEmail({ from, subject, snippet }) {
  const f = extractEmailAddress(from);
  const sub = String(subject || '').toLowerCase();
  const snip = String(snippet || '').toLowerCase();
  if (!f) return true;
  if (/mailer-daemon|postmaster|noreply|no-reply|donotreply|bounce/.test(f)) return true;
  if (/@nuevahabitat\.com$/i.test(f) && /aviso|lead nuevo|nuevo lead|formulario|resend\.com/.test(sub + snip)) {
    return true;
  }
  if (/^re:\s*aviso/i.test(sub)) return true;
  return false;
}

export async function inboundLeadExists(procedenciaTag) {
  const res = await fetch(
    `${SB_URL}/rest/v1/leads?procedencia=eq.${encodeURIComponent(procedenciaTag)}&select=id&limit=1`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return false;
  const rows = await res.json();
  return !!(rows && rows.length);
}

/**
 * @param {{ origen: string, procedenciaTag: string, from: string, subject: string, body: string, snippet?: string }} opts
 */
export async function createLeadFromInboundEmail(opts) {
  const { origen, procedenciaTag, from, subject, body, snippet = '' } = opts;
  if (await inboundLeadExists(procedenciaTag)) {
    return { ok: true, skipped: true, duplicate: true };
  }
  if (shouldSkipInboundEmail({ from, subject, snippet: snippet || body.slice(0, 200) })) {
    return { ok: true, skipped: true, filtered: true };
  }

  const email = extractEmailAddress(from);
  const nombre = extractDisplayName(from);
  const tel = extractPhoneES(`${body}\n${snippet}`) || placeholderTelefono(procedenciaTag, email);
  const mensaje = [
    `[${procedenciaTag}]`,
    `Asunto: ${subject || '(sin asunto)'}`,
    '',
    body || snippet,
  ]
    .join('\n')
    .slice(0, 12000);

  const ins = await insertLeadServer({
    nombre,
    telefono: tel,
    email: email || null,
    mensaje,
    tipo: 'info',
    origen,
    procedencia: procedenciaTag,
    estado: 'nuevo',
  });

  if (!ins?.id) return { ok: false, error: 'no insertado' };
  return { ok: true, id: ins.id };
}