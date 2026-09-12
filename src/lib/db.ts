import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

const schema = process.env.DB_SCHEMA ?? "public";

const pool: Pool =
  global._pgPool ??
  new Pool({
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "5432"),
    database: process.env.DB_NAME ?? "el_dulce_antojo",
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_HOST?.includes("supabase.co")
      ? { rejectUnauthorized: false }
      : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
    options: `-c search_path=${schema}`,
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export default pool;
