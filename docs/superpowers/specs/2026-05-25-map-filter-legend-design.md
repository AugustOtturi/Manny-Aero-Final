# Map Filter — Floating Legend Design

**Date:** 2026-05-25
**Status:** Approved

## Problem

The horizontal pill row (`.map__controls`) sits between the section heading and the map canvas on desktop. This creates visual noise where the pills clash with the navbar above when the user scrolls to the map section.

## Solution — Option A: Floating Legend

Move the filter controls **inside** the map canvas as an absolutely-positioned legend widget in the bottom-left corner. The space between the section text and the map canvas becomes clean and empty.

## Scope

- **Affected file:** `src/components/MapSection.astro` only
- **Desktop (≥ 1024px):** Pills become a vertical floating legend inside the canvas
- **Mobile (< 1024px):** No change — the `<select>` dropdown stays as-is
- **JavaScript:** No changes — filter logic already queries `.map__pill` by class

## Changes

### HTML
Move `<div class="map__controls">` from its current position (between `.map__intro` and `.map__canvas`) to inside `.map__canvas`, before the `#map-container` div.

### CSS — `.map__controls`
From:
```css
display: flex;
justify-content: center;
margin: 0 auto 32px;
```
To:
```css
position: absolute;
bottom: 14px;
left: 14px;
z-index: 400;
```

### CSS — `.map__pills`
From: horizontal `inline-flex` row with `flex-wrap`
To: vertical `flex-column` list, narrower, more compact padding

### CSS — `.map__pill`
Slightly smaller padding; text and dot stay the same.

### Mobile override
At `< 1024px`: `.map__controls` gets `position: static` so the `<select>` still renders above the map in normal flow. Pills remain `display: none`.

## Non-Goals

- No changes to popup/modal behavior
- No changes to JavaScript filter logic
- No changes to mobile `<select>` UI
- No changes to any other component or page
