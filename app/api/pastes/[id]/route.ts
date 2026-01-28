import { NextRequest, NextResponse } from 'next/server';
import { initSchema } from '@/lib/db';
import { fetchPaste } from '@/lib/paste-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Schema is initialized at app startup, but keep as fallback for safety
    await initSchema();
    const { id } = await params;
    const testTimeHeader = request.headers.get('x-test-now-ms');
    const paste = await fetchPaste(id, { testTimeHeader });
    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }
    return NextResponse.json({
      content: paste.content,
      remaining_views: paste.remaining_views,
      expires_at: paste.expires_at ? paste.expires_at.toISOString() : null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
