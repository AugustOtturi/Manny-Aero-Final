import type { APIRoute } from "astro";
import { getAirportById, updateAirport } from "../../../../../../lib/server/repositories/airports";
import {
  readPdfUpload,
  removeAirportPdf,
  storeAirportPdf,
} from "../../../../../../lib/server/airportFiles";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ ok: false, error: "Id inválido" }, 400);

  const existing = await getAirportById(id);
  if (!existing) return json({ ok: false, error: "Aeropuerto no encontrado" }, 404);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "Formulario inválido" }, 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return json({ ok: false, error: "Selecciona un archivo PDF" }, 400);
  }

  const pdf = await readPdfUpload(file);
  if (!pdf.ok) return json({ ok: false, error: pdf.error }, 400);

  const pdfUrl = await storeAirportPdf(pdf.buffer, file.name);

  try {
    const airport = await updateAirport(id, { pdfUrl, pdfName: file.name.slice(0, 255) });
    await removeAirportPdf(existing.pdfUrl);
    return json({ ok: true, airport });
  } catch (err) {
    console.error("[map/airports] replace file failed", err);
    await removeAirportPdf(pdfUrl);
    return json({ ok: false, error: "No se pudo reemplazar el PDF" }, 500);
  }
};
