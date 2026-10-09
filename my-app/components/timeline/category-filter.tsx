import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { categoryMeta } from "@/components/moments/category";
import { buildTimelineHref, type TimelineQuery } from "@/features/timeline/params";
import { MOMENT_CATEGORIES } from "@/types/moment";

/** Category chips. Plain links, so the filter lives in the URL. */
export function CategoryFilter({ query }: { query: TimelineQuery }) {
  const items = [
    { key: null, label: "All", dot: null },
    ...MOMENT_CATEGORIES.map((category) => ({
      key: category,
      label: categoryMeta[category].label,
      dot: categoryMeta[category].dot,
    })),
  ];

  return (
    <nav aria-label="Filter by category" className="flex items-center gap-3">
      <p className="hidden text-[11px] font-bold uppercase tracking-widest text-foreground-muted md:block">
        Filter by
      </p>

      {/* Scrolls sideways on mobile, wraps on larger screens. */}
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {items.map(({ key, label, dot }) => {
          const selected = query.category === key;

          return (
            <li key={label} className="shrink-0">
              <Link
                href={buildTimelineHref({ ...query, category: key, page: 1 })}
                scroll={false}
                aria-current={selected ? "true" : undefined}
                className="group flex min-h-11 items-center focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "inline-flex h-8 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition-colors group-focus-visible:ring-2 group-focus-visible:ring-teal md:h-7 md:text-xs",
                    selected
                      ? "bg-teal text-background"
                      : "border border-border bg-surface text-foreground-secondary group-hover:bg-background-secondary",
                  )}
                >
                  {dot && (
                    <span aria-hidden className={cn("size-2 rounded-full", dot)} />
                  )}
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
