import { asc, count, eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { airports, mapCategories, type NewMapCategoryRow } from "../db/schema";

export async function listMapCategories() {
  const db = getDb();
  return db
    .select()
    .from(mapCategories)
    .orderBy(asc(mapCategories.sortOrder), asc(mapCategories.id));
}

export async function getMapCategoryById(id: number) {
  const db = getDb();
  const rows = await db.select().from(mapCategories).where(eq(mapCategories.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createMapCategory(data: NewMapCategoryRow) {
  const db = getDb();
  const result = await db.insert(mapCategories).values(data);
  return getMapCategoryById(Number(result[0].insertId));
}

export async function updateMapCategory(id: number, data: Partial<NewMapCategoryRow>) {
  const db = getDb();
  await db.update(mapCategories).set(data).where(eq(mapCategories.id, id));
  return getMapCategoryById(id);
}

export async function deleteMapCategory(id: number) {
  const db = getDb();
  await db.delete(mapCategories).where(eq(mapCategories.id, id));
}

export async function countAirportsInCategory(categoryId: number): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ n: count() })
    .from(airports)
    .where(eq(airports.categoryId, categoryId));
  return Number(rows[0]?.n ?? 0);
}

export async function countAirportsByCategory(): Promise<Map<number, number>> {
  const db = getDb();
  const rows = await db
    .select({ categoryId: airports.categoryId, n: count() })
    .from(airports)
    .groupBy(airports.categoryId);
  return new Map(rows.map((r) => [r.categoryId, Number(r.n)]));
}
