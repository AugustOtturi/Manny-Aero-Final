# CLAUDE.md

Guidance for Claude Code when working on the Manny Aero website.

## Project

Static marketing site for **Manny Aero** — premium aircraft ground handling, permits, catering and FBO coordination across Mexico. Multi-page Astro site, content is hardcoded in components / `src/data/*`. No CMS, no backend.

Routes (todas las páginas construidas a junio 2026):
- `/` — main landing (hero video, subhero, service cards, map, final CTA)
- `/about` — company story, timeline, team, values
- `/ground-handling` — servicios detallados (tabs desktop, modal bottom-sheet mobile). `/services` redirige aquí via 301 en `.htaccess`.
- `/catering` — Manny's In-Flight Catering (foto hero + lista de servicios + CTA)
- `/isbah` — IS-BAH compliance program (sticky sidebar nav + accordions). `/isbha` redirige aquí via 301 en `.htaccess`.
- `/permits-and-authorizations` — permit categories (sticky sidebar nav + accordions + email-gated downloads)
- `/contact` — flight request form + contact cards
- `/founder` — historia del fundador (sticky photo + body texto)
- `/news` — index de artículos (grid 3 col)
- `/news/[slug]` — artículo individual (generado desde `src/data/news.ts`)
- `/404` — página de error personalizada

## Stack

- **Astro 5** (static output, no SSR adapter — output is plain HTML/CSS/JS in `dist/`)
- **TypeScript** (strict)
- **Leaflet** for the map (lazy-loaded via IntersectionObserver in `MapSection.astro`)
- **@astrojs/sitemap** for sitemap generation
- **Fonts** (self-hosted via `@fontsource`, never Google CDN):
  - `Inter` 400–900 → body, UI, navigation (`var(--font-sans)`)
  - `Bebas Neue` 400 → display titles only (`var(--font-display)`)
- **Hosting (dev/staging)**: cuenta de Engenio Digital en Hostinger, conectada a GitHub `main`. Auto-deploy al push.
- **Hosting (cliente/producción)**: cuenta del cliente en Hostinger (`u824529850`). **No conectada a GitHub** — deploy manual: `npm run build` → zipear `dist/` → subir y extraer en `public_html/`.

## Commands

```
npm run dev      # local preview at http://localhost:4321
npm run build    # validate before commit (also re-encodes images)
npm run preview  # serve dist/ locally
npm run check    # astro check (TypeScript)
```

## Deploy manual (servidor del cliente)

1. `npm run build`
2. `cd dist && powershell Compress-Archive -Path * -DestinationPath ../manny-aero-dist.zip -Force`
3. Subir `manny-aero-dist.zip` al `public_html/` del cliente via File Manager
4. Extraer (con "Overwrite existing files" activado)

> ⚠️ Al zipear hacerlo **desde dentro del `dist/`** para evitar paths `dist\archivo` en Windows.

## File layout

```
public/
  .htaccess              # Apache config (Brotli, 1y immutable cache, MIME, security headers, HTTPS redirect, 301 redirects)
  favicon.svg, logo-manny.svg, og-default.jpg
  map/mexico-states.geojson
  og/                    # OG images por página (catering, isbah, founder, permits, ground-handling, about, services, contact)
  phpmailer/             # PHPMailer bundle (acceso bloqueado por .htaccess DirectoryMatch)
  mail.php               # Handler PHP del formulario de contacto y email gate
src/
  layouts/BaseLayout.astro     # <head>, app-loader, font preloads, reveal observer, Google Search Console meta tag
  pages/
    index.astro                # main landing
    about.astro
    ground-handling.astro      # tabs (desktop) + modal sheet (mobile)
    catering.astro             # In-flight catering page
    isbah.astro                # sticky sidebar + accordions (ruta: /isbah)
    permits-and-authorizations.astro  # sidebar + accordions + email-gated downloads
    contact.astro              # form + sidebar
    founder.astro              # sticky photo + body texto fundador
    404.astro                  # error page
    news/
      index.astro              # grid de artículos
      [slug].astro             # artículo individual (getStaticPaths desde news.ts)
  components/
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
    isbhaModules.ts            # 6 ISBHA compliance modules para /isbah
    permits.ts                 # PERMIT_SECTIONS + DOWNLOADS para /permits-and-authorizations
    events.ts                  # event partners
    news.ts                    # artículos de noticias (imageKey, slug, body, etc.)
  styles/
    tokens.css                 # CSS variables (colors, fonts, breakpoints, motion)
    global.css                 # base styles + utilities (includes the white-title shine rule)
  assets/
    photos/                    # fotos webp/jpg (subhero-1..4, service-*, catering, founder, noticias)
    fonts/                     # Aileron otf self-hosted
    files/                     # archivos descargables para /permits-and-authorizations
    Logo1..8.png               # partner logos para el marquee
    poster-hero.webp           # hero LQIP fallback
    hero-manny-final.mp4
    mannylogo.png              # logo para el flyout mobile del navbar
```

## Mail / formulario de contacto

### Arquitectura

`mail.php` carga credenciales en este orden de prioridad:
1. **Secrets file en el servidor** (fuera de `public_html`, nunca en git)
2. Variables de entorno (`MANNY_SMTP_*`)
3. Defaults hardcodeados en `mail.php`

El secrets file **siempre gana** — las otras capas son fallback. En la práctica solo existe el secrets file.

### Servidor de desarrollo (Engenio)
- Path del secrets file: `/home/u676595820/manny-secrets.php`
- SMTP: `smtp.hostinger.com:465` (SSL) con `testmanny@engeniodigital.tech`
- Destino: `augustotturi99@gmail.com`

### Servidor del cliente (producción)
- Path del secrets file: `/home/u824529850/manny-secrets.php`
- SMTP: `smtp.office365.com:587` (STARTTLS) con `no-replay@manny.aero` (Microsoft 365)
- Destino: `ops@manny.aero`
- `ALLOWED_ORIGIN`: cambiar a `https://manny.aero` antes del go-live final

### Contenido del secrets file (producción)
```php
<?php
define('SMTP_HOST',       'smtp.office365.com');
define('SMTP_PORT',       587);
define('SMTP_USER',       'no-replay@manny.aero');
define('SMTP_PASS',       'N0R3pl4y.Manny');
define('MAIL_FROM',       'no-replay@manny.aero');
define('MAIL_FROM_NAME',  'Website Form');
define('MAIL_TO_CONTACT', 'ops@manny.aero');
define('MAIL_TO_GATE',    'ops@manny.aero');
define('ALLOWED_ORIGIN',  'https://manny.aero');
define('RATE_LIMIT_MAX',    15);
define('RATE_LIMIT_WINDOW', 3600);
```

### Blog / noticias

El sistema de noticias es **estático** — no hay CMS. Para agregar un artículo:
1. Agregar entrada en `src/data/news.ts` con: `slug`, `title`, `category`, `date`, `excerpt`, `body[]`, `imageKey`
2. `imageKey` solo acepta: `"ibac" | "fifa" | "nbaa"` (imágenes pre-existentes)
3. `npm run build` + deploy manual al servidor del cliente
4. El cliente manda el contenido al desarrollador — no puede publicar solo.

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
- CSS muerto en Navbar: `.nav__dd-item--full`, `.nav__dd-item--divider`, `.flyout__sublink--all`, `.flyout__sublink--divider` — selectores de variantes que se quitaron del HTML pero el CSS quedó.

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

- **Don't introduce a separate `data-page-theme="internal"` dark gradient.** This was tried (warm dark `#252524 → #424040`, blobs/noise disabled) and reverted because the client wants internal pages to share the home's gradient. If you re-add it, expect to revert it again.
- **Bebas Neue under ~18px** is condensed/illegible — only for display titles, never for body or labels.
- **Inputs at `<14px`** trigger iOS auto-zoom on focus. Form inputs are `14px` minimum.
- **`background-clip: text`** with `text-fill-color: transparent` makes the element transparent → `text-shadow` won't render. Use `filter: drop-shadow()` instead, or just use plain `color` + `text-shadow` (current approach for the title shine).
- **Heavy backdrop-filter blur on mobile** kills scroll perf. The mobile media query in `global.css` clamps all glass blurs to 8px.
- **Adding `font-display: swap`** comes free with `@fontsource` — don't override it.
- **Don't use Google Fonts CDN.** Self-host via `@fontsource/<font>` so the `.htaccess` 1y immutable cache rule applies and there are zero third-party requests.
- **Don't extend `services.ts` with rich fields** — it's used by `ServiceCards.astro` on the index and only needs `slug`, `title`, `href`, `tone`. Rich data (tag, desc, features, image) lives in `servicesDetail.ts` for the `/ground-handling` page.
- **Don't relocate the map filter pills inside the canvas.** Tried as a fix for the navbar overlap on scroll, the client rejected it. Pills stay above the map.
- **Don't switch the body gradient to `background-attachment: fixed`** to "unify" page heights. Tried, the client rejected it. The current stretch-per-page behavior is intentional.
- **Don't add a 3-side / asymmetric white inset border to cards.** Tried (left+top+bottom only, 2px white) so the cards felt outlined, the client rejected it. The cards keep the original full-perimeter `inset 0 0 0 1px rgba(255,255,255,0.35)` ring.
- **No zipear el `dist/` desde la raíz del proyecto en Windows.** Genera paths `dist\archivo` que Hostinger interpreta como nombres de archivo. Siempre zipear desde dentro del `dist/`.

## Deploy / hosting specifics

- `public/.htaccess` ships to `dist/.htaccess` automatically. It handles compression (Brotli + Gzip fallback), cache (1y immutable for hashed `_astro/*` assets, no-cache for HTML), MIME types, security headers, HTTPS redirect, font CORS.
- 301 redirects activos: `/services` → `/ground-handling`, `/isbha` → `/isbah`.
- Servidor de desarrollo: Hostinger conectado a GitHub `main`, auto-deploy al push.
- Servidor del cliente: deploy manual (ver sección Deploy manual arriba).
- After push/deploy, hard-refresh (Ctrl+F5) to bypass browser cache while testing.

## Performance baseline

- LCP target: <2.0s (hero title in Bebas, preloaded woff2 + webp poster as LQIP)
- Hero video (`hero-manny-final.mp4`) is currently ~4 MB unoptimized — known tech debt, not yet compressed.
- Page weight is dominated by the video; everything else is tightly optimized via Astro Image + `.htaccess` cache.
- Internal pages are noticeably lighter than the index (no video, no Leaflet, no marquee) — they ride the same shell but render only PageHero + StatsBand + page-specific content.

## Out-of-scope reminders

- The "client gradient background" (4-corner gray mesh from a client mockup) is **planned but not implemented**. The user explicitly opted out — they'll handle it later. Don't apply it without being asked.
- Pre-existing `astro check` errors (unrelated to this codebase's pages):
  - `MapSection.astro:165` — `tap: false` not in Leaflet's `MapOptions` type.
  - `BaseLayout.astro:220` — `ActiveLink` mismatch ("blog" vs "news") entre BaseLayout y Navbar types. El tipo en BaseLayout tiene `"blog"` en lugar de `"news"`.
  Build still succeeds.
- Phases 2 (video compression, JPG/SVG/GeoJSON optimization) y 3 (font-display, blob audit) del plan de optimización están diferidas.

---

## Estado de seguridad — 2026-06-04

### ✅ Resuelto

1. **`public/mail-config.php` eliminado** — credenciales ya no están en el repo ni en el servidor.
2. **`debug-mail.php` eliminado** — endpoint de debug removido del repo y del servidor.
3. **Rate limit en producción** — `RATE_LIMIT_MAX = 15`, `RATE_LIMIT_WINDOW = 3600`.
4. **`ALLOWED_ORIGIN` ahora verificado** — `mail.php` lee la constante del secrets file y la aplica en el origin check.
5. **Secrets file fuera de `public_html`** — credenciales SMTP nunca accesibles via web.

### 🟡 Deuda técnica (post go-live)

5. **`innerHTML` sin escapar en el modal de servicios** (`ground-handling.astro`)
   - `modalFeatures.innerHTML` y `modalTitle.innerHTML` usan template literals directos.

6. **`buildPopupHtml` en `MapSection.astro` usa `innerHTML` con datos de aeropuertos**
   - Reemplazar con función DOM imperativa; validar scheme de `a.pdf`.

7. **Rate limit usa `X-Forwarded-For` sin verificar el proxy** (`mail.php`)
   - En Hostinger shared hosting usar `REMOTE_ADDR` directamente.

8. **CSS muerto** en `contact.astro`, `catering.astro` y `Navbar.astro`.

### ✅ Lo que está bien (no tocar)

- Cabeceras HTTP: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- HTTPS forzado con 301 en `.htaccess`.
- Brotli + Gzip configurados correctamente.
- Fuentes self-hosted sin CDN externo.
- `Options -Indexes` activo.
- Honeypot silencioso en formulario de contacto y email gate.
- Sanitización PHP: `clean()` con `strip_tags + htmlspecialchars + ENT_QUOTES`.
- Validación de email con `FILTER_VALIDATE_EMAIL` en PHP.
- Errores SMTP loggeados server-side, nunca expuestos al cliente.
- Todos los links `target="_blank"` en Footer usan `rel="noopener noreferrer"`.
- JSON-LD structured data en todas las páginas internas.
- OG images específicas por página.
- Google Search Console verificado con meta tag en `BaseLayout.astro`.
