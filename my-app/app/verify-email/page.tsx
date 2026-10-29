import type { Metadata } from "next";
import Link from "next/link";
import { AuthHeading } from "@/components/auth/auth-heading";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthSwitch } from "@/components/auth/auth-switch";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Confirm your email address to continue to your Life Replay archive.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; error?: string }>;
}) {
  const params = await searchParams;
  const isVerified = params.verified === "1";
  const hasError = Boolean(params.error);

  return (
    <AuthShell>
      <div className="flex flex-col gap-8">
        <AuthHeading
          eyebrow={isVerified ? "Email verified" : "One last step"}
          title={
            isVerified
              ? "Your archive is ready"
              : hasError
                ? "That link didn’t work"
                : "Check your inbox"
          }
          description={
            isVerified
              ? "Your email address is confirmed. You can continue to your Life Replay archive."
              : hasError
                ? "The verification link may have expired or already been used. Request a fresh link below."
                : "We sent a verification link when you created your account. Open it to verify your address. If it hasn’t arrived, you can request another below."
          }
        />

        {isVerified ? (
          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal px-6 text-base font-semibold text-background transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Continue to your archive
          </Link>
        ) : (
          <>
            <VerifyEmailForm />
            <AuthSwitch
              prompt="Already verified?"
              label="Sign in"
              href="/login"
            />
          </>
        )}
      </div>
    </AuthShell>
  );
}
