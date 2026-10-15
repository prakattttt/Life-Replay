import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, ne } from "drizzle-orm";
import { Pencil } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { CategoryBadge } from "@/components/moments/category-badge";
import { categoryMeta } from "@/components/moments/category";
import { DeleteMomentButton } from "@/components/moments/delete-moment-button";
import { MomentCard } from "@/components/moments/moment-card";
import { MomentImage } from "@/components/moments/moment-image";
import { moment } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import { getSessionUserId } from "@/features/auth/session";
import { z } from "zod";

export const metadata: Metadata = { title: "Moment" };

type MomentPageProps = {
  params: Promise<{ momentId: string }>;
};


export default async function MomentPage({ params }: MomentPageProps) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const { momentId } = await params;
  if (!z.uuid().safeParse(momentId).success) notFound();

  const [entry] = await db
    .select()
    .from(moment)
    .where(and(eq(moment.id, momentId), eq(moment.userId, userId)))
    .limit(1);

  if (!entry) notFound();

  const relatedMoments = await db
    .select({
      id: moment.id,
      title: moment.title,
      description: moment.description,
      category: moment.category,
      imageUrl: moment.imageUrl,
      occurredAt: moment.occurredAt,
      occurredOn: moment.occurredOn,
      timezone: moment.timezone,
    })
    .from(moment)
    .where(and(eq(moment.userId, userId), eq(moment.category, entry.category), ne(moment.id, entry.id)))
    .orderBy(desc(moment.occurredOn), desc(moment.occurredAt))
    .limit(3);

  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${entry.occurredOn}T12:00:00Z`));
  const timeLabel = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: entry.timezone,
  }).format(entry.occurredAt);

  const timelineHref = `/timeline?year=${entry.occurredOn.slice(0, 4)}&month=${Number(entry.occurredOn.slice(5, 7))}`;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pb-28 pt-6 md:gap-10 md:px-8 md:pb-16 md:pt-10">
      <nav aria-label="Moment navigation" className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/moments"
          className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-teal transition-colors hover:bg-teal-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          Moments archive
        </Link>
        <div className="flex flex-wrap items-center gap-1">
          <Link
            href={timelineHref}
            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-foreground-secondary transition-colors hover:bg-background-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            View in timeline
          </Link>
          <Link
            href={`/moments/${entry.id}/edit`}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-teal transition-colors hover:bg-teal-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            <Pencil className="size-4" aria-hidden />
            Edit
          </Link>
          <DeleteMomentButton momentId={entry.id} title={entry.title} />
        </div>
      </nav>

      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 border-l-2 border-teal pl-5 md:gap-5 md:pl-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <CategoryBadge category={entry.category} />
            <span className="text-sm text-foreground-secondary">
              <time dateTime={entry.occurredAt.toISOString()}>
                {dateLabel} at {timeLabel}
              </time>
            </span>
          </div>
          <h1 className="max-w-3xl text-balance text-[32px] font-bold leading-tight text-foreground md:text-[44px]">
            {entry.title}
          </h1>
        </header>

        {entry.imageUrl && (
          <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-border-subtle bg-background-secondary md:aspect-video">
            <MomentImage src={entry.imageUrl} alt={entry.title} sizes="(min-width: 768px) 900px, 100vw" />
          </div>
        )}

        {entry.description && (
          <p className="min-w-0 max-w-3xl whitespace-pre-wrap wrap-anywhere pl-5 text-justify leading-8 text-foreground-secondary md:pl-8 md:text-lg">
            {entry.description}
          </p>
        )}
      </article>

      {relatedMoments.length > 0 && (
        <section aria-labelledby="related-moments-heading" className="flex flex-col gap-5 border-t border-border pt-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-dark">Keep wandering</p>
            <h2 id="related-moments-heading" className="mt-2 text-xl font-bold text-foreground md:text-2xl">
              More {categoryMeta[entry.category].label.toLowerCase()} moments
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {relatedMoments.map((related) => (
              <MomentCard key={related.id} moment={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}