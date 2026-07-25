-- ============================================================
-- NuevaHabitat · Migración 019
-- Tabla colaboradores (gestores, notarías, tasadores)
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS colaboradores (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo        text NOT NULL CHECK (tipo IN ('gestor', 'notaria', 'tasador')),
  nombre      text NOT NULL,
  telefono    text,
  email       text,
  direccion   text,
  descripcion text,
  activo      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

COMMENT ON TABLE colaboradores IS 'Red de colaboradores: gestorías, notarías, tasadores';
COMMENT ON COLUMN colaboradores.tipo IS 'gestor | notaria | tasador';

CREATE INDEX IF NOT EXISTS colaboradores_tipo_idx ON colaboradores (tipo);
CREATE INDEX IF NOT EXISTS colaboradores_activo_idx ON colaboradores (activo);
CREATE INDEX IF NOT EXISTS colaboradores_created_at_idx ON colaboradores (created_at DESC);

ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "colaboradores_admin_rw" ON colaboradores;
CREATE POLICY "colaboradores_admin_rw" ON colaboradores
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP TRIGGER IF EXISTS colaboradores_updated_at ON colaboradores;
CREATE TRIGGER colaboradores_updated_at
  BEFORE UPDATE ON colaboradores
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
