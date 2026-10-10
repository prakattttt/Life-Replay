"use server";

import { revalidatePath } from "next/cache";
import { getSessionUserId } from "@/features/auth/session";
import { sniffImageType } from "@/features/moments/image";
import { insertMoment } from "@/features/moments/mutations";
import { createMomentSchema, validateImageFile } from "@/schemas/moment";

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
  // 1. Authenticate: identity comes from the session, never from the form.
  const userId = await getSessionUserId();
  if (!userId) {
    return { ok: false, message: "Your session has ended. Please sign in again." };
  }

  // 2. Validate on the server even though the browser already did.
  const parsed = createMomentSchema.safeParse({
    // A headline is one line: collapse any pasted line breaks.
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

  // 3. Optional photo: type and size, then the real file signature.
  let image: File | null = null;
  const rawImage = formData.get("image");
  if (rawImage instanceof File && rawImage.size > 0) {
    const problem = validateImageFile(rawImage);
    if (problem) return { ok: false, message: problem, fieldErrors: { image: problem } };

    const header = new Uint8Array(await rawImage.slice(0, 12).arrayBuffer());
    if (!sniffImageType(header)) {
      const message = "That file doesn’t look like a valid photo.";
      return { ok: false, message, fieldErrors: { image: message } };
    }
    image = rawImage;
  }

  // 4. Write. A new moment is always owned by the session user.
  try {
    const { title, description, category, occurredAt } = parsed.data;
    const { id } = await insertMoment(userId, {
      title,
      description: description === "" ? null : description,
      category,
      occurredAt: new Date(occurredAt),
      image,  
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
