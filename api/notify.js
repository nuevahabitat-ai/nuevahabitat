/**
 * /api/notify.js — NuevaHabitat Email System
 * Sistema completo de notificaciones y comunicación con clientes.
 * Usa Resend (resend.com) como proveedor de email.
 */

import { createAvailabilityEvents } from './lib/google-calendar.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin.nuevahabitat@gmail.com';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || process.env.INFO_EMAIL || 'info@nuevahabitat.com';
/** Destinatarios internos: todas las alertas de leads/registros van a ambos por igual */
const NOTIFY_RECIPIENTS = [...new Set([ADMIN_EMAIL, CONTACT_EMAIL].map((e) => String(e || '').trim()).filter(Boolean))];
const FROM_ADMIN  = 'NuevaHabitat <noreply@nuevahabitat.com>';
const FROM_NOREPLY= 'NuevaHabitat <noreply@nuevahabitat.com>';

/* ─── Cabecera y pie comunes ─────────────────────────────────────────── */
const HEAD = `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f0ea;color:#0d0d0d;-webkit-text-size-adjust:100%}
  .wrap{max-width:580px;margin:16px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .hdr{background:#0d0d0d;padding:20px 24px;text-align:center}
  .logo-name{color:#b8936a;font-size:1rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
  .body{padding:28px 24px}
  .tag{display:inline-block;background:rgba(184,147,106,.12);color:#b8936a;font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border-radius:20px;margin-bottom:14px}
  h1{font-family:Georgia,serif;font-size:1.35rem;margin-bottom:10px;line-height:1.35;word-break:break-word}
  .intro{font-size:.9rem;color:#555;line-height:1.7;margin-bottom:24px}
  .card{background:#f9f5ef;border-radius:10px;padding:20px;margin-bottom:20px}
  .card-title{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#b8936a;margin-bottom:12px}
  table{width:100%;border-collapse:collapse}
  td{padding:8px 0;font-size:.88rem;border-bottom:1px solid #efe9e0;vertical-align:top}
  td:first-child{color:#888;width:130px}
  td:last-child{font-weight:500}
  tr:last-child td{border:none}
  .btn{display:block;width:100%;padding:14px 20px;border-radius:8px;text-decoration:none;font-size:.88rem;font-weight:600;text-align:center;margin-bottom:10px}
  .btn-gold{background:#b8936a;color:#fff}
  .btn-dark{background:#0d0d0d;color:#fff}
  .btn-wa{background:#25d366;color:#fff}
  .btns{margin-top:20px}
  .divider{height:1px;background:#f0ece6;margin:24px 0}
  .tip{background:#fffbf5;border-left:3px solid #b8936a;padding:14px 16px;border-radius:0 8px 8px 0;font-size:.83rem;color:#555;line-height:1.6;margin-bottom:20px}
  .step-table{width:100%;border-collapse:collapse;margin:16px 0}
  .step-num-cell{width:40px;vertical-align:top;padding-bottom:16px}
  .step-num{width:28px;height:28px;border-radius:50%;background:#b8936a;color:#fff;font-size:.78rem;font-weight:700;text-align:center;line-height:28px}
  .step-body-cell{vertical-align:top;padding-bottom:16px;padding-left:4px}
  .step-title{font-size:.875rem;font-weight:600;color:#0d0d0d;margin:0 0 4px;line-height:1.3}
  .step-desc{font-size:.82rem;color:#666;line-height:1.5;margin:0}
  .ftr{background:#0d0d0d;padding:20px 24px;text-align:center}
  .ftr p{color:rgba(255,255,255,.35);font-size:.73rem;line-height:1.7}
  .ftr a{color:#b8936a;text-decoration:none}
  .stat-row{display:block;margin:16px 0}
  .stat{background:#fff;border-radius:8px;padding:14px;text-align:center;border:1px solid #efe9e0;margin-bottom:10px}
  .stat-val{font-family:Georgia,serif;font-size:1.4rem;font-weight:700;color:#0d0d0d}
  .stat-lbl{font-size:.7rem;color:#888;text-transform:uppercase;letter-spacing:.08em;margin-top:4px}
</style></head><body>
<div class="wrap">
<div class="hdr">
  <span class="logo-name">NuevaHabitat</span>
</div>`;

const FOOTER = `
<div class="ftr">
  <p>NuevaHabitat Barcelona · Carrer de Mejía Lequerica, 42, 08028 Barcelona<br/>
  <a href="tel:+34603656587">603 656 587</a> · <a href="tel:+34643877644">643 877 644</a> · <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><br/><br/>
  <a href="https://www.nuevahabitat.com/privacidad">Privacidad</a> · <a href="https://www.nuevahabitat.com/cookies">Cookies</a> · 
  <a href="https://www.nuevahabitat.com">nuevahabitat.com</a>
  </p>
</div>
</div></body></html>`;

/* ══════════════════════════════════════════════════════════════════════
   PLANTILLAS
══════════════════════════════════════════════════════════════════════ */

function safeEmailName(nombre) {
  if (!nombre) return 'bienvenido/a';
  let n = String(nombre).trim();
  if (n.includes('@')) n = n.split('@')[0];
  n = n.split(/\s+/)[0];
  if (n.length > 18) n = n.slice(0, 16) + '…';
  return n.charAt(0).toUpperCase() + n.slice(1);
}

function emailSteps(items) {
  return `<table class="step-table" cellpadding="0" cellspacing="0" role="presentation">${
    items.map(([num, title, desc]) => `
    <tr>
      <td class="step-num-cell"><div class="step-num">${num}</div></td>
      <td class="step-body-cell">
        <p class="step-title">${title}</p>
        <p class="step-desc">${desc}</p>
      </td>
    </tr>`).join('')
  }</table>`;
}

function tplLeadAdmin({ nombre, telefono, email, mensaje, tipo, inmueble }) {
  const labels = {
    visita: 'Nueva visita solicitada', contacto: 'Nuevo contacto', hipoteca: 'Consulta hipoteca',
    vender: 'Quiero vender', valoracion: 'Solicitud valoración', comprar: 'Quiero comprar',
    newsletter: 'Nueva suscripción',
  };
  const label = labels[tipo] || 'Nuevo lead';
  return {
    subject: `[NH] ${label} — ${nombre || 'Desconocido'}`,
    html: HEAD + `<div class="body">
      <div class="tag">${label}</div>
      <h1>Nuevo lead recibido</h1>
      <p class="intro">Se ha recibido una nueva solicitud desde la web. Contacta en menos de 2 horas para maximizar la conversión.</p>
      <div class="card">
        <div class="card-title">Datos del contacto</div>
        <table>
          <tr><td>Nombre</td><td>${nombre || '–'}</td></tr>
          <tr><td>Teléfono</td><td><a href="tel:${telefono}" style="color:#b8936a">${telefono || '–'}</a></td></tr>
          <tr><td>Email</td><td><a href="mailto:${email}" style="color:#b8936a">${email || '–'}</a></td></tr>
          ${inmueble ? `<tr><td>Inmueble</td><td>${inmueble}</td></tr>` : ''}
          ${mensaje  ? `<tr><td>Mensaje</td><td>${mensaje}</td></tr>` : ''}
          <tr><td>Tipo</td><td>${label}</td></tr>
          <tr><td>Fecha</td><td>${new Date().toLocaleString('es-ES',{timeZone:'Europe/Madrid'})}</td></tr>
        </table>
      </div>
      <div class="btns">
        ${telefono ? `<a href="tel:${telefono}" class="btn btn-dark">📞 Llamar ahora</a>` : ''}
        ${telefono ? `<a href="https://wa.me/34${telefono.replace(/\D/g,'')}" class="btn btn-wa">WhatsApp</a>` : ''}
        ${email    ? `<a href="mailto:${email}" class="btn btn-gold">✉ Responder</a>` : ''}
      </div>
    </div>` + FOOTER,
  };
}

function tplBienvenida({ nombre, email, tipo }) {
  const esVendedor = tipo === 'vender' || tipo === 'vendedor';
  const panelUrl = esVendedor
    ? 'https://www.nuevahabitat.com/panel?tipo=vendedor'
    : 'https://www.nuevahabitat.com/panel?tipo=comprador';
  const intro = esVendedor
    ? 'Nos alegra tenerte en NuevaHabitat. Desde tu <strong>panel de vendedor</strong> podrás seguir el proceso de venta de tu inmueble en tiempo real: documentos, visitas y comunicación con tu agente.'
    : 'Nos alegra tenerte en NuevaHabitat. Desde tu <strong>panel de comprador</strong> podrás seguir tu búsqueda de vivienda: favoritos, visitas y el estado de tu expediente.';
  const pasos = esVendedor
    ? emailSteps([
        ['1', 'Estado de tu venta', 'Sigue cada fase: valoración, publicación, visitas y ofertas.'],
        ['2', 'Visitas programadas', 'Consulta las visitas solicitadas y confirmadas a tu inmueble.'],
        ['3', 'Documentos', 'Contratos, arras y notas de tu agente en un solo lugar.'],
      ])
    : emailSteps([
        ['1', 'Resumen del expediente', 'Estado actualizado de tu proceso de compra.'],
        ['2', 'Mis visitas', 'Historial de visitas solicitadas y confirmadas.'],
        ['3', 'Mis favoritos', 'Guarda y compara los inmuebles que más te gusten.'],
      ]);
  const saludo = safeEmailName(nombre);
  return {
    subject: `Bienvenido/a a NuevaHabitat, ${saludo}`,
    html: HEAD + `<div class="body">
      <div class="tag">Bienvenida</div>
      <h1>Hola, ${saludo} 👋</h1>
      <p class="intro">${intro}</p>
      <div class="tip">El equipo de <strong>NuevaHabitat</strong> se pondrá en contacto contigo en menos de 24h.</div>
      <div class="card">
        <div class="card-title">Tu panel incluye</div>
        ${pasos}
      </div>
      <div class="btns">
        <a href="${panelUrl}" class="btn btn-gold">Acceder al panel →</a>
        <a href="https://wa.me/34603656587?text=Hola%2C%20acabo%20de%20registrarme%20en%20NuevaHabitat" class="btn btn-wa">WhatsApp</a>
      </div>
      <div class="divider"></div>
      <p style="font-size:.82rem;color:#888">¿No te registraste? Ignora este email o escríbenos a <a href="mailto:${CONTACT_EMAIL}" style="color:#b8936a">${CONTACT_EMAIL}</a></p>
    </div>` + FOOTER,
  };
}

function tplDisponibilidadCalendario({ nombre, telefono, email, mensaje, extra }) {
  const esVendedor = extra?.rol === 'vendedor';
  const label = esVendedor ? 'Disponibilidad vendedor (panel)' : 'Disponibilidad comprador (panel)';
  return {
    subject: `[NH] ${label} — ${nombre || 'Cliente'}`,
    html: HEAD + `<div class="body">
      <div class="tag">${label}</div>
      <h1>Nueva franja horaria registrada</h1>
      <p class="intro">Un cliente ha indicado disponibilidad desde su panel. Revisa el calendario y confirma la visita.</p>
      <div class="card">
        <div class="card-title">Detalle</div>
        <table>
          <tr><td>Cliente</td><td>${nombre || '–'}</td></tr>
          <tr><td>Teléfono</td><td><a href="tel:${telefono}" style="color:#b8936a">${telefono || '–'}</a></td></tr>
          <tr><td>Email</td><td><a href="mailto:${email}" style="color:#b8936a">${email || '–'}</a></td></tr>
          <tr><td>Perfil</td><td>${esVendedor ? 'Vendedor' : 'Comprador'}</td></tr>
          <tr><td>Disponibilidad</td><td>${mensaje || '–'}</td></tr>
          <tr><td>Fecha registro</td><td>${new Date().toLocaleString('es-ES',{timeZone:'Europe/Madrid'})}</td></tr>
        </table>
      </div>
      <div class="btns">
        <a href="https://www.nuevahabitat.com/admin-panel#visitas" class="btn btn-gold">Ver en panel admin →</a>
        ${telefono ? `<a href="https://wa.me/34${telefono.replace(/\D/g,'')}" class="btn btn-wa">WhatsApp</a>` : ''}
      </div>
    </div>` + FOOTER,
  };
}

function tplConfirmacionDisponibilidad({ nombre, mensaje, extra }) {
  const esVendedor = extra?.rol === 'vendedor';
  return {
    subject: `Disponibilidad registrada · NuevaHabitat`,
    html: HEAD + `<div class="body">
      <div class="tag">Calendario</div>
      <h1>Hemos recibido tu disponibilidad</h1>
      <p class="intro">Gracias, <strong>${nombre || 'cliente'}</strong>. ${esVendedor ? 'Tu asesor usará estas franjas para agendar visitas con compradores cualificados.' : 'Tu asesor te propondrá visitas a inmuebles que encajen contigo en esas franjas.'}</p>
      <div class="card">
        <div class="card-title">Detalle registrado</div>
        <table>
          <tr><td>Disponibilidad</td><td>${mensaje || '–'}</td></tr>
        </table>
      </div>
      <div class="tip">Adjuntamos un archivo <strong>.ics</strong> para añadir la franja a tu calendario (Google, Apple u Outlook) con un clic. Te contactaremos en menos de 24h para confirmar.</div>
      <div class="btns">
        <a href="https://www.nuevahabitat.com/panel" class="btn btn-gold">Ir a mi panel →</a>
      </div>
    </div>` + FOOTER,
  };
}

/** Archivo .ics — añade la cita al calendario sin configurar Google Cloud */
function buildIcsAttachment({ nombre, mensaje, telefono, email, extra, calendar }) {
  if (!calendar?.start || !calendar?.end) return null;
  const tz = calendar.timeZone || 'Europe/Madrid';
  const esVendedor = extra?.rol === 'vendedor';
  const rolLabel = esVendedor ? 'Vendedor' : 'Comprador';
  const summary = `[NH] Disponibilidad ${rolLabel} — ${nombre || 'Cliente'}`;
  const description = [mensaje, telefono ? `Tel: ${telefono}` : '', email ? `Email: ${email}` : '']
    .filter(Boolean).join('\\n');
  const fmt = (s) => String(s).replace(/-/g, '').replace(/:/g, '').slice(0, 15);
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@nuevahabitat.com`;
  const now = fmt(new Date().toISOString());
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NuevaHabitat//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=${tz}:${fmt(calendar.start)}`,
    `DTEND;TZID=${tz}:${fmt(calendar.end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `ORGANIZER;CN=NuevaHabitat:mailto:${CONTACT_EMAIL}`,
    'STATUS:TENTATIVE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return {
    filename: 'disponibilidad-nuevahabitat.ics',
    content: Buffer.from(ics, 'utf8').toString('base64'),
  };
}

function tplConfirmacionVisita({ nombre, mensaje, inmueble }) {
  return {
    subject: `Visita recibida — te confirmamos en 24h · NuevaHabitat`,
    html: HEAD + `<div class="body">
      <div class="tag">Visita solicitada</div>
      <h1>Hemos recibido tu solicitud</h1>
      <p class="intro">Gracias, <strong>${nombre || 'cliente'}</strong>. El equipo de NuevaHabitat revisará tu disponibilidad y te confirmará la visita en menos de 24 horas.</p>
      <div class="card">
        <div class="card-title">Detalles de la solicitud</div>
        <table>
          ${inmueble ? `<tr><td>Inmueble</td><td>${inmueble}</td></tr>` : ''}
          ${mensaje  ? `<tr><td>Disponibilidad</td><td>${mensaje}</td></tr>` : ''}
        </table>
      </div>
      <div class="tip">⚠️ Esta no es una reserva confirmada. Tu gestor te llamará para acordar fecha y hora exactas.</div>
      <div class="btns">
        <a href="https://wa.me/34603656587?text=Hola%2C%20he%20solicitado%20una%20visita" class="btn btn-wa">Adelantar por WhatsApp</a>
        <a href="https://www.nuevahabitat.com/inmuebles" class="btn btn-gold">Ver más inmuebles</a>
      </div>
    </div>` + FOOTER,
  };
}

function tplConfirmacionContacto({ nombre, inmueble }) {
  return {
    subject: `Hemos recibido tu consulta · NuevaHabitat`,
    html: HEAD + `<div class="body">
      <div class="tag">Consulta recibida</div>
      <h1>Gracias por contactarnos</h1>
      <p class="intro">Hola <strong>${nombre || ''}</strong>, hemos recibido tu solicitud de información${inmueble ? ` sobre <strong>${inmueble}</strong>` : ''}. Te responderemos en menos de 24 horas.</p>
      <div class="tip">Mientras esperas, puedes explorar más inmuebles en nuestra cartera o calcular tu hipoteca directamente en la ficha.</div>
      <div class="btns">
        <a href="https://www.nuevahabitat.com/inmuebles" class="btn btn-gold">Ver inmuebles disponibles</a>
        <a href="https://wa.me/34603656587" class="btn btn-wa">WhatsApp directo</a>
      </div>
    </div>` + FOOTER,
  };
}

function tplValoracion({ nombre }) {
  return {
    subject: `Valoración gratuita en camino · NuevaHabitat`,
    html: HEAD + `<div class="body">
      <div class="tag">Valoración solicitada</div>
      <h1>Recibirás tu valoración en 24h</h1>
      <p class="intro">Hola <strong>${nombre || ''}</strong>, hemos registrado tu solicitud de valoración. Nuestro equipo analizará tu inmueble y te enviará un informe detallado en menos de 24 horas.</p>
      <div class="card">
        <div class="card-title">¿Qué incluye la valoración?</div>
        ${emailSteps([
          ['1', 'Análisis de mercado', 'Comparativa con inmuebles similares vendidos recientemente en tu zona.'],
          ['2', 'Precio orientativo', 'Rango de precio de venta recomendado según el estado actual del mercado.'],
          ['3', 'Propuesta sin compromiso', 'Te explicamos cómo podemos ayudarte a vender al mejor precio en el menor tiempo.'],
        ])}
      </div>
      <div class="btns">
        <a href="https://wa.me/34603656587?text=Hola%2C%20he%20pedido%20una%20valoraci%C3%B3n" class="btn btn-wa">WhatsApp</a>
      </div>
    </div>` + FOOTER,
  };
}

function tplCompra({ nombre }) {
  return {
    subject: `Hemos recibido tu búsqueda de vivienda · NuevaHabitat`,
    html: HEAD + `<div class="body">
      <div class="tag">Búsqueda registrada</div>
      <h1>Estamos buscando tu hogar</h1>
      <p class="intro">Hola <strong>${nombre || ''}</strong>, hemos registrado tu solicitud de compra. Nuestro equipo revisará tu perfil y te contactará con inmuebles de nuestra cartera, incluidos los de acceso privado.</p>
      <div class="btns">
        <a href="https://www.nuevahabitat.com/panel?tipo=comprador" class="btn btn-gold">Ir a mi panel</a>
        <a href="https://wa.me/34603656587" class="btn btn-wa">WhatsApp</a>
      </div>
    </div>` + FOOTER,
  };
}

function tplNewsletter({ email }) {
  return {
    subject: `Suscripción confirmada · NuevaHabitat`,
    html: HEAD + `<div class="body">
      <div class="tag">Newsletter</div>
      <h1>¡Gracias por suscribirte!</h1>
      <p class="intro">Recibirás en <strong>${email || ''}</strong> novedades del mercado inmobiliario en Barcelona, consejos de compra y venta, y las últimas publicaciones del blog.</p>
      <div class="btns">
        <a href="https://www.nuevahabitat.com/blog" class="btn btn-gold">Leer el blog</a>
      </div>
    </div>` + FOOTER,
  };
}

function tplDocumentosListos({ nombre, documentos }) {
  const docList = (documentos || ['Contrato de encargo']).map(d =>
    `<tr><td>📄</td><td>${d}</td><td style="color:#22c55e;font-size:.8rem">Disponible</td></tr>`
  ).join('');
  return {
    subject: `Tienes documentos disponibles en tu panel · NuevaHabitat`,
    html: HEAD + `<div class="body">
      <div class="tag">Documentos listos</div>
      <h1>Nuevos documentos en tu panel</h1>
      <p class="intro">Hola <strong>${nombre || ''}</strong>, tu equipo de NuevaHabitat ha preparado nuevos documentos para ti. Puedes revisarlos y firmarlos directamente desde tu panel personal.</p>
      <div class="card">
        <div class="card-title">Documentos disponibles</div>
        <table>${docList}</table>
      </div>
      <div class="btns">
        <a href="https://www.nuevahabitat.com/panel" class="btn btn-gold">Ver en mi panel →</a>
        <a href="https://wa.me/34603656587?text=Hola%2C%20he%20visto%20los%20documentos" class="btn btn-wa">WhatsApp</a>
      </div>
    </div>` + FOOTER,
  };
}

function tplHipoteca({ nombre, cuota, prestamo, anos, tasa }) {
  return {
    subject: `Tu estudio hipotecario · NuevaHabitat`,
    html: HEAD + `<div class="body">
      <div class="tag">Estudio hipoteca</div>
      <h1>Hemos recibido tu consulta</h1>
      <p class="intro">Hola <strong>${nombre || ''}</strong>, nuestro equipo hipotecario revisará tu perfil y te presentará las mejores opciones disponibles en el mercado.</p>
      <div class="card">
        <div class="card-title">Estimación calculada</div>
        <div class="stat-row">
          <div class="stat"><div class="stat-val">${cuota || '–'}</div><div class="stat-lbl">Cuota mensual</div></div>
          <div class="stat"><div class="stat-val">${prestamo || '–'}</div><div class="stat-lbl">Préstamo</div></div>
          <div class="stat"><div class="stat-val">${anos || '–'} años</div><div class="stat-lbl">Plazo</div></div>
        </div>
        <p style="font-size:.78rem;color:#888;margin-top:8px">* Estimación orientativa. La oferta definitiva depende del análisis bancario.</p>
      </div>
      <div class="tip">La gestión hipotecaria está <strong>incluida en nuestro servicio</strong>. Trabajamos con los principales bancos para conseguirte las mejores condiciones.</div>
      <div class="btns">
        <a href="https://wa.me/34603656587?text=Hola%2C%20quiero%20hablar%20sobre%20mi%20hipoteca" class="btn btn-wa">WhatsApp</a>
        <a href="https://www.nuevahabitat.com/hipotecas" class="btn btn-gold">Más sobre hipotecas</a>
      </div>
    </div>` + FOOTER,
  };
}

/* ══════════════════════════════════════════════════════════════════════
   HANDLER PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;

  const body = req.body || {};
  const { nombre, telefono, email, mensaje, tipo, inmueble, template, extra, calendar } = body;

  async function send(to, tpl) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM_NOREPLY, to: Array.isArray(to) ? to : [to], ...tpl }),
    });
    return r.json();
  }

  try {
    const jobs = [];

    if (apiKey) {
      const ics = template === 'disponibilidad'
        ? buildIcsAttachment({ nombre, mensaje, telefono, email, extra: extra || {}, calendar })
        : null;

      /* 1. Notificación interna a admin + contacto corporativo */
      if (template === 'disponibilidad') {
        const adminTpl = tplDisponibilidadCalendario({ nombre, telefono, email, mensaje, extra: extra || {} });
        if (ics) adminTpl.attachments = [ics];
        jobs.push(send(NOTIFY_RECIPIENTS, adminTpl));
      } else {
        jobs.push(send(NOTIFY_RECIPIENTS, tplLeadAdmin({ nombre, telefono, email, mensaje, tipo, inmueble })));
      }

      /* 2. Email al cliente según plantilla */
      if (email) {
        const tmpl = template || tipo;
        if      (tmpl === 'bienvenida')  jobs.push(send(email, tplBienvenida({ nombre, email, tipo: extra?.tipo || tipo })));
        else if (tmpl === 'visita')      jobs.push(send(email, tplConfirmacionVisita({ nombre, mensaje, inmueble })));
        else if (tmpl === 'disponibilidad') {
          const clientTpl = tplConfirmacionDisponibilidad({ nombre, mensaje, extra: extra || {} });
          if (ics) clientTpl.attachments = [ics];
          jobs.push(send(email, clientTpl));
        }
        else if (tmpl === 'contacto')    jobs.push(send(email, tplConfirmacionContacto({ nombre, inmueble })));
        else if (tmpl === 'valoracion' || tmpl === 'vender' || tmpl === 'venta') jobs.push(send(email, tplValoracion({ nombre })));
        else if (tmpl === 'compra' || tmpl === 'comprar') jobs.push(send(email, tplCompra({ nombre })));
        else if (tmpl === 'hipoteca')    jobs.push(send(email, tplHipoteca({ nombre, ...(extra||{}) })));
        else if (tmpl === 'newsletter')  jobs.push(send(email, tplNewsletter({ email })));
        else if (tmpl === 'documentos')  jobs.push(send(email, tplDocumentosListos({ nombre, documentos: extra?.documentos })));
      }
    }

    const results = apiKey ? await Promise.allSettled(jobs) : [];

    let calendarResult = null;
    const hasGoogleCal = process.env.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (hasGoogleCal && template === 'disponibilidad' && calendar?.start) {
      try {
        calendarResult = await createAvailabilityEvents({
          nombre, email, telefono, mensaje, extra: extra || {}, calendar,
        });
      } catch (calErr) {
        console.error('google calendar:', calErr);
        calendarResult = { ok: false, error: calErr.message };
      }
    }

    return res.status(200).json({
      ok: true,
      sent: results.length,
      emailSkipped: !apiKey,
      calendar: calendarResult,
    });
  } catch (err) {
    console.error('notify error:', err);
    return res.status(500).json({ error: err.message });
  }
}
