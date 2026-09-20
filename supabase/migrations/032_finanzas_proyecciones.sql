-- ============================================================
-- NuevaHabitat · Migración 032
-- Finanzas · Proyecciones manuales (Previsión)
-- Ejecutar en Supabase → SQL Editor (después de 030)
-- ============================================================

CREATE TABLE IF NOT EXISTS finanzas_proyecciones (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  concepto        text NOT NULL,
  importe         numeric(12, 2) NOT NULL CHECK (importe > 0),
  fecha_prevista  date NOT NULL,
  notas           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS finanzas_proyecciones_fecha_idx ON finanzas_proyecciones (fecha_prevista DESC);

DROP TRIGGER IF EXISTS finanzas_proyecciones_updated_at ON finanzas_proyecciones;
CREATE TRIGGER finanzas_proyecciones_updated_at
  BEFORE UPDATE ON finanzas_proyecciones
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE finanzas_proyecciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "finanzas_proyecciones_admin_rw" ON finanzas_proyecciones;
CREATE POLICY "finanzas_proyecciones_admin_rw" ON finanzas_proyecciones
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

COMMENT ON TABLE finanzas_proyecciones IS 'Proyecciones de ingreso manual — panel Finanzas > Previsión';
