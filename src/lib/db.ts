import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

const pool: Pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    options: "-c search_path=db_my_sweet_craving",
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export default pool;
