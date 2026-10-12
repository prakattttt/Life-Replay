export type AuthResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      code?: string;
      fieldErrors?: Partial<Record<string, string>>;
    };

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD:
    "That email and password don’t match. Please try again.",
  USER_ALREADY_EXISTS:
    "An account with this email already exists. Try signing in instead.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "An account with this email already exists. Try signing in instead.",
  EMAIL_NOT_VERIFIED: "Please verify your email address before signing in.",
  INVALID_TOKEN: "This reset link is no longer valid. Request a new one.",
  PASSWORD_TOO_SHORT: "That password is too short.",
  PASSWORD_TOO_LONG: "That password is too long.",
};

export const GENERIC_AUTH_ERROR =
  "Something went wrong. Please try again in a moment.";

export function friendlyAuthMessage(code?: string | null): string {
  return (code && AUTH_ERROR_MESSAGES[code]) || GENERIC_AUTH_ERROR;
}

export function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;

  if ("code" in error && typeof error.code === "string") return error.code;

  if (
    "body" in error &&
    error.body !== null &&
    typeof error.body === "object" &&
    "code" in error.body &&
    typeof error.body.code === "string"
  ) {
    return error.body.code;
  }

  return undefined;
}

export function getErrorMessage(error: unknown): string {
  return friendlyAuthMessage(getErrorCode(error));
}
