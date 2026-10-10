import { CaptureShell } from "@/components/layout/capture-shell";
import { mockUser } from "@/features/home/mock-data";

export default async function CaptureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: use the real Better Auth session, and redirect to /login when there
  // is none (same change as in app/(app)/layout.tsx).
  const user = mockUser;

  return <CaptureShell user={user}>{children}</CaptureShell>;
}
