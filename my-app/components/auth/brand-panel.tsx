import Link from "next/link";
import { Lock } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { CategoryBadge } from "@/components/moments/category-badge";

/**
 * The left half of the auth screens on large displays. It shows what the
 * product is for with a sample "On this day" card, so the first impression is
 * the feeling of the app, not a feature list.
 */
export function BrandPanel() {
  return (
    <aside className="hidden flex-col justify-between border-r border-border-subtle bg-background-section p-12 lg:sticky lg:top-0 lg:flex lg:h-dvh xl:p-16">
      <Link
        href="/"
        className="flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        <Logo className="size-10 shrink-0" />
        <span className="whitespace-nowrap text-xl font-bold text-foreground">Life Replay</span>
      </Link>

      <div className="flex max-w-lg flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground xl:text-5xl">
            Small moments, remembered years later.
          </h2>
          <p className="max-w-md text-pretty text-lg leading-relaxed text-foreground-secondary">
            Capture a thought in ten seconds. One day it comes back to you, right
            when you need the reminder.
          </p>
        </div>

        {/* Decorative sample: hidden from assistive tech so it isn't read as real data. */}
        <div aria-hidden className="relative">
          <div className="absolute inset-x-6 -bottom-3 h-full rounded-2xl border border-border-subtle bg-surface-subtle" />
          <div className="relative flex flex-col gap-4 rounded-2xl border border-border bg-surface p-7 shadow-subtle">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-dark">
              On this day • an example
            </p>
            <p className="text-sm font-bold text-amber-dark">Exactly 1 year ago today</p>
            <blockquote className="text-balance text-2xl font-bold leading-snug text-foreground">
              “Shipped the brand redesign after weeks of drafting.”
            </blockquote>
            <CategoryBadge category="work" />
          </div>
        </div>
      </div>

      <p className="flex items-center gap-2 text-sm text-foreground-muted">
        <Lock className="size-4" aria-hidden />
        Private by design. Only you can see your moments.
      </p>
    </aside>
  );
}
