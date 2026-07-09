// One-off migration: copies the 8 hardcoded partner/event logos into
// public/uploads/logo/ and registers them in the `images` table so the
// logos CRUD in /admin/images/logos has real starting data.
// Safe to re-run — upserts by slug.
//
// Usage: npm run db:seed-logos
import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getDb } from "../client";
import { images } from "../schema";

const LOGO_MAX_WIDTH = 400;

const LOGOS = [
  { file: "Logo1.webp", title: "FIA World Rally Championship" },
  { file: "Logo2.png", title: "World Wide Technology Championship" },
  { file: "Logo3.png", title: "Event partner" },
  { file: "Logo4.png", title: "Event partner" },
  { file: "Logo5.png", title: "Event partner" },
  { file: "Logo6.png", title: "Mexico Open at Vidanta" },
  { file: "Logo7.png", title: "Event partner" },
  { file: "Logo8.png", title: "FIFA World Cup" },
];

async function main() {
  const db = getDb();
  const assetsDir = path.join(process.cwd(), "src", "assets");
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "logo");
  await mkdir(uploadsDir, { recursive: true });

  let n = 0;
  for (const logo of LOGOS) {
    n++;
    const slug = `logo-seed-${n}`;
    const srcPath = path.join(assetsDir, logo.file);
    const buffer = await readFile(srcPath);

    const optimized = await sharp(buffer)
      .resize({ width: LOGO_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer();
    const meta = await sharp(optimized).metadata();

    const fileName = `${slug}-${Date.now()}-${n}.webp`;
    await writeFile(path.join(uploadsDir, fileName), optimized);

    const row = {
      category: "logo",
      slug,
      fileName,
      title: logo.title,
      alt: logo.title,
      width: meta.width,
      height: meta.height,
      size: optimized.byteLength,
    };

    await db.insert(images).values(row).onDuplicateKeyUpdate({ set: row });
    console.log(`Seeded logo: ${logo.title} (${slug})`);
  }

  console.log(`Done — ${LOGOS.length} logo(s) migrated.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
