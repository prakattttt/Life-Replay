import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MomentCollection } from "@/components/moments/moment-collection";
import { getSessionUserId } from "@/features/auth/session";
import { parseMomentBrowseParams, type RawMomentBrowseParams } from "@/features/moments/browse-params";
import { getMomentArchive } from "@/features/moments/browse-queries";

export const metadata: Metadata = {
  title: "Moments",
  description: "Browse and rediscover the moments saved in your private archive.",
};

export default async function MomentsArchivePage({
  searchParams,
}: {
  searchParams: Promise<RawMomentBrowseParams>;
}) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const query = parseMomentBrowseParams(await searchParams);
  const result = await getMomentArchive(userId, query);

  return <MomentCollection mode="archive" query={query} result={result} />;
}