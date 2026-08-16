/**
 * POST /api/stripe-webhook — Eventos Stripe (checkout.session.completed).
 * Configurar en Stripe Dashboard → Webhooks → https://www.nuevahabitat.com/api/stripe-webhook
 */
import Stripe from 'stripe';
import { markHonorariosPaid } from './lib/supabase-server.js';

async function readRawBody(req) {
  if (req.body && typeof req.body === 'string') return Buffer.from(req.body);
  if (Buffer.isBuffer(req.body)) return req.body;
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return res.status(503).json({ error: 'Webhook not configured' });
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2024-11-20.acacia' });
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('stripe-webhook signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      const meta = session.metadata || {};
      const tipo = meta.nh_tipo === 'vendedor' ? 'vendedor' : 'comprador';
      const recordId = meta.nh_record_id;
      if (recordId) {
        try {
          await markHonorariosPaid({
            tipo,
            recordId,
            sessionId: session.id,
            paymentIntentId: typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id,
          });
        } catch (err) {
          console.error('stripe-webhook mark paid:', err);
          return res.status(500).json({ error: 'DB update failed' });
        }
      }
    }
  }

  return res.status(200).json({ received: true });
}
