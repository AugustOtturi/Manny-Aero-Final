# CLAUDE.md

Guidance for Claude Code when working on the Manny Aero website.

## Project

Static marketing site for **Manny Aero** — premium aircraft ground handling, permits, catering and FBO coordination across Mexico. Single-page Astro site, content is hardcoded in components / `src/data/*`. No CMS, no backend.

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
  components/
    Hero.astro, SubHero.astro, ServiceCards.astro,
    MapSection.astro, FinalCTA.astro, Navbar.astro, Footer.astro
    ui/GlassButton.astro, ui/GlassPill.astro
  data/
    airports.ts        # 80+ airports for the map
    services.ts        # service cards data
  styles/
    tokens.css         # CSS variables (colors, fonts, breakpoints, motion)
    global.css         # base styles + utilities (includes the white-title shine rule)
  assets/
    photos/            # B&W webp photos (subhero-1..4, service-*)
    Logo1..8.png       # partner logos for the marquee
    poster-hero.webp   # hero LQIP fallback
    hero-manny-final.mp4
```

## Conventions

- **Display titles** (`hero__title`, `subhero__title`, `services__title`, `map__title`, `final__title`, `form-header__title`) → use `var(--font-display)`, are added to the white-glow `text-shadow` rule in `global.css`. To create a new display title, append the selector to that rule.
- **Yellow accents inside titles** → wrap in `<span class="accent">`. The white halo bleeds onto yellow text by design.
- **Body / UI / form fields / nav** → stay in Inter (`var(--font-sans)`).
- **Glass surfaces** (cards, pills, dropdowns) → `backdrop-filter: blur()` with clamps to ≤8px on mobile (GPU cost).
- **Reveal on scroll** → add class `.reveal`. The IntersectionObserver in `BaseLayout.astro` toggles `.in-view`.
- **Marquees / carousels** → duplicate the array (`[...items, ...items]`) and animate `translateX(0 → -50%)` for seamless loops. Mark duplicates `aria-hidden="true"` and pass `alt=""` for screen readers.
- **Astro Image** for everything in `src/assets/` → responsive widths + automatic webp/avif. Use `loading="eager"` only above the fold.

## Visual system (tokens.css)

- `--color-accent: #ffb900` (yellow — used for accents, dots, hover states)
- `--color-text: #ffffff`
- `--font-display`: Bebas Neue, `--font-sans`: Inter
- `--bg-gradient`: white → dark gray vertical (page background)
- Decorative `.bg-blobs` and `.bg-noise` layers — disabled on mobile in `global.css` for GPU cost.

## Things to avoid (lessons from this codebase)

- **Bebas Neue under ~18px** is condensed/illegible — only for display titles, never for body or labels.
- **Inputs at `<14px`** trigger iOS auto-zoom on focus. Form inputs are `14px` minimum.
- **`background-clip: text`** with `text-fill-color: transparent` makes the element transparent → `text-shadow` won't render. Use `filter: drop-shadow()` instead, or just use plain `color` + `text-shadow` (current approach for the title shine).
- **Heavy backdrop-filter blur on mobile** kills scroll perf. The mobile media query in `global.css` clamps all glass blurs to 8px.
- **Adding `font-display: swap`** comes free with `@fontsource` — don't override it.
- **Don't use Google Fonts CDN.** Self-host via `@fontsource/<font>` so the `.htaccess` 1y immutable cache rule applies and there are zero third-party requests.

## Deploy / hosting specifics

- `public/.htaccess` ships to `dist/.htaccess` automatically. It handles compression (Brotli + Gzip fallback), cache (1y immutable for hashed `_astro/*` assets, no-cache for HTML), MIME types, security headers, HTTPS redirect, font CORS.
- Hostinger panel config: Astro preset, branch `main`, Node 22.x, root `./`, build `npm run build`, output `dist`, entry empty (static, no SSR).
- After push, hard-refresh (Ctrl+F5) to bypass browser cache while testing.

## Performance baseline

- LCP target: <2.0s (hero title in Bebas, preloaded woff2 + webp poster as LQIP)
- Hero video (`hero-manny-final.mp4`) is currently ~4 MB unoptimized — known tech debt, not yet compressed (FASE 2.1 of the optimization plan we drafted but didn't run).
- Page weight is dominated by the video; everything else is tightly optimized via Astro Image + `.htaccess` cache.

## Out-of-scope reminders

- The "client gradient background" (4-corner gray mesh from a client mockup) is **planned but not implemented**. The user explicitly opted out — they'll handle it later. Don't apply it without being asked.
- The optimization plan in `~/.claude/plans/declarative-twirling-puppy.md` had 4 phases. Only **Phase 1** (Hero LQIP) and **Phase 4** (`.htaccess`) were applied. Phases 2 (video compression, JPG/SVG/GeoJSON optimization) and 3 (font-display, blob audit) are deferred.
