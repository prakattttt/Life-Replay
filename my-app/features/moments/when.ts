import { format, isToday, isYesterday } from "date-fns";

/**
 * When a moment happened. "Just now" and "1 hour ago" are stored as an offset
 * and only turned into a real time at save, so leaving the page open for an
 * hour doesn't stamp the moment with a stale time.
 */
export type When =
  | { kind: "now" }
  | { kind: "offset"; minutes: number }
  /** `local` is a datetime-local value such as "2026-10-09T16:20". */
  | { kind: "custom"; local: string };

export const WHEN_PRESETS: { label: string; when: When }[] = [
  { label: "Just now", when: { kind: "now" } },
  { label: "1 hour ago", when: { kind: "offset", minutes: 60 } },
  { label: "Yesterday", when: { kind: "offset", minutes: 24 * 60 } },
];

export function isSameWhen(a: When, b: When): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "offset" && b.kind === "offset") return a.minutes === b.minutes;
  return true; // "now" matches "now"; any two "custom" count as the same chip
}

/** May return an Invalid Date when a custom value was cleared. */
export function resolveWhen(when: When, now: Date = new Date()): Date {
  switch (when.kind) {
    case "now":
      return now;
    case "offset":
      return new Date(now.getTime() - when.minutes * 60_000);
    case "custom":
      // "YYYY-MM-DDTHH:mm" without a zone is parsed as the user's local time.
      return new Date(when.local);
  }
}

/** ISO instant for the server, or "" when the time isn't valid (schema then reports it). */
export function whenToIso(when: When, now: Date = new Date()): string {
  const date = resolveWhen(when, now);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

/** Value format for <input type="datetime-local">. */
export function toLocalInputValue(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function describeWhen(when: When, now: Date = new Date()): string {
  if (when.kind === "now") return "Just now";

  const date = resolveWhen(when, now);
  if (Number.isNaN(date.getTime())) return "Pick a date and time";

  const day = isToday(date)
    ? "Today"
    : isYesterday(date)
      ? "Yesterday"
      : format(date, "EEE, MMM d");
  return `${day} · ${format(date, "h:mm a")}`;
}
