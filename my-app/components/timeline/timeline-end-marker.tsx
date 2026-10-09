import Link from "next/link";
import { format, subMonths } from "date-fns";
import { buildTimelineHref, type TimelineQuery } from "@/features/timeline/params";

type TimelineEndMarkerProps = {
  query: TimelineQuery;
  hasMore: boolean;
  nextBatchSize: number;
};

const linkClass =
  "inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-teal transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal";

/**
 * Bottom of the stream: either "load more" (more moments in this month) or a
 * quiet ending that leads on to the previous month.
 */
export function TimelineEndMarker({
  query,
  hasMore,
  nextBatchSize,
}: TimelineEndMarkerProps) {
  const monthStart = new Date(query.year, query.month - 1, 1);
  const previous = subMonths(monthStart, 1);

  return (
    <div className="relative flex flex-col items-start gap-3 pb-4">
      <span
        aria-hidden
        className="absolute -left-10.5 top-3 size-4 rounded-full border-2 border-border-strong bg-background md:-left-14.5"
      />

      {hasMore ? (
        <>
          <p className="pt-2 text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
            Earlier in {format(monthStart, "MMMM")} • more entries
          </p>
          <Link
            href={buildTimelineHref({ ...query, page: query.page + 1 })}
            scroll={false}
            className={linkClass}
          >
            Fetch {nextBatchSize} older {nextBatchSize === 1 ? "moment" : "moments"}
          </Link>
        </>
      ) : (
        <>
          <p className="pt-2 text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
            Chronicle paused
          </p>
          <Link
            href={buildTimelineHref({
              ...query,
              year: previous.getFullYear(),
              month: previous.getMonth() + 1,
              page: 1,
            })}
            className={linkClass}
          >
            Continue to {format(previous, "MMMM yyyy")}
          </Link>
        </>
      )}
    </div>
  );
}
