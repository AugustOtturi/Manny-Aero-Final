// Creates the map tables (map_categories, airports) if they don't exist.
// Used instead of `drizzle-kit push`, which hangs against the QA DB (see
// CLAUDE.md "Things to avoid"). Safe to re-run. Keep in sync with schema.ts.
//
// Usage: npm run db:create-map-tables
import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { sql } from "drizzle-orm";
import { getDb } from "../client";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS \`map_categories\` (
    \`id\` int NOT NULL AUTO_INCREMENT,
    \`name\` varchar(100) NOT NULL,
    \`short\` varchar(50) NOT NULL,
    \`color\` varchar(7) NOT NULL,
    \`sort_order\` int NOT NULL DEFAULT 0,
    \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`airports\` (
    \`id\` int NOT NULL AUTO_INCREMENT,
    \`name\` varchar(255) NOT NULL,
    \`lat\` double NOT NULL,
    \`lng\` double NOT NULL,
    \`category_id\` int NOT NULL,
    \`info\` text NULL,
    \`pdf_url\` varchar(500) NULL,
    \`pdf_name\` varchar(255) NULL,
    \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`),
    KEY \`airports_category_idx\` (\`category_id\`),
    CONSTRAINT \`airports_category_id_fk\` FOREIGN KEY (\`category_id\`)
      REFERENCES \`map_categories\` (\`id\`) ON DELETE RESTRICT
  )`,
];

async function main() {
  const db = getDb();
  for (const stmt of STATEMENTS) {
    await db.execute(sql.raw(stmt));
    const table = stmt.match(/EXISTS `(\w+)`/)?.[1];
    console.log(`OK: ${table}`);
  }
  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("create-map-tables failed:", err);
  process.exit(1);
});
