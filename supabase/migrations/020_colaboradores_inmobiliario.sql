-- ============================================================
-- NuevaHabitat · Migración 020
-- Tipo colaborador: inmobiliario
-- Ejecutar en Supabase → SQL Editor (después de 019)
-- ============================================================

ALTER TABLE colaboradores DROP CONSTRAINT IF EXISTS colaboradores_tipo_check;

ALTER TABLE colaboradores
  ADD CONSTRAINT colaboradores_tipo_check
  CHECK (tipo IN ('gestor', 'notaria', 'tasador', 'inmobiliario'));

COMMENT ON COLUMN colaboradores.tipo IS 'gestor | notaria | tasador | inmobiliario';
