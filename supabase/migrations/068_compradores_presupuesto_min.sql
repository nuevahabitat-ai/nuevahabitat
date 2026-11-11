-- 068 · Rango de presupuesto (inferido desde pisos consultados)
ALTER TABLE compradores
  ADD COLUMN IF NOT EXISTS presupuesto_min numeric(12,2);

COMMENT ON COLUMN compradores.presupuesto_min IS 'Suelo presupuestario (p. ej. máx. contactado − 50.000 €); cruces y filtros';
