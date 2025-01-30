import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { schema } from 'db/schema';
import { JobDataSchema } from './submission.validation.ts';

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

export type programLevel = z.infer<typeof programLevelTypeEnum>;
export type JobData = z.infer<typeof JobDataSchema>;
