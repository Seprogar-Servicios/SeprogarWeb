-- SEPROGAR: catálogo de especialidades, trabajos, fotografías y equipo
-- Seguridad: RLS estricto; escritura solo para perfiles con is_admin = true

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Perfiles / administradores
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_is_admin_idx on public.profiles (is_admin) where is_admin = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    false
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- Especialidades
-- ---------------------------------------------------------------------------
create table public.especialidades (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null,
  descripcion_breve text,
  descripcion_completa text,
  imagen_portada text,
  orden integer not null default 0,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint especialidades_slug_unique unique (slug),
  constraint especialidades_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index especialidades_publicado_orden_idx
  on public.especialidades (publicado, orden);

create trigger especialidades_set_updated_at
before update on public.especialidades
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Trabajos
-- ---------------------------------------------------------------------------
create table public.trabajos (
  id uuid primary key default gen_random_uuid(),
  especialidad_id uuid not null references public.especialidades (id) on delete cascade,
  titulo text not null,
  descripcion text,
  orden integer not null default 0,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trabajos_especialidad_publicado_orden_idx
  on public.trabajos (especialidad_id, publicado, orden);

create trigger trabajos_set_updated_at
before update on public.trabajos
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Fotografías (referencias a Storage, no Base64)
-- ---------------------------------------------------------------------------
create table public.fotografias (
  id uuid primary key default gen_random_uuid(),
  trabajo_id uuid not null references public.trabajos (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index fotografias_trabajo_orden_idx
  on public.fotografias (trabajo_id, orden);

-- ---------------------------------------------------------------------------
-- Personas / equipo
-- ---------------------------------------------------------------------------
create table public.personas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  cargo text,
  fotografia_path text,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger personas_set_updated_at
before update on public.personas
for each row execute function public.set_updated_at();

create table public.persona_especialidad (
  persona_id uuid not null references public.personas (id) on delete cascade,
  especialidad_id uuid not null references public.especialidades (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (persona_id, especialidad_id)
);

create index persona_especialidad_especialidad_idx
  on public.persona_especialidad (especialidad_id);

-- ---------------------------------------------------------------------------
-- Extensión futura (newsletter): no se usa aún; solo deja el espacio de esquema
-- separado del catálogo y de Auth admin. Activar cuando se apruebe el alcance.
-- ---------------------------------------------------------------------------
-- create table public.newsletter_subscribers (
--   id uuid primary key default gen_random_uuid(),
--   email text not null unique,
--   nombre text,
--   consent_at timestamptz,
--   status text not null default 'pending',
--   created_at timestamptz not null default now()
-- );

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.especialidades enable row level security;
alter table public.trabajos enable row level security;
alter table public.fotografias enable row level security;
alter table public.personas enable row level security;
alter table public.persona_especialidad enable row level security;

-- Profiles
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_limited"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and is_admin = (select p.is_admin from public.profiles p where p.id = auth.uid())
  );

create policy "profiles_admin_update"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Especialidades: lectura pública solo publicadas; admin todo
create policy "especialidades_public_read"
  on public.especialidades for select
  to anon, authenticated
  using (publicado = true or public.is_admin());

create policy "especialidades_admin_insert"
  on public.especialidades for insert
  to authenticated
  with check (public.is_admin());

create policy "especialidades_admin_update"
  on public.especialidades for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "especialidades_admin_delete"
  on public.especialidades for delete
  to authenticated
  using (public.is_admin());

-- Trabajos
create policy "trabajos_public_read"
  on public.trabajos for select
  to anon, authenticated
  using (
    (publicado = true and exists (
      select 1 from public.especialidades e
      where e.id = especialidad_id and e.publicado = true
    ))
    or public.is_admin()
  );

create policy "trabajos_admin_insert"
  on public.trabajos for insert
  to authenticated
  with check (public.is_admin());

create policy "trabajos_admin_update"
  on public.trabajos for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "trabajos_admin_delete"
  on public.trabajos for delete
  to authenticated
  using (public.is_admin());

-- Fotografías: visibles si el trabajo (y especialidad) están publicados
create policy "fotografias_public_read"
  on public.fotografias for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.trabajos t
      join public.especialidades e on e.id = t.especialidad_id
      where t.id = trabajo_id
        and (
          (t.publicado = true and e.publicado = true)
          or public.is_admin()
        )
    )
  );

create policy "fotografias_admin_insert"
  on public.fotografias for insert
  to authenticated
  with check (public.is_admin());

create policy "fotografias_admin_update"
  on public.fotografias for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "fotografias_admin_delete"
  on public.fotografias for delete
  to authenticated
  using (public.is_admin());

-- Personas
create policy "personas_public_read"
  on public.personas for select
  to anon, authenticated
  using (publicado = true or public.is_admin());

create policy "personas_admin_insert"
  on public.personas for insert
  to authenticated
  with check (public.is_admin());

create policy "personas_admin_update"
  on public.personas for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "personas_admin_delete"
  on public.personas for delete
  to authenticated
  using (public.is_admin());

-- Relación persona–especialidad: visible si persona y especialidad publicadas
create policy "persona_especialidad_public_read"
  on public.persona_especialidad for select
  to anon, authenticated
  using (
    public.is_admin()
    or (
      exists (select 1 from public.personas p where p.id = persona_id and p.publicado = true)
      and exists (select 1 from public.especialidades e where e.id = especialidad_id and e.publicado = true)
    )
  );

create policy "persona_especialidad_admin_insert"
  on public.persona_especialidad for insert
  to authenticated
  with check (public.is_admin());

create policy "persona_especialidad_admin_delete"
  on public.persona_especialidad for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: bucket público de lectura, escritura solo admin
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalogo',
  'catalogo',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "catalogo_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'catalogo');

create policy "catalogo_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'catalogo' and public.is_admin());

create policy "catalogo_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'catalogo' and public.is_admin())
  with check (bucket_id = 'catalogo' and public.is_admin());

create policy "catalogo_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'catalogo' and public.is_admin());
