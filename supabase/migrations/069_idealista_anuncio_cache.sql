-- Caché de precios Idealista (scraping / Playwright) para presupuesto_max compradores
CREATE TABLE IF NOT EXISTS idealista_anuncio_cache (
  idealista_id text PRIMARY KEY,
  precio       integer,
  habitaciones smallint,
  titulo       text,
  fetched_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE idealista_anuncio_cache IS 'Precio anuncio Idealista por ID; solo backend (service role).';

ALTER TABLE idealista_anuncio_cache ENABLE ROW LEVEL SECURITY;
