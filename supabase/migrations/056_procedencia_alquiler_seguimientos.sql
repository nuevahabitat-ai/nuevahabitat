-- Procedencia comercial (Livendia, Gestor Hogar…) + seguimientos expedientes alquiler

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS procedencia text;

ALTER TABLE propietarios_alquiler
  ADD COLUMN IF NOT EXISTS procedencia text,
  ADD COLUMN IF NOT EXISTS ultimo_contacto_at timestamptz;

COMMENT ON COLUMN leads.procedencia IS 'Colaborador/plataforma: livendia, gestor_hogar, nuevahabitat, referido, otro';
COMMENT ON COLUMN propietarios_alquiler.procedencia IS 'Colaborador/plataforma de captación del expediente';

CREATE TABLE IF NOT EXISTS propietarios_alquiler_seguimientos (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  propietario_id  uuid NOT NULL REFERENCES propietarios_alquiler(id) ON DELETE CASCADE,
  comentario      text NOT NULL,
  created_at      timestamptz DEFAULT now()
);

COMMENT ON TABLE propietarios_alquiler_seguimientos IS 'Historial de contactos por expediente alquiler (admin / integral)';

CREATE INDEX IF NOT EXISTS prop_alq_seg_prop_idx
  ON propietarios_alquiler_seguimientos (propietario_id, created_at DESC);

ALTER TABLE propietarios_alquiler_seguimientos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS prop_alq_seg_admin_rw ON propietarios_alquiler_seguimientos;
CREATE POLICY prop_alq_seg_admin_rw ON propietarios_alquiler_seguimientos
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

NOTIFY pgrst, 'reload schema';
