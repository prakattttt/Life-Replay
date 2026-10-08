import Link from "next/link";
import { format } from "date-fns";
import { CAPTURE_HREF } from "@/components/layout/nav-items";
import { MomentCard } from "@/components/moments/moment-card";
import type { Moment } from "@/types/moment";

export function TodaysMoments({
  moments,
  now,
}: {
  moments: Moment[];
  now: Date;
}) {
  return (
    <section
      aria-labelledby="todays-moments-heading"
      className="flex flex-col gap-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h2
            id="todays-moments-heading"
            className="text-xl font-bold text-foreground md:text-2xl"
          >
            Today’s Moments
          </h2>
          <span className="hidden text-xs font-bold uppercase tracking-widest text-foreground-muted sm:inline">
            {format(now, "MMM d, yyyy")}
          </span>
        </div>
        <p className="text-[13px] text-foreground-secondary">
          {moments.length} {moments.length === 1 ? "moment" : "moments"} kept
        </p>
      </div>

      {moments.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border-strong p-8">
          <p className="max-w-md text-sm leading-relaxed text-foreground-secondary">
            Nothing here yet today. Capture one small moment, a coffee or a
            finished task, and your timeline will begin to grow.
          </p>
          <Link
            href={CAPTURE_HREF}
            className="inline-flex min-h-11 items-center rounded-lg text-sm font-bold text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            Capture a moment
          </Link>
        </div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {moments.map((moment) => (
            <li key={moment.id} className="flex">
              <div className="flex-1">
                <MomentCard moment={moment} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
