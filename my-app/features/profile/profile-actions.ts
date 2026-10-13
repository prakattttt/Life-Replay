import type { ChangePasswordInput, UpdateProfileInput } from "@/schemas/profile";
import type { Settings } from "./mock-data";

/**
 * THE PLACE TO CONNECT YOUR OWN LOGIC.
 *
 * Every button on the profile and settings screens calls one of these
 * functions and nothing else. Replace each body with a call to your server
 * action (or re-export your action under the same name and signature).
 *
 * Contract: resolve to an `ActionResult`. Don't throw for expected failures
 * (wrong password, email taken). Return `{ ok: false, message }` and, for a
 * specific input, `fieldErrors: { email: "…" }` so the form can point at it.
 *
 * Right now each one waits briefly and reports success so you can click
 * through the UI. Nothing is stored.
 *
 * NOTE: this file has no "use server". If your real actions are server
 * actions, import them in the components instead, or have these call them.
 */

export type ActionResult =
  | { ok: true; message?: string }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<string, string>>;
    };

export const GENERIC_ERROR = "Something went wrong. Please try again in a moment.";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** DEMO ONLY: these values force an error so you can see the error states. */
const DEMO_WRONG_PASSWORD = "wrong-password";
const DEMO_TAKEN_EMAIL = "taken@example.com";

/** Name, email and an optional new photo (a File, already type- and size-checked in the UI). */
export async function updateProfile(
  input: UpdateProfileInput & { photo?: File | null; removePhoto?: boolean },
): Promise<ActionResult> {
  await wait(700);
  if (input.email === DEMO_TAKEN_EMAIL) {
    return {
      ok: false,
      message: "That email is already in use.",
      fieldErrors: { email: "This email belongs to another account" },
    };
  }
  return { ok: true };
}

export async function changePassword(input: ChangePasswordInput): Promise<ActionResult> {
  await wait(800);
  if (input.currentPassword === DEMO_WRONG_PASSWORD) {
    return {
      ok: false,
      message: "That isn’t your current password.",
      fieldErrors: { currentPassword: "That isn’t your current password" },
    };
  }
  return { ok: true };
}

/** End this device's session. The UI sends the user to /login afterwards. */
export async function signOut(): Promise<ActionResult> {
  await wait(400);
  return { ok: true };
}

/** End every session except the current one. */
export async function signOutOtherDevices(): Promise<ActionResult> {
  await wait(600);
  return { ok: true };
}

/** Permanently delete the account and everything in it. The UI sends the user to /login. */
export async function deleteAccount(): Promise<ActionResult> {
  await wait(1000);
  return { ok: true };
}

/** Save a slice of settings. Pass only what changed. */
export async function updateSettings(patch: {
  notifications?: Partial<Settings["notifications"]>;
  privacy?: Partial<Settings["privacy"]>;
}): Promise<ActionResult> {
  void patch;
  await wait(350);
  return { ok: true };
}

export type ExportFormat = "json" | "csv";

/** Start a data export. The UI tells the user it will arrive by email. */
export async function requestDataExport(input: {
  format: ExportFormat;
  includePhotos: boolean;
}): Promise<ActionResult> {
  void input;
  await wait(900);
  return { ok: true };
}
