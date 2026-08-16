-- ============================================================
-- NuevaHabitat · Migración 028 — Pagos Stripe honorarios
-- Ejecutar en Supabase SQL Editor (producción)
-- ============================================================

ALTER TABLE compradores
  ADD COLUMN IF NOT EXISTS honorarios_pagado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS honorarios_pagado_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

ALTER TABLE vendedores
  ADD COLUMN IF NOT EXISTS honorarios numeric(10,2) DEFAULT 3630.00,
  ADD COLUMN IF NOT EXISTS honorarios_pagado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS honorarios_pagado_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

COMMENT ON COLUMN compradores.honorarios IS 'Total honorarios con IVA incluido (por defecto 6.050 €)';
COMMENT ON COLUMN vendedores.honorarios IS 'Total honorarios con IVA incluido (por defecto 3.630 € = 3.000 € + 21%)';

-- Impedir que el cliente marque el pago como realizado desde el panel
CREATE OR REPLACE FUNCTION public.protect_honorarios_pago_columns()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF coalesce(auth.role(), '') = 'service_role' THEN
    RETURN NEW;
  END IF;
  NEW.honorarios_pagado := OLD.honorarios_pagado;
  NEW.honorarios_pagado_at := OLD.honorarios_pagado_at;
  NEW.stripe_session_id := OLD.stripe_session_id;
  NEW.stripe_payment_intent_id := OLD.stripe_payment_intent_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS compradores_protect_pago ON compradores;
CREATE TRIGGER compradores_protect_pago
  BEFORE UPDATE ON compradores
  FOR EACH ROW EXECUTE PROCEDURE public.protect_honorarios_pago_columns();

DROP TRIGGER IF EXISTS vendedores_protect_pago ON vendedores;
CREATE TRIGGER vendedores_protect_pago
  BEFORE UPDATE ON vendedores
  FOR EACH ROW EXECUTE PROCEDURE public.protect_honorarios_pago_columns();
