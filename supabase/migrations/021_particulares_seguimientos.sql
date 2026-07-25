-- ============================================================
-- NuevaHabitat · Migración 021
-- Particulares (captación) + historial de seguimiento
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS particulares (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  url                 text,
  fuente              text DEFAULT 'manual' CHECK (fuente IN ('kelify', 'idealista', 'fotocasa', 'manual', 'otro')),
  titulo              text,
  direccion           text,
  precio              numeric(12,2),
  m2                  numeric(8,2),
  habitaciones        smallint,
  banos               smallint,
  zona                text,
  barrio              text,
  municipio           text DEFAULT 'Barcelona',
  contacto_nombre     text,
  telefono            text,
  email               text,
  descripcion         text,
  imagen_url          text,
  estado              text DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'visita', 'negociacion', 'captado', 'descartado')),
  ultimo_contacto_at  timestamptz,
  proxima_alarma_at   timestamptz,
  activo              boolean DEFAULT true,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS particulares_seguimientos (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  particular_id uuid NOT NULL REFERENCES particulares(id) ON DELETE CASCADE,
  comentario    text NOT NULL,
  created_at    timestamptz DEFAULT now()
);

COMMENT ON TABLE particulares IS 'Seguimiento de anuncios de particulares (Kelify, Idealista, etc.)';
COMMENT ON TABLE particulares_seguimientos IS 'Historial de contactos y notas por particular';
COMMENT ON COLUMN particulares.proxima_alarma_at IS 'Alarma: contactar antes de esta fecha si no hay seguimiento';

CREATE UNIQUE INDEX IF NOT EXISTS particulares_url_unique
  ON particulares (lower(trim(url)))
  WHERE url IS NOT NULL AND trim(url) <> '';

CREATE INDEX IF NOT EXISTS particulares_estado_idx ON particulares (estado);
CREATE INDEX IF NOT EXISTS particulares_proxima_alarma_idx ON particulares (proxima_alarma_at);
CREATE INDEX IF NOT EXISTS particulares_created_at_idx ON particulares (created_at DESC);
CREATE INDEX IF NOT EXISTS particulares_seguimientos_particular_idx ON particulares_seguimientos (particular_id, created_at DESC);

ALTER TABLE particulares ENABLE ROW LEVEL SECURITY;
ALTER TABLE particulares_seguimientos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "particulares_admin_rw" ON particulares;
CREATE POLICY "particulares_admin_rw" ON particulares
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS "particulares_seguimientos_admin_rw" ON particulares_seguimientos;
CREATE POLICY "particulares_seguimientos_admin_rw" ON particulares_seguimientos
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP TRIGGER IF EXISTS particulares_updated_at ON particulares;
CREATE TRIGGER particulares_updated_at
  BEFORE UPDATE ON particulares
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
