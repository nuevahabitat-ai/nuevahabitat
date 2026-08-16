/** URLs canónicas del blog — /blog/slug */
(function () {
  function blogArticleUrl(slug) {
    if (!slug) return '/blog';
    return `/blog/${encodeURIComponent(slug)}`;
  }

  function blogArticleAbs(slug) {
    return 'https://www.nuevahabitat.com' + blogArticleUrl(slug);
  }

  function parseBlogSlugFromPath() {
    const path = (location.pathname || '').replace(/\/$/, '');
    const m = path.match(/^\/blog\/([^/?#]+)$/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  window.nhBlogUrl = blogArticleUrl;
  window.nhBlogAbs = blogArticleAbs;
  window.nhBlogSlugFromPath = parseBlogSlugFromPath;
})();
