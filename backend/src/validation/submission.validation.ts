import { z } from 'zod';
import {
   compensationTypeEnum,
   coopCycleTypeEnum,
   coopYearTypeEnum,
   insertCompanySchema,
   insertMajorSchema,
   insertMinorSchema,
   insertPositionSchema,
   insertSubmissionSchema,
   offerStatusTypeEnum,
   programLevelTypeEnum,
   sourceTypeEnum,
} from './mod.ts';
import { db } from 'db';
import { schema } from 'db/schema';
import { and, eq } from 'drizzle-orm';

export const JobDataSchema = z.object({
   company: insertCompanySchema.shape.name,
   position: insertPositionSchema.shape.name,
   majors: z.array(insertMajorSchema.shape.name).min(1),
   minors: z.array(insertMinorSchema.shape.name).optional().default([]),
   location: z.string().regex(/^[^,]+,\s*[^,]+$/),
   year: z.preprocess(
      (val) => Number(val),
      z.number().positive().min(1990).max(new Date().getFullYear() + 2),
   ),
   workHours: z.preprocess(
      (val) => Number(val),
      z.number().positive().max(120),
   ),
   coopYear: coopYearTypeEnum,
   coopCycle: coopCycleTypeEnum,
   compensations: z.array(
      z.object({
         type: compensationTypeEnum,
         amount: z.preprocess((val) => Number(val), z.number().positive()),
         description: z.string().optional(),
         isNotApplicable: z.preprocess(
            (val) => val === 'true' || val === true,
            z.boolean(),
         ),
      }),
   ),
   level: programLevelTypeEnum,
   source: sourceTypeEnum,
   offerStatus: offerStatusTypeEnum,
   otherNotes: insertSubmissionSchema.shape.notes,
   majorIds: z.array(z.string()).default([]), // Added majorIds
   minorIds: z.array(z.string()).default([]), // Added minorIds
   locationId: z.string().optional(), // Added locationId
}).superRefine(async (data, ctx) => {
   const majors = await db.select().from(schema.major);
   const minors = await db.select().from(schema.minor);

   const level = data.level;
   const [city, state] = data.location.split(', ');

   const validLoaction = await db
      .select({ id: schema.location.id })
      .from(
         schema.location,
      )
      .where(
         and(
            eq(schema.location.city, city),
            eq(schema.location.stateId, state),
         ),
      );

   const validMajors = majors.filter((m) =>
      data.majors.includes(m.name) && m.programLevel === level
   );
   data.majorIds = validMajors.map((m) => m.id);

   const invalidMajors = data.majors.filter(
      (major) => !validMajors.find((m) => m.name === major),
   );

   if (invalidMajors.length > 0) {
      ctx.addIssue({
         code: z.ZodIssueCode.custom,
         message: `Invalid majors: ${invalidMajors.join(', ')}`,
         path: ['majors'],
      });
   }

   const validMinors = minors.filter((m) =>
      data.minors.includes(m.name) && m.programLevel === level
   );
   data.minorIds = validMinors.map((m) => m.id);

   const invalidMinors = data.minors.filter(
      (minor) => !validMinors.find((m) => m.name === minor),
   );

   if (invalidMinors.length > 0) {
      ctx.addIssue({
         code: z.ZodIssueCode.custom,
         message: `Invalid minors: ${invalidMinors.join(', ')}`,
         path: ['minors'],
      });
   }

   if (validLoaction.length === 0 && !validLoaction[0]?.id) {
      ctx.addIssue({
         code: z.ZodIssueCode.custom,
         message: `Invalid location: ${data.location}`,
         path: ['location'],
      });
   } else {
      data.locationId = validLoaction[0].id;
   }
});

export type JobData = z.infer<typeof JobDataSchema>;
