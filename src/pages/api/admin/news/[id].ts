import type { APIRoute } from "astro";
import { newsInputSchema } from "../../../../lib/server/schemas/news";
import { deleteNews, getNewsById, slugExists, updateNews } from "../../../../lib/server/repositories/news";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "Invalid id" }, 400);

  const article = await getNewsById(id);
  if (!article) return json({ ok: false, error: "Not found" }, 404);

  return json({ ok: true, article });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "Invalid id" }, 400);

  const existing = await getNewsById(id);
  if (!existing) return json({ ok: false, error: "Not found" }, 404);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid payload" }, 400);
  }

  const parsed = newsInputSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid payload" }, 400);
  }

  if (await slugExists(parsed.data.slug, id)) {
    return json({ ok: false, error: `Slug "${parsed.data.slug}" is already in use` }, 409);
  }

  const updated = await updateNews(id, parsed.data);
  return json({ ok: true, article: updated });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "Invalid id" }, 400);

  const existing = await getNewsById(id);
  if (!existing) return json({ ok: false, error: "Not found" }, 404);

  await deleteNews(id);
  return json({ ok: true });
};
