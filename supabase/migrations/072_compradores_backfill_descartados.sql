-- Inactivos pasan a archivo Descartados (misma visibilidad en panel)
UPDATE public.compradores
SET
  descartado_at = COALESCE(descartado_at, updated_at, created_at, now()),
  activo = false
WHERE activo = false
  AND descartado_at IS NULL;