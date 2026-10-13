"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormAlert } from "@/components/auth/form-alert";
import { PasswordField } from "@/components/auth/password-field";
import { PasswordStrength } from "@/components/auth/password-strength";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  GENERIC_ERROR,
  changePassword,
  type ActionResult,
} from "@/features/profile/profile-actions";
import { changePasswordSchema, type ChangePasswordInput } from "@/schemas/profile";

const EMPTY: ChangePasswordInput = { currentPassword: "", newPassword: "", confirmPassword: "" };

/** Reuses the auth screens' password field and strength hint so both feel identical. */
export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
  });

  const newPassword = useWatch({ control, name: "newPassword" });

  function onValid(values: ChangePasswordInput) {
    setFormError(null);

    startTransition(async () => {
      let result: ActionResult;
      try {
        result = await changePassword(values);
      } catch {
        setFormError(GENERIC_ERROR);
        return;
      }

      if (!result.ok) {
        const fieldErrors = result.fieldErrors ?? {};
        if (fieldErrors.currentPassword) {
          setError("currentPassword", { message: fieldErrors.currentPassword });
        }
        if (fieldErrors.newPassword) setError("newPassword", { message: fieldErrors.newPassword });
        if (Object.keys(fieldErrors).length === 0) setFormError(result.message);
        return;
      }

      reset(EMPTY);
      toast.success("Password changed");
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
      aria-busy={isPending}
      className="flex max-w-md flex-col gap-5"
    >
      {formError && <FormAlert>{formError}</FormAlert>}

      <fieldset disabled={isPending} className="contents">
        <PasswordField
          label="Current password"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />

        <div className="flex flex-col gap-3">
          <PasswordField
            label="New password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <PasswordStrength password={newPassword} />
        </div>

        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <SubmitButton pending={isPending} pendingLabel="Updating password…">
          Update password
        </SubmitButton>
      </fieldset>
    </form>
  );
}
