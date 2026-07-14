-- ============================================================
-- NuevaHabitat · Migración 011
-- Documentos cliente, estado expediente, blog público
-- Ejecutar después de 010
-- ============================================================

-- ── 1. Estado del expediente ─────────────────────────────────
ALTER TABLE compradores ADD COLUMN IF NOT EXISTS estado_expediente text DEFAULT 'registro';
ALTER TABLE vendedores  ADD COLUMN IF NOT EXISTS estado_expediente text DEFAULT 'registro';

COMMENT ON COLUMN compradores.estado_expediente IS 'registro|reunion|busqueda|visitas|arras|cerrado';
COMMENT ON COLUMN vendedores.estado_expediente  IS 'registro|valoracion|fotos|publicacion|visitas|escritura|cerrado';

-- ── 2. Documentos del cliente ────────────────────────────────
CREATE TABLE IF NOT EXISTS cliente_documentos (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  perfil_id       uuid REFERENCES perfiles(id) ON DELETE SET NULL,
  cliente_email   text NOT NULL,
  tipo            text NOT NULL DEFAULT 'otro',
  nombre          text NOT NULL,
  url             text,
  estado          text NOT NULL DEFAULT 'pendiente',
  notificada      boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cliente_documentos_email_idx ON cliente_documentos (lower(trim(cliente_email)));
CREATE INDEX IF NOT EXISTS cliente_documentos_tipo_idx  ON cliente_documentos (tipo);

DROP TRIGGER IF EXISTS cliente_documentos_updated_at ON cliente_documentos;
CREATE TRIGGER cliente_documentos_updated_at
  BEFORE UPDATE ON cliente_documentos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE cliente_documentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "documentos_admin_rw" ON cliente_documentos;
CREATE POLICY "documentos_admin_rw" ON cliente_documentos
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND lower(trim(email)) = 'admin.nuevahabitat@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND lower(trim(email)) = 'admin.nuevahabitat@gmail.com'
    )
  );

DROP POLICY IF EXISTS "documentos_own_read" ON cliente_documentos;
CREATE POLICY "documentos_own_read" ON cliente_documentos
  FOR SELECT TO authenticated
  USING (
    lower(trim(cliente_email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
    OR perfil_id = auth.uid()
  );

-- ── 3. Blog: lectura pública de artículos publicados ───────
DROP POLICY IF EXISTS "blog_public_read" ON blog_posts;
CREATE POLICY "blog_public_read" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (publicado = true);

DROP POLICY IF EXISTS "blog_admin_rw" ON blog_posts;
CREATE POLICY "blog_admin_rw" ON blog_posts
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND lower(trim(email)) = 'admin.nuevahabitat@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND lower(trim(email)) = 'admin.nuevahabitat@gmail.com'
    )
  );

-- ── 4. Storage bucket documentos-clientes ────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('documentos-clientes', 'documentos-clientes', false, 10485760)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "docs_admin_upload" ON storage.objects;
CREATE POLICY "docs_admin_upload" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'documentos-clientes')
  WITH CHECK (bucket_id = 'documentos-clientes');

DROP POLICY IF EXISTS "docs_client_read" ON storage.objects;
CREATE POLICY "docs_client_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documentos-clientes');

-- ============================================================
-- FIN
-- ============================================================
