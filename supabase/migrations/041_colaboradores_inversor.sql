-- Migración 041 · Tipo colaborador: inversor
-- Ejecutar en Supabase → SQL Editor (después de 020)

ALTER TABLE colaboradores DROP CONSTRAINT IF EXISTS colaboradores_tipo_check;

ALTER TABLE colaboradores
  ADD CONSTRAINT colaboradores_tipo_check
  CHECK (tipo IN ('gestor', 'notaria', 'tasador', 'inmobiliario', 'inversor'));

COMMENT ON COLUMN colaboradores.tipo IS 'gestor | notaria | tasador | inmobiliario | inversor';
