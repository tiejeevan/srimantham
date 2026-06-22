import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not set. Database queries will fail at runtime if environment variables are not injected.");
}

// If DATABASE_URL is missing (e.g. during build), we mock neon to avoid compile-time crashes
const client = connectionString 
  ? neon(connectionString) 
  : (() => {
      return async () => {
        throw new Error("DATABASE_URL is not configured.");
      };
    })() as any;

export const db = drizzle({ client, schema });
export * from './schema';
