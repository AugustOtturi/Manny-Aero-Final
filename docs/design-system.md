# Manny Aero — Design System

> **Purpose.** Single source of truth for the visual and interaction language of the Manny Aero site. Use this to design/build new pages (About, Services, News, Contact, Map) consistent with the already-shipped Home.
>
> **Stack.** Astro 4, vanilla CSS with CSS custom properties, no Tailwind, no component library. Scoped styles per `.astro` file. Fonts via `@fontsource/inter`.
>
> **Truth lives in code.** Tokens are in [src/styles/tokens.css](../src/styles/tokens.css). Global rules in [src/styles/global.css](../src/styles/global.css). This doc summarizes and explains; if code and doc disagree, code wins — update the doc.

---

## 1. Brand in one line

**Premium aviation ground handling for Mexico.** Dark, quiet, confident. Gold as the only accent. Generous whitespace, real photography, subtle motion. Nothing plastic, nothing bubbly.

Voice: terse, operational, English-first. Event-driven copy ("24/7", "end-to-end", "delivered by experts").

---

## 2. Color tokens

All colors live as CSS custom properties in `tokens.css`. Do not hardcode hex values in new components — use the tokens.

| Token | Value | Use |
|---|---|---|
| `--color-accent` | `#ffb900` | Gold. Primary accent, CTAs, active state, dots, focus ring. |
| `--color-accent-hover` | `#ffc933` | Hover state for gold elements. |
| `--color-text` | `#ffffff` | Primary text on dark surfaces. |
| `--color-text-muted` | `rgba(255,255,255,0.7)` | Body copy, descriptions. |
| `--color-text-dim` | `rgba(255,255,255,0.45)` | Tertiary text, metadata. |
| `--color-surface` | `rgba(255,255,255,0.06)` | Glass surface base. |
| `--color-surface-hover` | `rgba(255,255,255,0.1)` | Glass surface hover. |
| `--color-border` | `rgba(255,255,255,0.12)` | Default border on dark surfaces. |
| `--color-border-strong` | `rgba(255,255,255,0.18)` | Border on focus/hover. |
| `--color-bg-footer` | `#0a0a0a` | Solid footer only. |
| `--pin-gold/red/blue/orange` | map pin colors | Only used in the map section. |

### Global page background

The whole page sits on a vertical gradient + grain + blurred blobs.

```css
--bg-top: #ffffff;
--bg-bottom: #424040;
--bg-gradient: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%);
--noise-opacity: 0.6;
```

The gradient is continuous top→bottom — **do not break it with section backgrounds**. Sections should be transparent; any card/panel sits as a translucent piece on top of it. See §7 (Backgrounds) for how this is wired.

---

## 3. Typography

Font family: **Inter** (400–900). Variable weights used. Fallback stack system-ui.

All text scales are fluid via `clamp()` except the fixed small sizes (micro/label/body/lead).

| Token | Size | Role |
|---|---|---|
| `--fs-micro` | `12px` | Eyebrows, meta, dates, legal. |
| `--fs-label` | `15px` | Form labels, small buttons, CTA text. |
| `--fs-body` | `17px` | Paragraphs, body copy. |
| `--fs-lead` | `20px` | Lead sentences, subheadings. |
| `--fs-h3` | `clamp(24px, 2.8vw, 32px)` | Section sub-titles, card titles. |
| `--fs-h2` | `clamp(36px, 4.5vw, 60px)` | Section titles. |
| `--fs-hero` | `clamp(52px, 7.5vw, 88px)` | Hero / page-opening titles. |

### Hierarchy pattern (use this for every section opener)

Every major section of the site opens with this 3-part pattern:

1. **Eyebrow** — `var(--fs-micro)` or `13px`, gold, `font-weight: 700`, `letter-spacing: 0.22em`, uppercase. Short (2–4 words).
2. **Title** — `var(--fs-h2)` (section) or `var(--fs-hero)` (page), uppercase, `font-weight: 900`, `letter-spacing: -0.02em`, `line-height: 1.05`. Often one line with a gold accent on a second line (wrap the accent in `<span class="accent">`).
3. **Lead** — `var(--fs-lead)`, `color: var(--color-text-muted)`, `line-height: 1.5`, `max-width: ~620px`.

See [src/components/FinalCTA.astro](../src/components/FinalCTA.astro) `.final__intro` for a canonical example.

---

## 4. Spacing, radii, shadows

### Spacing

| Token | Value | Use |
|---|---|---|
| `--pad-x` | `clamp(16px, 2.5vw, 40px)` | Horizontal container padding. |
| `--pad-section` | `clamp(64px, 10vh, 100px)` | Top/bottom padding of a section (via `.section` class). |
| `--max-w` | `1400px` | Max content width (via `.container` class). |

Inter-component gap guidance:
- Between sections: handled by `.section` padding — don't add extra margin.
- Between title → lead → CTA: `16px`, `20px`, `28px` (tight but breathing).
- Between form fields: `14–16px`.
- Between grid items: `18–24px` desktop, `14px` laptop, `20–24px` mobile.

### Radii

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `8px` | Small chips, dropdown items. |
| `--radius` | `16px` | Default card/panel radius. |
| `--radius-lg` | `20px` | Large cards (form-card, feature-card). |
| `--radius-pill` | `999px` | Inputs, pills, CTAs, navigation chips. |

### Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-card` | `0 8px 32px rgba(0,0,0,0.5)` | Default card lift. |
| `--shadow-card-lg` | `0 20px 60px rgba(0,0,0,0.6)` | Prominent cards (form-card, hero images). |

Layered shadow recipe (translucent glass cards — see form-card):

```css
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.18),   /* top highlight */
  inset 0 -1px 0 rgba(0,0,0,0.2),         /* bottom shade */
  0 30px 80px rgba(0,0,0,0.4),            /* far drop */
  0 8px 24px rgba(0,0,0,0.25);            /* near drop */
```

---

## 5. Breakpoints & responsive strategy

Three tiers. Reference tokens: `--bp-laptop: 1440px`, `--bp-tablet: 1024px`, `--bp-mobile: 768px`.

| Range | Tier | What happens |
|---|---|---|
| `≥ 1441px` | Desktop (large) | Roomy paddings, multi-col grids, full typography caps. |
| `1025–1440px` | **Laptop** | Same layout as desktop but with **compacted paddings, gaps, nav, card padding**. Never reshuffles grids. |
| `769–1024px` | Tablet | Grids collapse to 1–2 cols, nav becomes hamburger, feature images restack. |
| `481–768px` | Mobile | Single column, tightened typography, hidden marquee items. |
| `≤ 480px` | Mobile (small) | Edge-cases: form rows to 1 col, full-width buttons, reduced padding. |

### Media query convention

Always write mobile-last (max-width) queries. Stack them bottom to top:

```css
@media (max-width: 1440px) { /* laptop tier ajustments */ }
@media (max-width: 1024px) { /* tablet — allow layout reshuffle here */ }
@media (max-width: 768px) { /* mobile */ }
@media (max-width: 480px) { /* mobile small */ }
```

### Fluid-first where possible

Typography and container paddings use `clamp()` and adjust continuously. Reserve breakpoint media queries for **structural** decisions (grid cols, stacking order, show/hide).

---

## 6. Global layout utilities

Defined in [src/styles/global.css](../src/styles/global.css).

```css
.container { max-width: var(--max-w); margin-inline: auto; padding-inline: var(--pad-x); }
.section   { padding-block: var(--pad-section); }
.accent    { color: var(--color-accent); }
.muted     { color: var(--color-text-muted); }
.uppercase { text-transform: uppercase; }
```

**Every page section starts like this:**

```astro
<section class="my-section section" id="anchor" aria-labelledby="my-title">
  <div class="container">
    <div class="my-section__intro reveal">
      <p class="eyebrow">Eyebrow</p>
      <h2 id="my-title">Title</h2>
      <p class="lead">Lead.</p>
    </div>
    <!-- content -->
  </div>
</section>
```

Sections are `position: relative; z-index: 2; background: transparent` by default (set in global.css). **Do not give sections solid backgrounds** — the page gradient shows through them.

### Breaking out of the container (full-width pieces)

When something must go edge-to-edge (marquee, full-bleed images):

```css
.full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}
```

Used in [src/components/FinalCTA.astro](../src/components/FinalCTA.astro) `.marquee`.

---

## 7. Background system

Three layers, in render order from back to front:

1. **Body gradient** (`body { background: var(--bg-gradient) }`) — continuous top→bottom wash.
2. **Blobs** (`.bg-blobs` + `.blob`) — three large blurred radial-gradient circles anchored to scroll positions (`--blob-1-y`, `--blob-2-y`, `--blob-3-y`). They scroll with the page and provide soft color lifts at key vertical points. Wrapped in `overflow: hidden`.
3. **Noise** (`.bg-noise`) — fixed position, SVG `feTurbulence` grain, `opacity: 0.6`.

Content sits on `z-index: 2`. **Do not touch this system per-page.** If a section needs "more contrast", use a translucent card on top, not a section background.

---

## 8. Content patterns (copy repertoire)

These are the recurring layout/copy patterns. Reuse them.

### 8.1 Section opener (eyebrow + hook + lead + CTA)

Canonical example: [FinalCTA.astro](../src/components/FinalCTA.astro) `.final__intro`.

```html
<div class="intro">
  <p class="eyebrow">Short gold label</p>
  <h2>Your hook in two lines, <span class="accent">accent on the second.</span></h2>
  <p class="lead">Max ~2 sentences of explanatory copy.</p>
  <GlassButton href="#anchor">
    <span class="dot"></span>
    Action
  </GlassButton>
</div>
```

Typical uses: hero of a page, opener of any major section.

### 8.2 Feature card (image + title + metadata + arrow)

Canonical example: [ServiceCards.astro](../src/components/ServiceCards.astro) `.card`.

- Aspect ratio `2/3` on desktop, `3/4` on tablet, `16/10` on mobile small.
- Background image with overlay gradient for legibility.
- Explore pill at the top (gold on dark via `GlassPill`).
- Title bottom-left, 18px max, 2 lines max, bold.
- Gold-hover arrow bottom-right (36×36 circle).

### 8.3 Stat block (big number + label)

Canonical example: [MapSection.astro](../src/components/MapSection.astro) `.map__stat`.

- Number: `clamp(48px, 6vw, 76px)`, gold, `font-weight: 900`, `letter-spacing: -0.03em`.
- Label: uppercase `--fs-micro`, spaced `0.14em`, `--color-text-dim`.

### 8.4 Category filter row (pills)

Canonical example: [MapSection.astro](../src/components/MapSection.astro) `.map__pills`.

- Horizontal list of `GlassPill` components.
- Active state: gold background, black text.
- Mobile: collapses to a `<select>` (see that file for the interaction).

### 8.5 Marquee (infinite horizontal scroll)

Canonical example: [FinalCTA.astro](../src/components/FinalCTA.astro) `.marquee`.

- Full-bleed (`width: 100vw; margin-left: calc(50% - 50vw)`).
- Items duplicated so the loop never shows a gap.
- `animation: marquee 40s linear infinite` + `transform: translateX(-50%)` at 100%.
- `mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)` fades both edges.
- Respects `prefers-reduced-motion`.

### 8.6 Translucent panel (form-card, feature-card)

Canonical example: [FinalCTA.astro](../src/components/FinalCTA.astro) `.form-card`.

```css
.panel {
  position: relative;
  background: linear-gradient(
    150deg,
    rgba(110,110,118,0.42) 0%,
    rgba(60,60,68,0.48) 55%,
    rgba(38,38,44,0.55) 100%
  );
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: var(--radius-lg);
  padding: clamp(28px, 4vw, 48px);
  backdrop-filter: blur(14px) saturate(1.25);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.18),
    0 30px 80px rgba(0,0,0,0.4),
    0 8px 24px rgba(0,0,0,0.25);
  overflow: hidden;
}
.panel::before {
  /* Top-left radial sheen */
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(circle at 15% 0%, rgba(255,255,255,0.1) 0%, transparent 55%);
  border-radius: inherit;
}
.panel > * { position: relative; z-index: 1; }
```

This is the "continuous with the page" look — the panel reads as a piece of the same gradient material, not a box pasted on top.

### 8.7 Accordion (native `<details>`)

Canonical example: [FinalCTA.astro](../src/components/FinalCTA.astro) `.flight`.

- Use native `<details>` + `<summary>`. Strip the default marker with `::-webkit-details-marker { display: none }` and `list-style: none` on the summary.
- Chevron rotates via `.item[open] .chevron { transform: rotate(180deg) }`.
- Hide the details marker, add a custom icon on the right.
- Keep the header clickable as a whole; action buttons inside must `e.stopPropagation()` on click.

---

## 9. Shared UI components

Location: `src/components/ui/`.

### 9.1 `GlassButton` — [src/components/ui/GlassButton.astro](../src/components/ui/GlassButton.astro)

Props: `href?` (renders as `<a>` if present, else `<button>`), `type?`, `variant?: "glass" | "outline" | "solid"`, `class?`.

- **glass** (default) — frosted white surface, blurred backdrop, the standard primary CTA style. Use for hero CTAs, form headers.
- **outline** — transparent with a visible border. Use for secondary actions.
- **solid** — gold filled. Use sparingly, only for the absolute hero action if needed.

**Pulsing gold dot convention.** For CTAs that imply urgency/availability ("24/7", "Get a quote"), put a `<span>` with `width/height: 8px; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 0 3px rgba(255,185,0,0.25); animation: pulse 2s ease-in-out infinite;` before the text.

### 9.2 `GlassPill` — [src/components/ui/GlassPill.astro](../src/components/ui/GlassPill.astro)

Props: `href?`, `active?: boolean`, `class?`.

Use for filter pills, category tags, "explore more" labels inside cards. Active state is gold-filled.

### 9.3 Forms

See [FinalCTA.astro](../src/components/FinalCTA.astro) for the canonical form implementation (`.form`, `.field`, `.form__submit`, `.form__status`). Key rules:

- **Inputs are off-white** (`#f5f5f7`) with dark text (`#1a1a1f`), not pure white, not dark.
- **Pill-shaped** inputs (`border-radius: var(--radius-pill)`). Textareas use `--radius` (softer).
- **Focus ring** is gold with a soft 3px halo: `box-shadow: 0 0 0 3px rgba(255,185,0,0.25)`.
- **Labels** are uppercase 11px, `letter-spacing: 0.14em`, `color: rgba(255,255,255,0.75)`, above the input.
- **Submit** is a gold pill button with an arrow SVG.

---

## 10. Animations

| Token / name | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default for hovers, transforms, most UI motion. |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Pulses, continuous loops. |

Standard durations: `0.22s` (hover color), `0.3s` (hover transform), `0.5–0.8s` (reveal), `30–40s` (marquee).

### Reveal on scroll

Add class `reveal` to any element. It starts at `opacity: 0; translate-y(20px)` and transitions in when 4% is visible (IntersectionObserver wired globally in [BaseLayout.astro](../src/layouts/BaseLayout.astro)). Respects `prefers-reduced-motion`.

### Pulsing gold dot

See `heroPulse` / `finalCtaPulse` keyframes. The ring expands from 3px to 8px and fades out over 2s, in an infinite `ease-in-out` loop.

### Marquee loop

`animation: marquee 40s linear infinite` with `transform: translateX(-50%)` at 100%. Items duplicated in JS/Astro so the seam is never visible.

---

## 11. Accessibility rules

- **Focus states visible.** Global rule in global.css: `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }`. Don't remove it.
- **Reduced motion.** All animations have a `@media (prefers-reduced-motion: reduce)` escape hatch. New animations must honor it.
- **Landmarks.** Every section has `aria-labelledby` pointing to its title's `id`. Icons used as decoration get `aria-hidden="true"`. Interactive icons get an `aria-label`.
- **Semantic HTML.** Native `<details>` for accordions. Native `<select>` for dropdowns. Real `<button>` / `<a>` (not `<div>` with onClick).
- **Contrast.** Body copy on dark gradient passes AA. Gold on dark surfaces passes AA for body text. Never put gold on white — use black on white.

---

## 12. Background noise & blobs, gotchas

- The noise SVG in BaseLayout uses `width="0" height="0"` and `filter: url(#grain)`. Do not wrap it in any container that could push `scrollHeight`.
- Leaflet map containers must have `overflow: hidden` or their internal 4000×6000px SVG will push the body height. See MapSection.astro fix for precedent.

---

## 13. File structure

```
src/
├── layouts/
│   └── BaseLayout.astro          # <html>, <head>, Navbar, Footer, scroll observer
├── pages/
│   └── index.astro               # Current home. Add new pages as sibling .astro files.
├── components/
│   ├── Hero.astro                # Pattern: hero section opener
│   ├── SubHero.astro             # Pattern: feature + photo stack
│   ├── ServiceCards.astro        # Pattern: feature card grid
│   ├── MapSection.astro          # Pattern: stats + filter pills + interactive content
│   ├── FinalCTA.astro            # Pattern: intro → marquee → form panel
│   ├── Navbar.astro              # Nav pill (desktop) / hamburger flyout (tablet+)
│   ├── Footer.astro              # Thin dark bar
│   └── ui/
│       ├── GlassButton.astro
│       └── GlassPill.astro
├── data/
│   ├── airports.ts               # Map + form airport options (73 entries, typed)
│   ├── events.ts                 # Marquee logos
│   └── services.ts               # Service card list
└── styles/
    ├── tokens.css                # Design tokens — edit here, not in components
    └── global.css                # Resets, utilities, reveal, app loader, bg system
```

### When building a new page

1. Create `src/pages/<name>.astro`.
2. Import `BaseLayout` and pass `title`, `description`, `activeLink`.
3. Compose sections out of the patterns in §8. New custom components go under `src/components/<Name>.astro` with scoped `<style>`.
4. Data lives in `src/data/<topic>.ts` as a typed export. No inline arrays of 50+ items in components.
5. Do NOT import design tokens into component style blocks — they're already global via `tokens.css`.

---

## 14. Reference components — what each one teaches

| Component | Look at this for |
|---|---|
| [Hero.astro](../src/components/Hero.astro) | Page opener with huge title + glass CTA + pulsing dot. |
| [SubHero.astro](../src/components/SubHero.astro) | Two-column feature (big visual + accompanying copy) with a photo stack. |
| [ServiceCards.astro](../src/components/ServiceCards.astro) | 4-column feature card grid with hover lifts and photo overlays. |
| [MapSection.astro](../src/components/MapSection.astro) | Interactive content + filter pills + stats block + mobile fallback to `<select>`. |
| [FinalCTA.astro](../src/components/FinalCTA.astro) | Cascade section opener → full-bleed marquee → translucent form panel with accordion repeater. The most pattern-dense file in the repo. |
| [Navbar.astro](../src/components/Navbar.astro) | Glass pill nav, responsive hamburger flyout, scroll-state. |
| [Footer.astro](../src/components/Footer.astro) | Solid dark footer (the only solid-bg element). |

---

## 15. Locked decisions vs open

### Locked (do not change without discussing)

- Dark palette + gold-only accent.
- English copy.
- Astro + vanilla CSS + tokens. No Tailwind, no component library.
- Breakpoints: 1440 / 1024 / 768 / 480.
- `Inter` font family.
- Section transparency (no per-section backgrounds).
- `<details>` for accordions, `<select>` for dropdowns, native controls where possible.
- Gold focus ring with halo.
- Form card "continuous with background" look (translucent + blur, not opaque).

### Open (per-page creative freedom)

- Section-specific layouts (2-col, 3-col, asymmetric, stacked).
- Which photography to use, cropping, filter intensity.
- Whether a page needs a hero, subhero, or jumps into content.
- Micro-interactions on cards and controls.
- Animation timings above/below the standards, within reason.
- Number of sections on a page (2–6 is typical).

---

## 16. For Claude Design — how to work with this repo

1. **Read this doc first, then code.** The code is the source of truth; this doc summarizes it.
2. **Match the patterns in §8 before inventing new ones.** If you find yourself creating a new "card shape" or "input style", ask why — there's probably a pattern here already.
3. **Use tokens. Never hardcode hex.** If you need a color that's not in `tokens.css`, propose it as a new token.
4. **Write scoped CSS inside each `.astro` file.** Don't create a global stylesheet per page.
5. **Respect the responsive tiers (§5).** New components must look right at 1920, 1440, 1280, 1024, 768, 480.
6. **Ship with accessibility.** Every `<img>` has alt, every icon-only button has `aria-label`, every animation respects `prefers-reduced-motion`.
7. **Per-page briefs live in `docs/briefs/<page>.md`.** See `docs/page-brief-template.md` for the format.

When the brief is unclear, ask. Do not invent scope.
