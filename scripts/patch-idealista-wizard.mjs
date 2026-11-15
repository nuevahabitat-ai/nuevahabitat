import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');
let n = 0;

if (!s.includes("idealista_id:         txt('w-idealista-id')")) {
  s = s.replace(
    "      propietario_email:    txt('w-prop-email'),\n      updated_at:",
    "      propietario_email:    txt('w-prop-email'),\n      idealista_id:         txt('w-idealista-id') || null,\n      updated_at:"
  );
  n++;
}

const selOld = "cartera_privada,created_at')";
const selNew = "cartera_privada,idealista_id,created_at')";
if (s.includes(selOld) && !s.includes('idealista_id,created_at')) {
  s = s.replace(selOld, selNew);
  n++;
}

const loadOld = "  document.getElementById('w-ref').value = p.ref || '';\n  document.getElementById('w-titulo').value = p.titulo || '';";
const loadNew = `  document.getElementById('w-ref').value = p.ref || '';
  const wIdealista = document.getElementById('w-idealista-id');
  if (wIdealista) wIdealista.value = p.idealista_id || '';
  document.getElementById('w-titulo').value = p.titulo || '';`;
if (s.includes(loadOld) && !s.includes('wIdealista')) {
  s = s.replace(loadOld, loadNew);
  n++;
}

if (!s.includes("'w-idealista-id'") && s.includes("'w-ref','w-titulo'")) {
  s = s.replace("'w-ref','w-titulo'", "'w-ref','w-idealista-id','w-titulo'");
  n++;
}

const upd =
  "      const { error } = await window.nhSupabase.from('inmuebles').update(payload).eq('id', editingPropertyId);\n      if(error) throw error;";
const updNew = `      let updPayload = payload;
      let { error } = await window.nhSupabase.from('inmuebles').update(updPayload).eq('id', editingPropertyId);
      if (error && /idealista_id/.test(error.message || '')) {
        const { idealista_id: _i, ...rest } = updPayload;
        ({ error } = await window.nhSupabase.from('inmuebles').update(rest).eq('id', editingPropertyId));
      }
      if(error) throw error;`;
if (s.includes(upd) && !s.includes('idealista_id: _i')) {
  s = s.replace(upd, updNew);
  n++;
}

const ins =
  "      const { data, error } = await window.nhSupabase.from('inmuebles').insert(payload).select().single();\n      if(error) throw error;";
const insNew = `      let insPayload = payload;
      let { data, error } = await window.nhSupabase.from('inmuebles').insert(insPayload).select().single();
      if (error && /idealista_id/.test(error.message || '')) {
        const { idealista_id: _i, ...rest } = insPayload;
        ({ data, error } = await window.nhSupabase.from('inmuebles').insert(rest).select().single());
      }
      if(error) throw error;`;
if (s.includes(ins) && !s.includes('insPayload')) {
  s = s.replace(ins, insNew);
  n++;
}

fs.writeFileSync(panel, s, 'utf8');
console.log('patch idealista wizard:', n, 'changes');
