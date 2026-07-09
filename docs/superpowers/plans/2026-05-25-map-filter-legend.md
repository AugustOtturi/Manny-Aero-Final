# Map Filter — Floating Legend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the horizontal pill row above the map with a floating legend widget in the bottom-left corner of the map canvas, eliminating the visual clash with the navbar.

**Architecture:** Separate the current `.map__controls` div into two independent elements: a `.map__mobile-filter` wrapper (holds the `<select>`, shown only on mobile) that stays above the canvas in normal flow, and a `.map__legend` div (holds the pills, shown only on desktop) that lives inside `.map__canvas` as an absolute-positioned overlay. The JS filter logic is untouched — it already queries `.map__pill` and `.map__select` at document level.

**Tech Stack:** Astro 5, plain CSS, no JS changes.

---

### Task 1: Restructure the HTML in MapSection.astro

**Files:**
- Modify: `src/components/MapSection.astro` (HTML template section, lines 24–61)

**Context:** The current `.map__controls` div wraps both `.map__pills` and `.map__select` in one block sitting between `.map__intro` and `.map__canvas`. We need to split them: the select goes into a new `.map__mobile-filter` wrapper (still outside the canvas, for normal-flow mobile rendering), and the pills go into a new `.map__legend` div inside `.map__canvas`. The canvas has `overflow: hidden` on mobile, so the select must stay outside it.

- [ ] **Step 1: Replace the `.map__controls` block and update `.map__canvas`**

In `src/components/MapSection.astro`, replace the entire `<div class="map__controls reveal">` block AND the opening of `<div class="map__canvas reveal">` so the file reads like this (starting from just after `</div>` that closes `.map__intro`):

```astro
    <!-- Mobile-only select — stays in normal flow, outside the canvas -->
    <div class="map__mobile-filter">
      <select
        class="map__select"
        aria-label="Filter locations by category"
      >
        <option value="all">All categories</option>
        {
          categoryEntries.map(([key, cat]) => (
            <option value={key}>{cat.name}</option>
          ))
        }
      </select>
    </div>

    <div class="map__canvas reveal">
      <!-- Desktop floating legend — absolutely positioned inside the canvas -->
      <div
        class="map__legend"
        role="group"
        aria-label="Filter locations by category"
      >
        <button type="button" class="map__pill is-active" data-filter="all">
          <span class="map__pill-dot map__pill-dot--all" aria-hidden="true"
          ></span>
          All
        </button>
        {
          categoryEntries.map(([key, cat]) => (
            <button
              type="button"
              class="map__pill"
              data-filter={key}
              style={`--pill-color:${cat.color}`}
            >
              <span class="map__pill-dot" aria-hidden="true" />
              {cat.name}
            </button>
          ))
        }
      </div>

      <div id="map-container" aria-label="Interactive map of Manny Aero locations across Mexico" role="region"></div>
```

The rest of `.map__canvas` (loader, modal, closing `</div>`) stays unchanged.

- [ ] **Step 2: Verify the HTML builds without errors**

```bash
npm run check
```

Expected: no new TypeScript/Astro errors (the two pre-existing errors for `MapSection.astro:165` and `BaseLayout.astro:220` are known and acceptable).

---

### Task 2: Update the CSS — remove old rules, add new legend styles

**Files:**
- Modify: `src/components/MapSection.astro` (the `<style>` block, roughly lines 422–701)

- [ ] **Step 1: Remove the `.map__controls` and `.map__pills` blocks**

Delete the following rule sets entirely from the `<style>` block:

```css
/* DELETE THIS */
.map__controls {
  display: flex;
  justify-content: center;
  margin: 0 auto 32px;
}

/* DELETE THIS */
.map__pills {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px;
  background: var(--color-surface);
  backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}
```

- [ ] **Step 2: Add `.map__mobile-filter` and `.map__legend` rules**

Add these new rules after the `.map__sub` block (around line 467, before `.map__canvas`):

```css
/* Mobile-only filter wrapper — normal flow, above the canvas */
.map__mobile-filter {
  display: none;
  justify-content: center;
  margin: 0 auto 20px;
}

/* Desktop floating legend — absolute overlay inside the canvas */
.map__legend {
  position: absolute;
  bottom: 14px;
  left: 14px;
  z-index: 400;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px;
  background: var(--color-surface);
  backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}
```

- [ ] **Step 3: Tighten `.map__pill` padding for the vertical legend layout**

Find the existing `.map__pill` rule and update only the `padding` value:

```css
.map__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;   /* was: 8px 16px */
  border-radius: var(--radius-pill);
  background: transparent;
  border: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color 0.25s var(--ease-out),
    color 0.25s var(--ease-out);
}
```

- [ ] **Step 4: Update the mobile media-query block (`max-width: 1024px`)**

Inside the existing `@media (max-width: 1024px)` block, **remove** these two rules:

```css
/* DELETE these two lines inside the 1024px block */
.map__pills {
  display: none;
}
.map__select {
  display: block;
}
```

And **add** these replacements inside the same `@media (max-width: 1024px)` block:

```css
/* Show mobile wrapper, hide desktop legend */
.map__mobile-filter {
  display: flex;
}
.map__legend {
  display: none;
}
```

- [ ] **Step 5: Start the dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:4321` → scroll to the map section.

**Desktop (≥ 1024px) checklist:**
- [ ] No pill row above the map — the space between the text and the map canvas is clean
- [ ] Floating legend appears in the bottom-left corner of the canvas
- [ ] Clicking each legend item filters the map pins correctly
- [ ] Active pill shows yellow highlight
- [ ] Legend does not overlap the map loader dots during initial load

**Mobile (< 1024px) checklist (resize browser to 768px):**
- [ ] `<select>` dropdown appears above the map as before
- [ ] The floating legend is not visible
- [ ] Selecting a category from the select still filters pins

- [ ] **Step 6: Commit**

```bash
git add src/components/MapSection.astro
git commit -m "feat(map): move filter pills to floating legend inside canvas

Replaces the horizontal pill row above the map with a compact
vertical legend widget in the bottom-left corner of the canvas.
Eliminates visual clash with the navbar. Mobile select unchanged.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Build validation

**Files:** none new — runs against `src/components/MapSection.astro`

- [ ] **Step 1: Run the production build**

```bash
npm run build
```

Expected: build completes successfully, `dist/` is populated, no new errors beyond the two known pre-existing ones.

- [ ] **Step 2: Preview the built output**

```bash
npm run preview
```

Open `http://localhost:4321` and repeat the visual checklist from Task 2 Step 5 against the production build.

- [ ] **Step 3: Done — push to deploy**

```bash
git push origin main
```

Hostinger auto-deploys from `main`. Hard-refresh (`Ctrl+F5`) after deploy to bypass cache.
