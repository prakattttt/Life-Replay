import { Search } from "lucide-react";

export function MomentSearchForm({
  query = "",
  className = "",
}: {
  query?: string;
  className?: string;
}) {
  return (
    <form action="/search" method="get" role="search" className={`w-full ${className}`}>
      <div className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-3 transition-colors focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20">
        <input
          type="search"
          name="q"
          aria-label="Search memories"
          defaultValue={query}
          maxLength={120}
          placeholder="Search memories"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-foreground-muted"
        />
        <button
          type="submit"
          aria-label="Search"
          title="Search"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-teal transition-colors hover:bg-teal-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Search className="size-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}