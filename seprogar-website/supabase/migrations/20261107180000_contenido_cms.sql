-- CMS liviano: ajustes de contacto + secciones editables (faq, coverage)
-- Lectura pública solo vía vistas (sin borradores).

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'SEPROGAR',
  contact_email text,
  phone_display text,
  phone_tel text,
  whatsapp text,
  address text,
  map_url text,
  social_links jsonb not null default '{}'::jsonb,
  hours jsonb not null default '[]'::jsonb,
  draft_payload jsonb,
  published_payload jsonb,
  has_unpublished_changes boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  section_type text not null
    check (section_type in ('faq', 'coverage', 'contact', 'hero', 'process', 'about', 'custom')),
  title text,
  draft_content jsonb not null default '{}'::jsonb,
  published_content jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  has_unpublished_changes boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists page_sections_order_idx
  on public.page_sections (display_order);

create trigger page_sections_set_updated_at
before update on public.page_sections
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.page_sections enable row level security;

create policy site_settings_admin_select
  on public.site_settings for select
  to authenticated
  using (public.is_admin());

create policy site_settings_admin_write
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy page_sections_admin_select
  on public.page_sections for select
  to authenticated
  using (public.is_admin());

create policy page_sections_admin_write
  on public.page_sections for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create or replace view public.v_public_site_settings
with (security_invoker = false)
as
select
  id,
  coalesce(published_payload, jsonb_build_object(
    'site_name', site_name,
    'contact_email', contact_email,
    'phone_display', phone_display,
    'phone_tel', phone_tel,
    'whatsapp', whatsapp,
    'address', address,
    'map_url', map_url,
    'social_links', social_links,
    'hours', hours
  )) as payload,
  updated_at
from public.site_settings;

create or replace view public.v_public_page_sections
with (security_invoker = false)
as
select
  id,
  section_key,
  section_type,
  title,
  published_content as content,
  display_order,
  is_visible,
  updated_at
from public.page_sections
where is_visible = true;

grant select on public.v_public_site_settings to anon, authenticated;
grant select on public.v_public_page_sections to anon, authenticated;

-- Datos iniciales (idempotente)
insert into public.site_settings (
  id,
  site_name,
  contact_email,
  phone_display,
  phone_tel,
  whatsapp,
  address,
  map_url,
  social_links,
  hours,
  draft_payload,
  published_payload,
  has_unpublished_changes
) values (
  '44444444-4444-4444-4444-444444444401',
  'SEPROGAR',
  'contacto@seprogar.com',
  '+54 9 11 2848-4962',
  '+5491128484962',
  '5491128484962',
  'Av. Siempreviva 742, Buenos Aires',
  null,
  '{"facebook":"#","instagram":"#","linkedin":"#"}'::jsonb,
  '[
    {"label":"Lunes - Domingos","value":"8:00 - 18:00"},
    {"label":"Atención regular","value":"8:00 - 18:00"},
    {"label":"Emergencias","value":"Atención 24/7"}
  ]'::jsonb,
  null,
  null,
  false
)
on conflict (id) do nothing;

update public.site_settings
set
  published_payload = jsonb_build_object(
    'site_name', site_name,
    'contact_email', contact_email,
    'phone_display', phone_display,
    'phone_tel', phone_tel,
    'whatsapp', whatsapp,
    'address', address,
    'map_url', map_url,
    'social_links', social_links,
    'hours', hours
  ),
  draft_payload = coalesce(draft_payload, jsonb_build_object(
    'site_name', site_name,
    'contact_email', contact_email,
    'phone_display', phone_display,
    'phone_tel', phone_tel,
    'whatsapp', whatsapp,
    'address', address,
    'map_url', map_url,
    'social_links', social_links,
    'hours', hours
  ))
where id = '44444444-4444-4444-4444-444444444401'
  and published_payload is null;

insert into public.page_sections (
  id, section_key, section_type, title, display_order, is_visible,
  draft_content, published_content, has_unpublished_changes
) values
(
  '55555555-5555-5555-5555-555555555501',
  'faq',
  'faq',
  'Preguntas frecuentes',
  1,
  true,
  '{
    "eyebrow": "Antes de escribirnos",
    "headline": "Preguntas",
    "highlight": "frecuentes",
    "subheadline": "Armamos esta guía con lo que más consultan: servicios, urgencias, zonas y cómo coordinar. Si tu caso es distinto, hablanos directo.",
    "items": [
      {"question":"¿Qué servicios cubren?","answer":"Plomería, gas, electricidad, aires acondicionados y pintura, entre otros trabajos de instalación y mantenimiento. Si tu necesidad es puntual, escribinos y te decimos si podemos tomarlo."},
      {"question":"¿Atienden emergencias?","answer":"Sí. Para urgencias (fugas, cortes, fallas críticas) escribinos por WhatsApp con zona y una breve descripción. Priorizamos según gravedad y disponibilidad del equipo."},
      {"question":"¿En qué horarios trabajan?","answer":"Atención habitual de lunes a domingo en franja diurna. Fuera de ese horario se evalúan emergencias caso por caso."},
      {"question":"¿Cómo pido un presupuesto?","answer":"Por WhatsApp o desde el formulario de contacto. Con fotos y una descripción breve podemos orientarte mejor. Si hace falta visita técnica, te lo avisamos antes de coordinarla."},
      {"question":"¿La visita tiene costo?","answer":"La orientación inicial por mensaje es sin cargo. Si el caso requiere relevamiento en el lugar, te confirmamos condiciones antes de agendar."},
      {"question":"¿Trabajan con instalaciones de gas certificadas?","answer":"Realizamos instalaciones y trabajos relacionados con gas respetando la normativa vigente. Consultanos el tipo de instalación para confirmar documentación y requisitos."},
      {"question":"¿Llegan a mi zona?","answer":"Cubrimos CABA y Gran Buenos Aires (norte, oeste y sur). Si estás en el límite o en otra localidad, consultá igual: coordinamos según distancia y agenda."},
      {"question":"¿Qué necesito tener listo el día del trabajo?","answer":"Acceso al lugar, alguien que pueda autorizar la intervención y, si aplica, datos del medidor o tablero. Te indicamos lo específico al confirmar el turno."}
    ],
    "cta_title": "¿No encontrás tu duda?",
    "cta_body": "Mandanos un mensaje con tu zona y el problema. Te respondemos con la próxima acción concreta.",
    "cta_label": "Consultar por WhatsApp",
    "cta_message": "Hola Seprogar, tengo una consulta"
  }'::jsonb,
  '{
    "eyebrow": "Antes de escribirnos",
    "headline": "Preguntas",
    "highlight": "frecuentes",
    "subheadline": "Armamos esta guía con lo que más consultan: servicios, urgencias, zonas y cómo coordinar. Si tu caso es distinto, hablanos directo.",
    "items": [
      {"question":"¿Qué servicios cubren?","answer":"Plomería, gas, electricidad, aires acondicionados y pintura, entre otros trabajos de instalación y mantenimiento. Si tu necesidad es puntual, escribinos y te decimos si podemos tomarlo."},
      {"question":"¿Atienden emergencias?","answer":"Sí. Para urgencias (fugas, cortes, fallas críticas) escribinos por WhatsApp con zona y una breve descripción. Priorizamos según gravedad y disponibilidad del equipo."},
      {"question":"¿En qué horarios trabajan?","answer":"Atención habitual de lunes a domingo en franja diurna. Fuera de ese horario se evalúan emergencias caso por caso."},
      {"question":"¿Cómo pido un presupuesto?","answer":"Por WhatsApp o desde el formulario de contacto. Con fotos y una descripción breve podemos orientarte mejor. Si hace falta visita técnica, te lo avisamos antes de coordinarla."},
      {"question":"¿La visita tiene costo?","answer":"La orientación inicial por mensaje es sin cargo. Si el caso requiere relevamiento en el lugar, te confirmamos condiciones antes de agendar."},
      {"question":"¿Trabajan con instalaciones de gas certificadas?","answer":"Realizamos instalaciones y trabajos relacionados con gas respetando la normativa vigente. Consultanos el tipo de instalación para confirmar documentación y requisitos."},
      {"question":"¿Llegan a mi zona?","answer":"Cubrimos CABA y Gran Buenos Aires (norte, oeste y sur). Si estás en el límite o en otra localidad, consultá igual: coordinamos según distancia y agenda."},
      {"question":"¿Qué necesito tener listo el día del trabajo?","answer":"Acceso al lugar, alguien que pueda autorizar la intervención y, si aplica, datos del medidor o tablero. Te indicamos lo específico al confirmar el turno."}
    ],
    "cta_title": "¿No encontrás tu duda?",
    "cta_body": "Mandanos un mensaje con tu zona y el problema. Te respondemos con la próxima acción concreta.",
    "cta_label": "Consultar por WhatsApp",
    "cta_message": "Hola Seprogar, tengo una consulta"
  }'::jsonb,
  false
),
(
  '55555555-5555-5555-5555-555555555502',
  'coverage',
  'coverage',
  'Zonas de atención',
  2,
  true,
  '{
    "eyebrow": "Cobertura",
    "headline": "Zonas de",
    "highlight": "atención",
    "subheadline": "Atendemos CABA y Gran Buenos Aires. Si tu zona no aparece en la lista, escribinos igual: coordinamos según disponibilidad y urgencia.",
    "zones": ["CABA", "Zona Norte", "Zona Oeste", "Zona Sur", "GBA", "Consultá tu zona"],
    "cta_label": "Consultar mi zona",
    "cta_message": "Hola Seprogar, quiero consultar si atienden en mi zona",
    "note": "La cobertura exacta puede variar según el tipo de servicio y la demanda del día."
  }'::jsonb,
  '{
    "eyebrow": "Cobertura",
    "headline": "Zonas de",
    "highlight": "atención",
    "subheadline": "Atendemos CABA y Gran Buenos Aires. Si tu zona no aparece en la lista, escribinos igual: coordinamos según disponibilidad y urgencia.",
    "zones": ["CABA", "Zona Norte", "Zona Oeste", "Zona Sur", "GBA", "Consultá tu zona"],
    "cta_label": "Consultar mi zona",
    "cta_message": "Hola Seprogar, quiero consultar si atienden en mi zona",
    "note": "La cobertura exacta puede variar según el tipo de servicio y la demanda del día."
  }'::jsonb,
  false
)
on conflict (section_key) do nothing;
