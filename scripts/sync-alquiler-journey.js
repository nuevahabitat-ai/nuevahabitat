/**
 * Sustituye el bloque .alq-journey en landings de alquiler por la versión unificada.
 * node scripts/sync-alquiler-journey.js
 */
const fs = require('fs');
const path = require('path');
const { alquilerJourneySection } = require('./alquiler-journey-html');
const { ALQUILER_INTEGRAL_LABEL } = require('../lib/pricing');

const ROOT = path.join(__dirname, '..');
const JOURNEY_RE = /<section class="alq-journey"[^>]*>[\s\S]*?<\/section>\s*/;

function modeForFile(name) {
  if (name.startsWith('alquiler-integral')) return 'integral';
  if (name.startsWith('administracion-alquiler') && !name.includes('alquileres')) return 'admin';
  if (name.startsWith('administracion-alquileres')) return 'admin';
  return 'combined';
}

function zoneIntro(name) {
  if (name === 'administracion-alquileres.html') {
    return {
      overline: 'Proceso Nueva Habitat',
      title: 'Así administramos tu alquiler,<br/>paso a paso',
      subtitle: 'Llamada con gestor, presupuesto, contrato, expediente y panel — el inquilino habla solo con nosotros.',
    };
  }
  if (name === 'alquiler-integral.html') {
    return {
      overline: 'Proceso alquiler integral',
      title: 'Del primer contacto al contrato firmado',
      subtitle: `${ALQUILER_INTEGRAL_LABEL}: misma metodología con gestor, expediente y panel propietario.`,
    };
  }
  return {};
}

const files = fs.readdirSync(ROOT).filter((f) => {
  if (!f.endsWith('.html')) return false;
  if (f.startsWith('administracion-alquiler') || f.startsWith('alquiler-integral')) return true;
  if (f.startsWith('administracion-alquileres')) return true;
  return false;
});

let n = 0;
files.forEach((f) => {
  const p = path.join(ROOT, f);
  let text = fs.readFileSync(p, 'utf8');
  if (!JOURNEY_RE.test(text)) return;
  const block = alquilerJourneySection({ mode: modeForFile(f), ...zoneIntro(f) });
  text = text.replace(JOURNEY_RE, block + '\n');
  fs.writeFileSync(p, text, 'utf8');
  console.log('Updated journey', f);
  n++;
});
console.log('Done.', n, 'files');
