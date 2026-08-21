import type { APIRoute } from "astro";
import {
  countAirportsInCategory,
  deleteMapCategory,
  getMapCategoryById,
  updateMapCategory,
} from "../../../../../lib/server/repositories/mapCategories";
import {
  firstIssue,
  mapCategoryUpdateSchema,
  stripUndefined,
} from "../../../../../lib/server/schemas/map";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "Id inválido" }, 400);

  const existing = await getMapCategoryById(id);
  if (!existing) return json({ ok: false, error: "Categoría no encontrada" }, 404);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "Payload inválido" }, 400);
  }

  const parsed = mapCategoryUpdateSchema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 400);

  const update = stripUndefined(parsed.data);
  if (Object.keys(update).length === 0) return json({ ok: true, category: existing });

  try {
    const category = await updateMapCategory(id, update);
    return json({ ok: true, category });
  } catch (err) {
    console.error("[map/categories] update failed", err);
    return json({ ok: false, error: "No se pudo guardar la categoría" }, 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "Id inválido" }, 400);

  const existing = await getMapCategoryById(id);
  if (!existing) return json({ ok: false, error: "Categoría no encontrada" }, 404);

  const inUse = await countAirportsInCategory(id);
  if (inUse > 0) {
    return json(
      { ok: false, error: `La categoría tiene ${inUse} aeropuerto(s) asignado(s). Reasignalos antes de eliminarla.` },
      409
    );
  }

  try {
    await deleteMapCategory(id);
    return json({ ok: true });
  } catch (err) {
    console.error("[map/categories] delete failed", err);
    return json({ ok: false, error: "No se pudo eliminar la categoría" }, 500);
  }
};
