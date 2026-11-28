/**
 * Convierte correos entrantes en admin.nuevahabitat@gmail.com en filas de leads (panel).
 * Requiere GOOGLE_REFRESH_TOKEN con scope https://www.googleapis.com/auth/gmail.readonly
 */
import { getGoogleOAuthAccessToken } from './google-calendar.js';
import { insertLeadServer } from './leads-api.js';
import { SB_URL, svcHeaders } from './supabase-server.js';

const ADMIN_INBOX = (process.env.ADMIN_EMAIL || 'admin.nuevahabitat@gmail.com').trim().toLowerCase();
function extractEmailAddress(from) {
  const m = String(from || '').match(/<([^>]+)>/);
  return (m ? m[1] : from || '').trim().toLowerCase();
}

function extractDisplayName(from) {
  const s = String(from || '').trim();
  const m = s.match(/^(.+?)\s*<[^>]+>/);
  if (m) return m[1].replace(/^["']|["']$/g, '').trim();
  const addr = extractEmailAddress(s);
  return addr.split('@')[0] || 'Correo entrante';
}

function extractPhoneES(text) {
  const s = String(text || '');
  const m = s.match(/(?:\+34|0034)?[\s.-]*([6789]\d{2})[\s.-]*(\d{3})[\s.-]*(\d{3})/);
  if (!m) return null;
  const nine = `${m[1]}${m[2]}${m[3]}`;
  return `+34${nine}`;
}

function decodeB64Url(data) {
  if (!data) return '';
  try {
    const b64 = String(data).replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(b64, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

function messageBodyText(payload) {
  if (!payload) return '';
  if (payload.body?.data) return decodeB64Url(payload.body.data);
  const parts = payload.parts || [];
  let text = '';
  let html = '';
  for (const p of parts) {
    const mime = String(p.mimeType || '');
    if (mime === 'text/plain' && p.body?.data) text += decodeB64Url(p.body.data);
    if (mime === 'text/html' && p.body?.data) html += decodeB64Url(p.body.data);
    if (p.parts?.length) {
      const inner = messageBodyText(p);
      if (inner) text += inner;
    }
  }
  if (text.trim()) return text.trim();
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function headerValue(headers, name) {
  const h = (headers || []).find((x) => String(x.name || '').toLowerCase() === name.toLowerCase());
  return h?.value || '';
}

function shouldSkipEmail({ from, subject, snippet }) {
  const f = extractEmailAddress(from);
  const sub = String(subject || '').toLowerCase();
  const snip = String(snippet || '').toLowerCase();
  if (!f) return true;
  if (f === ADMIN_INBOX) return true;
  if (/mailer-daemon|postmaster|noreply|no-reply|donotreply/.test(f)) return true;
  if (/@nuevahabitat\.com$/i.test(f) && /aviso|lead nuevo|formulario/.test(sub + snip)) return true;
  if (/^re:\s*aviso/i.test(sub)) return true;
  return false;
}

function placeholderTelefono(messageId, email) {
  let n = 0;
  const seed = String(messageId || email || 'x');
  for (let i = 0; i < seed.length; i++) n = (n * 31 + seed.charCodeAt(i)) >>> 0;
  const tail = String(n % 10_000_000).padStart(7, '0');
  return `6${tail}`;
}

async function leadExistsForGmailMessage(messageId) {
  const tag = `gmail_msg:${messageId}`;
  const res = await fetch(
    `${SB_URL}/rest/v1/leads?procedencia=eq.${encodeURIComponent(tag)}&select=id&limit=1`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return false;
  const rows = await res.json();
  return !!(rows && rows.length);
}

async function gmailFetch(path, accessToken) {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data.error?.message || `Gmail HTTP ${res.status}`;
    const e = new Error(err);
    e.gmailStatus = res.status;
    throw e;
  }
  return data;
}

/**
 * @param {{ maxMessages?: number, q?: string }} opts
 */
export async function syncGmailInboundLeads(opts = {}) {
  const accessToken = await getGoogleOAuthAccessToken();
  if (!accessToken) {
    return {
      ok: false,
      error: 'Sin Google OAuth (GOOGLE_REFRESH_TOKEN). Añade scope gmail.readonly y vuelve a autorizar.',
    };
  }

  const max = Math.min(Number(opts.maxMessages) || 25, 50);
  const q = opts.q || 'in:inbox newer_than:14d -from:noreply -from:mailer-daemon';

  let list;
  try {
    list = await gmailFetch(`/messages?maxResults=${max}&q=${encodeURIComponent(q)}`, accessToken);
  } catch (e) {
    if (/insufficient|scope|403/i.test(e.message)) {
      return {
        ok: false,
        error:
          'El token de Google no tiene permiso Gmail. Regenera el refresh token con scope gmail.readonly (ver docs/GMAIL-LEADS.md).',
      };
    }
    throw e;
  }

  const ids = (list.messages || []).map((m) => m.id).filter(Boolean);
  let creados = 0;
  let omitidos = 0;
  const errores = [];

  for (const messageId of ids) {
    try {
      const msg = await gmailFetch(`/messages/${messageId}?format=full`, accessToken);
      const headers = msg.payload?.headers || [];
      const from = headerValue(headers, 'From');
      const subject = headerValue(headers, 'Subject');
      const snippet = msg.snippet || '';

      if (shouldSkipEmail({ from, subject, snippet })) {
        omitidos++;
        continue;
      }
      if (await leadExistsForGmailMessage(messageId)) {
        omitidos++;
        continue;
      }

      const body = messageBodyText(msg.payload);
      const email = extractEmailAddress(from);
      const nombre = extractDisplayName(from);
      const tel = extractPhoneES(`${body}\n${snippet}`) || placeholderTelefono(messageId, email);
      const mensaje = [`[gmail_msg:${messageId}]`, `Asunto: ${subject || '(sin asunto)'}`, '', body || snippet]
        .join('\n')
        .slice(0, 12000);

      const ins = await insertLeadServer({
        nombre,
        telefono: tel,
        email: email || null,
        mensaje,
        tipo: 'info',
        origen: 'gmail_inbound',
        procedencia: `gmail_msg:${messageId}`,
        estado: 'nuevo',
      });

      if (!ins?.id) {
        errores.push(`${messageId}: no insertado`);
        continue;
      }
      creados++;
    } catch (e) {
      errores.push(`${messageId}: ${e.message}`);
    }
  }

  return {
    ok: true,
    revisados: ids.length,
    creados,
    omitidos,
    errores,
    inbox: ADMIN_INBOX,
  };
}