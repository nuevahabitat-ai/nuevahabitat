/**
 * Unifica enlaces internos: quita .html de hrefs y URLs en JS embebido.
 * Ejecutar: node scripts/patch-clean-urls.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['google0f5ccb93c68fedca.html']);

function patchContent(text) {
  let c = text;

  // Variantes con query (antes que el reemplazo genérico)
  c = c.replace(/inmuebles\.html\?/g, '/inmuebles?');
  c = c.replace(/blog-articulo\.html\?/g, '/blog-articulo?');
  c = c.replace(/inmueble-detalle\.html\?/g, '/inmueble-detalle?');

  // href index
  c = c.replace(/href="index\.html"/g, 'href="/"');
  c = c.replace(/href='index\.html'/g, "href='/'");

  // href resto de páginas estáticas
  c = c.replace(/href="([a-z0-9-]+)\.html([^"]*)"/gi, (_, page, rest) => {
    if (page === 'index') return `href="/${rest}"`.replace('href="//', 'href="/');
    return `href="/${page}${rest}"`;
  });
  c = c.replace(/href='([a-z0-9-]+)\.html([^']*)'/gi, (_, page, rest) => {
    if (page === 'index') return `href='/${rest}'`.replace("href='//", "href='/");
    return `href='/${page}${rest}'`;
  });

  // window.location / template strings en HTML inline
  c = c.replace(/`inmuebles\.html/g, '`/inmuebles');
  c = c.replace(/`vender\.html/g, '`/vender');
  c = c.replace(/`comprar\.html/g, '`/comprar');
  c = c.replace(/'inmuebles\.html/g, "'/inmuebles");
  c = c.replace(/'blog\.html/g, "'/blog");
  c = c.replace(/'login\.html/g, "'/login");

  return c;
}

function patchFile(file) {
  const before = fs.readFileSync(file, 'utf8');
  const after = patchContent(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    return true;
  }
  return false;
}

let count = 0;
fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html') && !SKIP.has(f))
  .forEach((f) => {
    if (patchFile(path.join(ROOT, f))) {
      console.log('patched', f);
      count++;
    }
  });

console.log(`Done: ${count} HTML files updated`);
