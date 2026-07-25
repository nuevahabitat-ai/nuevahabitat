-- NuevaHabitat · Migración 022 — fuente habitaclia en particulares
ALTER TABLE particulares DROP CONSTRAINT IF EXISTS particulares_fuente_check;
ALTER TABLE particulares ADD CONSTRAINT particulares_fuente_check
  CHECK (fuente IN ('kelify', 'idealista', 'fotocasa', 'habitaclia', 'manual', 'otro'));
