import { moment, userSettings } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import type { MomentCategory } from "@/types/moment";

export type NewMoment = {
  title: string;
  description: string | null;
  category: MomentCategory;
  occurredAt: Date;
  timezone: string;
  imageUrl: string | null;
  imagePublicId: string | null;
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
  return db.transaction(async (tx) => {
    await tx
      .insert(userSettings)
      .values({ userId, timezone: input.timezone })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: { timezone: input.timezone, updatedAt: new Date() },
      });

    const [created] = await tx
      .insert(moment)
      .values({
        userId,
        title: input.title,
        description: input.description,
        category: input.category,
        occurredAt: input.occurredAt,
        timezone: input.timezone,
        occurredOn: calendarDate(input.occurredAt, input.timezone),
        imageUrl: input.imageUrl,
        imagePublicId: input.imagePublicId,
      })
      .returning({ id: moment.id });

    if (!created) throw new Error("Moment insert returned no row");
    return created;
  });
}
