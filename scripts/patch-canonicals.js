/** Unifica canonicals y og:url sin .html en páginas estáticas */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SITE = 'https://www.nuevahabitat.com';

fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .forEach((f) => {
    const file = path.join(ROOT, f);
    let c = fs.readFileSync(file, 'utf8');
    let changed = false;

    c = c.replace(
      /(<link rel="canonical"\s+href=")https:\/\/www\.nuevahabitat\.com\/([^"?#]+)\.html(")/gi,
      (_, pre, slug, post) => {
        changed = true;
        return pre + SITE + '/' + slug + post;
      }
    );

    c = c.replace(
      /(<meta property="og:url"\s+content=")https:\/\/www\.nuevahabitat\.com\/([^"?#]+)\.html(")/gi,
      (_, pre, slug, post) => {
        changed = true;
        return pre + SITE + '/' + slug + post;
      }
    );

    if (changed) {
      fs.writeFileSync(file, c);
      console.log('canonical', f);
    }
  });
