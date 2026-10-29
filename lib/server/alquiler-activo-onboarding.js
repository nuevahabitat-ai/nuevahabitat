/**
 * Tras marcar un lead de alquiler como «activo»: onboarding solo clientes Nueva Hábitat.
 * Livendia / Gestor Hogar: expediente en cartera, sin checklist ni email automático NH.
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { patchPropietarioAlquilerAdmin } from './propietarios-alquiler-admin-api.js';
import { ADMIN_ALQUILER_MENSUAL_LABEL } from './pricing.js';

export const PARTNER_ALQUILER_PROCEDENCIAS = new Set(['livendia', 'gestor_hogar']);

export function isPartnerAlquilerProcedencia(procedencia) {
  return PARTNER_ALQUILER_PROCEDENCIAS.has(String(procedencia || '').trim().toLowerCase());
}

/** Cliente directo NH (web o procedencia nuevahabitat), no partner externo. */
export function shouldRunNhAlquilerActivoOnboarding(lead) {
  if (!lead) return false;
  if (isPartnerAlquilerProcedencia(lead.procedencia)) return false;
  const proc = String(lead.procedencia || '').trim().toLowerCase();
  if (proc === 'nuevahabitat') return true;
  const origen = String(lead.origen || '').trim();
  if (origen === 'alquiler_administracion' || origen === 'alquiler_integral') return true;
  return false;
}

function partnerLabel(procedencia) {
  const p = String(procedencia || '').trim().toLowerCase();
  if (p === 'livendia') return 'Livendia';
  if (p === 'gestor_hogar') return 'Gestor Hogar';
  return 'Partner';
}

const NH_CHECKLIST_SEGUIMIENTO = `[Onboarding Nueva Hábitat — checklist]
☐ Datos propietario y DNI
☐ IBAN domiciliación (${ADMIN_ALQUILER_MENSUAL_LABEL})
☐ Contrato / mandato de administración
☐ Documentación inmueble e inquilino
☐ Alta panel propietario y domiciliación Stripe`;

function partnerSeguimientoText(procedencia) {
  return `[Sistema] Activo en cartera (${partnerLabel(procedencia)}). Sin onboarding automático Nueva Hábitat — gestionar según acuerdo con la plataforma.`;
}

async function appendPropietarioSeguimiento(propietarioId, comentario) {
  if (!propietarioId || !comentario) return;
  await fetch(`${SB_URL}/rest/v1/propietarios_alquiler_seguimientos`, {
    method: 'POST',
    headers: svcHeaders(),
    body: JSON.stringify({ propietario_id: propietarioId, comentario }),
  });
}

function leadHasRealEmailForWelcome(lead) {
  const em = String(lead?.email || '').trim().toLowerCase();
  if (!em || !em.includes('@')) return false;
  if (em.includes('@leads.nuevahabitat.local')) return false;
  return true;
}

async function sendNhAlquilerWelcomeEmail(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !leadHasRealEmailForWelcome(lead)) return { sent: false };

  const nombre = String(lead.nombre || 'propietario').trim().split(/\s+/)[0];
  const to = String(lead.email).trim();
  const subject = 'Bienvenido a la administración de alquiler · Nueva Hábitat';
  const html = `<!DOCTYPE html><html lang="es"><body style="font-family:sans-serif;color:#333;line-height:1.6">
    <p>Hola${nombre ? ` ${nombre}` : ''},</p>
    <p>Gracias por confiar en <strong>Nueva Hábitat</strong> para la administración de tu alquiler (${ADMIN_ALQUILER_MENSUAL_LABEL}).</p>
    <p>En los próximos días te guiaremos para completar la documentación y la domiciliación de la cuota. Si tienes cualquier duda, responde a este correo.</p>
    <p>Un saludo,<br/>Equipo Nueva Hábitat</p>
  </body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'NuevaHabitat <noreply@nuevahabitat.com>',
      to: [to],
      subject,
      html,
      reply_to: process.env.CONTACT_EMAIL || 'info@nuevahabitat.com',
    }),
  });
  if (!res.ok) {
    console.error('sendNhAlquilerWelcomeEmail', res.status, await res.text());
    return { sent: false };
  }
  return { sent: true };
}

/** Ejecutar solo cuando el lead pasa a estado activo y ya tiene propietario_alquiler_id. */
export async function runPostActivoAlquilerOnboarding(lead, propietarioId) {
  if (!lead?.id || !propietarioId) return { ok: false, error: 'missing lead or propietario' };

  if (isPartnerAlquilerProcedencia(lead.procedencia)) {
    await appendPropietarioSeguimiento(propietarioId, partnerSeguimientoText(lead.procedencia));
    return { ok: true, mode: 'partner', procedencia: lead.procedencia };
  }

  if (!shouldRunNhAlquilerActivoOnboarding(lead)) {
    return { ok: true, mode: 'skipped', reason: 'no es cliente directo Nueva Hábitat' };
  }

  const existing = await fetch(
    `${SB_URL}/rest/v1/propietarios_alquiler?id=eq.${encodeURIComponent(propietarioId)}&select=estado_gestion&limit=1`,
    { headers: svcHeaders() }
  ).then((r) => r.json()).then((rows) => rows?.[0]).catch(() => null);

  if (existing?.estado_gestion === 'alta') {
    await patchPropietarioAlquilerAdmin(propietarioId, { estado_gestion: 'documentacion' });
  }

  await appendPropietarioSeguimiento(propietarioId, NH_CHECKLIST_SEGUIMIENTO);
  const mail = await sendNhAlquilerWelcomeEmail(lead);

  return { ok: true, mode: 'nuevahabitat', welcomeEmail: mail.sent === true };
}
