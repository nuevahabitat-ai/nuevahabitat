-- Segundo anuncio Idealista (misma vivienda: venta + venta renovada, etc.)
ALTER TABLE inmuebles
  ADD COLUMN IF NOT EXISTS idealista_id_2 text;

COMMENT ON COLUMN inmuebles.idealista_id_2 IS 'ID numérico alternativo del mismo inmueble en Idealista';

CREATE UNIQUE INDEX IF NOT EXISTS inmuebles_idealista_id_2_unique
  ON inmuebles (idealista_id_2)
  WHERE idealista_id_2 IS NOT NULL AND trim(idealista_id_2) <> '';