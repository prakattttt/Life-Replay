import { format } from "date-fns";
import type { Moment } from "@/types/moment";

export type DayGroup = {
  /** yyyy-MM-dd, used for anchors and React keys */
  key: string;
  date: Date;
  moments: Moment[];
};

/** Groups moments (already sorted newest-first) by calendar day. */
export function groupMomentsByDay(moments: Moment[]): DayGroup[] {
  const groups: DayGroup[] = [];

  for (const moment of moments) {
    const key = moment.occurredOn ?? format(moment.occurredAt, "yyyy-MM-dd");
    const last = groups[groups.length - 1];

    if (last?.key === key) {
      last.moments.push(moment);
    } else {
      const [year, month, day] = key.split("-").map(Number);
      const date = moment.occurredOn
        ? new Date(year, month - 1, day)
        : moment.occurredAt;
      groups.push({ key, date, moments: [moment] });
    }
  }

  return groups;
}
