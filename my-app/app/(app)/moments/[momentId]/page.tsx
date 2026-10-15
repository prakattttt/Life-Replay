import type { Metadata } from "next";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { CategoryBadge } from "@/components/moments/category-badge";
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

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10">
      <Link
        href="/timeline"
        className="inline-flex min-h-11 items-center self-start text-sm font-semibold text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        Back to timeline
      </Link>
      <article className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-5 shadow-subtle md:p-8">
        {entry.imageUrl && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <MomentImage src={entry.imageUrl} alt="" sizes="(min-width: 768px) 700px, 100vw" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <CategoryBadge category={entry.category} />
          <span className="text-sm text-foreground-secondary">
            <time dateTime={entry.occurredAt.toISOString()}>
              {dateLabel} at {timeLabel}
            </time>
          </span>
        </div>
        <h1 className="text-balance text-[28px] font-bold leading-tight text-foreground md:text-[36px]">
          {entry.title}
        </h1>
        {entry.description && (
          <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground-secondary">
            {entry.description}
          </p>
        )}
      </article>
    </div>
  );
}