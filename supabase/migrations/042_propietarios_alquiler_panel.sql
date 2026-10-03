-- ============================================================
-- NuevaHabitat · Migración 042 — Panel propietario (admin alquiler)
-- Ejecutar en Supabase SQL Editor (producción)
-- ============================================================

CREATE TABLE IF NOT EXISTS propietarios_alquiler (
  id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  perfil_id               uuid REFERENCES perfiles(id) ON DELETE SET NULL,
  nombre                  text NOT NULL,
  dni                     text,
  telefono                text,
  email                   text NOT NULL,
  activo                  boolean DEFAULT true,
  servicio                text NOT NULL DEFAULT 'administracion',
  estado_gestion          text NOT NULL DEFAULT 'alta',
  direccion_propietario   text,
  iban_cobro              text,
  notas_propietario       text,
  inmueble_direccion      text,
  inmueble_ref_catastral  text,
  inmueble_ref            text,
  renta_mensual           numeric(12,2),
  inmueble_notas          text,
  inquilino_nombre        text,
  inquilino_telefono      text,
  inquilino_email         text,
  contrato_inicio         date,
  contrato_fin            date,
  cuota_mensual           numeric(12,2) NOT NULL DEFAULT 60,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  suscripcion_activa      boolean DEFAULT false,
  suscripcion_estado      text,
  suscripcion_periodo_fin timestamptz,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS propietarios_alquiler_email_uidx
  ON propietarios_alquiler (lower(trim(email)));

CREATE INDEX IF NOT EXISTS propietarios_alquiler_perfil_idx
  ON propietarios_alquiler (perfil_id);

COMMENT ON COLUMN propietarios_alquiler.estado_gestion IS 'alta|documentacion|contrato|activo|renovacion|baja';
COMMENT ON COLUMN propietarios_alquiler.servicio IS 'administracion|integral';

CREATE TABLE IF NOT EXISTS alquiler_incidencias (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  propietario_id  uuid NOT NULL REFERENCES propietarios_alquiler(id) ON DELETE CASCADE,
  titulo          text NOT NULL,
  descripcion     text,
  estado          text NOT NULL DEFAULT 'abierta',
  prioridad       text NOT NULL DEFAULT 'normal',
  responsable     text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  resuelta_at     timestamptz
);

CREATE INDEX IF NOT EXISTS alquiler_incidencias_prop_idx ON alquiler_incidencias (propietario_id);

DROP TRIGGER IF EXISTS propietarios_alquiler_updated_at ON propietarios_alquiler;
CREATE TRIGGER propietarios_alquiler_updated_at
  BEFORE UPDATE ON propietarios_alquiler
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS alquiler_incidencias_updated_at ON alquiler_incidencias;
CREATE TRIGGER alquiler_incidencias_updated_at
  BEFORE UPDATE ON alquiler_incidencias
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE propietarios_alquiler ENABLE ROW LEVEL SECURITY;
ALTER TABLE alquiler_incidencias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS propietarios_alquiler_admin_rw ON propietarios_alquiler;
CREATE POLICY propietarios_alquiler_admin_rw ON propietarios_alquiler
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  );

DROP POLICY IF EXISTS propietarios_alquiler_own_read ON propietarios_alquiler;
CREATE POLICY propietarios_alquiler_own_read ON propietarios_alquiler
  FOR SELECT TO authenticated
  USING (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  );

DROP POLICY IF EXISTS alquiler_incidencias_admin_rw ON alquiler_incidencias;
CREATE POLICY alquiler_incidencias_admin_rw ON alquiler_incidencias
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
  );

DROP POLICY IF EXISTS alquiler_incidencias_own_read ON alquiler_incidencias;
CREATE POLICY alquiler_incidencias_own_read ON alquiler_incidencias
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM propietarios_alquiler p
      WHERE p.id = alquiler_incidencias.propietario_id
        AND lower(trim(p.email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
    )
  );

-- RPC: alta propietario alquiler (no borra comprador/vendedor)
CREATE OR REPLACE FUNCTION public.sync_propietario_alquiler()
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

  INSERT INTO public.perfiles (id, nombre, rol, telefono)
  VALUES (uid, unombre, 'cliente', utel)
  ON CONFLICT (id) DO UPDATE SET
    nombre   = COALESCE(EXCLUDED.nombre, perfiles.nombre),
    telefono = COALESCE(EXCLUDED.telefono, perfiles.telefono);

  IF NOT EXISTS (
    SELECT 1 FROM public.propietarios_alquiler p
    WHERE lower(trim(p.email)) = lower(trim(uemail))
  ) THEN
    INSERT INTO public.propietarios_alquiler (perfil_id, nombre, email, telefono)
    VALUES (uid, unombre, uemail, utel);
  ELSE
    UPDATE public.propietarios_alquiler
    SET perfil_id = COALESCE(perfil_id, uid),
        nombre = COALESCE(NULLIF(trim(nombre), ''), unombre),
        telefono = COALESCE(telefono, utel)
    WHERE lower(trim(email)) = lower(trim(uemail));
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_propietario_alquiler() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_propietario_alquiler() TO authenticated;

-- Trigger registro: tipo alquiler / propietario
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

  IF v_tipo IN ('alquiler', 'propietario', 'admin_alquiler') THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.propietarios_alquiler p
      WHERE lower(trim(p.email)) = lower(trim(new.email))
    ) THEN
      INSERT INTO public.propietarios_alquiler (perfil_id, nombre, email, telefono)
      VALUES (new.id, v_nombre, new.email, v_tel);
    END IF;
    RETURN new;
  END IF;

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
