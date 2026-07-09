import { eq, desc } from "drizzle-orm";
import { getDb } from "../db/client";
import { news, type NewNewsRow } from "../db/schema";

export async function listNews() {
  const db = getDb();
  return db.select().from(news).orderBy(desc(news.date));
}

export async function getNewsBySlug(slug: string) {
  const db = getDb();
  const rows = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getNewsById(id: number) {
  const db = getDb();
  const rows = await db.select().from(news).where(eq(news.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createNews(data: NewNewsRow) {
  const db = getDb();
  const result = await db.insert(news).values(data);
  return getNewsById(Number(result[0].insertId));
}

export async function updateNews(id: number, data: Partial<NewNewsRow>) {
  const db = getDb();
  await db.update(news).set(data).where(eq(news.id, id));
  return getNewsById(id);
}

export async function deleteNews(id: number) {
  const db = getDb();
  await db.delete(news).where(eq(news.id, id));
}

export async function slugExists(slug: string, excludeId?: number) {
  const existing = await getNewsBySlug(slug);
  if (!existing) return false;
  if (excludeId && existing.id === excludeId) return false;
  return true;
}
