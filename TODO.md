# Manny Aero — Pendientes

> Actualizado 2026-07-09. Los pendientes viejos (conectar formularios, email gate, archivos de permits, datos del FloatingContact, GSC) ya se completaron con la migración SSR + CMS.

## Seguridad (deuda técnica, ver CLAUDE.md → Estado de seguridad)
1. **`innerHTML` sin escapar** en el modal de servicios (`src/pages/ground-handling.astro`) y en `buildPopupHtml` (`src/components/MapSection.astro`). Reemplazar por construcción DOM imperativa; validar scheme de `a.pdf` en los popups del mapa.
2. **`getClientIp`** (`src/lib/server/rateLimit.ts`) — confirmar qué header de IP real setea el edge de Hostinger (hcdn) para que el rate limit no sea spoofeable.

## Performance
3. **Comprimir hero video** — `src/assets/hero-manny-final.mp4` pesa ~4 MB. Comprimir a <1.5 MB mejora LCP notablemente.
4. **Optimizar OG images** — `public/og/founder.jpg` (9.6 MB), `public/og/catering.jpg` (6.9 MB), `public/og/isbah.jpg` (5.2 MB). Bajarlas a <300 KB c/u (1200×630).
5. **`export const prerender = true`** en las páginas 100% estáticas que no leen de la DB (about, catering, isbah, founder, ground-handling, contact, 404).

## Contenido / SEO
6. **SEO description de `/about`** — `src/pages/about.astro` aún dice "Meet the team behind every operation" pero la sección team se eliminó.
7. **Redes sociales — verificar URLs** — confirmar que LinkedIn, Instagram, Facebook, YouTube y TikTok sean las cuentas oficiales.
8. **Majola Chauffeur** — confirmar con el cliente si vuelve al dropdown de Services.

## Producción
9. **SMTP de producción** — pendiente confirmar si `no-replay@manny.aero` se queda en Office 365 o migra a Hostinger.
10. **Auto-deploy QA** — confirmar si el auto-deploy por GitHub sigue funcionando para apps Node en la cuenta QA o pasa a ser manual.
