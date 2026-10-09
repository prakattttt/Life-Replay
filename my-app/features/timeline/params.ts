import { isAfter } from "date-fns";
import { z } from "zod";
import { MOMENT_CATEGORIES, type MomentCategory } from "@/types/moment";

export const TIMELINE_PAGE_SIZE = 10;
const MAX_PAGES = 50;

export type TimelineQuery = {
  year: number;
  month: number; // 1–12
  category: MomentCategory | null;
  /** Number of pages loaded so far; the timeline grows by one page at a time. */
  page: number;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

// Every field falls back instead of throwing, so a hand-edited or stale URL
// still renders the timeline rather than an error page.
const optionalInt = (min: number, max: number) =>
  z.coerce.number().int().min(min).max(max).optional().catch(undefined);

const searchParamsSchema = z.object({
  year: optionalInt(1970, 2100),
  month: optionalInt(1, 12),
  category: z.enum(MOMENT_CATEGORIES).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(MAX_PAGES).catch(1),
});

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export function parseTimelineSearchParams(
  raw: RawSearchParams,
  now: Date,
): TimelineQuery {
  const parsed = searchParamsSchema.parse({
    year: firstValue(raw.year),
    month: firstValue(raw.month),
    category: firstValue(raw.category),
    page: firstValue(raw.page),
  });

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;

  let year = parsed.year ?? nowYear;
  // `?year=2023` alone lands on the end of that year, `?year=<this year>` on now.
  let month = parsed.month ?? (year === nowYear ? nowMonth : 12);

  // The future has no memories yet. Clamp to the current month.
  if (isAfter(new Date(year, month - 1, 1), now)) {
    year = nowYear;
    month = nowMonth;
  }

  return { year, month, category: parsed.category ?? null, page: parsed.page };
}

/** Builds a shareable, bookmarkable timeline URL. */
export function buildTimelineHref(query: TimelineQuery): string {
  const params = new URLSearchParams({
    year: String(query.year),
    month: String(query.month),
  });
  if (query.category) params.set("category", query.category);
  if (query.page > 1) params.set("page", String(query.page));
  return `/timeline?${params.toString()}`;
}
