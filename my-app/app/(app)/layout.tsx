import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = { name: session.user.name, email: session.user.email };

  return <AppShell user={user}>{children}</AppShell>;
}
