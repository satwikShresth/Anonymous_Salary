import { asc, eq, ilike } from 'drizzle-orm';
import { schema } from 'db/schema';
import { BaseQueryService } from './baseQuery.service.ts';

export class SubmissionFilterService extends BaseQueryService {
   private filterMap = {
      companyName: (value: string) => ilike(schema.company.name, `%${value}%`),
      position: (value: string) => ilike(schema.position.name, `%${value}%`),
      level: (value: string) => eq(schema.submission.programLevel, value),
      source: (value: string) => eq(schema.submission.source, value),
      coopYear: (value: string) => eq(schema.submission.coopYear, value),
      coopCycle: (value: string) => eq(schema.submission.coopCycle, value),
   };

   createFilters(filterParams: Record<string, string>) {
      return Object.entries(filterParams)
         .map(([key, value]) => this.filterMap[key]?.(value))
         .filter(Boolean);
   }
}

export class SubmissionBaseFetchService extends BaseQueryService {
   async fetchBaseSubmissions(subQuery: any) {
      return await this.database
         .select({
            id: schema.submission.id,
            company: schema.company.name,
            position: schema.position.name,
            programLevel: schema.submission.programLevel,
            year: schema.submission.year,
            source: schema.submission.source,
            workHours: schema.submission.workHours,
            offerStatus: schema.submission.offerStatus,
            notes: schema.submission.notes,
            coopYear: schema.submission.coopYear,
            coopCycle: schema.submission.coopCycle,
            city: schema.location.city,
            state: schema.location.stateId,
         })
         .from(schema.submission)
         .innerJoin(
            schema.position,
            eq(schema.position.id, schema.submission.positionId),
         )
         .innerJoin(
            schema.company,
            eq(schema.company.id, schema.position.companyId),
         )
         .innerJoin(
            schema.location,
            eq(schema.location.id, schema.submission.locationId),
         )
         .innerJoin(subQuery, eq(subQuery.id, schema.submission.id))
         .orderBy(asc(schema.submission.id));
   }
}

export class SubmissionRelationsService extends BaseQueryService {
   async fetchMajors(submissionId: number) {
      return await this.database
         .select({ name: schema.major.name })
         .from(schema.submissionMajor)
         .innerJoin(
            schema.major,
            eq(schema.major.id, schema.submissionMajor.majorId),
         )
         .where(eq(schema.submissionMajor.submissionId, submissionId));
   }

   async fetchMinors(submissionId: number) {
      return await this.database
         .select({ name: schema.minor.name })
         .from(schema.submissionMinor)
         .innerJoin(
            schema.minor,
            eq(schema.minor.id, schema.submissionMinor.minorId),
         )
         .where(eq(schema.submissionMinor.submissionId, submissionId));
   }

   async fetchCompensations(submissionId: number) {
      return await this.database
         .select({
            type: schema.compensation.type,
            amount: schema.compensation.amount,
            description: schema.compensation.details,
         })
         .from(schema.compensation)
         .where(eq(schema.compensation.submissionId, submissionId));
   }
}
