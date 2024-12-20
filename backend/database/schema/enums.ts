import { pgEnum } from 'drizzle-orm/pg-core';

export const sourceType = pgEnum('source_type', ['SCDC', 'External']);

export const programLevelType = pgEnum('program_level_type', [
   'Undergraduate',
   'Graduate',
   'PhD',
]);

export const coopCycleType = pgEnum('coop_cycle_type', [
   'Fall/Winter',
   'Winter/Spring',
   'Spring/Summer',
   'Summer/Fall',
]);

export const collegeYearType = pgEnum('college_year_type', [
   'First Year',
   'Second Year',
   'Third Year',
   'Fourth Year',
   'Fifth Year',
]);

export const offerStatusType = pgEnum('offer_status_type', [
   'Offered',
   'Qualified Alternative',
]);

export const decisionType = pgEnum('decision_type', [
   'Accepted',
   'Ranked',
]);
