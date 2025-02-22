import {
   date,
   decimal,
   integer,
   pgTable,
   primaryKey,
   text,
   timestamp,
   uniqueIndex,
   uuid,
   varchar,
} from 'drizzle-orm/pg-core';
import {
   compensationType,
   coopCycleType,
   coopYearType,
   offerStatusType,
   programLevelType,
   sourceType,
} from './enums.ts';

export const major = pgTable('major', {
   id: uuid('id').defaultRandom().primaryKey(),
   programLevel: programLevelType('program_level').notNull(),
   name: varchar('name', { length: 255 }).notNull().unique(),
});

export const minor = pgTable('minor', {
   id: uuid('id').defaultRandom().primaryKey(),
   programLevel: programLevelType('program_level').notNull(),
   name: varchar('name', { length: 255 }).notNull().unique(),
});

export const company = pgTable('company', {
   id: uuid('id').defaultRandom().primaryKey(),
   name: varchar('name', { length: 255 }).notNull().unique(),
   createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const position = pgTable('position', {
   id: uuid('id').defaultRandom().primaryKey(),
   companyId: uuid('company_id').notNull().references(() => company.id, {
      onDelete: 'cascade',
   }),
   name: varchar('name', { length: 255 }).notNull(),
   createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
   companyNameIdx: uniqueIndex('position_company_id_name_idx').on(
      table.companyId,
      table.name,
   ),
}));

export const location = pgTable('location', {
   id: uuid('id').defaultRandom().primaryKey(),
   stateId: varchar('state_id', { length: 10 }).notNull(),
   state: varchar('state', { length: 100 }).notNull(),
   city: varchar('city', { length: 100 }).notNull(),
}, (table) => ({
   stateCityIdx: uniqueIndex('location_state_city_idx').on(
      table.state,
      table.city,
   ),
}));

export const submission = pgTable('submission', {
   id: uuid('id').defaultRandom().primaryKey(),
   positionId: uuid('position_id').notNull().references(() => position.id, {
      onDelete: 'cascade',
   }),
   programLevel: programLevelType('program_level').notNull(),
   source: sourceType('source').notNull(),
   year: integer('year').notNull(),
   coopCycle: coopCycleType('coop_cycle').notNull(),
   coopYear: coopYearType('coop_year').notNull(),
   locationId: uuid('location_id').notNull().references(() => location.id, {
      onDelete: 'cascade',
   }),
   workHours: integer('work_hours').notNull().default(40),
   offerStatus: offerStatusType('offer_status').notNull(),
   notes: varchar('notes', { length: 255 }),
   createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const submissionMajor = pgTable('submission_major', {
   submissionId: uuid('submission_id').notNull().references(
      () => submission.id,
      { onDelete: 'cascade' },
   ),
   majorId: uuid('major_id').notNull().references(() => major.id, {
      onDelete: 'cascade',
   }),
}, (table) => ({
   pk: primaryKey(table.submissionId, table.majorId),
}));

export const submissionMinor = pgTable('submission_minor', {
   submissionId: uuid('submission_id').notNull().references(
      () => submission.id,
      { onDelete: 'cascade' },
   ),
   minorId: uuid('minor_id').notNull().references(() => minor.id, {
      onDelete: 'cascade',
   }),
}, (table) => ({
   pk: primaryKey(table.submissionId, table.minorId),
}));

// Compensation table definition
export const compensation = pgTable('compensation', {
   id: uuid('id').defaultRandom().primaryKey(),
   submissionId: uuid('submission_id').notNull().references(
      () => submission.id,
      { onDelete: 'cascade' },
   ),
   type: compensationType('type').notNull(),
   amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
   details: text('details'),
   createdAt: timestamp('created_at').notNull().defaultNow(),
});
