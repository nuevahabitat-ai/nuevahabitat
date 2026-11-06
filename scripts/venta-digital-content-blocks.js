/**
 * Bloques de contenido + módulos ilustrados · landings venta 100 % digital (nacional).
 */
const { esc } = require('./venta-planes-shared');
const { nhPlatformStyles, nhPanelDemoBlock } = require('./landing-nh-blocks');
const { otherCityLinks } = require('./venta-digital-ciudades-data');

function landingContext(c) {
  return {
    slug: c.slug,
    barrio: c.cityName,
    footerLabel: c.cityName,
    cluster: 'intencion',
  };
}

/** Estilos panel mockup (nh-vd-* viven en css/styles.css para móvil global). */
function ventaDigitalExtraStyles() {
  return nhPlatformStyles();
}

function ventaDigitalQuickGlanceHub() {
  return `<section class="lc-section" style="background:var(--crema);padding:2.75rem 0">
  <div class="container fade-up">
    <div class="text-center" style="max-width:720px;margin:0 auto 2rem">
      <span class="overline">En 4 ideas</span>
      <h2 class="section-title">Qué es la venta 100&nbsp;% digital NuevaHabitat</h2>
      <p style="color:var(--gris-texto);line-height:1.75;margin:.75rem 0 0">Intermediación profesional con <strong>1.999 € + IVA</strong>: marketing, filtro de compradores y negociación. <strong>Tú recibes las visitas</strong> en tu ciudad cuando te encaja el horario.</p>
    </div>
    <div class="nh-vd-glance">
      <article class="nh-vd-glance-card"><img src="imagenes/equipo1.jpg" alt="Valoración" loading="lazy"/><div><strong>Valoración</strong><p>Precio de salida con comparables reales.</p></div></article>
      <article class="nh-vd-glance-card"><img src="imagenes/pexels-fotografiagmazg-10050066.jpg" alt="Anuncio" loading="lazy"/><div><strong>Anuncio</strong><p>Foto, vídeo, Idealista y pisos.com.</p></div></article>
      <article class="nh-vd-glance-card"><img src="imagenes/agente inmobiliario1.jpg" alt="Visitas" loading="lazy"/><div><strong>Visitas filtradas</strong><p>Solo compradores con solvencia revisada.</p></div></article>
      <article class="nh-vd-glance-card"><img src="imagenes/firma1.jpg" alt="Escritura" loading="lazy"/><div><strong>Cierre</strong><p>Arras, panel y escritura. Honorarios fijos.</p></div></article>
    </div>
  </div>
</section>`;
}

function ventaDigitalQuickGlance(c) {
  const city = esc(c.cityName);
  return `<section class="lc-section" style="background:var(--crema);padding:2.75rem 0">
  <div class="container fade-up">
    <div class="text-center" style="max-width:720px;margin:0 auto 2rem">
      <span class="overline">En 4 ideas</span>
      <h2 class="section-title">Qué es la venta 100&nbsp;% digital en ${city}</h2>
      <p style="color:var(--gris-texto);line-height:1.75;margin:.75rem 0 0">No es un anuncio en portal ni una agencia al 3&nbsp;%. Es <strong>intermediación profesional</strong> con precio fijo: NuevaHabitat hace valoración, marketing, filtro y negociación; <strong>tú abres la puerta</strong> en ${city} cuando te encaja el horario.</p>
    </div>
    <div class="nh-vd-glance">
      <article class="nh-vd-glance-card">
        <img src="imagenes/equipo1.jpg" alt="Gestores NuevaHabitat valoración vivienda" loading="lazy" width="400" height="240"/>
        <div><strong>Valoración y estrategia</strong><p>Comparables de ${city}, precio de salida y plan de difusión antes de publicar.</p></div>
      </article>
      <article class="nh-vd-glance-card">
        <img src="imagenes/pexels-fotografiagmazg-10050066.jpg" alt="Reportaje fotográfico piso" loading="lazy" width="400" height="240"/>
        <div><strong>Anuncio profesional</strong><p>Fotografía, vídeo y copy; publicación en Idealista y pisos.com.</p></div>
      </article>
      <article class="nh-vd-glance-card">
        <img src="imagenes/agente inmobiliario1.jpg" alt="Filtro compradores con hipoteca" loading="lazy" width="400" height="240"/>
        <div><strong>Visitas cualificadas</strong><p>Solo entran compradores con hipoteca o liquidez revisada. Tú eliges franjas en el panel.</p></div>
      </article>
      <article class="nh-vd-glance-card">
        <img src="imagenes/firma1.jpg" alt="Firma escritura venta vivienda" loading="lazy" width="400" height="240"/>
        <div><strong>Hasta escritura</strong><p>Negociación, arras con FIRMACERT y coordinación con notaría. Honorarios fijos 1.999&nbsp;€ + IVA.</p></div>
      </article>
    </div>
  </div>
</section>`;
}

function ventaDigitalIllustratedFlow(c) {
  const city = esc(c.cityName);
  return `<section class="lc-section" style="background:var(--blanco)">
  <div class="container fade-up">
    <div class="text-center" style="max-width:760px;margin:0 auto 2rem">
      <span class="overline">Recorrido visual</span>
      <h2 class="section-title">Del registro a la venta: qué verás en ${city}</h2>
      <p style="color:var(--gris-texto);line-height:1.7">Módulos orientativos del flujo real. Tu expediente vive en el <strong>panel vendedor</strong>; las imágenes representan etapas habituales del servicio digital.</p>
    </div>
    <div class="nh-vd-flow">
      <div class="nh-vd-flow-item"><span>1</span><img src="imagenes/alquiler-proceso-01-llamada-gestor.jpg" alt="Contacto con gestor NuevaHabitat" loading="lazy"/><h3>Alta y contrato</h3><p>Registro online, contrato digital y primer 50&nbsp;% con Stripe. Se activa el expediente.</p></div>
      <div class="nh-vd-flow-item"><span>2</span><img src="imagenes/alquiler-proceso-03-expediente-documentacion.jpg" alt="Documentación inmueble en panel" loading="lazy"/><h3>Documentación</h3><p>Nota simple, certificado energético y datos del inmueble centralizados.</p></div>
      <div class="nh-vd-flow-item"><span>3</span><img src="imagenes/comercial1.jpg" alt="Publicación y visitas en ${city}" loading="lazy"/><h3>Publicación y visitas</h3><p>Portales + cartera. Tú recibes en ${city} solo citas confirmadas.</p></div>
      <div class="nh-vd-flow-item"><span>4</span><img src="imagenes/alquiler-proceso-04-panel-propietario.jpg" alt="Panel propietario seguimiento venta" loading="lazy"/><h3>Oferta y cierre</h3><p>Ofertas, arras y escritura visibles en panel. Segundo 50&nbsp;% al firmar.</p></div>
    </div>
  </div>
</section>`;
}

function ventaDigitalEcosystemBlock(c) {
  const city = esc(c.cityName);
  const area = esc(c.areaServed || city);
  const price = c.priceExample.toLocaleString('es-ES');
  return `<section class="lc-section lc-nh-compradores-v" style="background:var(--negro);color:#fff">
  <div class="container">
    <div class="lc-nh-compradores-grid fade-up">
      <div class="lc-nh-compradores-copy">
        <span class="overline" style="color:var(--oro)">Compradores filtrados</span>
        <h2 class="section-title light">No es lo mismo un lead de portal que un comprador preparado</h2>
        <p class="lc-nh-lead">En ${city} muchos vendedores publican solos y acumulan visitas sin hipoteca. NuevaHabitat combina <strong>Idealista</strong>, <strong>pisos.com</strong> y <strong>cartera registrada</strong>: cada cita que agenda contigo ha pasado revisión de solvencia.</p>
        <div class="lc-nh-compradores-pillars">
          <div class="lc-nh-pillar" style="background:rgba(255,255,255,.06);border-left-color:var(--oro)"><strong style="color:#fff">Área ${area}</strong><p style="color:rgba(255,255,255,.7)">Difundimos tu inmueble a perfiles compatibles con precio orientativo ~${price}&nbsp;€ en la zona.</p></div>
          <div class="lc-nh-pillar" style="background:rgba(255,255,255,.06);border-left-color:var(--oro)"><strong style="color:#fff">Tú controlas el calendario</strong><p style="color:rgba(255,255,255,.7)">Plan digital: NuevaHabitat no entra en casa salvo que elijas plan comercial o clásica en Barcelona.</p></div>
          <div class="lc-nh-pillar" style="background:rgba(255,255,255,.06);border-left-color:var(--oro)"><strong style="color:#fff">Gestor dedicado</strong><p style="color:rgba(255,255,255,.7)">Daniel o Sebastián responden por panel y WhatsApp; negociación y documentación centralizadas.</p></div>
        </div>
      </div>
      <div class="lc-pm-wrap lc-pm-wrap--comprador" aria-hidden="true">
        <div class="lc-pm-header">
          <div class="lc-pm-brand"><span class="lc-pm-logo">NH</span><span>Nueva Habitat <small>Comprador cualificado</small></span></div>
          <div class="lc-pm-user"><span class="lc-pm-avatar">CR</span><span>Perfil verificado</span></div>
        </div>
        <div class="lc-pm-body">
          <div class="lc-pm-sidebar">
            <div class="lc-pm-nav">Resumen</div>
            <div class="lc-pm-nav active">Solvencia</div>
            <div class="lc-pm-nav">Visitas</div>
          </div>
          <div class="lc-pm-main">
            <div class="lc-pm-card">
              <div class="lc-pm-card-title">Antes de visitar en ${city}</div>
              <div class="lc-nh-perfil-tags">
                <span class="lc-nh-tag lc-nh-tag-ok">Hipoteca preaprobada</span>
                <span class="lc-nh-tag lc-nh-tag-ok">Presupuesto acorde</span>
                <span class="lc-nh-tag lc-nh-tag-ok">Plazo 1–3 meses</span>
              </div>
            </div>
            <div class="lc-pm-card lc-pm-card-sm">
              <div class="lc-pm-card-title">Vs. visitante de portal</div>
              <div class="lc-pm-visit"><span>Portal</span><strong>Financiación desconocida</strong></div>
              <div class="lc-pm-visit"><span>NuevaHabitat</span><strong>Ratio validado · visita en tu franja</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lc-nh-compare-wrap fade-up" style="margin-top:2rem">
      <h3 class="lc-nh-compare-title" style="color:#fff">Portal solo vs. venta digital NuevaHabitat</h3>
      <div class="nh-svc-table-scroll">
        <table class="lc-compare lc-nh-compare-table">
          <thead><tr><th></th><th>Particular en portal</th><th>Plan digital ${city}</th></tr></thead>
          <tbody>
            <tr><td><strong>Honorarios</strong></td><td>Cuota anuncio + tiempo</td><td class="win">1.999 € + IVA fijos (50/50)</td></tr>
            <tr><td><strong>Visitas</strong></td><td>Sin filtro</td><td class="win">Solo solvencia contrastada</td></tr>
            <tr><td><strong>Negociación</strong></td><td>Tú solo</td><td class="win">Equipo NH + panel</td></tr>
            <tr><td><strong>Quién abre en ${city}</strong></td><td>Tú</td><td class="win">Tú, en horarios que marcas</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>`;
}

function ventaDigitalPaymentBlock() {
  return `<section class="lc-section" style="background:var(--crema)">
  <div class="container fade-up">
    <div class="text-center" style="max-width:640px;margin:0 auto 2rem">
      <span class="overline">Precio claro</span>
      <h2 class="section-title">1.999 € + IVA repartidos 50&nbsp;/&nbsp;50</h2>
      <p style="color:var(--gris-texto);line-height:1.75">Sin porcentaje sobre el precio de venta. El primer pago activa valoración, anuncio y gestión de leads; el segundo solo en escritura si cierras.</p>
    </div>
    <div class="nh-vd-pay-split">
      <div class="nh-vd-pay-card">
        <img src="imagenes/contrato1.jpg" alt="Contrato online venta digital" loading="lazy"/>
        <p style="font-size:.875rem;color:var(--gris-texto);margin:0 0 .5rem">Al contratar (Stripe)</p>
        <strong>50&nbsp;% + IVA</strong>
        <p style="font-size:.8125rem;color:var(--gris-medio);margin:.5rem 0 0">Activa expediente, portales y filtro</p>
      </div>
      <div class="nh-vd-pay-card">
        <img src="imagenes/firma1.jpg" alt="Escritura venta vivienda" loading="lazy"/>
        <p style="font-size:.875rem;color:var(--gris-texto);margin:0 0 .5rem">En escritura pública</p>
        <strong>50&nbsp;% + IVA</strong>
        <p style="font-size:.8125rem;color:var(--gris-medio);margin:.5rem 0 0">Solo si vendes</p>
      </div>
    </div>
  </div>
</section>`;
}

function ventaDigitalOtherCities(c) {
  const links = otherCityLinks(c.slug);
  if (!links.trim()) return '';
  return `<section class="lc-section" style="background:var(--blanco);padding:2rem 0">
  <div class="container text-center fade-up">
    <span class="overline">Venta digital · España</span>
    <h2 class="section-title" style="font-size:1.35rem">Mismo plan en otras ciudades</h2>
    <div class="nh-svc-planes-nav nh-vd-city-grid" style="flex-wrap:wrap;justify-content:center;margin-top:1rem">
      ${links}
    </div>
  </div>
</section>`;
}

function ventaDigitalEducationalProse(c) {
  const city = esc(c.cityName);
  return `<section class="lc-section" style="background:var(--blanco)">
  <div class="container lc-nh-split nh-vd-edu-split fade-up">
    <div class="lc-nh-split-media">
      <img src="imagenes/interior13.jpg" alt="Interior vivienda venta digital ${city}" loading="lazy" width="800" height="600"/>
    </div>
    <div>
      <span class="overline">Para el propietario</span>
      <h2 class="section-title">Cómo se siente vender en digital en ${city}</h2>
      <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1rem">Contratas una <strong>agencia con precio fijo</strong>, no un paquete de anuncio. Desde el móvil ves quién viene, qué ofertas hay y qué falta en documentación. Las visitas las haces tú — con la tranquilidad de que no es un desconocido sin banco detrás.</p>
      <p style="color:var(--gris-texto);line-height:1.75;margin-bottom:1rem">Si necesitas que un comercial enseñe el piso, en Barcelona existe el plan <a href="/venta-comercial-barcelona">digital + comercial</a>. Si quieres agente en todo el ciclo, <a href="/venta-clasica-barcelona">venta clásica</a>. En ${city} el digital es la opción más económica manteniendo panel, portales y negociación profesional.</p>
      <ul class="lc-nh-checklist">
        <li>Ideal si vives en el piso o tienes horario flexible para visitas.</li>
        <li>Ideal si ya probaste portal y quieres filtro + cierre sin pagar 3&nbsp;–&nbsp;6&nbsp;%.</li>
        <li>Ideal si quieres trazabilidad: nada crítico solo en WhatsApp suelto.</li>
      </ul>
    </div>
  </div>
</section>`;
}

module.exports = {
  ventaDigitalExtraStyles,
  ventaDigitalQuickGlanceHub,
  ventaDigitalQuickGlance,
  ventaDigitalIllustratedFlow,
  ventaDigitalEcosystemBlock,
  ventaDigitalPaymentBlock,
  ventaDigitalOtherCities,
  ventaDigitalEducationalProse,
  ventaDigitalFullPanel: (c) => nhPanelDemoBlock(landingContext(c)),
};
