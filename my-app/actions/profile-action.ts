"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { user } from "@/app/db/auth-schema";
import { configureCloudinary } from "@/app/lib/cloudinary";
import { db } from "@/app/lib/db";
import { getSessionUserId } from "@/features/auth/session";
import { AVATAR_TYPES, MAX_AVATAR_BYTES } from "@/schemas/profile";

export type ProfileAvatarResult =
  | { ok: true; imageUrl: string | null }
  | { ok: false; message: string; fieldErrors?: { image?: string } };

export async function updateProfileAvatar(
  formData: FormData,
): Promise<ProfileAvatarResult> {
  const userId = await getSessionUserId();
  if (!userId) return { ok: false, message: "Please sign in again." };

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return {
      ok: false,
      message: "Choose a valid photo file.",
      fieldErrors: { image: "Choose a valid photo file." },
    };
  }
  if (!(AVATAR_TYPES as readonly string[]).includes(file.type)) {
    return {
      ok: false,
      message: "Use a JPG, PNG or WebP image.",
      fieldErrors: { image: "Use a JPG, PNG or WebP image." },
    };
  }
  if (file.size === 0 || file.size > MAX_AVATAR_BYTES) {
    const message = file.size === 0
      ? "That photo looks empty."
      : "That photo is over 4 MB. Try a smaller one.";
    return { ok: false, message, fieldErrors: { image: message } };
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;
    const result = await configureCloudinary().uploader.upload(dataUri, {
      public_id: `life-replay/avatars/${userId}`,
      overwrite: true,
      invalidate: true,
      resource_type: "image",
    });

    await db
      .update(user)
      .set({ image: result.secure_url })
      .where(eq(user.id, userId));

    revalidatePath("/", "layout");
    return { ok: true, imageUrl: result.secure_url };
  } catch (error) {
    console.error("profile avatar upload failed", error);
    return { ok: false, message: "We couldn’t upload that photo. Please try again." };
  }
}

export async function removeProfileAvatar(): Promise<ProfileAvatarResult> {
  const userId = await getSessionUserId();
  if (!userId) return { ok: false, message: "Please sign in again." };

  try {
    await db.update(user).set({ image: null }).where(eq(user.id, userId));
  } catch (error) {
    console.error("profile avatar removal failed", error);
    return { ok: false, message: "We couldn’t remove that photo. Please try again." };
  }

  try {
    const result = await configureCloudinary().uploader.destroy(
      `life-replay/avatars/${userId}`,
      { resource_type: "image", invalidate: true },
    );
    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Cloudinary asset deletion failed: ${result.result}`);
    }
  } catch (error) {
    console.error("profile avatar cleanup failed", error);
  }

  revalidatePath("/", "layout");
  return { ok: true, imageUrl: null };
}