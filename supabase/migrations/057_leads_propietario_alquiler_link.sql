-- Vincular lead manual de alquiler con expediente propietarios_alquiler
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS propietario_alquiler_id uuid REFERENCES propietarios_alquiler(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS leads_propietario_alquiler_idx
  ON leads (propietario_alquiler_id);

NOTIFY pgrst, 'reload schema';
