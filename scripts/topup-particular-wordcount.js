/**
 * Solo amplía guías particular por debajo de 900 palabras (sin tocar intención).
 * node scripts/topup-particular-wordcount.js
 */
const fs = require('fs');
const path = require('path');

const PART = path.join(__dirname, '..', 'content', 'landings', 'particular');
const BARRIO = path.join(__dirname, '..', 'content', 'landings', 'barrio');
const FEE = '3.000 € + IVA (3.630 €)';

function wordCount(html) {
  return (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
}

function loadBarrio(slug) {
  const p = path.join(BARRIO, slug + '.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}

function expandBlock(B, kind) {
  const name = B.barrio || 'Barcelona';
  const zonas = (B.zonas || []).slice(0, 4).join(', ') || 'micro-zonas locales';
  const perfil = B.perfilComprador || `Compradores en ${name} suelen contrastar hipoteca antes de visitar.`;
  const tipo = B.tipologiaEdificios || `Fincas variadas en ${name}: planta, ascensor y estado de comunidad marcan el ticket.`;
  const k = kind || 'particular';
  return (
    `<h2>Micro-zonas en ${name}</h2><p>${zonas}. Pricing por calle, no por etiqueta genérica del distrito.</p>` +
    `<h2>Perfil de comprador</h2><p>${perfil}</p>` +
    `<h2>Tipología de edificios</h2><p>${tipo}</p>` +
    `<h2>Documentación antes de visitas</h2><p>Nota simple, certificado energético, comunidad al día e ITE si aplica. El comprador financiado abandona si falta papel.</p>` +
    `<h2>Herencia y plazos</h2><p>Varios titulares o herencia: conviene coste cerrado (${FEE} en escritura) antes de firmar mandato porcentual.</p>` +
    `<h2>Comparar modelos (${k})</h2><p><a href="/nuevahabitat-vs-agencia-tradicional-barcelona">Comisión 6%</a> · <a href="/nuevahabitat-vs-idealista-particular">Idealista</a> · <a href="/inmobiliaria-para-particulares-barcelona">inmobiliaria particulares</a>.</p>` +
    `<h2>Les Corts y panel</h2><p>Valoración 24 h desde Mejía Lequerica 42. Panel con visitas, ofertas y documentación centralizada.</p>`
  );
}

let n = 0;
for (const f of fs.readdirSync(PART).filter((x) => x.endsWith('.json'))) {
  const p = path.join(PART, f);
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (wordCount(L.argumento_principal) >= 900) continue;
  const barrioRel = L.relacionadas && L.relacionadas.find((r) => r.slug && r.slug.startsWith('vender'));
  const B = barrioRel ? loadBarrio(barrioRel.slug) : null;
  const name = B ? B.barrio : L.breadcrumbCurrent?.replace(/^Particular\s/i, '') || 'Barcelona';
  L.argumento_principal =
    (L.argumento_principal || '').replace(/<h2>Cuándo pasar de portal[\s\S]*$/, '') +
    expandBlock(B || { barrio: name }, 'particular') +
    `<h2>Cuándo pasar de portal a precio fijo</h2><p>Si llevas 6–8 semanas sin oferta con hipoteca, activa cartera con ${FEE} solo en escritura.</p>`;
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('topup', L.slug, '->', wordCount(L.argumento_principal), 'words');
  n++;
}
console.log('Done.', n, 'files');
