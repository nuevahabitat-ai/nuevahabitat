const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    if (fs.statSync(fp).isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(fp);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    let c = fs.readFileSync(fp, 'utf8');
    const o = c;
    c = c.replace(/643 877 644<\/a> · <a href="tel:\+34643877644">643 877 644<\/a>/g, '643 877 644</a>');
    c = c.replace(/603 656 587 · 643 877 644 · Nuevahabitat general/g, '603 656 587 · 643 877 644');
    c = c.replace(
      /<a href="tel:\+34603656587">603 656 587 · 643 877 644<\/a>/g,
      '<a href="tel:+34603656587">603 656 587</a> · <a href="tel:+34643877644">643 877 644</a>'
    );
    if (c !== o) {
      fs.writeFileSync(fp, c);
      console.log('fixed', path.relative(ROOT, fp));
    }
  }
}
walk(ROOT);
