import { relations } from "drizzle-orm";
import {
  company,
  location,
  major,
  minor,
  position,
  submission,
  submissionMajor,
  submissionMinor,
} from "./table.ts";

// Relations
export const majorRelations = relations(major, ({ many }) => ({
  submissionMajors: many(submissionMajor),
}));

export const minorRelations = relations(minor, ({ many }) => ({
  submissionMinors: many(submissionMinor),
}));

export const companyRelations = relations(company, ({ many }) => ({
  positions: many(position),
}));

export const positionRelations = relations(position, ({ one, many }) => ({
  company: one(company, {
    fields: [position.companyId],
    references: [company.id],
  }),
  submissions: many(submission),
}));

export const locationRelations = relations(location, ({ many }) => ({
  submissions: many(submission),
}));

export const submissionRelations = relations(submission, ({ one, many }) => ({
  position: one(position, {
    fields: [submission.positionId],
    references: [position.id],
  }),
  location: one(location, {
    fields: [submission.locationId],
    references: [location.id],
  }),
  submissionMajors: many(submissionMajor),
  submissionMinors: many(submissionMinor),
}));

export const submissionMajorRelations = relations(
  submissionMajor,
  ({ one }) => ({
    submission: one(submission, {
      fields: [submissionMajor.submissionId],
      references: [submission.id],
    }),
    major: one(major, {
      fields: [submissionMajor.majorId],
      references: [major.id],
    }),
  }),
);

export const submissionMinorRelations = relations(
  submissionMinor,
  ({ one }) => ({
    submission: one(submission, {
      fields: [submissionMinor.submissionId],
      references: [submission.id],
    }),
    minor: one(minor, {
      fields: [submissionMinor.minorId],
      references: [minor.id],
    }),
  }),
);
