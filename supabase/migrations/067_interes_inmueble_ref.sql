-- Ref. NH del piso vinculado (avisos rebaja por inmueble_id)
ALTER TABLE comprador_inmueble_interes
  ADD COLUMN IF NOT EXISTS inmueble_ref text;

COMMENT ON COLUMN comprador_inmueble_interes.inmueble_ref IS 'ref NH del inmueble (ej. NH-2026-123) al importar Idealista';

CREATE INDEX IF NOT EXISTS comprador_interes_inmueble_ref_idx
  ON comprador_inmueble_interes (inmueble_ref)
  WHERE inmueble_ref IS NOT NULL AND trim(inmueble_ref) <> '';
