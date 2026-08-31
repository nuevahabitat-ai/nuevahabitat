-- ============================================================
-- NuevaHabitat · Migración 030
-- Finanzas: gastos e ingresos manuales (panel admin)
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS finanzas_movimientos (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo        text NOT NULL CHECK (tipo IN ('gasto', 'ingreso')),
  concepto    text NOT NULL,
  importe     numeric(12, 2) NOT NULL CHECK (importe > 0),
  fecha       date NOT NULL,
  categoria   text,
  notas       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS finanzas_movimientos_fecha_idx ON finanzas_movimientos (fecha DESC);
CREATE INDEX IF NOT EXISTS finanzas_movimientos_tipo_idx  ON finanzas_movimientos (tipo);
CREATE INDEX IF NOT EXISTS finanzas_movimientos_mes_idx   ON finanzas_movimientos (date_trunc('month', fecha::timestamp));

DROP TRIGGER IF EXISTS finanzas_movimientos_updated_at ON finanzas_movimientos;
CREATE TRIGGER finanzas_movimientos_updated_at
  BEFORE UPDATE ON finanzas_movimientos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE finanzas_movimientos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "finanzas_admin_rw" ON finanzas_movimientos;
CREATE POLICY "finanzas_admin_rw" ON finanzas_movimientos
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

COMMENT ON TABLE finanzas_movimientos IS 'Gastos e ingresos manuales — panel admin Finanzas';
