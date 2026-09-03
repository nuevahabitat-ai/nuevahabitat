-- Migración 039 · Planta máxima aceptable sin ascensor (compradores)
-- Ejecutar en Supabase → SQL Editor

ALTER TABLE compradores
  ADD COLUMN IF NOT EXISTS planta_max_sin_ascensor smallint;

COMMENT ON COLUMN compradores.planta_max_sin_ascensor IS
  'Planta máxima (0=bajo) si no exige ascensor. NULL = cualquier planta sin ascensor.';
