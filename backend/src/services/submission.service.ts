import { BaseService } from './base.service.ts';

export class SubmissionService extends BaseService {
   async create(data: {
      positionId: string;
      locationId: string;
      level: string;
      source: string;
      year: number;
      workHours: string;
      coopCycle: string;
      coopYear: string;
      offerStatus: string;
      otherNotes?: string;
   }) {
      const [submission] = await this.database
         .insert(this.schema.submission)
         .values(data)
         .returning();

      return submission;
   }
}
