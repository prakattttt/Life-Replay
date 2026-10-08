import Link from "next/link";
import { PenLine, Plus } from "lucide-react";
import { CAPTURE_HREF } from "@/components/layout/nav-items";

/**
 * Desktop: a card with the daily prompt and a button.
 * Mobile: just the full-width button (the bottom nav also has Capture).
 * The whole thing is one link, so there is a single tab stop.
 */
export function QuickCaptureBar({ prompt }: { prompt: string }) {
  return (
    <Link
      href={CAPTURE_HREF}
      aria-label="Capture a moment"
      className="group flex items-center gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background md:border md:border-border md:bg-surface md:p-6 md:shadow-subtle"
    >
      <span
        aria-hidden
        className="hidden size-12 shrink-0 place-items-center rounded-xl bg-teal-subtle text-teal md:grid"
      >
        <PenLine className="size-5" />
      </span>

      <span className="hidden min-w-0 flex-1 flex-col gap-1 md:flex">
        <span className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
          Prompt of the day
        </span>
        <span className="truncate text-[17px] text-foreground-secondary">
          {prompt}
        </span>
      </span>

      <span className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal px-6 text-sm font-semibold text-background transition-colors group-hover:bg-teal-hover md:w-auto">
        <Plus className="size-4" aria-hidden />
        <span className="text-xl md:text-[16px]">Capture a Moment</span>
      </span>
    </Link>
  );
}
