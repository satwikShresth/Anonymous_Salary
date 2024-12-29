import { Context, Hono } from '@hono/hono';
import { logger } from '@hono/hono/logger';
import { cors } from '@hono/hono/cors';
import { validator } from '@hono/hono/validator';
import { db } from 'db';
import { schema } from 'db/schema';
import { and, asc, count, eq, gt, ilike, or, sql } from 'drizzle-orm';
import { handleJobSubmission } from './handler/submission.ts';
import { z } from 'zod';
import qs from 'qs';
import { compensationTypeEnum, JobDataSchema } from 'validation';

interface JobData {
   companyName: string;
   position: string;
   majors: string[];
   minors: string[];
   location: string;
   workHours: number;
   coopYear: string;
   coopCycle: string;
   compensations: CompensationItem[];
   level: string;
   source: string;
   offerStatus: string;
   decision: string;
   decisionReason: string;
   otherNotes: string;
}

interface CompensationItem {
   type: z.infer<typeof compensationTypeEnum>;
   amount: number | null;
   description: string;
   isNotApplicable?: boolean;
}

const app = new Hono()
   .use('*', logger())
   .use('*', cors())
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
   .get('/submissions/companies', async (c) => {
      const query = c.req.query('q');
      const company = schema.company;
      const position = schema.position;
      const submission = schema.submission;

      const results = await db
         .selectDistinct({ name: company.name })
         .from(submission)
         .innerJoin(position, eq(submission.positionId, position.id))
         .innerJoin(company, eq(position.companyId, company.id))
         .where(query ? ilike(company.name, `%${query}%`) : undefined)
         .orderBy(company.name);

      return c.json(results.map((item) => item.name));
   })
   .get('/submissions/positions', async (c) => {
      const query = c.req.query('q');
      const company = schema.company;
      const position = schema.position;
      const submission = schema.submission;

      const results = await db
         .selectDistinct({ name: position.name })
         .from(submission)
         .innerJoin(position, eq(submission.positionId, position.id))
         .innerJoin(company, eq(position.companyId, company.id))
         .where(query ? ilike(position.name, `%${query}%`) : undefined)
         .orderBy(position.name);

      return c.json(results.map((item) => item.name));
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
      validator('form', async (value, _c) => {
         const preProcessed = await qs.parse(value);
         return await JobDataSchema.parseAsync(preProcessed);
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
   )
   .get('/submissions', async (c) => {
      const queryParams = c.req.query();
      const {
         cursor,
         limit: rawLimit,
         ...filterParams
      } = queryParams;

      // Ensure reasonable limit with a maximum cap
      const limit = Math.min(parseInt(rawLimit as string) || 10, 50);

      // Schema references
      const {
         company,
         major,
         minor,
         submissionMajor,
         submissionMinor,
         position,
         submission,
         location,
         compensation,
      } = schema;

      // Filter conditions
      const filters = {
         companyName: (value: string) => ilike(company.name, `%${value}%`),
         position: (value: string) => ilike(position.name, `%${value}%`),
         level: (value: string) => eq(submission.programLevel, value),
         source: (value: string) => eq(submission.source, value),
         coopYear: (value: string) => eq(submission.coopYear, value),
         coopCycle: (value: string) => eq(submission.coopCycle, value),
      };

      const queries = Object.entries(filterParams)
         .map(([key, value]) => filters[key]?.(value))
         .filter(Boolean);

      // Create a subquery for better performance with pagination
      const subQuery = db
         .select({
            id: submission.id,
         })
         .from(submission)
         .innerJoin(position, eq(position.id, submission.positionId))
         .innerJoin(company, eq(company.id, position.companyId))
         .where(queries.length > 0 ? and(...queries) : undefined)
         .where(
            cursor ? gt(submission.id, parseInt(cursor as string)) : undefined,
         )
         .orderBy(asc(submission.id))
         .limit(limit)
         .as('sq');

      // Main query using the subquery
      const query = await db
         .select({
            id: submission.id,
            companyName: company.name,
            position: position.name,
            programLevel: submission.programLevel,
            source: submission.source,
            workHours: submission.workHours,
            offerStatus: submission.offerStatus,
            decision: submission.decision,
            decisionReason: submission.reason,
            otherNotes: submission.notes,
            coopYear: submission.coopYear,
            coopCycle: submission.coopCycle,
            city: location.city,
            state: location.stateId,
         })
         .from(submission)
         .innerJoin(position, eq(position.id, submission.positionId))
         .innerJoin(company, eq(company.id, position.companyId))
         .innerJoin(location, eq(location.id, submission.locationId))
         .innerJoin(subQuery, eq(subQuery.id, submission.id))
         .orderBy(asc(submission.id));

      const submissions = await Promise.all(
         query.map(async (job) => {
            const submissionId = job.id;

            const [majors, minors, compensations] = await Promise.all([
               db
                  .select({ name: major.name })
                  .from(submissionMajor)
                  .innerJoin(major, eq(major.id, submissionMajor.majorId))
                  .where(eq(submissionMajor.submissionId, submissionId)),

               db
                  .select({ name: minor.name })
                  .from(submissionMinor)
                  .innerJoin(minor, eq(minor.id, submissionMinor.minorId))
                  .where(eq(submissionMinor.submissionId, submissionId)),

               db
                  .select({
                     type: compensation.type,
                     amount: compensation.amount,
                     description: compensation.details,
                  })
                  .from(compensation)
                  .where(eq(compensation.submissionId, submissionId)),
            ]);

            return {
               id: job.id, // Include ID for cursor-based pagination
               companyName: job.companyName,
               position: job.position,
               majors: majors.map((m) => m.name),
               minors: minors.map((m) => m.name),
               location: `${job.city}, ${job.state}`,
               workHours: job.workHours,
               coopYear: job.coopYear,
               coopCycle: job.coopCycle,
               compensations: compensations.map((comp) => ({
                  type: comp.type,
                  amount: comp.amount ? parseFloat(comp.amount) : null,
                  description: comp.description,
                  isNotApplicable: !comp.amount,
               })),
               level: job.programLevel,
               source: job.source,
               offerStatus: job.offerStatus,
               decision: job.decision,
               decisionReason: job.decisionReason || '',
               otherNotes: job.otherNotes || '',
            };
         }),
      );

      // Get the last ID for next page cursor
      const lastItem = submissions[submissions.length - 1];
      const nextCursor = lastItem?.id;

      // Check if there are more items
      const hasMore = submissions.length === limit;

      return c.json({
         data: submissions,
         pagination: {
            limit,
            nextCursor: hasMore ? nextCursor : null,
            hasMore,
         },
      });
   });
const port = Deno.env.get('PORT') || 3000;
console.log(`Server is running on port ${port}`);

export default app;
