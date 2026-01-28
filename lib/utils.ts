import { nanoid } from 'nanoid';

function generateId(): string {
  return nanoid();
}

function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

interface CreateRequest {
  content?: unknown;
  ttl_seconds?: unknown;
  max_views?: unknown;
}

type ValidationResult =
  | {
      valid: false;
      error: string;
    }
  | {
      valid: true;
      content: string;
      ttl_seconds?: number;
      max_views?: number;
    };

function validateCreateRequest(body: CreateRequest): ValidationResult {
  if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
    return { valid: false, error: 'content is required and must be a non-empty string' };
  }
  const result: ValidationResult = {
    valid: true,
    content: body.content,
  };
  if (body.ttl_seconds !== undefined) {
    if (typeof body.ttl_seconds !== 'number' || !Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
      return { valid: false, error: 'ttl_seconds must be an integer >= 1' };
    }
    result.ttl_seconds = body.ttl_seconds;
  }
  if (body.max_views !== undefined) {
    if (typeof body.max_views !== 'number' || !Number.isInteger(body.max_views) || body.max_views < 1) {
      return { valid: false, error: 'max_views must be an integer >= 1' };
    }
    result.max_views = body.max_views;
  }
  return result;
}

export { generateId, escapeHtml, validateCreateRequest };
