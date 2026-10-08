import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/** Desktop/tablet header. Mobile uses MobileHeader instead. */
export function TopHeader() {
  return (
    <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur md:flex xl:px-10">
      <p className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
        Sanctuary • Editorial view
      </p>

      <div className="flex items-center gap-1">
        <Link
          href="/search"
          aria-label="Search moments"
          className="grid size-11 place-items-center rounded-lg text-foreground-secondary transition-colors hover:bg-background-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Search className="size-5" aria-hidden />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
