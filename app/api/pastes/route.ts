import { NextRequest, NextResponse } from 'next/server';
import { initSchema } from '@/lib/db';
import { validateCreateRequest } from '@/lib/utils';
import { createPaste } from '@/lib/paste-service';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Schema is initialized at app startup, but keep as fallback for safety
    await initSchema();
    const body = await request.json();
    const validation = validateCreateRequest(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const result = await createPaste(
      {
        content: validation.content,
        ttl_seconds: validation.ttl_seconds,
        max_views: validation.max_views,
      },
      baseUrl
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
