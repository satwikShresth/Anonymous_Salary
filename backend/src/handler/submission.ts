import { db } from 'db';
import { schema } from 'db/schema';
import { type JobData } from 'validation';
import { and, eq } from 'drizzle-orm';

export async function handleJobSubmission(data: JobData) {
   const validatedData = data;
   console.log(validatedData);

   return await db.transaction(async (tx) => {
      // Check if company exists, if not create a new one
      let companyRecord = await tx
         .select()
         .from(schema.company)
         .where(eq(schema.company.name, validatedData.companyName))
         .limit(1);

      if (companyRecord.length === 0) {
         [companyRecord] = await tx
            .insert(schema.company)
            .values({ name: validatedData.companyName })
            .returning();
      } else {
         companyRecord = companyRecord[0];
      }

      // Check if position exists, if not create a new one
      let positionRecord = await tx
         .select()
         .from(schema.position)
         .where(
            and(
               eq(schema.position.name, validatedData.position),
               eq(schema.position.companyId, companyRecord.id),
            ),
         )
         .limit(1);

      if (positionRecord.length === 0) {
         [positionRecord] = await tx
            .insert(schema.position)
            .values({
               name: validatedData.position,
               companyId: companyRecord.id,
            })
            .returning();
      } else {
         positionRecord = positionRecord[0];
      }

      // Submission
      const [submissionRecord] = await tx
         .insert(schema.submission)
         .values({
            positionId: positionRecord.id,
            locationId: validatedData.locationId, // Use pre-validated location
            programLevel: validatedData.level,
            source: validatedData.source,
            year: new Date(),
            workHours: validatedData.workHours,
            coopCycle: validatedData.coopCycle,
            coopYear: validatedData.coopYear,
            offerStatus: validatedData.offerStatus,
            decision: validatedData.decision,
            reason: validatedData.decisionReason,
            notes: validatedData.otherNotes,
         })
         .returning();

      // Majors
      const majorPromises = validatedData.majorIds.map(async (majorId) => {
         return await tx
            .insert(schema.submissionMajor)
            .values({
               submissionId: submissionRecord.id,
               majorId: majorId,
            })
            .onConflictDoNothing();
      });

      // Minors
      const minorPromises = validatedData.minorIds.map(async (minorId) => {
         return await tx
            .insert(schema.submissionMinor)
            .values({
               submissionId: submissionRecord.id,
               minorId: minorId,
            })
            .onConflictDoNothing();
      });

      // Compensations
      const compensationPromises = validatedData.compensations.map(
         async (comp) => {
            return await tx
               .insert(schema.compensation)
               .values({
                  submissionId: submissionRecord.id,
                  type: comp.type, // Use enum type directly
                  amount: comp.amount,
                  details: comp.description,
               });
         },
      );

      await Promise.all([
         ...majorPromises,
         ...minorPromises,
         ...compensationPromises,
      ]);

      return submissionRecord;
   });
}

