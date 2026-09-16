/** 301 limpio: legacy blog-articulo?slug= → /blog/slug (sin arrastrar query — GSC) */
module.exports = (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.nuevahabitat.com';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = `${proto}://${host}`.replace('://nuevahabitat.com', '://www.nuevahabitat.com');
  const url = new URL(req.url || '/', base);
  const slug = (url.searchParams.get('target') || url.searchParams.get('slug') || '').trim();
  if (!slug) {
    res.writeHead(301, { Location: `${base}/blog` });
    return res.end();
  }
  res.writeHead(301, { Location: `${base}/blog/${encodeURIComponent(slug)}` });
  res.end();
};
