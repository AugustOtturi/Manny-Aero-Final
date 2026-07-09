import type { APIRoute } from "astro";
import { newsInputSchema } from "../../../../lib/server/schemas/news";
import { createNews, listNews, slugExists } from "../../../../lib/server/repositories/news";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async () => {
  const rows = await listNews();
  return json({ ok: true, news: rows });
};

export const POST: APIRoute = async ({ request }) => {
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

  if (await slugExists(parsed.data.slug)) {
    return json({ ok: false, error: `Slug "${parsed.data.slug}" is already in use` }, 409);
  }

  const created = await createNews(parsed.data);
  return json({ ok: true, article: created }, 201);
};
