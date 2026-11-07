-- Secciones adicionales editables: hero, process, about (nosotros)

insert into public.page_sections (
  id, section_key, section_type, title, display_order, is_visible,
  draft_content, published_content, has_unpublished_changes
) values
(
  '55555555-5555-5555-5555-555555555503',
  'process',
  'process',
  'Cómo trabajamos',
  3,
  true,
  '{
    "eyebrow": "Del contacto al trabajo listo",
    "headline": "Cómo",
    "highlight": "trabajamos",
    "subheadline": "Un proceso corto y concreto: menos vueltas, más claridad en cada paso.",
    "steps": [
      {"title":"Nos contactás","description":"WhatsApp o formulario: contanos qué pasó y en qué zona estás.","icon_key":"message"},
      {"title":"Coordinamos","description":"Definimos visita o intervención según urgencia y disponibilidad.","icon_key":"calendar"},
      {"title":"Resolvemos","description":"Ejecutamos el trabajo con criterio técnico y materiales acordes.","icon_key":"wrench"},
      {"title":"Cerramos el servicio","description":"Te explicamos lo realizado y dejamos todo en condiciones de uso.","icon_key":"thumbs"}
    ]
  }'::jsonb,
  '{
    "eyebrow": "Del contacto al trabajo listo",
    "headline": "Cómo",
    "highlight": "trabajamos",
    "subheadline": "Un proceso corto y concreto: menos vueltas, más claridad en cada paso.",
    "steps": [
      {"title":"Nos contactás","description":"WhatsApp o formulario: contanos qué pasó y en qué zona estás.","icon_key":"message"},
      {"title":"Coordinamos","description":"Definimos visita o intervención según urgencia y disponibilidad.","icon_key":"calendar"},
      {"title":"Resolvemos","description":"Ejecutamos el trabajo con criterio técnico y materiales acordes.","icon_key":"wrench"},
      {"title":"Cerramos el servicio","description":"Te explicamos lo realizado y dejamos todo en condiciones de uso.","icon_key":"thumbs"}
    ]
  }'::jsonb,
  false
),
(
  '55555555-5555-5555-5555-555555555504',
  'hero',
  'hero',
  'Hero inicio',
  0,
  true,
  '{
    "eyebrow": "Instalaciones y mantenimiento profesional",
    "headline_line1": "Soluciones técnicas",
    "headline_prefix": "para tu",
    "rotating_words": ["hogar","empresa","negocio","consorcio","obra","local"],
    "subheadline": "Plomería, gas, electricidad y más. Trabajo profesional, respuesta rápida y trato directo en cada intervención.",
    "primary_cta_label": "Ver servicios",
    "primary_cta_href": "#servicios",
    "secondary_cta_label": "Pedir presupuesto",
    "secondary_cta_message": "Hola Seprogar, quiero solicitar un presupuesto",
    "stats": [
      {"value":"5+","label":"Años de experiencia","icon_key":"shield"},
      {"value":"500+","label":"Clientes atendidos","icon_key":""},
      {"value":"24/7","label":"Emergencias","icon_key":"clock"},
      {"value":"CABA","label":"y GBA","icon_key":""}
    ]
  }'::jsonb,
  '{
    "eyebrow": "Instalaciones y mantenimiento profesional",
    "headline_line1": "Soluciones técnicas",
    "headline_prefix": "para tu",
    "rotating_words": ["hogar","empresa","negocio","consorcio","obra","local"],
    "subheadline": "Plomería, gas, electricidad y más. Trabajo profesional, respuesta rápida y trato directo en cada intervención.",
    "primary_cta_label": "Ver servicios",
    "primary_cta_href": "#servicios",
    "secondary_cta_label": "Pedir presupuesto",
    "secondary_cta_message": "Hola Seprogar, quiero solicitar un presupuesto",
    "stats": [
      {"value":"5+","label":"Años de experiencia","icon_key":"shield"},
      {"value":"500+","label":"Clientes atendidos","icon_key":""},
      {"value":"24/7","label":"Emergencias","icon_key":"clock"},
      {"value":"CABA","label":"y GBA","icon_key":""}
    ]
  }'::jsonb,
  false
),
(
  '55555555-5555-5555-5555-555555555505',
  'about',
  'about',
  'Nosotros',
  4,
  true,
  '{
    "eyebrow": "La empresa",
    "headline": "SEPROGAR, soluciones técnicas con foco en el día a día",
    "body_1": "Somos un equipo de oficios e instalaciones para hogar, comercio y edificios. Trabajamos plomería, gas, electricidad, aires y pintura con una idea simple: diagnosticar bien y ejecutar con orden.",
    "body_2": "No vendemos paquetes genéricos: cada caso se evalúa según el lugar, la urgencia y lo que realmente hace falta para dejar el sistema funcionando.",
    "cta_label": "Hablar con el equipo",
    "cta_message": "Hola Seprogar, quiero conocer más sobre ustedes",
    "photo_url": "",
    "photo_caption": "El equipo detrás de cada servicio",
    "photo_placeholder_title": "Foto del equipo",
    "photo_placeholder_body": "Espacio reservado. Cuando tengas la imagen, la reemplazamos acá.",
    "highlights": [
      {"title":"Criterio técnico","description":"Priorizamos seguridad y normativa en instalaciones sensibles como gas y electricidad.","icon_key":"shield"},
      {"title":"Respuesta ágil","description":"Coordinamos según urgencia. Emergencias se evalúan al momento por WhatsApp.","icon_key":"clock"},
      {"title":"Trato directo","description":"Hablás con el equipo que interviene: comunicación clara de punta a punta.","icon_key":"users"}
    ]
  }'::jsonb,
  '{
    "eyebrow": "La empresa",
    "headline": "SEPROGAR, soluciones técnicas con foco en el día a día",
    "body_1": "Somos un equipo de oficios e instalaciones para hogar, comercio y edificios. Trabajamos plomería, gas, electricidad, aires y pintura con una idea simple: diagnosticar bien y ejecutar con orden.",
    "body_2": "No vendemos paquetes genéricos: cada caso se evalúa según el lugar, la urgencia y lo que realmente hace falta para dejar el sistema funcionando.",
    "cta_label": "Hablar con el equipo",
    "cta_message": "Hola Seprogar, quiero conocer más sobre ustedes",
    "photo_url": "",
    "photo_caption": "El equipo detrás de cada servicio",
    "photo_placeholder_title": "Foto del equipo",
    "photo_placeholder_body": "Espacio reservado. Cuando tengas la imagen, la reemplazamos acá.",
    "highlights": [
      {"title":"Criterio técnico","description":"Priorizamos seguridad y normativa en instalaciones sensibles como gas y electricidad.","icon_key":"shield"},
      {"title":"Respuesta ágil","description":"Coordinamos según urgencia. Emergencias se evalúan al momento por WhatsApp.","icon_key":"clock"},
      {"title":"Trato directo","description":"Hablás con el equipo que interviene: comunicación clara de punta a punta.","icon_key":"users"}
    ]
  }'::jsonb,
  false
)
on conflict (section_key) do nothing;
