"use server";

import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from "@/schemas/auth";
import {
  getErrorCode,
  getErrorMessage,
  type AuthResult,
  GENERIC_AUTH_ERROR,
} from "@/features/auth/auth-helper";
import { auth } from "@/app/lib/auth";

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
