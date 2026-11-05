/**
 * Genera HTML estático por ruta con meta + JSON-LD + contenido visible para crawlers.
 * No usa Puppeteer: inyecta datos de Supabase en copias de dist/index.html.
 *
 * Uso (después de vite build + generate-seo): node scripts/prerender.mjs
 */
import { createClient } from '@supabase/supabase-js';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

function loadEnvLocal() {
  const envPath = resolve(root, '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    const val = m[2].trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

if (!existsSync(distDir)) {
  console.error('No existe dist/. Ejecutá primero npm run build.');
  process.exit(1);
}

const SITE_URL = (process.env.VITE_SITE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const template = readFileSync(resolve(distDir, 'index.html'), 'utf8');
const supabase = ANON_KEY
  ? createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } })
  : null;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function injectHead(html, { title, description, canonical, image, jsonLd, noindex = false }) {
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';
  const tags = `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${esc(canonical)}" />
    <meta name="robots" content="${robots}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="SEPROGAR" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta property="og:locale" content="es_AR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `;

  let out = html.replace(/<title>[^<]*<\/title>/i, '');
  out = out.replace('</head>', `${tags}\n  </head>`);
  return out;
}

function injectCrawlerContent(html, innerHtml) {
  const block = `
    <div id="seo-static" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">
      ${innerHtml}
    </div>
  `;
  // Contenido también visible si JS falla: justo dentro de #root como fallback textual
  return html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"></div>${block}`
  );
}

function writeRoute(routePath, html) {
  const file =
    routePath === '/'
      ? resolve(distDir, 'index.html')
      : resolve(distDir, routePath.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
  console.log(`Prerender OK ${routePath}`);
}

const defaultImage = `${SITE_URL}/img/Seprogar-Logo-01.png`;
const homeTitle = 'SEPROGAR — Plomería, Gas, Electricidad y más';
const homeDescription =
  'Servicios profesionales de plomería, gas, electricidad, aires acondicionados y pintura. Atención confiable con garantía.';

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'SEPROGAR',
  url: `${SITE_URL}/`,
  image: defaultImage,
  telephone: '+5491128484962',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Buenos Aires',
    addressCountry: 'AR',
  },
};

let homeHtml = injectHead(template, {
  title: homeTitle,
  description: homeDescription,
  canonical: `${SITE_URL}/`,
  image: defaultImage,
  jsonLd: localBusiness,
});

let especialidades = [];
if (supabase) {
  const { data, error } = await supabase
    .from('especialidades')
    .select('nombre, slug, descripcion_breve, descripcion_completa, imagen_portada, updated_at')
    .eq('publicado', true)
    .order('orden');
  if (error) console.warn(error.message);
  else especialidades = data ?? [];
}

const listItems = especialidades
  .map(
    (e) =>
      `<li><a href="${SITE_URL}/servicios/${esc(e.slug)}">${esc(e.nombre)}</a>: ${esc(
        e.descripcion_breve || ''
      )}</li>`
  )
  .join('');

homeHtml = injectCrawlerContent(
  homeHtml,
  `<h1>SEPROGAR</h1><p>${esc(homeDescription)}</p><h2>Servicios</h2><ul>${listItems}</ul>`
);
writeRoute('/', homeHtml);

for (const esp of especialidades) {
  const desc = (esp.descripcion_completa || esp.descripcion_breve || `Servicio de ${esp.nombre}`).slice(
    0,
    160
  );
  const title = `${esp.nombre} — Servicios SEPROGAR`;
  const canonical = `${SITE_URL}/servicios/${esp.slug}`;
  const image = esp.imagen_portada?.startsWith('http')
    ? esp.imagen_portada
    : esp.imagen_portada
      ? `${SUPABASE_URL}/storage/v1/object/public/catalogo/${esp.imagen_portada}`
      : defaultImage;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: esp.nombre,
      description: desc,
      url: canonical,
      image,
      provider: { '@type': 'LocalBusiness', name: 'SEPROGAR', url: `${SITE_URL}/` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${SITE_URL}/#servicios` },
        { '@type': 'ListItem', position: 3, name: esp.nombre, item: canonical },
      ],
    },
  ];

  let page = injectHead(template, {
    title,
    description: desc,
    canonical,
    image,
    jsonLd,
  });
  page = injectCrawlerContent(
    page,
    `<nav><a href="${SITE_URL}/">Inicio</a> / <a href="${SITE_URL}/#servicios">Servicios</a> / ${esc(
      esp.nombre
    )}</nav>
     <h1>${esc(esp.nombre)}</h1>
     <p>${esc(esp.descripcion_completa || esp.descripcion_breve || '')}</p>`
  );
  writeRoute(`/servicios/${esp.slug}`, page);
}

console.log(`Prerender finalizado: home + ${especialidades.length} servicios`);
