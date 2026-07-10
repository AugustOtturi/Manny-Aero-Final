# Manny Aero — Pendientes

> Actualizado 2026-07-09. Los pendientes viejos (conectar formularios, email gate, archivos de permits, datos del FloatingContact, GSC) ya se completaron con la migración SSR + CMS.

## Seguridad (deuda técnica, ver CLAUDE.md → Estado de seguridad)
1. ~~`innerHTML` sin escapar~~ — **hecho 2026-07-10**: el modal de servicios (`ground-handling.astro`) y `buildPopupHtml` (`MapSection.astro`) ahora construyen el DOM de forma imperativa (`textContent`/`createElement`, sin interpolar strings en HTML); el link de descarga del popup del mapa además valida que `a.pdf` sea una ruta relativa (`startsWith("/")`) antes de crear el `<a>`.
2. **`getClientIp`** (`src/lib/server/rateLimit.ts`) — confirmar qué header de IP real setea el edge de Hostinger (hcdn) para que el rate limit no sea spoofeable.

## Performance
3. ~~Comprimir hero video~~ — **decisión del cliente (2026-07-09): el video se queda como está** (~4 MB). No tocar sin nueva indicación.
4. ~~Optimizar OG images~~ — **hecho 2026-07-09**: todas las `public/og/*.jpg` optimizadas a ≤1200px / <200 KB con sharp.
5. ~~Prerender~~ — **hecho 2026-07-09**: las 7 páginas estáticas (about, catering, isbah, founder, ground-handling, contact, 404) se prerenderizan en el build.

## Contenido / SEO
6. **SEO description de `/about`** — `src/pages/about.astro` aún dice "Meet the team behind every operation" pero la sección team se eliminó.
7. **Redes sociales — verificar URLs** — confirmar que LinkedIn, Instagram, Facebook, YouTube y TikTok sean las cuentas oficiales.
8. **Majola Chauffeur** — confirmar con el cliente si vuelve al dropdown de Services.

## Producción
9. **SMTP de producción** — pendiente confirmar si `no-replay@manny.aero` se queda en Office 365 o migra a Hostinger.
10. **Auto-deploy QA** — confirmar si el auto-deploy por GitHub sigue funcionando para apps Node en la cuenta QA o pasa a ser manual.
