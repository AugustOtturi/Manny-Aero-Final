// Content Security Policy delivered via a <meta http-equiv> tag in the page
// <head> rather than an HTTP header.
//
// Why meta and not a header: under Hostinger Business the app runs behind the
// CDN edge (hcdn), which overrides the response Content-Security-Policy header
// with its own `upgrade-insecure-requests` — so a header set in server.mjs
// never reaches the browser. A <meta> tag lives in the HTML body, which the
// edge proxies untouched, so it survives.
//
// `frame-ancestors` is intentionally omitted: it is ignored in a <meta> CSP,
// and clickjacking is already covered by the `X-Frame-Options: SAMEORIGIN`
// header (that header is not stripped by the edge).
//
// The allowances mirror the old public/.htaccess policy, widened only so GA4
// (gtag) keeps working:
//   - script/style 'unsafe-inline' for JSON-LD, the inline loader, define:vars,
//     Astro scoped styles, and the gtag config snippet
//   - img https: for Leaflet/OpenStreetMap tiles and CMS uploads
//   - connect for GA4 endpoints, GTM and OSM tiles
//   - media 'self' for the hero video
export const CSP_META = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.tile.openstreetmap.org https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com",
  "media-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");
