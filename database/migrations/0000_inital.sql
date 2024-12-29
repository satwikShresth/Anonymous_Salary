CREATE TYPE "public"."compensation_type" AS ENUM('Hourly', 'Stipend', 'Bonus', 'Housing', 'Transportation', 'Food', 'Other');--> statement-breakpoint
CREATE TYPE "public"."coop_cycle_type" AS ENUM('Fall/Winter', 'Winter/Spring', 'Spring/Summer', 'Summer/Fall');--> statement-breakpoint
CREATE TYPE "public"."coop_year_type" AS ENUM('1st', '2nd', '3rd');--> statement-breakpoint
CREATE TYPE "public"."decision_type" AS ENUM('Accepted', 'Ranked');--> statement-breakpoint
CREATE TYPE "public"."offer_status_type" AS ENUM('Offered', 'Qualified Alternative');--> statement-breakpoint
CREATE TYPE "public"."program_level_type" AS ENUM('Undergraduate', 'Graduate');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('SCDC', 'External');--> statement-breakpoint
CREATE TABLE "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "compensation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"type" "compensation_type" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"state_id" varchar(10) NOT NULL,
	"state" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "major" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_level" "program_level_type" NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "major_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "minor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_level" "program_level_type" NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "minor_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "position" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position_id" uuid NOT NULL,
	"program_level" "program_level_type" NOT NULL,
	"source" "source_type" NOT NULL,
	"year" date NOT NULL,
	"coop_cycle" "coop_cycle_type" NOT NULL,
	"coop_year" "coop_year_type" NOT NULL,
	"location_id" uuid NOT NULL,
	"work_hours" integer DEFAULT 40 NOT NULL,
	"offer_status" "offer_status_type" NOT NULL,
	"decision" "decision_type" NOT NULL,
	"reason" varchar(100),
	"notes" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_major" (
	"submission_id" uuid NOT NULL,
	"major_id" uuid NOT NULL,
	CONSTRAINT "submission_major_submission_id_major_id_pk" PRIMARY KEY("submission_id","major_id")
);
--> statement-breakpoint
CREATE TABLE "submission_minor" (
	"submission_id" uuid NOT NULL,
	"minor_id" uuid NOT NULL,
	CONSTRAINT "submission_minor_submission_id_minor_id_pk" PRIMARY KEY("submission_id","minor_id")
);
--> statement-breakpoint
ALTER TABLE "compensation" ADD CONSTRAINT "compensation_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_position_id_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_major" ADD CONSTRAINT "submission_major_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_major" ADD CONSTRAINT "submission_major_major_id_major_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."major"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_minor" ADD CONSTRAINT "submission_minor_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_minor" ADD CONSTRAINT "submission_minor_minor_id_minor_id_fk" FOREIGN KEY ("minor_id") REFERENCES "public"."minor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "location_state_city_idx" ON "location" USING btree ("state","city");--> statement-breakpoint
CREATE UNIQUE INDEX "position_company_id_name_idx" ON "position" USING btree ("company_id","name");