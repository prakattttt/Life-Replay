import type { MomentCategory } from "@/types/moment";

/**
 * A small English keyword heuristic that pre-selects a category while the
 * user types, so most moments need zero taps for it. It is deliberately
 * simple and predictable (no AI), and the user can always override it.
 */
const KEYWORDS: Record<Exclude<MomentCategory, "other">, string[]> = {
  work: [
    "work", "meeting", "shipped", "ship", "launch", "launched", "deploy", "deployed",
    "client", "project", "deadline", "standup", "office", "presentation", "review",
    "release", "interview", "sprint", "merged", "pitch", "boss", "colleague",
  ],
  food: [
    "lunch", "dinner", "breakfast", "brunch", "coffee", "cooked", "cooking", "baked",
    "ate", "eat", "eating", "restaurant", "cafe", "café", "tea", "pizza", "bakery",
    "recipe", "dessert", "soup", "snack", "meal",
  ],
  music: [
    "song", "songs", "album", "concert", "vinyl", "playlist", "music", "gig", "band",
    "guitar", "piano", "listened", "symphony", "melody", "choir",
  ],
  fitness: [
    "run", "ran", "running", "gym", "workout", "swim", "swam", "yoga", "hike", "hiked",
    "walk", "walked", "cycling", "cycled", "lifted", "stretch", "jog", "jogged",
    "marathon", "5k", "10k",
  ],
  learning: [
    "learned", "learnt", "learning", "class", "course", "lesson", "read", "reading",
    "book", "study", "studied", "lecture", "tutorial", "practice", "practiced", "chapter",
  ],
  ideas: [
    "idea", "ideas", "thought", "sketch", "sketched", "brainstorm", "realized",
    "realised", "inspiration", "concept", "epiphany",
  ],
  personal: [
    "family", "friend", "friends", "birthday", "called", "mom", "dad", "sister",
    "brother", "grandma", "grandpa", "date", "anniversary", "wedding",
  ],
  travel: [
    "trip", "flight", "train", "airport", "hotel", "beach", "visited", "journey",
    "museum", "landed", "arrived", "station", "passport", "hostel", "roadtrip",
  ],
};

const LOOKUP = new Map<string, Exclude<MomentCategory, "other">>();
for (const [category, words] of Object.entries(KEYWORDS)) {
  for (const word of words) {
    if (!LOOKUP.has(word)) LOOKUP.set(word, category as Exclude<MomentCategory, "other">);
  }
}

/** Returns the best-matching category for a headline, or null if nothing matches. */
export function suggestCategory(title: string): MomentCategory | null {
  const words = title.toLowerCase().match(/[\p{L}\p{N}]+/gu);
  if (!words) return null;

  const scores = new Map<MomentCategory, number>();
  for (const word of words) {
    const category = LOOKUP.get(word);
    if (category) scores.set(category, (scores.get(category) ?? 0) + 1);
  }

  let best: MomentCategory | null = null;
  let bestScore = 0;
  // Map keeps insertion order, so ties go to whichever matched first.
  for (const [category, score] of scores) {
    if (score > bestScore) {
      best = category;
      bestScore = score;
    }
  }
  return best;
}
