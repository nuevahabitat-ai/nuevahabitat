-- ============================================================
-- MIGRACIÓN 002 – Campos completos para inmuebles
-- Pega este bloque en: Supabase > SQL Editor > New query
-- ============================================================

-- Propietario
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS propietario_nombre    text;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS propietario_telefono  text;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS propietario_email     text;

-- Identificación
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS referencia            text;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS tipo                  text DEFAULT 'piso';
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS tipo_operacion        text DEFAULT 'venta';
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS publicado             boolean DEFAULT false;

-- Ubicación
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS direccion_calle       text;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS direccion_numero      text;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS direccion_piso        text;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS cp                    text;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS municipio             text;

-- Distribución
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS dormitorios           int DEFAULT 0;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS aseos                 int DEFAULT 0;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS salon                 boolean DEFAULT false;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS terraza               boolean DEFAULT false;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS balcon                boolean DEFAULT false;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS garaje                boolean DEFAULT false;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS trastero              boolean DEFAULT false;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS ascensor              boolean DEFAULT false;

-- Superficies (m²)
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS m2_util               numeric;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS m2_construido         numeric;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS m2_terraza            numeric;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS m2_parcela            numeric;

-- Descripción y medios
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS descripcion           text;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS imagenes              text[] DEFAULT '{}';
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS video_url             text;
ALTER TABLE inmuebles ADD COLUMN IF NOT EXISTS plano_url             text;

-- ============================================================
-- Políticas de Storage para bucket "inmuebles"
-- ============================================================

-- Asegurar que el bucket existe y es público
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('inmuebles', 'inmuebles', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Eliminar políticas previas si existen (evita error de nombre duplicado)
DROP POLICY IF EXISTS "Public read inmuebles"  ON storage.objects;
DROP POLICY IF EXISTS "Auth upload inmuebles"  ON storage.objects;
DROP POLICY IF EXISTS "Auth delete inmuebles"  ON storage.objects;

-- Lectura pública (cualquiera puede ver las imágenes)
CREATE POLICY "Public read inmuebles" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'inmuebles');

-- Solo usuarios autenticados pueden subir
CREATE POLICY "Auth upload inmuebles" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'inmuebles');

-- Solo usuarios autenticados pueden borrar
CREATE POLICY "Auth delete inmuebles" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'inmuebles');

