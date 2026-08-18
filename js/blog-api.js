/** Blog unificado: Supabase blog_posts + fallback estático NH_BLOG_POSTS */
window.nhBlog = {
  wordCount(html) {
    return (String(html || '').replace(/<[^>]+>/g, ' ').match(/\S+/g) || []).length;
  },

  preferRichStatic(slug, post) {
    const staticP = window.NH_BLOG_POSTS && window.NH_BLOG_POSTS[slug];
    if (!staticP || !staticP.body) return post;
    const staticWords = this.wordCount(staticP.body);
    const postWords = post ? this.wordCount(post.contenido || post.body) : 0;
    if (!post || staticWords > postWords + 100) return this.fromStatic(slug, staticP);
    return post;
  },

  slugify(t) {
    return String(t || 'articulo').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      .slice(0, 80) || 'articulo';
  },

  fromStatic(slug, p) {
    return {
      slug,
      titulo: p.title,
      categoria: p.cat,
      extracto: p.excerpt,
      contenido: p.body,
      imagen_url: p.image,
      publicado_en: null,
      _date: p.date,
      _readMin: p.readMin || 5,
      _static: true,
      keywords: p.keywords,
      metaDescription: p.metaDescription,
      seoTitle: p.seoTitle,
      faq: p.faq,
    };
  },

  formatDate(post) {
    if (post.publicado_en) {
      return new Date(post.publicado_en).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return post._date || '';
  },

  readMin(post) {
    if (post._readMin) return post._readMin;
    const text = (post.contenido || post.extracto || '').replace(/<[^>]+>/g, ' ');
    return Math.max(3, Math.round(text.split(/\s+/).length / 200));
  },

  async fetchPosts(limit) {
    if (window.nhSupabase) {
      let q = window.nhSupabase.from('blog_posts')
        .select('slug,titulo,categoria,extracto,contenido,imagen_url,publicado_en,created_at')
        .eq('publicado', true)
        .order('publicado_en', { ascending: false, nullsFirst: false });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (!error && data && data.length) {
        return data.map(p => this.preferRichStatic(p.slug, p));
      }
    }
    const staticPosts = Object.entries(window.NH_BLOG_POSTS || {}).map(([slug, p]) => this.fromStatic(slug, p));
    return limit ? staticPosts.slice(0, limit) : staticPosts;
  },

  async getPost(slug) {
    if (!slug) return null;
    if (window.nhSupabase) {
      const { data } = await window.nhSupabase.from('blog_posts')
        .select('*').eq('slug', slug).eq('publicado', true).maybeSingle();
      if (data) return this.preferRichStatic(slug, data);
    }
    const p = window.NH_BLOG_POSTS && window.NH_BLOG_POSTS[slug];
    return p ? this.fromStatic(slug, p) : null;
  },

  renderCard(post) {
    const slug = post.slug;
    const img = post.imagen_url || 'imagenes/interior1.jpg';
    const cat = post.categoria || 'Blog';
    const date = this.formatDate(post);
    const mins = this.readMin(post);
    const excerpt = post.extracto || '';
    const href = (window.nhBlogUrl ? nhBlogUrl(slug) : '/blog/' + encodeURIComponent(slug));
    return `<a href="${href}" class="blog-card fade-up visible" data-cat="${cat}" style="text-decoration:none;color:inherit">
      <div class="blog-card-img"><img src="${img}" alt="${post.titulo || ''}" loading="lazy" onerror="this.src='imagenes/interior1.jpg'"/></div>
      <div class="blog-card-body">
        <div class="blog-cat">${cat}</div>
        <h3>${post.titulo || ''}</h3>
        <p>${excerpt}</p>
        <div class="blog-meta"><span>${date}</span><span>${mins} min lectura</span></div>
      </div>
    </a>`;
  }
};
