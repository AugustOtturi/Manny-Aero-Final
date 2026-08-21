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

// Idempotency key for a seed row / existing DB row. `name` alone is not
// unique — src/data/airports.ts has 24 airports that repeat the same name
// across categories (e.g. an Agent location that is also an FBO Partnership
// pin). `(name, categoryId)` is verified unique across all 99 rows.
export function airportKey(row: { name: string; categoryId: number }): string {
  return `${row.categoryId}::${row.name}`;
}

/**
 * Returns the rows that must be inserted given the keys already in the DB;
 * also dedupes within the batch itself so a caller can pass the raw seed
 * rows without worrying about repeats.
 */
export function planAirportInserts(
  rows: NewAirportRow[],
  existingKeys: Iterable<string>
): NewAirportRow[] {
  const seen = new Set(existingKeys);
  const out: NewAirportRow[] = [];
  for (const row of rows) {
    const key = airportKey(row);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}
