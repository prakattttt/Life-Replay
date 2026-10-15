import axios from "axios";
import { apiClient } from "@/lib/api-client";
import type { ChangePasswordInput, UpdateProfileInput } from "@/schemas/profile";
import type {
  ActionResult,
  ExportFormat,
  Settings,
} from "./types";

function actionResult(body: unknown): ActionResult {
  if (body && typeof body === "object" && "ok" in body) return body as ActionResult;
  return {
    ok: false,
    message: "The request could not be completed. Please try again.",
  };
}

async function sendJson(path: string, method: string, body?: unknown): Promise<ActionResult> {
  try {
    const response = await apiClient.request<unknown>({
      url: path,
      method,
      ...(body === undefined ? {} : { data: body }),
    });
    return actionResult(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) return actionResult(error.response.data);
    throw error;
  }
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
  try {
    await apiClient.post("/api/auth/sign-out");
    return { ok: true };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { ok: false, message: "We couldn’t sign you out. Please try again." };
    }
    throw error;
  }
}

export function deleteAccount(input: { confirmation: "DELETE"; password: string }): Promise<ActionResult> {
  return sendJson("/api/profile", "DELETE", input);
}

export async function downloadDataExport(input: {
  format: ExportFormat;
  includePhotos: boolean;
}): Promise<ActionResult> {
  try {
    const response = await apiClient.post<Blob>("/api/profile/export", input, {
      responseType: "blob",
    });
    const objectUrl = URL.createObjectURL(response.data);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = response.headers["content-disposition"]
      ?.match(/filename="([^"]+)"/)?.[1] ?? `life-replay-export.${input.format}`;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
    return { ok: true };
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response) throw error;

    const responseData = error.response.data;
    if (responseData instanceof Blob) {
      const body = await responseData.text();
      try {
        return actionResult(JSON.parse(body) as unknown);
      } catch {
        return actionResult(null);
      }
    }
    return actionResult(responseData);
  }
}