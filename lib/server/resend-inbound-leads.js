/**
 * Correos recibidos en dominio Resend (Receiving) → tabla leads.
 * Requiere RESEND_API_KEY y Receiving activado en Resend (p. ej. leads@nuevahabitat.com).
 */
import {
  createLeadFromInboundEmail,
  extractEmailAddress,
} from './inbound-email-leads.js';

function inboundAddresses() {
  const raw =
    process.env.RESEND_INBOUND_TO ||
    process.env.CONTACT_EMAIL ||
  'leads@nuevahabitat.com,admin@nuevahabitat.com,info@nuevahabitat.com';
  return [...new Set(raw.split(/[,;]/).map((s) => s.trim().toLowerCase()).filter(Boolean))].slice(0, 20);
}

async function resendFetch(path, apiKey) {
  const res = await fetch(`https://api.resend.com${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data.message || data.error || `Resend HTTP ${res.status}`;
    const e = new Error(err);
    e.status = res.status;
    throw e;
  }
  return data;
}

/**
 * @param {{ maxMessages?: number, emailId?: string }} opts
 */
export async function syncResendInboundLeads(opts = {}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY no configurada en Vercel' };
  }

  const addresses = inboundAddresses();
  let creados = 0;
  let omitidos = 0;
  const errores = [];
  const revisados = [];

  const processOne = async (meta, full) => {
    const emailId = meta.id || meta.email_id;
    if (!emailId) return;
    const from = meta.from || full?.from || '';
    const subject = meta.subject || full?.subject || '';
    const body = full?.text || full?.html?.replace(/<[^>]+>/g, ' ') || meta.snippet || '';
    const tag = `resend_msg:${emailId}`;
    const r = await createLeadFromInboundEmail({
      origen: 'resend_inbound',
      procedenciaTag: tag,
      from,
      subject,
      body,
      snippet: meta.snippet || '',
    });
    if (r.duplicate || r.filtered) omitidos++;
    else if (r.id) creados++;
    else if (r.error) errores.push(`${emailId}: ${r.error}`);
  };

  try {
    if (opts.emailId) {
      const fullWrap = await resendFetch(`/emails/receiving/${encodeURIComponent(opts.emailId)}`, apiKey);
      const full = fullWrap.data ?? fullWrap;
      revisados.push(opts.emailId);
      await processOne({ id: opts.emailId, ...full }, full);
      return { ok: true, revisados: 1, creados, omitidos, errores, addresses };
    }

    const limit = Math.min(Number(opts.maxMessages) || 40, 100);
    const toQuery = addresses.map((a) => `to=${encodeURIComponent(a)}`).join('&');
    const list = await resendFetch(`/emails/receiving?limit=${limit}&${toQuery}`, apiKey);
    const items = list.data || list || [];
    for (const meta of items) {
      revisados.push(meta.id);
      try {
        const fullWrap = await resendFetch(`/emails/receiving/${encodeURIComponent(meta.id)}`, apiKey);
        const full = fullWrap.data ?? fullWrap;
        await processOne(meta, full);
      } catch (e) {
        errores.push(`${meta.id}: ${e.message}`);
      }
    }

    return {
      ok: true,
      revisados: revisados.length,
      creados,
      omitidos,
      errores,
      addresses,
      has_more: list.has_more === true,
    };
  } catch (e) {
    if (e.status === 404 || /receiving|not found|inbound/i.test(e.message)) {
      return {
        ok: false,
        error:
          'Receiving no activado en Resend o sin correos en esas direcciones. Ver docs/RESEND-INBOUND-LEADS.md',
      };
    }
    throw e;
  }
}

export async function processResendWebhookReceived(emailId) {
  return syncResendInboundLeads({ emailId, maxMessages: 1 });
}