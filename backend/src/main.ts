import { Hono } from '@hono/hono';
import { logger } from '@hono/hono/logger';
import { cors } from '@hono/hono/cors';
import { db } from '../database/mod.ts';
import { company, location, position } from '../database/schema/table.ts';
import { eq, ilike, or } from 'drizzle-orm';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

const companies = [
   'Google',
   'Microsoft',
   'Amazon',
   'Apple',
   'Meta',
   'IBM',
   'Intel',
   'AMD',
   'Nvidia',
   'Salesforce',
   'Adobe',
   'Twitter',
   'LinkedIn',
   'Shopify',
   'Uber',
   'Lyft',
   'Airbnb',
   'Netflix',
   'Oracle',
   'SAP',
];

app.get('/positions', async (c) => {
   const query_c = c.req.query('c');
   const query = c.req.query('q');

   const results = await db
      .select({
         name: position.name,
      })
      .from(position)
      .innerJoin(company, eq(position.companyId, company.id))
      .where(
         eq(company.name, query_c),
      );

   return c.json(results.map((item) => item.name));
});

app.get('/locations', async (c) => {
   const query = c.req.query('q');

   let results;

   if (!query) {
      results = await db.select().from(location);
   } else {
      results = await db
         .select()
         .from(location)
         .where(
            or(
               ilike(location.stateId, `%${query}%`),
               ilike(location.state, `%${query}%`),
               ilike(location.city, `%${query}%`),
            ),
         );
      console.log(results);
   }

   return c.json(results.map((item) => `${item.city}, ${item.stateId}`));
});

app.get('/companies', async (c) => {
   const query = c.req.query('q');

   let results;

   if (!query) {
      results = await db.select().from(company);
   } else {
      results = await db
         .select({ name: company.name })
         .from(company)
         .where(
            ilike(company.name, `%${query}%`),
         );
      console.log(results);
   }

   return c.json(results.map((item) => item.name));
});

app.onError((err, c) => {
   console.error(`${err}`);
   return c.json({
      error: 'Internal Server Error',
      message: err.message,
   }, 500);
});

app.notFound((c) => {
   return c.json({
      error: 'Not Found',
      message: 'The requested resource was not found',
   }, 404);
});

// Start the server
const port = Deno.env.get('PORT') || 3000;
console.log(`Server is running on port ${port}`);

export default app;
