-- Datos iniciales del catálogo (imágenes se suben a Storage con scripts/seed-media.mjs)

insert into public.especialidades (
  id, nombre, slug, descripcion_breve, descripcion_completa, imagen_portada, orden, publicado
) values
  (
    '11111111-1111-1111-1111-111111111101',
    'Plomería',
    'plomeria',
    'Soluciones integrales para tus necesidades de fontanería',
    'Servicios profesionales de plomería: reparación de fugas, instalaciones sanitarias, destapaciones, mantenimiento preventivo y atención de emergencias.',
    'especialidades/plomeria-portada.jpeg',
    1,
    true
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    'Gas',
    'gas',
    'Instalaciones seguras y certificadas',
    'Instalaciones de gas natural y envasado, detección de fugas, mantenimiento, habilitación y certificaciones con los más altos estándares de seguridad.',
    'especialidades/gas-portada.jpeg',
    2,
    true
  ),
  (
    '11111111-1111-1111-1111-111111111103',
    'Electricidad',
    'electricidad',
    'Soluciones eléctricas profesionales',
    'Instalaciones eléctricas, reparación de cortocircuitos, actualización de tableros, luminarias y mantenimiento industrial.',
    'especialidades/electricidad-portada.jpeg',
    3,
    true
  ),
  (
    '11111111-1111-1111-1111-111111111104',
    'Aires Acondicionados',
    'aires-acondicionados',
    'Instalación y mantenimiento de climatización',
    'Instalación de equipos split, mantenimiento preventivo, recarga de gas refrigerante, reparación de fugas y asesoramiento técnico.',
    'especialidades/aires-portada.jpeg',
    4,
    true
  ),
  (
    '11111111-1111-1111-1111-111111111105',
    'Pintura General',
    'pintura-general',
    'Pintura profesional de interiores y exteriores',
    'Pintura de interiores y exteriores, preparación de superficies, reparación de paredes y asesoramiento de colores.',
    'especialidades/pintura-portada.jpeg',
    5,
    true
  );

-- Trabajos migrados desde la galería estática
insert into public.trabajos (id, especialidad_id, titulo, descripcion, orden, publicado) values
  (
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111101',
    'Instalación de termotanque',
    'Instalación profesional de termotanque en cocina, garantizando agua caliente eficiente y segura.',
    1,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    '11111111-1111-1111-1111-111111111101',
    'Instalación de cañerías para bomba de agua',
    'Instalación y reparación de cañerías para sistemas de bombeo de agua, optimizando el suministro y la presión.',
    2,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    '11111111-1111-1111-1111-111111111101',
    'Instalación de bomba de agua',
    'Instalación y mantenimiento de bombas de agua para sistemas de suministro y presión.',
    3,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222204',
    '11111111-1111-1111-1111-111111111102',
    'Instalación de gas exterior',
    'Instalación de redes de gas subterráneas, cumpliendo con todas las normativas de seguridad.',
    1,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222205',
    '11111111-1111-1111-1111-111111111102',
    'Instalación de gas interior',
    'Instalación de tuberías de gas en interiores, con acabados profesionales y seguros.',
    2,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222206',
    '11111111-1111-1111-1111-111111111102',
    'Revisión de medidor de gas',
    'Verificación y ajuste de medidores de gas para asegurar la precisión y seguridad del sistema.',
    3,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222207',
    '11111111-1111-1111-1111-111111111102',
    'Instalación de medidores de gas',
    'Configuración y supervisión de múltiples medidores de gas para propiedades residenciales y comerciales.',
    4,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222208',
    '11111111-1111-1111-1111-111111111105',
    'Pintura y restauración de piscina',
    'Pintura y restauración completa de piscina, incluyendo preparación de superficies y acabados profesionales.',
    1,
    true
  );

insert into public.fotografias (trabajo_id, storage_path, alt_text, orden) values
  ('22222222-2222-2222-2222-222222222201', 'trabajos/Seprogar-Trabajos-01.jpeg', 'Instalación de termotanque', 1),
  ('22222222-2222-2222-2222-222222222202', 'trabajos/Seprogar-Trabajos-02.jpeg', 'Cañerías para bomba de agua', 1),
  ('22222222-2222-2222-2222-222222222208', 'trabajos/Seprogar-Trabajos-03.jpeg', 'Pintura y restauración de piscina', 1),
  ('22222222-2222-2222-2222-222222222204', 'trabajos/Seprogar-Trabajos-04.jpeg', 'Instalación de gas exterior', 1),
  ('22222222-2222-2222-2222-222222222205', 'trabajos/Seprogar-Trabajos-05.jpeg', 'Instalación de gas interior', 1),
  ('22222222-2222-2222-2222-222222222206', 'trabajos/Seprogar-Trabajos-06.jpeg', 'Revisión de medidor de gas', 1),
  ('22222222-2222-2222-2222-222222222203', 'trabajos/Seprogar-Trabajos-07.jpeg', 'Instalación de bomba de agua', 1),
  ('22222222-2222-2222-2222-222222222207', 'trabajos/Seprogar-Trabajos-08.jpeg', 'Instalación de medidores de gas', 1);

-- Equipo de prueba (sin foto: se muestran iniciales en el carrusel)
insert into public.personas (id, nombre, cargo, fotografia_path, orden, publicado) values
  ('33333333-3333-3333-3333-333333333301', 'Martín Gómez', 'Director técnico', null, 1, true),
  ('33333333-3333-3333-3333-333333333302', 'Laura Fernández', 'Coordinación de obras', null, 2, true),
  ('33333333-3333-3333-3333-333333333303', 'Diego Ruiz', 'Plomería', null, 3, true),
  ('33333333-3333-3333-3333-333333333304', 'Ana Pérez', 'Gasista matriculada', null, 4, true),
  ('33333333-3333-3333-3333-333333333305', 'Carlos Méndez', 'Electricista', null, 5, true),
  ('33333333-3333-3333-3333-333333333306', 'Sofía Vargas', 'Climatización', null, 6, true);

insert into public.persona_especialidad (persona_id, especialidad_id) values
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101'),
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111102'),
  ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111105'),
  ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111101'),
  ('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111102'),
  ('33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111103'),
  ('33333333-3333-3333-3333-333333333306', '11111111-1111-1111-1111-111111111104');
