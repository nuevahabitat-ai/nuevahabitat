/** 301: inmuebles.html?q= o inmuebles?q= → /inmuebles#q= (filtro en hash, URL canónica) */
module.exports = (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.nuevahabitat.com';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = `${proto}://${host}`.replace('://nuevahabitat.com', '://www.nuevahabitat.com');
  const url = new URL(req.url || '/', base);
  const q = (url.searchParams.get('target') || url.searchParams.get('q') || '').trim();
  if (!q) {
    res.writeHead(301, { Location: `${base}/inmuebles` });
    return res.end();
  }
  res.writeHead(301, { Location: `${base}/inmuebles#q=${encodeURIComponent(q)}` });
  res.end();
};
