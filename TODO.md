# Manny Aero — Pendientes

> Actualizado 2026-07-09. Los pendientes viejos (conectar formularios, email gate, archivos de permits, datos del FloatingContact, GSC) ya se completaron con la migración SSR + CMS.

## Seguridad (deuda técnica, ver CLAUDE.md → Estado de seguridad)
1. **`innerHTML` sin escapar** en el modal de servicios (`src/pages/ground-handling.astro`) y en `buildPopupHtml` (`src/components/MapSection.astro`). Reemplazar por construcción DOM imperativa; validar scheme de `a.pdf` en los popups del mapa.
2. **`getClientIp`** (`src/lib/server/rateLimit.ts`) — confirmar qué header de IP real setea el edge de Hostinger (hcdn) para que el rate limit no sea spoofeable.

## Performance
3. ~~Comprimir hero video~~ — **decisión del cliente (2026-07-09): el video se queda como está** (~4 MB). No tocar sin nueva indicación.
4. ~~Optimizar OG images~~ — **hecho 2026-07-09**: todas las `public/og/*.jpg` optimizadas a ≤1200px / <200 KB con sharp.
5. **`export const prerender = true`** en las páginas 100% estáticas que no leen de la DB (about, catering, isbah, founder, ground-handling, contact, 404).

## Contenido / SEO
6. **SEO description de `/about`** — `src/pages/about.astro` aún dice "Meet the team behind every operation" pero la sección team se eliminó.
7. **Redes sociales — verificar URLs** — confirmar que LinkedIn, Instagram, Facebook, YouTube y TikTok sean las cuentas oficiales.
8. **Majola Chauffeur** — confirmar con el cliente si vuelve al dropdown de Services.

## Producción
9. **SMTP de producción** — pendiente confirmar si `no-replay@manny.aero` se queda en Office 365 o migra a Hostinger.
10. **Auto-deploy QA** — confirmar si el auto-deploy por GitHub sigue funcionando para apps Node en la cuenta QA o pasa a ser manual.
