import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset password · Life Replay" };

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[]; error?: string | string[] }>;
};

/**
 * The emailed link lands here as /reset-password?token=…. Better Auth sends
 * people back with ?error=INVALID_TOKEN when the link is bad, which the form
 * shows as the "link expired" state.
 */
export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token, error } = await searchParams;
  const validToken = typeof token === "string" && token.length > 0 && !error ? token : null;

  return (
    <ResetPasswordForm token={validToken} signInHref="/login" forgotHref="/forgot-password" />
  );
}
