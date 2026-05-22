# Manny Aero — Pendientes

## Funcionalidad
1. **Conectar formularios** — index (FinalCTA), contact y email gate de permits. Opción acordada: Web3Forms (gratuito, 250 submissions/mes).
2. **Email gate permits** — captura de lead antes de revelar link de descarga, conectar al mismo servicio de forms.
3. **Archivos de descarga en Permits** — todos los `url: "#"` en `src/data/permits.ts` apuntan a placeholder. Reemplazar con los PDFs reales del cliente.

## Contenido / Assets
4. **Mapa — pins y archivos reales** — completar `src/data/airports.ts` con coordenadas originales del cliente y PDFs por aeropuerto.
5. **FloatingContact — datos reales** — el módulo OPS 24/7 tiene `href="#"` en email y teléfono. El cliente debe proveer los datos.
6. **Redes sociales — verificar URLs** — confirmar que LinkedIn, Instagram, Facebook, YouTube y TikTok sean las cuentas oficiales antes de lanzar.

## Legal
7. **Privacy Notice y Terms of Service** — las páginas `/privacy` y `/terms` dan 404. Crear o el cliente provee el contenido.

## SEO & Visibilidad
8. **SEO** — revisar meta titles, descriptions, OG tags y structured data en todas las páginas.
9. **Google Search Console (GSC)** — configurar propiedad, verificar dominio y enviar sitemap.

## Performance
10. **Comprimir hero video** — `hero-manny-final.mp4` pesa ~4MB sin optimizar. Comprimir a <1.5MB mejora LCP notablemente.

## Seguridad
11. **Validaciones de seguridad finales** — revisar headers en `.htaccess`, CSP, y cualquier endpoint que se agregue al conectar los forms.
