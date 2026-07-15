-- ============================================================
-- NuevaHabitat · Migración 015
-- FIX: "permission denied for table users" en RLS
-- Las políticas no pueden consultar auth.users directamente.
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- Email del usuario autenticado (SECURITY DEFINER → accede a auth.users)
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

-- Admin/agente sin consultar auth.users en políticas
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

GRANT EXECUTE ON FUNCTION public.auth_user_email() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.auth_user_email_lower() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_or_agente() TO authenticated, anon;

-- ── COMPRADORES ─────────────────────────────────────────────
DROP POLICY IF EXISTS "compradores_admin_rw" ON compradores;
CREATE POLICY "compradores_admin_rw" ON compradores
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS "compradores_own_read" ON compradores;
CREATE POLICY "compradores_own_read" ON compradores
  FOR SELECT TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "compradores_self_insert" ON compradores;
CREATE POLICY "compradores_self_insert" ON compradores
  FOR INSERT TO authenticated
  WITH CHECK (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "compradores_self_update" ON compradores;
CREATE POLICY "compradores_self_update" ON compradores
  FOR UPDATE TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower())
  WITH CHECK (lower(trim(email)) = public.auth_user_email_lower());

-- ── VENDEDORES ──────────────────────────────────────────────
DROP POLICY IF EXISTS "vendedores_admin_rw" ON vendedores;
CREATE POLICY "vendedores_admin_rw" ON vendedores
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS "vendedores_own_read" ON vendedores;
CREATE POLICY "vendedores_own_read" ON vendedores
  FOR SELECT TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "vendedores_self_insert" ON vendedores;
CREATE POLICY "vendedores_self_insert" ON vendedores
  FOR INSERT TO authenticated
  WITH CHECK (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "vendedores_self_update" ON vendedores;
CREATE POLICY "vendedores_self_update" ON vendedores
  FOR UPDATE TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower())
  WITH CHECK (lower(trim(email)) = public.auth_user_email_lower());

-- ── LEADS ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "leads_own" ON leads;
CREATE POLICY "leads_own" ON leads
  FOR SELECT TO authenticated
  USING (
    lower(trim(email)) = public.auth_user_email_lower()
    OR perfil_id = auth.uid()
  );

DROP POLICY IF EXISTS "leads_admin_read" ON leads;
CREATE POLICY "leads_admin_read" ON leads
  FOR SELECT TO authenticated
  USING (
    public.is_admin_or_agente()
    OR perfil_id = auth.uid()
    OR lower(trim(email)) = public.auth_user_email_lower()
  );

-- ── VISITAS ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "visitas_own_read" ON visitas;
CREATE POLICY "visitas_own_read" ON visitas
  FOR SELECT TO authenticated
  USING (
    perfil_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = visitas.lead_id
        AND lower(trim(l.email)) = public.auth_user_email_lower()
    )
    OR EXISTS (
      SELECT 1 FROM vendedores v
      JOIN inmuebles i ON i.ref = v.inmueble_ref
      WHERE i.id = visitas.inmueble_id
        AND lower(trim(v.email)) = public.auth_user_email_lower()
    )
    OR public.is_admin_or_agente()
  );

-- ── INMUEBLES (admin write) ─────────────────────────────────
DROP POLICY IF EXISTS "inmuebles_admin_write" ON inmuebles;
CREATE POLICY "inmuebles_admin_write" ON inmuebles
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

-- ── DOCUMENTOS CLIENTE ──────────────────────────────────────
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

-- ── BLOG ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "blog_admin_rw" ON blog_posts;
CREATE POLICY "blog_admin_rw" ON blog_posts
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

-- ── NEWSLETTER ──────────────────────────────────────────────
DROP POLICY IF EXISTS "newsletter_admin_read" ON newsletter;
CREATE POLICY "newsletter_admin_read" ON newsletter
  FOR SELECT TO authenticated
  USING (public.is_admin_or_agente());

-- Verificación
SELECT 'compradores' AS tabla, count(*)::text FROM compradores
UNION ALL SELECT 'vendedores', count(*)::text FROM vendedores;
