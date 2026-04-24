# CLAUDE.md

Guidance for Claude Code when working on the Manny Aero website.

## Project

Static marketing site for **Manny Aero** — premium aircraft ground handling, permits, catering and FBO coordination across Mexico. Multi-page Astro site (6 routes), content is hardcoded in components / `src/data/*`. No CMS, no backend.

Routes:
- `/` — main landing (hero video, subhero, service cards, map, final CTA)
- `/about` — company story, timeline, team, values
- `/services` — detailed services (tabs desktop, modal bottom-sheet mobile)
- `/isbha` — IS-BAH compliance program (sticky sidebar nav + accordions)
- `/permits-and-authorizations` — permit categories (sticky sidebar nav + accordions + email-gated downloads)
- `/contact` — flight request form + contact cards

## Stack

- **Astro 5** (static output, no SSR adapter — output is plain HTML/CSS/JS in `dist/`)
- **TypeScript** (strict)
- **Leaflet** for the map (lazy-loaded via IntersectionObserver in `MapSection.astro`)
- **@astrojs/sitemap** for sitemap generation
- **Fonts** (self-hosted via `@fontsource`, never Google CDN):
  - `Inter` 400–900 → body, UI, navigation (`var(--font-sans)`)
  - `Bebas Neue` 400 → display titles only (`var(--font-display)`)
- **Hosting**: Hostinger Business Premium, Apache/LiteSpeed, auto-deploys from GitHub `main`. Node 22.x, build `npm run build`, output `dist/`.

## Commands

```
npm run dev      # local preview at http://localhost:4321
npm run build    # validate before commit (also re-encodes images)
npm run preview  # serve dist/ locally
npm run check    # astro check (TypeScript)
```

Commit + push to `main` → Hostinger redeploys automatically. No manual deploy step.

## File layout

```
public/
  .htaccess           # Apache config (Brotli, 1y immutable cache, MIME, security headers, HTTPS redirect)
  favicon.svg, logo-manny.svg, og-default.jpg
  map/mexico-states.geojson
src/
  layouts/BaseLayout.astro     # <head>, app-loader, font preloads, reveal observer
  pages/
    index.astro                # main landing
    about.astro
    services.astro             # tabs (desktop) + modal sheet (mobile)
    isbha.astro                # sticky sidebar + accordions
    permits-and-authorizations.astro  # sidebar + accordions + email-gated downloads
    contact.astro              # form + sidebar
  components/
    Hero.astro, SubHero.astro, ServiceCards.astro,
    MapSection.astro, FinalCTA.astro, Navbar.astro, Footer.astro
    PageHero.astro             # internal-page hero (badge + title + subtitle, no video/photo)
    StatsBand.astro            # 4-up stats strip (glass cards)
    ui/GlassButton.astro, ui/GlassPill.astro
  data/
    airports.ts                # 80+ airports for the map
    services.ts                # minimal data (slug, title, href, tone) for ServiceCards on the index
    servicesDetail.ts          # rich data (tag, desc, features, image) for /services page
    isbhaModules.ts            # 6 ISBHA compliance modules for /isbha
    permits.ts                 # PERMIT_SECTIONS + DOWNLOADS for /permits-and-authorizations
    events.ts                  # event partners
  styles/
    tokens.css                 # CSS variables (colors, fonts, breakpoints, motion)
    global.css                 # base styles + utilities (includes the white-title shine rule)
  assets/
    photos/                    # B&W webp photos (subhero-1..4, service-*)
    Logo1..8.png               # partner logos for the marquee
    poster-hero.webp           # hero LQIP fallback
    hero-manny-final.mp4
```

## Conventions

- **Display titles** → use `var(--font-display)`, are added to the white-glow `text-shadow` rule in `global.css`. Current selectors covered:
  `hero__title`, `subhero__title`, `services__title`, `map__title`, `final__title`, `form-header__title`, `page-hero__title`, `section-title`, `content-section-title`, `isbha-cta-title`, `form-title`, `downloads-title`, `panel-title`, `modal-title`. To create a new display title, append the selector to that rule.
- **Yellow accents inside titles** → wrap in `<span class="accent">`. The white halo bleeds onto yellow text by design. (Internal pages also accept this pattern via `PageHero`'s `accent` prop.)
- **Body / UI / form fields / nav** → stay in Inter (`var(--font-sans)`).
- **Glass surfaces** (cards, pills, dropdowns) → `backdrop-filter: blur()` with clamps to ≤8px on mobile (GPU cost).
- **Reveal on scroll** → add class `.reveal`. The IntersectionObserver in `BaseLayout.astro` toggles `.in-view`.
- **Marquees / carousels** → duplicate the array (`[...items, ...items]`) and animate `translateX(0 → -50%)` for seamless loops. Mark duplicates `aria-hidden="true"` and pass `alt=""` for screen readers.
- **Astro Image** for everything in `src/assets/` → responsive widths + automatic webp/avif. Use `loading="eager"` only above the fold.

### Internal pages (about, services, isbha, permits, contact)

- **Hero pattern** → use `<PageHero badge title subtitle accent />`. Lighter than the main `Hero` (no video, no photo), inherits the page gradient. The `accent` prop wraps a substring of `title` in the yellow accent span.
- **Stats** → use `<StatsBand stats={...} />` for the 4-up glass strip below the hero.
- **Same look & feel as index** → all internal pages share the same gradient, blobs, noise, and glass tokens. Don't introduce a separate dark theme — that was tried and reverted (see "Things to avoid").
- **Sidebar scroll-sync** (isbha, permits) → sticky `<aside>` with `data-target` links and a scroll listener that toggles `.active` based on which section is in viewport at offset 100–130px. On mobile (<1024px) the sidebar collapses to a horizontal pill row with bottom-border active state.
- **Accordions** (isbha, permits) → `.req-card` / `.permit-section` with a header button toggling `.open` on the parent. Chevron rotates 180° via `transform`. First card opens by default.
- **Email gate** (permits downloads) → modal overlay; on submit, persists email to `localStorage` under key `manny_email`. Subsequent download clicks bypass the gate.
- **Tabs + modal sheet** (services) → desktop shows side nav + content panels with opacity transitions. Mobile (<1024px) hides that and shows a list that opens a bottom-sheet modal. Both share the same `SERVICES` array from `servicesDetail.ts`.

### Navbar

- Real routes for the 5 internal pages (`/about`, `/services`, `/isbha`, `/permits-and-authorizations`, `/contact`).
- Anchor links (`/#map`, `/#news`) prefix with `/` so they work from any page (route + scroll).
- Services dropdown lists All Services, Permits & Authorization, IS-BAH (real routes), plus Manny's Catering and Majola Chauffeur (placeholders that 404 — those pages are not built yet).

## Visual system (tokens.css)

- `--color-accent: #ffb900` (yellow — used for accents, dots, hover states)
- `--color-text: #ffffff`
- `--font-display`: Bebas Neue, `--font-sans`: Inter
- `--bg-gradient`: light gray (`#b9b9b9`) → dark gray (`#424040`) vertical, applied site-wide (index and internal pages share it).
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
- **Don't extend `services.ts` with rich fields** — it's used by `ServiceCards.astro` on the index and only needs `slug`, `title`, `href`, `tone`. Rich data (tag, desc, features, image) lives in `servicesDetail.ts` for the `/services` page.

## Deploy / hosting specifics

- `public/.htaccess` ships to `dist/.htaccess` automatically. It handles compression (Brotli + Gzip fallback), cache (1y immutable for hashed `_astro/*` assets, no-cache for HTML), MIME types, security headers, HTTPS redirect, font CORS.
- Hostinger panel config: Astro preset, branch `main`, Node 22.x, root `./`, build `npm run build`, output `dist`, entry empty (static, no SSR).
- After push, hard-refresh (Ctrl+F5) to bypass browser cache while testing.

## Performance baseline

- LCP target: <2.0s (hero title in Bebas, preloaded woff2 + webp poster as LQIP)
- Hero video (`hero-manny-final.mp4`) is currently ~4 MB unoptimized — known tech debt, not yet compressed (FASE 2.1 of the optimization plan we drafted but didn't run).
- Page weight is dominated by the video; everything else is tightly optimized via Astro Image + `.htaccess` cache.
- Internal pages are noticeably lighter than the index (no video, no Leaflet, no marquee) — they ride the same shell but render only PageHero + StatsBand + page-specific content.

## Out-of-scope reminders

- The "client gradient background" (4-corner gray mesh from a client mockup) is **planned but not implemented**. The user explicitly opted out — they'll handle it later. Don't apply it without being asked.
- `/services/catering` and `/services/chauffeur` are linked from the Navbar dropdown but **don't exist yet** — they'll 404. The pages will be added later by the user; leave the links unless asked to remove them.
- Download files in `permits.ts` use `url: "#"` — real downloadable assets haven't been hooked up yet.
- Pre-existing `astro check` errors (unrelated to this codebase's pages):
  - `MapSection.astro:165` — `tap: false` not in Leaflet's `MapOptions` type.
  - `BaseLayout.astro:220` — `ActiveLink` mismatch ("blog" vs "news") between BaseLayout and Navbar types.
  Build still succeeds.
- The optimization plan in `~/.claude/plans/declarative-twirling-puppy.md` had 4 phases. Only **Phase 1** (Hero LQIP) and **Phase 4** (`.htaccess`) were applied. Phases 2 (video compression, JPG/SVG/GeoJSON optimization) and 3 (font-display, blob audit) are deferred.
