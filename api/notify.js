/**
 * /api/notify.js — NuevaHabitat Email System
 * Sistema completo de notificaciones y comunicación con clientes.
 * Usa Resend (resend.com) como proveedor de email.
 */

const ADMIN_EMAIL = 'admin.nuevahabitat@gmail.com';
const FROM_ADMIN  = 'NuevaHabitat <noreply@nuevahabitat.com>';
const FROM_NOREPLY= 'NuevaHabitat <noreply@nuevahabitat.com>';

/* ─── Cabecera y pie comunes ─────────────────────────────────────────── */
const HEAD = `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f0ea;color:#0d0d0d}
  .wrap{max-width:580px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .hdr{background:#0d0d0d;padding:28px 40px;display:flex;align-items:center;gap:16px}
  .logo-box{width:44px;height:44px;background:#b8936a;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-weight:700;color:#0d0d0d;font-size:1.1rem;flex-shrink:0}
  .logo-text{display:flex;flex-direction:column;gap:2px}
  .logo-name{color:#b8936a;font-size:.9rem;font-weight:700;letter-spacing:.12em}
  .logo-sub{color:rgba(255,255,255,.45);font-size:.65rem;letter-spacing:.15em}
  .body{padding:36px 40px}
  .tag{display:inline-block;background:rgba(184,147,106,.12);color:#b8936a;font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border-radius:20px;margin-bottom:14px}
  h1{font-family:Georgia,serif;font-size:1.55rem;margin-bottom:10px;line-height:1.3}
  .intro{font-size:.9rem;color:#555;line-height:1.7;margin-bottom:28px}
  .card{background:#f9f5ef;border-radius:10px;padding:24px;margin-bottom:20px}
  .card-title{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#b8936a;margin-bottom:12px}
  table{width:100%;border-collapse:collapse}
  td{padding:8px 0;font-size:.88rem;border-bottom:1px solid #efe9e0;vertical-align:top}
  td:first-child{color:#888;width:130px}
  td:last-child{font-weight:500}
  tr:last-child td{border:none}
  .btn{display:inline-block;padding:13px 28px;border-radius:8px;text-decoration:none;font-size:.88rem;font-weight:600;margin-top:4px}
  .btn-gold{background:#b8936a;color:#fff}
  .btn-dark{background:#0d0d0d;color:#fff}
  .btn-wa{background:#25d366;color:#fff}
  .btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}
  .divider{height:1px;background:#f0ece6;margin:24px 0}
  .tip{background:#fffbf5;border-left:3px solid #b8936a;padding:14px 18px;border-radius:0 8px 8px 0;font-size:.83rem;color:#555;line-height:1.6;margin-bottom:20px}
  .steps{display:flex;flex-direction:column;gap:14px;margin:20px 0}
  .step{display:flex;gap:14px;align-items:flex-start}
  .step-num{width:30px;height:30px;border-radius:50%;background:#b8936a;color:#fff;font-size:.8rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .step-body h4{font-size:.875rem;margin-bottom:2px}
  .step-body p{font-size:.82rem;color:#666;line-height:1.5}
  .ftr{background:#0d0d0d;padding:24px 40px;text-align:center}
  .ftr p{color:rgba(255,255,255,.35);font-size:.73rem;line-height:1.7}
  .ftr a{color:#b8936a;text-decoration:none}
  .stat-row{display:flex;gap:16px;margin:16px 0;flex-wrap:wrap}
  .stat{flex:1;min-width:100px;background:#fff;border-radius:8px;padding:14px;text-align:center;border:1px solid #efe9e0}
  .stat-val{font-family:Georgia,serif;font-size:1.4rem;font-weight:700;color:#0d0d0d}
  .stat-lbl{font-size:.7rem;color:#888;text-transform:uppercase;letter-spacing:.08em;margin-top:4px}
  @media(max-width:600px){.body,.hdr,.ftr{padding:24px 20px}.btns{flex-direction:column}}
</style></head><body>
<div class="wrap">
<div class="hdr">
  <div class="logo-box">NH</div>
  <div class="logo-text">
    <span class="logo-name">NUEVA HABITAT</span>
    <span class="logo-sub">BARCELONA · INMOBILIARIA</span>
  </div>
</div>`;

const FOOTER = `
<div class="ftr">
  <p>NuevaHabitat Barcelona · C/ Ejemplo 1, 08001 Barcelona<br/>
  <a href="tel:+34675704514">675 704 514</a> · <a href="mailto:admin.nuevahabitat@gmail.com">admin.nuevahabitat@gmail.com</a><br/><br/>
  <a href="https://www.nuevahabitat.com/privacidad.html">Privacidad</a> · <a href="https://www.nuevahabitat.com/cookies.html">Cookies</a> · 
  <a href="https://www.nuevahabitat.com">nuevahabitat.com</a>
  </p>
</div>
</div></body></html>`;

/* ══════════════════════════════════════════════════════════════════════
   PLANTILLAS
══════════════════════════════════════════════════════════════════════ */

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

function tplBienvenida({ nombre, email }) {
  return {
    subject: `Bienvenido/a a NuevaHabitat, ${nombre || 'cliente'}`,
    html: HEAD + `<div class="body">
      <div class="tag">Bienvenida</div>
      <h1>Hola, ${nombre || 'bienvenido/a'} 👋</h1>
      <p class="intro">Nos alegra tenerte en NuevaHabitat. Tienes acceso a tu panel personal donde podrás seguir todo el proceso de compra o venta en tiempo real.</p>
      <div class="tip">Tu agente personal <strong>Juan Cárdenas</strong> se pondrá en contacto contigo en menos de 24h para conocer tu perfil y comenzar la búsqueda activa.</div>
      <div class="card">
        <div class="card-title">Tu panel incluye</div>
        <div class="steps">
          <div class="step"><div class="step-num">1</div><div class="step-body"><h4>Resumen del expediente</h4><p>Estado actualizado de tu proceso de compra o venta.</p></div></div>
          <div class="step"><div class="step-num">2</div><div class="step-body"><h4>Mis visitas</h4><p>Historial de visitas solicitadas y confirmadas.</p></div></div>
          <div class="step"><div class="step-num">3</div><div class="step-body"><h4>Mis favoritos</h4><p>Guarda y compara los inmuebles que más te gusten.</p></div></div>
          <div class="step"><div class="step-num">4</div><div class="step-body"><h4>Documentos</h4><p>Contratos, arras y notas de tu agente en un solo lugar.</p></div></div>
        </div>
      </div>
      <div class="btns">
        <a href="https://www.nuevahabitat.com/panel.html" class="btn btn-gold">Acceder al panel →</a>
        <a href="https://wa.me/34675704514?text=Hola%20Juan%2C%20acabo%20de%20registrarme%20en%20NuevaHabitat" class="btn btn-wa">WhatsApp</a>
      </div>
      <div class="divider"></div>
      <p style="font-size:.82rem;color:#888">¿No te registraste? Ignora este email o escríbenos a <a href="mailto:admin.nuevahabitat@gmail.com" style="color:#b8936a">admin.nuevahabitat@gmail.com</a></p>
    </div>` + FOOTER,
  };
}

function tplConfirmacionVisita({ nombre, mensaje, inmueble }) {
  return {
    subject: `Visita recibida — te confirmamos en 24h · NuevaHabitat`,
    html: HEAD + `<div class="body">
      <div class="tag">Visita solicitada</div>
      <h1>Hemos recibido tu solicitud</h1>
      <p class="intro">Gracias, <strong>${nombre || 'cliente'}</strong>. Tu agente Juan Cárdenas revisará tu disponibilidad y te confirmará la visita en menos de 24 horas.</p>
      <div class="card">
        <div class="card-title">Detalles de la solicitud</div>
        <table>
          ${inmueble ? `<tr><td>Inmueble</td><td>${inmueble}</td></tr>` : ''}
          ${mensaje  ? `<tr><td>Disponibilidad</td><td>${mensaje}</td></tr>` : ''}
        </table>
      </div>
      <div class="tip">⚠️ Esta no es una reserva confirmada. Tu gestor te llamará para acordar fecha y hora exactas.</div>
      <div class="btns">
        <a href="https://wa.me/34675704514?text=Hola%20Juan%2C%20he%20solicitado%20una%20visita" class="btn btn-wa">Adelantar por WhatsApp</a>
        <a href="https://www.nuevahabitat.com/inmuebles.html" class="btn btn-gold">Ver más inmuebles</a>
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
        <a href="https://www.nuevahabitat.com/inmuebles.html" class="btn btn-gold">Ver inmuebles disponibles</a>
        <a href="https://wa.me/34675704514" class="btn btn-wa">WhatsApp directo</a>
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
        <div class="steps">
          <div class="step"><div class="step-num">1</div><div class="step-body"><h4>Análisis de mercado</h4><p>Comparativa con inmuebles similares vendidos recientemente en tu zona.</p></div></div>
          <div class="step"><div class="step-num">2</div><div class="step-body"><h4>Precio orientativo</h4><p>Rango de precio de venta recomendado según el estado actual del mercado.</p></div></div>
          <div class="step"><div class="step-num">3</div><div class="step-body"><h4>Propuesta sin compromiso</h4><p>Te explicamos cómo podemos ayudarte a vender al mejor precio en el menor tiempo.</p></div></div>
        </div>
      </div>
      <div class="btns">
        <a href="https://wa.me/34675704514?text=Hola%2C%20he%20pedido%20una%20valoraci%C3%B3n" class="btn btn-wa">WhatsApp</a>
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
      <p class="intro">Hola <strong>${nombre || ''}</strong>, tu agente Juan Cárdenas ha preparado nuevos documentos para ti. Puedes revisarlos y firmarlos directamente desde tu panel personal.</p>
      <div class="card">
        <div class="card-title">Documentos disponibles</div>
        <table>${docList}</table>
      </div>
      <div class="btns">
        <a href="https://www.nuevahabitat.com/panel.html" class="btn btn-gold">Ver en mi panel →</a>
        <a href="https://wa.me/34675704514?text=Hola%20Juan%2C%20he%20visto%20los%20documentos" class="btn btn-wa">WhatsApp</a>
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
        <a href="https://wa.me/34675704514?text=Hola%2C%20quiero%20hablar%20sobre%20mi%20hipoteca" class="btn btn-wa">WhatsApp</a>
        <a href="https://www.nuevahabitat.com/hipotecas.html" class="btn btn-gold">Más sobre hipotecas</a>
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
  if (!apiKey) return res.status(200).json({ ok: true, skipped: true });

  const body = req.body || {};
  const { nombre, telefono, email, mensaje, tipo, inmueble, template, extra } = body;

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

    /* 1. Notificación interna siempre al admin */
    jobs.push(send(ADMIN_EMAIL, tplLeadAdmin({ nombre, telefono, email, mensaje, tipo, inmueble })));

    /* 2. Email al cliente según plantilla */
    if (email) {
      const tmpl = template || tipo;
      if      (tmpl === 'bienvenida')  jobs.push(send(email, tplBienvenida({ nombre, email })));
      else if (tmpl === 'visita')      jobs.push(send(email, tplConfirmacionVisita({ nombre, mensaje, inmueble })));
      else if (tmpl === 'contacto')    jobs.push(send(email, tplConfirmacionContacto({ nombre, inmueble })));
      else if (tmpl === 'valoracion' || tmpl === 'vender') jobs.push(send(email, tplValoracion({ nombre })));
      else if (tmpl === 'hipoteca')    jobs.push(send(email, tplHipoteca({ nombre, ...(extra||{}) })));
      else if (tmpl === 'documentos')  jobs.push(send(email, tplDocumentosListos({ nombre, documentos: extra?.documentos })));
    }

    const results = await Promise.allSettled(jobs);
    return res.status(200).json({ ok: true, sent: results.length });
  } catch (err) {
    console.error('notify error:', err);
    return res.status(500).json({ error: err.message });
  }
}
