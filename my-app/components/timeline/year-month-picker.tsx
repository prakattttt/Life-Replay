import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/app/lib/utils";
import { buildTimelineHref, type TimelineQuery } from "@/features/timeline/params";

type YearMonthPickerProps = {
  query: TimelineQuery;
  years: number[];
  monthCounts: number[];
  now: Date;
  /** "inline" sits in the desktop bar, "sheet" fills the mobile bottom sheet. */
  layout: "inline" | "sheet";
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal";

export function YearMonthPicker({
  query,
  years,
  monthCounts,
  now,
  layout,
}: YearMonthPickerProps) {
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  const isSheet = layout === "sheet";

  return (
    <div
      className={cn(
        "flex gap-4",
        isSheet ? "flex-col gap-6" : "flex-wrap items-center justify-between",
      )}
    >
      <nav aria-label="Select year" className="flex flex-col gap-2">
        {isSheet && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
            Year
          </p>
        )}
        <ul className="inline-flex gap-1 self-start rounded-full bg-background-secondary p-1">
          {years.map((year) => {
            const selected = year === query.year;
            // Switching to the current year can't land on a future month.
            const month =
              year === nowYear ? Math.min(query.month, nowMonth) : query.month;

            return (
              <li key={year}>
                <Link
                  href={buildTimelineHref({ ...query, year, month, page: 1 })}
                  scroll={false}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "inline-flex min-h-11 min-w-16 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors",
                    focusRing,
                    selected
                      ? "bg-teal text-background"
                      : "text-foreground-secondary hover:bg-surface",
                  )}
                >
                  {year}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav aria-label="Select month" className="flex flex-col gap-2">
        {isSheet && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
            Month
          </p>
        )}
        <ol
          className={cn(
            isSheet ? "grid grid-cols-4 gap-2" : "flex flex-wrap gap-1",
          )}
        >
          {monthCounts.map((count, index) => {
            const month = index + 1;
            const selected = month === query.month;
            const isFuture = query.year === nowYear && month > nowMonth;
            const date = new Date(query.year, index, 1);
            const base =
              "inline-flex min-h-11 w-full min-w-12 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors";

            return (
              <li key={month}>
                {isFuture ? (
                  // Nothing to open yet, so it isn't exposed as a control.
                  <span
                    aria-hidden
                    className={cn(base, "text-foreground-disabled")}
                  >
                    {format(date, "MMM")}
                  </span>
                ) : (
                  <Link
                    href={buildTimelineHref({ ...query, month, page: 1 })}
                    scroll={false}
                    aria-current={selected ? "true" : undefined}
                    aria-label={`${format(date, "MMMM yyyy")}, ${count} ${
                      count === 1 ? "moment" : "moments"
                    }`}
                    className={cn(
                      base,
                      focusRing,
                      selected
                        ? "bg-teal text-background"
                        : count === 0
                          ? "text-foreground-muted hover:bg-background-secondary"
                          : "text-foreground hover:bg-background-secondary",
                    )}
                  >
                    {format(date, "MMM")}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
