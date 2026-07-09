import type { APIRoute } from "astro";
import { listAllLeadsForExport } from "../../../../lib/server/repositories/leads";

export const prerender = false;

const COLUMNS = [
  "id",
  "type",
  "createdAt",
  "email",
  "firstName",
  "lastName",
  "phone",
  "company",
  "service",
  "aircraft",
  "fileName",
  "notes",
  "flights",
] as const;

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str =
    value instanceof Date
      ? value.toISOString()
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get("type");
  const rows = await listAllLeadsForExport(type === "contact" || type === "gate" ? type : undefined);

  const lines = [COLUMNS.join(",")];
  for (const row of rows) {
    lines.push(COLUMNS.map((col) => csvEscape((row as Record<string, unknown>)[col])).join(","));
  }

  const csv = lines.join("\n");
  const filename = `manny-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
};
