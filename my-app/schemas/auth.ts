import { z } from "zod";

/**
 * Form rules for the auth screens. These only make the UI feel instant;
 * Better Auth stays the real gate, so keep the length limits in step with
 * its config (its defaults are 8 and 128).
 */
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_NAME_LENGTH = 60;

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Enter your email address")
  .pipe(z.email("Enter a valid email address"));

const newPassword = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters`)
  .max(MAX_PASSWORD_LENGTH, `Use ${MAX_PASSWORD_LENGTH} characters or fewer`);

export const loginSchema = z.object({
  email,
  // No length rule here: the sign-in form never hints at password policy.
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.boolean(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tell us what to call you")
    .max(MAX_NAME_LENGTH, `Use ${MAX_NAME_LENGTH} characters or fewer`),
  email,
  password: newPassword,
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string().min(1, "Re-enter your new password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "The two passwords don’t match",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
