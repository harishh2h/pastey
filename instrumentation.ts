/**
 * Instrumentation hook for Next.js.
 * Initializes database schema on server startup.
 * Gracefully handles initialization errors to prevent app crash.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { initSchema } = await import('./lib/db');
      await initSchema();
    } catch (error) {
      console.error('Database initialization failed during instrumentation:', error);
      // Don't throw - allow app to start even if initial DB connection fails
      // Schema will be initialized on first request as fallback
    }
  }
}
