import type { APIRoute } from "astro";
import { listImages } from "../../../../lib/server/repositories/images";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const category = url.searchParams.get("category") ?? undefined;
  const rows = await listImages(category);
  return new Response(JSON.stringify({ ok: true, images: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
