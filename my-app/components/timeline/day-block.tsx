import { format } from "date-fns";
import type { DayGroup } from "@/features/timeline/group";
import { MomentTimelineItem } from "./moment-timeline-item";

export function DayBlock({ group }: { group: DayGroup }) {
  const count = group.moments.length;
  const headingId = `day-${group.key}-heading`;

  return (
    <section
      id={`day-${group.key}`}
      aria-labelledby={headingId}
      // Leaves room for the sticky app header and filter bar when jumping here.
      className="flex scroll-mt-44 flex-col gap-4 md:scroll-mt-24"
    >
      <div className="flex flex-wrap items-center gap-3">
        <h3
          id={headingId}
          className="text-xl font-bold text-foreground md:text-2xl"
        >
          {format(group.date, "EEEE, MMM d")}
        </h3>
        <span className="rounded-full bg-background-secondary px-2.5 py-0.5 text-xs font-bold text-foreground-secondary">
          {count} {count === 1 ? "Moment" : "Moments"}
        </span>
      </div>

      <ol className="flex flex-col gap-4 md:gap-6">
        {group.moments.map((moment) => (
          <MomentTimelineItem key={moment.id} moment={moment} />
        ))}
      </ol>
    </section>
  );
}
