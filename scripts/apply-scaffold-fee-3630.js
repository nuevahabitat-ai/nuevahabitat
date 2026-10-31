/**
 * Sustituye copy 3.500 € + IVA en scripts scaffold/finish por fee-config (3.000 + IVA / 3.630).
 * node scripts/apply-scaffold-fee-3630.js
 */
const fs = require('fs');
const path = require('path');
const { NH_FEE_LABEL_ESCRITURA, NH_FEE_LABEL_COMPACT, NH_FEE_TOTAL_EUR } = require('./fee-config');

const ROOT = path.join(__dirname, '..');
const SCRIPTS = path.join(__dirname);

const FILES = fs.readdirSync(SCRIPTS).filter(
  (n) =>
    (n.startsWith('scaffold-') || n.startsWith('finish-csv') || n === 'economica-argumentos-batch2.js')
    && n.endsWith('.js')
    && n !== 'apply-scaffold-fee-3630.js'
);

const REPLACEMENTS = [
  [/3\.500 € \+ IVA/g, NH_FEE_LABEL_ESCRITURA],
  [/3\.500€ \+ IVA/g, NH_FEE_LABEL_COMPACT],
  [/3\.500&nbsp;€&nbsp;\+&nbsp;IVA/g, NH_FEE_LABEL_ESCRITURA.replace(/ /g, '\u00a0')],
  [/Math\.max\(com6 - 3500/g, `Math.max(com6 - ${NH_FEE_TOTAL_EUR}`],
  [/com6 - 3500/g, `com6 - ${NH_FEE_TOTAL_EUR}`],
  [/ahorro = Math\.max\(com6 - 3500/g, `ahorro = Math.max(com6 - ${NH_FEE_TOTAL_EUR}`],
  [/honorarios fijos de 3\.500€ \+ IVA/gi, `honorarios fijos de ${NH_FEE_LABEL_COMPACT}`],
  [/precio fijo 3500 euros/gi, 'precio fijo 3000 euros mas IVA 3630 escritura'],
];

let changed = 0;
for (const name of FILES) {
  const file = path.join(SCRIPTS, name);
  let text = fs.readFileSync(file, 'utf8');
  if (!/3\.500|3500 €|com6 - 3500/.test(text)) continue;
  const before = text;
  for (const [re, rep] of REPLACEMENTS) {
    text = text.replace(re, rep);
  }
  if (text !== before) {
    fs.writeFileSync(file, text, 'utf8');
    console.log('updated', name);
    changed++;
  }
}
console.log('Done.', changed, 'scaffold scripts');
