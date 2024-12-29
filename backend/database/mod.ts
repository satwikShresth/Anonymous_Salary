import { drizzle } from 'npm:drizzle-orm/node-postgres';
import pg from 'npm:pg';
import { schema } from './schema/mod.ts';

const client = new pg.Pool({
   host: Deno.env.get('ENV') ? Deno.env.get('POSTGRES_SERVER') : 'localhost',
   database: Deno.env.get('POSTGRES_DB'),
   password: Deno.env.get('POSTGRES_PASSWORD'),
   port: Deno.env.get('POSTGRES_PORT'),
   user: Deno.env.get('POSTGRES_USER'),
   min: 2,
   max: 10,
});
const casing = 'snake_case';

export const db = drizzle({ client, schema, casing });
