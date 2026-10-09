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
    const key = format(moment.occurredAt, "yyyy-MM-dd");
    const last = groups[groups.length - 1];

    if (last?.key === key) {
      last.moments.push(moment);
    } else {
      groups.push({ key, date: moment.occurredAt, moments: [moment] });
    }
  }

  return groups;
}
