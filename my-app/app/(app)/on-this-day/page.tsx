import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnThisDayContent } from "@/components/dashboard/on-this-day-content";
import { getSessionUserId } from "@/features/auth/session";
import { getOnThisDayMoments } from "@/features/home/queries";

export const metadata: Metadata = { title: "On This Day" };

export default async function OnThisDayPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const { moments, timezone } = await getOnThisDayMoments(userId);
  return <OnThisDayContent moments={moments} timezone={timezone} />;
}