export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
  [key: string]: string | undefined;
};

export type HoursItem = {
  label: string;
  value: string;
};

export type SiteSettingsPayload = {
  site_name: string;
  contact_email: string;
  phone_display: string;
  phone_tel: string;
  whatsapp: string;
  address: string;
  map_url: string;
  social_links: SocialLinks;
  hours: HoursItem[];
};

export type SiteSettingsRow = {
  id: string;
  site_name: string;
  contact_email: string | null;
  phone_display: string | null;
  phone_tel: string | null;
  whatsapp: string | null;
  address: string | null;
  map_url: string | null;
  social_links: SocialLinks;
  hours: HoursItem[];
  draft_payload: SiteSettingsPayload | null;
  published_payload: SiteSettingsPayload | null;
  has_unpublished_changes: boolean;
  updated_at: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContent = {
  eyebrow: string;
  headline: string;
  highlight: string;
  subheadline: string;
  items: FaqItem[];
  cta_title: string;
  cta_body: string;
  cta_label: string;
  cta_message: string;
};

export type CoverageContent = {
  eyebrow: string;
  headline: string;
  highlight: string;
  subheadline: string;
  zones: string[];
  cta_label: string;
  cta_message: string;
  note: string;
};

export type ProcessStep = {
  title: string;
  description: string;
  icon_key: string;
};

export type ProcessContent = {
  eyebrow: string;
  headline: string;
  highlight: string;
  subheadline: string;
  steps: ProcessStep[];
};

export type HeroStat = {
  value: string;
  label: string;
  icon_key: string;
};

export type HeroContent = {
  eyebrow: string;
  headline_line1: string;
  headline_prefix: string;
  rotating_words: string[];
  subheadline: string;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_message: string;
  stats: HeroStat[];
};

export type AboutHighlight = {
  title: string;
  description: string;
  icon_key: string;
};

export type AboutContent = {
  eyebrow: string;
  headline: string;
  body_1: string;
  body_2: string;
  cta_label: string;
  cta_message: string;
  photo_url: string;
  photo_caption: string;
  photo_placeholder_title: string;
  photo_placeholder_body: string;
  highlights: AboutHighlight[];
};

export type SectionType = 'faq' | 'coverage' | 'contact' | 'hero' | 'process' | 'about' | 'custom';

export type PageSection = {
  id: string;
  section_key: string;
  section_type: SectionType;
  title: string | null;
  draft_content: Record<string, unknown>;
  published_content: Record<string, unknown>;
  display_order: number;
  is_visible: boolean;
  has_unpublished_changes: boolean;
  updated_at: string;
};

export type PublicSection = {
  id: string;
  section_key: string;
  section_type: SectionType;
  title: string | null;
  content: Record<string, unknown>;
  display_order: number;
};

export type PublicSiteContent = {
  settings: SiteSettingsPayload;
  faq: FaqContent;
  coverage: CoverageContent;
  process: ProcessContent;
  hero: HeroContent;
  about: AboutContent;
};
