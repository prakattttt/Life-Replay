"use server";

import { revalidatePath } from "next/cache";
import { getSessionUserId } from "@/features/auth/session";
import { insertMoment } from "@/features/moments/mutations";
import { createMomentSchema } from "@/schemas/moment";

export type CreateMomentField =
  | "title"
  | "description"
  | "category"
  | "occurredAt"
  | "image";

export type CreateMomentResult =
  | { ok: true; id: string; occurredAt: string }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<CreateMomentField, string>>;
    };

const FIELDS: readonly string[] = [
  "title",
  "description",
  "category",
  "occurredAt",
] satisfies CreateMomentField[];

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Create a moment.
 */
export async function createMoment(formData: FormData): Promise<CreateMomentResult> {
  const userId = await getSessionUserId();
  if (!userId) {
    return { ok: false, message: "Your session has ended. Please sign in again." };
  }

  const parsed = createMomentSchema.safeParse({
    title: text(formData, "title").replace(/\s+/g, " "),
    description: text(formData, "description"),
    category: text(formData, "category"),
    occurredAt: text(formData, "occurredAt"),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<CreateMomentField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && FIELDS.includes(field)) {
        fieldErrors[field as CreateMomentField] ??= issue.message;
      }
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  // Images need a configured storage provider before they can be saved.
  const rawImage = formData.get("image");
  if (rawImage instanceof File && rawImage.size > 0) {
    const message = "Photo storage isn’t configured yet. Remove the photo to save this moment.";
    return { ok: false, message, fieldErrors: { image: message } };
  }

  const timezone = text(formData, "timezone") || "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
  } catch {
    return { ok: false, message: "Choose a valid timezone." };
  }

  // A new moment is always owned by the session user.
  try {
    const { title, description, category, occurredAt } = parsed.data;
    const { id } = await insertMoment(userId, {
      title,
      description: description === "" ? null : description,
      category,
      occurredAt: new Date(occurredAt),
      timezone,
    });

    revalidatePath("/dashboard");
    revalidatePath("/timeline");
    return { ok: true, id, occurredAt };
  } catch (error) {
    // Details stay in the server log; the user gets a plain message.
    console.error("createMoment failed", error);
    return { ok: false, message: "We couldn’t save that moment. Please try again." };
  }
}
