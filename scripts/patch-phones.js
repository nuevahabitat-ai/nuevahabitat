/** Parche masivo: añade 643 877 644 junto a 603 656 587 */
const fs = require('fs');
const path = require('path');
const { displayBoth, telLinksInline, footerPhonesLi, schemaTelephones } = require('./phone-config');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['google0f5ccb93c68fedca.html']);

function patch(content) {
  let c = content;

  const phonesDisplay = displayBoth();
  const navTels = `<span class="nav-tels">${telLinksInline('nav-tel', 'header')}</span>`;
  const mobilePhones = `<span class="mobile-nav-phones">${telLinksInline('', 'mobile-menu')}</span>`;
  const footerPhones = footerPhonesLi();

  // Nav header — varias formas
  c = c.replace(
    /<a href="tel:\+34603656587" class="nav-tel nh-call-link" data-nh-call="header">603 656 587<\/a>/g,
    navTels
  );
  c = c.replace(
    /<a href="tel:\+34603656587" class="nav-tel">603 656 587<\/a>/g,
    navTels
  );

  // Mobile nav
  c = c.replace(
    /<a href="tel:\+34603656587" class="nh-call-link" data-nh-call="mobile-menu">603 656 587<\/a>/g,
    mobilePhones
  );

  // Botones hero / outline
  c = c.replace(
    /<a href="tel:\+34603656587" class="btn btn-outline-light btn-lg">603 656 587<\/a>/g,
    `<a href="tel:+34603656587" class="btn btn-outline-light btn-lg">${phonesDisplay}</a>`
  );

  c = c.replace(
    /Llama · 603 656 587 · 643 877 644/g,
    `Llama · ${phonesDisplay}`
  );

  c = c.replace(
    /<a href="tel:\+34603656587" class="btn btn-gold btn-lg nh-call-link" data-nh-call="(hero|prefaq)">Llama · 603 656 587 · 643 877 644<\/a>/g,
    `<a href="tel:+34603656587" class="btn btn-gold btn-lg nh-call-link" data-nh-call="$1">Llama · ${phonesDisplay}</a>`
  );

  c = c.replace(
    /<a href="tel:\+34603656587" class="btn btn-gold btn-lg">603 656 587[^<]*<\/a>/g,
    (m) => m.replace('603 656 587', phonesDisplay).replace('603 656 587 · 643 877 644', phonesDisplay)
  );

  // Footer contacto
  c = c.replace(
    /<li><a href="tel:\+34603656587">603 656 587(?: · Nuevahabitat general)?<\/a><\/li>/g,
    `<li>${footerPhones}</li>`
  );

  // Aside CTA landings
  c = c.replace(
    /<a href="tel:\+34603656587" class="btn btn-outline" style="width:100%;justify-content:center">603 656 587<\/a>/g,
    `<a href="tel:+34603656587" class="btn btn-outline" style="width:100%;justify-content:center">${phonesDisplay}</a>`
  );

  // JSON-LD telephone
  c = c.replace(
    /"telephone": "\+34603656587"/g,
    `"telephone": ${JSON.stringify(schemaTelephones())}`
  );

  // Textos sueltos
  c = c.replace(/603 656 587 · 643 877 644/g, phonesDisplay);
  c = c.replace(/Llámanos al 603 656 587 · 643 877 644/g, `Llámanos al ${phonesDisplay}`);

  // api/notify y similares en html embebido
  c = c.replace(
    /<a href="tel:\+34603656587">603 656 587<\/a>/g,
    footerPhones
  );

  return c;
}

let n = 0;
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    const st = fs.statSync(fp);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(fp);
      continue;
    }
    if (!name.endsWith('.html') && !name.endsWith('.js')) continue;
    if (SKIP.has(name)) continue;
    const rel = path.relative(ROOT, fp);
    if (rel.startsWith('scripts' + path.sep) && !rel.includes('patch-phones')) continue;
    const before = fs.readFileSync(fp, 'utf8');
    const after = patch(before);
    if (after !== before) {
      fs.writeFileSync(fp, after);
      console.log('patched', rel);
      n++;
    }
  }
}

walk(ROOT);
console.log(`Done: ${n} files`);
