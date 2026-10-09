import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/app/lib/utils";
import { categoryMeta } from "@/components/moments/category";
import { CategoryBadge } from "@/components/moments/category-badge";
import { MomentImage } from "@/components/moments/moment-image";
import type { Moment } from "@/types/moment";

/**
 * One moment on the timeline: a category-coloured node on the spine plus a
 * card.
 */

export function MomentTimelineItem({ moment }: { moment: Moment }) {
  return (
    <li className="relative">
      <span
        aria-hidden
        className={cn(
          "absolute -left-10 top-7 size-3 rounded-full ring-4 ring-background md:-left-14",
          categoryMeta[moment.category].dot,
        )}
      />

      <article className="group relative flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-subtle transition-colors focus-within:ring-2 focus-within:ring-teal/40 hover:border-border-strong md:p-6">
        {moment.imageUrl && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <MomentImage
              src={moment.imageUrl}
              alt=""
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 560px, 90vw"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <time
            dateTime={moment.occurredAt.toISOString()}
            className="text-xs font-bold text-foreground-muted"
          >
            {format(moment.occurredAt, "h:mm a")}
          </time>
          <CategoryBadge category={moment.category} />
        </div>

        <h4 className="text-[19px] font-bold leading-snug text-foreground">
          {/* Stretched link: whole card is clickable with a single tab stop. */}
          <Link
            href={`/moments/${moment.id}`}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
          >
            {moment.title}
          </Link>
        </h4>

        {moment.description && (
          <p className="line-clamp-3 text-[15px] leading-relaxed text-foreground-secondary">
            {moment.description}
          </p>
        )}

        <span
          aria-hidden
          className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-teal"
        >
          Open replay
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </article>
    </li>
  );
}
