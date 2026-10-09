import { addMonths } from "date-fns";
import type { Moment } from "@/types/moment";
import { getMockMoments } from "./mock-data";
import { TIMELINE_PAGE_SIZE, type TimelineQuery } from "./params";

/**
 * MOCK QUERIES with the shape the real Drizzle queries will have.
 * Every function takes `userId` first: in the real version each query must
 * include `eq(moments.userId, userId)` (AGENTS.md §10), and `userId` must come
 * from the authenticated session, never from the URL.
 */

export type TimelineMomentsResult = {
  moments: Moment[];
  /** Matching moments in the month, ignoring pagination. */
  total: number;
  hasMore: boolean;
  /** How many older moments the next "load more" will add. */
  nextBatchSize: number;
};

export async function getTimelineMoments(
  userId: string,
  query: TimelineQuery,
  now: Date,
): Promise<TimelineMomentsResult> {
  void userId; // scoped in the real query: WHERE user_id = $1

  // Real query: WHERE user_id = $1
  //   AND occurred_at >= $monthStart AND occurred_at < $nextMonthStart
  //   [AND category = $category] ORDER BY occurred_at DESC LIMIT $take
  // Month boundaries use the server timezone here; switch to the user's
  // timezone once settings exist (AGENTS.md §15).
  const monthStart = new Date(query.year, query.month - 1, 1);
  const monthEnd = addMonths(monthStart, 1);

  const inMonth = getMockMoments(now).filter(
    (moment) =>
      moment.occurredAt >= monthStart &&
      moment.occurredAt < monthEnd &&
      (query.category === null || moment.category === query.category),
  );

  const take = TIMELINE_PAGE_SIZE * query.page;
  const remaining = Math.max(inMonth.length - take, 0);

  return {
    moments: inMonth.slice(0, take),
    total: inMonth.length,
    hasMore: remaining > 0,
    nextBatchSize: Math.min(remaining, TIMELINE_PAGE_SIZE),
  };
}

export type TimelineFilterOptions = {
  /** Years that contain moments (plus the current year), newest first. */
  years: number[];
  /** Moment count for each month (index 0 = January) of the selected year. */
  monthCounts: number[];
  totalMoments: number;
};

export async function getTimelineFilterOptions(
  userId: string,
  selectedYear: number,
  now: Date,
): Promise<TimelineFilterOptions> {
  void userId;

  // Real queries: SELECT DISTINCT extract(year ...) and a
  // GROUP BY extract(month ...) count, both scoped to the user.
  const all = getMockMoments(now);
  const years = new Set<number>([now.getFullYear()]);
  const monthCounts = Array.from({ length: 12 }, () => 0);

  for (const moment of all) {
    const year = moment.occurredAt.getFullYear();
    years.add(year);
    if (year === selectedYear) monthCounts[moment.occurredAt.getMonth()] += 1;
  }

  return {
    years: [...years].sort((a, b) => b - a),
    monthCounts,
    totalMoments: all.length,
  };
}
