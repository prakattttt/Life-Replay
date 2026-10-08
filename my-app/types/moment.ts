export const MOMENT_CATEGORIES = [
  "work",
  "food",
  "music",
  "fitness",
  "learning",
  "ideas",
  "personal",
  "travel",
  "other",
] as const;

export type MomentCategory = (typeof MOMENT_CATEGORIES)[number];

/**
 * UI-facing moment shape.
 * TODO: once `src/db/schema.ts` exists, derive this from the Drizzle table
 * (`typeof moments.$inferSelect`) instead of maintaining it by hand.
 */
export type Moment = {
  id: string;
  title: string;
  description: string | null;
  category: MomentCategory;
  imageUrl: string | null;
  occurredAt: Date;
};
