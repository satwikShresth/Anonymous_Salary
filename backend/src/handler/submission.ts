import { db } from 'db';
import { schema } from 'db/schema';
import { type JobData, JobDataSchema } from 'validation';

export async function handleJobSubmission(data: JobData) {
   const validatedData = JobDataSchema.parse(data);
   const [city, state] = validatedData.location.split(', ');

   return await db.transaction(async (tx) => {
      // Company
      const [companyRecord] = await tx
         .insert(schema.company)
         .values({ name: validatedData.companyName })
         .onConflictDoUpdate({
            target: schema.company.name,
            set: { name: validatedData.companyName },
         })
         .returning();

      // Position
      const [positionRecord] = await tx
         .insert(schema.position)
         .values({
            name: validatedData.position,
            companyId: companyRecord.id,
         })
         .onConflictDoUpdate({
            target: [schema.position.name, schema.position.companyId],
            set: { name: validatedData.position },
         })
         .returning();

      // Location
      const [locationRecord] = await tx
         .insert(schema.location)
         .values({
            city,
            state,
            stateId: state.substring(0, 2).toUpperCase(),
         })
         .onConflictDoUpdate({
            target: [schema.location.city, schema.location.state],
            set: { stateId: state.substring(0, 2).toUpperCase() },
         })
         .returning();

      // Submission
      const [submissionRecord] = await tx
         .insert(schema.submission)
         .values({
            positionId: positionRecord.id,
            locationId: locationRecord.id,
            programLevel: validatedData.level,
            source: validatedData.source,
            year: new Date(),
            coopCycle: validatedData.coopCycle,
            coopYear: validatedData.coopYear,
            offerStatus: validatedData.offerStatus,
            decision: validatedData.decision,
            reason: validatedData.decisionReason,
            notes: validatedData.otherNotes,
         })
         .returning();

      // Majors
      const majorPromises = validatedData.majors.map(async (majorName) => {
         const [majorRecord] = await tx
            .insert(schema.major)
            .values({
               name: majorName,
               programLevel: validatedData.level,
            })
            .onConflictDoUpdate({
               target: schema.major.name,
               set: { programLevel: validatedData.level },
            })
            .returning();

         return tx
            .insert(schema.submissionMajor)
            .values({
               submissionId: submissionRecord.id,
               majorId: majorRecord.id,
            })
            .onConflictDoNothing();
      });

      // Minors
      const minorPromises = validatedData.minors.map(async (minorName) => {
         const [minorRecord] = await tx
            .insert(schema.minor)
            .values({
               name: minorName,
               programLevel: validatedData.level,
            })
            .onConflictDoUpdate({
               target: schema.minor.name,
               set: { programLevel: validatedData.level },
            })
            .returning();

         return tx
            .insert(schema.submissionMinor)
            .values({
               submissionId: submissionRecord.id,
               minorId: minorRecord.id,
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

