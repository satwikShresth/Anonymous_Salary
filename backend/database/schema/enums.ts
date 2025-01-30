import { pgEnum } from "drizzle-orm/pg-core";

export const sourceType = pgEnum("source_type", ["SCDC", "External"]);

export const programLevelType = pgEnum("program_level_type", [
  "Undergraduate",
  "Graduate",
]);

export const coopCycleType = pgEnum("coop_cycle_type", [
  "Fall/Winter",
  "Winter/Spring",
  "Spring/Summer",
  "Summer/Fall",
]);

export const compensationType = pgEnum("compensation_type", [
  "Hourly",
  "Stipend",
  "Bonus",
  "Housing",
  "Transportation",
  "Food",
  "Other",
]);

export const coopYearType = pgEnum("coop_year_type", [
  "1st",
  "2nd",
  "3rd",
]);

export const offerStatusType = pgEnum("offer_status_type", [
  "Offered",
  "Qualified Alternative",
]);

export const decisionType = pgEnum("decision_type", [
  "Accepted",
  "Ranked",
]);
