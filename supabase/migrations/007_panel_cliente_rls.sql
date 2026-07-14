-- ============================================================
-- NuevaHabitat · Migración 007
-- Panel cliente + perfiles upsert
-- Ejecutar en Supabase → SQL Editor (después de la 006)
-- ============================================================

-- ── 1. PERFILES: permitir INSERT/UPDATE del propio usuario ──
DROP POLICY IF EXISTS "perfiles_own" ON perfiles;
CREATE POLICY "perfiles_own" ON perfiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- ── 2. COMPRADORES: admin escribe, cliente lee lo suyo ─────
DROP POLICY IF EXISTS "Admin compradores rw" ON compradores;
DROP POLICY IF EXISTS "compradores_admin_rw" ON compradores;
DROP POLICY IF EXISTS "compradores_own_read" ON compradores;

CREATE POLICY "compradores_admin_rw" ON compradores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  );

CREATE POLICY "compradores_own_read" ON compradores
  FOR SELECT
  TO authenticated
  USING (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  );


-- ── 3. VENDEDORES: admin escribe, cliente lee lo suyo ───────
DROP POLICY IF EXISTS "Admin vendedores rw" ON vendedores;
DROP POLICY IF EXISTS "vendedores_admin_rw" ON vendedores;
DROP POLICY IF EXISTS "vendedores_own_read" ON vendedores;

CREATE POLICY "vendedores_admin_rw" ON vendedores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  );

CREATE POLICY "vendedores_own_read" ON vendedores
  FOR SELECT
  TO authenticated
  USING (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  );


-- ── 4. LEADS: usuario puede leer los suyos por email ────────
DROP POLICY IF EXISTS "leads_own" ON leads;
CREATE POLICY "leads_own" ON leads
  FOR SELECT
  TO authenticated
  USING (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
    OR perfil_id = auth.uid()
  );

-- ============================================================
-- FIN · Verifica:
--   SELECT policyname, tablename FROM pg_policies
--   WHERE tablename IN ('perfiles','compradores','vendedores','leads');
-- ============================================================
