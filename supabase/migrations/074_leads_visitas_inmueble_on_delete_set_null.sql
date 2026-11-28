-- Permite borrar inmuebles: desvincula leads/visitas en lugar de bloquear (FK restrict).
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_inmueble_id_fkey;
ALTER TABLE leads
  ADD CONSTRAINT leads_inmueble_id_fkey
  FOREIGN KEY (inmueble_id) REFERENCES inmuebles(id) ON DELETE SET NULL;

ALTER TABLE visitas DROP CONSTRAINT IF EXISTS visitas_inmueble_id_fkey;
ALTER TABLE visitas
  ADD CONSTRAINT visitas_inmueble_id_fkey
  FOREIGN KEY (inmueble_id) REFERENCES inmuebles(id) ON DELETE SET NULL;

NOTIFY pgrst, 'reload schema';