import { asc, count, eq } from "drizzle-orm";
import { moment, userSettings } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import type { ProfileData } from "./types";

type ProfileIdentity = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
};

export async function getProfileData(identity: ProfileIdentity): Promise<ProfileData> {
  const [[momentTotal], [firstMoment], [storedSettings]] = await Promise.all([
    db
      .select({ total: count() })
      .from(moment)
      .where(eq(moment.userId, identity.id)),
    db
      .select({ occurredOn: moment.occurredOn })
      .from(moment)
      .where(eq(moment.userId, identity.id))
      .orderBy(asc(moment.occurredAt))
      .limit(1),
    db
      .select({
        onThisDay: userSettings.onThisDay,
        onThisDayTime: userSettings.onThisDayTime,
        weeklyRecap: userSettings.weeklyRecap,
        blurPhotos: userSettings.blurPhotos,
        discreetEmails: userSettings.discreetEmails,
      })
      .from(userSettings)
      .where(eq(userSettings.userId, identity.id))
      .limit(1),
  ]);

  return {
    profile: {
      name: identity.name,
      email: identity.email,
      imageUrl: identity.image ?? null,
      createdAt: identity.createdAt,
      momentCount: momentTotal?.total ?? 0,
      firstMomentOn: firstMoment?.occurredOn ?? null,
    },
    settings: {
      notifications: {
        onThisDay: storedSettings?.onThisDay ?? true,
        onThisDayTime: (storedSettings?.onThisDayTime ?? "08:00") as ProfileData["settings"]["notifications"]["onThisDayTime"],
        weeklyRecap: storedSettings?.weeklyRecap ?? false,
      },
      privacy: {
        blurPhotos: storedSettings?.blurPhotos ?? false,
        discreetEmails: storedSettings?.discreetEmails ?? true,
      },
    },
  };
}