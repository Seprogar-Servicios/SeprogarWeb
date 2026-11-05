-- Orden jerárquico para el carrusel de equipo en la home
-- (menor número = mayor jerarquía / aparece primero)

alter table public.personas
  add column if not exists orden integer not null default 0;

create index if not exists personas_publicado_orden_idx
  on public.personas (publicado, orden);
