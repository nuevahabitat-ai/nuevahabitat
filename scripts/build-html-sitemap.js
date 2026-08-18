const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://www.nuevahabitat.com';

const STATIC_PAGES = [
  { href: '/', label: 'Inicio' },
  { href: '/vender', label: 'Vender' },
  { href: '/comprar', label: 'Comprar' },
  { href: '/inmuebles', label: 'Inmuebles' },
  { href: '/hipotecas', label: 'Hipotecas' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
];

const STATIC_BLOG = [
  'precio-pisos-barcelona', 'contrato-arras', 'guia-hipotecas', 'como-vender-rapido',
  'home-staging', 'primera-vivienda', 'mercado-2026', 'gastos-compraventa',
  'negociar-precio', 'euribor-2026', 'vender-piso-barcelona-precio-fijo',
  'valoracion-gratis-barcelona', 'comision-inmobiliaria-barcelona',
  'comprar-piso-barcelona-guia', 'comprar-casa-area-metropolitana',
  'documentos-vender-piso', 'buscar-piso-hipoteca-barcelona', 'vender-piso-herencia-barcelona',
  'guia-valoracion-piso-barcelona-2026', 'housfy-vs-precio-fijo-barcelona',
  'vender-piso-horta-guia', 'vender-hipoteca-pendiente-guia',
  'vender-piso-alquilado-guia-barcelona', 'vender-piso-divorcio-guia-barcelona',
  'idealista-fotocasa-vs-inmobiliaria-barcelona', 'vender-piso-poblenou-guia-2026',
];

const CLUSTER_LABELS = {
  barrio: 'Vender por barrio',
  situacion: 'Vender por situación',
  intencion: 'Guías para vender',
  comparativa: 'Comparativas',
};

function loadLandings() {
  const indexPath = path.join(ROOT, 'content', 'landings-index.json');
  const landingsPath = path.join(ROOT, 'js', 'landings.js');
  let index = { landings: [] };
  if (fs.existsSync(indexPath)) {
    index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  }
  let titles = {};
  if (fs.existsSync(landingsPath)) {
    const m = fs.readFileSync(landingsPath, 'utf8').match(/window\.NH_LANDINGS = (\{[\s\S]*?\n\});/);
    if (m) titles = JSON.parse(m[1]);
  }
  return (index.landings || [])
    .filter((l) => l.indexable !== false)
    .map((l) => ({
      slug: l.slug,
      cluster: l.cluster || titles[l.slug]?.cluster || 'barrio',
      label: titles[l.slug]?.footerLabel || titles[l.slug]?.barrio || l.slug.replace(/-/g, ' '),
    }));
}

function loadBlogTitles() {
  const p = path.join(ROOT, 'js', 'blog-posts.js');
  if (!fs.existsSync(p)) return {};
  const src = fs.readFileSync(p, 'utf8');
  const titles = {};
  STATIC_BLOG.forEach((slug) => {
    const re = new RegExp(`'${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{[\\s\\S]*?title:\\s*'([^']+)'`);
    const m = src.match(re);
    titles[slug] = m ? m[1] : slug.replace(/-/g, ' ');
  });
  return titles;
}

function linkList(items) {
  return `<ul class="sitemap-list">${items.map((i) => `<li><a href="${i.href}">${i.label}</a></li>`).join('')}</ul>`;
}

function buildHtml() {
  const landings = loadLandings();
  const blogTitles = loadBlogTitles();
  const byCluster = {};
  landings.forEach((l) => {
    if (!byCluster[l.cluster]) byCluster[l.cluster] = [];
    byCluster[l.cluster].push({ href: `/${l.slug}`, label: l.label });
  });

  const blogLinks = STATIC_BLOG.map((slug) => ({
    href: `/blog/${encodeURIComponent(slug)}`,
    label: blogTitles[slug] || slug.replace(/-/g, ' '),
  }));

  const sections = Object.keys(CLUSTER_LABELS)
    .filter((k) => byCluster[k]?.length)
    .map((k) => `<section class="sitemap-section"><h2>${CLUSTER_LABELS[k]}</h2>${linkList(byCluster[k])}</section>`)
    .join('\n');

  const gscPriority = [
    ...landings.slice(0, 15).map((l) => `${SITE}/${l.slug}`),
    ...STATIC_BLOG.slice(0, 10).map((s) => `${SITE}/blog/${s}`),
  ];
  fs.writeFileSync(
    path.join(ROOT, 'content', 'gsc-priority-urls.txt'),
    gscPriority.join('\n') + '\n',
    'utf8'
  );

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mapa del sitio · NuevaHabitat Barcelona</title>
  <meta name="description" content="Todas las páginas de NuevaHabitat: guías para vender y comprar vivienda en Barcelona, barrios, comparativas y blog inmobiliario."/>
  <meta name="robots" content="index, follow"/>
  <link rel="canonical" href="${SITE}/mapa-del-sitio"/>
  <link rel="stylesheet" href="/css/styles.css"/>
  <link rel="icon" type="image/png" href="/imagenes/Logo/logosinfondo2.png"/>
  <style>
    .sitemap-page{padding:calc(var(--nav-h,80px) + 2.5rem) 0 4rem}
    .sitemap-page h1{font-family:var(--font-serif);font-size:clamp(1.75rem,4vw,2.5rem);margin-bottom:.5rem}
    .sitemap-intro{color:var(--gris-texto);max-width:720px;margin-bottom:2.5rem;line-height:1.7}
    .sitemap-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem}
    .sitemap-section h2{font-size:1rem;text-transform:uppercase;letter-spacing:.06em;color:var(--gris-medio);margin-bottom:1rem}
    .sitemap-list{list-style:none;padding:0;margin:0;display:grid;gap:.45rem}
    .sitemap-list a{color:var(--negro);text-decoration:none;font-size:.9375rem;line-height:1.45}
    .sitemap-list a:hover{color:var(--oro)}
  </style>
</head>
<body>
<nav id="navbar" class="scrolled" style="background:rgba(13,13,13,.97)">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="/imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/></a>
    <ul class="nav-links">
      <li><a href="/vender">Vender</a></li><li><a href="/comprar">Comprar</a></li>
      <li><a href="/inmuebles">Inmuebles</a></li><li><a href="/blog">Blog</a></li>
    </ul>
    <div class="nav-actions"><a href="/registro" class="nav-cta">Empezar ahora</a></div>
  </div>
</nav>
<main class="sitemap-page">
  <div class="container">
    <h1>Mapa del sitio</h1>
    <p class="sitemap-intro">Índice de todas las guías para vender y comprar vivienda en Barcelona y área metropolitana. NuevaHabitat — inmobiliaria tecnológica con precio fijo.</p>
    <div class="sitemap-grid">
      <section class="sitemap-section"><h2>Páginas principales</h2>${linkList(STATIC_PAGES)}</section>
      ${sections}
      <section class="sitemap-section"><h2>Blog inmobiliario</h2>${linkList(blogLinks)}</section>
    </div>
  </div>
</main>
<footer>
  <div class="container">
    <div class="footer-bottom">
      <p>© 2026 NuevaHabitat.</p>
      <div class="footer-bottom-links"><a href="/">Inicio</a><a href="/privacidad">Privacidad</a></div>
    </div>
  </div>
</footer>
<script src="/js/main.js"></script>
</body>
</html>`;
}

function main() {
  const html = buildHtml();
  fs.writeFileSync(path.join(ROOT, 'mapa-del-sitio.html'), html, 'utf8');
  console.log('Built mapa-del-sitio.html and content/gsc-priority-urls.txt');
}

if (require.main === module) main();
module.exports = { main, buildHtml };
