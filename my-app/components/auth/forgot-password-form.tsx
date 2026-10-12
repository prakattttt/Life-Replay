"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import { requestPasswordReset } from "@/actions/auth-action";
import { GENERIC_AUTH_ERROR, type AuthResult } from "@/features/auth/auth-helper";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth";
import { AuthHeading } from "./auth-heading";
import { FormAlert } from "./form-alert";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

/**
 * Asks for an email, then swaps itself for a "check your inbox" message. The
 * message is the same whether or not the address has an account, so it can't
 * be used to find out who is registered.
 */
export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onValid(values: ForgotPasswordInput) {
    setFormError(null);

    startTransition(async () => {
      let result: AuthResult;
      try {
        result = await requestPasswordReset(values);
      } catch {
        setFormError(GENERIC_AUTH_ERROR);
        return;
      }

      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      setSentTo(values.email);
    });
  }

  if (sentTo) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <span className="grid size-14 place-items-center rounded-2xl bg-teal-light text-teal">
            <MailCheck className="size-7" aria-hidden />
          </span>
          <div role="status">
            <AuthHeading
              eyebrow="Check your inbox"
              title="A reset link is on its way"
              description={
                <>
                  If an account exists for{" "}
                  <strong className="break-all font-semibold text-foreground">{sentTo}</strong>,
                  you’ll get an email with a link to choose a new password. It can take a
                  minute, and it’s worth a look in spam.
                </>
              }
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => {
              reset({ email: sentTo });
              setSentTo(null);
            }}
            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-bold text-teal hover:text-teal-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            Use a different email
          </button>
          <BackToSignIn href="/login" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading
        eyebrow="Forgot your password?"
        title="Let’s get you back in"
        description="Enter the email you signed up with and we’ll send you a link to choose a new password."
      />

      <form
        onSubmit={handleSubmit(onValid)}
        noValidate
        aria-busy={isPending}
        className="flex flex-col gap-5"
      >
        {formError && <FormAlert>{formError}</FormAlert>}

        <fieldset disabled={isPending} className="contents">
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <SubmitButton pending={isPending} pendingLabel="Sending link…">
            Send reset link
          </SubmitButton>
        </fieldset>
      </form>

      <div className="flex justify-center">
        <BackToSignIn href="/login" />
      </div>
    </div>
  );
}

function BackToSignIn({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-foreground-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
    >
      <ArrowLeft className="size-4" aria-hidden />
      Back to sign in
    </Link>
  );
}
