import { AuthShell } from "@/components/auth/auth-shell";

/**
 * Shared frame for /login, /register, /forgot-password and /reset-password.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
