/**
 * Placeholder data so the profile and settings screens render. Replace the two
 * functions with your own queries (scoped to the signed-in user) and keep the
 * return types, and the pages will not need to change.
 *
 * Wrap them in React's `cache()` when real: the profile layout and the page
 * both call `getProfile`, and `cache()` makes that a single query per request.
 */

export type Profile = {
  name: string;
  email: string;
  /** Avatar URL (Cloudinary later). Null shows initials. */
  imageUrl: string | null;
  createdAt: Date;
  momentCount: number;
  /** Date of the oldest moment, or null when the archive is empty. */
  firstMomentAt: Date | null;
};

export const NOTIFICATION_TIMES = [
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "20:00", label: "8:00 PM" },
] as const;

export type NotificationTime = (typeof NOTIFICATION_TIMES)[number]["value"];

export type Settings = {
  notifications: {
    /** Email when a past year has a moment from today. */
    onThisDay: boolean;
    onThisDayTime: NotificationTime;
    weeklyRecap: boolean;
  };
  privacy: {
    /** Photos stay blurred until tapped. */
    blurPhotos: boolean;
    /** Emails say "You have 2 memories from today" without showing any text. */
    discreetEmails: boolean;
  };
};

// TODO: replace with your query, e.g. db.query.user.findFirst({ where: eq(user.id, session.user.id) })
export async function getProfile(): Promise<Profile> {
  return {
    name: "Clara Jensen",
    email: "clara.jensen@archive.io",
    imageUrl: null,
    createdAt: new Date("2024-03-14T09:30:00Z"),
    momentCount: 1248,
    firstMomentAt: new Date("2022-01-09T18:12:00Z"),
  };
}

// TODO: replace with your settings query (one row per user is plenty).
export async function getSettings(): Promise<Settings> {
  return {
    notifications: { onThisDay: true, onThisDayTime: "08:00", weeklyRecap: false },
    privacy: { blurPhotos: false, discreetEmails: true },
  };
}
