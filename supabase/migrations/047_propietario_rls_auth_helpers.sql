-- ============================================================
-- NuevaHabitat · Migración 047 — Panel propietario RLS sin auth.users
-- Corrige "permission denied for table users" al guardar/subir docs
-- Ejecutar en Supabase → SQL Editor (producción)
-- Si falla "cliente_documentos does not exist", ejecutar antes 048_cliente_documentos_bootstrap.sql
-- ============================================================

-- Asegurar helpers (idempotente; ya existen desde 015/016)
CREATE OR REPLACE FUNCTION public.auth_user_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.auth_user_email_lower()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(trim(COALESCE(email, ''))) FROM auth.users WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.auth_user_email() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.auth_user_email_lower() TO authenticated, anon;

-- ── propietarios_alquiler ───────────────────────────────────
DROP POLICY IF EXISTS propietarios_alquiler_own_read ON propietarios_alquiler;
CREATE POLICY propietarios_alquiler_own_read ON propietarios_alquiler
  FOR SELECT TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS propietarios_alquiler_own_update ON propietarios_alquiler;
CREATE POLICY propietarios_alquiler_own_update ON propietarios_alquiler
  FOR UPDATE TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower())
  WITH CHECK (lower(trim(email)) = public.auth_user_email_lower());

-- ── alquiler_incidencias ────────────────────────────────────
DROP POLICY IF EXISTS alquiler_incidencias_own_read ON alquiler_incidencias;
CREATE POLICY alquiler_incidencias_own_read ON alquiler_incidencias
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM propietarios_alquiler p
      WHERE p.id = alquiler_incidencias.propietario_id
        AND lower(trim(p.email)) = public.auth_user_email_lower()
    )
  );

-- ── cliente_documentos (insert/delete panel propietario) ────
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

-- ── storage documentos-clientes ─────────────────────────────
DROP POLICY IF EXISTS docs_client_upload ON storage.objects;
CREATE POLICY docs_client_upload ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documentos-clientes'
    AND (
      lower(name) LIKE public.auth_user_email_lower() || '/%'
      OR lower(name) LIKE lower(replace(public.auth_user_email(), '@', '_at_')) || '/%'
    )
  );

DROP POLICY IF EXISTS "docs_client_read" ON storage.objects;
CREATE POLICY "docs_client_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'documentos-clientes'
    AND (
      public.is_admin_or_agente()
      OR lower(name) LIKE public.auth_user_email_lower() || '/%'
      OR lower(name) LIKE lower(replace(public.auth_user_email(), '@', '_at_')) || '/%'
      OR lower(name) LIKE public.auth_user_email_lower() || '%'
      OR lower(name) LIKE lower(replace(public.auth_user_email(), '@', '_at_')) || '%'
    )
  );

DROP POLICY IF EXISTS "docs_admin_upload" ON storage.objects;
CREATE POLICY "docs_admin_upload" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'documentos-clientes'
    AND public.is_admin_or_agente()
  )
  WITH CHECK (
    bucket_id = 'documentos-clientes'
    AND public.is_admin_or_agente()
  );
