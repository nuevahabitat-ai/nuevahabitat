-- Migración 038 · Registro WhatsApp comprador ↔ inmueble (evitar reenvíos)
-- Ejecutar en Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS comprador_inmueble_wa_avisos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comprador_id    uuid NOT NULL REFERENCES compradores(id) ON DELETE CASCADE,
  inmueble_id     uuid REFERENCES inmuebles(id) ON DELETE SET NULL,
  particular_id   uuid REFERENCES particulares(id) ON DELETE SET NULL,
  inmueble_ref    text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE comprador_inmueble_wa_avisos IS 'WhatsApp enviado a comprador por un piso concreto — dedup reenvíos';

CREATE INDEX IF NOT EXISTS comprador_wa_avisos_comprador_idx ON comprador_inmueble_wa_avisos (comprador_id);
CREATE INDEX IF NOT EXISTS comprador_wa_avisos_inmueble_idx ON comprador_inmueble_wa_avisos (inmueble_id);
CREATE INDEX IF NOT EXISTS comprador_wa_avisos_particular_idx ON comprador_inmueble_wa_avisos (particular_id);

CREATE UNIQUE INDEX IF NOT EXISTS comprador_wa_avisos_unique_inm
  ON comprador_inmueble_wa_avisos (comprador_id, inmueble_id)
  WHERE inmueble_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS comprador_wa_avisos_unique_part
  ON comprador_inmueble_wa_avisos (comprador_id, particular_id)
  WHERE particular_id IS NOT NULL;

ALTER TABLE comprador_inmueble_wa_avisos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comprador_wa_avisos_admin_rw ON comprador_inmueble_wa_avisos;
CREATE POLICY comprador_wa_avisos_admin_rw ON comprador_inmueble_wa_avisos
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());
