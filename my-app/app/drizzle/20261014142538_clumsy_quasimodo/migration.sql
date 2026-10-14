CREATE TYPE "export_format" AS ENUM('json', 'csv');--> statement-breakpoint
CREATE TYPE "export_status" AS ENUM('pending', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "moment_category" AS ENUM('work', 'food', 'music', 'fitness', 'learning', 'ideas', 'personal', 'travel', 'other');--> statement-breakpoint
CREATE TABLE "data_export" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"format" "export_format" NOT NULL,
	"include_photos" boolean DEFAULT true NOT NULL,
	"status" "export_status" DEFAULT 'pending'::"export_status" NOT NULL,
	"file_url" text,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "moment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" text,
	"category" "moment_category" DEFAULT 'other'::"moment_category" NOT NULL,
	"image_url" text,
	"image_public_id" text,
	"occurred_at" timestamp with time zone NOT NULL,
	"timezone" text NOT NULL,
	"occurred_on" date NOT NULL,
	"occurred_month" smallint GENERATED ALWAYS AS (extract(month from "moment"."occurred_on")::smallint) STORED,
	"occurred_day" smallint GENERATED ALWAYS AS (extract(day from "moment"."occurred_on")::smallint) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "moment_title_not_blank" CHECK (char_length(btrim("title")) > 0),
	CONSTRAINT "moment_description_length" CHECK ("description" is null or char_length("description") <= 1000),
	CONSTRAINT "moment_image_pair" CHECK (("image_url" is null) = ("image_public_id" is null))
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" text PRIMARY KEY,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"on_this_day" boolean DEFAULT true NOT NULL,
	"on_this_day_time" text DEFAULT '08:00' NOT NULL,
	"weekly_recap" boolean DEFAULT false NOT NULL,
	"blur_photos" boolean DEFAULT false NOT NULL,
	"discreet_emails" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_time_format" CHECK ("on_this_day_time" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
);
--> statement-breakpoint
CREATE INDEX "data_export_user_idx" ON "data_export" ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "moment_timeline_idx" ON "moment" ("user_id","occurred_on" DESC NULLS LAST,"occurred_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "moment_category_timeline_idx" ON "moment" ("user_id","category","occurred_on" DESC NULLS LAST,"occurred_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "moment_on_this_day_idx" ON "moment" ("user_id","occurred_month","occurred_day");--> statement-breakpoint
CREATE INDEX "moment_search_idx" ON "moment" USING gin (to_tsvector('english', "title" || ' ' || coalesce("description", '')));--> statement-breakpoint
ALTER TABLE "data_export" ADD CONSTRAINT "data_export_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "moment" ADD CONSTRAINT "moment_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;