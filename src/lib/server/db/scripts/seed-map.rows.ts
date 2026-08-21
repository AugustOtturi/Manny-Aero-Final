// Pure mapping from the legacy hardcoded data (src/data/airports.ts) to
// DB rows. Kept separate from seed-map.ts so it can be unit-tested without
// touching the database.
import type { NewAirportRow, NewMapCategoryRow } from "../schema";
import { AIRPORTS, CATEGORIES } from "../../../../data/airports";

export function categoryRows(): NewMapCategoryRow[] {
  return (Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((key) => {
    const c = CATEGORIES[key];
    return {
      id: Number(key),
      name: c.name,
      short: c.short,
      color: c.color.toLowerCase(),
      sortOrder: c.priority,
    };
  });
}

export function airportRows(): NewAirportRow[] {
  return AIRPORTS.map((a) => ({
    name: a.nombre.trim(),
    lat: a.lat,
    lng: a.lng,
    categoryId: a.categoria,
    info: a.info.trim() || null,
    pdfUrl: a.pdf.trim() || null,
  }));
}
