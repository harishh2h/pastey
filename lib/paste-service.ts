import { sql, getTestTime } from './db';
import { generateId } from './utils';

interface FetchPasteResult {
  content: string;
  remaining_views: number | null;
  expires_at: Date | null;
}

interface FetchPasteOptions {
  testTimeHeader?: string | null;
}

interface CreatePasteParams {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

interface CreatePasteResult {
  id: string;
  url: string;
}

/**
 * Fetch a paste by ID and increment view count atomically.
 * Returns null if paste is not found, expired, or view limit exceeded.
 */
async function fetchPaste(id: string, options: FetchPasteOptions = {}): Promise<FetchPasteResult | null> {
  const testTime = getTestTime(options.testTimeHeader);
  const now = testTime || new Date();
  const result = await sql`
    UPDATE pastes
    SET current_views = current_views + 1
    WHERE id = ${id}
      AND (expires_at IS NULL OR expires_at > ${now})
      AND (max_views IS NULL OR current_views < max_views)
    RETURNING 
      content,
      CASE WHEN max_views IS NULL THEN NULL ELSE (max_views - current_views) END as remaining_views,
      expires_at
  `;
  if (result.length === 0) {
    return null;
  }
  const paste = result[0];
  return {
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at,
  };
}

/**
 * Create a new paste.
 * 
 * TIMEZONE HANDLING:
 * - JavaScript Date objects are stored in UTC internally
 * - PostgreSQL TIMESTAMP stores values in UTC
 * - expires_at is calculated as: current UTC time + ttl_seconds
 * - All comparisons use UTC, ensuring consistent behavior across timezones
 */
async function createPaste(params: CreatePasteParams, baseUrl: string): Promise<CreatePasteResult> {
  const id = generateId();
  let expiresAt: Date | null = null;
  if (params.ttl_seconds) {
    const now = new Date();
    expiresAt = new Date(now.getTime() + params.ttl_seconds * 1000);
  }
  await sql`
    INSERT INTO pastes (id, content, expires_at, max_views, current_views)
    VALUES (${id}, ${params.content}, ${expiresAt}, ${params.max_views ?? null}, 0)
  `;
  return {
    id,
    url: `${baseUrl}/p/${id}`,
  };
}

export { fetchPaste, createPaste, type FetchPasteResult, type CreatePasteParams, type CreatePasteResult };
