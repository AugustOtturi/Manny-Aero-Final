import type { APIRoute } from "astro";
import { listPermitDownloads } from "../../../../lib/server/repositories/permitDownloads";

export const prerender = false;

export const GET: APIRoute = async () => {
  const rows = await listPermitDownloads();
  return new Response(JSON.stringify({ ok: true, downloads: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
