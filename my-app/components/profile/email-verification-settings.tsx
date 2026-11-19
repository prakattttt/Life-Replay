"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { FormAlert } from "@/components/auth/form-alert";
import { sendCurrentUserVerificationEmail } from "@/actions/auth-action";
import {
  GENERIC_AUTH_ERROR,
  type AuthResult,
} from "@/features/auth/auth-helper";

type EmailVerificationSettingsProps = {
  email: string;
  emailVerified: boolean;
};

export function EmailVerificationSettings({
  email,
  emailVerified,
}: EmailVerificationSettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSendVerificationEmail() {
    setError(null);
    setSent(false);

    startTransition(async () => {
      let result: AuthResult;
      try {
        result = await sendCurrentUserVerificationEmail();
      } catch {
        setError(GENERIC_AUTH_ERROR);
        return;
      }

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setSent(true);
    });
  }

  if (emailVerified) {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-teal/20 bg-teal-subtle p-4"
      >
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden />
        <div>
          <p className="font-semibold text-foreground">Email verified</p>
          <p className="mt-1 break-all text-sm text-foreground-secondary">{email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <div>
        <p className="break-all font-semibold text-foreground">{email}</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
          This address hasn’t been confirmed yet. We’ll send you a link to verify it.
        </p>
      </div>

      {error && <FormAlert>{error}</FormAlert>}

      {sent && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-teal/20 bg-teal-subtle p-4 text-sm leading-relaxed text-foreground"
        >
          <MailCheck className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden />
          <p>
            A verification link is on its way to <strong className="break-all">{email}</strong>.
            Check your inbox and spam folder.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSendVerificationEmail}
        disabled={isPending}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal px-5 text-sm font-semibold text-background transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
            Sending link…
          </>
        ) : sent ? (
          "Resend verification link"
        ) : (
          "Send verification link"
        )}
      </button>
    </div>
  );
}
