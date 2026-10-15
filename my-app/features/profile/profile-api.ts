import type { ChangePasswordInput, UpdateProfileInput } from "@/schemas/profile";
import type {
  ActionResult,
  ExportFormat,
  ProfileData,
  Settings,
} from "./types";

async function actionResult(response: Response): Promise<ActionResult> {
  const body = (await response.json().catch(() => null)) as ActionResult | null;
  if (body && "ok" in body) return body;
  return {
    ok: false,
    message: "The request could not be completed. Please try again.",
  };
}

async function sendJson(path: string, method: string, body?: unknown): Promise<ActionResult> {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return actionResult(response);
}

export async function fetchProfileData(): Promise<ProfileData> {
  const response = await fetch("/api/profile", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load your profile.");
  const data = (await response.json()) as Omit<ProfileData, "profile"> & {
    profile: Omit<ProfileData["profile"], "createdAt"> & { createdAt: string };
  };
  return {
    ...data,
    profile: { ...data.profile, createdAt: new Date(data.profile.createdAt) },
  };
}

export function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  return sendJson("/api/profile", "PATCH", input);
}

export function updateSettings(patch: {
  notifications?: Partial<Settings["notifications"]>;
  privacy?: Partial<Settings["privacy"]>;
}): Promise<ActionResult> {
  return sendJson("/api/profile/settings", "PATCH", patch);
}

export function changePassword(input: ChangePasswordInput): Promise<ActionResult> {
  return sendJson("/api/profile/password", "POST", input);
}

export function signOutOtherDevices(): Promise<ActionResult> {
  return sendJson("/api/profile/sessions", "DELETE");
}

export async function signOutSession(): Promise<ActionResult> {
  const response = await fetch("/api/auth/sign-out", { method: "POST" });
  if (!response.ok) {
    return { ok: false, message: "We couldn’t sign you out. Please try again." };
  }
  return { ok: true };
}

export function deleteAccount(input: { confirmation: "DELETE"; password: string }): Promise<ActionResult> {
  return sendJson("/api/profile", "DELETE", input);
}

export async function downloadDataExport(input: {
  format: ExportFormat;
  includePhotos: boolean;
}): Promise<ActionResult> {
  const response = await fetch("/api/profile/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) return actionResult(response);

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = response.headers
    .get("Content-Disposition")
    ?.match(/filename="([^"]+)"/)?.[1] ?? `life-replay-export.${input.format}`;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
  return { ok: true };
}