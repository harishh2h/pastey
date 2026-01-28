import { neon } from '@neondatabase/serverless';


const sql = neon(process.env.DATABASE_URL!);

let schemaInitPromise: Promise<void> | null = null;

async function initSchema(): Promise<void> {
  if (schemaInitPromise) {
    return schemaInitPromise;
  }
  schemaInitPromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS pastes (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP,
        max_views INTEGER,
        current_views INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT valid_views CHECK (current_views >= 0),
        CONSTRAINT valid_max_views CHECK (max_views IS NULL OR max_views > 0)
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_pastes_expires_at ON pastes(expires_at) WHERE expires_at IS NOT NULL
    `;
  })();
  return schemaInitPromise;
}

function getTestTime(headerValue?: string | null): Date | null {
  if (process.env.TEST_MODE !== '1') {
    return null;
  }
  if (!headerValue) {
    return null;
  }
  const testTimeMs = parseInt(headerValue, 10);
  if (isNaN(testTimeMs)) {
    return null;
  }
  return new Date(testTimeMs);
}

export { sql, initSchema, getTestTime };
