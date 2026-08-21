import type { APIRoute } from "astro";
import {
  createMapCategory,
  listMapCategories,
} from "../../../../../lib/server/repositories/mapCategories";
import { firstIssue, mapCategoryInputSchema } from "../../../../../lib/server/schemas/map";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async () => {
  const categories = await listMapCategories();
  return json({ ok: true, categories });
};

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "Payload inválido" }, 400);
  }

  const parsed = mapCategoryInputSchema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 400);

  try {
    const category = await createMapCategory(parsed.data);
    return json({ ok: true, category }, 201);
  } catch (err) {
    console.error("[map/categories] create failed", err);
    return json({ ok: false, error: "No se pudo crear la categoría" }, 500);
  }
};
