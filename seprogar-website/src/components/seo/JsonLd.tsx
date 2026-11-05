import { absoluteUrl, SITE_NAME } from '../../lib/seo';

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${absoluteUrl('/')}/#organization`,
    name: SITE_NAME,
    url: absoluteUrl('/'),
    image: absoluteUrl('/img/Seprogar-Logo-01.png'),
    telephone: '+5491128484962',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Buenos Aires',
      addressCountry: 'AR',
    },
    sameAs: [],
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Buenos Aires',
    },
  };
}

export function serviceJsonLd(params: {
  nombre: string;
  slug: string;
  description: string;
  image?: string | null;
}) {
  const url = absoluteUrl(`/servicios/${params.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: params.nombre,
    description: params.description,
    url,
    image: params.image || absoluteUrl('/img/Seprogar-Logo-01.png'),
    provider: {
      '@type': 'LocalBusiness',
      name: SITE_NAME,
      url: absoluteUrl('/'),
      telephone: '+5491128484962',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Buenos Aires',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
