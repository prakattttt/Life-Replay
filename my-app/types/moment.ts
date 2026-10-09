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

export type Moment = {
  id: string;
  title: string;
  description: string | null;
  category: MomentCategory;
  imageUrl: string | null;
  occurredAt: Date;
};
