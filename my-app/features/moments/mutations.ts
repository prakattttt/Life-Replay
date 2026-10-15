import { moment, userSettings } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import { and, eq } from "drizzle-orm";
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

export type MomentUpdate = Omit<NewMoment, "imageUrl" | "imagePublicId"> & {
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

export async function updateMoment(
  userId: string,
  momentId: string,
  input: MomentUpdate,
): Promise<{ previousImagePublicId: string | null } | null> {
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ imagePublicId: moment.imagePublicId })
      .from(moment)
      .where(and(eq(moment.id, momentId), eq(moment.userId, userId)))
      .limit(1);

    if (!existing) return null;

    const [updated] = await tx
      .update(moment)
      .set({
        title: input.title,
        description: input.description,
        category: input.category,
        occurredAt: input.occurredAt,
        timezone: input.timezone,
        occurredOn: calendarDate(input.occurredAt, input.timezone),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
        ...(input.imagePublicId !== undefined
          ? { imagePublicId: input.imagePublicId }
          : {}),
      })
      .where(and(eq(moment.id, momentId), eq(moment.userId, userId)))
      .returning({ id: moment.id });

    if (!updated) return null;

    return { previousImagePublicId: existing.imagePublicId };
  });
}

export async function hasOwnedMoment(userId: string, momentId: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: moment.id })
    .from(moment)
    .where(and(eq(moment.id, momentId), eq(moment.userId, userId)))
    .limit(1);

  return existing !== undefined;
}

export async function deleteMoment(
  userId: string,
  momentId: string,
): Promise<{ imagePublicId: string | null } | null> {
  const [deleted] = await db
    .delete(moment)
    .where(and(eq(moment.id, momentId), eq(moment.userId, userId)))
    .returning({ imagePublicId: moment.imagePublicId });

  return deleted ?? null;
}
