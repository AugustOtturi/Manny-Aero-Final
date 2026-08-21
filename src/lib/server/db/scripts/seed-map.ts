// One-off migration: copies the hardcoded map data (src/data/airports.ts)
// into `map_categories` and `airports`. PDFs stay where they are under
// public/files/airports/ — only the DB rows are created, pointing at the
// existing URLs. Safe to re-run: categories are only seeded when the table
// is empty; airports are skipped by name.
//
// Usage: npm run db:seed-map   (run npm run db:create-map-tables first)
import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { stat } from "node:fs/promises";
import path from "node:path";
import { getDb } from "../client";
import { airports, mapCategories } from "../schema";
import { airportRows, categoryRows } from "./seed-map.rows";

async function main() {
  const db = getDb();

  const existingCategories = await db.select().from(mapCategories);
  if (existingCategories.length === 0) {
    const categories = categoryRows();
    await db.insert(mapCategories).values(categories);
    console.log(`Seeded ${categories.length} categories`);
  } else {
    console.log(`Skipped categories (table already has ${existingCategories.length})`);
  }

  const existingAirports = await db.select({ name: airports.name }).from(airports);
  const existingNames = new Set(existingAirports.map((r) => r.name));

  let created = 0;
  let skipped = 0;
  let missingPdfs = 0;
  for (const row of airportRows()) {
    if (existingNames.has(row.name)) {
      skipped++;
      continue;
    }
    if (row.pdfUrl) {
      try {
        await stat(path.join(process.cwd(), "public", row.pdfUrl));
      } catch {
        missingPdfs++;
        console.warn(`PDF not found for "${row.name}": ${row.pdfUrl}`);
      }
    }
    await db.insert(airports).values(row);
    existingNames.add(row.name);
    created++;
  }

  console.log(`Done — ${created} airport(s) created, ${skipped} already existed, ${missingPdfs} PDF(s) missing on disk.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("seed-map failed:", err);
  process.exit(1);
});
