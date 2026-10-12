import { AuthShell } from "@/components/auth/auth-shell";
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/session";

/**
 * Shared frame for /login, /register, /forgot-password and /reset-password.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return <AuthShell>{children}</AuthShell>;
}
