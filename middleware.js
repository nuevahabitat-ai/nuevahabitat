/** SEO: URLs canónicas sin query duplicada ni bucles (GSC «Página con redirección») */
export default function middleware(request) {
  const url = new URL(request.url);

  if (
    (url.pathname === '/inmuebles' || url.pathname === '/inmuebles.html') &&
    url.searchParams.has('q')
  ) {
    const q = url.searchParams.get('q');
    if (q) {
      return Response.redirect(`${url.origin}/inmuebles#q=${encodeURIComponent(q)}`, 301);
    }
  }

  const isBlogArticulo = url.pathname === '/blog-articulo' || url.pathname === '/blog-articulo.html';
  if (isBlogArticulo && url.searchParams.has('slug')) {
    const slug = url.searchParams.get('slug')?.trim();
    if (slug) {
      return Response.redirect(`${url.origin}/blog/${encodeURIComponent(slug)}`, 301);
    }
  }

  const blogMatch = url.pathname.match(/^\/blog\/([^/]+)$/);
  if (blogMatch && url.searchParams.has('slug')) {
    const pathSlug = decodeURIComponent(blogMatch[1]);
    const querySlug = url.searchParams.get('slug')?.trim();
    if (querySlug && querySlug === pathSlug) {
      return Response.redirect(`${url.origin}/blog/${encodeURIComponent(pathSlug)}`, 301);
    }
  }

  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}

export const config = {
  matcher: ['/inmuebles', '/inmuebles.html', '/blog-articulo', '/blog-articulo.html', '/blog/:slug*'],
};
