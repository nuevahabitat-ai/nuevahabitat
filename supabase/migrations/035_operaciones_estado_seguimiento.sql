-- ============================================================
-- NuevaHabitat · Migración 035
-- Operaciones: estado activa | seguimiento | inactiva
-- Ejecutar en Supabase → SQL Editor (después de 034)
-- ============================================================

ALTER TABLE vendedores
  ADD COLUMN IF NOT EXISTS estado_operacion text DEFAULT 'activa';

UPDATE vendedores
SET estado_operacion = CASE
  WHEN activo = false THEN 'inactiva'
  ELSE 'activa'
END
WHERE estado_operacion IS NULL;

ALTER TABLE vendedores DROP CONSTRAINT IF EXISTS vendedores_estado_operacion_check;
ALTER TABLE vendedores ADD CONSTRAINT vendedores_estado_operacion_check
  CHECK (estado_operacion IN ('activa', 'seguimiento', 'inactiva'));

COMMENT ON COLUMN vendedores.estado_operacion IS 'activa|seguimiento|inactiva — estado de la operación en cartera';
