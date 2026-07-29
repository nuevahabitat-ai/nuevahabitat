/**
 * Fase 4 SEO roadmap: interlinking contextual dentro del cuerpo de las landings.
 * Inserta 2-4 enlaces contextuales por página, dentro de los párrafos existentes
 * de `argumento_principal`, apuntando a otras landings o artículos de blog
 * relevantes por keyword. No toca `related-block` final (ya existe via `relacionadas`).
 *
 * Reglas: primera coincidencia de cada frase clave dentro de un <p> (no en <h2>),
 * evitando auto-enlaces y limitando a MAX_LINKS por página para no saturar.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'content', 'landings');
const CLUSTERS = ['barrio', 'situacion', 'intencion', 'comparativa'];
const MAX_LINKS = 3;

function listFiles() {
  const out = [];
  CLUSTERS.forEach((cluster) => {
    const dir = path.join(ROOT, cluster);
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).filter((f) => f.endsWith('.json')).forEach((f) => {
      out.push(path.join(dir, f));
    });
  });
  return out;
}

// Orden de prioridad: primera regla que matchee y no sea auto-enlace se aplica.
const RULES = [
  { re: /vender (tu )?piso sin exclusividad/i, slug: 'vender-piso-sin-exclusividad-barcelona' },
  { re: /comisión del 6%|6% sobre el precio|agencias? tradicional(es)?/i, slug: 'nuevahabitat-vs-agencia-tradicional-barcelona' },
  { re: /vender (tu )?piso r[aá]pido/i, slug: 'vender-piso-rapido-barcelona' },
  { re: /valoraci[oó]n gratuita/i, slug: 'cuanto-vale-mi-piso-barcelona' },
  { re: /hipoteca pendiente/i, slug: 'vender-piso-hipoteca-pendiente-barcelona' },
  { re: /separaci[oó]n o divorcio|separaci[oó]n\/divorcio/i, slug: 'vender-piso-separacion-divorcio-barcelona' },
  { re: /piso okupado|ocupaci[oó]n ilegal/i, slug: 'vender-piso-okupado-barcelona' },
  { re: /piso heredado|proceso de herencia/i, slug: 'vender-piso-herencia-barcelona' },
  { re: /por tu cuenta|vender por su cuenta|vender solo\b/i, slug: 'vender-por-tu-cuenta-vs-nuevahabitat-barcelona' },
  { re: /\bIdealista\b/, slug: 'nuevahabitat-vs-idealista-particular' },
  { re: /\bFotocasa\b/, slug: 'nuevahabitat-vs-fotocasa-particular' },
  { re: /traslado laboral|traslado de trabajo/i, slug: 'vender-piso-traslado-barcelona' },
  { re: /segunda residencia/i, slug: 'vender-segunda-residencia-barcelona' },
  { re: /antes de comprar otro|comprar tu siguiente vivienda/i, slug: 'vender-piso-antes-comprar-otro-barcelona' },
  { re: /piso alquilado/i, slug: 'vender-piso-alquilado-barcelona' },
  { re: /contrato de arras|firmar arras/i, blogSlug: 'contrato-arras' },
  { re: /plusval[ií]a municipal/i, blogSlug: 'gastos-compraventa' },
  { re: /nota simple/i, blogSlug: 'documentos-vender-piso' },
  { re: /comisi[oó]n inmobiliaria/i, blogSlug: 'comision-inmobiliaria-barcelona' },
];

function urlFor(rule) {
  return rule.slug ? `/${rule.slug}` : `/blog-articulo?slug=${rule.blogSlug}`;
}

function linkKeyFor(rule) {
  return rule.slug || rule.blogSlug;
}

function processParagraphs(html, selfSlug, alreadyUsed) {
  let linksInserted = 0;
  const parts = html.split(/(<h2>.*?<\/h2>)/g);
  for (let i = 0; i < parts.length; i++) {
    if (linksInserted >= MAX_LINKS) break;
    if (parts[i].startsWith('<h2>')) continue; // no tocar títulos
    for (const rule of RULES) {
      if (linksInserted >= MAX_LINKS) break;
      const key = linkKeyFor(rule);
      if (key === selfSlug) continue;
      if (alreadyUsed.has(key)) continue;
      const m = rule.re.exec(parts[i]);
      if (!m) continue;
      const matchText = m[0];
      const idx = m.index;
      // Evitar insertar dentro de un tag ya existente (no debería haber, pero por seguridad)
      const before = parts[i].slice(0, idx);
      const openTags = (before.match(/<a /g) || []).length;
      const closeTags = (before.match(/<\/a>/g) || []).length;
      if (openTags > closeTags) continue;
      const url = urlFor(rule);
      const replacement = `<a href="${url}">${matchText}</a>`;
      parts[i] = parts[i].slice(0, idx) + replacement + parts[i].slice(idx + matchText.length);
      alreadyUsed.add(key);
      linksInserted++;
    }
  }
  return { html: parts.join(''), linksInserted };
}

function main() {
  const files = listFiles();
  let totalLinks = 0;
  let filesTouched = 0;
  files.forEach((file) => {
    const raw = fs.readFileSync(file, 'utf8');
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error('JSON inválido, se omite:', file, e.message);
      return;
    }
    if (!data.argumento_principal || typeof data.argumento_principal !== 'string') return;
    if (data.argumento_principal.includes('<a href=')) {
      // ya tiene enlaces contextuales, no duplicar en re-ejecuciones
      return;
    }
    const alreadyUsed = new Set();
    const { html, linksInserted } = processParagraphs(data.argumento_principal, data.slug, alreadyUsed);
    if (linksInserted > 0) {
      data.argumento_principal = html;
      fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
      totalLinks += linksInserted;
      filesTouched++;
      console.log(`${path.basename(file)}: +${linksInserted} enlaces`);
    } else {
      console.log(`${path.basename(file)}: sin coincidencias`);
    }
  });
  console.log(`\nTotal: ${totalLinks} enlaces insertados en ${filesTouched}/${files.length} páginas.`);
}

main();
