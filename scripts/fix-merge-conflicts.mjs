import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function fixPanel() {
  const p = path.join(root, 'admin-panel.html');
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(
    /<<<<<<< HEAD\r?\n<script src="js\/idealista-import-chunks\.js"><\/script>\r?\n=======\r?\n>>>>>>> origin\/main\r?\n/g,
    '<script src="js/idealista-import-chunks.js"></script>\n'
  );
  s = s.replace(
    /\s*<p class="text-muted" style="font-size:\.75rem;margin:0 0 \.75rem"><a href="\/admin-import-idealista"[^]*?<\/a><\/p>\r?\n/,
    ''
  );
  fs.writeFileSync(p, s, 'utf8');
}

function fixPageJs() {
  const p = path.join(root, 'js', 'admin-import-idealista-page.js');
  if (!fs.readFileSync(p, 'utf8').includes('<<<<<<<')) return;
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(
    /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> origin\/main\r?\n/,
    '$1'
  );
  fs.writeFileSync(p, s, 'utf8');
}

fixPanel();
fixPageJs();
console.log('conflicts fixed');
