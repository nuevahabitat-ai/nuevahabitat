-- ============================================================
-- NuevaHabitat · Migración 026 — Vendedor OR Comprador (exclusivo)
-- Ejecutar en Supabase SQL Editor (producción)
-- ============================================================

-- RPC: sincroniza perfil + tabla correcta y elimina la incorrecta
CREATE OR REPLACE FUNCTION public.sync_cliente_tipo(p_tipo text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  uemail text;
  unombre text;
  utel text;
  v_es_vendedor boolean;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT u.email,
         COALESCE(NULLIF(trim(u.raw_user_meta_data->>'nombre'), ''), split_part(u.email, '@', 1)),
         NULLIF(trim(u.raw_user_meta_data->>'telefono'), '')
  INTO uemail, unombre, utel
  FROM auth.users u
  WHERE u.id = uid;

  IF uemail IS NULL THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  IF lower(trim(uemail)) = 'admin.nuevahabitat@gmail.com' THEN
    RETURN;
  END IF;

  v_es_vendedor := lower(trim(p_tipo)) IN ('vender', 'vendedor');

  INSERT INTO public.perfiles (id, nombre, rol, telefono)
  VALUES (uid, unombre, 'cliente', utel)
  ON CONFLICT (id) DO UPDATE SET
    nombre   = COALESCE(EXCLUDED.nombre, perfiles.nombre),
    telefono = COALESCE(EXCLUDED.telefono, perfiles.telefono);

  IF v_es_vendedor THEN
    DELETE FROM public.compradores
    WHERE lower(trim(email)) = lower(trim(uemail));

    IF NOT EXISTS (
      SELECT 1 FROM public.vendedores v
      WHERE lower(trim(v.email)) = lower(trim(uemail))
    ) THEN
      INSERT INTO public.vendedores (nombre, email, telefono)
      VALUES (unombre, uemail, utel);
    END IF;
  ELSE
    DELETE FROM public.vendedores
    WHERE lower(trim(email)) = lower(trim(uemail));

    IF NOT EXISTS (
      SELECT 1 FROM public.compradores c
      WHERE lower(trim(c.email)) = lower(trim(uemail))
    ) THEN
      INSERT INTO public.compradores (nombre, email, telefono, activo)
      VALUES (unombre, uemail, utel, true);
    END IF;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_cliente_tipo(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_cliente_tipo(text) TO authenticated;

-- Trigger al registrarse: solo una tabla según metadata.tipo
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
    DELETE FROM public.compradores
    WHERE lower(trim(email)) = lower(trim(new.email));

    IF NOT EXISTS (
      SELECT 1 FROM public.vendedores v
      WHERE lower(trim(v.email)) = lower(trim(new.email))
    ) THEN
      INSERT INTO public.vendedores (nombre, email, telefono)
      VALUES (v_nombre, new.email, v_tel);
    END IF;
  ELSE
    DELETE FROM public.vendedores
    WHERE lower(trim(email)) = lower(trim(new.email));

    IF NOT EXISTS (
      SELECT 1 FROM public.compradores c
      WHERE lower(trim(c.email)) = lower(trim(new.email))
    ) THEN
      INSERT INTO public.compradores (nombre, email, telefono, activo)
      VALUES (v_nombre, new.email, v_tel, true);
    END IF;
  END IF;

  RETURN new;
END;
$$;

-- Limpiar duplicados existentes según metadata del usuario
DELETE FROM public.compradores c
USING auth.users u
WHERE lower(trim(c.email)) = lower(trim(u.email))
  AND COALESCE(u.raw_user_meta_data->>'tipo', 'comprar') IN ('vender', 'vendedor');

DELETE FROM public.vendedores v
USING auth.users u
WHERE lower(trim(v.email)) = lower(trim(u.email))
  AND COALESCE(u.raw_user_meta_data->>'tipo', 'comprar') IN ('comprar', 'comprador');
