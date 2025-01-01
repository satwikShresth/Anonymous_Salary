import { Request, Response, Router } from 'express';
import { schema } from 'db/schema';
import { db } from 'db';
import { and, asc, eq, gt } from 'drizzle-orm';
import { JobData, JobDataSchema } from '../validation/submission.validation.ts';
import { query } from 'express-validator';
import {
   companyService,
   positionService,
   relationService,
   submissionBaseFetchService,
   submissionFilterService,
   submissionRelationsService,
   submissionService,
} from '../services/mod.ts';

export default () => {
   const router = Router();

   router.post(
      '/submit',
      async (req: Request, res: Response) => {
         const parsedResult = await JobDataSchema.safeParseAsync(req.body);

         if (!parsedResult.success) {
            return res.status(400).json({
               success: false,
               errors: parsedResult.error,
            });
         }

         const data = parsedResult.data as JobData;

         const submission = await db.transaction(async (tx) => {
            const company = await companyService.findOrCreate(data.company);
            const position = await positionService.findOrCreate(
               data.position,
               company.id,
            );

            // Create submission
            const submission = await submissionService.create({
               positionId: position.id,
               locationId: data.locationId,
               level: data.level,
               source: data.source,
               year: data.year,
               workHours: data.workHours,
               coopCycle: data.coopCycle,
               coopYear: data.coopYear,
               offerStatus: data.offerStatus,
               otherNotes: data.otherNotes,
            });

            // Create all relations
            await relationService.createSubmissionRelations({
               submissionId: submission.id,
               majorIds: data.majorIds,
               minorIds: data.minorIds,
               compensations: data.compensations,
            });

            return submission;
         });

         res.status(201).json({ success: true, data: submission });
      },
   );

   router.get(
      '/submissions',
      query('limit').optional().isInt({ min: 1, max: 50 }),
      async (req: Request, res: Response) => {
         try {
            const { cursor, limit: rawLimit, ...filterParams } = req.query;
            const { limit } = submissionFilterService.createPaginationParams(
               rawLimit as string,
               cursor as string,
            );

            // 2. Build filters from query parameters
            const filters = submissionFilterService.createFilters(
               filterParams as Record<string, string>,
            );

            // 3. Create pagination subquery
            const subQuery = db
               .select({ id: schema.submission.id })
               .from(schema.submission)
               .innerJoin(
                  schema.position,
                  eq(schema.position.id, schema.submission.positionId),
               )
               .innerJoin(
                  schema.company,
                  eq(schema.company.id, schema.position.companyId),
               )
               .where(filters.length > 0 ? and(...filters) : undefined)
               .where(
                  cursor
                     ? gt(schema.submission.id, parseInt(cursor as string))
                     : undefined,
               )
               .orderBy(asc(schema.submission.id))
               .limit(limit)
               .as('sq');

            const baseSubmissions = await submissionBaseFetchService
               .fetchBaseSubmissions(
                  subQuery,
               );

            const enrichedSubmissions = await Promise.all(
               baseSubmissions.map(async (submission) => {
                  // 5a. Fetch all related data in parallel
                  const [majors, minors, compensations] = await Promise.all([
                     submissionRelationsService.fetchMajors(submission.id),
                     submissionRelationsService.fetchMinors(submission.id),
                     submissionRelationsService.fetchCompensations(
                        submission.id,
                     ),
                  ]);

                  // 5b. Format and return enriched submission
                  return {
                     id: submission.id,
                     company: submission.company,
                     position: submission.position,
                     majors: majors.map((m) => m.name),
                     minors: minors.map((m) => m.name),
                     location: `${submission.city}, ${submission.state}`,
                     workHours: submission.workHours,
                     year: submission.year,
                     coop: {
                        year: submission.coopYear,
                        cycle: submission.coopCycle,
                     },
                     compensations: compensations.map((comp) => ({
                        type: comp.type,
                        amount: comp.amount ? parseFloat(comp.amount) : null,
                        description: comp.description,
                        isNotApplicable: !comp.amount,
                     })),
                     level: submission.programLevel,
                     source: submission.source,
                     offerStatus: submission.offerStatus,
                     otherNotes: submission.notes || '',
                  };
               }),
            );

            // 6. Prepare pagination metadata
            const lastItem =
               enrichedSubmissions[enrichedSubmissions.length - 1];
            const nextCursor = lastItem?.id;
            const hasMore = enrichedSubmissions.length === limit;

            // 7. Send response
            return res.status(200).json({
               data: enrichedSubmissions,
               pagination: {
                  limit,
                  nextCursor: hasMore ? nextCursor : null,
                  hasMore,
               },
            });
         } catch (error) {
            console.error('Error fetching submissions:', error);
            return res.status(500).json({
               success: false,
               error: 'Internal server error',
            });
         }
      },
   );
   return router;
};
