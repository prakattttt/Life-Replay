"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, LinkIcon } from "lucide-react";
import { resetPasswordWithToken } from "@/actions/auth-action";
import { GENERIC_AUTH_ERROR, type AuthResult } from "@/features/auth/auth-helper";
import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth";
import { AuthHeading } from "./auth-heading";
import { FormAlert } from "./form-alert";
import { PasswordField } from "./password-field";
import { PasswordStrength } from "./password-strength";
import { SubmitButton } from "./submit-button";

type ResetPasswordFormProps = {
  /** The `?token=` from the emailed link. Null when it is missing or already marked invalid. */
  token: string | null;
  signInHref: string;
  forgotHref: string;
};

const primaryLinkClass =
  "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-teal px-5 text-base font-semibold text-background transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Three states in one place: a bad or missing link, the new-password form, and
 * the "all done" confirmation.
 */
export function ResetPasswordForm({ token, signInHref, forgotHref }: ResetPasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [linkExpired, setLinkExpired] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = useWatch({control, name: "password"});

  function onValid(values: ResetPasswordInput) {
    if (!token) return;
    setFormError(null);

    startTransition(async () => {
      let result: AuthResult;
      try {
        result = await resetPasswordWithToken({ token, password: values.password });
      } catch {
        setFormError(GENERIC_AUTH_ERROR);
        return;
      }

      if (!result.ok) {
        // Tokens can expire between the page opening and the submit.
        if (result.code === "INVALID_TOKEN") setLinkExpired(true);
        else setFormError(result.message);
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6" role="status">
          <span className="grid size-14 place-items-center rounded-2xl bg-teal-light text-teal">
            <CircleCheck className="size-7" aria-hidden />
          </span>
          <AuthHeading
            eyebrow="All set"
            title="Your password is updated"
            description="You can sign in with your new password now."
          />
        </div>
        <Link href={signInHref} className={primaryLinkClass}>
          Continue to sign in
        </Link>
      </div>
    );
  }

  if (!token || linkExpired) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <span className="grid size-14 place-items-center rounded-2xl bg-amber-light text-amber-dark">
            <LinkIcon className="size-7" aria-hidden />
          </span>
          <AuthHeading
            eyebrow="Link expired"
            title="This reset link can’t be used"
            description="Reset links work once and expire after a short while. Request a fresh one and we’ll email it right away."
          />
        </div>
        <Link href={forgotHref} className={primaryLinkClass}>
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading
        eyebrow="Reset password"
        title="Choose a new password"
        description="Pick something you haven’t used elsewhere. You’ll use it the next time you sign in."
      />

      <form
        onSubmit={handleSubmit(onValid)}
        noValidate
        aria-busy={isPending}
        className="flex flex-col gap-5"
      >
        {formError && <FormAlert>{formError}</FormAlert>}

        <fieldset disabled={isPending} className="contents">
          <div className="flex flex-col gap-3">
            <PasswordField
              label="New password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register("password")}
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordField
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="Type it once more"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <SubmitButton pending={isPending} pendingLabel="Updating password…">
            Update password
          </SubmitButton>
        </fieldset>
      </form>
    </div>
  );
}
