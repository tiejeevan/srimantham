import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDbInstance() {
  if (dbInstance) return dbInstance;

  let connectionString = process.env.DATABASE_URL;

  // Under Cloudflare, process.env.DATABASE_URL might not be populated globally
  // at cold start, so we check the request context bindings.
  if (!connectionString) {
    try {
      const context = getCloudflareContext();
      const env = context?.env as any;
      if (env?.DATABASE_URL) {
        connectionString = env.DATABASE_URL;
      }
    } catch (e) {
      // Ignored if outside request context or not in Cloudflare environment
    }
  }

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const client = neon(connectionString);
  dbInstance = drizzle({ client, schema });
  return dbInstance;
}

type DbType = ReturnType<typeof drizzle<typeof schema>>;

export const db = new Proxy({} as any, {
  get(target, prop) {
    const instance = getDbInstance();
    const value = Reflect.get(instance, prop);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
}) as unknown as DbType;

export * from './schema';

