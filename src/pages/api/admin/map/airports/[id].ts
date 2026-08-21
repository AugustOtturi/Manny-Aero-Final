import type { APIRoute } from "astro";
import {
  deleteAirport,
  getAirportById,
  updateAirport,
} from "../../../../../lib/server/repositories/airports";
import { getMapCategoryById } from "../../../../../lib/server/repositories/mapCategories";
import { airportUpdateSchema, firstIssue, stripUndefined } from "../../../../../lib/server/schemas/map";
import { removeAirportPdf } from "../../../../../lib/server/airportFiles";

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

  const existing = await getAirportById(id);
  if (!existing) return json({ ok: false, error: "Aeropuerto no encontrado" }, 404);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "Payload inválido" }, 400);
  }

  const parsed = airportUpdateSchema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 400);

  if (parsed.data.categoryId !== undefined) {
    const category = await getMapCategoryById(parsed.data.categoryId);
    if (!category) return json({ ok: false, error: "La categoría no existe" }, 400);
  }

  const { info, ...rest } = stripUndefined(parsed.data);
  const update = { ...rest, ...(info !== undefined ? { info: info || null } : {}) };
  if (Object.keys(update).length === 0) return json({ ok: true, airport: existing });

  try {
    const airport = await updateAirport(id, update);
    return json({ ok: true, airport });
  } catch (err) {
    console.error("[map/airports] update failed", err);
    return json({ ok: false, error: "No se pudo guardar el aeropuerto" }, 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "Id inválido" }, 400);

  const existing = await getAirportById(id);
  if (!existing) return json({ ok: false, error: "Aeropuerto no encontrado" }, 404);

  try {
    await deleteAirport(id);
  } catch (err) {
    console.error("[map/airports] delete failed", err);
    return json({ ok: false, error: "No se pudo eliminar el aeropuerto" }, 500);
  }

  await removeAirportPdf(existing.pdfUrl);
  return json({ ok: true });
};
