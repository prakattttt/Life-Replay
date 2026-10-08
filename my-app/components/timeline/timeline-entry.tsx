import Link from "next/link";
import { format } from "date-fns";
import { categoryMeta } from "@/components/moments/category";
import { CategoryBadge } from "@/components/moments/category-badge";
import { cn } from "@/app/lib/utils";
import type { Moment } from "@/types/moment";

/** One row on the vertical timeline: a category-coloured node plus a card. */
export function TimelineEntry({ moment }: { moment: Moment }) {
  return (
    <li className="relative pl-8 md:pl-10">
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-8 size-3 rounded-full ring-4 ring-background",
          categoryMeta[moment.category].dot,
        )}
      />

      <article className="relative flex flex-col gap-3 rounded-xl border border-border bg-surface p-6 shadow-subtle transition-colors focus-within:ring-2 focus-within:ring-teal/40 hover:border-border-strong md:p-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <time
            dateTime={moment.occurredAt.toISOString()}
            className="text-[15px] font-bold uppercase text-amber-dark"
          >
            {format(moment.occurredAt, "EEEE, MMM d")}
          </time>
          <span aria-hidden className="text-foreground-muted">
            •
          </span>
          <span className="text-[13px] text-foreground-secondary">
            {format(moment.occurredAt, "h:mm a")}
          </span>
          <CategoryBadge category={moment.category} className="ml-auto" />
        </div>

        <h3 className="text-[19px] font-bold leading-snug text-foreground">
          <Link
            href={`/moments/${moment.id}`}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
          >
            {moment.title}
          </Link>
        </h3>

        {moment.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground-secondary">
            {moment.description}
          </p>
        )}
      </article>
    </li>
  );
}
