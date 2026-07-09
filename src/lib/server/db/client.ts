import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { getEnv } from "../env";
import * as schema from "./schema";

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (pool) return pool;
  const env = getEnv();
  pool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: false,
  });
  return pool;
}

let dbInstance: MySql2Database<typeof schema> | undefined;

export function getDb(): MySql2Database<typeof schema> {
  if (!dbInstance) {
    dbInstance = drizzle(getPool(), { schema, mode: "default" });
  }
  return dbInstance;
}
