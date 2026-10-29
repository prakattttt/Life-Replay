import { cache } from "react";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { moment } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import type { Moment } from "@/types/moment";
import { MOMENT_BROWSE_PAGE_SIZE, type MomentBrowseQuery } from "./browse-params";

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

export type MomentBrowseResult = {
  moments: Moment[];
  total: number;
  page: number;
};

export const getOwnedMoment = cache(async (userId: string, momentId: string) => {
  const [entry] = await db
    .select()
    .from(moment)
    .where(and(eq(moment.id, momentId), eq(moment.userId, userId)))
    .limit(1);

  return entry ?? null;
});

export async function getMomentArchive(
  userId: string,
  query: MomentBrowseQuery,
): Promise<MomentBrowseResult> {
  const conditions = [eq(moment.userId, userId)];
  if (query.category) conditions.push(eq(moment.category, query.category));
  const where = and(...conditions);
  const [totalRow] = await db.select({ total: count() }).from(moment).where(where);
  const total = totalRow?.total ?? 0;
  const page = Math.min(query.page, Math.max(1, Math.ceil(total / MOMENT_BROWSE_PAGE_SIZE)));
  const rows = await db
    .select(momentFields)
    .from(moment)
    .where(where)
    .orderBy(desc(moment.occurredOn), desc(moment.occurredAt))
    .limit(MOMENT_BROWSE_PAGE_SIZE)
    .offset((page - 1) * MOMENT_BROWSE_PAGE_SIZE);

  return { moments: rows satisfies Moment[], total, page };
}

export async function searchMoments(
  userId: string,
  query: MomentBrowseQuery,
): Promise<MomentBrowseResult> {
  if (!query.query) return { moments: [], total: 0, page: 1 };

  const searchableText = sql`to_tsvector('english', ${moment.title} || ' ' || coalesce(${moment.description}, ''))`;
  const searchTerms = sql`websearch_to_tsquery('english', ${query.query})`;
  const conditions = [
    eq(moment.userId, userId),
    sql`${searchableText} @@ ${searchTerms}`,
  ];
  if (query.category) conditions.push(eq(moment.category, query.category));
  const where = and(...conditions);
  const rank = sql<number>`ts_rank(${searchableText}, ${searchTerms})`;
  const [totalRow] = await db.select({ total: count() }).from(moment).where(where);
  const total = totalRow?.total ?? 0;
  const page = Math.min(query.page, Math.max(1, Math.ceil(total / MOMENT_BROWSE_PAGE_SIZE)));
  const rows = await db
    .select({ ...momentFields, rank })
    .from(moment)
    .where(where)
    .orderBy(desc(rank), desc(moment.occurredOn), desc(moment.occurredAt))
    .limit(MOMENT_BROWSE_PAGE_SIZE)
    .offset((page - 1) * MOMENT_BROWSE_PAGE_SIZE);

  return { moments: rows satisfies Moment[], total, page };
}