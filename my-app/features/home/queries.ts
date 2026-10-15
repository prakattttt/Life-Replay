import { and, count, desc, eq, lt } from "drizzle-orm";
import { moment, userSettings } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import type { Moment } from "@/types/moment";

export type HomeData = {
  totalMoments: number;
  timezone: string;
  today: Moment[];
  onThisDay: {
    moment: Moment;
    yearsAgo: number;
    momentsThatDay: number;
  } | null;
  recent: Moment[];
};

function localDateKey(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

const momentFields = {
  id: moment.id,
  title: moment.title,
  description: moment.description,
  category: moment.category,
  imageUrl: moment.imageUrl,
  occurredAt: moment.occurredAt,
  occurredOn: moment.occurredOn,
  timezone: moment.timezone,
};

export async function getHomeData(
  userId: string,
  now = new Date(),
): Promise<HomeData> {
  const [settings] = await db
    .select({ timezone: userSettings.timezone })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);
  const timezone = settings?.timezone ?? "UTC";
  const today = localDateKey(now, timezone);
  const [, currentMonth, currentDay] = today.split("-").map(Number);

  const [totalRows, todayRows, historyRows, historyCountRows, recentRows] =
    await Promise.all([
      db
        .select({ total: count() })
        .from(moment)
        .where(eq(moment.userId, userId)),
      db
        .select(momentFields)
        .from(moment)
        .where(and(eq(moment.userId, userId), eq(moment.occurredOn, today)))
        .orderBy(desc(moment.occurredAt)),
      db
        .select(momentFields)
        .from(moment)
        .where(
          and(
            eq(moment.userId, userId),
            eq(moment.occurredMonth, currentMonth),
            eq(moment.occurredDay, currentDay),
            lt(moment.occurredOn, today),
          ),
        )
        .orderBy(desc(moment.occurredOn), desc(moment.occurredAt))
        .limit(1),
      db
        .select({ total: count() })
        .from(moment)
        .where(
          and(
            eq(moment.userId, userId),
            eq(moment.occurredMonth, currentMonth),
            eq(moment.occurredDay, currentDay),
            lt(moment.occurredOn, today),
          ),
        ),
      db
        .select(momentFields)
        .from(moment)
        .where(and(eq(moment.userId, userId), lt(moment.occurredOn, today)))
        .orderBy(desc(moment.occurredOn), desc(moment.occurredAt))
        .limit(4),
    ]);

  const historicalMoment = historyRows[0];
  const yearsAgo = historicalMoment
    ? Number(today.slice(0, 4)) - Number(historicalMoment.occurredOn.slice(0, 4))
    : 0;

  return {
    totalMoments: totalRows[0]?.total ?? 0,
    timezone,
    today: todayRows satisfies Moment[],
    onThisDay: historicalMoment
      ? {
          moment: historicalMoment,
          yearsAgo,
          momentsThatDay: historyCountRows[0]?.total ?? 0,
        }
      : null,
    recent: recentRows satisfies Moment[],
  };
}

export async function getOnThisDayMoments(
  userId: string,
  now = new Date(),
): Promise<{ moments: Moment[]; timezone: string }> {
  const [settings] = await db
    .select({ timezone: userSettings.timezone })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);
  const timezone = settings?.timezone ?? "UTC";
  const today = localDateKey(now, timezone);
  const [, month, day] = today.split("-").map(Number);
  const moments = await db
    .select(momentFields)
    .from(moment)
    .where(
      and(
        eq(moment.userId, userId),
        eq(moment.occurredMonth, month),
        eq(moment.occurredDay, day),
        lt(moment.occurredOn, today),
      ),
    )
    .orderBy(desc(moment.occurredOn), desc(moment.occurredAt));

  return { moments: moments satisfies Moment[], timezone };
}