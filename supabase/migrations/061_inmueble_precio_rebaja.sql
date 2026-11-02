-- 061 · Precio rebajado visible + log avisos a visitantes
-- Ejecutar en Supabase → SQL Editor

ALTER TABLE inmuebles
  ADD COLUMN IF NOT EXISTS precio_anterior numeric(12,2),
  ADD COLUMN IF NOT EXISTS precio_rebajado_at timestamptz;

COMMENT ON COLUMN inmuebles.precio_anterior IS 'Precio de referencia antes de la última rebaja (tachado en web si precio < precio_anterior)';
COMMENT ON COLUMN inmuebles.precio_rebajado_at IS 'Momento de la última rebaja de precio';

ALTER TABLE comprador_inmueble_wa_avisos
  ADD COLUMN IF NOT EXISTS motivo text NOT NULL DEFAULT 'compatible',
  ADD COLUMN IF NOT EXISTS precio_notificado numeric(12,2);

COMMENT ON COLUMN comprador_inmueble_wa_avisos.motivo IS 'compatible | rebaja';

DROP INDEX IF EXISTS comprador_wa_avisos_unique_inm;
CREATE UNIQUE INDEX comprador_wa_avisos_unique_inm
  ON comprador_inmueble_wa_avisos (comprador_id, inmueble_id, motivo, COALESCE(precio_notificado, -1))
  WHERE inmueble_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS inmueble_rebaja_avisos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inmueble_id     uuid NOT NULL REFERENCES inmuebles(id) ON DELETE CASCADE,
  visita_id       uuid REFERENCES visitas(id) ON DELETE SET NULL,
  comprador_id    uuid REFERENCES compradores(id) ON DELETE SET NULL,
  nombre          text,
  email           text,
  telefono        text,
  canal           text NOT NULL CHECK (canal IN ('email', 'whatsapp')),
  precio_anterior numeric(12,2),
  precio_nuevo    numeric(12,2) NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inmueble_rebaja_avisos_inm_idx ON inmueble_rebaja_avisos (inmueble_id, precio_nuevo DESC);

ALTER TABLE inmueble_rebaja_avisos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS inmueble_rebaja_avisos_admin_rw ON inmueble_rebaja_avisos;
CREATE POLICY inmueble_rebaja_avisos_admin_rw ON inmueble_rebaja_avisos
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());
