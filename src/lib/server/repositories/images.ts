import { and, eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { images, type NewImageRow } from "../db/schema";

export async function listImages(category?: string) {
  const db = getDb();
  if (category) {
    return db.select().from(images).where(eq(images.category, category)).orderBy(images.id);
  }
  return db.select().from(images).orderBy(images.id);
}

export async function getImage(category: string, slug: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(images)
    .where(and(eq(images.category, category), eq(images.slug, slug)))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertImage(data: NewImageRow) {
  const db = getDb();
  const existing = await getImage(data.category, data.slug);
  if (existing) {
    await db.update(images).set(data).where(eq(images.id, existing.id));
    return getImage(data.category, data.slug);
  }
  await db.insert(images).values(data);
  return getImage(data.category, data.slug);
}

export async function deleteImage(category: string, slug: string) {
  const db = getDb();
  await db.delete(images).where(and(eq(images.category, category), eq(images.slug, slug)));
}
