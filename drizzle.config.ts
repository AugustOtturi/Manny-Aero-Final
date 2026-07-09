import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

export default defineConfig({
  dialect: "mysql",
  schema: "./src/lib/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASS ?? "",
    database: process.env.DB_NAME ?? "manny_dev",
  },
});
