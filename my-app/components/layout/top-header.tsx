import { MomentSearchForm } from "@/components/moments/moment-search-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/** Desktop/tablet header. Mobile uses MobileHeader instead. */
export function TopHeader() {
  return (
    <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur md:flex xl:px-10">
      <p className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
        Sanctuary • Editorial view
      </p>

      <div className="flex items-center gap-3">
        <MomentSearchForm className="max-w-80" />
        <ThemeToggle />
      </div>
    </header>
  );
}
