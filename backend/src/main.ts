import { Context, Hono } from '@hono/hono';
import { logger } from '@hono/hono/logger';
import { cors } from '@hono/hono/cors';
import { validator } from '@hono/hono/validator';
import { db } from 'db';
import { schema } from 'db/schema';
import { and, eq, ilike, or } from 'drizzle-orm';
import { handleJobSubmission } from './handler/submission.ts';
import qs from 'qs';
import { JobDataSchema } from 'validation';

const app = new Hono()
   .use('*', logger())
   .use('*', cors())
   .use('*', async (c, next) => {
      try {
         await next();
      } catch (err) {
         console.error('Middleware caught error:', err);
         throw err;
      }
   })
   .get('/positions', async (c) => {
      const query_c: string | undefined = c.req.query('c');
      const company = schema.company;
      const position = schema.position;

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
   })
   .get('/majors', async (c) => {
      const level = c.req.query('c');
      const query = c.req.query('q');
      const major = schema.major;

      const results = await db
         .select({ name: major.name })
         .from(major)
         .where(
            and(
               eq(major.programLevel, level),
               ilike(major.name, `%${query}%`),
            ),
         );
      console.log(level, query);

      return c.json(results.map((item) => item.name));
   })
   .get('/minors', async (c) => {
      const level = c.req.query('c');
      const query = c.req.query('q');
      const minor = schema.minor;

      const results = await db
         .select({ name: minor.name })
         .from(minor)
         .where(
            and(
               eq(minor.programLevel, level),
               ilike(minor.name, `%${query}%`),
            ),
         );
      console.log(level, query);

      return c.json(results.map((item) => item.name));
   })
   .get('/locations', async (c) => {
      const query = c.req.query('q');
      const location = schema.location;

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
      }

      return c.json(results.map((item) => `${item.city}, ${item.stateId}`));
   })
   .get('/companies', async (c) => {
      const query = c.req.query('q');
      const company = schema.company;

      const results = await db
         .select({ name: company.name })
         .from(company)
         .where(
            ilike(company.name, `%${query}%`),
         );

      return c.json(results.map((item) => item.name));
   })
   .get(
      '/coop/cycles',
      (c: Context) => c.json(schema.coopCycleType.enumValues),
   )
   .get('/coop/years', (c: Context) => c.json(schema.coopYearType.enumValues))
   .get('/source', (c: Context) => c.json(schema.sourceType.enumValues))
   .get('/program', (c: Context) => c.json(schema.programLevelType.enumValues))
   .get('/decision', (c: Context) => c.json(schema.decisionType.enumValues))
   .get('/offer', (c: Context) => c.json(schema.offerStatusType.enumValues))
   .get(
      '/compensation',
      (c: Context) => c.json(schema.compensationType.enumValues),
   )
   .post(
      '/submit',
      validator('form', async (value, c) => {
         const preProcessed = await qs.parse(value);
         const parsed = JobDataSchema.parse(preProcessed);
         return parsed;
      }),
      async (c) => {
         const data = c.req.valid('form');
         const submission = await handleJobSubmission(data);
         return c.json({ success: true, data: submission }, 201);
      },
   )
   .onError((err, c) => {
      if (c.res.status === 400) {
         console.error('Validation Error:', err.message);
         return c.json({
            error: 'Validation Error',
            message: err.message,
         }, 400);
      }

      console.error('Server Error:', err);
      return c.json({
         error: 'Internal Server Error',
         message: err.message,
      }, 500);
   })
   .notFound((c) =>
      c.json({
         error: 'Not Found',
         message: 'The requested resource was not found',
      }, 404)
   );

const port = Deno.env.get('PORT') || 3000;
console.log(`Server is running on port ${port}`);

export default app;
