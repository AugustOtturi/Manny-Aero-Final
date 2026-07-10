# CLAUDE.md

Guidance for Claude Code when working on the Manny Aero website.

## Project

Marketing site + admin CMS for **Manny Aero** — premium aircraft ground handling, permits, catering and FBO coordination across Mexico. Multi-page **Astro 5 SSR** site (migrated from static in jul 2026). Public content (services, permits, ISBAH modules, airports) is still hardcoded in `src/data/*`; **news, form leads, and index images now live in MySQL** and are editable from `/admin`.

Routes (actualizado jul 2026):
- `/` — main landing (hero video, subhero, service cards, map, final CTA)
- `/about` — company story, timeline, values (la sección team se eliminó en jul 2026 a pedido del cliente)
- `/ground-handling` — servicios detallados (tabs desktop, modal bottom-sheet mobile). `/services` redirige aquí via 301 en `server.mjs` (`REDIRECTS`).
- `/catering` — Manny's In-Flight Catering (foto hero + lista de servicios + CTA)
- `/isbah` — IS-BAH compliance program (sticky sidebar nav + accordions). `/isbha` redirige aquí via 301 en `server.mjs`. También hay 301: `/permits_and_authorizations` → `/permits-and-authorizations` y `/our_founder` → `/founder`.
- `/permits-and-authorizations` — permit categories (sticky sidebar nav + accordions + email-gated downloads)
- `/contact` — flight request form + contact cards
- `/founder` — historia del fundador (sticky photo + body texto)
- `/news`, `/news/[slug]` — noticias, leídas de MySQL en cada request (SSR, no rebuild al publicar)
- `/404` — página de error personalizada
- `/admin/login`, `/admin`, `/admin/news[/new|/[id]/edit]`, `/admin/leads`, `/admin/images` — panel de administración (ver sección **Admin CMS** abajo)

## Stack

- **Astro 5**, `output: "server"` con adapter `@astrojs/node` (modo `middleware`). **No hay páginas prerenderizadas todavía** — todo se sirve por request; es una optimización pendiente marcar con `export const prerender = true` las páginas 100% estáticas (about, catering, isbah, founder, etc.) que no leen de la DB.
- **TypeScript** (strict)
- **Express** (`server.mjs`, raíz del proyecto) — envuelve el handler SSR de Astro como middleware y agrega: headers de seguridad (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS, CSP como defensa en profundidad), `compression()`, los 301 redirects legacy (`REDIRECTS`), servir el directorio de uploads con cache headers, y `trust proxy` para IPs correctas detrás del edge de Hostinger. Es el server de producción (`npm start`). En Hostinger el entry point configurado es **`server.js`** (raíz), un shim que loguea el boot, hace self-build de Astro si falta `dist/`, restaura el exec bit de esbuild y luego importa `server.mjs`. **No se usa en dev** — `astro dev` corre su propio servidor y todas las rutas API (`src/pages/api/**`) funcionan igual ahí, sin Express.
- **CSP**: el edge CDN de Hostinger (hcdn) **pisa el header** `Content-Security-Policy`, así que la política enforced real se entrega como `<meta http-equiv>` desde `src/lib/csp.ts` (`CSP_META`), inyectada en `BaseLayout.astro` y `AdminLayout.astro` solo en producción. El header de `server.mjs` queda como defensa en profundidad. La política permite GA4/gtag.
- **MySQL + Drizzle ORM** (`src/lib/server/db/`) — tablas `news`, `leads`, `images`, `permit_downloads`, `admin_users`. Esquema en `src/lib/server/db/schema.ts`.
- **Nodemailer** (`src/lib/server/mail.ts`) — envío de emails para `/contact` y el email gate (el viejo `mail.php`/PHPMailer se eliminó del repo en jul 2026, commit `ceb04a8`).
- **Auth admin**: JWT (`jose`) en cookie `httpOnly`. `verifyCredentials` busca **primero en la tabla `admin_users`** (por email, hash bcrypt) y solo cae al fallback por variables de entorno (`ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH`) si no hay fila o la DB falla. Ver sección Admin CMS.
- **sharp** — optimiza imágenes subidas desde `/admin/images` (resize + conversión a WebP) antes de guardarlas en el directorio de uploads (`UPLOADS_DIR`, ver Variables de entorno).
- **zod** — validación de payloads en todos los endpoints (`src/pages/api/**`).
- **Leaflet** for the map (lazy-loaded via IntersectionObserver in `MapSection.astro`)
- **@astrojs/sitemap** for sitemap generation
- **Fonts** (self-hosted via `@fontsource`, never Google CDN):
  - `Inter` 400–900 → body, UI, navigation (`var(--font-sans)`)
  - `Bebas Neue` 400 → display titles only (`var(--font-display)`)
- **Hosting (dev/staging — QA)**: Hostinger, cuenta `u676595820` (Engenio Digital). MySQL: host `srv1578.hstgr.io`, db `u676595820_cmsmanny`. SMTP: `smtp.hostinger.com:465` (SSL) con `manny.cms@augustotturi.com`.
- **Hosting (cliente/producción)**: Hostinger Business, cuenta del cliente (`u824529850`), como **app Node.js persistente** (ya no static hosting). Ver sección Deploy abajo.

## Commands

```
npm run dev          # local preview (astro dev) at http://localhost:4321
npm run build        # astro build → dist/client (assets) + dist/server (SSR handler)
npm start             # production: node server.mjs (requires npm run build first)
npm run preview       # build + start, for a quick local prod-mode smoke test
npm run check         # astro check (TypeScript)
npm run db:generate    # drizzle-kit generate — crea archivos de migración desde schema.ts
npm run db:push        # drizzle-kit push — aplica schema.ts directo a la DB (usado en dev/QA)
npm run db:studio      # drizzle-kit studio — explorador visual de la DB
npm run db:seed-news   # copia src/data/news.ts a la tabla `news` (idempotente, upsert por slug)
npm run db:seed-logos  # copia los 8 logos originales (src/assets/Logo1..8) a la tabla `images` (idempotente)
npm run db:seed-permit-downloads  # registra los 10 archivos de public/files/ en `permit_downloads` (idempotente, no copia archivos)
```

## Variables de entorno

`.env.local` (nunca se commitea — está en `.gitignore`). Ver `.env.example` para la lista completa y comentada. Resumen:

- `DB_HOST/PORT/USER/PASS/NAME` — MySQL
- `SMTP_HOST/PORT/SECURE/USER/PASS`, `MAIL_FROM(_NAME)`, `MAIL_TO_CONTACT`, `MAIL_TO_GATE`, `MAIL_CC` — Nodemailer
- `JWT_SECRET` — firma de la cookie de sesión admin (32+ bytes random)
- `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` — credenciales admin de **fallback** (hash bcrypt, nunca la password en texto plano); el camino principal es la tabla `admin_users`
- `ALLOWED_ORIGIN` — origin check (`src/lib/server/originCheck.ts`) en `/api/contact`, `/api/gate` y `/api/auth/login`
- `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW` — rate limit in-memory (por proceso)
- `UPLOADS_DIR` — directorio absoluto y **persistente fuera del checkout** donde se guardan los uploads del CMS en producción (sobrevive redeploys); si no está seteada cae a `public/uploads/` (dev). No la valida `env.ts` — se lee directo de `process.env` en `server.mjs` y `src/lib/server/uploads.ts` (deben coincidir)

⚠️ **`astro.config.mjs` carga `.env.local` manualmente** con `dotenv` (Astro/Vite no inyecta `.env.local` a `process.env` automáticamente para código server-side). Por esto `dotenv` está en `dependencies`, no en `devDependencies` — `astro.config.mjs` se ejecuta durante `npm run build`, que Hostinger corre en producción.

## Deploy (Hostinger Business — Node.js app)

El sitio ya **no** se deploya como archivos estáticos. Es una app Node.js persistente.

1. `npm run build` (genera `dist/client` + `dist/server`)
2. Subir el repo completo (o `dist/`, `server.mjs`, `package.json`, `public/`) al servidor — vía Git si Hostinger lo soporta para Node apps, o File Manager/SFTP si no.
3. En el panel de Hostinger, configurar la app Node.js:
   - Entry point: `server.js` (shim que Hostinger exige con ese nombre; hace boot logging + self-build si falta `dist/` y luego importa `server.mjs`)
   - Variables de entorno: cargar todas las de `.env.example` con los valores reales de producción (**no** subir `.env.local` al servidor)
4. Configurar `UPLOADS_DIR` apuntando a un directorio **fuera del checkout del deploy** y escribible por el proceso Node — ahí se guardan las imágenes/archivos subidos desde `/admin` y así sobreviven a los redeploys.

> ⚠️ El flujo viejo (`npm run build` → zip de `dist/` → extraer en `public_html/`) ya no aplica — no hay backend PHP/DB en ese modelo y el CMS no funcionaría.

## File layout

```
public/
  favicon.svg, logo-manny.svg, og-default.jpg
  map/mexico-states.geojson
  og/                    # OG images por página (catering, isbah, founder, permits, ground-handling, about, contact)
  files/                 # archivos originales de /permits-and-authorizations (no tocar/borrar — referenciados por permit_downloads)
  member-logos/          # logos de membresías del Footer
  uploads/               # fallback dev de uploads del admin (gitignored) — en prod van a UPLOADS_DIR
server.js                 # shim entry de Hostinger — boot logging, self-build si falta dist/, importa server.mjs
server.mjs                # server de producción (Express: headers, CSP, compresión, 301s, uploads + handler SSR de Astro)
drizzle.config.ts         # config de drizzle-kit (lee .env.local) — usar con cuidado, ver "Things to avoid"
.env.example               # plantilla documentada de variables de entorno
src/
  middleware.ts            # Astro middleware global — protege /admin/* y /api/admin/* con la cookie JWT
  env.d.ts                  # tipos de Astro.locals.user + window.adminConfirm/adminAlert
  layouts/
    BaseLayout.astro         # <head>, app-loader, font preloads, reveal observer — layout del sitio público
    AdminLayout.astro         # layout del panel admin (sin navbar/footer/loader públicos), monta <AdminTopbar> y <ConfirmModal> si hay sesión
  lib/
    format.ts                 # formatNewsDate, newsBodyToParagraphs
    csp.ts                     # CSP_META — política CSP entregada como <meta> (el edge pisa el header)
    imageSlots.ts              # lista canónica de slots reemplazables en /admin/images/[category] (subhero + service — logos NO están acá, son CRUD dinámico)
    server/                    # código SOLO server-side — nunca importar desde componentes que se hidratan en cliente
      env.ts                    # getEnv() — valida process.env con zod, cachea el resultado
      auth.ts                   # signSession/verifySession (JWT), verifyCredentials (DB-first contra admin_users, fallback env vars)
      uploads.ts                 # UPLOADS_ROOT — resuelve UPLOADS_DIR (prod) o public/uploads (dev)
      mail.ts                    # Nodemailer — sendContactEmail, sendGateEmail
      rateLimit.ts                # rate limiter in-memory (checkRateLimit, getClientIp)
      originCheck.ts               # isAllowedOrigin — localhost cualquier puerto en dev, ALLOWED_ORIGIN exacto en prod
      db/
        schema.ts                  # tablas Drizzle: news, leads, images, permitDownloads, adminUsers
        client.ts                   # getDb() — pool mysql2 + instancia drizzle (singleton)
        scripts/                     # migraciones one-off (seed-news, seed-logos, seed-permit-downloads) — todas idempotentes, correr con tsx
      repositories/
        news.ts, leads.ts, images.ts, permitDownloads.ts  # queries CRUD tipadas, usadas tanto por páginas públicas como por /api/admin/*
      schemas/news.ts               # zod schema + slugify() para el formulario de noticias
  pages/
    index.astro                # main landing
    about.astro
    ground-handling.astro      # tabs (desktop) + modal sheet (mobile)
    catering.astro             # In-flight catering page
    isbah.astro                # sticky sidebar + accordions (ruta: /isbah)
    permits-and-authorizations.astro  # sidebar + accordions + email-gated downloads; DOWNLOADS lee de MySQL, PERMIT_SECTIONS sigue hardcodeado en src/data/permits.ts
    contact.astro              # form + sidebar
    founder.astro              # sticky photo + body texto fundador
    404.astro                  # error page
    news/
      index.astro               # grid de artículos, lee de MySQL (SSR)
      [slug].astro                # artículo individual, lee de MySQL por slug (SSR, no getStaticPaths)
    api/
      contact.ts, gate.ts        # públicos — validan con zod, insertan lead + envían email
      auth/login.ts, logout.ts
      admin/                      # protegidos por middleware.ts (requieren sesión)
        news/index.ts, [id].ts
        leads/index.ts, [id].ts, export.ts
        images/index.ts, upload.ts, [category]/[slug].ts
        permits/index.ts, upload.ts, [id].ts, [id]/file.ts
    admin/
      login.astro
      index.astro                 # hub con cards → Noticias / Leads / Imágenes / Permisos (sin "dashboard", sin stats sueltas)
      news/index.astro, new.astro, [id]/edit.astro
      leads.astro                  # tabla con filtros + export CSV + modal de detalle (click "Ver") + modal de confirmación al eliminar
      images.astro                 # hub con cards → SubHero / Servicios / Logos
      images/[category].astro       # sirve /admin/images/subhero y /admin/images/service — reemplazo por slot fijo
      images/logos.astro            # CRUD completo (agregar/eliminar/reemplazar), no slots fijos, sin campo de nombre
      permits.astro                  # CRUD de archivos descargables (agregar/renombrar/cambiar ícono/reemplazar archivo/eliminar)
  components/
    admin/
      AdminTopbar.astro    # barra superior persistente del panel (Noticias/Leads/Imágenes/Permisos + logout) — NO usar sidebar lateral, se probó y se veía roto
      ConfirmModal.astro   # modal compartido — expone window.adminConfirm/adminAlert, ver sección "Modales del admin"
    Hero.astro, SubHero.astro, ServiceCards.astro,
    MapSection.astro, FinalCTA.astro, Navbar.astro, Footer.astro
    PageHero.astro             # internal-page hero (badge + title + subtitle, no video/photo)
    StatsBand.astro            # 4-up stats strip (glass cards)
    FloatingContact.astro      # OPS 24/7 yellow-glass module, fixed right side, persistent on every page
    BackToServices.astro       # link de regreso usado en /ground-handling y /catering
    ui/GlassButton.astro, ui/GlassPill.astro
  data/
    airports.ts                # 80+ airports para el mapa
    airportOptions.ts          # opciones serializadas para el select del formulario de contacto
    services.ts                # minimal data (slug, title, href, tone) para ServiceCards en el index
    servicesDetail.ts          # rich data (tag, desc, features, image) para /ground-handling
    permits.ts                 # PERMIT_SECTIONS (en uso por la página) + DOWNLOADS (⚠️ solo fuente de seed-permit-downloads — conservar)
    news.ts                    # ⚠️ ya no alimenta /news — solo fuente de seed-news.ts — conservar
  styles/
    tokens.css                 # CSS variables (colors, fonts, breakpoints, motion)
    global.css                 # base styles + utilities (includes the white-title shine rule)
  assets/
    photos/                    # fotos webp/jpg (subhero-1..4, service-*, catering, founder, noticias) — fallback si no hay override en DB
    fonts/                     # Aileron otf self-hosted
    files/                     # ⚠️ copia de respaldo de public/files/ — nada lo importa, conservar como backup
    Logo1..8.png               # ⚠️ sin uso en frontend — solo fuente de seed-logos.ts — conservar
    poster-hero.webp           # hero LQIP fallback
    hero-manny-final.mp4
    mannylogo.png              # logo para el flyout mobile del navbar
```

## Admin CMS (`/admin`)

Panel de administración integrado en la misma app Astro (no es un proyecto/dominio separado).

### Auth
- **DB-first con fallback a env vars** (desde `81095b2`): `verifyCredentials` (`src/lib/server/auth.ts`) busca el usuario en la tabla `admin_users` por email (hash bcrypt en la columna `passwordHash`); si no hay fila o la DB falla, cae a `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` por compatibilidad. No hay seed para `admin_users` — el alta se hace manualmente en la DB.
- Login: `POST /api/auth/login` → firma JWT (`jose`, HS256, expira en 12h) → cookie `manny_admin_session` (`httpOnly`, `sameSite: lax`, `secure` en prod).
- `src/middleware.ts` corre en cada request: si la ruta empieza con `/admin` (menos `/admin/login`) y no hay sesión válida → redirect a `/admin/login?next=...`. Si empieza con `/api/admin` y no hay sesión → 401 JSON. Deja `Astro.locals.user` disponible en toda la app.
- Rate limit propio en `/api/auth/login` (10 intentos / 5 min por IP) separado del rate limit de los formularios públicos.
- Para regenerar el hash de una nueva contraseña: `bcrypt.hashSync(password, 10)` — nunca commitear la contraseña en texto plano, ni siquiera en un script temporal (usar un archivo fuera del repo o pasarlo por stdin).

### Noticias (`/admin/news`)
- CRUD básico: título, categoría, fecha, extracto, cuerpo (párrafos separados por línea en blanco → se guardan como `\n\n` en `LONGTEXT`), imagen.
- Imagen: widget de upload directo (igual patrón que logos) — botón "Subir imagen" sube a `category="news"` con un slug autogenerado (`news-${Date.now()}`) vía `/api/admin/images/upload`, y el `fileName` resultante se guarda en `imageKey`. Ya **no** es un campo de texto libre. `imageKey` sigue aceptando los 3 valores legacy (`ibac`/`fifa`/`nbaa`, mapeados a los assets originales importados por Astro) para los 3 artículos migrados — el form de edición muestra el preview correcto en ambos casos.
- Slug se genera automáticamente del título si se deja vacío (`slugify()` en `src/lib/server/schemas/news.ts`, duplicada en el JS inline de los formularios porque corre client-side antes del submit).

### Leads (`/admin/leads`)
- Todo submit de `/contact`, `FinalCTA` o el gate de permisos se guarda en la tabla `leads` **además de** enviar el email (si el insert falla, el email se manda igual — nunca se bloquea el envío por un problema de DB).
- Filtros: tipo (`contact`/`gate`) y búsqueda por email. Export CSV vía `GET /api/admin/leads/export` (respeta el filtro de tipo si se pasa `?type=`).

### Imágenes (`/admin/images`)
`/admin/images` es un hub con 3 cards — cada categoría tiene su propia página, no está todo junto:

- **SubHero y Tarjetas de servicio** (`/admin/images/[category].astro`, ruta dinámica que sirve `/admin/images/subhero` y `/admin/images/service`) — solo **reemplazo** de imágenes fijas (así lo pidió el cliente para estas dos secciones). La lista de slots está en `src/lib/imageSlots.ts` (4 subhero + 4 service). Cada slot es un formulario real (`<input type="file">` + botón "Subir imagen", no un link disfrazado) y tiene botón "Volver a la imagen original" si hay override. Patrón en `ServiceCards.astro`/`SubHero.astro`: consultan `listImages(category)` una vez en el frontmatter y renderizan `<img>` plano si hay override en `public/uploads/<categoria>/`, o el `<Image>` optimizado de Astro con el asset original si no. **No** se puede pasar una imagen subida en runtime al componente `<Image>` de Astro (requiere un import resuelto en build time) — por eso el fallback usa `<img>` sin optimización automática de Astro; ya viene optimizada por `sharp` en el upload (resize + WebP).
- **Logos de partners** (`/admin/images/logos.astro`) — **CRUD completo**, no slots fijos: agregar (solo imagen — sin campo de nombre, el cliente pidió quitarlo), eliminar, y reemplazar imagen. `FinalCTA.astro` ya no tiene ningún logo hardcodeado — renderiza el marquee 100% desde `listImages("logo")`; si la tabla queda vacía, la sección del marquee simplemente no se renderiza (sin fallback). Los 8 logos originales se migraron a la DB con `npm run db:seed-logos` (copia los assets a `public/uploads/logo/`, inserta filas con `title` del nombre original, aunque la UI ya no expone ese campo).
- Subida: `POST /api/admin/images/upload` (`multipart/form-data`: `category`, `slug`, `file` opcional, `title` opcional). Si no se manda `file` pero la fila ya existe, solo actualiza `title`/`alt` (usado internamente, ya no expuesto en la UI de logos). Valida tipo/tamaño, redimensiona con `sharp` (`400px` máx para logos, `1600px` máx para fotos), convierte a WebP, borra el archivo anterior si existía. Eliminar/revertir: `DELETE /api/admin/images/:category/:slug`.

### Permisos (`/admin/permits`)
- CRUD de los archivos descargables que aparecen en la sección "Downloadable Templates" de `/permits-and-authorizations` (PDF/DOC/DOCX/XLS/XLSX — **no** confundir con `PERMIT_SECTIONS`, el checklist de requisitos por tipo de vuelo en `src/data/permits.ts`, que sigue hardcodeado y fuera de este CRUD).
- Tabla `permit_downloads`: `name`, `fileUrl`, `fileType` (derivado de la extensión del archivo), `icon` (uno de 6: check/star/send/shield/plane/document), `size`.
- Los 10 archivos originales se migraron con `npm run db:seed-permit-downloads` — a diferencia de logos/imágenes, **no se copiaron los archivos**, la migración solo crea filas en la DB apuntando a las rutas que ya existían en `public/files/*`. Los archivos nuevos que se agreguen desde el admin sí se guardan físicamente en `public/uploads/permit-files/`. El endpoint DELETE solo borra del disco los archivos bajo `/uploads/permit-files/` — nunca toca los originales de `public/files/`.
- Endpoints: `GET /api/admin/permits` (list), `POST /api/admin/permits/upload` (crear — multipart: `name`, `icon`, `file`), `PUT /api/admin/permits/:id` (JSON — renombrar / cambiar ícono), `POST /api/admin/permits/:id/file` (multipart — reemplazar solo el archivo), `DELETE /api/admin/permits/:id`.
- `permits-and-authorizations.astro` lee `DOWNLOADS` desde `listPermitDownloads()` en vez de `src/data/permits.ts` (ese archivo sigue exportando `PERMIT_SECTIONS`, que la página todavía usa).

### Modales del admin (no usar `confirm()`/`alert()` nativos)
- `src/components/admin/ConfirmModal.astro` se monta una sola vez en `AdminLayout.astro` (solo si hay sesión) y expone dos funciones globales: `window.adminConfirm(message, opts?): Promise<boolean>` y `window.adminAlert(message, opts?): Promise<void>`. Tipos declarados en `src/env.d.ts`.
- **Gotcha real que ya se dio acá**: el overlay tiene `display: flex` en su regla de clase — sin una regla `.overlay[hidden] { display: none }` explícita, el atributo HTML `hidden` (que solo tiene especificidad de UA stylesheet) queda sobreescrito por el `display: flex` del autor, y el modal se ve aunque `el.hidden === true`. Cualquier overlay nuevo en el admin (como el modal de detalle de leads en `leads.astro`) necesita ese `[hidden] { display: none }` explícito antes de la regla base.
- Usar `await window.adminConfirm(...)` en vez de `confirm(...)`, y `await window.adminAlert(...)` en vez de `alert(...)`, en cualquier script nuevo del admin.

## Mail / formularios

`/contact` (página + `FinalCTA`) y el email gate de permisos postean a `/api/contact` y `/api/gate` (endpoints Astro). El viejo `mail.php`/PHPMailer se **eliminó del repo** (commit `ceb04a8`, jul 2026).

- Template HTML de email en `src/lib/server/mail.ts`, honeypot silencioso, rate limit in-memory por proceso (`src/lib/server/rateLimit.ts`).
- **No hay tokens CSRF** — se agregaron y luego se quitaron (`45c57f7`, daban 403 detrás del proxy). La protección CSRF es el **origin check** (`src/lib/server/originCheck.ts`), aplicado a `/api/contact`, `/api/gate` **y `/api/auth/login`**: en producción exige `ALLOWED_ORIGIN` exacto (con fallback same-origin por host público detrás del proxy). En dev (`NODE_ENV !== "production"`) acepta cualquier origin `localhost`/`127.0.0.1` sin importar el puerto — `astro dev` puede correr en 4321 (default), 4330 (vía el Preview tool) o el puerto que sea, y hardcodear uno en `.env.local` rompía el formulario en cualquier otro.
- Cada submit válido hace dos cosas: `createLead()` (insert en MySQL) y `sendContactEmail()`/`sendGateEmail()` (Nodemailer). Ver sección Admin CMS → Leads.
- Credenciales SMTP actuales (QA): `manny.cms@augustotturi.com` vía `smtp.hostinger.com:465` (SSL). Producción usará las credenciales de `no-replay@manny.aero` — pendiente confirmar si se mantiene Office 365 o se migra también a Hostinger.

## Conventions

- **Display titles** → use `var(--font-display)`, are added to the white-glow `text-shadow` rule in `global.css`. Current selectors covered:
  `hero__title`, `subhero__title`, `services__title`, `map__title`, `final__title`, `form-header__title`, `page-hero__title`, `section-title`, `content-section-title`, `isbha-cta-title`, `form-title`, `downloads-title`, `panel-title`, `modal-title`. To create a new display title, append the selector to that rule.
- **Yellow accents inside titles** → wrap in `<span class="accent">`. The white halo bleeds onto yellow text by design. (Internal pages also accept this pattern via `PageHero`'s `accent` prop.)
- **Body / UI / form fields / nav** → stay in Inter (`var(--font-sans)`).
- **Glass surfaces** (cards, pills, dropdowns) → `backdrop-filter: blur()` with clamps to ≤8px on mobile (GPU cost).
- **Reveal on scroll** → add class `.reveal`. The IntersectionObserver in `BaseLayout.astro` toggles `.in-view`.
- **Marquees / carousels** → duplicate the array (`[...items, ...items]`) and animate `translateX(0 → -50%)` for seamless loops. Mark duplicates `aria-hidden="true"` and pass `alt=""` for screen readers.
- **Astro Image** for everything in `src/assets/` → responsive widths + automatic webp/avif. Use `loading="eager"` only above the fold.

### Internal pages (about, isbah, permits, contact)

- **Hero pattern** → use `<PageHero badge title subtitle accent />`. Lighter than the main `Hero` (no video, no photo), inherits the page gradient. The `accent` prop wraps a substring of `title` in the yellow accent span.
- **Stats** → use `<StatsBand stats={...} />` for the 4-up glass strip below the hero.
- **Same look & feel as index** → all internal pages share the same gradient, blobs, noise, and glass tokens. Don't introduce a separate dark theme — that was tried and reverted (see "Things to avoid").
- **Sidebar scroll-sync** (isbah, permits) → sticky `<aside>` with `data-target` links and a scroll listener that toggles `.active` based on which section is in viewport at offset 100–130px. On mobile (<1024px) the sidebar collapses to a horizontal pill row with bottom-border active state.
- **Accordions** (isbah, permits) → `.req-card` / `.permit-section` with a header button toggling `.open` on the parent. Chevron rotates 180° via `transform`. First card opens by default.
- **Email gate** (permits downloads) → modal overlay; on submit, persists email to `localStorage` under key `manny_email`. Subsequent download clicks bypass the gate.
- **Tabs + modal sheet** (ground-handling) → desktop shows side nav + content panels with opacity transitions. Mobile (<1024px) hides that and shows a list that opens a bottom-sheet modal. Both share the same `SERVICES` array from `servicesDetail.ts`.

### Navbar

- Rutas reales: `/about`, `/ground-handling`, `/isbah`, `/permits-and-authorizations`, `/contact`, `/news`, `/catering`, `/founder`.
- El dropdown de Services lista: Ground Handling, Permits & Authorizations, IS-BAH, Manny's In-flight Catering — todos tienen página real.
- Majola Chauffeur ya no está en el dropdown (pendiente de confirmar con cliente).
- Anchor links (`/#map`) prefijados con `/` para funcionar desde cualquier página.

### Hero logo positioning

- Logo lives inside `.hero__logo-wrap` (absolute, top:20px, full width) which is also a `.container` and **explicitly capped at `max-width: 1100px`** to match `.hero__inner`. Without that cap the logo would inherit the default container max (1400px) and end up at a different X column than the title.

### CTAs — unified pattern

All primary CTAs share the same hover language: white inset top/bottom border at rest, **−2px lift** on hover, **yellow border + amber glow** on hover. Geometry is shared at `.gbtn` (`14px 28px` / `15px` / `weight 600`):
- `.gbtn` (3 variants: glass, outline, solid) — used by Hero, SubHero, FinalCTA marquee, etc.
- `.form__submit` — reuses the same metrics manually so the form CTA matches.
- `.nav__item--cta` (Contact in navbar) — keeps its smaller pill size for the navbar layout but shares the hover language.

### Floating OPS 24/7 module

- `<FloatingContact />` mounts in `BaseLayout.astro` so it appears on every page.
- Fixed `right: 18px; top: 38%` (offset above center so it doesn't sit dead-center). `z-index: 80` (above navbar 50, below mobile flyout 100).
- **Yellow-tinted glass** (`rgba(255, 185, 0, 0.32)` background, 1.5px gold border, white inset). Distinct from the navbar's neutral glass on purpose — it's the brand-colored "always available" channel.
- Hidden during the loader via `html:not(.is-ready) .float-ops { opacity: 0 }`.
- Mobile: smaller padding/icons (28-30px circles), still visible. Don't hide on mobile — the client wants it persistent.
- Email y teléfonos ya están configurados: `ops@manny.aero`, `+52 722 273 0981`, `+1 877 50 MANNY`.

## Visual system (tokens.css)

- `--color-accent: #ffb900` (yellow — used for accents, dots, hover states)
- `--color-text: #ffffff`
- `--color-text-muted: #ffffff` — **pure white**, not a transparent muted variant. The client wanted all subtitles/leads/descriptions in pure white instead of `rgba(255,255,255,0.7)`. Hierarchy comes from font size and weight, not opacity. Don't reintroduce alpha here without a new design decision.
- `--color-text-dim: rgba(255, 255, 255, 0.55)` — the only "muted" tier left, for low-priority hint text (e.g. flight repeater hints).
- `--font-display`: Bebas Neue, `--font-sans`: Aileron (with Inter fallback)
- `--bg-gradient`: light gray (`#b9b9b9`) → dark gray (`#424040`) vertical, applied site-wide (index and internal pages share it). Stretched to full body height (`background-size: 100% 100%`) so the visual pace differs between long/short pages — known limitation, the client is aware.
- Glass tokens: `--color-surface` (white 6%), `--color-surface-hover` (10%), `--color-border` (12%), `--color-border-strong` (18%).
- Decorative `.bg-blobs` and `.bg-noise` layers — disabled on mobile in `global.css` for GPU cost.

## Things to avoid (lessons from this codebase)

- **`dotenv` must stay in `dependencies`, not `devDependencies`.** `astro.config.mjs` imports it to load `.env.local` into `process.env` (Astro/Vite don't do this automatically for server-side code). That config file runs during `npm run build`, which Hostinger executes in production — if `dotenv` were dev-only and the install step skips devDependencies, the build breaks.
- **Astro's `<Image>` component can't render a runtime-uploaded file.** It needs a build-time-resolved import (`ImageMetadata`). For CMS-replaceable images (`/admin/images`), the pattern is: query the DB for an override once per component render, and conditionally render a plain `<img src="/uploads/...">` (already optimized by `sharp` at upload time) instead of `<Image>` when an override exists. See `ServiceCards.astro`, `SubHero.astro`, `FinalCTA.astro`.
- **Drizzle's `datetime()` column has no `.onUpdateNow()`** (that method only exists on `timestamp()`). Use `.$onUpdate(() => new Date())` instead — it's an ORM-level default applied on every Drizzle `update()`, not a DB-level trigger.
- **Don't run `git checkout`/`reset`/`clean` etc. against the QA MySQL DB via a list-then-delete-all pattern** in scripts or one-off bash — the permission layer flags unbounded deletes on shared databases. Delete by explicit tracked IDs instead.
- **`drizzle-kit push` puede colgarse indefinidamente** en "Pulling schema from database..." contra la QA DB (pasó más de una vez, sin patrón claro — no es falta de conectividad, una conexión `mysql2` directa a la misma DB responde en <1s). Si pasa: no reintentar en loop. Usar `drizzle-kit generate` en su lugar (no necesita introspección de la DB, solo diffea contra `drizzle/` local) para obtener el SQL, copiar el `CREATE TABLE`/`ALTER TABLE` de la tabla nueva, y ejecutarlo directo con un script `mysql2` de una sola vez. Borrar la carpeta `drizzle/` después — este proyecto no usa el flujo de migraciones versionadas de drizzle-kit, solo `push`/SQL directo.
- **Don't introduce a separate `data-page-theme="internal"` dark gradient.** This was tried (warm dark `#252524 → #424040`, blobs/noise disabled) and reverted because the client wants internal pages to share the home's gradient. If you re-add it, expect to revert it again.
- **Bebas Neue under ~18px** is condensed/illegible — only for display titles, never for body or labels.
- **Inputs at `<14px`** trigger iOS auto-zoom on focus. Form inputs are `14px` minimum.
- **`background-clip: text`** with `text-fill-color: transparent` makes the element transparent → `text-shadow` won't render. Use `filter: drop-shadow()` instead, or just use plain `color` + `text-shadow` (current approach for the title shine).
- **Heavy backdrop-filter blur on mobile** kills scroll perf. The mobile media query in `global.css` clamps all glass blurs to 8px.
- **Adding `font-display: swap`** comes free with `@fontsource` — don't override it.
- **Don't use Google Fonts CDN.** Self-host via `@fontsource/<font>` so the hashed assets get long-lived caching and there are zero third-party requests.
- **Don't extend `services.ts` with rich fields** — it's used by `ServiceCards.astro` on the index and only needs `slug`, `title`, `href`, `tone`. Rich data (tag, desc, features, image) lives in `servicesDetail.ts` for the `/ground-handling` page.
- **Don't relocate the map filter pills inside the canvas.** Tried as a fix for the navbar overlap on scroll, the client rejected it. Pills stay above the map.
- **Don't switch the body gradient to `background-attachment: fixed`** to "unify" page heights. Tried, the client rejected it. The current stretch-per-page behavior is intentional.
- **Don't add a 3-side / asymmetric white inset border to cards.** Tried (left+top+bottom only, 2px white) so the cards felt outlined, the client rejected it. The cards keep the original full-perimeter `inset 0 0 0 1px rgba(255,255,255,0.35)` ring.
- **No zipear el `dist/` desde la raíz del proyecto en Windows.** Genera paths `dist\archivo` que Hostinger interpreta como nombres de archivo. Siempre zipear desde dentro del `dist/`.

## Deploy / hosting specifics

- **`.htaccess` ya no existe.** Confirmado en producción que Apache/LiteSpeed nunca corre (el Node app sirve directo detrás del edge CDN de Hostinger), así que era inerte y se eliminó del repo (jul 2026). Sus responsabilidades viven en `server.mjs`: headers de seguridad + HSTS, `compression()`, y los 301 redirects (`REDIRECTS`: `/services`, `/isbha`, `/permits_and_authorizations`, `/our_founder`).
- **El edge CDN (hcdn) pisa el header CSP** con su propio `upgrade-insecure-requests` — por eso la CSP enforced se entrega como `<meta>` desde `src/lib/csp.ts` (ver Stack).
- Servidor de desarrollo (QA, cuenta `u676595820`): antes era Hostinger conectado a GitHub `main` con auto-deploy al push (modelo static). **Este flujo cambió** — ahora necesita correr como app Node.js igual que producción (ver sección Deploy arriba). Confirmar con el cliente/Hostinger si el auto-deploy por GitHub sigue funcionando para apps Node o si pasa a ser manual también en QA.
- After deploy, hard-refresh (Ctrl+F5) to bypass browser cache while testing.

## Performance baseline

- LCP target: <2.0s (hero title in Bebas, preloaded woff2 + webp poster as LQIP)
- Hero video (`hero-manny-final.mp4`) is currently ~4 MB unoptimized — known tech debt, not yet compressed.
- Page weight is dominated by the video; everything else is tightly optimized via Astro Image + cache headers en `server.mjs`. Las OG images `og/founder.jpg` (9.6 MB), `og/catering.jpg` (6.9 MB) y `og/isbah.jpg` (5.2 MB) siguen sin optimizar (ver TODO.md).
- Internal pages are noticeably lighter than the index (no video, no Leaflet, no marquee) — they ride the same shell but render only PageHero + StatsBand + page-specific content.

## Out-of-scope reminders

- The "client gradient background" (4-corner gray mesh from a client mockup) is **planned but not implemented**. The user explicitly opted out — they'll handle it later. Don't apply it without being asked.
- Pre-existing `astro check` error (unrelated to this codebase's pages):
  - `MapSection.astro:161` — `tap: false` not in Leaflet's `MapOptions` type.
  Build still succeeds. (El mismatch de `ActiveLink` "blog" vs "news" que existía antes entre `BaseLayout` y `Navbar` se corrigió en la migración a SSR — ambos tipos ahora usan `"news"`.)
- Phases 2 (video compression, JPG/SVG/GeoJSON optimization) y 3 (font-display, blob audit) del plan de optimización están diferidas.

---

## Estado de seguridad — 2026-07-09

### 🟡 Deuda técnica (post go-live)

1. **`innerHTML` sin escapar en el modal de servicios** (`ground-handling.astro` ~274-276)
   - `modalTitle.innerHTML` y `modalFeatures.innerHTML` usan template literals directos con datos de `servicesDetail.ts` (hoy es contenido propio hardcodeado, riesgo bajo).

2. **`buildPopupHtml` en `MapSection.astro` usa `innerHTML` con datos de aeropuertos**
   - Reemplazar con función DOM imperativa; validar scheme de `a.pdf`.

3. **`getClientIp` (`src/lib/server/rateLimit.ts`) confía en headers del proxy**
   - Prefiere `x-real-ip` y cae a la primera entrada de `X-Forwarded-For`; el propio comentario del código admite que falta confirmar qué header setea el edge (hcdn) para hacerlo a prueba de spoofing.

### ✅ Lo que está bien (no tocar)

- Cabeceras HTTP emitidas por `server.mjs`: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP (defensa en profundidad) — y CSP enforced vía `<meta>` (`src/lib/csp.ts`) porque el edge pisa el header.
- Compresión vía `compression()` en `server.mjs` (+ Brotli en el edge CDN).
- Origin check (`originCheck.ts`) en contact, gate y login — cumple el rol anti-CSRF (no hay tokens, se quitaron en `45c57f7` por 403s detrás del proxy).
- Auth: bcrypt + JWT httpOnly 12h; rate limit propio en login (10 intentos / 5 min por IP).
- Validación de payloads con zod en todos los endpoints (`src/pages/api/**`).
- Uploads validados (tipo/tamaño) y re-procesados con sharp; DELETE de permits solo toca archivos bajo `uploads/permit-files/`.
- Fuentes self-hosted sin CDN externo.
- Honeypot silencioso en formulario de contacto y email gate.
- Errores SMTP loggeados server-side, nunca expuestos al cliente.
- Todos los links `target="_blank"` en Footer usan `rel="noopener noreferrer"`.
- JSON-LD structured data en todas las páginas internas.
- OG images específicas por página.
- Google Search Console verificado con meta tag en `BaseLayout.astro`.

> Historial: los items del modelo PHP (mail-config.php, debug-mail.php, secrets file, mail.php) quedaron obsoletos al eliminarse todo el backend PHP en la migración SSR (jul 2026). El CSS muerto de contact/catering/Navbar se limpió el 2026-07-09.
