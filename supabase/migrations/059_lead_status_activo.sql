-- Estado «activo» en leads de alquiler (cartera en Administración / Integral)
DO $$
BEGIN
  ALTER TYPE lead_status ADD VALUE 'activo';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
