import type { APIRoute } from "astro";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { deleteImage, getImage } from "../../../../../lib/server/repositories/images";

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
  const { category, slug } = params;
  if (!category || !slug) {
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
  const filePath = path.join(process.cwd(), "public", "uploads", category, existing.fileName);
  await unlink(filePath).catch(() => {});

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
