// One-off migration: copies the hardcoded articles from src/data/news.ts
// into the `news` table. Safe to re-run — upserts by slug.
//
// Usage: npm run db:seed-news
import { config } from "dotenv";

config({ path: ".env.local" });
config();
import { getDb } from "../client";
import { news } from "../schema";
import { NEWS } from "../../../../data/news";

function monthYearToDate(label: string): Date {
  // "Jun 2026" -> first day of that month, UTC
  const parsed = new Date(`1 ${label} UTC`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Could not parse date label "${label}"`);
  }
  return parsed;
}

async function main() {
  const db = getDb();

  for (const article of NEWS) {
    const row = {
      slug: article.slug,
      title: article.title,
      category: article.category,
      date: monthYearToDate(article.date),
      excerpt: article.excerpt,
      body: article.body.join("\n\n"),
      imageKey: article.imageKey,
    };

    await db
      .insert(news)
      .values(row)
      .onDuplicateKeyUpdate({ set: row });

    console.log(`Seeded: ${article.slug}`);
  }

  console.log(`Done — ${NEWS.length} article(s) migrated.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
