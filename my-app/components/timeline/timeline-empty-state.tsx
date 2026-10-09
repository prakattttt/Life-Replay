import Link from "next/link";
import { Sprout } from "lucide-react";
import { CAPTURE_HREF } from "@/components/layout/nav-items";
import { categoryMeta } from "@/components/moments/category";
import { buildTimelineHref, type TimelineQuery } from "@/features/timeline/params";

type TimelineEmptyStateProps = {
  query: TimelineQuery;
  monthLabel: string;
};

export function TimelineEmptyState({ query, monthLabel }: TimelineEmptyStateProps) {
  const categoryLabel = query.category ? categoryMeta[query.category].label : null;

  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-border-strong bg-background-section p-8">
      <Sprout className="size-6 text-amber" aria-hidden />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-foreground">Nothing here yet.</h2>
        <p className="max-w-md text-sm leading-relaxed text-foreground-secondary">
          {categoryLabel
            ? `There are no ${categoryLabel} moments in ${monthLabel}. `
            : `There are no moments from ${monthLabel}. `}
          Capture a small moment and your timeline will begin to grow.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {query.category && (
          <Link
            href={buildTimelineHref({ ...query, category: null, page: 1 })}
            scroll={false}
            className="inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-foreground hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            Show all categories
          </Link>
        )}
        <Link
          href={CAPTURE_HREF}
          className="inline-flex min-h-11 items-center rounded-lg bg-teal px-5 text-sm font-semibold text-background hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Capture a moment
        </Link>
      </div>
    </div>
  );
}
