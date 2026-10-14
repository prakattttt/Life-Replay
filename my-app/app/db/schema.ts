// db/schema.ts
import { sql, type SQL } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from "@/schemas/moment";
import { MOMENT_CATEGORIES } from "@/types/moment";
import { user } from "./auth-schema";

/* ───────────── Moments ───────────── */
export const momentCategory = pgEnum("moment_category", MOMENT_CATEGORIES);

export const moment = pgTable(
  "moment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    title: varchar("title", { length: MAX_TITLE_LENGTH }).notNull(),
    description: text("description"),
    category: momentCategory("category").notNull().default("other"),

    // Optional photo. The public id is what we need to delete it from Cloudinary.
    imageUrl: text("image_url"),
    imagePublicId: text("image_public_id"),

    // WHEN it happened: the exact instant, the user's timezone at that moment,
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    timezone: text("timezone").notNull(),
    occurredOn: date("occurred_on", { mode: "string" }).notNull(), // "2026-10-14", no Date objects

    // Filled in by Postgres from occurredOn. They power "On This Day".
    occurredMonth: smallint("occurred_month").generatedAlwaysAs(
      (): SQL => sql`extract(month from ${moment.occurredOn})::smallint`,
    ),
    occurredDay: smallint("occurred_day").generatedAlwaysAs(
      (): SQL => sql`extract(day from ${moment.occurredOn})::smallint`,
    ),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // Timeline: one user, newest first, month/year ranges on occurred_on.
    index("moment_timeline_idx").on(
      t.userId,
      t.occurredOn.desc(),
      t.occurredAt.desc(),
    ),
    // Timeline with a category filter.
    index("moment_category_timeline_idx").on(
      t.userId,
      t.category,
      t.occurredOn.desc(),
      t.occurredAt.desc(),
    ),
    // On This Day: same month + day, any earlier year.
    index("moment_on_this_day_idx").on(
      t.userId,
      t.occurredMonth,
      t.occurredDay,
    ),
    // Search (title + description). Drop it until the Search page exists if you prefer.
    index("moment_search_idx").using(
      "gin",
      sql`to_tsvector('english', ${t.title} || ' ' || coalesce(${t.description}, ''))`,
    ),

    // Last line of defence if a code path skips Zod.
    check("moment_title_not_blank", sql`char_length(btrim(${t.title})) > 0`),
    check(
      "moment_description_length",
      sql`${t.description} is null or char_length(${t.description}) <= ${sql.raw(String(MAX_DESCRIPTION_LENGTH))}`,
    ),
    check(
      "moment_image_pair",
      sql`(${t.imageUrl} is null) = (${t.imagePublicId} is null)`,
    ),
  ],
);

/* ───────────── Settings (one row per user) ───────────── */

export const userSettings = pgTable(
  "user_settings",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    // Last timezone we saw; the "send at 8:00 AM" emails need it.
    timezone: text("timezone").notNull().default("UTC"),

    // Notifications
    onThisDay: boolean("on_this_day").notNull().default(true),
    onThisDayTime: text("on_this_day_time").notNull().default("08:00"), // "HH:MM", same as the UI
    weeklyRecap: boolean("weekly_recap").notNull().default(false),

    // Privacy
    blurPhotos: boolean("blur_photos").notNull().default(false),
    discreetEmails: boolean("discreet_emails").notNull().default(true),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check(
      "user_settings_time_format",
      sql`${t.onThisDayTime} ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'`,
    ),
  ],
);

/* ───────────── Data export requests ───────────── */

export const exportFormat = pgEnum("export_format", ["json", "csv"]);
export const exportStatus = pgEnum("export_status", [
  "pending",
  "processing",
  "ready",
  "failed",
]);

export const dataExport = pgTable(
  "data_export",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    format: exportFormat("format").notNull(),
    includePhotos: boolean("include_photos").notNull().default(true),
    status: exportStatus("status").notNull().default("pending"),
    fileUrl: text("file_url"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [index("data_export_user_idx").on(t.userId, t.createdAt.desc())],
);

/* ───────────── Row types ───────────── */

export type MomentRow = typeof moment.$inferSelect;
export type NewMomentRow = typeof moment.$inferInsert;
export type UserSettingsRow = typeof userSettings.$inferSelect;
export type DataExportRow = typeof dataExport.$inferSelect;
