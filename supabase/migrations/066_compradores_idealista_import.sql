-- 066 · Importación compradores desde export Idealista + vínculo inmueble (rebajas)
-- Ejecutar en Supabase → SQL Editor

ALTER TABLE inmuebles
  ADD COLUMN IF NOT EXISTS idealista_id text;

COMMENT ON COLUMN inmuebles.idealista_id IS 'ID numérico del anuncio en Idealista (export contactos)';

CREATE UNIQUE INDEX IF NOT EXISTS inmuebles_idealista_id_unique
  ON inmuebles (idealista_id)
  WHERE idealista_id IS NOT NULL AND trim(idealista_id) <> '';

CREATE TABLE IF NOT EXISTS comprador_inmueble_interes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comprador_id    uuid NOT NULL REFERENCES compradores(id) ON DELETE CASCADE,
  inmueble_id     uuid REFERENCES inmuebles(id) ON DELETE SET NULL,
  idealista_id    text,
  ref_cliente     text,
  descripcion     text,
  origen          text,
  estado_contacto text,
  mensaje         text,
  tipo_mensaje    text,
  fecha_contacto  timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE comprador_inmueble_interes IS 'Inmuebles visitados / consultados (p. ej. import Idealista) para avisos de rebaja';

CREATE UNIQUE INDEX IF NOT EXISTS comprador_interes_comprador_idealista_uq
  ON comprador_inmueble_interes (comprador_id, idealista_id)
  WHERE idealista_id IS NOT NULL AND trim(idealista_id) <> '';

CREATE INDEX IF NOT EXISTS comprador_interes_inmueble_idx ON comprador_inmueble_interes (inmueble_id);
CREATE INDEX IF NOT EXISTS comprador_interes_idealista_idx ON comprador_inmueble_interes (idealista_id);

DROP TRIGGER IF EXISTS comprador_inmueble_interes_updated_at ON comprador_inmueble_interes;
CREATE TRIGGER comprador_inmueble_interes_updated_at
  BEFORE UPDATE ON comprador_inmueble_interes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE comprador_inmueble_interes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comprador_inmueble_interes_admin_rw ON comprador_inmueble_interes;
CREATE POLICY comprador_inmueble_interes_admin_rw ON comprador_inmueble_interes
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());
