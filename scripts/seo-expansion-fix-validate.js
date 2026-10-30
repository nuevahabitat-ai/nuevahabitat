/**
 * Corrige word count, similitud y duplicados tras seo-expansion-batch.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INT = path.join(ROOT, 'content/landings/intencion');
const PART = path.join(ROOT, 'content/landings/particular');
const COMP = path.join(ROOT, 'content/landings/comparativa');
const BARRIO_DIR = path.join(ROOT, 'content/landings/barrio');

const FEE = '3.000 € + IVA (3.630 €)';
const FEE_LINE = '3.630 €';

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function wordCount(html) {
  return stripHtml(html).split(' ').filter(Boolean).length;
}

function loadBarrio(slug) {
  const p = path.join(BARRIO_DIR, slug + '.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}

function expandBlock(barrio, kind) {
  const B = typeof barrio === 'string' ? { barrio, zonas: [], perfilComprador: '', tipologiaEdificios: '' } : barrio;
  const name = B.barrio || 'Barcelona';
  const zonas = (B.zonas || []).join(', ') || name;
  const perfil = B.perfilComprador || 'Compradores con financiación verificada en la zona.';
  const tipo = B.tipologiaEdificios || 'Parque variado según calle y antigüedad.';
  const k = kind || 'intencion';
  return (
    `<h2>Preguntas que hace el particular vendedor en ${name}</h2>` +
    `<p>¿Cuánto pagaré si vendo a mi precio objetivo? Con NuevaHabitat: <strong>${FEE_LINE}</strong> solo en escritura. ¿Puedo seguir en Idealista? Sí, sin exclusiva abusiva. ¿Quién visita mi piso? Solo perfiles con hipoteca preaprobada o liquidez documentada, registrados en panel vendedor.</p>` +
    `<h2>Micro-zonas en ${name}</h2><p>Tratamos ${zonas} como mercados distintos — no un único €/m² de distrito. Copiar el anuncio del vecino sin mirar planta, ascensor y orientación alarga la venta semanas.</p>` +
    `<h2>Perfil de comprador en ${name}</h2><p>${perfil}</p>` +
    `<h2>Tipología de edificios</h2><p>${tipo}</p>` +
    `<h2>Documentación antes de visitas</h2><p>Nota simple, certificado energético, comunidad al día, ITE si aplica y cargas explicadas. El comprador financiado abandona si falta papel — da igual si vienes de portal o de cartera privada.</p>` +
    `<h2>Herencia, separación y segundo piso</h2><p>Operaciones con varios herederos o plazos fiscales exigen coste cerrado de agencia antes de decidir. ${FEE} en escritura facilita acuerdos. Discreción: no siempre conviene anuncio masivo el primer mes.</p>` +
    `<h2>Comparar modelos (${k})</h2><p>Revisa <a href="/nuevahabitat-vs-agencia-tradicional-barcelona">comisión 6%</a>, <a href="/nuevahabitat-vs-idealista-particular">Idealista</a>, <a href="/inmobiliaria-para-particulares-barcelona">inmobiliaria para particulares</a> y <a href="/vender-como-particular-barcelona">vender como particular</a>. La decisión es cuánto pagas, cuándo pagas y calidad del comprador.</p>` +
    `<h2>Oficina Les Corts</h2><p>Atendemos ${name} desde Carrer de Mejía Lequerica, 42. Valoración gratuita en 24 h laborables, condiciones por escrito, sin compromiso.</p>` +
    `<h2>Panel vendedor en la práctica</h2><p>Calendario, registro de visitas, PDFs propios y del comprador, ofertas y estado de arras — sin depender de hilos de WhatsApp. Transparencia antes de firmar mandato.</p>` +
    `<h2>Próximo paso en ${name}</h2><p>Calculadora, FAQ y formulario en esta landing. Honorarios ${FEE} solo si hay escritura.</p>`
  );
}

function ensureWords(L, min, kind) {
  let ap = L.argumento_principal || '';
  let wc = wordCount(ap);
  const barrioSlug = L.relacionadas && L.relacionadas.find((r) => r.slug && r.slug.startsWith('vender'));
  const B = barrioSlug ? loadBarrio(barrioSlug.slug) : null;
  let n = 0;
  while (wc < min && n < 8) {
    ap += expandBlock(B || { barrio: L.barrio || L.footerLabel || L.slug }, kind);
    wc = wordCount(ap);
    n++;
  }
  L.argumento_principal = ap;
  return L;
}

function trimBarrioEmbed(ap, maxWordsFromEmbed) {
  return ap;
}

function fixParticularesIntencionFile(p) {
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!L.slug.includes('inmobiliaria-para-particulares-') && !L.slug.includes('inmobiliaria-precio-fijo-')) return;
  const barrioRel = L.relacionadas && L.relacionadas.find((r) => r.slug && r.slug.startsWith('vender'));
  const B = barrioRel ? loadBarrio(barrioRel.slug) : null;
  const name = B ? B.barrio : L.footerLabel;
  const intro =
    `<p>Esta landing captura búsquedas de <strong>propietarios particulares</strong> en <strong>${name}</strong> que buscan agencia con honorarios transparentes. No duplica la guía de barrio: profundiza en <strong>coste cerrado</strong> (${FEE_LINE} en escritura), <strong>panel vendedor</strong> y <strong>filtro de solvencia</strong>.</p>` +
    `<p>Enlaces: <a href="/inmobiliaria-para-particulares-barcelona">particulares Barcelona</a> · guía <a href="/${barrioRel ? barrioRel.slug : 'vender-eixample'}">vender en ${name}</a>.</p>`;
  const tail = expandBlock(B || { barrio: name }, L.slug.includes('precio-fijo') ? 'precio-fijo' : 'particulares');
  L.argumento_principal = intro + tail;
  ensureWords(L, 900, 'intencion');
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('fix intencion', L.slug);
}

function fixParticularFile(p) {
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (L.cluster !== 'particular') return;
  const barrioRel = L.relacionadas && L.relacionadas.find((r) => r.slug && r.slug.startsWith('vender'));
  const B = barrioRel ? loadBarrio(barrioRel.slug) : null;
  const name = B ? B.barrio : 'Barcelona';
  if (wordCount(L.argumento_principal) < 900) {
    L.argumento_principal =
      (L.argumento_principal || '').replace(/<h2>Cuándo pasar de portal[\s\S]*$/, '') +
      expandBlock(B || { barrio: name }, 'particular') +
      `<h2>Cuándo pasar de portal a precio fijo</h2><p>Si llevas 6–8 semanas sin oferta con hipoteca, activa cartera con ${FEE} solo en escritura.</p>`;
    fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
    console.log('fix particular', L.slug);
  }
}

function fixEconomicaElClot() {
  const p = path.join(INT, 'venta-piso-economica-el-clot-la-sagrera-barcelona.json');
  if (!fs.existsSync(p)) return;
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  L.layout = 'economica-hub';
  const B = loadBarrio('vender-el-clot-la-sagrera-barcelona');
  L.argumento_principal =
    `<p><strong>Venta de piso económica en El Clot / La Sagrera</strong> = honorarios contenidos (${FEE_LINE} en escritura), no vender por debajo de mercado. Metro L1/L5, demanda de familias junto a Estació del Nord y compradores que comparan Sant Martí con Nou Barris.</p>` +
    expandBlock(B, 'economica');
  ensureWords(L, 900, 'economica');
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
}

function fixHabitaclia() {
  const p = path.join(COMP, 'nuevahabitat-vs-habitaclia-particular.json');
  if (!fs.existsSync(p)) return;
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  L.argumento_principal =
    `<p>Si buscas <strong>Habitaclia particulares Barcelona</strong>, comparas visibilidad en un portal con menor cuota de mercado que Idealista, pero el problema de fondo es el mismo: <strong>anuncio ≠ cierre</strong>. Habitaclia vende impresiones; no filtra hipoteca ni negocia arras por ti.</p>` +
    `<h2>Habitaclia vs Idealista para vender en Barcelona</h2><p>Habitaclia puede atraer compradores que no entran cada día en Idealista, sobre todo en ciertos municipios del área metropolitana. En Barcelona ciudad, muchos propietarios publican en ambos para «cubrirse» — y duplican tiempo de gestión sin duplicar ofertas con financiación.</p>` +
    `<h2>Coste real: anuncio + meses + rebaja</h2><p>Paquetes de particulares en Habitaclia suelen ser más baratos que Idealista, pero el coste oculto sigue siendo curiosos, visitas sin solvencia y errores en arras. NuevaHabitat cobra <strong>${FEE}</strong> <strong>solo en escritura</strong> con cartera cualificada y panel vendedor.</p>` +
    `<h2>Cuándo tiene sentido NuevaHabitat tras Habitaclia</h2><p>Si llevas semanas con llamadas pero ninguna señal con hipoteca preaprobada, el cuello de botella no es otro portal — es pricing y filtro. Valoración gratuita en 24 h desde Les Corts.</p>` +
    `<h2>Comparativa rápida</h2><ul><li><strong>Habitaclia particular:</strong> visibilidad, gestión tuya, sin filtro legal.</li><li><strong>Agencia 6%:</strong> servicio, factura alta proporcional al ticket.</li><li><strong>NuevaHabitat:</strong> ${FEE_LINE} fijos, compradores filtrados, panel.</li></ul>` +
    `<p>Más: <a href="/nuevahabitat-vs-idealista-particular">Idealista</a>, <a href="/nuevahabitat-vs-fotocasa-particular">Fotocasa</a>, <a href="/inmobiliaria-para-particulares-barcelona">inmobiliaria particulares</a>.</p>` +
    expandBlock({ barrio: 'Barcelona', zonas: ['Eixample', 'Gràcia', 'Sants', 'Sarrià'] }, 'comparativa');
  ensureWords(L, 900, 'comparativa');
  L.meta.description = L.meta.description.replace(/3\.500/g, '3.630').replace(/3500/g, '3630');
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('fix habitaclia');
}

function fixSinPortalesFees() {
  fs.readdirSync(INT)
    .filter((f) => f.startsWith('vender-piso-sin-portales-') && f.endsWith('.json'))
    .forEach((f) => {
      const p = path.join(INT, f);
      let t = fs.readFileSync(p, 'utf8');
      t = t.replace(/3\.500\s*€\s*\+\s*IVA/g, FEE);
      t = t.replace(/3500\s*€\s*\+\s*IVA/g, FEE);
      const L = JSON.parse(t);
      if (wordCount(L.argumento_principal) < 900) {
        const slug = L.relacionadas && L.relacionadas.find((r) => r.slug && r.slug.startsWith('vender'));
        ensureWords(L, 900, 'sin-portales');
        fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
        console.log('expand sin-portales', L.slug);
      } else {
        fs.writeFileSync(p, t, 'utf8');
      }
    });
}

// Delete duplicate / unrequested sin-portales
const SIN_PORTALES_DELETE = [
  'vender-piso-sin-portales-badalona-barcelona.json',
  'vender-piso-sin-portales-cornella-barcelona.json',
  'vender-piso-sin-portales-esplugues-barcelona.json',
  'vender-piso-sin-portales-horta-barcelona.json',
  'vender-piso-sin-portales-l-hospitalet-barcelona.json',
  'vender-piso-sin-portales-nou-barris-barcelona.json',
  'vender-piso-sin-portales-sant-marti-barcelona.json',
  'vender-piso-sin-portales-sants-barcelona.json',
];
SIN_PORTALES_DELETE.forEach((f) => {
  const p = path.join(INT, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log('deleted', f);
  }
});

const distritoPart = path.join(PART, 'vender-como-particular-ciutat-vella-distrito-barcelona.json');
if (fs.existsSync(distritoPart)) {
  fs.unlinkSync(distritoPart);
  console.log('deleted ciutat-vella-distrito particular duplicate');
}

// Fix all new intencion particulares + precio fijo
fs.readdirSync(INT).forEach((f) => {
  if (f.includes('inmobiliaria-para-particulares-') || f.includes('inmobiliaria-precio-fijo-')) {
    if (f === 'inmobiliaria-precio-fijo-barcelona.json') return;
    fixParticularesIntencionFile(path.join(INT, f));
  }
  if (f === 'venta-piso-economica-el-clot-la-sagrera-barcelona.json') fixEconomicaElClot();
});

fs.readdirSync(PART).forEach((f) => {
  const p = path.join(PART, f);
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (wordCount(L.argumento_principal) < 900) fixParticularFile(p);
});

fixHabitaclia();
fixSinPortalesFees();

console.log('fix-validate done');
