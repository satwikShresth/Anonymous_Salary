import { Request, Response, Router } from 'express';
import { schema } from 'db/schema';
import { db } from 'db';
import { and, eq, ilike, or } from 'drizzle-orm';
import { type programLevel } from '../validation/mod.ts';

export default () => {
   const router = Router();

   // Get positions for a company
   router.get('/position', async (req: Request, res: Response) => {
      const query_company = req.query.c as string;
      const query_position = req.query.q as string;
      const company = schema.company;
      const position = schema.position;

      const results = await db
         .select({
            name: position.name,
         })
         .from(position)
         .innerJoin(company, eq(position.companyId, company.id))
         .where(
            and(
               eq(company.name, query_company),
               ilike(position.name, `%${query_position}%`),
            ),
         );

      res.json(results.map((item) => item.name));
   });

   // Get majors
   router.get('/majors', async (req: Request, res: Response) => {
      const level = req.query.c as programLevel;
      const query = req.query.q as string;
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

      res.json(results.map((item) => item.name));
   });

   // Get minors
   router.get('/minors', async (req: Request, res: Response) => {
      const level = req.query.c as string;
      const query = req.query.q as string;
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

      res.json(results.map((item) => item.name));
   });

   // Get locations
   router.get('/location', async (req: Request, res: Response) => {
      const query = req.query.q as string;
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

      res.json(results.map((item) => `${item.city}, ${item.stateId}`));
   });

   router.get('/company', async (req: Request, res: Response) => {
      const query = req.query.q as string;
      const company = schema.company;

      const results = await db
         .select({ name: company.name })
         .from(company)
         .where(ilike(company.name, `%${query}%`));

      res.json(results.map((item) => item.name));
   });

   // Get enum values
   router.get('/radio', (_req: Request, res: Response) => {
      res.json(
         {
            coopYears: schema.coopYearType.enumValues,
            coopCycles: schema.coopCycleType.enumValues,
            compensationTypes: schema.compensationType.enumValues,
            levels: schema.programLevelType.enumValues,
            sources: schema.sourceType.enumValues,
            offerStatuses: schema.offerStatusType.enumValues,
         },
      );
   });

   router.get('/coop/cycle', (_req: Request, res: Response) => {
      res.json(schema.coopCycleType.enumValues);
   });

   router.get('/coop/years', (_req: Request, res: Response) => {
      res.json(schema.coopYearType.enumValues);
   });

   router.get('/source', (_req: Request, res: Response) => {
      res.json(schema.sourceType.enumValues);
   });

   router.get('/program', (_req: Request, res: Response) => {
      res.json(schema.programLevelType.enumValues);
   });

   router.get('/decision', (_req: Request, res: Response) => {
      res.json(schema.decisionType.enumValues);
   });

   router.get('/offer', (_req: Request, res: Response) => {
      res.json(schema.offerStatusType.enumValues);
   });

   router.get('/compensation', (_req: Request, res: Response) => {
      res.json(schema.compensationType.enumValues);
   });

   return router;
};
