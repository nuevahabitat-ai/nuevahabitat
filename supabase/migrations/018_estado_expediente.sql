-- ============================================================
-- NuevaHabitat · Migración 018
-- Columna estado_expediente en compradores y vendedores
-- Ejecutar en Supabase → SQL Editor si falla guardar compradores
-- ============================================================

ALTER TABLE compradores ADD COLUMN IF NOT EXISTS estado_expediente text DEFAULT 'registro';
ALTER TABLE vendedores  ADD COLUMN IF NOT EXISTS estado_expediente text DEFAULT 'registro';

COMMENT ON COLUMN compradores.estado_expediente IS 'registro|reunion|busqueda|visitas|arras|cerrado';
COMMENT ON COLUMN vendedores.estado_expediente  IS 'registro|valoracion|fotos|publicacion|visitas|escritura|cerrado';
