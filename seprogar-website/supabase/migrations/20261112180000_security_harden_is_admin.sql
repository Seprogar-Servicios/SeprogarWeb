-- Endurecimiento: anon no ejecuta is_admin(); las policies de lectura pública
-- dejan de llamarla (antes siempre era false para anon, pero exigía EXECUTE).

-- Especialidades
drop policy if exists "especialidades_public_read" on public.especialidades;
create policy "especialidades_public_read"
  on public.especialidades for select
  to anon, authenticated
  using (publicado = true);

create policy "especialidades_admin_select"
  on public.especialidades for select
  to authenticated
  using (public.is_admin());

-- Trabajos
drop policy if exists "trabajos_public_read" on public.trabajos;
create policy "trabajos_public_read"
  on public.trabajos for select
  to anon, authenticated
  using (
    publicado = true
    and exists (
      select 1 from public.especialidades e
      where e.id = especialidad_id and e.publicado = true
    )
  );

create policy "trabajos_admin_select"
  on public.trabajos for select
  to authenticated
  using (public.is_admin());

-- Fotografías
drop policy if exists "fotografias_public_read" on public.fotografias;
create policy "fotografias_public_read"
  on public.fotografias for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.trabajos t
      join public.especialidades e on e.id = t.especialidad_id
      where t.id = trabajo_id
        and t.publicado = true
        and e.publicado = true
    )
  );

create policy "fotografias_admin_select"
  on public.fotografias for select
  to authenticated
  using (public.is_admin());

-- Personas
drop policy if exists "personas_public_read" on public.personas;
create policy "personas_public_read"
  on public.personas for select
  to anon, authenticated
  using (publicado = true);

create policy "personas_admin_select"
  on public.personas for select
  to authenticated
  using (public.is_admin());

-- Relación persona–especialidad
drop policy if exists "persona_especialidad_public_read" on public.persona_especialidad;
create policy "persona_especialidad_public_read"
  on public.persona_especialidad for select
  to anon, authenticated
  using (
    exists (select 1 from public.personas p where p.id = persona_id and p.publicado = true)
    and exists (select 1 from public.especialidades e where e.id = especialidad_id and e.publicado = true)
  );

create policy "persona_especialidad_admin_select"
  on public.persona_especialidad for select
  to authenticated
  using (public.is_admin());

revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;
