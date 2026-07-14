const SITE = 'https://www.nuevahabitat.com';
const SB_URL = process.env.SUPABASE_URL || 'https://xxodawayoogthxnjpouq.supabase.co';
const SB_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_fZ9IgW5VfsF_Gf_zFsxqnA_jOaH2yri';

const STATIC = [
  '', 'vender.html', 'comprar.html', 'inmuebles.html', 'hipotecas.html',
  'nosotros.html', 'blog.html', 'contacto.html', 'login.html', 'registro.html',
  'privacidad.html', 'aviso-legal.html', 'cookies.html'
];

export default async function handler(req, res) {
  const urls = STATIC.map(p => ({
    loc: `${SITE}/${p}`,
    priority: p === '' ? '1.0' : '0.8',
  }));

  try {
    const inmRes = await fetch(
      `${SB_URL}/rest/v1/inmuebles?select=id,updated_at&estado=neq.retirado&cartera_privada=eq.false&order=updated_at.desc`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
    );
    if (inmRes.ok) {
      const inm = await inmRes.json();
      inm.forEach(i => urls.push({
        loc: `${SITE}/inmueble-detalle.html?id=${i.id}`,
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
        loc: `${SITE}/blog-articulo.html?slug=${encodeURIComponent(p.slug)}`,
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
