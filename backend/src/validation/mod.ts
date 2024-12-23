import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { schema } from 'db/schema';

// Create base schemas from drizzle tables
export const insertSubmissionSchema = createInsertSchema(schema.submission);
export const insertCompanySchema = createInsertSchema(schema.company);
export const insertPositionSchema = createInsertSchema(schema.position);
export const insertLocationSchema = createInsertSchema(schema.location);
export const insertMajorSchema = createInsertSchema(schema.major);
export const insertMinorSchema = createInsertSchema(schema.minor);
export const insertCompensationSchema = createInsertSchema(schema.compensation);

export const sourceTypeEnum = createSelectSchema(schema.sourceType);

export const programLevelTypeEnum = createSelectSchema(schema.programLevelType);

export const coopCycleTypeEnum = createSelectSchema(schema.coopCycleType);

export const compensationTypeEnum = createSelectSchema(schema.compensationType);

export const coopYearTypeEnum = createSelectSchema(schema.coopYearType);

export const offerStatusTypeEnum = createSelectSchema(schema.offerStatusType);

export const decisionTypeEnum = createSelectSchema(schema.decisionType);

// Extend the base schema for JobData
export const JobDataSchema = z.object({
   companyName: insertCompanySchema.shape.name,
   position: insertPositionSchema.shape.name,
   majors: z.array(insertMajorSchema.shape.name).min(1),
   minors: z.array(insertMinorSchema.shape.name).optional().default([]),
   salary: z.preprocess((val) => Number(val), z.number().positive()),
   salaryNA: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
   location: z.string().regex(/^[^,]+,\s*[^,]+$/),
   workHours: z.preprocess((val) => Number(val), z.number().positive()),
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
   decision: decisionTypeEnum,
   decisionReason: insertSubmissionSchema.shape.reason,
   otherNotes: insertSubmissionSchema.shape.notes,
});

export type JobData = z.infer<typeof JobDataSchema>;
