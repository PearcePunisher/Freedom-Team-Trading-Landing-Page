import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

// POST /api/leads  { firstName, lastName, email }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email } = body || {};

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sql = getSql();

    await sql`CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );`;

    await sql`INSERT INTO leads (first_name, last_name, email)
              VALUES (${firstName}, ${lastName}, ${email})
              ON CONFLICT (email) DO NOTHING;`;

    return NextResponse.json({ success: true });
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
    const sql = getSql();
    const rows = await sql`SELECT id, first_name, last_name, email, created_at FROM leads ORDER BY created_at DESC LIMIT 25;`;
    return NextResponse.json({ rows });
  } catch (err: any) {
    console.error('[leads][GET] error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
