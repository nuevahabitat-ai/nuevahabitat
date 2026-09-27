const STORY_IMAGES = [
  'imagenes/interior11.jpg',
  'imagenes/interior12.jpg',
  'imagenes/interior13.jpg',
  'imagenes/interior14.jpg',
  'imagenes/interior15.jpg',
  'imagenes/comercial1.jpg',
  'imagenes/comercial2.jpg',
  'imagenes/comercial4.jpg',
  'imagenes/equipo1.jpg',
  'imagenes/equipo2.jpg',
  'imagenes/contrato1.jpg',
  'imagenes/firma1.jpg',
  'imagenes/agente inmobiliario2.jpg',
  'imagenes/barcelona2.jpg',
  'imagenes/familia10.jpg',
];

function hashSlug(slug) {
  let h = 0;
  const s = String(slug || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function heroImage(L) {
  return (L.hero && L.hero.image) || L.heroImage || 'imagenes/interior11.jpg';
}

function imagePool(L) {
  const hero = heroImage(L);
  const rest = STORY_IMAGES.filter((p) => p !== hero);
  const start = hashSlug(L.slug) % rest.length;
  return [hero, ...rest.slice(start), ...rest.slice(0, start)];
}

function stripTag(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function splitSections(html) {
  const raw = String(html || '').trim();
  if (!raw) return [];
  const parts = raw.split(/(?=<h2[\s>])/i).filter((p) => p.trim());
  if (!parts.length) return [{ type: 'intro', html: raw }];
  const sections = [];
  if (!/^<h2/i.test(parts[0])) {
    sections.push({ type: 'intro', html: parts[0] });
    parts.shift();
  }
  parts.forEach((chunk) => {
    const m = chunk.match(/^<h2([^>]*)>([\s\S]*?)<\/h2>/i);
    if (m) {
      sections.push({
        type: 'section',
        h2attrs: m[1] || '',
        title: m[2],
        body: chunk.slice(m[0].length),
      });
    } else {
      sections.push({ type: 'section', h2attrs: '', title: '', body: chunk });
    }
  });
  return sections;
}

function dedupeHtmlSections(html) {
  const sections = splitSections(html);
  const seen = new Set();
  const out = [];
  sections.forEach((sec) => {
    if (sec.type === 'intro') {
      out.push(sec);
      return;
    }
    const key = stripTag(sec.title).toLowerCase().replace(/\s+/g, ' ').trim();
    if (key && seen.has(key)) return;
    if (key) seen.add(key);
    out.push(sec);
  });
  return out;
}

function sectionsToHtml(sections) {
  return sections
    .map((sec) => {
      if (sec.type === 'intro') return sec.html;
      const titleHtml = sec.title ? `<h2${sec.h2attrs}>${sec.title}</h2>` : '';
      return titleHtml + sec.body;
    })
    .join('');
}

/** Texto legible — sin fotos de stock (el panel va en nhPanelDemoBlock) */
function argumentoProseMarkup(L, html, opts = {}) {
  const sections = dedupeHtmlSections(html);
  let body = sectionsToHtml(sections);
  if (opts.suffix) body += opts.suffix;
  return `<section class="lc-article">
  <div class="container">
    <div class="lc-article__inner lc-prose fade-up">${body}</div>
  </div>
</section>`;
}

function argumentoStoryMarkup(L, html, opts = {}) {
  html = sectionsToHtml(dedupeHtmlSections(html));
  const pool = imagePool(L);
  let imgIdx = 1;
  const sections = splitSections(html);
  const suffix = opts.suffix || '';
  let out = '';
  let sectionNum = 0;

  sections.forEach((sec) => {
    if (sec.type === 'intro') {
      out += `<div class="lc-story-intro">
        <div class="container">
          <div class="lc-story-intro__grid fade-up">
            <div class="lc-story-intro__copy lc-prose">${sec.html}</div>
            <div class="lc-story-intro__media"><img src="${pool[0]}" alt="Vender o comprar en Barcelona con NuevaHabitat" loading="lazy"/></div>
          </div>
        </div>
      </div>`;
      return;
    }
    const reverse = sectionNum % 2 === 1;
    sectionNum += 1;
    const img = pool[imgIdx % pool.length];
    imgIdx += 1;
    const titleHtml = sec.title ? `<h2${sec.h2attrs}>${sec.title}</h2>` : '';
    out += `<div class="lc-story-split${reverse ? ' lc-story-split--reverse' : ''}">
      <div class="lc-story-split__media"><img src="${img}" alt="${stripTag(sec.title).slice(0, 80) || 'Barcelona'}" loading="lazy"/></div>
      <div class="lc-story-split__content">
        <div class="lc-story-split__inner lc-prose fade-up">${titleHtml}${sec.body}</div>
      </div>
    </div>`;
    if (sectionNum === 3 || sectionNum === 7) {
      const band = pool[imgIdx % pool.length];
      imgIdx += 1;
      out += `<div class="lc-story-band" style="background-image:url('${band}')"><div class="lc-story-band__overlay"><div class="container"><p class="lc-story-band__text">Precio fijo · compradores filtrados · gestor Daniel o Sebastián en Les Corts</p></div></div></div>`;
    }
  });

  if (suffix) {
    out += `<div class="lc-story-suffix"><div class="container"><div class="lc-prose fade-up">${suffix}</div></div></div>`;
  }
  return out;
}

function storyLayoutStyles() {
  return `
    .lc-article{padding:3.5rem 0 4rem;background:var(--crema)}
    .lc-article__inner{max-width:720px;margin:0 auto}
    .lc-article__inner h2{font-family:var(--font-serif);font-size:1.45rem;margin:2.25rem 0 .85rem;padding-left:1rem;border-left:4px solid var(--oro);line-height:1.3}
    .lc-article__inner h2:first-child{margin-top:0}
    .lc-article__inner p,.lc-article__inner li{font-size:1.0625rem;line-height:1.8;color:var(--gris-texto)}
    .lc-article__inner > p:first-of-type{font-size:1.125rem;color:var(--negro)}
    .lc-story{background:var(--crema)}
    .lc-story-intro{padding:4rem 0 3rem;background:linear-gradient(180deg,var(--blanco) 0%,var(--crema) 100%)}
    .lc-story-intro__grid{display:grid;grid-template-columns:1.05fr .95fr;gap:3rem;align-items:center}
    .lc-story-intro__copy{max-width:none}
    .lc-story-intro__copy p:first-child{font-size:1.125rem;line-height:1.85}
    .lc-story-intro__media{border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-lg);min-height:320px}
    .lc-story-intro__media img{width:100%;height:100%;object-fit:cover;min-height:320px}
    .lc-story-split{display:grid;grid-template-columns:1fr 1fr;min-height:min(520px,auto);background:var(--crema)}
    .lc-story-split:nth-child(even){background:var(--blanco)}
    .lc-story-split__media{min-height:280px;overflow:hidden}
    .lc-story-split__media img{width:100%;height:100%;object-fit:cover;min-height:280px}
    .lc-story-split__content{display:flex;align-items:center;padding:3rem 0}
    .lc-story-split__inner{max-width:540px;margin:0 auto;padding:0 2rem}
    .lc-story-split--reverse .lc-story-split__media{order:2}
    .lc-story-split--reverse .lc-story-split__content{order:1}
    .lc-story-band{min-height:38vh;background-size:cover;background-position:center;position:relative}
    .lc-story-band__overlay{position:absolute;inset:0;background:linear-gradient(to right,rgba(13,13,13,.82),rgba(13,13,13,.45));display:flex;align-items:center}
    .lc-story-band__text{font-family:var(--font-serif);font-size:clamp(1.35rem,3vw,2rem);color:#fff;max-width:640px;line-height:1.35;margin:0}
    .lc-story-suffix{padding:3rem 0 4rem;background:var(--crema)}
    .lc-story-suffix .lc-prose{max-width:var(--max-w);margin:0 auto}
    .lc-form-band{padding:4rem 0;background:var(--blanco)}
    .lc-form-band__grid{display:grid;grid-template-columns:1fr minmax(300px,420px);gap:3rem;align-items:start}
    .lc-form-band__copy .section-title{margin-bottom:1rem}
    .lc-form-band__aside{display:flex;flex-direction:column;gap:1.25rem}
    .lc-form-band__figure{margin:0;border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-md);background:var(--crema)}
    .lc-form-band__figure img{width:100%;height:auto;max-height:300px;object-fit:cover;display:block}
    .lc-form-band__copy-inner .section-title{margin-bottom:.75rem}
    .lc-form-band__aside .lc-buyer-grid{margin-top:1.25rem;gap:1.5rem}
    .lc-form-band__aside .lc-buyer-grid h3{font-size:1.05rem;margin-bottom:.35rem}
    .lc-form-band__aside .lc-buyer-grid p{font-size:.9375rem;margin:0}
    @media(min-width:901px){.lc-form-band .lc-form{position:sticky;top:96px}.lc-form-band__grid{grid-template-columns:1.15fr minmax(300px,420px)}}
    @media(max-width:900px){
      .lc-story-intro__grid,.lc-story-split{grid-template-columns:1fr}
      .lc-story-split--reverse .lc-story-split__media{order:0}
      .lc-story-split__content{padding:2rem 0}
      .lc-story-split__inner{padding:0 1.25rem}
      .lc-form-band__grid{grid-template-columns:1fr}
    }
  `;
}

module.exports = {
  argumentoStoryMarkup,
  argumentoProseMarkup,
  dedupeHtmlSections,
  storyLayoutStyles,
  imagePool,
};
