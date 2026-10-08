import type { MomentCategory } from "@/types/moment";

/**
 * Class names are written out in full so Tailwind can detect them.
 * Never build them with template strings.
 */
export const categoryMeta: Record<
  MomentCategory,
  { label: string; dot: string }
> = {
  work: { label: "Work", dot: "bg-category-work" },
  food: { label: "Food", dot: "bg-category-food" },
  music: { label: "Music", dot: "bg-category-music" },
  fitness: { label: "Fitness", dot: "bg-category-fitness" },
  learning: { label: "Learning", dot: "bg-category-learning" },
  ideas: { label: "Ideas", dot: "bg-category-ideas" },
  personal: { label: "Personal", dot: "bg-category-personal" },
  travel: { label: "Travel", dot: "bg-category-travel" },
  other: { label: "Other", dot: "bg-category-other" },
};
