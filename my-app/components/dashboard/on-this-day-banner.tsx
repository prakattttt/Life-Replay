import Link from "next/link";
import { ArrowRight, CalendarHeart } from "lucide-react";
import { format } from "date-fns";
import { CategoryBadge } from "@/components/moments/category-badge";
import { MomentImage } from "@/components/moments/moment-image";
import type { HomeData } from "@/features/home/mock-data";

type OnThisDayBannerProps = {
  data: HomeData["onThisDay"];
  now: Date;
};

export function OnThisDayBanner({ data, now }: OnThisDayBannerProps) {
  if (!data) {
    return (
      <section
        aria-labelledby="on-this-day-heading"
        className="flex flex-col items-start gap-3 rounded-2xl border border-border-subtle bg-background-section p-8"
      >
        <CalendarHeart className="size-6 text-amber" aria-hidden />
        <h2
          id="on-this-day-heading"
          className="text-xl font-bold text-foreground"
        >
          On This Day
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-foreground-secondary">
          Nothing from {format(now, "MMMM d")} yet. Keep capturing small
          moments, and next year this spot will bring today back to you.
        </p>
      </section>
    );
  }

  const { moment, yearsAgo, momentsThatDay } = data;

  return (
    <section
      aria-labelledby="on-this-day-heading"
      className="grid overflow-hidden rounded-2xl border border-border-subtle bg-background-section md:grid-cols-[1fr_minmax(0,320px)] xl:grid-cols-[1fr_minmax(0,404px)]"
    >
      <div className="flex flex-col gap-5 p-6 md:p-12">
        <div className="flex flex-col gap-1">
          <h2
            id="on-this-day-heading"
            className="text-xs font-bold uppercase tracking-widest text-amber-dark"
          >
            On this day • {format(now, "MMM d")}
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
            Resurfaced from {format(moment.occurredAt, "yyyy")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-amber-dark">
            {format(moment.occurredAt, "MMMM d, yyyy")} • Exactly {yearsAgo}{" "}
            {yearsAgo === 1 ? "year" : "years"} ago today
          </p>
          <blockquote className="text-balance text-xl font-bold leading-snug text-foreground md:text-[28px]">
            “{moment.title}”
          </blockquote>
          {moment.description && (
            <p className="line-clamp-4 max-w-prose text-[15px] leading-relaxed text-foreground-secondary">
              {moment.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-foreground-secondary">
          <CategoryBadge category={moment.category} />
          <span aria-hidden>•</span>
          <time dateTime={moment.occurredAt.toISOString()}>
            {format(moment.occurredAt, "h:mm a")}
          </time>
        </div>

        <Link
          href="/on-this-day"
          className="group inline-flex min-h-11 items-center gap-2 self-start rounded-lg text-sm font-bold text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          Replay this day ({momentsThatDay}{" "}
          {momentsThatDay === 1 ? "moment" : "moments"})
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>

      <div className="relative hidden min-h-64 md:block">
        <MomentImage
          src={moment.imageUrl}
          alt=""
          sizes="(min-width: 1280px) 404px, 320px"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-background-section via-transparent to-transparent"
        />
      </div>
    </section>
  );
}
