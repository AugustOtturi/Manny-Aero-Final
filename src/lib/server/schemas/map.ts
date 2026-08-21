import { z } from "zod";

export const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export const mapCategoryInputSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100, "Nombre demasiado largo"),
  short: z.string().trim().min(1, "El nombre corto es obligatorio").max(50, "Nombre corto demasiado largo"),
  color: z
    .string()
    .trim()
    .regex(HEX_COLOR, "Color inválido (usar formato #rrggbb)")
    .transform((c) => c.toLowerCase()),
  sortOrder: z.coerce.number().int("El orden debe ser entero").min(0, "El orden no puede ser negativo").default(0),
});

export const mapCategoryUpdateSchema = z.object({
  name: mapCategoryInputSchema.shape.name.optional(),
  short: mapCategoryInputSchema.shape.short.optional(),
  color: mapCategoryInputSchema.shape.color.optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export const airportInputSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(255, "Nombre demasiado largo"),
  lat: z.coerce.number().min(-90, "Latitud fuera de rango").max(90, "Latitud fuera de rango"),
  lng: z.coerce.number().min(-180, "Longitud fuera de rango").max(180, "Longitud fuera de rango"),
  categoryId: z.coerce.number().int().positive("Categoría inválida"),
  info: z.string().trim().max(2000, "La descripción es demasiado larga").optional().default(""),
});

export const airportUpdateSchema = z.object({
  name: airportInputSchema.shape.name.optional(),
  lat: airportInputSchema.shape.lat.optional(),
  lng: airportInputSchema.shape.lng.optional(),
  categoryId: airportInputSchema.shape.categoryId.optional(),
  info: z.string().trim().max(2000).optional(),
});

export type MapCategoryInput = z.infer<typeof mapCategoryInputSchema>;
export type MapCategoryUpdate = z.infer<typeof mapCategoryUpdateSchema>;
export type AirportInput = z.infer<typeof airportInputSchema>;
export type AirportUpdate = z.infer<typeof airportUpdateSchema>;

export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Datos inválidos";
}

export function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}
