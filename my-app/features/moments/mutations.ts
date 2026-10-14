import type { MomentCategory } from "@/types/moment";
import { moment } from "@/app/db/schema";
import { db } from "@/app/lib/db";

export type NewMoment = {
  title: string;
  description: string | null;
  category: MomentCategory;
  occurredAt: Date;
  timezone: string;
};

function calendarDate(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export async function insertMoment(
  userId: string,
  input: NewMoment,
): Promise<{ id: string }> {
  const [created] = await db
    .insert(moment)
    .values({
      userId,
      title: input.title,
      description: input.description,
      category: input.category,
      occurredAt: input.occurredAt,
      timezone: input.timezone,
      occurredOn: calendarDate(input.occurredAt, input.timezone),
    })
    .returning({ id: moment.id });

  if (!created) throw new Error("Moment insert returned no row");
  return created;
}
