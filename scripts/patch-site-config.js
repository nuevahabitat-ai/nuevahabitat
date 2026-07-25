const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['panel.html', 'admin-panel.html']);
const CONTACT = 'info@nuevahabitat.com';
const ADMIN = 'admin.nuevahabitat@gmail.com';

fs.readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .forEach((f) => {
    const file = path.join(ROOT, f);
    let c = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (!SKIP.has(f) && c.includes(ADMIN)) {
      c = c.replace(new RegExp(ADMIN.replace(/\./g, '\\.'), 'g'), CONTACT);
      changed = true;
    }

    if (c.includes('js/ga-config.js') && !c.includes('js/site-config.js')) {
      c = c.replace(
        '<script src="js/ga-config.js"></script>',
        '<script src="js/site-config.js"></script>\n<script src="js/ga-config.js"></script>'
      );
      changed = true;
    } else if (c.includes('js/seo.js') && !c.includes('js/site-config.js') && !c.includes('js/ga-config.js')) {
      c = c.replace(
        '<script src="js/seo.js"></script>',
        '<script src="js/site-config.js"></script>\n<script src="js/ga-config.js"></script>\n<script src="js/seo.js"></script>'
      );
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, c);
      console.log('patched', f);
    }
  });
