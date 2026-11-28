/**
 * Tests locales: nombre obligatorio, agregación presupuesto, extracción IDs.
 */
import assert from 'node:assert/strict';
import XLSX from 'xlsx';
import { aggregatePresupuestoFromPrecios } from '../lib/server/comprador-infer-criterios.js';
import { extractIdealistaIdsFromText, idealistaIdsOnInmueble } from '../lib/server/idealista-id.js';

assert.deepEqual(aggregatePresupuestoFromPrecios([270000]), {
  presupuesto_max: 270000,
  presupuesto_min: 220000,
});

assert.deepEqual(aggregatePresupuestoFromPrecios([140000, 270000]), {
  presupuesto_max: 270000,
  presupuesto_min: 140000,
});

assert.deepEqual(extractIdealistaIdsFromText('113139927', 'Idealista 112923386 en texto'), [
  '113139927',
  '112923386',
]);

assert.deepEqual(idealistaIdsOnInmueble({ idealista_id: '111', idealista_id_2: '222' }), ['111', '222']);

const xls = process.argv[2];
if (xls) {
  const wb = XLSX.readFile(xls);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
  const conTel = rows.filter((r) => String(r.TELÉFONO || '').replace(/\D/g, '').slice(-9).length === 9);
  const conNombre = conTel.filter((r) => String(r.USUARIO || '').trim());
  console.log(`Excel: ${rows.length} filas, ${conTel.length} con teléfono, ${conNombre.length} importables, ${conTel.length - conNombre.length} sin nombre`);
}

console.log('test-idealista-import-rules: ok');