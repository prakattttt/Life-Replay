import { drizzle } from 'drizzle-orm/postgres-js';

export const db = drizzle(process.env.DATABASE_URL!);

await db.execute('select 1');
