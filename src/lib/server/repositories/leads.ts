import { and, desc, eq, like, count } from "drizzle-orm";
import { getDb } from "../db/client";
import { leads, type LeadRow, type NewLeadRow } from "../db/schema";

export interface LeadFilters {
  type?: "contact" | "gate";
  search?: string;
  limit?: number;
  offset?: number;
}

// The `flights` JSON column comes back from the driver as a raw JSON string
// (not a parsed array), so every consumer (leads table, detail modal, CSV
// export) would see a string and skip it. Normalize it to an array here so it's
// fixed in one place.
function normalizeLead(row: LeadRow): LeadRow {
  if (typeof row.flights === "string") {
    try {
      return { ...row, flights: JSON.parse(row.flights) };
    } catch {
      return { ...row, flights: [] };
    }
  }
  return row;
}

export async function createLead(data: NewLeadRow) {
  const db = getDb();
  const result = await db.insert(leads).values(data);
  return Number(result[0].insertId);
}

export async function listLeads(filters: LeadFilters = {}) {
  const db = getDb();
  const { type, search, limit = 50, offset = 0 } = filters;

  const conditions = [];
  if (type) conditions.push(eq(leads.type, type));
  if (search) conditions.push(like(leads.email, `%${search}%`));
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(leads).where(where),
  ]);

  return { rows: rows.map(normalizeLead), total: totalRows[0]?.value ?? 0 };
}

export async function getLeadById(id: number) {
  const db = getDb();
  const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return rows[0] ? normalizeLead(rows[0]) : null;
}

export async function deleteLead(id: number) {
  const db = getDb();
  await db.delete(leads).where(eq(leads.id, id));
}

export async function listAllLeadsForExport(type?: "contact" | "gate") {
  const db = getDb();
  const where = type ? eq(leads.type, type) : undefined;
  const rows = await db.select().from(leads).where(where).orderBy(desc(leads.createdAt));
  return rows.map(normalizeLead);
}
