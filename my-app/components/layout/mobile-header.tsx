import { format } from "date-fns";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "./logo";

/** Compact top bar shown below md. */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur md:hidden">
      <div className="flex items-center gap-2">
        <Logo className="size-8" />
        <span className="text-xs font-bold uppercase tracking-widest text-foreground-secondary">
          Life Replay
        </span>
      </div>

      <div className="flex items-center gap-1">
        <time className="text-xs font-semibold text-foreground-secondary">
          {format(new Date(), "EEE, MMM d")}
        </time>
        <ThemeToggle />
      </div>
    </header>
  );
}
