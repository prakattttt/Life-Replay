import { CalendarDays } from "lucide-react";

type MonthHeaderProps = {
  monthLabel: string;
  total: number;
};

/** Month title with a larger node that sits on the spine. */
export function MonthHeader({ monthLabel, total }: MonthHeaderProps) {
  return (
    <div className="relative flex items-end justify-between gap-4">
      <span
        aria-hidden
        className="absolute -left-12 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-teal text-background ring-4 ring-background md:-left-16"
      >
        <CalendarDays className="size-3.5" />
      </span>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-widest text-teal">
          Chronicle archive
        </p>
        <h2
          id="timeline-month-heading"
          className="text-[28px] font-bold leading-tight text-foreground md:text-[32px]"
        >
          {monthLabel}
        </h2>
      </div>

      <p className="pb-1 text-[13px] text-foreground-secondary">
        {total} {total === 1 ? "moment" : "moments"}
      </p>
    </div>
  );
}
