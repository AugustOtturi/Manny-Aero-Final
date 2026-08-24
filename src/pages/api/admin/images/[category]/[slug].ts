import type { APIRoute } from "astro";
import { unlink } from "node:fs/promises";
import { deleteImage, getImage } from "../../../../../lib/server/repositories/images";
import { uploadsPath } from "../../../../../lib/server/uploads";

export const prerender = false;

// Same allowlist/pattern the upload endpoint enforces — the delete path builds
// a filesystem path from these, so validate them here too (defense in depth).
const ALLOWED_CATEGORIES = new Set(["subhero", "service", "logo", "news", "team", "catering", "og", "hero"]);
const SAFE_SLUG = /^[a-z0-9-]+$/;

export const DELETE: APIRoute = async ({ params }) => {
  const { category, slug } = params;
  if (!category || !slug || !ALLOWED_CATEGORIES.has(category) || !SAFE_SLUG.test(slug)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid category/slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const existing = await getImage(category, slug);
  if (!existing) {
    return new Response(JSON.stringify({ ok: false, error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  await deleteImage(category, slug);
  const filePath = uploadsPath(category, existing.fileName);
  await unlink(filePath).catch(() => {});

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
