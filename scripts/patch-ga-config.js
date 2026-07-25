const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const needle = '<script src="js/seo.js"></script>';
const insert = '<script src="js/ga-config.js"></script>\n<script src="js/seo.js"></script>';

fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .forEach((f) => {
    const file = path.join(ROOT, f);
    let c = fs.readFileSync(file, 'utf8');
    if (c.includes('js/seo.js') && !c.includes('ga-config.js')) {
      c = c.replace(needle, insert);
      fs.writeFileSync(file, c);
      console.log('patched', f);
    }
  });
