import { AppShell } from "@/components/layout/app-shell";
import { mockUser } from "@/features/home/mock-data";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
// Real session later on using Better Auth
  const user = mockUser;

  return <AppShell user={user}>{children}</AppShell>;
}
