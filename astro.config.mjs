import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: "https://manny.aero",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "auto",
    assets: "_astro",
  },
  compressHTML: true,
  server: {
    port: 4321,
    host: true,
  },
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});
