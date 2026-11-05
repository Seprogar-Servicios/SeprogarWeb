export const SITE_NAME = 'SEPROGAR';
export const SITE_DEFAULT_TITLE = 'SEPROGAR — Plomería, Gas, Electricidad y más';
export const SITE_DEFAULT_DESCRIPTION =
  'Servicios profesionales de plomería, gas, electricidad, aires acondicionados y pintura. Atención confiable en CABA y GBA.';

/** Origen público del sitio (sin barra final). En local usa window; en build usa VITE_SITE_URL. */
export function getSiteUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL as string | undefined;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }
  return 'http://127.0.0.1:5173';
}

export function absoluteUrl(path = '/'): string {
  const base = getSiteUrl();
  if (!path || path === '/') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildServiceTitle(nombre: string): string {
  return `${nombre} — Servicios SEPROGAR`;
}

export function buildServiceDescription(
  nombre: string,
  breve?: string | null,
  completa?: string | null
): string {
  const raw = (completa || breve || `Servicio profesional de ${nombre} con el equipo SEPROGAR.`).trim();
  return raw.length > 160 ? `${raw.slice(0, 157)}…` : raw;
}
