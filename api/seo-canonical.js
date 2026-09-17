/** 301: inmuebles?q= → /inmuebles#q= · blog-articulo?slug= → /blog/slug (GSC) */
module.exports = (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.nuevahabitat.com';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = `${proto}://${host}`.replace('://nuevahabitat.com', '://www.nuevahabitat.com');
  const url = new URL(req.url || '/', base);
  const role = (url.searchParams.get('role') || '').trim();

  if (role === 'blog') {
    const slug = (url.searchParams.get('target') || url.searchParams.get('slug') || '').trim();
    if (!slug) {
      res.writeHead(301, { Location: `${base}/blog` });
      return res.end();
    }
    res.writeHead(301, { Location: `${base}/blog/${encodeURIComponent(slug)}` });
    return res.end();
  }

  const q = (url.searchParams.get('target') || url.searchParams.get('q') || '').trim();
  if (!q) {
    res.writeHead(301, { Location: `${base}/inmuebles` });
    return res.end();
  }
  res.writeHead(301, { Location: `${base}/inmuebles#q=${encodeURIComponent(q)}` });
  res.end();
};
