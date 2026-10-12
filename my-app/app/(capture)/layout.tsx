import { CaptureShell } from "@/components/layout/capture-shell";
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/session";

export default async function CaptureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = { name: session.user.name, email: session.user.email };

  return <CaptureShell user={user}>{children}</CaptureShell>;
}
