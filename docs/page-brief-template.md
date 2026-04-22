# Page brief — `<page name>`

> Copy this file to `docs/briefs/<page>.md` and fill it in before sending a page to design/build.
> A good brief answers: what this page is, what a visitor should do on it, what content drives it, and which patterns from the design system it reuses.

---

## 1. One-line purpose

What is this page and who is it for? One sentence.

_Example: "About us — narrative page for operators evaluating Manny Aero, focused on trust (history, team, certifications)."_

## 2. Primary action

What do we want the visitor to do by the end of this page? One thing.

_Example: "Go to Contact and submit the form." / "Click into a service detail page." / "Read an article."_

## 3. Route and entry points

- **URL:** `/about` (example)
- **Linked from:** Navbar · Footer · Home hero CTA · …
- **activeLink prop:** `"about"` (must match one of the nav keys: `home | about | services | map | news | contact`)

## 4. Sections (top to bottom)

List each section with its pattern reference from `docs/design-system.md` §8.

| # | Section | Pattern (§8 ref) | Notes |
|---|---|---|---|
| 1 | Page hero | 8.1 — Eyebrow + hook + lead + CTA | Eyebrow: "ABOUT US" · Hook: "…" |
| 2 | … | 8.6 — Translucent panel | Contains founder photo + 3-paragraph bio |
| 3 | … | 8.3 — Stat block | 4 stats: years, ops, agents, airports |
| 4 | Final CTA | reuse `<FinalCTA />` | Unchanged — already built |

## 5. Copy

Drop all the final copy here. Plain text is fine. Mark any gold-accent fragments with `**bold**` and the designer will wrap them in `<span class="accent">`.

**Eyebrow:** _…_
**Hook:** _…_
**Lead:** _…_

Body copy paragraph 1: _…_

Bullets (if any):
- …
- …
- …

## 6. Content source

Where does the content come from?

- [ ] Inline in the `.astro` file (short, static pages like About).
- [ ] Typed data file in `src/data/<topic>.ts` (repeatable cards, lists).
- [ ] MDX files under `src/content/<collection>/` (News articles, service detail pages).
- [ ] External API / CMS. (Specify which.)

## 7. Assets needed

- Images: list each with aspect ratio, approximate size, source (Unsplash, client, etc.).
- Icons: note any beyond the existing SVGs used in the codebase.
- PDFs / attachments: paths under `/public/`.

## 8. Interactions

What's interactive on this page beyond standard hovers?

- Filters / tabs?
- Accordions (use pattern §8.7)?
- Forms (reuse the FinalCTA form, or new)?
- Modals, drawers? _(Avoid unless really necessary — site has no modals today.)_
- Map (reuse `<MapSection />` wholesale, or a stripped-down variant?)

## 9. Responsive notes

Anything that needs special behavior across the 3 tiers (desktop / laptop / tablet / mobile) beyond what the design-system already prescribes?

_Example: "The 4-step timeline collapses to a vertical stack below tablet."_

## 10. References

- Link or screenshot from the previous project (if the functionality/layout is borrowed).
- Any competitor or inspiration references.

## 11. Out of scope for this iteration

Be explicit about what's deferred. Prevents over-building.

_Example: "News detail page is out of scope — only the list page in this iteration."_

## 12. Acceptance checklist

- [ ] All sections from §4 render.
- [ ] Copy from §5 is in place (no lorem ipsum).
- [ ] Pattern references from §8 of the design system are respected.
- [ ] Works at 1920 · 1440 · 1280 · 1024 · 768 · 480.
- [ ] `activeLink` is correct, nav highlights this page.
- [ ] Every interactive element has focus-visible state.
- [ ] Every image has `alt`; every icon-only button has `aria-label`.
- [ ] `prefers-reduced-motion` respected on any new animation.
- [ ] No hardcoded hex/size — tokens only.

---

## Quick reference — pages to brief

These are the pages pending. Duplicate this template for each and fill it in.

- [ ] `docs/briefs/services.md` — Services parent (list of 4 cards, mostly reuse from Home).
- [ ] `docs/briefs/permits-authorizations.md` — Service detail template. **Build this first** — the other three services follow its pattern.
- [ ] `docs/briefs/ground-handling.md`
- [ ] `docs/briefs/catering.md`
- [ ] `docs/briefs/isbah-isbao.md`
- [ ] `docs/briefs/about.md`
- [ ] `docs/briefs/news.md` — list + article detail (decide if MDX or CMS before starting).
- [ ] `docs/briefs/contact.md` — mostly reuses `<FinalCTA />`; may add a map or office hours panel.
- [ ] `docs/briefs/map.md` — standalone page version of the home's map section.
