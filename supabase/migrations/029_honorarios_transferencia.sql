-- ============================================================
-- NuevaHabitat · Migración 029 — Pago por transferencia bancaria
-- Ejecutar en Supabase SQL Editor (producción)
-- ============================================================

ALTER TABLE compradores
  ADD COLUMN IF NOT EXISTS honorarios_transferencia_pendiente boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS honorarios_transferencia_at timestamptz,
  ADD COLUMN IF NOT EXISTS honorarios_metodo_pago text;

ALTER TABLE vendedores
  ADD COLUMN IF NOT EXISTS honorarios_transferencia_pendiente boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS honorarios_transferencia_at timestamptz,
  ADD COLUMN IF NOT EXISTS honorarios_metodo_pago text;

COMMENT ON COLUMN compradores.honorarios_metodo_pago IS 'stripe | transferencia';
COMMENT ON COLUMN vendedores.honorarios_metodo_pago IS 'stripe | transferencia';

-- Admin y service_role pueden actualizar columnas de pago; clientes no
CREATE OR REPLACE FUNCTION public.protect_honorarios_pago_columns()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF coalesce(auth.role(), '') = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF public.is_admin_or_agente() THEN
    RETURN NEW;
  END IF;
  NEW.honorarios_pagado := OLD.honorarios_pagado;
  NEW.honorarios_pagado_at := OLD.honorarios_pagado_at;
  NEW.stripe_session_id := OLD.stripe_session_id;
  NEW.stripe_payment_intent_id := OLD.stripe_payment_intent_id;
  NEW.honorarios_transferencia_pendiente := OLD.honorarios_transferencia_pendiente;
  NEW.honorarios_transferencia_at := OLD.honorarios_transferencia_at;
  NEW.honorarios_metodo_pago := OLD.honorarios_metodo_pago;
  RETURN NEW;
END;
$$;
