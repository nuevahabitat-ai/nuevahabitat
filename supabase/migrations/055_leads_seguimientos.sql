-- Leads: historial de seguimiento (como particulares_seguimientos)
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS ultimo_contacto_at timestamptz;

CREATE TABLE IF NOT EXISTS leads_seguimientos (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id    uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  comentario text NOT NULL,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE leads_seguimientos IS 'Historial de contactos y notas por lead (panel admin)';

CREATE INDEX IF NOT EXISTS leads_seguimientos_lead_idx
  ON leads_seguimientos (lead_id, created_at DESC);

ALTER TABLE leads_seguimientos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads_seguimientos_admin_rw" ON leads_seguimientos;
CREATE POLICY "leads_seguimientos_admin_rw" ON leads_seguimientos
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS "leads_admin_insert" ON leads;
CREATE POLICY "leads_admin_insert" ON leads
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_agente());

NOTIFY pgrst, 'reload schema';
