/**
 * Correos en admin.nuevahabitat@gmail.com (Gmail API) → leads.
 * Alternativa: reenvío a Resend Receiving (recomendado si ya usáis RESEND_API_KEY).
 */
import { getGoogleOAuthAccessToken } from './google-calendar.js';
import {
  createLeadFromInboundEmail,
  extractEmailAddress,
  shouldSkipInboundEmail,
} from './inbound-email-leads.js';

const ADMIN_INBOX = (process.env.ADMIN_EMAIL || 'admin.nuevahabitat@gmail.com').trim().toLowerCase();

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

export async function syncGmailInboundLeads(opts = {}) {
  const accessToken = await getGoogleOAuthAccessToken();
  if (!accessToken) {
    return {
      ok: false,
      error: 'Sin Google OAuth (GOOGLE_REFRESH_TOKEN). Opción más simple: Resend Receiving + reenvío Gmail.',
    };
  }

  const max = Math.min(Number(opts.maxMessages) || 25, 50);
  const q = opts.q || 'in:inbox newer_than:14d -from:noreply -from:mailer-daemon';

  let list;
  try {
    list = await gmailFetch(`/messages?maxResults=${max}&q=${encodeURIComponent(q)}`, accessToken);
  } catch (e) {
    if (/insufficient|scope|403/i.test(e.message)) {
      return { ok: false, error: 'Token Google sin scope gmail.readonly (ver docs/GMAIL-LEADS.md).' };
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
      if (extractEmailAddress(from) === ADMIN_INBOX) {
        omitidos++;
        continue;
      }
      const body = messageBodyText(msg.payload);
      const r = await createLeadFromInboundEmail({
        origen: 'gmail_inbound',
        procedenciaTag: `gmail_msg:${messageId}`,
        from,
        subject,
        body,
        snippet,
      });
      if (r.duplicate || r.filtered) omitidos++;
      else if (r.id) creados++;
      else if (r.error) errores.push(`${messageId}: ${r.error}`);
    } catch (e) {
      errores.push(`${messageId}: ${e.message}`);
    }
  }

  return { ok: true, revisados: ids.length, creados, omitidos, errores, inbox: ADMIN_INBOX };
}