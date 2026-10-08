import { setHours, setMinutes, subDays, subYears } from "date-fns";
import type { Moment } from "@/types/moment";

/**
 * TEMPORARY MOCK DATA.
 */

export type HomeData = {
  totalMoments: number;
  today: Moment[];
  onThisDay: {
    moment: Moment;
    yearsAgo: number;
    momentsThatDay: number;
  } | null;
  recent: Moment[];
};

export const mockUser = {
  name: "Clara Jensen",
  email: "clara.jensen@archive.io",
};

const at = (date: Date, hours: number, minutes: number) =>
  setMinutes(setHours(date, hours), minutes);

export async function getHomeData(now = new Date()): Promise<HomeData> {
  return {
    totalMoments: 1428,
    today: [
      {
        id: "mock-today-1",
        title: "Shipped the brand redesign after weeks of drafting",
        description:
          "Merged the main branch at noon. Quiet relief in the studio; celebrated with flat whites and handwritten thank-you notes for the typographers in Vienna.",
        category: "work",
        imageUrl: null,
        occurredAt: at(now, 11, 20),
      },
      {
        id: "mock-today-2",
        title: "First autumn brisk walk through Kensington Gardens",
        description:
          "Crisp 8°C air. Ground covered in copper beech leaves. Swans gliding through the serpentine mist. Took 45 minutes completely untethered from notifications.",
        category: "fitness",
        imageUrl: null,
        occurredAt: at(now, 7, 15),
      },
    ],
    onThisDay: {
      yearsAgo: 3,
      momentsThatDay: 3,
      moment: {
        id: "mock-otd-1",
        title:
          "Rainy morning coffee at Café Saint-Michel — finished writing the first chapter while listening to piano jazz.",
        description:
          "The smell of wet wool coats, chicory steam rising from the counter, and the rhythmic clicking of heels over wet flagstones. A decisive moment where the narrative finally clicked into place.",
        category: "food",
        imageUrl: null,
        occurredAt: at(subYears(now, 3), 8, 45),
      },
    },
    recent: [
      {
        id: "mock-recent-1",
        title: "Centering stoneware clay on the kick-wheel",
        description:
          "Instructor Tanaka emphasized feeling the gravity in the palms rather than forcing shape. Three cracked vessels before a small, balanced tea bowl stayed upright.",
        category: "learning",
        imageUrl: null,
        occurredAt: at(subDays(now, 2), 18, 30),
      },
      {
        id: "mock-recent-2",
        title: "Mahler’s 2nd Symphony with Julian and Maren",
        description:
          "The brass entry in the final movement shook the balcony floorboards. We sat in silence for a solid twenty minutes at the bar across the street afterwards, simply decompressing.",
        category: "music",
        imageUrl: null,
        occurredAt: at(subDays(now, 4), 21, 0),
      },
    ],
  };
}
