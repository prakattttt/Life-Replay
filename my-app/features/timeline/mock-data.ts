import { setHours, setMinutes, startOfDay, subDays } from "date-fns";
import {
  MOMENT_CATEGORIES,
  type Moment,
  type MomentCategory,
} from "@/types/moment";

/**
 * TEMPORARY MOCK DATASET: about four years of moments, relative to today.
 * Deterministic (no Math.random) so server and client always agree.
 * Delete this file when `queries.ts` talks to Drizzle.
 */

// TODO: replace with `session.user.id` from Better Auth.
export const MOCK_USER_ID = "mock-user";

type Seed = { title: string; description: string };

const SEEDS: Record<MomentCategory, Seed[]> = {
  work: [
    {
      title: "Shipped the memory timeline prototype with smooth scroll",
      description:
        "Deployed the release candidate and tested responsiveness on the studio display. Moving between months with the arrow keys gives the whole thing a physical pacing.",
    },
    {
      title: "Finally closed the quarterly planning document",
      description:
        "Three weeks of drafts collapsed into six clear pages. The relief of deleting an entire section that no longer mattered.",
    },
    {
      title: "First review with the new team went better than expected",
      description:
        "Fewer slides, more conversation. Someone said the draft felt calm, which is the best compliment a draft can get.",
    },
  ],
  food: [
    {
      title: "Lunch at the cedar table, talking about moving cities",
      description:
        "Warm bread, salted butter and roasted squash soup. We sketched neighborhoods on a napkin and ate far too slowly.",
    },
    {
      title: "Rainy morning coffee while finishing the first chapter",
      description:
        "Steam on the windows and quiet piano in the background. The sentence that had been stuck for a week finally arrived.",
    },
    {
      title: "Cooked dinner from scratch for the first time in months",
      description:
        "Slow onions, a pot of lentils, no phone on the counter. The kitchen smelled like the whole evening.",
    },
  ],
  music: [
    {
      title: "Found an old vinyl copy of a favorite record in a back crate",
      description:
        "Tucked behind a stack of dusty sleeves. It spun that same night under the warm glow of the desk lamp.",
    },
    {
      title: "Evening concert that left the whole room silent afterwards",
      description:
        "The final movement shook the balcony floor. We sat in the bar across the street without talking for twenty minutes.",
    },
    {
      title: "Rediscovered a playlist from a summer long ago",
      description:
        "Every song carried a specific afternoon with it. Skipped nothing.",
    },
  ],
  fitness: [
    {
      title: "Crisp morning run along the canal as the fog lifted",
      description:
        "Cold air, steam rising off the water and golden light on the narrowboats. Steady pace the whole way.",
    },
    {
      title: "First swim of the season in the open lake",
      description:
        "Shockingly cold for about ninety seconds, then quiet. Walked home with wet hair and no plans.",
    },
    {
      title: "Long walk with no destination and no headphones",
      description:
        "Forty-five minutes of leaves, wind and half-formed thoughts becoming clear ones.",
    },
  ],
  learning: [
    {
      title: "Centering clay on the wheel for the very first time",
      description:
        "The instructor said to feel the weight in the palms rather than force the shape. Three collapsed bowls, one small upright cup.",
    },
    {
      title: "Finished the chapter that had been defeating me for a week",
      description:
        "It was a single missing idea, not a lack of effort. Wrote it out in my own words so it stays.",
    },
    {
      title: "Evening language class and a sentence I actually understood",
      description:
        "Ordered coffee entirely in the new language afterwards. The waiter pretended not to notice my pride.",
    },
  ],
  ideas: [
    {
      title: "A small idea on the train that I didn't want to lose",
      description:
        "Wrote it on the back of a ticket. It still feels simple and a little bit right.",
    },
    {
      title: "Sketched the layout of the future reading corner",
      description:
        "Slatted shelves, one good lamp, a chair facing the window. Immediately wanted to build it.",
    },
    {
      title: "Realized the project needs one fewer feature, not one more",
      description:
        "Crossed out an entire column of the plan. The page looked calmer at once.",
    },
  ],
  personal: [
    {
      title: "Watched the afternoon light move across the bookshelf",
      description:
        "No screens and no agenda for twenty minutes. The slatted shadows stretched slowly while dust floated in the warm room.",
    },
    {
      title: "Called an old friend and talked for two hours",
      description:
        "Started with a quick hello and ended with the whole history of the last year. Hung up smiling.",
    },
    {
      title: "Quiet Sunday with nothing scheduled at all",
      description:
        "Tea, an unhurried shower and a long nap. It felt like a small, deliberate act of repair.",
    },
  ],
  travel: [
    {
      title: "Missed the train and found a better café by accident",
      description:
        "An hour to spare in an unfamiliar town. The owner recommended a walk by the river that turned into the best part of the trip.",
    },
    {
      title: "Arrived somewhere new just as the evening lights came on",
      description:
        "Wheeled the bag through cobbled streets and smelled bread from an open door. Slightly lost, completely happy.",
    },
    {
      title: "Sunrise from a hillside on the last morning of the trip",
      description:
        "Woke early, climbed in the half dark, and watched the valley fill with light.",
    },
  ],
  other: [
    {
      title: "A small moment that did not belong anywhere else",
      description:
        "Nothing dramatic happened, and yet I didn't want the day to disappear without a trace.",
    },
    {
      title: "Found a handwritten note inside an old coat pocket",
      description:
        "Two lines in familiar handwriting. Put it back and then took it out again.",
    },
    {
      title: "Spent the evening sorting old photographs",
      description:
        "Every box opened another afternoon I had forgotten. Ended up with a pile worth keeping.",
    },
  ],
};

// Small deterministic hash (mulberry32 step) returning a float in [0, 1).
function hash(n: number): number {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const DAYS_OF_HISTORY = 1460;
let cache: { dayKey: number; moments: Moment[] } | null = null;

/** All mock moments, newest first. Cached per calendar day. */
export function getMockMoments(now: Date): Moment[] {
  const today = startOfDay(now);
  const dayKey = today.getTime();
  if (cache?.dayKey === dayKey) return cache.moments;

  const moments: Moment[] = [];

  for (let daysAgo = 0; daysAgo <= DAYS_OF_HISTORY; daysAgo++) {
    const roll = hash(daysAgo * 7 + 1);
    const count = roll < 0.55 ? 0 : roll < 0.8 ? 1 : roll < 0.93 ? 2 : 3;

    for (let index = 0; index < count; index++) {
      const category =
        MOMENT_CATEGORIES[
          Math.floor(hash(daysAgo * 13 + index * 5 + 2) * MOMENT_CATEGORIES.length)
        ];
      const seeds = SEEDS[category];
      const seed = seeds[Math.floor(hash(daysAgo * 17 + index * 3 + 4) * seeds.length)];
      const hour = 6 + Math.floor(hash(daysAgo * 19 + index + 6) * 16);
      const minute = Math.floor(hash(daysAgo * 23 + index + 8) * 12) * 5;
      const occurredAt = setMinutes(setHours(subDays(today, daysAgo), hour), minute);

      if (occurredAt > now) continue; // no memories from the future

      moments.push({
        id: `mock-${daysAgo}-${index}`,
        title: seed.title,
        description: seed.description,
        category,
        imageUrl: null,
        occurredAt,
      });
    }
  }

  moments.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
  cache = { dayKey, moments };
  return moments;
}
