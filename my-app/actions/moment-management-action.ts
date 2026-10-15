"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { configureCloudinary } from "@/app/lib/cloudinary";
import { getSessionUserId } from "@/features/auth/session";
import {
  deleteMoment as deleteOwnedMoment,
  hasOwnedMoment,
  updateMoment as updateOwnedMoment,
} from "@/features/moments/mutations";
import { createMomentSchema, validateImageFile } from "@/schemas/moment";

type MomentField = "title" | "description" | "category" | "occurredAt" | "image";

export type UpdateMomentResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Partial<Record<MomentField, string>> };

export type DeleteMomentResult = { ok: true } | { ok: false; message: string };

const EDITABLE_FIELDS = new Set(["title", "description", "category", "occurredAt"]);

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

async function destroyMomentImage(publicId: string): Promise<void> {
  const result = await configureCloudinary().uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary asset deletion failed: ${result.result}`);
  }
}

function revalidateMomentViews(momentId: string) {
  revalidatePath(`/moments/${momentId}`);
  revalidatePath("/moments");
  revalidatePath("/timeline");
  revalidatePath("/dashboard");
  revalidatePath("/on-this-day");
  revalidatePath("/search");
}

export async function updateMoment(formData: FormData): Promise<UpdateMomentResult> {
  const userId = await getSessionUserId();
  if (!userId) {
    return { ok: false, message: "Your session has ended. Please sign in again." };
  }

  const momentId = text(formData, "momentId");
  if (!z.uuid().safeParse(momentId).success) {
    return { ok: false, message: "That moment could not be found." };
  }

  const parsed = createMomentSchema.safeParse({
    title: text(formData, "title"),
    description: text(formData, "description"),
    category: text(formData, "category"),
    occurredAt: text(formData, "occurredAt"),
  });
  if (!parsed.success) {
    const fieldErrors: Partial<Record<MomentField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && EDITABLE_FIELDS.has(field)) {
        fieldErrors[field as MomentField] ??= issue.message;
      }
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  const timezone = text(formData, "timezone");
  if (!isValidTimezone(timezone)) {
    return { ok: false, message: "Choose a valid timezone." };
  }

  try {
    if (!(await hasOwnedMoment(userId, momentId))) {
      return { ok: false, message: "That moment could not be found." };
    }
  } catch (error) {
    console.error("moment ownership check failed", error);
    return { ok: false, message: "We couldn’t update that moment. Please try again." };
  }

  const rawImage = formData.get("image");
  const removeImage = text(formData, "removeImage") === "true";
  if (rawImage !== null && !(rawImage instanceof File)) {
    const message = "Choose a valid photo file.";
    return { ok: false, message, fieldErrors: { image: message } };
  }
  if (rawImage instanceof File && removeImage) {
    return { ok: false, message: "Choose a photo or remove the current one, not both." };
  }
  if (rawImage instanceof File) {
    const imageError = validateImageFile(rawImage);
    if (imageError) {
      return { ok: false, message: imageError, fieldErrors: { image: imageError } };
    }
  }

  let uploadedImage: { imageUrl: string; imagePublicId: string } | null = null;
  if (rawImage instanceof File) {
    try {
      const bytes = Buffer.from(await rawImage.arrayBuffer());
      const dataUri = `data:${rawImage.type};base64,${bytes.toString("base64")}`;
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

  try {
    const imageUpdate = uploadedImage
      ? { imageUrl: uploadedImage.imageUrl, imagePublicId: uploadedImage.imagePublicId }
      : removeImage
        ? { imageUrl: null, imagePublicId: null }
        : {};
    const updated = await updateOwnedMoment(userId, momentId, {
      ...parsed.data,
      description: parsed.data.description || null,
      occurredAt: new Date(parsed.data.occurredAt),
      timezone,
      ...imageUpdate,
    });

    if (!updated) {
      if (uploadedImage) {
        await destroyMomentImage(uploadedImage.imagePublicId).catch((error) => {
          console.error("failed to clean up unowned moment image", error);
        });
      }
      return { ok: false, message: "That moment could not be found." };
    }

    if (
      updated.previousImagePublicId &&
      (removeImage || uploadedImage) &&
      updated.previousImagePublicId !== uploadedImage?.imagePublicId
    ) {
      await destroyMomentImage(updated.previousImagePublicId).catch((error) => {
        console.error("failed to clean up replaced moment image", error);
      });
    }

    revalidateMomentViews(momentId);
    return { ok: true };
  } catch (error) {
    if (uploadedImage) {
      await destroyMomentImage(uploadedImage.imagePublicId).catch((cleanupError) => {
        console.error("failed to clean up uploaded moment image", cleanupError);
      });
    }
    console.error("updateMoment failed", error);
    return { ok: false, message: "We couldn’t update that moment. Please try again." };
  }
}

export async function deleteMoment(momentId: string): Promise<DeleteMomentResult> {
  const userId = await getSessionUserId();
  if (!userId) {
    return { ok: false, message: "Your session has ended. Please sign in again." };
  }
  if (!z.uuid().safeParse(momentId).success) {
    return { ok: false, message: "That moment could not be found." };
  }

  try {
    const deleted = await deleteOwnedMoment(userId, momentId);
    if (!deleted) return { ok: false, message: "That moment could not be found." };

    if (deleted.imagePublicId) {
      await destroyMomentImage(deleted.imagePublicId).catch((error) => {
        console.error("failed to delete removed moment image", error);
      });
    }

    revalidateMomentViews(momentId);
    return { ok: true };
  } catch (error) {
    console.error("deleteMoment failed", error);
    return { ok: false, message: "We couldn’t delete that moment. Please try again." };
  }
}