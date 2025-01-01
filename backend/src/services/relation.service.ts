import { BaseService } from './base.service.ts';

export class RelationService extends BaseService {
   async createSubmissionRelations(data: {
      submissionId: string;
      majorIds: string[];
      minorIds: string[];
      compensations: Array<{
         type: string;
         amount: string | null;
         description?: string;
      }>;
   }) {
      await Promise.all([
         ...data.majorIds.map((majorId) =>
            this.database
               .insert(this.schema.submissionMajor)
               .values({
                  submissionId: data.submissionId,
                  majorId,
               })
               .onConflictDoNothing()
         ),
         ...data.minorIds.map((minorId) =>
            this.database
               .insert(this.schema.submissionMinor)
               .values({
                  submissionId: data.submissionId,
                  minorId,
               })
               .onConflictDoNothing()
         ),
         ...data.compensations.map((comp) =>
            this.database
               .insert(this.schema.compensation)
               .values({
                  submissionId: data.submissionId,
                  type: comp.type,
                  amount: comp.amount,
                  details: comp.description,
               })
         ),
      ]);
   }
}
