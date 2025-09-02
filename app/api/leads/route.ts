import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

// In-memory fallback storage when no database connection string is configured.
// This prevents 500 errors during local development or preview deploys without env vars.
// NOTE: Data stored here is ephemeral and WILL NOT persist across server restarts or cold starts.
const memoryLeads: {
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}[] = [];
let warnedNoDb = false;

// POST /api/leads  { firstName, lastName, email }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email } = body || {};

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Try to obtain SQL client; if unavailable due to missing env vars, fall back to memory.
    let sql: ReturnType<typeof getSql> | null = null;
    try {
      sql = getSql();
    } catch (e: any) {
      if (!warnedNoDb && /No database connection string/i.test(String(e?.message))) {
        console.warn('[leads][POST] No DB connection string found. Falling back to in-memory storage only. Set DATABASE_URL (or POSTGRES_URL / NEON_DATABASE_URL) to enable persistence.');
        warnedNoDb = true;
      } else {
        console.error('[leads][POST] getSql error', e);
      }
    }

    if (sql) {
      await sql`CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_term TEXT,
        utm_content TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );`;
    }

    // Extract any UTM params provided by the client (urlParams object)
    const urlParams = (body && body.urlParams) || {};
    const utm_source = urlParams.utm_source ?? null;
    const utm_medium = urlParams.utm_medium ?? null;
    const utm_campaign = urlParams.utm_campaign ?? null;
    const utm_term = urlParams.utm_term ?? null;
    const utm_content = urlParams.utm_content ?? null;

    // Attempt insert and capture if a row was inserted
    let inserted = false;
    if (sql) {
      try {
        const result: any = await sql`INSERT INTO leads (first_name, last_name, email, utm_source, utm_medium, utm_campaign, utm_term, utm_content)
                                VALUES (${firstName}, ${lastName}, ${email}, ${utm_source}, ${utm_medium}, ${utm_campaign}, ${utm_term}, ${utm_content})
                                ON CONFLICT (email) DO NOTHING
                                RETURNING id;`;
        if (Array.isArray(result)) {
          inserted = result.length > 0;
        } else if (result && Array.isArray(result[0])) {
          inserted = result[0].length > 0;
        } else if (result && typeof result.rowCount === 'number') {
          inserted = result.rowCount > 0;
        }
      } catch (e) {
        console.error('Insert error', e);
        return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
      }
    } else {
      // Memory fallback logic: de-dupe on email
      const exists = memoryLeads.some(l => l.email.toLowerCase() === email.toLowerCase());
      if (!exists) {
        memoryLeads.push({
          first_name: firstName,
          last_name: lastName,
          email,
          created_at: new Date().toISOString(),
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
        });
        inserted = true;
      }
    }

    return NextResponse.json({ success: true, inserted, persistence: sql ? 'database' : 'memory' });
  } catch (err: any) {
    console.error('[leads][POST] error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/leads?token=DEBUG_TOKEN  (debug only, remove later)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const expected = process.env.LEADS_DEBUG_TOKEN;
    if (!expected || token !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let sql: ReturnType<typeof getSql> | null = null;
    try {
      sql = getSql();
    } catch (e: any) {
      if (!warnedNoDb && /No database connection string/i.test(String(e?.message))) {
        console.warn('[leads][GET] No DB connection string found. Using in-memory data.');
        warnedNoDb = true;
      }
    }
    if (sql) {
      const rows = await sql`SELECT id, first_name, last_name, email, created_at FROM leads ORDER BY created_at DESC LIMIT 25;`;
      return NextResponse.json({ rows, persistence: 'database' });
    }
    // Memory fallback shape normalization to mimic DB rows
    const rows = memoryLeads.map((l, idx) => ({ id: idx + 1, ...l }));
    return NextResponse.json({ rows, persistence: 'memory' });
  } catch (err: any) {
    console.error('[leads][GET] error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
