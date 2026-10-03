-- ============================================================
-- NuevaHabitat · Migración 048 — Tabla cliente_documentos (si falta)
-- En producción a veces solo se aplicaron 042–045; 011 no incluye esta tabla.
-- Ejecutar ANTES de 047 si falla: relation "cliente_documentos" does not exist
-- ============================================================

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

-- Helpers (idempotente)
CREATE OR REPLACE FUNCTION public.auth_user_email_lower()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(trim(COALESCE(email, ''))) FROM auth.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_agente()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfiles
    WHERE id = auth.uid() AND rol IN ('admin', 'agente')
  )
  OR lower(trim(COALESCE(auth.jwt() ->> 'email', ''))) = 'admin.nuevahabitat@gmail.com';
$$;

GRANT EXECUTE ON FUNCTION public.auth_user_email_lower() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_or_agente() TO authenticated, anon;

DROP POLICY IF EXISTS "documentos_admin_rw" ON cliente_documentos;
CREATE POLICY "documentos_admin_rw" ON cliente_documentos
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS "documentos_own_read" ON cliente_documentos;
CREATE POLICY "documentos_own_read" ON cliente_documentos
  FOR SELECT TO authenticated
  USING (
    lower(trim(cliente_email)) = public.auth_user_email_lower()
    OR perfil_id = auth.uid()
  );

DROP POLICY IF EXISTS documentos_own_insert ON cliente_documentos;
CREATE POLICY documentos_own_insert ON cliente_documentos
  FOR INSERT TO authenticated
  WITH CHECK (
    lower(trim(cliente_email)) = public.auth_user_email_lower()
    AND (perfil_id IS NULL OR perfil_id = auth.uid())
  );

DROP POLICY IF EXISTS documentos_own_delete ON cliente_documentos;
CREATE POLICY documentos_own_delete ON cliente_documentos
  FOR DELETE TO authenticated
  USING (
    lower(trim(cliente_email)) = public.auth_user_email_lower()
    AND estado IN ('subido', 'pendiente', 'pendiente_revision')
  );

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('documentos-clientes', 'documentos-clientes', false, 52428800)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 52428800;
