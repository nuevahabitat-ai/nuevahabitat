const fs = require('fs');
const path = require('path');

const SITE = 'https://www.nuevahabitat.com';
const SB_URL = process.env.SUPABASE_URL || 'https://xxodawayoogthxnjpouq.supabase.co';
const SB_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_fZ9IgW5VfsF_Gf_zFsxqnA_jOaH2yri';

function loadLandingsFromIndex() {
  try {
    const indexPath = path.join(process.cwd(), 'content', 'landings-index.json');
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    return (index.landings || []).filter((l) => l.indexable !== false);
  } catch (_) {
    return [
      { slug: 'vender-gracia', priority: 0.88 },
      { slug: 'vender-sarria', priority: 0.88 },
      { slug: 'vender-eixample', priority: 0.88 },
      { slug: 'vender-les-corts', priority: 0.88 },
      { slug: 'vender-sants', priority: 0.88 },
      { slug: 'vender-piso-alquilado-barcelona', priority: 0.87 },
      { slug: 'vender-piso-rapido-barcelona', priority: 0.89 },
    ];
  }
}
const STATIC = [
  '', 'vender', 'comprar', 'inmuebles', 'hipotecas',
  'nosotros', 'blog', 'contacto',
  'privacidad', 'aviso-legal', 'cookies'
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
];

export default async function handler(req, res) {
  const urls = STATIC.map(p => ({
    loc: p === '' ? `${SITE}/` : `${SITE}/${p}`,
    priority: p === '' ? '1.0' : '0.8',
  }));

  const LANDINGS = loadLandingsFromIndex();

  LANDINGS.forEach(({ slug, priority }) => urls.push({
    loc: `${SITE}/${slug}`,
    priority: String(priority || 0.88),
    changefreq: 'monthly',
  }));
  STATIC_BLOG.forEach(slug => urls.push({
    loc: `${SITE}/blog-articulo?slug=${encodeURIComponent(slug)}`,
    priority: '0.75',
    changefreq: 'monthly',
  }));

  try {
    const inmRes = await fetch(
      `${SB_URL}/rest/v1/inmuebles?select=id,updated_at&estado=neq.retirado&cartera_privada=eq.false&order=updated_at.desc`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
    );
    if (inmRes.ok) {
      const inm = await inmRes.json();
      inm.forEach(i => urls.push({
        loc: `${SITE}/inmueble-detalle?id=${i.id}`,
        lastmod: i.updated_at ? i.updated_at.slice(0, 10) : undefined,
        priority: '0.9',
      }));
    }

    const blogRes = await fetch(
      `${SB_URL}/rest/v1/blog_posts?select=slug,updated_at&publicado=eq.true`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
    );
    if (blogRes.ok) {
      const posts = await blogRes.json();
      posts.forEach(p => urls.push({
        loc: `${SITE}/blog-articulo?slug=${encodeURIComponent(p.slug)}`,
        lastmod: p.updated_at ? p.updated_at.slice(0, 10) : undefined,
        priority: '0.7',
      }));
    }
  } catch (_) {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority || '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(xml);
}
