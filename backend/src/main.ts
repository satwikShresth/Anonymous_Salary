import { Hono } from '@hono/hono';
import { logger } from '@hono/hono/logger';
import { cors } from '@hono/hono/cors';
import { db } from '../database/mod.ts';
import { company } from '../database/schema/table.ts';
import { count, desc, like } from 'drizzle-orm';

// Create the main app instance
const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

app.get('/companies', async (c) => {
   console.log('pass');
   const page = Number(c.req.query('page')) || 1;
   const limit = Number(c.req.query('limit')) || 10;
   const search = c.req.query('search');

   const offset = (page - 1) * limit;

   let query = db.select()
      .from(company)
      .orderBy(desc(company.createdAt))
      .limit(limit)
      .offset(offset);

   if (search) {
      query = query.where(like(company.name, `%${search}%`));
   }

   const companies = await query;

   const [{ value }] = await db.select({
      value: count(),
   }).from(company)
      .where(search ? like(company.name, `%${search}%`) : undefined);

   console.log(companies);

   return c.json({
      data: companies,
      pagination: {
         total: value,
         page,
         limit,
         totalPages: Math.ceil(value / limit),
      },
   });
});

app.onError((err, c) => {
   console.error(`${err}`);
   return c.json({
      error: 'Internal Server Error',
      message: err.message,
   }, 500);
});

// Not Found handler
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
