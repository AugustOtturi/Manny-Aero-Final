import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import { config as loadEnv } from "dotenv";

// Astro/Vite only expose .env files via import.meta.env; our server-side
// code (db client, mail, auth) reads process.env directly, so load the
// local dev file into the process ourselves. In production, Hostinger
// injects real env vars into process.env directly — no .env file needed,
// so these calls are silent no-ops there.
loadEnv({ path: ".env.local" });
loadEnv();

export default defineConfig({
  output: "server",
  site: "https://manny.aero",
  adapter: node({
    mode: "middleware",
  }),
  // Astro's built-in checkOrigin compares the browser `Origin` header against
  // `url.origin`, which the node adapter reconstructs from the (internal) Host
  // header behind Hostinger's reverse proxy — so it never matches the public
  // domain and every form-like / bodyless POST (image uploads, logout) 403s.
  // We disable it and rely on our own defenses instead: public endpoints
  // (/api/contact, /api/gate) run isAllowedOrigin(), and every admin endpoint
  // requires the JWT session cookie (httpOnly, sameSite: lax) which browsers
  // won't send on cross-site POSTs.
  security: {
    checkOrigin: false,
  },
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  build: {
    inlineStylesheets: "auto",
    assets: "_astro",
    // Prerendered pages emit `about.html` (not `about/index.html`) so the
    // node adapter serves `/about` directly with 200 instead of 301ing to
    // `/about/` — keeps the public URLs exactly as they were under full SSR.
    format: "file",
  },
  compressHTML: true,
  server: {
    port: 4321,
    host: true,
  },
});
