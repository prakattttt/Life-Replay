"use server";

import { revalidatePath } from "next/cache";
import { configureCloudinary } from "@/app/lib/cloudinary";
import { getSessionUserId } from "@/features/auth/session";
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

  const rawImage = formData.get("image");
  let imageFile: File | null = null;
  if (rawImage !== null) {
    if (!(rawImage instanceof File)) {
      const message = "Choose a valid photo file.";
      return { ok: false, message, fieldErrors: { image: message } };
    }

    const imageError = validateImageFile(rawImage);
    if (imageError) {
      return { ok: false, message: imageError, fieldErrors: { image: imageError } };
    }
    imageFile = rawImage;
  }

  const timezone = text(formData, "timezone") || "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
  } catch {
    return { ok: false, message: "Choose a valid timezone." };
  }

  let uploadedImage: { imageUrl: string; imagePublicId: string } | null = null;
  if (imageFile) {
    try {
      const bytes = Buffer.from(await imageFile.arrayBuffer());
      const dataUri = `data:${imageFile.type};base64,${bytes.toString("base64")}`;
      const result = await configureCloudinary().uploader.upload(dataUri, {
        folder: "life-replay/moments",
        resource_type: "image",
      });
      uploadedImage = {
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      };
    } catch (error) {
      console.error("moment image upload failed", error);
      const message = "We couldn’t upload that photo. Please try again.";
      return { ok: false, message, fieldErrors: { image: message } };
    }
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
      imageUrl: uploadedImage?.imageUrl ?? null,
      imagePublicId: uploadedImage?.imagePublicId ?? null,
    });

    revalidatePath("/dashboard");
    revalidatePath("/timeline");
    revalidatePath("/moments");
    return { ok: true, id, occurredAt };
  } catch (error) {
    if (uploadedImage) {
      try {
        const result = await configureCloudinary().uploader.destroy(
          uploadedImage.imagePublicId,
          { resource_type: "image", invalidate: true },
        );
        if (result.result !== "ok" && result.result !== "not found") {
          throw new Error(`Cloudinary asset deletion failed: ${result.result}`);
        }
      } catch (cleanupError) {
        console.error("failed to clean up moment image", cleanupError);
      }
    }

    // Details stay in the server log; the user gets a plain message.
    console.error("createMoment failed", error);
    return { ok: false, message: "We couldn’t save that moment. Please try again." };
  }
}
