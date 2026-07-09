// One-off migration: registers the 10 hardcoded permit downloads
// (src/data/permits.ts DOWNLOADS) in the `permit_downloads` table.
// Files stay in place under public/files/ — only the DB row is created,
// pointing at their existing URL. Safe to re-run — skips names that
// already exist.
//
// Usage: npm run db:seed-permit-downloads
import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { stat } from "node:fs/promises";
import path from "node:path";
import { getDb } from "../client";
import { permitDownloads } from "../schema";
import { DOWNLOADS } from "../../../../data/permits";

async function main() {
  const db = getDb();
  const existing = await db.select().from(permitDownloads);
  const existingNames = new Set(existing.map((r) => r.name));

  let created = 0;
  for (const d of DOWNLOADS) {
    if (existingNames.has(d.name)) {
      console.log(`Skipped (already exists): ${d.name}`);
      continue;
    }

    let size: number | null = null;
    try {
      const filePath = path.join(process.cwd(), "public", d.url);
      size = (await stat(filePath)).size;
    } catch {
      console.warn(`Could not stat file for "${d.name}" (${d.url})`);
    }

    await db.insert(permitDownloads).values({
      name: d.name,
      fileUrl: d.url,
      fileType: d.type,
      icon: d.icon,
      size,
    });
    created++;
    console.log(`Seeded: ${d.name}`);
  }

  console.log(`Done — ${created} download(s) created, ${DOWNLOADS.length - created} already existed.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
