-- ============================================================
-- NuevaHabitat · Migración 034
-- Operaciones: activo + honorarios comprador predefinido
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

ALTER TABLE vendedores
  ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS honorarios_comprador numeric(10,2) DEFAULT 6050.00;

COMMENT ON COLUMN vendedores.activo IS 'Operación activa en cartera (false = archivada/no activa)';
COMMENT ON COLUMN vendedores.honorarios_comprador IS 'Honorarios previstos del comprador cuando aún no hay comprador vinculado';

UPDATE vendedores SET activo = true WHERE activo IS NULL;
UPDATE vendedores SET honorarios_comprador = 6050.00 WHERE honorarios_comprador IS NULL;
