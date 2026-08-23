/**
 * Migra artículos de js/blog-posts.js (+ blog-posts-rich.js) a Supabase blog_posts.
 * Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-blog-supabase.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function loadStaticPosts() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'blog-posts.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'blog-posts-rich.js'), 'utf8'), sandbox);
  return sandbox.window.NH_BLOG_POSTS || {};
}

function parseDate(dateStr) {
  if (!dateStr) return new Date().toISOString();
  const months = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
  const m = String(dateStr).match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/i);
  if (!m) return new Date().toISOString();
  const mon = months[m[2].toLowerCase().slice(0, 3)];
  if (mon == null) return new Date().toISOString();
  return new Date(Number(m[3]), mon, Number(m[1])).toISOString();
}

function catNorm(cat) {
  const c = String(cat || 'blog').toLowerCase();
  const map = { mercado: 'mercado', jurídico: 'juridico', juridico: 'juridico', hipotecas: 'hipotecas', comprar: 'comprar', vender: 'vender' };
  return map[c] || c.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function upsertPost(slug, p) {
  const row = {
    slug,
    titulo: p.title || slug,
    extracto: p.excerpt || '',
    contenido: p.body || '',
    imagen_url: p.image || null,
    categoria: catNorm(p.cat),
    publicado: true,
    publicado_en: parseDate(p.date),
    tags: p.keywords ? String(p.keywords).split(',').map((t) => t.trim()).filter(Boolean) : null,
  };
  const res = await fetch(`${SB_URL}/rest/v1/blog_posts?on_conflict=slug`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${slug}: ${res.status} ${txt}`);
  }
}

async function main() {
  if (!SB_URL || !SB_KEY) {
    console.error('Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const posts = loadStaticPosts();
  const slugs = Object.keys(posts);
  console.log(`Migrando ${slugs.length} artículos a Supabase…`);
  for (const slug of slugs) {
    await upsertPost(slug, posts[slug]);
    console.log('  ✓', slug);
  }
  console.log('Listo.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
