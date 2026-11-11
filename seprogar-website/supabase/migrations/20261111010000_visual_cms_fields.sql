-- Amplía section_type con 'services' e inserta intro editable de servicios.
-- El campo background_image_url del hero se agrega vía JSON (sin ALTER de columnas).

alter table public.page_sections
  drop constraint if exists page_sections_section_type_check;

alter table public.page_sections
  add constraint page_sections_section_type_check
  check (section_type in (
    'faq', 'coverage', 'contact', 'hero', 'process', 'about', 'services', 'custom'
  ));

insert into public.page_sections (
  id, section_key, section_type, title, display_order, is_visible,
  draft_content, published_content, has_unpublished_changes
) values (
  '55555555-5555-5555-5555-555555555506',
  'services',
  'services',
  'Servicios',
  1,
  true,
  '{
    "eyebrow": "Servicios",
    "headline": "Nuestros",
    "highlight": "servicios",
    "subheadline": "Especialidades disponibles. Entrá al detalle para ver trabajos realizados."
  }'::jsonb,
  '{
    "eyebrow": "Servicios",
    "headline": "Nuestros",
    "highlight": "servicios",
    "subheadline": "Especialidades disponibles. Entrá al detalle para ver trabajos realizados."
  }'::jsonb,
  false
)
on conflict (section_key) do nothing;

-- Merge background_image_url en hero existente (no pisa si ya está)
update public.page_sections
set
  draft_content = draft_content || '{"background_image_url":""}'::jsonb,
  published_content = published_content || '{"background_image_url":""}'::jsonb
where section_key = 'hero'
  and not (draft_content ? 'background_image_url');
