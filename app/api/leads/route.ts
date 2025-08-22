import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/leads  { firstName, lastName, email }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email } = body || {};

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure table exists (idempotent)
    await sql`CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );`;

    await sql`INSERT INTO leads (first_name, last_name, email) VALUES (${firstName}, ${lastName}, ${email});`;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[leads][POST] error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
