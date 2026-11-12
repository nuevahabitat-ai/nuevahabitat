/**
 * Opcional: añade script al panel por ancla (evita editar HTML a mano).
 * Por defecto el import Idealista ya carga admin-wizard-idealista-colocacion.js.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');
const tag = '<script src="js/admin-wizard-idealista-colocacion.js"></script>';
if (s.includes(tag)) {
  console.log('Panel ya incluye colocación Idealista wizard.');
  process.exit(0);
}
const anchor = '<script src="js/admin-idealista-compradores-import.js"></script>';
if (!s.includes(anchor)) {
  console.error('No se encontró ancla', anchor);
  process.exit(1);
}
s = s.replace(anchor, anchor + '\n' + tag);
fs.writeFileSync(panel, s, 'utf8');
console.log('Añadido', tag);
