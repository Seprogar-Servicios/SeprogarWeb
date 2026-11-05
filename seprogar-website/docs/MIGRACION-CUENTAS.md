# SEPROGAR — Qué crear al migrar a otras cuentas

Guía sencilla de todo lo que tenés que **crear o configurar** cuando muevas el proyecto a cuentas nuevas (Supabase, Vercel, Google, dominio).  
No hace falta reinventar el código: el repo ya está preparado.

---

## Orden recomendado

1. Dominio (si ya lo tenés o lo comprás)
2. Supabase Cloud
3. Primer administrador
4. Vercel (deploy del front)
5. Conectar dominio a Vercel
6. Google Search Console + Analytics + Business Profile
7. Probar la web y el panel

---

## 1. Dominio (opcional pero recomendado)

**Dónde:** registrador (Nic.ar, Namecheap, Cloudflare, etc.)

**Qué hacer:**
- Tener un dominio, por ejemplo `seprogar.com` o `www.seprogar.com`
- Más adelante lo apuntás a Vercel (sección 5)

**Anotá:** la URL final, ej. `https://seprogar.com`

---

## 2. Supabase Cloud (base de datos, auth, fotos)

**Dónde:** [https://supabase.com](https://supabase.com) → cuenta nueva → **New project**

### Crear el proyecto
- Nombre: `seprogar` (o similar)
- Contraseña de base de datos: **guardala en un lugar seguro** (no va en el front)
- Región: la más cercana (ej. South America si está disponible)

### Datos que necesitás copiar (Settings → API)
| Nombre | Para qué | ¿Va en Vercel? |
|--------|----------|----------------|
| **Project URL** | Conexión del front | Sí → `VITE_SUPABASE_URL` |
| **anon / public key** | Lectura pública + login admin | Sí → `VITE_SUPABASE_ANON_KEY` |
| **service_role key** | Solo scripts/servidor | **NO** en Vercel ni en el navegador |

### Subir la estructura de la base
En tu PC, desde la carpeta `seprogar-website`:

```bash
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
npx supabase db push
```

`TU_PROJECT_REF` aparece en la URL del proyecto o en Settings → General.

Esto crea tablas, RLS, bucket `catalogo` y políticas de seguridad.

### Auth (Authentication → Providers / Settings)
- Email/Password: **activado**
- **Desactivar registro público** (Sign ups disabled / Enable sign ups = off)  
  Igual que en local: solo admins creados a mano

### Storage
- Debe existir el bucket **`catalogo`** (lo crea la migración)
- Público para lectura; escritura solo admins (ya viene en la migración)

### Contenido inicial
- Opción A: cargar especialidades/trabajos/fotos desde el **panel admin** después de crear el usuario
- Opción B: si querés migrar datos locales, exportar/importar o subir fotos de nuevo desde el panel

### Primer administrador (obligatorio)
1. Studio → **Authentication** → **Users** → **Add user**  
   (email + contraseña que vas a usar en el panel)
2. **Table Editor** → tabla `profiles` → ese usuario → `is_admin` = **true**

O desde SQL:

```sql
update public.profiles
set is_admin = true
where email = 'tu-admin@tudominio.com';
```

**Panel de la web:** `https://TU-DOMINIO/gestion-seprogar`  
(no aparece en el menú público a propósito)

---

## 3. Vercel (hosting del sitio React)

**Dónde:** [https://vercel.com](https://vercel.com) → cuenta → **Add New Project**

### Conectar el código
- Importá el repo de GitHub/GitLab (o subí el proyecto)
- Root / carpeta del front: **`seprogar-website`** (si el repo es la carpeta padre)
- Framework: Vite
- Build command: `npm run build` (ya incluye SEO + prerender)
- Output: `dist`

### Variables de entorno (Settings → Environment Variables)

Creá estas tres (Production + Preview si querés):

| Variable | Valor ejemplo |
|----------|----------------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | la anon key de Supabase |
| `VITE_SITE_URL` | `https://tudominio.com` (sin barra al final) |

**No crees** variables `VITE_*` con `service_role`.

### Después del primer deploy
- Abrí la URL que te da Vercel (ej. `xxx.vercel.app`)
- Probá home, un servicio (`/servicios/plomeria`) y el login admin

El archivo `vercel.json` del repo ya incluye:
- SPA / rutas
- `noindex` en `/gestion-seprogar`

---

## 4. Dominio en Vercel

En el proyecto Vercel → **Settings → Domains**
1. Agregá `tudominio.com` y/o `www.tudominio.com`
2. Seguí las instrucciones DNS (A / CNAME) en tu registrador
3. Cuando esté activo, confirmá que `VITE_SITE_URL` sea exactamente esa URL HTTPS
4. **Redeploy** el proyecto (para regenerar sitemap/canonical con el dominio correcto)

---

## 5. Google — qué crear (gratis)

### 5.1 Google Search Console
**Dónde:** [https://search.google.com/search-console](https://search.google.com/search-console)

1. Agregar propiedad: dominio o URL del prefijo (`https://tudominio.com`)
2. Verificar (DNS o archivo HTML / meta; con Vercel suele usarse DNS o HTML)
3. **Sitemaps** → enviar:  
   `https://tudominio.com/sitemap.xml`
4. Probar “Inspección de URL” con la home y un `/servicios/...`

### 5.2 Google Analytics 4
**Dónde:** [https://analytics.google.com](https://analytics.google.com)

1. Crear cuenta + propiedad GA4
2. Crear flujo de datos **Web** con tu URL
3. Copiar el **Measurement ID** (`G-XXXXXXXX`)
4. *(Opcional en una próxima tarea de código)* pegarlo en el sitio; por ahora podés usar la etiqueta con Google Tag Manager o pedir que se agregue al proyecto

### 5.3 Google Business Profile (ficha local)
**Dónde:** [https://business.google.com](https://business.google.com)

1. Crear ficha del negocio SEPROGAR
2. Categoría (plomería / servicios del hogar, etc.)
3. Dirección / zona de cobertura, teléfono, WhatsApp, horario
4. Sitio web: tu dominio
5. Fotos y servicios alineados a los rubros (gas, plomería, etc.)

Esto ayuda mucho al SEO local; no reemplaza Search Console.

---

## 6. Cuentas / cosas que NO necesitás crear sí o sí

| Servicio | ¿Obligatorio? |
|----------|----------------|
| Otro dominio solo para admin | No |
| Otro proyecto React | No |
| Newsletter / Mailchimp | No (futuro) |
| Docker en producción | No (solo desarrollo local) |
| Clave `service_role` en Vercel | **Nunca** |

---

## 7. Checklist rápido de migración

### Supabase
- [ ] Proyecto Cloud creado
- [ ] `db push` / migraciones aplicadas
- [ ] Sign up público desactivado
- [ ] Usuario admin creado + `is_admin = true`
- [ ] Bucket `catalogo` OK
- [ ] Contenido (especialidades / fotos) cargado

### Vercel
- [ ] Proyecto conectado al repo
- [ ] Carpeta `seprogar-website` correcta
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_SITE_URL` = dominio final HTTPS
- [ ] Deploy OK
- [ ] Dominio custom apuntado

### Google
- [ ] Search Console verificado
- [ ] Sitemap enviado
- [ ] GA4 creado (y etiqueta cuando la conecten)
- [ ] Business Profile creado y vinculado al sitio

### Pruebas finales
- [ ] Home carga
- [ ] `/servicios/gas` (u otro slug) carga
- [ ] Login en `/gestion-seprogar`
- [ ] Crear/editar una especialidad desde el panel y verla en la web
- [ ] Visitante anónimo **no** puede escribir en la base (solo leer publicados)

---

## 8. Datos para anotar al migrar (plantilla)

Completá esto cuando armes las cuentas nuevas:

```
Dominio: https://
Supabase Project URL:
Supabase anon key: (guardar en Vercel, no compartir en chats)
Supabase project ref:
Vercel project URL:
Email admin panel:
Search Console: OK / pendiente
GA4 Measurement ID:
Business Profile: OK / pendiente
```

---

## 9. Desarrollo local (recordatorio)

En la PC de desarrollo sigue haciendo falta:
- Node.js
- Docker + `npm run supabase:start`
- `.env.local` apuntando al Supabase **local** o al Cloud (si preferís)

Scripts útiles:

| Comando | Uso |
|---------|-----|
| `npm run supabase:start` | Backend local |
| `npm run supabase:reset` | Recrear DB + seed |
| `npm run dev` | Front local |
| `npm run build` | Build + sitemap + prerender |

---

## 10. Seguridad (no olvidar)

- Solo la clave **anon** en el front / Vercel
- Primer admin **manual**; sin registro abierto
- Panel en URL discreta; permisos reales en Supabase (RLS)
- No subir `.env.local` ni `service_role` a Git

Si algo falla al migrar, lo más común es: variables mal pegadas en Vercel, `VITE_SITE_URL` sin HTTPS/dominio final, o el admin sin `is_admin = true`.
