-- Nueva Hábitat Patrimonial · empresas en seguimiento (panel admin)

CREATE TABLE IF NOT EXISTS patrimonial_empresas (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa             text NOT NULL,
  contacto_nombre     text,
  telefono            text,
  email               text,
  num_activos         text,
  tipos_activo        text,
  zona                text,
  objetivo            text,
  procedencia         text DEFAULT 'manual' CHECK (procedencia IN ('manual', 'web_patrimonial', 'referido', 'evento', 'otro')),
  estado              text DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'reunion', 'propuesta', 'cliente', 'descartado')),
  notas               text,
  ultimo_contacto_at  timestamptz,
  proxima_alarma_at   timestamptz,
  activo              boolean DEFAULT true,
  lead_id             uuid REFERENCES leads(id) ON DELETE SET NULL,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patrimonial_empresas_seguimientos (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id  uuid NOT NULL REFERENCES patrimonial_empresas(id) ON DELETE CASCADE,
  comentario  text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

COMMENT ON TABLE patrimonial_empresas IS 'CRM Patrimonial: empresas, patrimoniales e inversores en seguimiento comercial';
COMMENT ON TABLE patrimonial_empresas_seguimientos IS 'Historial de contactos por empresa patrimonial';

CREATE INDEX IF NOT EXISTS patrimonial_empresas_estado_idx ON patrimonial_empresas (estado);
CREATE INDEX IF NOT EXISTS patrimonial_empresas_alarma_idx ON patrimonial_empresas (proxima_alarma_at);
CREATE INDEX IF NOT EXISTS patrimonial_empresas_created_idx ON patrimonial_empresas (created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS patrimonial_empresas_lead_id_unique
  ON patrimonial_empresas (lead_id)
  WHERE lead_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS pat_emp_seg_empresa_idx ON patrimonial_empresas_seguimientos (empresa_id, created_at DESC);

ALTER TABLE patrimonial_empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE patrimonial_empresas_seguimientos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS patrimonial_empresas_admin_rw ON patrimonial_empresas;
CREATE POLICY patrimonial_empresas_admin_rw ON patrimonial_empresas
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS pat_emp_seg_admin_rw ON patrimonial_empresas_seguimientos;
CREATE POLICY pat_emp_seg_admin_rw ON patrimonial_empresas_seguimientos
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP TRIGGER IF EXISTS patrimonial_empresas_updated_at ON patrimonial_empresas;
CREATE TRIGGER patrimonial_empresas_updated_at
  BEFORE UPDATE ON patrimonial_empresas
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

NOTIFY pgrst, 'reload schema';
