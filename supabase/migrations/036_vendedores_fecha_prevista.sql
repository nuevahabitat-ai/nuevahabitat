-- ============================================================
-- NuevaHabitat · Migración 036
-- Operaciones: fecha prevista de cobro (Finanzas > Previsión)
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

ALTER TABLE vendedores
  ADD COLUMN IF NOT EXISTS fecha_prevista date;

CREATE INDEX IF NOT EXISTS vendedores_fecha_prevista_idx ON vendedores (fecha_prevista);

COMMENT ON COLUMN vendedores.fecha_prevista IS 'Fecha prevista de cobro honorarios — calendario Previsión';
