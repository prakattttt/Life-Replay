import Link from "next/link";
import { format } from "date-fns";
import { TimelineEntry } from "@/components/timeline/timeline-entry";
import type { Moment } from "@/types/moment";

export function RecentMemories({
  moments,
  now,
}: {
  moments: Moment[];
  now: Date;
}) {
  if (moments.length === 0) return null;

  return (
    <section
      aria-labelledby="recent-memories-heading"
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="recent-memories-heading"
          className="text-xl font-bold text-foreground md:text-2xl"
        >
          Recent Memories
        </h2>
        <p className="text-[13px] text-foreground-secondary">
          Chronological trail • {format(now, "MMMM yyyy")}
        </p>
      </div>

      <div className="relative">
        {/* Vertical spine, centred under the 12px nodes. */}
        <span
          aria-hidden
          className="absolute bottom-0 left-1.5 top-0 w-px bg-border"
        />
        <ol className="flex flex-col gap-8">
          {moments.map((moment) => (
            <TimelineEntry key={moment.id} moment={moment} />
          ))}
        </ol>
      </div>

      <div className="flex justify-center">
        <Link
          href="/timeline"
          className="inline-flex min-h-11 items-center rounded-xl bg-background-secondary px-6 text-sm font-medium text-foreground transition-colors hover:bg-teal-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          View full timeline
        </Link>
      </div>
    </section>
  );
}
