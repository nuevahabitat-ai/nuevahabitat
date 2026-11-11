-- Precio del anuncio Idealista consultado (cuando el scrape o import lo conocen)
ALTER TABLE comprador_inmueble_interes
  ADD COLUMN IF NOT EXISTS precio_consultado integer;

COMMENT ON COLUMN comprador_inmueble_interes.precio_consultado IS 'Precio venta del anuncio Idealista asociado (€).';
