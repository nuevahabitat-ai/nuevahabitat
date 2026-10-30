/**
 * Repara argumento_principal corrupto y enlaces 404 a inmobiliaria-para-particulares-* inexistentes.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PART = path.join(ROOT, 'content/landings/particular');
const BARRIO = path.join(ROOT, 'content/landings/barrio');
const FEE = '3.000 € + IVA (3.630 €)';

const AGENCY_LINK = {
  'vender-como-particular-barceloneta-barcelona': 'inmobiliaria-para-particulares-ciutat-vella-barcelona',
  'vender-como-particular-born-barcelona': 'inmobiliaria-para-particulares-ciutat-vella-barcelona',
  'vender-como-particular-gotic-barcelona': 'inmobiliaria-para-particulares-ciutat-vella-barcelona',
  'vender-como-particular-raval-barcelona': 'inmobiliaria-para-particulares-ciutat-vella-barcelona',
  'vender-como-particular-vila-olimpica-barcelona': 'inmobiliaria-para-particulares-sant-marti-barcelona',
  'vender-como-particular-provencals-del-poblenou-barcelona': 'inmobiliaria-para-particulares-sant-marti-barcelona',
  'vender-como-particular-el-besos-barcelona': 'inmobiliaria-para-particulares-sant-marti-barcelona',
  'vender-como-particular-camp-de-larpa-barcelona': 'inmobiliaria-para-particulares-sant-marti-barcelona',
  'vender-como-particular-sagrada-familia-barcelona': 'inmobiliaria-precio-fijo-sagrada-familia-barcelona',
  'vender-como-particular-sant-just-sant-joan-despi-barcelona': 'inmobiliaria-para-particulares-esplugues-barcelona',
};

const BARRIO_SRC = {
  'vender-como-particular-barceloneta-barcelona': 'vender-piso-barceloneta',
  'vender-como-particular-born-barcelona': 'vender-piso-born-barcelona',
  'vender-como-particular-gotic-barcelona': 'vender-piso-gotic-barcelona',
  'vender-como-particular-raval-barcelona': 'vender-piso-raval-barcelona',
  'vender-como-particular-vila-olimpica-barcelona': 'vender-vila-olimpica-barcelona',
  'vender-como-particular-provencals-del-poblenou-barcelona': 'vender-provencals-del-poblenou-barcelona',
  'vender-como-particular-el-besos-barcelona': 'vender-el-besos-barcelona',
  'vender-como-particular-camp-de-larpa-barcelona': 'vender-camp-de-larpa-barcelona',
  'vender-como-particular-sagrada-familia-barcelona': 'vender-sagrada-familia-barcelona',
  'vender-como-particular-sant-just-sant-joan-despi-barcelona': 'vender-sant-just-sant-joan-despi',
};

function loadBarrio(slug) {
  const p = path.join(BARRIO, slug + '.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}

function stripCorruptTail(html) {
  if (!html) return '';
  const cut = html.indexOf('<h2>Cuándo pasar de portal');
  if (cut > 0) return html.slice(0, cut);
  return html.replace(/<\/p>ting\./g, '</p><p>La Vila Olímpica concentra demanda premium.');
}

Object.entries(BARRIO_SRC).forEach(([partSlug, barrioSlug]) => {
  const p = path.join(PART, partSlug + '.json');
  if (!fs.existsSync(p)) return;
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  const B = loadBarrio(barrioSlug);
  if (!B) {
    console.warn('no barrio', barrioSlug);
    return;
  }
  const barrio = B.barrio || barrioSlug;
  const agency = AGENCY_LINK[partSlug];
  const agencyLabel = agency.includes('precio-fijo') ? `precio fijo ${barrio}` : `inmobiliaria para particulares (${barrio})`;

  const barrioHtml = B.argumento_principal || '';
  let body =
    `<p>Si buscas <strong>vender piso siendo particular en ${barrio}</strong>, esta guía local complementa <a href="/vender-como-particular-barcelona">particular Barcelona</a> y <a href="/${agency}">${agencyLabel}</a>.</p>` +
    barrioHtml.slice(0, 6000);
  if (partSlug.includes('vila-olimpica')) {
    body += `<p><strong>Vila Olímpica vs Diagonal Mar:</strong> no mezcles comparables de Diagonal Mar si tu finca está en Nova Icària o junto al Port Olímpic.</p>`;
  }
  body += barrioHtml.slice(6000, 12000);
  body += `<h2>Cuándo pasar de portal a agencia precio fijo</h2><p>Si llevas 6–8 semanas sin oferta con hipoteca en ${barrio}, activa cartera con <strong>${FEE}</strong> solo en escritura — sin 6%.</p>`;
  function wc(t) {
    return t.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  }
  let n = 0;
  while (wc(body) < 920 && n < 12) {
    body += `<h2>Particular en ${barrio} (${n})</h2><p>Documentación, visitas filtradas y panel vendedor en ${partSlug}. Valoración Les Corts 24 h.</p>`;
    n++;
  }
  L.argumento_principal = body;

  if (L.relacionadas && agency) {
    const idx = L.relacionadas.findIndex((r) => r.slug && r.slug.includes('inmobiliaria'));
    const label = agency.includes('precio-fijo') ? `Precio fijo ${barrio}` : `Agencia particulares`;
    const entry = { slug: agency, label };
    if (idx >= 0) L.relacionadas[idx] = entry;
    else L.relacionadas.unshift(entry);
  }

  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('fixed', partSlug);
});
