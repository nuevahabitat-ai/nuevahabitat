-- ============================================================
-- NuevaHabitat · Migración 006
-- Ejecutar en Supabase → SQL Editor (todo el bloque)
--
-- Incluye:
--   1. Borrar inmuebles de prueba (seed)
--   2. Perfil automático al registrarse + admin
--   3. RLS: leads públicos, newsletter, favoritos
--   4. Renombrar favoritos.perfil_id → user_id (compatible con frontend)
--   5. Agente único Juan Cárdenas
-- ============================================================


-- ── 1. ELIMINAR INMUEBLES DE PRUEBA ──────────────────────────
DELETE FROM inmuebles
WHERE ref IN (
  'NH-EIX-001', 'NH-GRA-002', 'NH-SGV-003',
  'NH-SAR-004', 'NH-POB-005', 'NH-SCU-006'
);

DELETE FROM inmuebles
WHERE slug IN (
  'inmueble-eixample', 'inmueble-gracia', 'inmueble-sant-gervasi',
  'inmueble-sarria', 'inmueble-poblenou', 'inmueble-sant-cugat'
);


-- ── 2. AGENTE ÚNICO (Juan Cárdenas) ─────────────────────────
-- Desactiva agentes seed antiguos; inserta/actualiza el real
UPDATE agentes SET activo = false
WHERE email IN (
  'jordi@nuevahabitat.com', 'maria@nuevahabitat.com',
  'laura@nuevahabitat.com', 'alex@nuevahabitat.com'
);

INSERT INTO agentes (nombre, apellidos, email, telefono, zona, activo)
VALUES (
  'Juan', 'Cárdenas', 'admin.nuevahabitat@gmail.com',
  '603656587', ARRAY['Barcelona', 'Área metropolitana'], true
)
ON CONFLICT (email) DO UPDATE SET
  nombre    = EXCLUDED.nombre,
  apellidos = EXCLUDED.apellidos,
  telefono  = EXCLUDED.telefono,
  zona      = EXCLUDED.zona,
  activo    = true;


-- ── 3. TRIGGER: crear perfil al registrarse ────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rol user_role := 'cliente';
BEGIN
  IF lower(trim(new.email)) = 'admin.nuevahabitat@gmail.com' THEN
    v_rol := 'admin';
  END IF;

  INSERT INTO public.perfiles (id, nombre, rol, telefono)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    v_rol,
    new.raw_user_meta_data->>'telefono'
  )
  ON CONFLICT (id) DO UPDATE SET
    nombre = COALESCE(EXCLUDED.nombre, perfiles.nombre),
    rol    = CASE
               WHEN lower(trim(new.email)) = 'admin.nuevahabitat@gmail.com' THEN 'admin'::user_role
               ELSE perfiles.rol
             END,
    telefono = COALESCE(EXCLUDED.telefono, perfiles.telefono);

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 4. PERFILES para usuarios ya existentes ────────────────
INSERT INTO perfiles (id, nombre, rol)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'nombre', split_part(u.email, '@', 1)),
  CASE
    WHEN lower(trim(u.email)) = 'admin.nuevahabitat@gmail.com' THEN 'admin'::user_role
    ELSE 'cliente'::user_role
  END
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM perfiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

-- Asegurar rol admin en cuenta existente
UPDATE perfiles
SET rol = 'admin'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE lower(trim(email)) = 'admin.nuevahabitat@gmail.com'
);


-- ── 5. FAVORITOS: perfil_id → user_id (compatible frontend) ─
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'favoritos' AND column_name = 'perfil_id'
  ) THEN
    ALTER TABLE favoritos DROP CONSTRAINT IF EXISTS favoritos_perfil_id_inmueble_id_key;
    ALTER TABLE favoritos RENAME COLUMN perfil_id TO user_id;
  END IF;
END $$;

ALTER TABLE favoritos DROP CONSTRAINT IF EXISTS favoritos_perfil_id_fkey;
ALTER TABLE favoritos DROP CONSTRAINT IF EXISTS favoritos_user_id_fkey;
ALTER TABLE favoritos
  ADD CONSTRAINT favoritos_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE favoritos DROP CONSTRAINT IF EXISTS favoritos_user_id_inmueble_id_key;
ALTER TABLE favoritos
  ADD CONSTRAINT favoritos_user_id_inmueble_id_key UNIQUE (user_id, inmueble_id);

DROP INDEX IF EXISTS favoritos_perfil_id_idx;
CREATE INDEX IF NOT EXISTS favoritos_user_id_idx ON favoritos (user_id);

DROP POLICY IF EXISTS "favoritos_own" ON favoritos;
CREATE POLICY "favoritos_own" ON favoritos
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ── 6. LEADS: permitir INSERT desde formularios web ──────────
DROP POLICY IF EXISTS "leads_public_insert" ON leads;
CREATE POLICY "leads_public_insert" ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);


-- ── 7. NEWSLETTER: suscripción pública ─────────────────────
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletter_public_insert" ON newsletter;
CREATE POLICY "newsletter_public_insert" ON newsletter
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "newsletter_admin_read" ON newsletter;
CREATE POLICY "newsletter_admin_read" ON newsletter
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  );


-- ── 8. INMUEBLES: admin también por email (respaldo) ────────
DROP POLICY IF EXISTS "inmuebles_admin_write" ON inmuebles;
CREATE POLICY "inmuebles_admin_write" ON inmuebles
  FOR ALL
  TO authenticated
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


-- ── 9. LEADS: admin puede leer todos ─────────────────────────
DROP POLICY IF EXISTS "leads_admin_read" ON leads;
CREATE POLICY "leads_admin_read" ON leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
    OR perfil_id = auth.uid()
    OR lower(trim(email)) = (SELECT lower(trim(email)) FROM auth.users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "leads_admin_update" ON leads;
CREATE POLICY "leads_admin_update" ON leads
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  );


-- ============================================================
-- FIN · Verifica con:
--   SELECT count(*) FROM inmuebles;
--   SELECT u.email, p.rol FROM auth.users u JOIN perfiles p ON p.id = u.id;
-- ============================================================
