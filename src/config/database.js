import 'dotenv/config';

import * as neonServerless from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// For local development with Neon Local, configure the serverless client
// to use the local proxy endpoint. The package exports a `Config` object
// on the module namespace, not on the `neon` function itself.
if (process.env.NODE_ENV === 'development') {
  // The package exposes configuration as `neonConfig` (or older `Config`).
  // Set options defensively depending on which export is available.
  const cfg = neonServerless.neonConfig ?? neonServerless.Config ?? null;
  if (cfg) {
    cfg.fetchEndpoint = 'http://neon-local:5432/sql';
    cfg.useSecureWebSocket = false;
    cfg.poolQueryViaFetch = true;
  } else {
    console.warn('neon serverless config object not found; skipping neon-local overrides');
  }
}

const sql = neonServerless.neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export { db, sql };
