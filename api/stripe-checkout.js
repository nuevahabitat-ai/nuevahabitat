/**
 * POST /api/stripe-checkout — Stripe Checkout (tarjeta)
 * GET/POST /api/stripe-checkout?transfer=1 — Transferencia bancaria
 */
import Stripe from 'stripe';
import { getBankConfig, paymentReference } from './lib/bank-config.js';
import {
  SB_SERVICE,
  getUserFromJwt,
  fetchClienteRowAsUser,
  markTransferenciaPendiente,
} from './lib/supabase-server.js';
import { notifyTransferenciaPendiente } from './lib/payment-notify.js';

const DEFAULT_HONORARIOS = { comprador: 6050, vendedor: 3630 };

function siteOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.nuevahabitat.com';
  return `${proto}://${host}`;
}

function eurosToCents(amount) {
  return Math.round(Number(amount) * 100);
}

function isTransferRequest(req) {
  return req.query?.transfer === '1' || req.body?.transfer === true;
}

async function handleTransfer(req, res) {
  if (!SB_SERVICE) {
    return res.status(503).json({ ok: false, error: 'Servicio no configurado', code: 'NO_SERVICE_KEY' });
  }

  const auth = req.headers.authorization || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = await getUserFromJwt(jwt);
  if (!user?.email || !jwt) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  const tipoParam = req.method === 'GET'
    ? (req.query?.tipo || 'comprador')
    : (req.body?.tipo || 'comprador');
  const tipo = tipoParam === 'vendedor' ? 'vendedor' : 'comprador';

  try {
    const row = await fetchClienteRowAsUser(tipo, user.email, jwt);
    if (!row) return res.status(404).json({ ok: false, error: 'Expediente no encontrado' });

    const bank = getBankConfig();
    const totalEur = Number(row.honorarios) || DEFAULT_HONORARIOS[tipo];
    const reference = paymentReference(tipo, row.id);
    const concept = `${bank.conceptPrefix} ${reference}`;

    if (req.method === 'GET') {
      return res.status(200).json({
        ok: true,
        bank: {
          holders: bank.holders,
          iban: bank.ibanFormatted,
          ibanRaw: bank.iban,
          bic: bank.bic || null,
          entity: bank.entity,
        },
        payment: { totalEur, reference, concept, tipo, recordId: row.id },
        status: {
          paid: !!row.honorarios_pagado,
          transferPending: !!row.honorarios_transferencia_pendiente,
          transferAt: row.honorarios_transferencia_at || null,
          metodoPago: row.honorarios_metodo_pago || null,
        },
      });
    }

    if (row.honorarios_pagado) {
      return res.status(400).json({ ok: false, error: 'Los honorarios ya están pagados', code: 'ALREADY_PAID' });
    }
    if (row.honorarios_transferencia_pendiente) {
      return res.status(200).json({ ok: true, alreadyPending: true, reference, concept });
    }

    await markTransferenciaPendiente({ tipo, recordId: row.id });
    await notifyTransferenciaPendiente({
      email: user.email,
      nombre: row.nombre || user.email.split('@')[0],
      tipo,
      amount: totalEur,
      reference,
      concept,
    });

    return res.status(200).json({ ok: true, pending: true, reference, concept });
  } catch (err) {
    console.error('stripe-checkout transfer:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Error' });
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (isTransferRequest(req)) {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    return handleTransfer(req, res);
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({ ok: false, error: 'Stripe no configurado', code: 'NO_STRIPE' });
  }
  const auth = req.headers.authorization || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = await getUserFromJwt(jwt);
  if (!user?.email || !jwt) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  const body = req.body || {};
  const tipo = body.tipo === 'vendedor' ? 'vendedor' : 'comprador';
  const email = user.email.trim();

  try {
    const row = await fetchClienteRowAsUser(tipo, email, jwt);
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
