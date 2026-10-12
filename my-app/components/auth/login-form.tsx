"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmail } from "@/actions/auth-action";
import { GENERIC_AUTH_ERROR, type AuthResult } from "@/features/auth/auth-helper";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { FormAlert } from "./form-alert";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  function onValid(values: LoginInput) {
    setFormError(null);

    startTransition(async () => {
      let result: AuthResult;
      try {
        result = await signInWithEmail(values);
      } catch {
        setFormError(GENERIC_AUTH_ERROR);
        return;
      }

      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
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

        <div className="flex flex-col gap-1">
          <PasswordField
            label="Password"
            autoComplete="current-password"
            placeholder="Your password"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-semibold text-teal hover:text-teal-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <label className="-my-1 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-foreground-secondary">
          <input
            type="checkbox"
            className="size-5 rounded accent-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            {...register("rememberMe")}
          />
          Keep me signed in on this device
        </label>

        <SubmitButton pending={isPending} pendingLabel="Signing in…">
          Sign in
        </SubmitButton>
      </fieldset>
    </form>
  );
}
