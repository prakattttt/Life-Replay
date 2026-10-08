import { cn } from "@/app/lib/utils";
import type { MomentCategory } from "@/types/moment";
import { categoryMeta } from "./category";

export function CategoryBadge({
  category,
  className,
}: {
  category: MomentCategory;
  className?: string;
}) {
  const { label, dot } = categoryMeta[category];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground-secondary",
        className,
      )}
    >
      {/* Colour lives on the dot; label stays high-contrast in both themes. */}
      <span aria-hidden className={cn("size-2 rounded-full", dot)} />
      {label}
    </span>
  );
}
