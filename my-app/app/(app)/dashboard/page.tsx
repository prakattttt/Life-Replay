import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getSession } from "@/features/auth/session";
import { getHomeData } from "@/features/home/queries";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Home" };

export default async function DashboardPage() {
  const now = new Date();
  const session = await getSession();
  if (!session) redirect("/login");
  const data = await getHomeData(session.user.id, now);

  return <DashboardContent name={session.user.name} now={now} data={data} />;
}
