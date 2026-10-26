"use server";

import { headers } from "next/headers";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from "@/schemas/auth";
import { forgotPasswordSchema } from "@/schemas/auth";
import {
  getErrorCode,
  getErrorMessage,
  type AuthResult,
  GENERIC_AUTH_ERROR,
} from "@/features/auth/auth-helper";
import { auth } from "@/app/lib/auth";
import { appUrl } from "@/app/lib/email";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/schemas/profile";

export async function signInWithEmail(input: LoginInput): Promise<AuthResult> {
  try {
    await auth.api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
        rememberMe: input.rememberMe,
      },
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      code: getErrorCode(error),
      message: getErrorMessage(error),
    };
  }
}

export async function signUpWithEmail(
  input: RegisterInput,
): Promise<AuthResult> {
  try {
    await auth.api.signUpEmail({
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
        callbackURL: appUrl("/verify-email?verified=1"),
      },
    });
    return { ok: true };
  } catch (error) {
    const code = getErrorCode(error);
    const isDuplicateEmail =
      code === "USER_ALREADY_EXISTS" ||
      code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL";

    return {
      ok: false,
      code,
      message: getErrorMessage(error),
      ...(isDuplicateEmail
        ? {
            fieldErrors: {
              email: "This email is already registered.",
            },
          }
        : {}),
    };
  }
}

export async function signOut(): Promise<AuthResult> {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      code: getErrorCode(error),
      message: GENERIC_AUTH_ERROR,
    };
  }
}

export async function updateUser(
  user: UpdateProfileInput,
): Promise<AuthResult> {
  const parsed = updateProfileSchema.safeParse(user);
  if (!parsed.success) {
    const issues = parsed.error.issues;
    const nameError = issues.find((issue) => issue.path[0] === "name")?.message;
    const emailError = issues.find(
      (issue) => issue.path[0] === "email",
    )?.message;
    return {
      ok: false,
      message: GENERIC_AUTH_ERROR,
      fieldErrors: {
        ...(nameError ? { name: nameError } : {}),
        ...(emailError ? { email: emailError } : {}),
      },
    };
  }

  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });
    if (!session) {
      return {
        ok: false,
        message: "Your session has expired. Please sign in again.",
      };
    }

    if (parsed.data.email !== session.user.email.trim().toLowerCase()) {
      return {
        ok: false,
        message: "Email changes are not available yet.",
        fieldErrors: {
          email:
            "Email changes require a verification flow that is not configured yet.",
        },
      };
    }

    await auth.api.updateUser({
      body: { name: parsed.data.name },
      headers: requestHeaders,
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      code: getErrorCode(error),
      message: GENERIC_AUTH_ERROR,
    };
  }
}

export async function resendVerificationEmail(email: string): Promise<AuthResult> {
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Enter a valid email address.",
      fieldErrors: { email: "Enter a valid email address." },
    };
  }

  try {
    await auth.api.sendVerificationEmail({
      body: {
        email: parsed.data.email,
        callbackURL: appUrl("/verify-email?verified=1"),
      },
    });

    return { ok: true };
  } catch (error) {
    console.error(
      "Failed to resend verification email",
      error instanceof Error ? error.message : "Unknown email error",
    );
    return {
      ok: false,
      code: getErrorCode(error),
      message: "We couldn’t send a verification email. Please try again.",
    };
  }
}

export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<AuthResult> {
  try {
    await auth.api.requestPasswordReset({
      body: {
        email: input.email,
        redirectTo: "/reset-password",
      },
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      code: getErrorCode(error),
      message: GENERIC_AUTH_ERROR,
    };
  }
}

export async function resetPasswordWithToken(input: {
  token: string;
  password: string;
}): Promise<AuthResult> {
  try {
    await auth.api.resetPassword({
      body: {
        newPassword: input.password,
        token: input.token,
      },
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      code: getErrorCode(error),
      message: getErrorMessage(error),
    };
  }
}
