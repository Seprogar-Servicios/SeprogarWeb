/**
 * Genera sitemap.xml y actualiza robots.txt en dist/ (y public/sitemap.xml).
 * Tras el build de Vite. Requiere VITE_SITE_URL y acceso a Supabase (anon).
 *
 * Uso: node scripts/generate-seo.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

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

const SITE_URL = (process.env.VITE_SITE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!ANON_KEY) {
  console.warn('Sin VITE_SUPABASE_ANON_KEY: sitemap solo con home.');
}

const supabase = ANON_KEY
  ? createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } })
  : null;

async function fetchSlugs() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('especialidades')
    .select('slug, updated_at')
    .eq('publicado', true)
    .order('orden', { ascending: true });
  if (error) {
    console.warn('No se pudieron leer especialidades:', error.message);
    return [];
  }
  return data ?? [];
}

function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildSitemap(entries) {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${xmlEscape(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const today = new Date().toISOString().slice(0, 10);
const especialidades = await fetchSlugs();

const entries = [
  {
    loc: `${SITE_URL}/`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '1.0',
  },
  ...especialidades.map((e) => ({
    loc: `${SITE_URL}/servicios/${e.slug}`,
    lastmod: (e.updated_at || today).slice(0, 10),
    changefreq: 'weekly',
    priority: '0.8',
  })),
];

const sitemap = buildSitemap(entries);
const robots = `User-agent: *
Allow: /

Disallow: /gestion-seprogar
Disallow: /gestion-seprogar/

Sitemap: ${SITE_URL}/sitemap.xml
`;

const publicDir = resolve(root, 'public');
const distDir = resolve(root, 'dist');

writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(resolve(publicDir, 'robots.txt'), robots, 'utf8');

if (existsSync(distDir)) {
  writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap, 'utf8');
  writeFileSync(resolve(distDir, 'robots.txt'), robots, 'utf8');
}

console.log(`SEO: sitemap con ${entries.length} URLs → ${SITE_URL}`);

// Export paths for prerender
const routesPath = resolve(root, 'scripts/.prerender-routes.json');
mkdirSync(dirname(routesPath), { recursive: true });
writeFileSync(
  routesPath,
  JSON.stringify(
    {
      siteUrl: SITE_URL,
      routes: ['/', ...especialidades.map((e) => `/servicios/${e.slug}`)],
      especialidades,
    },
    null,
    2
  ),
  'utf8'
);
