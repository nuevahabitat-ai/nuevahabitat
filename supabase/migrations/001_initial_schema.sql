-- ============================================================
-- NuevaHabitat · Schema inicial Supabase/PostgreSQL
-- Migración 001 · Julio 2026
-- ============================================================

-- Extensiones necesarias
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";   -- búsqueda full-text

-- ============================================================
-- ENUM types
-- ============================================================
create type property_status as enum ('disponible','reservado','vendido','retirado');
create type property_type   as enum ('piso','atico','casa','duplex','local','oficina','garaje');
create type energy_rating   as enum ('A','B','C','D','E','F','G');
create type user_role       as enum ('cliente','agente','admin');
create type lead_type       as enum ('compra','venta','hipoteca','valoracion','info');
create type lead_status     as enum ('nuevo','contactado','cualificado','descartado','cerrado');
create type visit_status    as enum ('pendiente','confirmada','realizada','cancelada');

-- ============================================================
-- AGENTES
-- ============================================================
create table agentes (
  id          uuid primary key default uuid_generate_v4(),
  nombre      text not null,
  apellidos   text not null,
  email       text not null unique,
  telefono    text,
  foto_url    text,
  zona        text[],            -- ['Eixample','Gràcia']
  activo      boolean default true,
  created_at  timestamptz default now()
);

comment on table agentes is 'Agentes inmobiliarios de NuevaHabitat';

-- ============================================================
-- INMUEBLES
-- ============================================================
create table inmuebles (
  id                uuid primary key default uuid_generate_v4(),
  ref               text unique not null,          -- NH-EIX-001
  slug              text unique not null,          -- inmueble-eixample
  titulo            text not null,
  descripcion       text,
  tipo              property_type not null default 'piso',
  estado            property_status not null default 'disponible',

  -- Precio
  precio            numeric(12,2) not null,
  precio_m2         numeric(10,2),
  gastos_comunidad  numeric(8,2),
  ibi_anual         numeric(8,2),

  -- Superficie
  m2_construidos    numeric(8,2),
  m2_utiles         numeric(8,2),
  m2_terraza        numeric(8,2),

  -- Características
  habitaciones      smallint,
  banos             smallint,
  planta            text,
  orientacion       text,
  anyo_construccion smallint,
  anyo_reforma      smallint,
  eficiencia        energy_rating,
  consumo_kwh       numeric(8,2),
  emisiones_co2     numeric(8,2),

  -- Extras booleanos
  ascensor          boolean default false,
  parking           boolean default false,
  trastero          boolean default false,
  piscina           boolean default false,
  jardin            boolean default false,
  aire_acondicionado boolean default false,
  calefaccion       boolean default false,
  armarios_empotrados boolean default false,
  cocina_equipada   boolean default false,

  -- Ubicación
  barrio            text,
  municipio         text default 'Barcelona',
  provincia         text default 'Barcelona',
  cp                text,
  direccion         text,
  lat               double precision,
  lng               double precision,

  -- Media
  imagenes          text[],       -- URLs en Supabase Storage
  imagen_principal  text,
  video_url         text,
  tour_virtual_url  text,

  -- Relaciones
  agente_id         uuid references agentes(id),

  -- Meta
  vistas            integer default 0,
  favoritos         integer default 0,
  destacado         boolean default false,
  exclusivo         boolean default false,
  cartera_privada   boolean default false,   -- no publicado en portales

  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

comment on table inmuebles is 'Cartera de inmuebles de NuevaHabitat';
comment on column inmuebles.cartera_privada is 'Si es true, solo visible para compradores registrados';

create index on inmuebles (estado);
create index on inmuebles (tipo);
create index on inmuebles (precio);
create index on inmuebles (barrio);
create index on inmuebles (destacado) where destacado = true;
create index on inmuebles using gin (titulo gin_trgm_ops);

-- Trigger updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger inmuebles_updated_at
  before update on inmuebles
  for each row execute function set_updated_at();

-- ============================================================
-- PERFILES DE USUARIO (vinculado a auth.users de Supabase)
-- ============================================================
create table perfiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text,
  apellidos   text,
  telefono    text,
  rol         user_role not null default 'cliente',
  agente_id   uuid references agentes(id),  -- si es cliente, agente asignado
  zona_interes text[],
  presupuesto_min numeric(12,2),
  presupuesto_max numeric(12,2),
  tipo_busqueda lead_type,
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create trigger perfiles_updated_at
  before update on perfiles
  for each row execute function set_updated_at();

-- ============================================================
-- LEADS / CONTACTOS
-- ============================================================
create table leads (
  id            uuid primary key default uuid_generate_v4(),
  nombre        text not null,
  telefono      text not null,
  email         text,
  tipo          lead_type not null,
  estado        lead_status not null default 'nuevo',
  mensaje       text,
  inmueble_id   uuid references inmuebles(id),
  agente_id     uuid references agentes(id),
  perfil_id     uuid references perfiles(id),
  zona          text,
  presupuesto   text,
  habitaciones  text,
  origen        text,              -- 'web_comprar','web_vender','inmueble_eixample'...
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  notas         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index on leads (estado);
create index on leads (tipo);
create index on leads (agente_id);
create index on leads (created_at desc);

create trigger leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- ============================================================
-- FAVORITOS
-- ============================================================
create table favoritos (
  id          uuid primary key default uuid_generate_v4(),
  perfil_id   uuid not null references perfiles(id) on delete cascade,
  inmueble_id uuid not null references inmuebles(id) on delete cascade,
  created_at  timestamptz default now(),
  unique (perfil_id, inmueble_id)
);

create index on favoritos (perfil_id);

-- ============================================================
-- VISITAS
-- ============================================================
create table visitas (
  id            uuid primary key default uuid_generate_v4(),
  inmueble_id   uuid not null references inmuebles(id),
  lead_id       uuid references leads(id),
  perfil_id     uuid references perfiles(id),
  agente_id     uuid references agentes(id),
  estado        visit_status not null default 'pendiente',
  fecha_hora    timestamptz not null,
  duracion_min  smallint default 30,
  notas         text,
  feedback      text,        -- notas post-visita del agente
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index on visitas (inmueble_id);
create index on visitas (agente_id);
create index on visitas (fecha_hora);

create trigger visitas_updated_at
  before update on visitas
  for each row execute function set_updated_at();

-- ============================================================
-- VALORACIONES DE INMUEBLES (para vender)
-- ============================================================
create table valoraciones (
  id            uuid primary key default uuid_generate_v4(),
  lead_id       uuid references leads(id),
  perfil_id     uuid references perfiles(id),
  agente_id     uuid references agentes(id),
  direccion     text not null,
  barrio        text,
  municipio     text,
  tipo          property_type,
  m2            numeric(8,2),
  habitaciones  smallint,
  banos         smallint,
  planta        text,
  ascensor      boolean,
  estado_inmueble text,
  precio_estimado_min numeric(12,2),
  precio_estimado_max numeric(12,2),
  notas         text,
  enviada_al_cliente boolean default false,
  created_at    timestamptz default now()
);

-- ============================================================
-- BLOG
-- ============================================================
create table blog_posts (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  titulo        text not null,
  extracto      text,
  contenido     text,          -- HTML o Markdown
  imagen_url    text,
  categoria     text,          -- 'mercado','comprar','vender','hipotecas','juridico'
  tags          text[],
  autor_nombre  text,
  autor_foto    text,
  publicado     boolean default false,
  publicado_en  timestamptz,
  vistas        integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index on blog_posts (publicado) where publicado = true;
create index on blog_posts (categoria);
create index on blog_posts (publicado_en desc);

create trigger blog_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

-- ============================================================
-- NEWSLETTER
-- ============================================================
create table newsletter (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null unique,
  activo      boolean default true,
  created_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Inmuebles: lectura pública para disponibles; escritura solo admin/agente
alter table inmuebles enable row level security;
create policy "inmuebles_public_read" on inmuebles
  for select using (estado != 'retirado');
create policy "inmuebles_admin_write" on inmuebles
  for all using (
    exists (select 1 from perfiles where id = auth.uid() and rol in ('admin','agente'))
  );

-- Perfiles: cada usuario ve y edita el suyo
alter table perfiles enable row level security;
create policy "perfiles_own" on perfiles
  for all using (id = auth.uid());
create policy "agentes_see_clients" on perfiles
  for select using (
    exists (select 1 from perfiles p where p.id = auth.uid() and p.rol in ('admin','agente'))
  );

-- Leads: solo agentes y admins
alter table leads enable row level security;
create policy "leads_agentes" on leads
  for all using (
    exists (select 1 from perfiles where id = auth.uid() and rol in ('admin','agente'))
  );
create policy "leads_own" on leads
  for select using (perfil_id = auth.uid());

-- Favoritos: cada usuario ve los suyos
alter table favoritos enable row level security;
create policy "favoritos_own" on favoritos
  for all using (perfil_id = auth.uid());

-- Visitas
alter table visitas enable row level security;
create policy "visitas_agentes" on visitas
  for all using (
    exists (select 1 from perfiles where id = auth.uid() and rol in ('admin','agente'))
  );

-- Blog: lectura pública de publicados
alter table blog_posts enable row level security;
create policy "blog_public" on blog_posts
  for select using (publicado = true);
create policy "blog_admin_write" on blog_posts
  for all using (
    exists (select 1 from perfiles where id = auth.uid() and rol = 'admin')
  );

-- ============================================================
-- DATOS INICIALES — Agentes
-- ============================================================
insert into agentes (nombre, apellidos, email, telefono, zona) values
  ('Jordi',  'Martínez',  'jordi@nuevahabitat.com',  '600367742', ARRAY['Eixample','Gràcia']),
  ('Maria',  'Costa',     'maria@nuevahabitat.com',  '613640673', ARRAY['Sarrià','Sant Cugat','Sant Gervasi']),
  ('Laura',  'Pons',      'laura@nuevahabitat.com',  '600000001', ARRAY['Gràcia','Sarrià']),
  ('Àlex',   'Ruiz',      'alex@nuevahabitat.com',   '600000002', ARRAY['Poblenou','22@','Sant Martí']);

-- ============================================================
-- DATOS INICIALES — Inmuebles de muestra
-- ============================================================
insert into inmuebles (ref, slug, titulo, tipo, estado, precio, m2_construidos, habitaciones, banos, planta, barrio, municipio, agente_id, ascensor, imagen_principal, cartera_privada, destacado) values
  ('NH-EIX-001','inmueble-eixample','Piso reformado con terraza exterior','piso','disponible',485000,92,3,2,'4a','Eixample Derecha','Barcelona',(select id from agentes where email='jordi@nuevahabitat.com'),true,'imagenes/interior2.jpg',false,true),
  ('NH-GRA-002','inmueble-gracia','Piso luminoso con balcón y ascensor','piso','disponible',380000,75,2,1,'3a','Gràcia','Barcelona',(select id from agentes where email='maria@nuevahabitat.com'),true,'imagenes/interior4.jpg',false,false),
  ('NH-SGV-003','inmueble-sant-gervasi','Ático con vistas panorámicas','atico','reservado',720000,145,4,2,'Ático','Sant Gervasi','Barcelona',(select id from agentes where email='jordi@nuevahabitat.com'),true,'imagenes/3d-contemporary-bedroom-interior.jpg',false,true),
  ('NH-SAR-004','inmueble-sarria','Piso acogedor con suelos de mármol','piso','disponible',310000,68,2,1,'1a','Sarrià','Barcelona',(select id from agentes where email='maria@nuevahabitat.com'),false,'imagenes/interior1.jpg',false,false),
  ('NH-POB-005','inmueble-poblenou','Piso moderno en nueva construcción','piso','disponible',425000,88,3,2,'5a','Poblenou','Barcelona',(select id from agentes where email='alex@nuevahabitat.com'),true,'imagenes/interior5.jpg',false,false),
  ('NH-SCU-006','inmueble-sant-cugat','Casa unifamiliar con jardín privado','casa','disponible',620000,180,4,3,'2 plantas','Sant Cugat del Vallès','Sant Cugat del Vallès',(select id from agentes where email='maria@nuevahabitat.com'),false,'imagenes/modern-styled-small-entryway.jpg',false,true);
