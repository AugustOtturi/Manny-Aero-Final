import { asc, eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { airports, type NewAirportRow } from "../db/schema";

export async function listAirports() {
  const db = getDb();
  return db.select().from(airports).orderBy(asc(airports.name));
}

export async function getAirportById(id: number) {
  const db = getDb();
  const rows = await db.select().from(airports).where(eq(airports.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createAirport(data: NewAirportRow) {
  const db = getDb();
  const result = await db.insert(airports).values(data);
  return getAirportById(Number(result[0].insertId));
}

export async function updateAirport(id: number, data: Partial<NewAirportRow>) {
  const db = getDb();
  await db.update(airports).set(data).where(eq(airports.id, id));
  return getAirportById(id);
}

export async function deleteAirport(id: number) {
  const db = getDb();
  await db.delete(airports).where(eq(airports.id, id));
}
