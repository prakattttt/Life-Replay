import { z } from "zod";
import { MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/schemas/auth";

/**
 * Form rules for the profile screens. They only make the UI feel instant; your
 * server actions should validate again with the same schemas.
 */

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tell us what to call you")
    .max(MAX_NAME_LENGTH, `Use ${MAX_NAME_LENGTH} characters or fewer`),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email address")
    .pipe(z.email("Enter a valid email address")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters`)
      .max(MAX_PASSWORD_LENGTH, `Use ${MAX_PASSWORD_LENGTH} characters or fewer`),
    confirmPassword: z.string().min(1, "Re-enter your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "The two passwords don’t match",
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    message: "Choose a password you haven’t used just now",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

const notificationSettingsSchema = z.object({
  onThisDay: z.boolean().optional(),
  onThisDayTime: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  weeklyRecap: z.boolean().optional(),
});

const privacySettingsSchema = z.object({
  blurPhotos: z.boolean().optional(),
  discreetEmails: z.boolean().optional(),
});

export const settingsPatchSchema = z
  .object({
    notifications: notificationSettingsSchema.optional(),
    privacy: privacySettingsSchema.optional(),
  })
  .refine((settings) => Object.keys(settings).length > 0, {
    message: "Choose at least one setting to update.",
  });

export type SettingsPatch = z.infer<typeof settingsPatchSchema>;

export const exportRequestSchema = z.object({
  format: z.enum(["json", "csv"]),
  includePhotos: z.boolean(),
});

export const deleteAccountSchema = z.object({
  confirmation: z.literal("DELETE"),
  password: z.string().min(1, "Enter your password to confirm."),
});

/** Profile photo rules (client-side hint; check again on the server). */
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_AVATAR_BYTES = 4 * 1024 * 1024;
