import type {
  AboutContent,
  CoverageContent,
  FaqContent,
  HeroContent,
  ProcessContent,
  PublicSiteContent,
  SiteSettingsPayload,
} from '../types/content';

export const FALLBACK_SETTINGS: SiteSettingsPayload = {
  site_name: 'SEPROGAR',
  contact_email: 'contacto@seprogar.com',
  phone_display: '+54 9 11 2848-4962',
  phone_tel: '+5491128484962',
  whatsapp: '5491128484962',
  address: 'Av. Siempreviva 742, Buenos Aires',
  map_url: '',
  social_links: {
    facebook: '#',
    instagram: '#',
    linkedin: '#',
  },
  hours: [
    { label: 'Lunes - Domingos', value: '8:00 - 18:00' },
    { label: 'Atención regular', value: '8:00 - 18:00' },
    { label: 'Emergencias', value: 'Atención 24/7' },
  ],
};

export const FALLBACK_FAQ: FaqContent = {
  eyebrow: 'Antes de escribirnos',
  headline: 'Preguntas',
  highlight: 'frecuentes',
  subheadline:
    'Armamos esta guía con lo que más consultan: servicios, urgencias, zonas y cómo coordinar. Si tu caso es distinto, hablanos directo.',
  items: [
    {
      question: '¿Qué servicios cubren?',
      answer:
        'Plomería, gas, electricidad, aires acondicionados y pintura, entre otros trabajos de instalación y mantenimiento. Si tu necesidad es puntual, escribinos y te decimos si podemos tomarlo.',
    },
    {
      question: '¿Atienden emergencias?',
      answer:
        'Sí. Para urgencias (fugas, cortes, fallas críticas) escribinos por WhatsApp con zona y una breve descripción. Priorizamos según gravedad y disponibilidad del equipo.',
    },
    {
      question: '¿En qué horarios trabajan?',
      answer:
        'Atención habitual de lunes a domingo en franja diurna. Fuera de ese horario se evalúan emergencias caso por caso.',
    },
    {
      question: '¿Cómo pido un presupuesto?',
      answer:
        'Por WhatsApp o desde el formulario de contacto. Con fotos y una descripción breve podemos orientarte mejor. Si hace falta visita técnica, te lo avisamos antes de coordinarla.',
    },
    {
      question: '¿La visita tiene costo?',
      answer:
        'La orientación inicial por mensaje es sin cargo. Si el caso requiere relevamiento en el lugar, te confirmamos condiciones antes de agendar.',
    },
    {
      question: '¿Trabajan con instalaciones de gas certificadas?',
      answer:
        'Realizamos instalaciones y trabajos relacionados con gas respetando la normativa vigente. Consultanos el tipo de instalación para confirmar documentación y requisitos.',
    },
    {
      question: '¿Llegan a mi zona?',
      answer:
        'Cubrimos CABA y Gran Buenos Aires (norte, oeste y sur). Si estás en el límite o en otra localidad, consultá igual: coordinamos según distancia y agenda.',
    },
    {
      question: '¿Qué necesito tener listo el día del trabajo?',
      answer:
        'Acceso al lugar, alguien que pueda autorizar la intervención y, si aplica, datos del medidor o tablero. Te indicamos lo específico al confirmar el turno.',
    },
  ],
  cta_title: '¿No encontrás tu duda?',
  cta_body:
    'Mandanos un mensaje con tu zona y el problema. Te respondemos con la próxima acción concreta.',
  cta_label: 'Consultar por WhatsApp',
  cta_message: 'Hola Seprogar, tengo una consulta',
};

export const FALLBACK_COVERAGE: CoverageContent = {
  eyebrow: 'Cobertura',
  headline: 'Zonas de',
  highlight: 'atención',
  subheadline:
    'Atendemos CABA y Gran Buenos Aires. Si tu zona no aparece en la lista, escribinos igual: coordinamos según disponibilidad y urgencia.',
  zones: ['CABA', 'Zona Norte', 'Zona Oeste', 'Zona Sur', 'GBA', 'Consultá tu zona'],
  cta_label: 'Consultar mi zona',
  cta_message: 'Hola Seprogar, quiero consultar si atienden en mi zona',
  note: 'La cobertura exacta puede variar según el tipo de servicio y la demanda del día.',
};

export const FALLBACK_PROCESS: ProcessContent = {
  eyebrow: 'Del contacto al trabajo listo',
  headline: 'Cómo',
  highlight: 'trabajamos',
  subheadline: 'Un proceso corto y concreto: menos vueltas, más claridad en cada paso.',
  steps: [
    {
      title: 'Nos contactás',
      description: 'WhatsApp o formulario: contanos qué pasó y en qué zona estás.',
      icon_key: 'message',
    },
    {
      title: 'Coordinamos',
      description: 'Definimos visita o intervención según urgencia y disponibilidad.',
      icon_key: 'calendar',
    },
    {
      title: 'Resolvemos',
      description: 'Ejecutamos el trabajo con criterio técnico y materiales acordes.',
      icon_key: 'wrench',
    },
    {
      title: 'Cerramos el servicio',
      description: 'Te explicamos lo realizado y dejamos todo en condiciones de uso.',
      icon_key: 'thumbs',
    },
  ],
};

export const FALLBACK_HERO: HeroContent = {
  eyebrow: 'Instalaciones y mantenimiento profesional',
  headline_line1: 'Soluciones técnicas',
  headline_prefix: 'para tu',
  rotating_words: ['hogar', 'empresa', 'negocio', 'consorcio', 'obra', 'local'],
  subheadline:
    'Plomería, gas, electricidad y más. Trabajo profesional, respuesta rápida y trato directo en cada intervención.',
  primary_cta_label: 'Ver servicios',
  primary_cta_href: '#servicios',
  secondary_cta_label: 'Pedir presupuesto',
  secondary_cta_message: 'Hola Seprogar, quiero solicitar un presupuesto',
  stats: [
    { value: '5+', label: 'Años de experiencia', icon_key: 'shield' },
    { value: '500+', label: 'Clientes atendidos', icon_key: '' },
    { value: '24/7', label: 'Emergencias', icon_key: 'clock' },
    { value: 'CABA', label: 'y GBA', icon_key: '' },
  ],
};

export const FALLBACK_ABOUT: AboutContent = {
  eyebrow: 'La empresa',
  headline: 'SEPROGAR, soluciones técnicas con foco en el día a día',
  body_1:
    'Somos un equipo de oficios e instalaciones para hogar, comercio y edificios. Trabajamos plomería, gas, electricidad, aires y pintura con una idea simple: diagnosticar bien y ejecutar con orden.',
  body_2:
    'No vendemos paquetes genéricos: cada caso se evalúa según el lugar, la urgencia y lo que realmente hace falta para dejar el sistema funcionando.',
  cta_label: 'Hablar con el equipo',
  cta_message: 'Hola Seprogar, quiero conocer más sobre ustedes',
  photo_url: '',
  photo_caption: 'El equipo detrás de cada servicio',
  photo_placeholder_title: 'Foto del equipo',
  photo_placeholder_body: 'Espacio reservado. Cuando tengas la imagen, la reemplazamos acá.',
  highlights: [
    {
      title: 'Criterio técnico',
      description:
        'Priorizamos seguridad y normativa en instalaciones sensibles como gas y electricidad.',
      icon_key: 'shield',
    },
    {
      title: 'Respuesta ágil',
      description: 'Coordinamos según urgencia. Emergencias se evalúan al momento por WhatsApp.',
      icon_key: 'clock',
    },
    {
      title: 'Trato directo',
      description: 'Hablás con el equipo que interviene: comunicación clara de punta a punta.',
      icon_key: 'users',
    },
  ],
};

export const FALLBACK_SITE_CONTENT: PublicSiteContent = {
  settings: FALLBACK_SETTINGS,
  faq: FALLBACK_FAQ,
  coverage: FALLBACK_COVERAGE,
  process: FALLBACK_PROCESS,
  hero: FALLBACK_HERO,
  about: FALLBACK_ABOUT,
};

export function whatsappLink(whatsapp: string, message: string) {
  const number = whatsapp.replace(/\D/g, '') || FALLBACK_SETTINGS.whatsapp;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
