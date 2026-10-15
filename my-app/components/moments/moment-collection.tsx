import Link from "next/link";
import { Archive, Search } from "lucide-react";
import { MOMENT_CATEGORIES, type MomentCategory } from "@/types/moment";
import { MOMENT_BROWSE_PAGE_SIZE, type MomentBrowseQuery } from "@/features/moments/browse-params";
import type { MomentBrowseResult } from "@/features/moments/browse-queries";
import { MomentCard } from "./moment-card";
import { categoryMeta } from "./category";
import { MomentSearchForm } from "./moment-search-form";

type MomentCollectionProps = {
  mode: "archive" | "search";
  query: MomentBrowseQuery;
  result: MomentBrowseResult;
};

function browseHref(
  mode: MomentCollectionProps["mode"],
  query: MomentBrowseQuery,
  page: number,
) {
  const params = new URLSearchParams();
  if (mode === "search" && query.query) params.set("q", query.query);
  if (query.category) params.set("category", query.category);
  if (page > 1) params.set("page", String(page));
  const suffix = params.size ? `?${params.toString()}` : "";
  return `${mode === "archive" ? "/moments" : "/search"}${suffix}`;
}

export function MomentCollection({ mode, query, result }: MomentCollectionProps) {
  const isSearch = mode === "search";
  const pageCount = Math.max(1, Math.ceil(result.total / MOMENT_BROWSE_PAGE_SIZE));
  const currentPage = result.page;
  const Icon = isSearch ? Search : Archive;
  const emptyTitle = isSearch
    ? query.query
      ? "No memories match that search"
      : "Search your archive"
    : "Your archive is ready for its first memory";
  const emptyDescription = isSearch
    ? query.query
      ? "Try a different phrase or choose another category."
      : "Search titles and impressions to find a moment you remember."
    : query.category
      ? `There are no ${categoryMeta[query.category].label.toLowerCase()} memories yet.`
      : "Capture a small moment and it will find a home here.";

  return (
    <div className="mx-auto flex w-full max-w-242.5 flex-col gap-8 px-4 pb-28 pt-6 md:gap-10 md:px-8 md:pb-16 md:pt-10 xl:px-10">
      <header className="flex flex-col gap-3">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-dark">
          <Icon className="size-4" aria-hidden="true" />
          {isSearch ? "Search memories" : "Personal archive"}
        </p>
        <h1 className="text-balance text-[32px] font-bold leading-tight text-foreground md:text-[40px]">
          {isSearch ? "Find a moment" : "Moments archive"}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-foreground-secondary">
          {isSearch
            ? "Look through the words and categories that make your memories yours."
            : "Everyday moments, kept in the order they happened."}
        </p>
      </header>

      {isSearch && <MomentSearchForm query={query.query} className="max-w-xl" />}

      <section aria-label="Moment filters" className="flex flex-col gap-4 border-y border-border py-4 md:flex-row md:items-end md:justify-between">
        <form action={isSearch ? "/search" : "/moments"} method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end">
          {isSearch && query.query && <input type="hidden" name="q" value={query.query} />}
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-foreground-secondary">
            Category
            <select
              name="category"
              defaultValue={query.category ?? "all"}
              className="min-h-11 min-w-48 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              <option value="all">All categories</option>
              {MOMENT_CATEGORIES.map((category: MomentCategory) => (
                <option key={category} value={category}>
                  {categoryMeta[category].label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="min-h-11 rounded-lg border border-border-strong px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            Apply filter
          </button>
        </form>
        <p className="text-sm text-foreground-muted" aria-live="polite">
          {result.total} {result.total === 1 ? "moment" : "moments"}
          {query.category ? ` · ${categoryMeta[query.category].label}` : ""}
        </p>
      </section>

      {result.moments.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.moments.map((moment) => (
              <MomentCard key={moment.id} moment={moment} />
            ))}
          </div>

          {pageCount > 1 && (
            <nav aria-label="Moment results pages" className="flex items-center justify-between border-t border-border pt-4">
              {currentPage > 1 ? (
                <Link
                  href={browseHref(mode, query, currentPage - 1)}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-teal hover:bg-teal-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  Previous
                </Link>
              ) : <span />}
              <p className="text-sm text-foreground-muted">Page {currentPage} of {pageCount}</p>
              {currentPage < pageCount ? (
                <Link
                  href={browseHref(mode, query, currentPage + 1)}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-teal hover:bg-teal-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  Next
                </Link>
              ) : <span />}
            </nav>
          )}
        </>
      ) : (
        <section className="flex flex-col items-start gap-3 border-l-2 border-amber pl-5 py-2" aria-live="polite">
          <h2 className="text-lg font-bold text-foreground">{emptyTitle}</h2>
          <p className="max-w-xl text-sm leading-relaxed text-foreground-secondary">{emptyDescription}</p>
          {!isSearch && !query.category && (
            <Link
              href="/moments/new"
              className="mt-1 inline-flex min-h-11 items-center rounded-lg bg-teal px-4 text-sm font-semibold text-background transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
              Capture a moment
            </Link>
          )}
        </section>
      )}
    </div>
  );
}