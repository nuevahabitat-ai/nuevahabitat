function zoneLabel(L) {
  if (L.barrio) return L.barrio;
  return 'Barcelona';
}

function nhServicioBlock(L) {
  const zona = zoneLabel(L);
  return `<section class="lc-section lc-nh-servicio" style="background:var(--negro);color:#fff">
  <div class="container">
    <div class="lc-nh-servicio-grid fade-up">
      <div class="lc-nh-servicio-copy">
        <span class="overline" style="color:var(--oro)">Qué hace NuevaHabitat</span>
        <h2 class="section-title light">Encontramos comprador cualificado para tu inmueble en ${zona}</h2>
        <p class="lc-nh-lead">No somos una agencia tradicional que publica en portales y espera llamadas. Tenemos una <strong>plataforma propia de compradores</strong> que buscan vivienda en Barcelona: personas con <strong>hipoteca preaprobada</strong> o liquidez verificada, listas para comprar. Nos encargamos de conectar tu piso con ese comprador y acompañarte hasta la escritura.</p>
        <ul class="lc-nh-features">
          <li><strong>Cartera activa de compradores</strong> — difundimos tu inmueble entre clientes que ya están buscando en ${zona} y alrededores.</li>
          <li><strong>Solo visitas con solvencia</strong> — filtramos antes de agendar; no pierdes fines de semana con curiosos sin financiación.</li>
          <li><strong>Gestor dedicado</strong> — El equipo de NuevaHabitat te acompaña en comunicación, visitas, ofertas y documentación.</li>
          <li><strong>3.000 € + IVA solo en escritura</strong> — si no vendes, no pagas. Sin comisión del 6%.</li>
        </ul>
      </div>
      <div class="lc-nh-servicio-cards">
        <div class="lc-nh-mini-card"><span>01</span><h3>Compradores cualificados</h3><p>Perfil financiero verificado antes de la primera visita.</p></div>
        <div class="lc-nh-mini-card"><span>02</span><h3>Plataforma propia</h3><p>Publicamos en nuestra cartera, no solo en portales genéricos.</p></div>
        <div class="lc-nh-mini-card"><span>03</span><h3>Panel vendedor 24/7</h3><p>Visitas, ofertas, contratos y proceso guiado en un solo lugar.</p></div>
      </div>
    </div>
  </div>
</section>`;
}

function nhProcesoBlock(L) {
  const zona = zoneLabel(L);
  return `<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:760px;margin:0 auto 2.5rem">
      <span class="overline">Cómo trabajamos</span>
      <h2 class="section-title">Proceso de venta con NuevaHabitat en ${zona}</h2>
      <p style="color:var(--gris-texto);line-height:1.7">Desde el primer contacto hasta la escritura pública: un recorrido guiado con agente y plataforma, pensado para vender a un comprador preparado.</p>
    </div>
    <div class="lc-steps lc-steps-6 fade-up">
      <div class="lc-step"><div class="lc-step-num">1</div><h4>Contacto y visita</h4><p>Nos escribes, concertamos visita al inmueble y conocemos al propietario y la vivienda.</p></div>
      <div class="lc-step"><div class="lc-step-num">2</div><h4>Valoración</h4><p>Informe de mercado con comparables reales de ${zona}. Precio de salida realista.</p></div>
      <div class="lc-step"><div class="lc-step-num">3</div><h4>Reportaje fotográfico</h4><p>Reportaje fotográfico incluido. Tu piso se presenta en su mejor versión.</p></div>
      <div class="lc-step"><div class="lc-step-num">4</div><h4>Publicación y difusión</h4><p>Publicamos en nuestra plataforma y lo mostramos a compradores cualificados de la cartera.</p></div>
      <div class="lc-step"><div class="lc-step-num">5</div><h4>Visitas y ofertas</h4><p>Agendamos visitas en tus horarios (calendario interactivo) y gestionamos ofertas serias.</p></div>
      <div class="lc-step"><div class="lc-step-num">6</div><h4>Escritura pública</h4><p>Preparamos reserva, arras, documentación y firma ante notario. Cobro solo al cerrar.</p></div>
    </div>
  </div>
</section>`;
}

function nhCompradoresEcosystemBlock(L) {
  const zona = zoneLabel(L);
  return `<section class="lc-section lc-nh-compradores-v" style="background:var(--blanco)">
  <div class="container">
    <div class="lc-nh-compradores-grid fade-up">
      <div class="lc-nh-compradores-copy">
        <span class="overline">Tu comprador no llega de un portal</span>
        <h2 class="section-title">NuevaHabitat es un ecosistema de compradores buscando vivienda en Barcelona</h2>
        <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1rem">Cuando publicas tu inmueble con nosotros, no esperamos llamadas al azar. Tu piso se muestra a <strong>clientes compradores ya registrados</strong> en nuestra plataforma: personas que buscan activamente vivienda en ${zona} y en toda el <strong>área metropolitana de Barcelona</strong>.</p>
        <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1.25rem">Cada comprador está <strong>cualificado financieramente</strong> antes de la primera visita. Conocemos sus condiciones de hipoteca, su capacidad de endeudamiento, su presupuesto real y su plazo de compra. Son clientes <strong>preparados para comprar en cualquier momento</strong> — y el equipo de NuevaHabitat está en contacto constante con ellos buscándoles viviendas que encajen.</p>
        <div class="lc-nh-compradores-pillars">
          <div class="lc-nh-pillar"><strong>Hipoteca preaprobada o liquidez</strong><p>Verificamos solvencia antes de agendar. No entran curiosos sin financiación.</p></div>
          <div class="lc-nh-pillar"><strong>Encaje con tu precio</strong><p>Cada visita cumple el estándar de precio y ratio de endeudamiento de tu inmueble.</p></div>
          <div class="lc-nh-pillar"><strong>Búsqueda activa continua</strong><p>Nuestro equipo propone tu piso a compradores cuyo perfil encaja con la zona y el importe.</p></div>
        </div>
      </div>
      <div class="lc-pm-wrap lc-pm-wrap--comprador lc-nh-comprador-demo" aria-hidden="true">
        <div class="lc-pm-header">
          <div class="lc-pm-brand"><span class="lc-pm-logo">NH</span><span>Nueva Habitat <small>Panel Comprador</small></span></div>
          <div class="lc-pm-user"><span class="lc-pm-avatar">CR</span><span>Cliente cualificado</span></div>
        </div>
        <div class="lc-pm-body">
          <div class="lc-pm-sidebar">
            <div class="lc-pm-nav">Resumen</div>
            <div class="lc-pm-nav">Mi proceso</div>
            <div class="lc-pm-nav active">Mis visitas</div>
            <div class="lc-pm-nav">Favoritos</div>
          </div>
          <div class="lc-pm-main">
            <div class="lc-pm-card">
              <div class="lc-pm-card-title">Perfil financiero verificado</div>
              <div class="lc-nh-perfil-tags">
                <span class="lc-nh-tag lc-nh-tag-ok">Hipoteca preaprobada</span>
                <span class="lc-nh-tag lc-nh-tag-ok">Presupuesto: 380–420 k€</span>
                <span class="lc-nh-tag lc-nh-tag-ok">Compra: 1–3 meses</span>
              </div>
              <p class="lc-pm-cal-note" style="margin-top:.65rem">Ratio de endeudamiento acorde al precio de tu inmueble en ${zona}.</p>
            </div>
            <div class="lc-pm-card lc-pm-card-sm">
              <div class="lc-pm-card-title">Visita solicitada a tu inmueble</div>
              <div class="lc-pm-visit"><span>Vie 18 · 11:00</span><strong>Piso 3 hab. · ${zona}</strong></div>
              <div class="lc-pm-visit"><span>Documentación</span><strong>Hipoteca OK · FIRMACERT listo</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lc-nh-compare-wrap fade-up">
      <h3 class="lc-nh-compare-title">Visita desde un portal vs. visita con NuevaHabitat</h3>
      <div style="overflow-x:auto">
        <table class="lc-compare lc-nh-compare-table">
          <thead><tr><th></th><th>Visitante de portal</th><th>Comprador NuevaHabitat</th></tr></thead>
          <tbody>
            <tr><td><strong>Financiación</strong></td><td>Desconocida hasta el final</td><td class="win">Hipoteca o liquidez verificada antes de visitar</td></tr>
            <tr><td><strong>Presupuesto</strong></td><td>Puede no encajar con tu precio</td><td class="win">Presupuesto acorde al precio de venta</td></tr>
            <tr><td><strong>Endeudamiento</strong></td><td>Sin filtrar</td><td class="win">Ratio de financiación validado por nuestro equipo</td></tr>
            <tr><td><strong>Intención de compra</strong></td><td>Curiosos, comparadores, sin urgencia</td><td class="win">Busca activamente en Barcelona · preparado para comprar</td></tr>
            <tr><td><strong>Seguimiento</strong></td><td>Email suelto del particular</td><td class="win">Gestor dedicado · visita registrada en ambos paneles</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="lc-nh-compradores-footer fade-up">
      <p><strong>En la práctica:</strong> cuando alguien visita tu piso con NuevaHabitat, no es un desconocido de Idealista. Es un comprador de nuestra cartera, con perfil financiero revisado, al que hemos presentado tu inmueble porque encaja en precio, zona y condiciones. Tú controlas las visitas desde tu panel; ellos llevan el seguimiento desde el suyo. Así vendes más rápido y con menos riesgo de operaciones que se caen en el último momento.</p>
      <a href="comprar.html" class="btn btn-outline" style="margin-top:1rem">Conoce la plataforma de compradores →</a>
    </div>
  </div>
</section>`;
}

function nhPanelDemoBlock(L) {
  return `<section class="lc-section lc-nh-panel" style="background:var(--blanco)">
  <div class="container">
    <div class="lc-nh-panel-grid fade-up">
      <div class="lc-nh-panel-copy">
        <span class="overline">Panel del vendedor</span>
        <h2 class="section-title">Tu expediente de venta, controlado al milímetro</h2>
        <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1.25rem">Cada vendedor tiene su <strong>panel personal</strong> con un gestor especializado en comunicación en todo momento. Ves el estado del proceso, las visitas, las ofertas y toda la documentación — reserva, arras, tasación — sin depender de emails sueltos.</p>
        <ul class="lc-nh-panel-list">
          <li><strong>Proceso guiado paso a paso</strong> — sabes en qué fase estás en cada momento.</li>
          <li><strong>Calendario interactivo</strong> — indicas qué días y franjas horarias el agente puede hacer visitas.</li>
          <li><strong>Resumen en tiempo real</strong> — publicación, visitas recibidas y ofertas en un vistazo.</li>
          <li><strong>Contratos y arras</strong> — documentación firmada disponible en tu panel.</li>
        </ul>
        <a href="registro.html" class="btn btn-gold" style="margin-top:.5rem">Acceder al panel vendedor →</a>
      </div>
      <div class="lc-pm-wrap" aria-hidden="true">
        <div class="lc-pm-header">
          <div class="lc-pm-brand"><span class="lc-pm-logo">NH</span><span>Nueva Habitat <small>Panel Vendedor</small></span></div>
          <div class="lc-pm-user"><span class="lc-pm-avatar">MR</span><span>María R. · Vendedor</span></div>
        </div>
        <div class="lc-pm-body">
          <div class="lc-pm-sidebar">
            <div class="lc-pm-nav active">Resumen</div>
            <div class="lc-pm-nav">Mi proceso</div>
            <div class="lc-pm-nav">Visitas</div>
            <div class="lc-pm-nav">Mi publicación</div>
            <div class="lc-pm-nav">Contratos y arras</div>
          </div>
          <div class="lc-pm-main">
            <div class="lc-pm-card">
              <div class="lc-pm-card-title">Resumen de tu expediente</div>
              <div class="lc-pm-stats">
                <div class="lc-pm-stat"><div class="lc-pm-stat-val lc-pm-stat-pub">Publicado</div><div class="lc-pm-stat-lbl">Estado publicación</div></div>
                <div class="lc-pm-stat"><div class="lc-pm-stat-val">12</div><div class="lc-pm-stat-lbl">Visitas recibidas</div></div>
                <div class="lc-pm-stat"><div class="lc-pm-stat-val">2</div><div class="lc-pm-stat-lbl">Ofertas recibidas</div></div>
              </div>
            </div>
            <div class="lc-pm-card lc-pm-card-sm">
              <div class="lc-pm-card-title">Visitas programadas</div>
              <div class="lc-pm-visit"><span>Vie 18 · 11:00</span><strong>Comprador con hipoteca aprobada</strong></div>
              <div class="lc-pm-visit"><span>Sáb 19 · 12:30</span><strong>Pareja — 2ª visita</strong></div>
              <div class="lc-pm-visit"><span>Lun 21 · 18:00</span><strong>Inversor — documentación OK</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lc-pm-screens fade-up">
      <div class="lc-pm-screen">
        <div class="lc-pm-screen-label">Mi proceso de venta</div>
        <div class="lc-pm-timeline">
          <div class="lc-pm-tl done"><span>✓</span><div><strong>Registro y valoración</strong><small>Completado</small></div></div>
          <div class="lc-pm-tl done"><span>✓</span><div><strong>Reportaje y publicación</strong><small>1 inmueble activo</small></div></div>
          <div class="lc-pm-tl active"><span>5</span><div><strong>Visitas y ofertas</strong><small>12 visitas · 2 ofertas</small></div></div>
          <div class="lc-pm-tl"><span>6</span><div><strong>Escritura y cobro</strong><small>3.000 € + IVA al cerrar</small></div></div>
        </div>
      </div>
      <div class="lc-pm-screen">
        <div class="lc-pm-screen-label">Mi publicación</div>
        <div class="lc-pm-pub">
          <img src="imagenes/interior11.jpg" alt="Inmueble publicado en NuevaHabitat" loading="lazy"/>
          <div><strong>Piso 3 hab. · ${zoneLabel(L)}</strong><p>1 inmueble publicado en cartera</p><span class="lc-pm-tag">Activo</span></div>
        </div>
      </div>
      <div class="lc-pm-screen">
        <div class="lc-pm-screen-label">Calendario de visitas</div>
        <div class="lc-pm-cal">
          <p>Tú eliges disponibilidad:</p>
          <div class="lc-pm-cal-slots"><span class="on">Lun 18–20h</span><span class="on">Mar 11–14h</span><span>Sáb 10–13h</span><span class="on">Dom 11–13h</span></div>
          <p class="lc-pm-cal-note">El agente solo agenda visitas en tus franjas.</p>
        </div>
      </div>
      <div class="lc-pm-screen">
        <div class="lc-pm-screen-label">Contratos y arras</div>
        <div class="lc-pm-docs">
          <div class="lc-pm-doc"><span>📄</span><div><strong>Contrato de reserva</strong><small>Firmado · FIRMACERT</small></div><span class="lc-pm-doc-ok">✓</span></div>
          <div class="lc-pm-doc"><span>📄</span><div><strong>Contrato de arras</strong><small>Firmado · pendiente escritura</small></div><span class="lc-pm-doc-ok">✓</span></div>
          <div class="lc-pm-doc"><span>📄</span><div><strong>Informe de valoración</strong><small>Subido por Juan Cárdenas</small></div><span class="lc-pm-doc-ok">✓</span></div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function nhPlatformBundle(L) {
  return nhServicioBlock(L) + nhCompradoresEcosystemBlock(L) + nhProcesoBlock(L) + nhPanelDemoBlock(L);
}

function nhPlatformStyles() {
  return `
    .lc-nh-servicio-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:2.5rem;align-items:start}
    .lc-nh-lead{font-size:1.0625rem;line-height:1.75;color:rgba(255,255,255,.82);margin-bottom:1.25rem}
    .lc-nh-features{list-style:none;margin:0;padding:0;display:grid;gap:.85rem}
    .lc-nh-features li{font-size:.9375rem;line-height:1.6;color:rgba(255,255,255,.78);padding-left:1.1rem;border-left:2px solid var(--oro)}
    .lc-nh-servicio-cards{display:grid;gap:1rem}
    .lc-nh-mini-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:var(--radius-md);padding:1.25rem}
    .lc-nh-mini-card span{display:inline-block;font-family:var(--font-serif);font-size:1.25rem;color:var(--oro-claro);font-weight:700;margin-bottom:.35rem}
    .lc-nh-mini-card h3{font-size:1rem;color:#fff;margin:0 0 .4rem}
    .lc-nh-mini-card p{font-size:.875rem;color:rgba(255,255,255,.65);margin:0;line-height:1.55}
    .lc-steps-6{grid-template-columns:repeat(3,1fr)!important}
    .lc-steps-6 .lc-step{text-align:left;padding:1.35rem}
    .lc-steps-6 .lc-step h4{font-size:.9375rem;margin:.5rem 0 .35rem}
    .lc-steps-6 .lc-step p{font-size:.8125rem;color:var(--gris-texto);margin:0;line-height:1.55}
    .lc-nh-panel-grid{display:grid;grid-template-columns:1fr 1.05fr;gap:2.5rem;align-items:center;margin-bottom:2.5rem}
    .lc-nh-panel-list{list-style:none;margin:0 0 1rem;padding:0;display:grid;gap:.65rem}
    .lc-nh-panel-list li{font-size:.9375rem;color:var(--gris-texto);line-height:1.6;padding-left:1rem;border-left:3px solid var(--oro)}
    .lc-pm-wrap{background:var(--crema);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-md);border:1px solid var(--crema-dark)}
    .lc-pm-header{background:var(--negro);color:#fff;padding:.85rem 1rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
    .lc-pm-brand{display:flex;align-items:center;gap:.65rem;font-size:.8125rem;font-weight:600}
    .lc-pm-brand small{display:block;font-size:.625rem;font-weight:400;color:var(--oro-claro);letter-spacing:.06em;text-transform:uppercase}
    .lc-pm-logo{width:32px;height:32px;border-radius:6px;background:var(--oro);color:var(--negro);display:grid;place-items:center;font-weight:700;font-size:.75rem}
    .lc-pm-user{display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:rgba(255,255,255,.75)}
    .lc-pm-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--oro),var(--oro-oscuro));display:grid;place-items:center;font-size:.65rem;font-weight:700;color:#fff}
    .lc-pm-body{display:grid;grid-template-columns:130px 1fr;min-height:280px}
    .lc-pm-sidebar{background:#fff;border-right:1px solid var(--crema-dark);padding:.75rem .5rem;display:flex;flex-direction:column;gap:.25rem}
    .lc-pm-nav{font-size:.6875rem;padding:.45rem .55rem;border-radius:6px;color:var(--gris-texto)}
    .lc-pm-nav.active{background:var(--negro);color:#fff;font-weight:600}
    .lc-pm-main{padding:.85rem;display:grid;gap:.75rem;align-content:start}
    .lc-pm-card{background:#fff;border-radius:var(--radius-md);padding:1rem;border:1px solid var(--crema-dark)}
    .lc-pm-card-sm{padding:.85rem}
    .lc-pm-card-title{font-size:.75rem;font-weight:600;margin-bottom:.75rem;color:var(--negro)}
    .lc-pm-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem}
    .lc-pm-stat{text-align:center;padding:.5rem .25rem;background:var(--crema);border-radius:8px}
    .lc-pm-stat-val{font-family:var(--font-serif);font-size:1.125rem;font-weight:700;color:var(--negro);line-height:1.2}
    .lc-pm-stat-val.lc-pm-stat-pub{font-size:.875rem;color:var(--oro-oscuro)}
    .lc-pm-stat-lbl{font-size:.5625rem;text-transform:uppercase;letter-spacing:.06em;color:var(--gris-medio);margin-top:.2rem}
    .lc-pm-visit{display:flex;flex-direction:column;gap:.15rem;padding:.55rem 0;border-bottom:1px solid var(--crema-dark);font-size:.75rem}
    .lc-pm-visit:last-child{border-bottom:0;padding-bottom:0}
    .lc-pm-visit span{color:var(--gris-medio);font-size:.6875rem}
    .lc-pm-screens{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
    .lc-pm-screen{background:var(--crema);border-radius:var(--radius-md);padding:1rem;border:1px solid var(--crema-dark)}
    .lc-pm-screen-label{font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--gris-medio);margin-bottom:.75rem}
    .lc-pm-pub{display:flex;gap:.75rem;align-items:center}
    .lc-pm-pub img{width:72px;height:54px;object-fit:cover;border-radius:8px;flex-shrink:0}
    .lc-pm-pub p{font-size:.75rem;color:var(--gris-texto);margin:.15rem 0}
    .lc-pm-tag{display:inline-block;font-size:.625rem;background:#ecfdf5;color:#166534;padding:.15rem .45rem;border-radius:999px;font-weight:600}
    .lc-pm-cal p{font-size:.8125rem;color:var(--gris-texto);margin:0 0 .5rem}
    .lc-pm-cal-slots{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.5rem}
    .lc-pm-cal-slots span{font-size:.6875rem;padding:.3rem .55rem;border-radius:999px;background:#fff;border:1px solid var(--crema-dark);color:var(--gris-medio)}
    .lc-pm-cal-slots span.on{background:var(--negro);color:#fff;border-color:var(--negro)}
    .lc-pm-cal-note{font-size:.6875rem!important;color:var(--gris-medio)!important}
    .lc-pm-docs{display:grid;gap:.5rem}
    .lc-pm-doc{display:flex;align-items:center;gap:.65rem;background:#fff;border-radius:8px;padding:.65rem .75rem;font-size:.8125rem}
    .lc-pm-doc small{display:block;font-size:.6875rem;color:var(--gris-medio)}
    .lc-pm-doc-ok{color:#16a34a;font-weight:700;margin-left:auto}
    .lc-pm-timeline{display:grid;gap:.45rem}
    .lc-pm-tl{display:flex;align-items:flex-start;gap:.55rem;font-size:.75rem;padding:.45rem .5rem;border-radius:8px;background:#fff}
    .lc-pm-tl span{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:.625rem;font-weight:700;flex-shrink:0;background:var(--crema);color:var(--gris-medio)}
    .lc-pm-tl.done span{background:#ecfdf5;color:#166534}
    .lc-pm-tl.active span{background:var(--negro);color:#fff}
    .lc-pm-tl small{display:block;font-size:.6875rem;color:var(--gris-medio);margin-top:.1rem}
    .lc-nh-compradores-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:2.5rem;align-items:start;margin-bottom:2.5rem}
    .lc-nh-compradores-pillars{display:grid;gap:.85rem;margin-top:.5rem}
    .lc-nh-pillar{background:var(--crema);border-radius:var(--radius-md);padding:1rem 1.15rem;border-left:3px solid var(--oro)}
    .lc-nh-pillar strong{display:block;font-size:.9375rem;color:var(--negro);margin-bottom:.25rem}
    .lc-nh-pillar p{font-size:.8125rem;color:var(--gris-texto);margin:0;line-height:1.55}
    .lc-nh-comprador-demo{align-self:stretch}
    .lc-nh-perfil-tags{display:flex;flex-wrap:wrap;gap:.35rem}
    .lc-nh-tag{font-size:.6875rem;padding:.3rem .55rem;border-radius:999px;background:#fff;border:1px solid var(--crema-dark);color:var(--gris-medio)}
    .lc-nh-tag-ok{background:#ecfdf5;color:#166534;border-color:#bbf7d0;font-weight:600}
    .lc-nh-compare-wrap{margin-bottom:2rem}
    .lc-nh-compare-title{font-family:var(--font-serif);font-size:1.25rem;color:var(--negro);margin:0 0 1rem;text-align:center}
    .lc-nh-compare-table .win{background:#f0fdf4;color:#166534;font-weight:600}
    .lc-nh-compradores-footer{max-width:820px;margin:0 auto;text-align:center}
    .lc-nh-compradores-footer p{font-size:.9375rem;color:var(--gris-texto);line-height:1.75;margin:0}
    @media(max-width:900px){
      .lc-nh-compradores-grid{grid-template-columns:1fr}
      .lc-nh-servicio-grid,.lc-nh-panel-grid,.lc-pm-screens{grid-template-columns:1fr}
      .lc-pm-screens{grid-template-columns:repeat(2,1fr)}
      .lc-steps-6{grid-template-columns:repeat(2,1fr)!important}
      .lc-pm-body{grid-template-columns:1fr}
      .lc-pm-sidebar{flex-direction:row;flex-wrap:wrap;border-right:0;border-bottom:1px solid var(--crema-dark)}
      .lc-nh-panel-grid{align-items:start}
    }
    @media(max-width:768px){
      .lc-nh-panel-copy .btn,.lc-nh-comprador-copy~div .btn{width:100%;justify-content:center}
      .lc-pm-screens{grid-template-columns:1fr!important;gap:.75rem}
      .lc-pm-screen{padding:.85rem}
      .lc-nh-compare-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
      .lc-nh-compare-table{min-width:520px}
    }
    @media(max-width:600px){.lc-steps-6{grid-template-columns:1fr!important}.lc-pm-stats{grid-template-columns:repeat(3,1fr)}.lc-pm-screens{grid-template-columns:1fr}}
  `;
}

module.exports = { nhServicioBlock, nhCompradoresEcosystemBlock, nhProcesoBlock, nhPanelDemoBlock, nhPlatformBundle, nhPlatformStyles, zoneLabel };
