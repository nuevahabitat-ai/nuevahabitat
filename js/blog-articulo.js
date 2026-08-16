(function(){
  async function injectRelated(currentSlug, currentPost){
    const cat = currentPost.categoria || currentPost.cat || '';
    const all = await nhBlog.fetchPosts();
    const related = all.filter(p => p.slug !== currentSlug && (p.categoria || p.cat) === cat).slice(0, 3);
    if (!related.length) return;
    const href = slug => (window.nhBlogUrl ? nhBlogUrl(slug) : '/blog-articulo?slug=' + encodeURIComponent(slug));
    const html = `<section class="blog-related" style="margin-top:3rem;padding-top:2rem;border-top:1px solid #eee">
      <h2 style="font-family:var(--font-serif);font-size:1.35rem;margin-bottom:1.25rem">Artículos relacionados</h2>
      <ul style="list-style:none;padding:0;margin:0;display:grid;gap:.75rem">
        ${related.map(p => `<li><a href="${href(p.slug)}" style="color:var(--negro);text-decoration:none;font-weight:500">${p.titulo || p.title}</a> <span style="color:var(--gris-medio);font-size:.85rem">· ${nhBlog.readMin(p)} min</span></li>`).join('')}
      </ul>
    </section>`;
    document.getElementById('postBody').insertAdjacentHTML('beforeend', html);
  }

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
      document.getElementById('postBody').innerHTML = '<p>Este artículo no existe o ha sido movido. <a href="/blog">Vuelve al blog</a>.</p>';
      return;
    }
    document.title = (post.titulo || post.title) + ' · NuevaHabitat';
    document.getElementById('postImg').src = post.imagen_url || post.image || 'imagenes/interior1.jpg';
    document.getElementById('postCat').textContent = post.categoria || post.cat || 'Blog';
    document.getElementById('postTitle').textContent = post.titulo || post.title || '';
    document.getElementById('postDate').textContent = nhBlog.formatDate(post);
    document.getElementById('postRead').textContent = nhBlog.readMin(post) + ' min lectura';
    document.getElementById('postBody').innerHTML = post.contenido || post.body || ('<p>' + (post.extracto || '') + '</p>');
    await injectRelated(slug, post);
    if (window.nhSeo) {
      const kw = window.NH_BLOG_SEO ? NH_BLOG_SEO.keywordsForPost(post, slug) : [];
      if (window.NH_BLOG_SEO) NH_BLOG_SEO.applyArticleMeta(post, slug);
      nhSeo.injectJsonLd([
        nhSeo.orgSchema(),
        window.NH_BLOG_SEO ? NH_BLOG_SEO.enhancedArticleSchema(post, slug, kw) : nhSeo.articleSchema(post, slug),
        nhSeo.breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.titulo || post.title || 'Artículo', url: (window.nhBlogUrl ? nhBlogUrl(slug) : '/blog-articulo?slug=' + encodeURIComponent(slug)) },
        ]),
        ...(post.faq && post.faq.length && window.NH_BLOG_SEO ? [NH_BLOG_SEO.faqSchema(post.faq, slug)] : []),
      ]);
    }
  }
  loadPost();
})();
