import { Request, Response, Router } from 'express';
import { schema } from 'db/schema';
import { query, validationResult } from 'express-validator';
import { db } from 'db';
import { and, asc, eq, gt, ilike } from 'drizzle-orm';
import { validateRequest } from 'zod-express-middleware';
import { JobDataSchema } from '../validation/mod.ts';
import { handleJobSubmission } from '../handler/submission.ts';

export default () => {
   const router = Router();

   router.post(
      '/submit',
      async (req: Request, res: Response) => {
         console.log(req.body);
         const parsedData = await JobDataSchema.safeParseAsync(req.body);

         console.log(parsedData);
         if (!parsedData.success) {
            return res.status(400).json({
               success: false,
               errors: parsedData.error,
            });
         }

         const submission = await handleJobSubmission(parsedData.data);
         res.status(201).json({ success: true, data: submission });
      },
   );

   router.get(
      '/submissions',
      query('limit').optional().isInt({ min: 1, max: 50 }),
      async (req: Request, res: Response) => {
         const {
            cursor,
            limit: rawLimit,
            ...filterParams
         } = req.query;

         const limit = Math.min(parseInt(rawLimit as string) || 10, 50);

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
               cursor
                  ? gt(submission.id, parseInt(cursor as string))
                  : undefined,
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

         const lastItem = submissions[submissions.length - 1];
         const nextCursor = lastItem?.id;

         const hasMore = submissions.length === limit;

         return res.status(200).json({
            data: submissions,
            pagination: {
               limit,
               nextCursor: hasMore ? nextCursor : null,
               hasMore,
            },
         });
      },
   );
   return router;
};
