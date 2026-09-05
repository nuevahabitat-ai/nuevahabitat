-- Migración 040 · Criterios extra compradores (opcionales)
-- Ejecutar en Supabase → SQL Editor

ALTER TABLE compradores
  ADD COLUMN IF NOT EXISTS balcon_terraza_indispensable boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS m2_min numeric(8,2),
  ADD COLUMN IF NOT EXISTS banos_min smallint,
  ADD COLUMN IF NOT EXISTS exterior_indispensable boolean DEFAULT false;

COMMENT ON COLUMN compradores.balcon_terraza_indispensable IS 'Requiere balcón o terraza';
COMMENT ON COLUMN compradores.m2_min IS 'Metros útiles mínimos';
COMMENT ON COLUMN compradores.banos_min IS 'Baños mínimos (3 = tres o más)';
COMMENT ON COLUMN compradores.exterior_indispensable IS 'Requiere orientación exterior';
