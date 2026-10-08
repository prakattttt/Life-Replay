import { getDayOfYear } from "date-fns";

export type DayPeriod = "morning" | "afternoon" | "evening" | "night";

/**
 * NOTE: uses the server's timezone. Once user settings exist, pass a
 * date already shifted to the user's timezone.
 */
export function getDayPeriod(date: Date): DayPeriod {
  const hour = date.getHours();
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

export function getGreeting(date: Date): string {
  const period = getDayPeriod(date);
  return `Good ${period === "night" ? "evening" : period}`;
}

const PROMPTS = [
  "What happened today that you don’t want to forget?",
  "What made you smile unexpectedly this morning?",
  "What did you finish, big or small?",
  "What did you eat, hear, or read that you’d like to remember?",
  "Who did you spend time with today?",
  "What did you learn this week?",
  "What’s a small thing that went well today?",
];

/** Rotates daily so the prompt stays stable across reloads. */
export function getPromptOfTheDay(date: Date): string {
  return PROMPTS[getDayOfYear(date) % PROMPTS.length];
}
