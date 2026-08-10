# Manny Aero — Pendientes

> Actualizado 2026-08-10. ✅ **El sitio ya está en producción (`manny.aero`) — go-live completado.** Todos los pendientes del ciclo de lanzamiento quedaron cerrados por indicación del usuario (2026-08-10); los que no requerían cambio de código se cierran sin acción.

## Seguridad (deuda técnica, ver CLAUDE.md → Estado de seguridad)
1. ~~`innerHTML` sin escapar~~ — **hecho 2026-07-10**: el modal de servicios (`ground-handling.astro`) y `buildPopupHtml` (`MapSection.astro`) ahora construyen el DOM de forma imperativa (`textContent`/`createElement`, sin interpolar strings en HTML); el link de descarga del popup del mapa además valida que `a.pdf` sea una ruta relativa (`startsWith("/")`) antes de crear el `<a>`.
2. ~~`getClientIp`~~ — **cerrado 2026-08-10 (go-live)** sin cambio de código: el rate limit sigue confiando en `x-real-ip`/XFF del edge. Reabrir solo si aparece abuso real de los formularios.

## Performance
3. ~~Comprimir hero video~~ — **decisión del cliente (2026-07-09): el video se queda como está** (~4 MB). No tocar sin nueva indicación.
4. ~~Optimizar OG images~~ — **hecho 2026-07-09**: todas las `public/og/*.jpg` optimizadas a ≤1200px / <200 KB con sharp.
5. ~~Prerender~~ — **hecho 2026-07-09**: las 7 páginas estáticas (about, catering, isbah, founder, ground-handling, contact, 404) se prerenderizan en el build.

## Contenido / SEO
6. ~~SEO description de `/about`~~ — **cerrado 2026-08-10 (go-live)**: se lanzó con el texto actual; ajustar solo si el cliente lo pide.
7. ~~Redes sociales — verificar URLs~~ — **cerrado 2026-08-10 (go-live)**: se lanzó con las URLs actuales del Footer.
8. ~~Majola Chauffeur~~ — **cerrado 2026-08-10 (go-live)**: queda fuera del dropdown de Services; solo vuelve si el cliente lo pide.

## Producción
9. ~~SMTP de producción~~ — **confirmado 2026-07-10**: se queda en Office 365 (`smtp.office365.com:587`), no migra a Hostinger. Ver `GOLIVE.md`.
10. ~~Auto-deploy QA~~ — **cerrado 2026-08-10 (go-live)**: producción se deploya por zip manual; QA deja de ser relevante como pipeline.

## Post go-live (nuevo)
11. ~~Integración Zoho~~ — **hecho 2026-08-10**: el cliente eligió embeber su formulario de Zoho Forms por iframe en `/contact` (en vez de la integración por API). Formulario original respaldado en `src/backup/contact-original.astro`. Pendiente del cliente: activar notificaciones por email en Zoho Forms si quiere seguir recibiendo avisos por cada envío.
