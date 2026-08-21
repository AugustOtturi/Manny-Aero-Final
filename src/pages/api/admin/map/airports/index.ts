import type { APIRoute } from "astro";
import { createAirport, listAirports } from "../../../../../lib/server/repositories/airports";
import { getMapCategoryById } from "../../../../../lib/server/repositories/mapCategories";
import { airportInputSchema, firstIssue } from "../../../../../lib/server/schemas/map";
import { readPdfUpload, storeAirportPdf } from "../../../../../lib/server/airportFiles";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async () => {
  const airports = await listAirports();
  return json({ ok: true, airports });
};

export const POST: APIRoute = async ({ request }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "Formulario inválido" }, 400);
  }

  const parsed = airportInputSchema.safeParse({
    name: formData.get("name"),
    lat: formData.get("lat"),
    lng: formData.get("lng"),
    categoryId: formData.get("categoryId"),
    info: formData.get("info") ?? "",
  });
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 400);

  const category = await getMapCategoryById(parsed.data.categoryId);
  if (!category) return json({ ok: false, error: "La categoría no existe" }, 400);

  let pdfUrl: string | null = null;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const pdf = await readPdfUpload(file);
    if (!pdf.ok) return json({ ok: false, error: pdf.error }, 400);
    pdfUrl = await storeAirportPdf(pdf.buffer, file.name);
  }

  try {
    const airport = await createAirport({
      name: parsed.data.name,
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      categoryId: parsed.data.categoryId,
      info: parsed.data.info || null,
      pdfUrl,
    });
    return json({ ok: true, airport }, 201);
  } catch (err) {
    console.error("[map/airports] create failed", err);
    return json({ ok: false, error: "No se pudo crear el aeropuerto" }, 500);
  }
};
