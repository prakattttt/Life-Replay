import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MomentCollection } from "@/components/moments/moment-collection";
import { getSessionUserId } from "@/features/auth/session";
import { parseMomentBrowseParams, type RawMomentBrowseParams } from "@/features/moments/browse-params";
import { searchMoments } from "@/features/moments/browse-queries";

export const metadata: Metadata = {
  title: "Search memories",
  description: "Find moments in your private Life Replay archive.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<RawMomentBrowseParams>;
}) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const query = parseMomentBrowseParams(await searchParams);
  const result = await searchMoments(userId, query);

  return <MomentCollection mode="search" query={query} result={result} />;
}