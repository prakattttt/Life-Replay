import { z } from "zod";
import { MOMENT_CATEGORIES } from "@/types/moment";

export const MAX_TITLE_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 1000;

/** Forgives small clock differences between the browser and the server. */
const FUTURE_TOLERANCE_MS = 5 * 60 * 1000;
const EARLIEST_YEAR = 1970;

/** 
 * `occurredAt` is an ISO instant (UTC). The browser converts the user's local
 * time to an instant before sending, so the server never has to guess a
 * timezone for it.
 */

export const createMomentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give this moment a few words.")
    .max(
      MAX_TITLE_LENGTH,
      `Keep the headline under ${MAX_TITLE_LENGTH} characters. Longer thoughts fit in the impressions.`,
    ),
  description: z
    .string()
    .trim()
    .max(
      MAX_DESCRIPTION_LENGTH,
      `Keep impressions under ${MAX_DESCRIPTION_LENGTH} characters.`,
    ),
  category: z.enum(MOMENT_CATEGORIES),
  occurredAt: z
    .string()
    .datetime({ message: "Choose a valid date and time." })
    .refine(
      (value) => Date.parse(value) <= Date.now() + FUTURE_TOLERANCE_MS,
      "A moment can’t be from the future.",
    )
    .refine(
      (value) => new Date(value).getUTCFullYear() >= EARLIEST_YEAR,
      "Choose a more recent date.",
    ),
});

export type CreateMomentInput = z.infer<typeof createMomentSchema>;

// ---------------------------------------------------------------- images ---

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/** Largest image the server accepts. */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/**
 * Largest original the browser will try to shrink. Phone photos are often
 * 5–10 MB, so we accept big originals and downscale them before upload.
 */

export const MAX_PICKED_IMAGE_BYTES = 25 * 1024 * 1024;

/** Returns a user-facing problem, or null when the file is acceptable. */
export function validateImageFile(
  file: Pick<File, "type" | "size">,
  maxBytes: number = MAX_IMAGE_BYTES,
): string | null {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Use a JPG, PNG or WebP photo.";
  }
  if (file.size === 0) return "That file looks empty.";
  if (file.size > maxBytes) {
    return `That photo is too large. Keep it under ${Math.round(maxBytes / 1024 / 1024)} MB.`;
  }
  return null;
}
