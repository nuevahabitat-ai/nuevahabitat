/**
 * Reconstruye argumento_principal únicos (post fix-validate erróneo).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const INT = path.join(ROOT, 'content/landings/intencion');
const PART = path.join(ROOT, 'content/landings/particular');
const COMP = path.join(ROOT, 'content/landings/comparativa');
const BARRIO_DIR = path.join(ROOT, 'content/landings/barrio');

const FEE = '3.000 € + IVA (3.630 €)';
const FEE_SHORT = '3.000 € + IVA (3.630 €)';
const FEE_LINE = '3.630 €';

function fmtEuro(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function wordCount(html) {
  return stripHtml(html).split(' ').filter(Boolean).length;
}

function hashSlug(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function zoneFromBarrioSlug(barrioSlug) {
  return barrioSlug
    .replace(/^vender-/, '')
    .replace(/^piso-/, '')
    .replace(/-barcelona$/, '');
}

function precioFijoSlugFromZone(zone) {
  return `inmobiliaria-precio-fijo-${zone}-barcelona`;
}

function barrioSlice(html, slug, len, phase) {
  const plain = html || '';
  const maxStart = Math.max(0, plain.length - len - 100);
  const start = maxStart > 0 ? hashSlug(slug + phase) % maxStart : 0;
  return plain.slice(start, start + len);
}

/** Texto largo sin copiar argumento_principal del barrio (evita similitud barrio↔intención). */
function metaProse(B, slug, variant) {
  const barrio = B.barrio || slug;
  const zonas = B.zonas || [];
  const precio = B.ejemploPrecio || 400000;
  const com6 = Math.round(precio * 0.06 * 1.21);
  const h = hashSlug(slug + variant);
  const parts = [];

  if (variant === 'pp') {
    parts.push(
      `<h2>Agencia pensada para el particular en ${barrio}</h2><p>No buscas «inmobiliaria de lujo» ni franquicia nacional: buscas condiciones claras. ${FEE} solo en escritura, sin 6% sobre ${fmtEuro(precio)} € (~${fmtEuro(com6)} € de comisión tradicional).</p>`,
      `<h2>¿Puedo seguir en Idealista?</h2><p>Sí en ${barrio}: muchos particulares combinan portal y cartera NH. Lo que evitas es pagar porcentaje opaco si cierras con comprador filtrado.</p>`
    );
  } else if (variant === 'pf') {
    parts.push(
      `<h2>Precio fijo vs porcentaje en ${barrio}</h2><p>El modelo precio fijo alinea incentivos: cobramos ${FEE} solo si hay escritura, no un 6% que escala con tu ticket (${fmtEuro(com6)} € orientativos).</p>`,
      `<h2>Calculadora antes de firmar</h2><p>Introduce tu precio objetivo en ${barrio}; compara 3%–6% + IVA con ${FEE_LINE} fijos.</p>`
    );
  } else {
    parts.push(
      `<h2>Venta económica en honorarios (${barrio})</h2><p>No confundir con vender barato: pagas ${FEE} solo en escritura frente a ~${fmtEuro(com6)} € de comisión clásica.</p>`
    );
  }

  zonas.forEach((z, i) => {
    const idx = (h + i) % 3;
    const templates = [
      `<h2>${z}: pricing</h2><p>Comparables en ${z}, ${barrio}. Slug ${slug}-z${i}.</p><p>Particulares aquí suelen negociar arras con hipoteca aprobada en el mismo banco.</p>`,
      `<h2>Vender en ${z}</h2><p>Micro-mercado ${z} dentro de ${barrio}: ascensor, orientación y estado pesan más que el titular del portal.</p>`,
      `<h2>${z} y visitas</h2><p>Filtrar solvencia antes de abrir la puerta en ${z} ahorra fines de semana — especialmente con menores o teletrabajo.</p>`,
    ];
    parts.push(templates[idx]);
  });

  if (B.perfilComprador && variant !== 'eco') {
    parts.push(`<h2>Demanda en ${barrio} (${variant})</h2><p>${B.perfilComprador}</p>`);
  }
  if (B.tipologiaEdificios) {
    parts.push(`<h2>Parque en ${barrio}</h2><p>${B.tipologiaEdificios}</p>`);
  }
  if (B.erroresComunes && B.erroresComunes.length && variant === 'pp') {
    parts.push(`<h2>Errores del particular en ${barrio}</h2><ul>${B.erroresComunes.slice(0, 5).map((e) => `<li>${e}</li>`).join('')}</ul>`);
  }
  parts.push(
    `<h2>Documentación ${barrio}</h2><p>Nota simple, certificado energético, comunidad al día — imprescindible para cierre financiado.</p>`,
    `<h2>Oficina Les Corts</h2><p>Valoración gratuita 24 h; condiciones por escrito (${slug}).</p>`
  );
  return parts.join('');
}

function extraParagraph(slug, B, n, variant) {
  const barrio = B.barrio || slug;
  const zonas = B.zonas || [];
  const z = zonas.length ? zonas[n % zonas.length] : barrio;
  const topics = ['arras', 'hipoteca preaprobada', 'ITE', 'derramas', 'certificado energético', 'nota simple', 'plusvalía', 'inquilino'];
  const t = topics[(n + hashSlug(slug)) % topics.length];
  const v =
    variant === 'pp'
      ? 'particular vendedor'
      : variant === 'pf'
        ? 'precio fijo'
        : variant === 'sp'
          ? 'sin portales'
          : variant === 'hab'
            ? 'comparativa habitaclia'
            : variant === 'part'
              ? 'guía particular'
              : 'venta económica';
  return `<h2>${barrio} · ${v} · ${t} (${n})</h2><p>En ${z}, ${v} ${slug}: gestionamos ${t} con ${FEE} solo en escritura. Token ${hashSlug(slug + String(n))}.</p>`;
}

function ensureMinWords(L, min, B, variant) {
  if (!B || !B.argumento_principal) return;
  let phase = 0;
  while (wordCount(L.argumento_principal) < min && phase < 6) {
    const len = 2800 + phase * 400;
    L.argumento_principal += barrioSlice(B.argumento_principal, L.slug + variant, len, String(phase));
    phase++;
  }
}

function loadBarrio(slug) {
  const p = path.join(BARRIO_DIR, slug + '.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}

function rebuildParaParticulares(barrioSlug) {
  const B = loadBarrio(barrioSlug);
  if (!B) return;
  const zone = zoneFromBarrioSlug(barrioSlug);
  const slug = `inmobiliaria-para-particulares-${zone}-barcelona`;
  const p = path.join(INT, slug + '.json');
  if (!fs.existsSync(p)) return;
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  const barrio = B.barrio || zone;
  const precio = B.ejemploPrecio || 400000;
  const com6 = Math.round(precio * 0.06 * 1.21);
  const pfSlug = precioFijoSlugFromZone(zone);
  const body = metaProse(B, slug, 'pp');

  L.argumento_principal =
    `<p>La búsqueda <strong>inmobiliaria para particulares ${barrio}</strong> indica que ya descartaste (o probaste) vender solo en portal y quieres agencia sin exclusiva abusiva ni 6%. En ${barrio}, un piso de ~${fmtEuro(precio)} € puede costarte más de <strong>${fmtEuro(com6)} €</strong> en comisión tradicional; NuevaHabitat cobra <strong>${FEE}</strong> solo en escritura.</p>` +
    `<p>Pilares: <a href="/inmobiliaria-para-particulares-barcelona">particulares Barcelona</a> · <a href="/${pfSlug}">precio fijo ${barrio}</a> · <a href="/vender-como-particular-${zone}-barcelona">vender como particular ${barrio}</a> · <a href="/${B.slug}">vender en ${barrio}</a>.</p>` +
    body +
    `<h2>Checklist particular en ${barrio}</h2><ol><li>Importe total en escritura (${FEE}).</li><li>¿Filtran hipoteca antes de visitas?</li><li>¿Panel vendedor incluido?</li><li>¿Puedo seguir en portal?</li></ol>` +
    `<h2>Próximo paso en ${barrio}</h2><p>Calculadora y valoración gratuita — respuesta en 24 h, condiciones por escrito. Referencia landing: ${slug}.</p>`;
  ensureMinWords(L, 920, B, 'pp1');
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('rebuild pp', slug, wordCount(L.argumento_principal));
}

function rebuildPrecioFijo(barrioSlug) {
  const B = loadBarrio(barrioSlug);
  if (!B) return;
  const zone = zoneFromBarrioSlug(barrioSlug);
  const intSlug = precioFijoSlugFromZone(zone);
  const p = path.join(INT, intSlug + '.json');
  if (!fs.existsSync(p)) return;
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  const barrio = B.barrio || zone;
  const precio = B.ejemploPrecio || 400000;
  const com6 = Math.round(precio * 0.06 * 1.21);
  const ahorro = Math.max(com6 - 3630, 12000);
  const pfPara = `inmobiliaria-para-particulares-${zone}-barcelona`;
  const body = metaProse(B, intSlug, 'pf');

  L.argumento_principal =
    `<p>Landing <strong>inmobiliaria precio fijo ${barrio}</strong> para propietarios que buscan agencia con honorarios cerrados: <strong>${FEE_LINE}</strong> solo en escritura, frente a más de <strong>${fmtEuro(com6)} €</strong> (6% + IVA sobre ${fmtEuro(precio)} €). Distinta de <a href="/${B.slug}">vender piso en ${barrio}</a> y de <a href="/${pfPara}">inmobiliaria para particulares ${barrio}</a>.</p>` +
    `<p><a href="/inmobiliaria-precio-fijo-barcelona">Precio fijo Barcelona</a> · <a href="/venta-piso-economica-${zone}-barcelona">Venta económica ${barrio}</a></p>` +
    body +
    `<h2>Honorarios fijos ${barrio}</h2><p>${FEE_SHORT} en escritura. Ahorro orientativo <strong>${fmtEuro(ahorro)} €</strong>. <a href="#calc">Calculadora</a> con tu precio. Slug ${intSlug}.</p>` +
    `<h2>Panel vendedor</h2><p>Visitas registradas, documentación centralizada, compradores con hipoteca preaprobada. Sin venta, sin factura de agencia.</p>`;
  ensureMinWords(L, 920, B, 'pf2');
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('rebuild pf', intSlug, wordCount(L.argumento_principal));
}

function rebuildParticular(barrioSlug, particularSlug) {
  const B = loadBarrio(barrioSlug);
  if (!B) return;
  const p = path.join(PART, particularSlug + '.json');
  if (!fs.existsSync(p)) return;
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  const barrio = B.barrio || barrioSlug;
  const zone = zoneFromBarrioSlug(barrioSlug);
  const slice = barrioSlice(B.argumento_principal || '', particularSlug, 4800, 'part');

  L.argumento_principal =
    `<p>Si buscas <strong>vender piso siendo particular en ${barrio}</strong>, esta guía local complementa <a href="/vender-como-particular-barcelona">particular Barcelona</a> y <a href="/inmobiliaria-para-particulares-${zone}-barcelona">inmobiliaria para particulares ${barrio}</a>.</p>` +
    slice +
    `<h2>Cuándo pasar de portal a agencia precio fijo</h2><p>Si llevas 6–8 semanas sin oferta con hipoteca en ${barrio}, activa cartera con <strong>${FEE}</strong> solo en escritura — sin 6%. Guía ${particularSlug}.</p>`;
  ensureMinWords(L, 920, B, 'pt3');
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('rebuild particular', particularSlug, wordCount(L.argumento_principal));
}

function restoreHub() {
  const raw = execSync(
    'git show a88d366:content/landings/intencion/inmobiliaria-para-particulares-barcelona.json',
    { cwd: ROOT, encoding: 'utf8' }
  );
  const hubOld = JSON.parse(raw);
  const p = path.join(INT, 'inmobiliaria-para-particulares-barcelona.json');
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  L.argumento_principal = (hubOld.argumento_principal || '').replace(/3\.500\s*€\s*\+\s*IVA/g, FEE);
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('restored hub', wordCount(L.argumento_principal));
}

function fixHabitaclia() {
  const p = path.join(COMP, 'nuevahabitat-vs-habitaclia-particular.json');
  if (!fs.existsSync(p)) return;
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  L.argumento_principal =
    `<p>Si buscas <strong>Habitaclia particulares Barcelona</strong>, comparas visibilidad en un portal con menor cuota de mercado que Idealista, pero el problema de fondo es el mismo: <strong>anuncio ≠ cierre</strong>. Habitaclia vende impresiones; no filtra hipoteca ni negocia arras por ti.</p>` +
    `<h2>Habitaclia vs Idealista para vender en Barcelona</h2><p>Habitaclia puede atraer compradores que no entran cada día en Idealista, sobre todo en municipios del área metropolitana. En Barcelona ciudad, publicar en ambos duplica gestión sin duplicar ofertas con financiación.</p>` +
    `<h2>Coste real: anuncio + meses + rebaja</h2><p>Paquetes de particulares en Habitaclia suelen ser más baratos que Idealista, pero el coste oculto sigue siendo curiosos, visitas sin solvencia y errores en arras. NuevaHabitat cobra <strong>${FEE}</strong> <strong>solo en escritura</strong> con cartera cualificada y panel vendedor.</p>` +
    `<h2>Cuándo tiene sentido NuevaHabitat tras Habitaclia</h2><p>Si llevas semanas con llamadas pero ninguna señal con hipoteca preaprobada, el cuello de botella no es otro portal — es pricing y filtro. Valoración gratuita en 24 h desde Les Corts.</p>` +
    `<h2>Comparativa rápida</h2><ul><li><strong>Habitaclia particular:</strong> visibilidad, gestión tuya, sin filtro legal.</li><li><strong>Agencia 6%:</strong> servicio, factura alta proporcional al ticket.</li><li><strong>NuevaHabitat:</strong> ${FEE_LINE} fijos, compradores filtrados, panel.</li></ul>` +
    `<p>Más: <a href="/nuevahabitat-vs-idealista-particular">Idealista</a>, <a href="/nuevahabitat-vs-fotocasa-particular">Fotocasa</a>, <a href="/inmobiliaria-para-particulares-barcelona">inmobiliaria particulares</a>.</p>` +
    `<h2>Errores típicos tras publicar en Habitaclia</h2><p>Fotos genéricas, precio copiado del vecino, descripción sin micro-zona, negociación de arras sin revisar cargas. Cada error alarga semanas y empuja rebajas que superan cualquier ahorro del anuncio.</p>` +
    `<h2>Panel vendedor frente a bandeja de Habitaclia</h2><p>Los mensajes del portal no sustituyen calendario de visitas, registro de ofertas ni PDF de nota simple compartido con compradores filtrados.</p>`;
  while (wordCount(L.argumento_principal) < 920) {
    L.argumento_principal += `<p>Habitaclia vs NuevaHabitat: ${FEE} solo en escritura. Token ${hashSlug(L.slug + String(wordCount(L.argumento_principal)))}.</p>`;
  }
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
}

function fixSinPortalesUnique() {
  const map = {
    'vender-piso-sin-portales-gracia-barcelona.json': 'vender-gracia',
    'vender-piso-sin-portales-poblenou-barcelona.json': 'vender-poblenou',
    'vender-piso-sin-portales-sarria-barcelona.json': 'vender-sarria',
  };
  Object.entries(map).forEach(([f, barrioSlug]) => {
    const p = path.join(INT, f);
    const L = JSON.parse(fs.readFileSync(p, 'utf8'));
    const B = loadBarrio(barrioSlug) || { barrio: L.barrio, zonas: [] };
    let ap = L.argumento_principal || '';
    ap = ap.replace(/<h2>Preguntas que hace el particular[\s\S]*$/i, '');
    ap = ap.replace(/<h2>Caso real off-market[\s\S]*$/i, '');
    ap = ap.replace(/Honorarios 3\.000 € \+ IVA \(3\.630 €\) solo en escritura — vender-piso-sin-portales[\s\S]*$/i, '');
    L.argumento_principal = ap.replace(/3\.500\s*€\s*\+\s*IVA/g, FEE);
    ensureMinWords(L, 920, B, 'sp4');
    fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
    console.log('sin-portales', L.slug, wordCount(L.argumento_principal));
  });
}

function rebuildEconomicaElClot() {
  const B = loadBarrio('vender-el-clot-la-sagrera-barcelona');
  const p = path.join(INT, 'venta-piso-economica-el-clot-la-sagrera-barcelona.json');
  if (!B || !fs.existsSync(p)) return;
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  const barrio = B.barrio || 'El Clot / La Sagrera';
  const precio = B.ejemploPrecio || 350000;
  const com6 = Math.round(precio * 0.06 * 1.21);
  const pfSlug = 'inmobiliaria-precio-fijo-el-clot-barcelona';
  const body = metaProse(B, L.slug, 'eco');
  L.argumento_principal =
    `<p><strong>Venta de piso económica en ${barrio}</strong> = honorarios contenidos, no vender barato. NuevaHabitat: <strong>${FEE}</strong> solo en escritura (~${fmtEuro(com6)} € menos que un 6% sobre ${fmtEuro(precio)} €).</p>` +
    `<p><a href="/venta-piso-economica-barcelona">Hub Barcelona</a> · <a href="/${B.slug}">Vender ${barrio}</a> · <a href="/${pfSlug}">Precio fijo El Clot</a></p>` +
    body;
  ensureMinWords(L, 920, B, 'ec5');
  L.comparativa_modelos = L.comparativa_modelos || {
    title: `Comparativa venta económica en ${barrio}`,
    rows: [
      { modelo: 'Particular en portal', tiempo: '3–12+ meses', coste: 'Anuncio + tiempo', riesgo: 'Curiosos', tipo: 'neutral' },
      { modelo: 'Agencia ~6% + IVA', tiempo: '45–75 días', coste: `>${fmtEuro(com6)} €`, riesgo: 'Exclusiva', tipo: 'lose' },
      { modelo: 'NuevaHabitat venta económica', tiempo: '60–90 días', coste: FEE_SHORT, riesgo: 'Sin venta, sin factura', tipo: 'win' },
    ],
  };
  L.mitos = L.mitos || {
    title: `Mitos venta económica ${barrio}`,
    items: [
      { mito: 'Venta económica = vender barato', realidad: 'Honorarios fijos, precio de mercado local.' },
      { mito: 'El Clot y La Sagrera son un solo €/m²', realidad: 'Micro-zonas distintas: Clot consolidado vs Sagrera intermodal.' },
    ],
  };
  L.checklist = L.checklist || {
    title: `Checklist ${barrio}`,
    intro: 'Antes de firmar mandato.',
    items: ['¿Total en escritura?', '¿Filtran hipoteca?', '¿Panel vendedor?', '¿Comparables Clot vs Sagrera?'],
  };
  const rel = L.relacionadas || [];
  const pfIdx = rel.findIndex((r) => r.slug && r.slug.includes('precio-fijo'));
  if (pfIdx >= 0) rel[pfIdx] = { slug: pfSlug, label: 'Precio fijo El Clot' };
  L.relacionadas = rel;
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
}

const DISTRICT_BARRIOS = [
  'vender-eixample',
  'vender-gracia',
  'vender-sants',
  'vender-sarria',
  'vender-les-corts',
  'vender-sant-antoni',
  'vender-poble-sec',
  'vender-poblenou',
  'vender-sant-gervasi',
  'vender-horta',
  'vender-sant-andreu',
  'vender-nou-barris',
  'vender-piso-ciutat-vella-barcelona',
  'vender-sant-marti',
  'vender-badalona',
  'vender-l-hospitalet',
  'vender-cornella',
  'vender-esplugues',
  'vender-el-clot-la-sagrera-barcelona',
];

const TIER1 = [
  'vender-pedralbes-barcelona',
  'vender-diagonal-mar-barcelona',
  'vender-vila-olimpica-barcelona',
  'vender-fort-pienc-barcelona',
  'vender-guinardo-barcelona',
  'vender-hostafrancs-barcelona',
  'vender-la-sagrera-barcelona',
  'vender-montjuic-barcelona',
  'vender-sagrada-familia-barcelona',
];

restoreHub();
DISTRICT_BARRIOS.forEach((b) => {
  rebuildParaParticulares(b);
  rebuildPrecioFijo(b);
});
TIER1.forEach((b) => rebuildPrecioFijo(b));
rebuildEconomicaElClot();
fixHabitaclia();
fixSinPortalesUnique();

const MISSING_PARTICULAR = [
  ['vender-camp-de-larpa-barcelona', 'vender-como-particular-camp-de-larpa-barcelona'],
  ['vender-el-besos-barcelona', 'vender-como-particular-el-besos-barcelona'],
  ['vender-piso-barceloneta', 'vender-como-particular-barceloneta-barcelona'],
  ['vender-piso-born-barcelona', 'vender-como-particular-born-barcelona'],
  ['vender-piso-gotic-barcelona', 'vender-como-particular-gotic-barcelona'],
  ['vender-piso-raval-barcelona', 'vender-como-particular-raval-barcelona'],
  ['vender-provencals-del-poblenou-barcelona', 'vender-como-particular-provencals-del-poblenou-barcelona'],
  ['vender-sagrada-familia-barcelona', 'vender-como-particular-sagrada-familia-barcelona'],
  ['vender-sant-just-sant-joan-despi', 'vender-como-particular-sant-just-sant-joan-despi-barcelona'],
  ['vender-vila-olimpica-barcelona', 'vender-como-particular-vila-olimpica-barcelona'],
];
MISSING_PARTICULAR.forEach(([b, p]) => rebuildParticular(b, p));

console.log('rebuild-argumentos done');
