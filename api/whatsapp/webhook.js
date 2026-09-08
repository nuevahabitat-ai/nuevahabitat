/**
 * GET/POST /api/whatsapp/webhook — WhatsApp Cloud API (Captador / Nueva Habitat)
 * Meta Developers → Callback: https://www.nuevahabitat.com/api/whatsapp/webhook
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_VERIFY = 'captador-nh-webhook-2026';

async function readRawBody(req) {
  if (req.body && typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'));
  }
  return chunks.join('');
}

function verifySignature(rawBody, header) {
  const secret = process.env.WHATSAPP_APP_SECRET?.trim();
  if (!secret) return true;
  if (!header?.startsWith('sha256=')) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const got = header.slice('sha256='.length);
  try {
    return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(got, 'utf8'));
  } catch {
    return false;
  }
}

function parseInbound(payload) {
  const messages = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const msg of change.value?.messages ?? []) {
        const text =
          msg.text?.body ??
          msg.button?.text ??
          msg.interactive?.button_reply?.title ??
          msg.interactive?.list_reply?.title ??
          '';
        if (msg.from) {
          messages.push({ from: msg.from, text: String(text).trim(), id: msg.id });
        }
      }
    }
  }
  return messages;
}

async function forwardToCaptador(rawBody, signature) {
  const base =
    process.env.CAPTADOR_WA_FORWARD_URL?.trim() ||
    process.env.WORKER_SERVICE_URL?.trim()?.replace(/\/$/, '') ||
    'http://75.119.130.152:3003/wa-webhook';
  if (!base) return { ok: false, skipped: true };
  const url = base.includes('/wa-webhook') ? base : `${base}/wa-webhook`;
  const headers = { 'Content-Type': 'application/json' };
  if (signature) headers['x-hub-signature-256'] = signature;
  const res = await fetch(url, { method: 'POST', headers, body: rawBody });
  return { ok: res.ok, status: res.status };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN?.trim() || DEFAULT_VERIFY;
    if (mode === 'subscribe' && token === expected && challenge) {
      res.status(200).setHeader('Content-Type', 'text/plain').send(String(challenge));
      return;
    }
    res.status(403).setHeader('Content-Type', 'text/plain').send('Forbidden');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const rawBody = await readRawBody(req);
  const signature = req.headers['x-hub-signature-256'];
  if (!verifySignature(rawBody, signature)) {
    res.status(403).json({ error: 'Invalid signature' });
    return;
  }

  let payload = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  try {
    await forwardToCaptador(rawBody, signature);
  } catch (e) {
    console.error('wa forward:', e);
  }

  const messages = parseInbound(payload);
  if (messages.length) {
    console.log('wa inbound', messages.length, messages[0]?.from);
  }

  res.status(200).json({ ok: true, messages: messages.length });
}
