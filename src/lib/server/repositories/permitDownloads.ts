import { eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { permitDownloads, type NewPermitDownloadRow } from "../db/schema";

export async function listPermitDownloads() {
  const db = getDb();
  return db.select().from(permitDownloads).orderBy(permitDownloads.id);
}

export async function getPermitDownloadById(id: number) {
  const db = getDb();
  const rows = await db.select().from(permitDownloads).where(eq(permitDownloads.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createPermitDownload(data: NewPermitDownloadRow) {
  const db = getDb();
  const result = await db.insert(permitDownloads).values(data);
  return getPermitDownloadById(Number(result[0].insertId));
}

export async function updatePermitDownload(id: number, data: Partial<NewPermitDownloadRow>) {
  const db = getDb();
  await db.update(permitDownloads).set(data).where(eq(permitDownloads.id, id));
  return getPermitDownloadById(id);
}

export async function deletePermitDownload(id: number) {
  const db = getDb();
  await db.delete(permitDownloads).where(eq(permitDownloads.id, id));
}
