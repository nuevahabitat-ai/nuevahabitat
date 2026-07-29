/** URLs canónicas del blog (sin .html) */
(function () {
  const BASE = '/blog-articulo';

  function blogArticleUrl(slug) {
    if (!slug) return '/blog';
    return `${BASE}?slug=${encodeURIComponent(slug)}`;
  }

  function blogArticleAbs(slug) {
    return 'https://www.nuevahabitat.com' + blogArticleUrl(slug);
  }

  window.nhBlogUrl = blogArticleUrl;
  window.nhBlogAbs = blogArticleAbs;
})();
