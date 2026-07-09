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
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  build: {
    inlineStylesheets: "auto",
    assets: "_astro",
  },
  compressHTML: true,
  server: {
    port: 4321,
    host: true,
  },
});
