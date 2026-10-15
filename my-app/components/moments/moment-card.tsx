import Link from "next/link";
import type { Moment } from "@/types/moment";
import { CategoryBadge } from "./category-badge";
import { MomentImage } from "./moment-image";

export function MomentCard({ moment }: { moment: Moment }) {
  const timeLabel = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    ...(moment.timezone ? { timeZone: moment.timezone } : {}),
  }).format(moment.occurredAt);

  return (
    <article className="group relative flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-subtle transition-colors focus-within:ring-2 focus-within:ring-teal/40 hover:border-border-strong">
      {moment.imageUrl && (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <MomentImage
            src={moment.imageUrl}
            alt=""
            sizes="(min-width: 768px) 440px, 100vw"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <CategoryBadge category={moment.category} />
        <time
          dateTime={moment.occurredAt.toISOString()}
          className="text-xs font-bold text-foreground-muted"
        >
          {timeLabel}
        </time>
      </div>

      <h3 className="min-w-0 wrap-anywhere text-[19px] font-bold leading-snug text-foreground">
        {/* Stretched link: the whole card is clickable, one tab stop. */}
        <Link
          href={`/moments/${moment.id}`}
          className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
        >
          {moment.title}
        </Link>
      </h3>

      {moment.description && (
        <p className="min-w-0 wrap-anywhere line-clamp-3 text-sm leading-relaxed text-foreground-secondary">
          {moment.description}
        </p>
      )}
    </article>
  );
}
