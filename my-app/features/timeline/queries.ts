import { and, count, desc, eq, gte, lt, sql } from "drizzle-orm";
import { moment, userSettings } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import type { Moment } from "@/types/moment";
import { TIMELINE_PAGE_SIZE, type TimelineQuery } from "./params";

export type TimelineMomentsResult = {
  moments: Moment[];
  /** Matching moments in the month, ignoring pagination. */
  total: number;
  hasMore: boolean;
  /** How many older moments the next "load more" will add. */
  nextBatchSize: number;
};

export async function getTimelineTimezone(userId: string): Promise<string> {
  const [settings] = await db
    .select({ timezone: userSettings.timezone })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);
  return settings?.timezone ?? "UTC";
}

export async function getTimelineMoments(
  userId: string,
  query: TimelineQuery,
  now: Date,
): Promise<TimelineMomentsResult> {
  void now;
  const monthStart = `${query.year}-${String(query.month).padStart(2, "0")}-01`;
  const nextMonth = new Date(Date.UTC(query.year, query.month, 1));
  const monthEnd = `${nextMonth.getUTCFullYear()}-${String(nextMonth.getUTCMonth() + 1).padStart(2, "0")}-01`;
  const conditions = [
    eq(moment.userId, userId),
    gte(moment.occurredOn, monthStart),
    lt(moment.occurredOn, monthEnd),
  ];
  if (query.category) conditions.push(eq(moment.category, query.category));
  const where = and(...conditions);
  const take = TIMELINE_PAGE_SIZE * query.page;
  const [rows, [totalRow]] = await Promise.all([
    db
      .select({
        id: moment.id,
        title: moment.title,
        description: moment.description,
        category: moment.category,
        imageUrl: moment.imageUrl,
        occurredAt: moment.occurredAt,
        occurredOn: moment.occurredOn,
        timezone: moment.timezone,
      })
      .from(moment)
      .where(where)
      .orderBy(desc(moment.occurredOn), desc(moment.occurredAt))
      .limit(take),
    db.select({ total: count() }).from(moment).where(where),
  ]);
  const total = totalRow?.total ?? 0;
  const remaining = Math.max(total - take, 0);

  return {
    moments: rows satisfies Moment[],
    total,
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
  const yearPart = sql<number>`extract(year from ${moment.occurredOn})::int`;
  const monthPart = sql<number>`extract(month from ${moment.occurredOn})::int`;
  const selectedYearStart = `${selectedYear}-01-01`;
  const selectedYearEnd = `${selectedYear + 1}-01-01`;
  const [yearRows, monthRows, [totalRow]] = await Promise.all([
    db
      .select({ year: yearPart })
      .from(moment)
      .where(eq(moment.userId, userId))
      .groupBy(yearPart)
      .orderBy(desc(yearPart)),
    db
      .select({ month: monthPart, count: count() })
      .from(moment)
      .where(
        and(
          eq(moment.userId, userId),
          gte(moment.occurredOn, selectedYearStart),
          lt(moment.occurredOn, selectedYearEnd),
        ),
      )
      .groupBy(monthPart),
    db.select({ total: count() }).from(moment).where(eq(moment.userId, userId)),
  ]);

  const years = new Set<number>([now.getFullYear(), ...yearRows.map(({ year }) => year)]);
  const monthCounts = Array.from({ length: 12 }, () => 0);
  for (const row of monthRows) monthCounts[row.month - 1] = row.count;

  return {
    years: [...years].sort((a, b) => b - a),
    monthCounts,
    totalMoments: totalRow?.total ?? 0,
  };
}
