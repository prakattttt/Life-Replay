import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/app/lib/utils";
import { MOMENT_CATEGORIES } from "@/types/moment";
import { categoryMeta } from "./category";

type CategoryPickerProps = {
  /** The `register("category", ...)` result from React Hook Form. */
  field: UseFormRegisterReturn;
  /** Shown when the category was chosen automatically from the headline. */
  hint?: string | null;
};

/**
 * A native radio group styled as chips: arrow keys, focus and screen-reader
 * semantics come from the browser. The coloured dot is the only colour; the
 * label stays high-contrast in both themes.
 */
export function CategoryPicker({ field, hint }: CategoryPickerProps) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <legend className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-foreground-muted">
        Chronicle category
      </legend>

      <div className="flex flex-wrap gap-2">
        {MOMENT_CATEGORIES.map((category) => {
          const { label, dot } = categoryMeta[category];

          return (
            <label key={category} className="relative cursor-pointer">
              <input
                type="radio"
                value={category}
                {...field}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-semibold text-foreground-secondary transition-colors md:min-h-10",
                  "hover:bg-background-secondary",
                  "peer-checked:border-teal peer-checked:bg-teal-light peer-checked:text-teal",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-teal peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                )}
              >
                <span aria-hidden className={cn("size-2 rounded-full", dot)} />
                {label}
              </span>
            </label>
          );
        })}
      </div>

      {hint && <p className="text-xs text-foreground-muted">{hint}</p>}
    </fieldset>
  );
}
