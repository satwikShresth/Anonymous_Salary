import express from 'express';
import { db } from '../db.js';
import { schema } from '../db/schema.js';
import { and, asc, eq, gt, ilike } from 'drizzle-orm';
import { handleJobSubmission } from '../handler/submission.js';
import { JobDataSchema } from '../validation.js';
import qs from 'qs';

const router = express.Router();

// Get all submissions with filtering and pagination
router.get('/', async (req, res) => {
   try {
      const { cursor, limit: rawLimit, ...filterParams } = req.query;
      const limit = Math.min(parseInt(rawLimit) || 10, 50);

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

      const filters = {
         companyName: (value) => ilike(company.name, `%${value}%`),
         position: (value) => ilike(position.name, `%${value}%`),
         level: (value) => eq(submission.programLevel, value),
         source: (value) => eq(submission.source, value),
         coopYear: (value) => eq(submission.coopYear, value),
         coopCycle: (value) => eq(submission.coopCycle, value),
      };

      const queries = Object.entries(filterParams)
         .map(([key, value]) => filters[key]?.(value))
         .filter(Boolean);

      const subQuery = db
         .select({
            id: submission.id,
         })
         .from(submission)
         .innerJoin(position, eq(position.id, submission.positionId))
         .innerJoin(company, eq(company.id, position.companyId))
         .where(queries.length > 0 ? and(...queries) : undefined)
         .where(cursor ? gt(submission.id, parseInt(cursor)) : undefined)
         .orderBy(asc(submission.id))
         .limit(limit)
         .as('sq');

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
               id: job.id,
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

      const lastItem = submissions[submissions.length - 1];
      const nextCursor = lastItem?.id;
      const hasMore = submissions.length === limit;

      res.json({
         data: submissions,
         pagination: {
            limit,
            nextCursor: hasMore ? nextCursor : null,
            hasMore,
         },
      });
   } catch (error) {
      next(error);
   }
});

// Submit new job
router.post('/submit', async (req, res, next) => {
   try {
      const parsedData = await qs.parse(req.body);
      const validatedData = await JobDataSchema.parseAsync(parsedData);
      const submission = await handleJobSubmission(validatedData);
      res.status(201).json({ success: true, data: submission });
   } catch (error) {
      next(error);
   }
});

// Get companies with submissions
router.get('/companies', async (req, res, next) => {
   try {
      const { q: query } = req.query;
      const { company, position, submission } = schema;

      const results = await db
         .selectDistinct({ name: company.name })
         .from(submission)
         .innerJoin(position, eq(submission.positionId, position.id))
         .innerJoin(company, eq(position.companyId, company.id))
         .where(query ? ilike(company.name, `%${query}%`) : undefined)
         .orderBy(company.name);

      res.json(results.map((item) => item.name));
   } catch (error) {
      next(error);
   }
});

// Get positions with submissions
router.get('/positions', async (req, res, next) => {
   try {
      const { q: query } = req.query;
      const { company, position, submission } = schema;

      const results = await db
         .selectDistinct({ name: position.name })
         .from(submission)
         .innerJoin(position, eq(submission.positionId, position.id))
         .innerJoin(company, eq(position.companyId, company.id))
         .where(query ? ilike(position.name, `%${query}%`) : undefined)
         .orderBy(position.name);

      res.json(results.map((item) => item.name));
   } catch (error) {
      next(error);
   }
});

export default router;
