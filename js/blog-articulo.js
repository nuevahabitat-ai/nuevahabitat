(function(){
  async function loadPost(){
    const params = new URLSearchParams(location.search);
    const slug = params.get('slug') || '';
    if(!window.nhBlog){
      document.getElementById('postTitle').textContent = 'Error al cargar';
      return;
    }
    if(!window.nhSupabase) await new Promise(r => document.addEventListener('supabase:ready', r, {once:true}));
    const post = await nhBlog.getPost(slug);
    if(!post){
      document.getElementById('postTitle').textContent = 'Artículo no encontrado';
      document.getElementById('postBody').innerHTML = '<p>Este artículo no existe o ha sido movido. <a href="blog.html">Vuelve al blog</a>.</p>';
      return;
    }
    document.title = (post.titulo || post.title) + ' · NuevaHabitat';
    document.getElementById('postImg').src = post.imagen_url || post.image || 'imagenes/interior1.jpg';
    document.getElementById('postCat').textContent = post.categoria || post.cat || 'Blog';
    document.getElementById('postTitle').textContent = post.titulo || post.title || '';
    document.getElementById('postDate').textContent = nhBlog.formatDate(post);
    document.getElementById('postRead').textContent = nhBlog.readMin(post) + ' min lectura';
    document.getElementById('postBody').innerHTML = post.contenido || post.body || ('<p>' + (post.extracto || '') + '</p>');
    if (window.nhSeo) {
      const kw = window.NH_BLOG_SEO ? NH_BLOG_SEO.keywordsForPost(post, slug) : [];
      if (window.NH_BLOG_SEO) NH_BLOG_SEO.applyArticleMeta(post, slug);
      nhSeo.injectJsonLd([
        nhSeo.orgSchema(),
        window.NH_BLOG_SEO ? NH_BLOG_SEO.enhancedArticleSchema(post, slug, kw) : nhSeo.articleSchema(post, slug),
        nhSeo.breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Blog', url: 'blog.html' },
          { name: post.titulo || post.title || 'Artículo', url: 'blog-articulo.html?slug=' + encodeURIComponent(slug) },
        ]),
      ]);
    }
  }
  loadPost();
})();
