import type { APIRoute } from "astro";
import { listLeads } from "../../../../lib/server/repositories/leads";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get("type");
  const search = url.searchParams.get("search") ?? undefined;
  const limit = Number(url.searchParams.get("limit") ?? 50);
  const offset = Number(url.searchParams.get("offset") ?? 0);

  const { rows, total } = await listLeads({
    type: type === "contact" || type === "gate" ? type : undefined,
    search,
    limit: Math.min(limit, 200),
    offset,
  });

  return new Response(JSON.stringify({ ok: true, leads: rows, total }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
