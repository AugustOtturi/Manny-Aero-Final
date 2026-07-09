// Production entry point for Hostinger Business (Node.js app).
// Wraps the Astro SSR handler (built by `astro build`) in a thin Express
// shell so we can serve CMS-uploaded images with our own cache headers
// and get `req.ip` resolved correctly behind Hostinger's reverse proxy.
// Local development still runs through `astro dev` — this file is never
// used there.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handler as astroHandler } from "./dist/server/entry.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set("trust proxy", true);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"), {
    maxAge: "30d",
  })
);

app.use(
  express.static(path.join(__dirname, "dist/client"), {
    maxAge: "1y",
    index: false,
  })
);

app.use(astroHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Manny Aero server listening on port ${port}`);
});
