import type { MomentCategory } from "@/types/moment";

export type NewMoment = {
  title: string;
  description: string | null;
  category: MomentCategory;
  occurredAt: Date;
  image: File | null;
};

/**
 * MOCK: nothing is stored yet, so new moments won't appear on the timeline.
 *
 * Replace with:
 *   1. If `image` is set, upload it to Cloudinary and keep `secure_url` and
 *      `public_id`.
 *   2. const [row] = await db.insert(moments)
 *        .values({ userId, title, description, category, occurredAt,
 *                  imageUrl, imagePublicId })
 *        .returning({ id: moments.id });
 *   3. If the insert throws after an upload, delete the uploaded image so no
 *      orphan is left behind.
 */
export async function insertMoment(
  userId: string,
  input: NewMoment,
): Promise<{ id: string }> {
  void userId;
  void input;
  return { id: crypto.randomUUID() };
}
