-- Compradores: archivo «Descartados» (soft delete, distinto de pausa / inactivos)
ALTER TABLE public.compradores
  ADD COLUMN IF NOT EXISTS descartado_at timestamptz;

COMMENT ON COLUMN public.compradores.descartado_at IS 'Archivo pestaña Descartados; no aparece en Todos/Activos/Alarmas.';

CREATE INDEX IF NOT EXISTS compradores_descartado_at_idx ON public.compradores (descartado_at)
  WHERE descartado_at IS NOT NULL;