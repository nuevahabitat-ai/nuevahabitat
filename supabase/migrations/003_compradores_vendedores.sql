-- ============================================================
-- MIGRACIÓN 003 – Tablas Compradores y Vendedores
-- Supabase > SQL Editor > New query > Pegar y ejecutar
-- ============================================================

-- ── COMPRADORES (compradores buscando vivienda) ──────────────
CREATE TABLE IF NOT EXISTS compradores (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre          text NOT NULL,
  dni             text,
  telefono        text,
  email           text,
  activo          boolean DEFAULT true,
  presupuesto_max numeric(12,2),
  tipo_inmueble   text,           -- piso, casa, local…
  habitaciones_min int,
  ascensor        boolean DEFAULT false,
  zona_buscada    text,
  notas           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ── VENDEDORES (propietarios que venden/alquilan) ───────────
CREATE TABLE IF NOT EXISTS vendedores (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre          text NOT NULL,
  dni             text,
  telefono        text,
  email           text,
  precio_minimo   numeric(12,2),
  descripcion     text,
  inmueble_ref    text,           -- ref del inmueble vinculado (NH-2026-XXXX)
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ── Índices ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS compradores_activo_idx ON compradores (activo);
CREATE INDEX IF NOT EXISTS vendedores_ref_idx    ON vendedores  (inmueble_ref);

-- ── RLS ───────────────────────────────────────────────────────
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendedores  ENABLE ROW LEVEL SECURITY;

-- Solo usuarios autenticados pueden leer/escribir
DROP POLICY IF EXISTS "Admin compradores rw" ON compradores;
CREATE POLICY "Admin compradores rw" ON compradores
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin vendedores rw" ON vendedores;
CREATE POLICY "Admin vendedores rw" ON vendedores
  TO authenticated USING (true) WITH CHECK (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS compradores_updated_at ON compradores;
CREATE TRIGGER compradores_updated_at
  BEFORE UPDATE ON compradores
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

DROP TRIGGER IF EXISTS vendedores_updated_at ON vendedores;
CREATE TRIGGER vendedores_updated_at
  BEFORE UPDATE ON vendedores
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
