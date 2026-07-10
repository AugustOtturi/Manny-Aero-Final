// Production entry point for Hostinger Business (Node.js app).
// Wraps the Astro SSR handler (built by `astro build`) in a thin Express
// shell so we can serve CMS-uploaded images with our own cache headers
// and get `req.ip` resolved correctly behind Hostinger's reverse proxy.
// Local development still runs through `astro dev` — this file is never
// used there.
import express from "express";
import compression from "compression";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The Astro build can land in two layouts: ./dist/* when we run
// `npm run build` ourselves (local prod test, plain servers), or
// flattened to ./server + ./client when Hostinger copies the contents
// of the configured output directory into the runtime dir.
const LAYOUTS = [
  { entry: "dist/server/entry.mjs", client: "dist/client" },
  { entry: "server/entry.mjs", client: "client" },
];
const layout = LAYOUTS.find((l) => existsSync(path.join(__dirname, l.entry)));
if (!layout) {
  throw new Error(
    "Astro build output not found (looked for ./dist/server/entry.mjs and ./server/entry.mjs). Did `npm run build` run?"
  );
}
console.log(`[server] using Astro build at ./${layout.entry}`);
const { handler: astroHandler } = await import(
  new URL(layout.entry, import.meta.url).href
);

const app = express();

app.set("trust proxy", true);
app.disable("x-powered-by");

// Under Hostinger Business the app runs as a Node process behind the CDN edge
// (hcdn) — Apache/LiteSpeed never runs, so the legacy `public/.htaccess` was
// inert (and has since been removed from the repo). The security headers and
// HSTS it used to provide are re-issued here on every response instead.
//
// NOTE on CSP: the edge OVERRIDES the response Content-Security-Policy header
// with its own `upgrade-insecure-requests`, so this header value never reaches
// the browser. The enforced policy is therefore delivered as a <meta> tag from
// the layouts (see src/lib/csp.ts). This header is kept as defense-in-depth for
// any path that bypasses the edge; it is a faithful port of the old .htaccess
// policy, widened only so GA4 (gtag) keeps working.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.tile.openstreetmap.org https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com",
  "media-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  // The client always reaches us over HTTPS (TLS terminates at the edge), so
  // HSTS is safe to send unconditionally — browsers only honor it over HTTPS.
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", CSP);
  next();
});

app.use(compression());

// URL migrations that used to live in public/.htaccess (301 permanent). They
// run at the Express layer — not Astro middleware — because the node adapter
// serves the prerendered 404 for unmatched routes without invoking SSR
// middleware, so these legacy paths (none of which are real routes) would
// never reach it.
const REDIRECTS = {
  "/services": "/ground-handling",
  "/isbha": "/isbah",
  "/permits_and_authorizations": "/permits-and-authorizations",
  "/our_founder": "/founder",
};
app.use((req, res, next) => {
  const target = REDIRECTS[req.path] ?? REDIRECTS[req.path.replace(/\/$/, "")];
  if (target) return res.redirect(301, target);
  next();
});

// CMS uploads live in an absolute directory OUTSIDE the deploy checkout in
// production (UPLOADS_DIR) so they survive redeploys; falls back to
// public/uploads locally. Must match src/lib/server/uploads.ts.
const UPLOADS_DIR =
  process.env.UPLOADS_DIR && process.env.UPLOADS_DIR.trim()
    ? path.resolve(process.env.UPLOADS_DIR.trim())
    : path.join(__dirname, "public/uploads");

app.use(
  "/uploads",
  express.static(UPLOADS_DIR, {
    maxAge: "30d",
  })
);

app.use(
  express.static(path.join(__dirname, layout.client), {
    maxAge: "1y",
    index: false,
  })
);

app.use(astroHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Manny Aero server listening on port ${port}`);
});
