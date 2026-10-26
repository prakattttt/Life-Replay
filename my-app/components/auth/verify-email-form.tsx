"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { resendVerificationEmail } from "@/actions/auth-action";
import {
  GENERIC_AUTH_ERROR,
  type AuthResult,
} from "@/features/auth/auth-helper";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth";
import { FormAlert } from "./form-alert";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

export function VerifyEmailForm() {
  const [isPending, startTransition] = useTransition();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onValid(values: ForgotPasswordInput) {
    setFormError(null);
    setSentTo(null);

    startTransition(async () => {
      let result: AuthResult;
      try {
        result = await resendVerificationEmail(values.email);
      } catch {
        setFormError(GENERIC_AUTH_ERROR);
        return;
      }

      if (!result.ok) {
        if (result.fieldErrors?.email) {
          setError("email", { message: result.fieldErrors.email });
        } else {
          setFormError(result.message);
        }
        return;
      }

      setSentTo(values.email);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {formError && <FormAlert>{formError}</FormAlert>}

      {sentTo && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-teal/20 bg-teal-subtle p-4 text-sm leading-relaxed text-foreground"
        >
          <MailCheck className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden />
          <p>
            If <strong className="break-all">{sentTo}</strong> has an account
            that still needs verification, a link is on its way. Check your spam
            folder too.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onValid)}
        noValidate
        aria-busy={isPending}
        className="flex flex-col gap-5"
      >
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
            Send verification link
          </SubmitButton>
        </fieldset>
      </form>
    </div>
  );
}
