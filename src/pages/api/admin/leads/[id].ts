import type { APIRoute } from "astro";
import { deleteLead, getLeadById } from "../../../../lib/server/repositories/leads";

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const existing = await getLeadById(id);
  if (!existing) {
    return new Response(JSON.stringify({ ok: false, error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  await deleteLead(id);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
