/** Allowlist de esquemas/rutas para URLs del CMS (mitiga javascript:/data: XSS). */

const HREF_PROTOCOLS = new Set(['https:', 'http:', 'mailto:', 'tel:']);

function trimOrEmpty(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Devuelve un href seguro o el fallback.
 * Permite: #anclas, rutas relativas (/…), http(s), mailto, tel.
 */
export function safeHref(value: string | null | undefined, fallback = '#'): string {
  const raw = trimOrEmpty(value);
  if (!raw) return fallback;

  if (raw.startsWith('#') && !raw.startsWith('#javascript')) return raw;
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw;

  try {
    const base =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://example.invalid';
    const parsed = new URL(raw, base);
    if (HREF_PROTOCOLS.has(parsed.protocol)) {
      if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') {
        return parsed.href;
      }
      return parsed.href;
    }
  } catch {
    /* inválida */
  }
  return fallback;
}

/** Solo http(s) o ruta relativa del sitio / path de storage relativo. */
export function safeImageUrl(value: string | null | undefined, fallback = ''): string {
  const raw = trimOrEmpty(value);
  if (!raw) return fallback;

  if (raw.startsWith('/') && !raw.startsWith('//')) return raw;

  // Path de storage relativo (sin esquema)
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw) && !raw.includes('://')) {
    if (/^[a-zA-Z0-9_./-]+$/.test(raw)) return raw;
    return fallback;
  }

  try {
    const parsed = new URL(raw);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
  } catch {
    /* inválida */
  }
  return fallback;
}

/** Valor listo para `url(...)` en CSS sin romper el string. */
export function safeCssBackgroundImage(value: string | null | undefined, fallback = ''): string | undefined {
  const url = safeImageUrl(value, fallback);
  if (!url) return undefined;
  return `url(${JSON.stringify(url)})`;
}

export function safeMailto(email: string | null | undefined): string {
  const raw = trimOrEmpty(email);
  if (!raw || /[\s<>"']/.test(raw) || raw.includes('@') === false) return '#';
  return safeHref(`mailto:${raw}`, '#');
}

export function safeTel(phone: string | null | undefined): string {
  const raw = trimOrEmpty(phone);
  if (!raw) return '#';
  const digits = raw.replace(/[^\d+]/g, '');
  if (!digits || digits.length < 6) return '#';
  return `tel:${digits}`;
}

export function sanitizeSocialLinks(links: {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}): typeof links {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(links ?? {})) {
    const cleaned = safeHref(value, '');
    out[key] = cleaned === '#' ? '' : cleaned;
  }
  return out as typeof links;
}
