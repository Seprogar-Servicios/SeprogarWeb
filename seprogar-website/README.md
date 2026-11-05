# SEPROGAR — Sitio web + catálogo de servicios

Landing promocional con catálogo dinámico de especialidades (Supabase) y panel de administración privado.

## Requisitos

- Node.js 20+
- Docker Desktop en ejecución
- npm

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá con las claves de `npx supabase status`:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_SITE_URL=https://tudominio.com
```

**Nunca** expongas `service_role` en el frontend ni en variables `VITE_*`.

## SEO y tema

- Modo claro/oscuro (toggle en el header; respeta preferencia del sistema).
- Metas dinámicas, Open Graph, canonical y `noindex` en `/gestion-seprogar`.
- `robots.txt` + `sitemap.xml` generados en el build.
- JSON-LD (`LocalBusiness` / `Service` / breadcrumbs).
- Prerender estático de `/` y `/servicios/:slug` (HTML con título, description y contenido para crawlers).

Tras publicar: configurá Search Console, GA4 y Google Business Profile; enviá el sitemap.

## Arranque local

```bash
# 1. Dependencias
npm install

# 2. Supabase (Docker)
npm run supabase:start

# 3. Migraciones + seed SQL + imágenes
npm run supabase:reset

# 4. Front
npm run dev
```

- Web pública: http://127.0.0.1:5173  
- Admin (discreto): http://127.0.0.1:5173/gestion-seprogar  
- Studio: http://127.0.0.1:54323  

Detener backend local:

```bash
npm run supabase:stop
```

## Crear el primer administrador (manual)

El registro público está deshabilitado (`enable_signup = false`).

### Opción A — Script local

```bash
node scripts/create-admin.mjs tu-admin@ejemplo.com "TuPasswordSegura"
```

### Opción B — Studio

1. Abrí Supabase Studio → **Authentication** → **Users** → **Add user**.
2. Creá el usuario con email y contraseña (solo en tu entorno local).
3. En **Table Editor** → `profiles`, marcá `is_admin = true` para ese usuario  
   (o ejecutá SQL):

```sql
update public.profiles
set is_admin = true
where email = 'tu-admin@ejemplo.com';
```

4. Ingresá en `/gestion-seprogar` con esas credenciales.

Administradores adicionales: crear usuario en Studio y asignar rol desde el panel (**Administradores**) o por SQL. No hay contraseñas predeterminadas en el repositorio.

## Rutas

| Ruta | Uso |
|------|-----|
| `/` | Landing |
| `/servicios/:slug` | Detalle de especialidad (trabajos + equipo) |
| `/gestion-seprogar` | Login admin |
| `/gestion-seprogar/panel/*` | CRUD protegido |

La sección de trabajos de la landing quedó integrada en cada especialidad.

## Seguridad (resumen)

- Lectura pública solo de contenido `publicado = true`
- Escritura y Storage restringidos a `profiles.is_admin`
- Sesión persistente hasta logout o expiración del token
- Validación de tipo/tamaño de imágenes (cliente + bucket)
- Sin links al panel en la web pública

## Producción (Supabase Cloud)

1. Crear proyecto en Supabase Cloud.
2. `npx supabase link` + `npx supabase db push`.
3. Configurar bucket `catalogo` y políticas (ya vienen en la migración).
4. Crear el primer admin manualmente como arriba.
5. Usar solo `URL` + `anon` key en el hosting del front.
6. Deshabilitar signups en Auth settings.

## Newsletter (futuro)

No implementado. El catálogo y Auth admin quedan separados para poder agregar después una tabla de suscriptores (`email`, `nombre`) sin acoplar al login administrativo.

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `npm run supabase:start` | Levanta Docker/Supabase |
| `npm run supabase:stop` | Detiene el stack |
| `npm run supabase:reset` | Recrea DB + seed + sube imágenes |
| `npm run seed:media` | Solo re-sube fotos a Storage |
