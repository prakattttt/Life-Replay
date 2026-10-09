import { format } from "date-fns";
import type { DayGroup } from "@/features/timeline/group";

type DayJumpProps = {
  groups: DayGroup[];
  monthLabel: string;
  total: number;
};

/**
 * Day navigation. A vertical rail on xl screens, a horizontal strip of day
 * chips below that.
 */
export function DayJump({ groups, monthLabel, total }: DayJumpProps) {
  return (
    <aside
      aria-label="Jump to day"
      className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start"
    >
      <div className="hidden flex-col gap-1 xl:flex">
        <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted">
          Selected chapter
        </p>
        <p className="text-2xl font-bold text-foreground">{monthLabel}</p>
        <p className="text-[13px] text-foreground-secondary">
          {total} {total === 1 ? "entry" : "entries"}
        </p>
      </div>

      <nav aria-label="Days in this month">
        <p className="mb-2 hidden text-[11px] font-bold uppercase tracking-widest text-foreground-muted xl:block">
          Jump to day
        </p>
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 xl:mx-0 xl:max-h-[50vh] xl:flex-col xl:gap-1 xl:overflow-y-auto xl:px-0">
          {groups.map((group) => (
            <li key={group.key} className="shrink-0">
              <a
                href={`#day-${group.key}`}
                className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-foreground-secondary transition-colors hover:bg-background-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal xl:border-transparent xl:bg-transparent"
              >
                {format(group.date, "EEE d")}
                <span className="text-xs font-bold text-foreground-muted">
                  {group.moments.length}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
