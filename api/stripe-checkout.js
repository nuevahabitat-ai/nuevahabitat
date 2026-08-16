/**
 * POST /api/stripe-checkout — Crea sesión Stripe Checkout para honorarios.
 * Requiere: STRIPE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY
 */
import Stripe from 'stripe';
import { SB_SERVICE, getUserFromJwt, fetchClienteRow } from './lib/supabase-server.js';

const DEFAULT_HONORARIOS = { comprador: 6050, vendedor: 3630 };

function siteOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.nuevahabitat.com';
  return `${proto}://${host}`;
}

function eurosToCents(amount) {
  return Math.round(Number(amount) * 100);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({ ok: false, error: 'Stripe no configurado', code: 'NO_STRIPE' });
  }
  if (!SB_SERVICE) {
    return res.status(503).json({ ok: false, error: 'SERVICE_ROLE_KEY missing', code: 'NO_SERVICE_KEY' });
  }

  const auth = req.headers.authorization || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = await getUserFromJwt(jwt);
  if (!user?.email) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  const body = req.body || {};
  const tipo = body.tipo === 'vendedor' ? 'vendedor' : 'comprador';
  const email = user.email.trim();

  try {
    const row = await fetchClienteRow(tipo, email);
    if (!row) {
      return res.status(404).json({ ok: false, error: 'Expediente no encontrado' });
    }
    if (row.honorarios_pagado) {
      return res.status(400).json({ ok: false, error: 'Los honorarios ya están pagados', code: 'ALREADY_PAID' });
    }

    const totalEur = Number(row.honorarios) || DEFAULT_HONORARIOS[tipo];
    const amountCents = eurosToCents(totalEur);
    if (amountCents < 100) {
      return res.status(400).json({ ok: false, error: 'Importe inválido' });
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2024-11-20.acacia' });
    const origin = siteOrigin(req);
    const productLabel = tipo === 'vendedor'
      ? 'Honorarios NuevaHabitat — Venta de inmueble'
      : 'Honorarios NuevaHabitat — Acompañamiento compra';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: amountCents,
          product_data: {
            name: productLabel,
            description: `Pago seguro con tarjeta · ${totalEur.toLocaleString('es-ES')} € IVA incluido`,
          },
        },
      }],
      metadata: {
        nh_tipo: tipo,
        nh_record_id: row.id,
        nh_user_id: user.id,
        nh_email: email,
      },
      success_url: `${origin}/panel?tipo=${tipo}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panel?tipo=${tipo}&pago=cancel`,
    });

    return res.status(200).json({ ok: true, url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('stripe-checkout:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Error al crear pago' });
  }
}
