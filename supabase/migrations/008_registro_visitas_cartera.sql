-- ============================================================
-- NuevaHabitat · Migración 008
-- Registro → compradores/vendedores, visitas públicas, cartera
-- Ejecutar después de 006 y 007
-- ============================================================

-- ── 1. Índices únicos por email (evitar duplicados) ─────────
CREATE UNIQUE INDEX IF NOT EXISTS compradores_email_unique
  ON compradores (lower(trim(email)))
  WHERE email IS NOT NULL AND trim(email) <> '';

CREATE UNIQUE INDEX IF NOT EXISTS vendedores_email_unique
  ON vendedores (lower(trim(email)))
  WHERE email IS NOT NULL AND trim(email) <> '';


-- ── 2. TRIGGER: perfil + comprador/vendedor al registrarse ──
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rol   user_role := 'cliente';
  v_tipo  text;
  v_nombre text;
  v_tel   text;
BEGIN
  v_tipo   := COALESCE(new.raw_user_meta_data->>'tipo', 'comprar');
  v_nombre := COALESCE(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1));
  v_tel    := new.raw_user_meta_data->>'telefono';

  IF lower(trim(new.email)) = 'admin.nuevahabitat@gmail.com' THEN
    v_rol := 'admin';
  END IF;

  INSERT INTO public.perfiles (id, nombre, rol, telefono)
  VALUES (new.id, v_nombre, v_rol, v_tel)
  ON CONFLICT (id) DO UPDATE SET
    nombre   = COALESCE(EXCLUDED.nombre, perfiles.nombre),
    rol      = CASE
                 WHEN lower(trim(new.email)) = 'admin.nuevahabitat@gmail.com' THEN 'admin'::user_role
                 ELSE perfiles.rol
               END,
    telefono = COALESCE(EXCLUDED.telefono, perfiles.telefono);

  IF v_tipo IN ('vender', 'vendedor') THEN
    IF NOT EXISTS (SELECT 1 FROM vendedores v WHERE lower(trim(v.email)) = lower(trim(new.email))) THEN
      INSERT INTO public.vendedores (nombre, email, telefono)
      VALUES (v_nombre, new.email, v_tel);
    END IF;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM compradores c WHERE lower(trim(c.email)) = lower(trim(new.email))) THEN
      INSERT INTO public.compradores (nombre, email, telefono, activo)
      VALUES (v_nombre, new.email, v_tel, true);
    END IF;
  END IF;

  RETURN new;
END;
$$;


-- ── 3. BACKFILL compradores/vendedores usuarios existentes ──
INSERT INTO compradores (nombre, email, telefono, activo)
SELECT
  COALESCE(u.raw_user_meta_data->>'nombre', split_part(u.email, '@', 1)),
  u.email,
  u.raw_user_meta_data->>'telefono',
  true
FROM auth.users u
WHERE COALESCE(u.raw_user_meta_data->>'tipo', 'comprar') NOT IN ('vender', 'vendedor')
  AND lower(trim(u.email)) <> 'admin.nuevahabitat@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM compradores c WHERE lower(trim(c.email)) = lower(trim(u.email))
  );

INSERT INTO vendedores (nombre, email, telefono)
SELECT
  COALESCE(u.raw_user_meta_data->>'nombre', split_part(u.email, '@', 1)),
  u.email,
  u.raw_user_meta_data->>'telefono'
FROM auth.users u
WHERE COALESCE(u.raw_user_meta_data->>'tipo', 'comprar') IN ('vender', 'vendedor')
  AND NOT EXISTS (
    SELECT 1 FROM vendedores v WHERE lower(trim(v.email)) = lower(trim(u.email))
  );


-- ── 4. COMPRADORES/VENDEDORES: INSERT propio al registrarse ──
DROP POLICY IF EXISTS "compradores_self_insert" ON compradores;
CREATE POLICY "compradores_self_insert" ON compradores
  FOR INSERT
  TO authenticated
  WITH CHECK (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  );

DROP POLICY IF EXISTS "vendedores_self_insert" ON vendedores;
CREATE POLICY "vendedores_self_insert" ON vendedores
  FOR INSERT
  TO authenticated
  WITH CHECK (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  );


-- ── 5. VISITAS: solicitud pública + lectura cliente/vendedor ──
DROP POLICY IF EXISTS "visitas_public_insert" ON visitas;
CREATE POLICY "visitas_public_insert" ON visitas
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "visitas_own_read" ON visitas;
CREATE POLICY "visitas_own_read" ON visitas
  FOR SELECT
  TO authenticated
  USING (
    perfil_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = visitas.lead_id
        AND lower(trim(l.email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
    )
    OR EXISTS (
      SELECT 1 FROM vendedores v
      JOIN inmuebles i ON i.ref = v.inmueble_ref
      WHERE i.id = visitas.inmueble_id
        AND lower(trim(v.email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
    )
    OR EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  );

DROP POLICY IF EXISTS "visitas_agentes" ON visitas;
CREATE POLICY "visitas_agentes" ON visitas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  );

-- ============================================================
-- FIN
-- ============================================================
