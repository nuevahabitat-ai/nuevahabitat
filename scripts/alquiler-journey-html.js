/**
 * Bloque "Cómo funciona" alquiler (administración / integral) — módulos con imagen.
 * Sustituye JPG en imagenes/alquiler-proceso-0*.jpg cuando tengas los tuyos.
 */
const fs = require('fs');
const path = require('path');
const {
  ADMIN_ALQUILER_MENSUAL_IVA,
  ADMIN_ALQUILER_MENSUAL_LABEL,
  ALQUILER_INTEGRAL_LABEL,
} = require('../lib/pricing');

const IMAGENES = path.join(__dirname, '..', 'imagenes');
const PUBLIC_PROCESO = path.join(__dirname, '..', 'public', 'alquiler-proceso');

/** Orden: public/alquiler-proceso (tus JPG) → imagenes/alquiler-proceso-*.jpg → genéricas */
const IMAGE_CANDIDATES = {
  step1: [
    { disk: path.join(PUBLIC_PROCESO, '01-llamada-gestor.jpg'), web: 'public/alquiler-proceso/01-llamada-gestor.jpg' },
    { disk: path.join(IMAGENES, 'alquiler-proceso-01-llamada-gestor.jpg'), web: 'imagenes/alquiler-proceso-01-llamada-gestor.jpg' },
    { disk: path.join(IMAGENES, 'comercial1.jpg'), web: 'imagenes/comercial1.jpg' },
  ],
  step2: [
    { disk: path.join(PUBLIC_PROCESO, '02-contrato-presupuesto.jpg'), web: 'public/alquiler-proceso/02-contrato-presupuesto.jpg' },
    { disk: path.join(IMAGENES, 'alquiler-proceso-02-contrato-presupuesto.jpg'), web: 'imagenes/alquiler-proceso-02-contrato-presupuesto.jpg' },
    { disk: path.join(IMAGENES, 'contrato1.jpg'), web: 'imagenes/contrato1.jpg' },
  ],
  step3: [
    { disk: path.join(PUBLIC_PROCESO, '03-expediente-documentacion.jpg'), web: 'public/alquiler-proceso/03-expediente-documentacion.jpg' },
    { disk: path.join(IMAGENES, 'alquiler-proceso-03-expediente-documentacion.jpg'), web: 'imagenes/alquiler-proceso-03-expediente-documentacion.jpg' },
    { disk: path.join(IMAGENES, 'equipo2.jpg'), web: 'imagenes/equipo2.jpg' },
  ],
  step4: [
    { disk: path.join(PUBLIC_PROCESO, '04-panel-propietario.jpg'), web: 'public/alquiler-proceso/04-panel-propietario.jpg' },
    { disk: path.join(IMAGENES, 'alquiler-proceso-04-panel-propietario.jpg'), web: 'imagenes/alquiler-proceso-04-panel-propietario.jpg' },
    { disk: path.join(IMAGENES, 'interior14.jpg'), web: 'imagenes/interior14.jpg' },
  ],
};

function pickImage(key, alt) {
  const list = IMAGE_CANDIDATES[key] || [];
  for (const entry of list) {
    if (fs.existsSync(entry.disk)) {
      return `<img src="${entry.web}" alt="${alt}" loading="lazy"/>`;
    }
  }
  const last = list[list.length - 1];
  return `<img src="${last.web}" alt="${alt}" loading="lazy"/>`;
}

/**
 * @param {object} opts
 * @param {'admin'|'integral'|'combined'} [opts.mode]
 * @param {string} [opts.overline]
 * @param {string} [opts.title]
 * @param {string} [opts.subtitle]
 * @param {string} [opts.id] — id de sección (default como-funciona)
 */
function alquilerJourneySection(opts = {}) {
  const mode = opts.mode || 'combined';
  const id = opts.id ? ` id="${opts.id}"` : ' id="como-funciona"';
  const overline = opts.overline || 'Proceso Nueva Habitat';
  const title = opts.title || 'Así funciona el servicio,<br/>paso a paso';
  const subtitle = opts.subtitle || 'Reserva una llamada con tu gestor, contrata con presupuesto claro, abrimos expediente y tú sigues todo desde el panel — sin hablar con el inquilino.';

  const contractLine = mode === 'integral'
    ? `Firmas el <strong>alquiler integral (${ALQUILER_INTEGRAL_LABEL})</strong>: captación, visitas, contrato LAU e INCASÒL. Después puedes pasar a administración mensual.`
    : mode === 'admin'
      ? `Firmas la <strong>administración de alquiler (${ADMIN_ALQUILER_MENSUAL_IVA})</strong> con alcance por escrito.`
      : `Firmas el servicio que encaje: <strong>alquiler integral (${ALQUILER_INTEGRAL_LABEL})</strong> si el piso está vacío, o <strong>administración (${ADMIN_ALQUILER_MENSUAL_LABEL})</strong> si ya hay inquilino y contrato activo.`;

  const step3Extra = mode === 'integral'
    ? '<li>Publicación, visitas filtradas e informe top 3 perfiles hasta firmar contrato.</li>'
    : '';

  return `<section class="alq-journey"${id}>
  <div class="container">
    <div class="alq-journey-intro fade-up">
      <span class="overline">${overline}</span>
      <h2 class="section-title">${title}</h2>
      <p class="section-subtitle">${subtitle}</p>
    </div>

    <article class="alq-journey-step fade-up">
      <div class="alq-journey-media">
        ${pickImage('step1', 'Reserva una llamada con el gestor de alquiler Nueva Habitat')}
      </div>
      <div class="alq-journey-body">
        <span class="alq-journey-num">Paso 1</span>
        <h3>Reserva una llamada y cuéntanos tu caso</h3>
        <p>Reservas una llamada (o videollamada) con <strong>Daniel o Sebastián</strong>, tu gestor en Les Corts. Le explicas la <strong>situación del inmueble</strong>: estado del piso, inquilino actual, contrato, renta, comunidad y qué quieres dejar de gestionar tú.</p>
        <ul>
          <li>Recogemos datos del arrendamiento y prioridades (incidencias, renovación, impago, etc.).</li>
          <li>Visitamos el piso cuando hace falta para ver instalaciones y riesgos reales.</li>
          <li>Te entregamos un <strong>presupuesto detallado</strong> y una <strong>serie de acciones</strong> con plazos orientativos — sin letra pequeña opaca.</li>
        </ul>
      </div>
    </article>

    <article class="alq-journey-step is-reverse fade-up">
      <div class="alq-journey-media">
        ${pickImage('step2', 'Contrato de administración o alquiler integral Nueva Habitat')}
      </div>
      <div class="alq-journey-body">
        <span class="alq-journey-num">Paso 2</span>
        <h3>Contratas el servicio de administración o alquiler</h3>
        <p>Si el plan encaja, formalizamos por escrito. ${contractLine}</p>
        <ul>
          <li>Contrato con alcance claro: qué hacemos nosotros y qué decisiones requieren tu OK.</li>
          <li>Definimos canales contigo: resúmenes y aprobaciones sin mezclar al inquilino.</li>
          <li>Preparamos la transición: a partir del alta, el contacto operativo del inquilino es solo con Nueva Habitat.</li>
        </ul>
      </div>
    </article>

    <article class="alq-journey-step fade-up">
      <div class="alq-journey-media">
        ${pickImage('step3', 'Documentación y expediente de alquiler')}
      </div>
      <div class="alq-journey-body">
        <span class="alq-journey-num">Paso 3</span>
        <h3>Documentación, expediente y puesta en marcha</h3>
        <p>Nos envías toda la <strong>documentación</strong> (portal, email o en la visita). La analizamos, <strong>creamos el expediente digital</strong> y arrancamos la operativa:</p>
        <ul>
          <li><strong>Contactamos al inquilino</strong>, nos presentamos como gestores y abrimos canal único de incidencias.</li>
          <li><strong>Contactamos a la comunidad</strong> de propietarios cuando hace falta (obras, averías comunes, ascensor).</li>
          <li>Coordinamos reparaciones, LAU, renovaciones, control de rentas e inventarios.</li>
          ${step3Extra}
          <li><strong>El propietario no tiene contacto directo con el inquilino</strong> — evitas WhatsApp a deshora y malentendidos.</li>
        </ul>
      </div>
    </article>

    <article class="alq-journey-step is-reverse fade-up">
      <div class="alq-journey-media">
        ${pickImage('step4', 'Panel propietario alquiler incidencias y seguimiento')}
      </div>
      <div class="alq-journey-body">
        <span class="alq-journey-num">Paso 4</span>
        <h3>Tu panel: incidencias y seguimiento en cada momento</h3>
        <p>Tras el alta accedes a <a href="/acceso-alquileres">acceso propietarios</a> (o te damos acceso al <a href="/demo-panel-propietario-alquiler">panel demo</a>). Ves el expediente, incidencias abiertas y cerradas, documentos y hitos del contrato.</p>
        <ul>
          <li>Seguimiento del trámite <strong>en tiempo real</strong>: qué está pendiente, qué está resuelto y qué requiere tu decisión.</li>
          <li>Resúmenes cuando hay gasto aprobado, obra relevante o cambio contractual.</li>
          <li>Mismo equipo en Mejía Lequerica 42 si necesitas una visita presencial en Barcelona.</li>
        </ul>
      </div>
    </article>
  </div>
</section>`;
}

module.exports = { alquilerJourneySection, pickImage };
