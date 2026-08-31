-- ============================================================
-- NuevaHabitat · Migración 031
-- Vendedores: vincular comprador y modo de pago honorarios
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

ALTER TABLE vendedores
  ADD COLUMN IF NOT EXISTS comprador_id uuid REFERENCES compradores(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS honorarios_pago_por text DEFAULT 'vendedor';

ALTER TABLE vendedores DROP CONSTRAINT IF EXISTS vendedores_honorarios_pago_por_check;
ALTER TABLE vendedores ADD CONSTRAINT vendedores_honorarios_pago_por_check
  CHECK (honorarios_pago_por IN ('vendedor', 'comprador', 'ambos', 'exento', 'personalizado'));

CREATE INDEX IF NOT EXISTS vendedores_comprador_id_idx ON vendedores (comprador_id);

COMMENT ON COLUMN vendedores.comprador_id IS 'Comprador vinculado a la operación de venta';
COMMENT ON COLUMN vendedores.honorarios_pago_por IS 'vendedor|comprador|ambos|exento|personalizado — quién paga honorarios';
