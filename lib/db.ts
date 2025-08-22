import { neon } from '@neondatabase/serverless';

let _sql: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (!_sql) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
    if (!connectionString) {
      throw new Error('No database connection string found. Expected one of: DATABASE_URL, POSTGRES_URL, NEON_DATABASE_URL');
    }
    _sql = neon(connectionString);
  }
  return _sql;
}
