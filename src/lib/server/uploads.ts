import path from "node:path";

// Absolute directory where CMS uploads (images, logos, permit files) are stored
// and served from.
//
// In production this MUST point OUTSIDE the git-checkout / deploy directory,
// set via the UPLOADS_DIR env var — otherwise every redeploy wipes the files
// (Hostinger re-checks-out the repo fresh and public/uploads is gitignored, so
// runtime uploads there don't survive). Locally, with UPLOADS_DIR unset, it
// falls back to public/uploads so dev works unchanged.
//
// server.mjs inlines this same resolution to serve /uploads from the same path.
export const UPLOADS_ROOT =
  process.env.UPLOADS_DIR && process.env.UPLOADS_DIR.trim()
    ? path.resolve(process.env.UPLOADS_DIR.trim())
    : path.join(process.cwd(), "public", "uploads");

export function uploadsPath(...segments: string[]): string {
  return path.join(UPLOADS_ROOT, ...segments);
}
