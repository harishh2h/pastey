import { NextResponse } from 'next/server';
import { sql, initSchema } from '@/lib/db';

export async function GET(): Promise<NextResponse> {
  try {
    // Schema is initialized at app startup, but keep as fallback for safety
    await initSchema();
    await sql`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Database connection failed' }, { status: 500 });
  }
}
