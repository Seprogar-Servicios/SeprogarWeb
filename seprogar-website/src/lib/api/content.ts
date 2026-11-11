import { supabase } from '../supabase';
import {
  FALLBACK_ABOUT,
  FALLBACK_COVERAGE,
  FALLBACK_FAQ,
  FALLBACK_HERO,
  FALLBACK_PROCESS,
  FALLBACK_SERVICES,
  FALLBACK_SETTINGS,
  FALLBACK_SITE_CONTENT,
} from '../fallbackContent';
import type {
  AboutContent,
  CoverageContent,
  FaqContent,
  HeroContent,
  HoursItem,
  PageSection,
  ProcessContent,
  PublicSiteContent,
  ServicesIntroContent,
  SiteSettingsPayload,
  SiteSettingsRow,
  SocialLinks,
} from '../../types/content';

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asHours(value: unknown): HoursItem[] {
  if (!Array.isArray(value)) return FALLBACK_SETTINGS.hours;
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      return {
        label: asString(row.label),
        value: asString(row.value),
      };
    })
    .filter((item): item is HoursItem => Boolean(item?.label && item.value));
}

function asSocial(value: unknown): SocialLinks {
  if (!value || typeof value !== 'object') return FALLBACK_SETTINGS.social_links;
  return value as SocialLinks;
}

export function normalizeSettings(raw: Partial<SiteSettingsPayload> | null | undefined): SiteSettingsPayload {
  return {
    site_name: asString(raw?.site_name, FALLBACK_SETTINGS.site_name),
    contact_email: asString(raw?.contact_email, FALLBACK_SETTINGS.contact_email),
    phone_display: asString(raw?.phone_display, FALLBACK_SETTINGS.phone_display),
    phone_tel: asString(raw?.phone_tel, FALLBACK_SETTINGS.phone_tel),
    whatsapp: asString(raw?.whatsapp, FALLBACK_SETTINGS.whatsapp),
    address: asString(raw?.address, FALLBACK_SETTINGS.address),
    map_url: asString(raw?.map_url, FALLBACK_SETTINGS.map_url),
    social_links: asSocial(raw?.social_links),
    hours: asHours(raw?.hours),
  };
}

export function normalizeFaq(raw: Record<string, unknown> | null | undefined): FaqContent {
  const items = Array.isArray(raw?.items)
    ? raw.items
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as Record<string, unknown>;
          const question = asString(row.question);
          const answer = asString(row.answer);
          if (!question || !answer) return null;
          return { question, answer };
        })
        .filter((item): item is { question: string; answer: string } => Boolean(item))
    : FALLBACK_FAQ.items;

  return {
    eyebrow: asString(raw?.eyebrow, FALLBACK_FAQ.eyebrow),
    headline: asString(raw?.headline, FALLBACK_FAQ.headline),
    highlight: asString(raw?.highlight, FALLBACK_FAQ.highlight),
    subheadline: asString(raw?.subheadline, FALLBACK_FAQ.subheadline),
    items: items.length ? items : FALLBACK_FAQ.items,
    cta_title: asString(raw?.cta_title, FALLBACK_FAQ.cta_title),
    cta_body: asString(raw?.cta_body, FALLBACK_FAQ.cta_body),
    cta_label: asString(raw?.cta_label, FALLBACK_FAQ.cta_label),
    cta_message: asString(raw?.cta_message, FALLBACK_FAQ.cta_message),
  };
}

export function normalizeCoverage(raw: Record<string, unknown> | null | undefined): CoverageContent {
  const zones = Array.isArray(raw?.zones)
    ? raw.zones.map(String).filter(Boolean)
    : FALLBACK_COVERAGE.zones;

  return {
    eyebrow: asString(raw?.eyebrow, FALLBACK_COVERAGE.eyebrow),
    headline: asString(raw?.headline, FALLBACK_COVERAGE.headline),
    highlight: asString(raw?.highlight, FALLBACK_COVERAGE.highlight),
    subheadline: asString(raw?.subheadline, FALLBACK_COVERAGE.subheadline),
    zones: zones.length ? zones : FALLBACK_COVERAGE.zones,
    cta_label: asString(raw?.cta_label, FALLBACK_COVERAGE.cta_label),
    cta_message: asString(raw?.cta_message, FALLBACK_COVERAGE.cta_message),
    note: asString(raw?.note, FALLBACK_COVERAGE.note),
  };
}

export function normalizeProcess(raw: Record<string, unknown> | null | undefined): ProcessContent {
  const steps = Array.isArray(raw?.steps)
    ? raw.steps
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as Record<string, unknown>;
          const title = asString(row.title);
          const description = asString(row.description);
          if (!title || !description) return null;
          return {
            title,
            description,
            icon_key: asString(row.icon_key, 'wrench'),
          };
        })
        .filter((item): item is ProcessContent['steps'][number] => Boolean(item))
    : FALLBACK_PROCESS.steps;

  return {
    eyebrow: asString(raw?.eyebrow, FALLBACK_PROCESS.eyebrow),
    headline: asString(raw?.headline, FALLBACK_PROCESS.headline),
    highlight: asString(raw?.highlight, FALLBACK_PROCESS.highlight),
    subheadline: asString(raw?.subheadline, FALLBACK_PROCESS.subheadline),
    steps: steps.length ? steps : FALLBACK_PROCESS.steps,
  };
}

export function normalizeHero(raw: Record<string, unknown> | null | undefined): HeroContent {
  const rotating_words = Array.isArray(raw?.rotating_words)
    ? raw.rotating_words.map(String).filter(Boolean)
    : FALLBACK_HERO.rotating_words;

  const stats = Array.isArray(raw?.stats)
    ? raw.stats
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as Record<string, unknown>;
          const value = asString(row.value);
          const label = asString(row.label);
          if (!value || !label) return null;
          return { value, label, icon_key: asString(row.icon_key) };
        })
        .filter((item): item is HeroContent['stats'][number] => Boolean(item))
    : FALLBACK_HERO.stats;

  return {
    eyebrow: asString(raw?.eyebrow, FALLBACK_HERO.eyebrow),
    headline_line1: asString(raw?.headline_line1, FALLBACK_HERO.headline_line1),
    headline_prefix: asString(raw?.headline_prefix, FALLBACK_HERO.headline_prefix),
    rotating_words: rotating_words.length ? rotating_words : FALLBACK_HERO.rotating_words,
    subheadline: asString(raw?.subheadline, FALLBACK_HERO.subheadline),
    primary_cta_label: asString(raw?.primary_cta_label, FALLBACK_HERO.primary_cta_label),
    primary_cta_href: asString(raw?.primary_cta_href, FALLBACK_HERO.primary_cta_href),
    secondary_cta_label: asString(raw?.secondary_cta_label, FALLBACK_HERO.secondary_cta_label),
    secondary_cta_message: asString(
      raw?.secondary_cta_message,
      FALLBACK_HERO.secondary_cta_message,
    ),
    background_image_url: asString(
      raw?.background_image_url,
      FALLBACK_HERO.background_image_url,
    ),
    stats: stats.length ? stats : FALLBACK_HERO.stats,
  };
}

export function normalizeServices(
  raw: Record<string, unknown> | null | undefined,
): ServicesIntroContent {
  return {
    eyebrow: asString(raw?.eyebrow, FALLBACK_SERVICES.eyebrow),
    headline: asString(raw?.headline, FALLBACK_SERVICES.headline),
    highlight: asString(raw?.highlight, FALLBACK_SERVICES.highlight),
    subheadline: asString(raw?.subheadline, FALLBACK_SERVICES.subheadline),
  };
}

export function normalizeAbout(raw: Record<string, unknown> | null | undefined): AboutContent {
  const highlights = Array.isArray(raw?.highlights)
    ? raw.highlights
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as Record<string, unknown>;
          const title = asString(row.title);
          const description = asString(row.description);
          if (!title || !description) return null;
          return {
            title,
            description,
            icon_key: asString(row.icon_key, 'shield'),
          };
        })
        .filter((item): item is AboutContent['highlights'][number] => Boolean(item))
    : FALLBACK_ABOUT.highlights;

  return {
    eyebrow: asString(raw?.eyebrow, FALLBACK_ABOUT.eyebrow),
    headline: asString(raw?.headline, FALLBACK_ABOUT.headline),
    body_1: asString(raw?.body_1, FALLBACK_ABOUT.body_1),
    body_2: asString(raw?.body_2, FALLBACK_ABOUT.body_2),
    cta_label: asString(raw?.cta_label, FALLBACK_ABOUT.cta_label),
    cta_message: asString(raw?.cta_message, FALLBACK_ABOUT.cta_message),
    photo_url: asString(raw?.photo_url, FALLBACK_ABOUT.photo_url),
    photo_caption: asString(raw?.photo_caption, FALLBACK_ABOUT.photo_caption),
    photo_placeholder_title: asString(
      raw?.photo_placeholder_title,
      FALLBACK_ABOUT.photo_placeholder_title,
    ),
    photo_placeholder_body: asString(
      raw?.photo_placeholder_body,
      FALLBACK_ABOUT.photo_placeholder_body,
    ),
    highlights: highlights.length ? highlights : FALLBACK_ABOUT.highlights,
  };
}

export async function fetchPublicSiteContent(): Promise<PublicSiteContent> {
  try {
    const [settingsRes, sectionsRes] = await Promise.all([
      supabase.from('v_public_site_settings').select('payload').limit(1).maybeSingle(),
      supabase
        .from('v_public_page_sections')
        .select('section_key, content')
        .in('section_key', ['faq', 'coverage', 'process', 'hero', 'about', 'services']),
    ]);

    if (settingsRes.error || sectionsRes.error) {
      console.warn('Error cargando contenido público', settingsRes.error ?? sectionsRes.error);
      return FALLBACK_SITE_CONTENT;
    }

    const settings = normalizeSettings(
      (settingsRes.data?.payload as Partial<SiteSettingsPayload> | null) ?? null,
    );

    const sectionMap = new Map(
      (sectionsRes.data ?? []).map((row) => [
        row.section_key as string,
        (row.content as Record<string, unknown>) ?? {},
      ]),
    );

    return {
      settings,
      faq: normalizeFaq(sectionMap.get('faq')),
      coverage: normalizeCoverage(sectionMap.get('coverage')),
      process: normalizeProcess(sectionMap.get('process')),
      hero: normalizeHero(sectionMap.get('hero')),
      about: normalizeAbout(sectionMap.get('about')),
      services: normalizeServices(sectionMap.get('services')),
    };
  } catch (err) {
    console.warn('Fallback de contenido público', err);
    return FALLBACK_SITE_CONTENT;
  }
}

export async function fetchSiteSettingsAdmin(): Promise<SiteSettingsRow | null> {
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data as SiteSettingsRow | null;
}

export async function saveSiteSettingsDraft(id: string, payload: SiteSettingsPayload) {
  const { data, error } = await supabase
    .from('site_settings')
    .update({
      draft_payload: payload,
      has_unpublished_changes: true,
      site_name: payload.site_name,
      contact_email: payload.contact_email,
      phone_display: payload.phone_display,
      phone_tel: payload.phone_tel,
      whatsapp: payload.whatsapp,
      address: payload.address,
      map_url: payload.map_url || null,
      social_links: payload.social_links,
      hours: payload.hours,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as SiteSettingsRow;
}

export async function publishSiteSettings(id: string, payload: SiteSettingsPayload) {
  const { data, error } = await supabase
    .from('site_settings')
    .update({
      ...payload,
      map_url: payload.map_url || null,
      draft_payload: payload,
      published_payload: payload,
      has_unpublished_changes: false,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as SiteSettingsRow;
}

export async function fetchSectionsAdmin(): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as PageSection[];
}

export async function updateSectionDraft(
  id: string,
  draft_content: Record<string, unknown>,
  extras?: Partial<Pick<PageSection, 'title' | 'is_visible' | 'display_order'>>,
) {
  const { data, error } = await supabase
    .from('page_sections')
    .update({
      draft_content,
      has_unpublished_changes: true,
      ...extras,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as PageSection;
}

export async function publishSection(id: string) {
  const { data: current, error: readError } = await supabase
    .from('page_sections')
    .select('draft_content')
    .eq('id', id)
    .single();
  if (readError) throw readError;

  const { data, error } = await supabase
    .from('page_sections')
    .update({
      published_content: current.draft_content,
      has_unpublished_changes: false,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as PageSection;
}

export async function publishAllSections() {
  const sections = await fetchSectionsAdmin();
  for (const section of sections) {
    if (!section.has_unpublished_changes) continue;
    await publishSection(section.id);
  }
}
