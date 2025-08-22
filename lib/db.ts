import { neon } from '@neondatabase/serverless';

let sql: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (!sql) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL env var is missing');
    }
    sql = neon(connectionString);
  }
  return sql;
}

export { sql }; // legacy export if already imported elsewhere (will be undefined until getSql called)
