"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { signUpWithEmail } from "@/actions/auth-action";
import {
  GENERIC_AUTH_ERROR,
  type AuthResult,
} from "@/features/auth/auth-helper";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { FormAlert } from "./form-alert";
import { PasswordField } from "./password-field";
import { PasswordStrength } from "./password-strength";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const password = useWatch({ control, name: "password" });

  function onValid(values: RegisterInput) {
    setFormError(null);

    startTransition(async () => {
      let result: AuthResult;

      try {
        result = await signUpWithEmail(values);
      } catch {
        setFormError(GENERIC_AUTH_ERROR);
        return;
      }

      if (!result.ok) {
        const fieldErrors = result.fieldErrors ?? {};

        if (fieldErrors.name) {
          setError("name", { message: fieldErrors.name });
        }

        if (fieldErrors.email) {
          setError("email", { message: fieldErrors.email });
        }

        if (fieldErrors.password) {
          setError("password", { message: fieldErrors.password });
        }

        if (Object.keys(fieldErrors).length === 0) {
          setFormError(result.message);
        }

        return;
      }

      toast.success("Account created. Check your email to verify it.");
      router.push("/verify-email");
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
          label="Your name"
          autoComplete="name"
          placeholder="What should we call you?"
          error={errors.name?.message}
          {...register("name")}
        />

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

        <div className="flex flex-col gap-3">
          <PasswordField
            label="Password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrength password={password} />
        </div>

        <SubmitButton pending={isPending} pendingLabel="Creating your account…">
          Create account
        </SubmitButton>

        <p className="flex items-center justify-center gap-2 text-center text-sm text-foreground-muted">
          <Lock className="size-4 shrink-0" aria-hidden />
          Your moments are private. Only you can see them.
        </p>
      </fieldset>
    </form>
  );
}
