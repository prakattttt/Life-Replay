import { format } from "date-fns";
import type { TimelineQuery } from "@/features/timeline/params";
import { CategoryFilter } from "./category-filter";
import { FilterSheet } from "./filter-sheet";
import { YearMonthPicker } from "./year-month-picker";

type FilterBarProps = {
  query: TimelineQuery;
  years: number[];
  monthCounts: number[];
  now: Date;
};

/**
 * Desktop: a card with the year pills, month scrub and category chips.
 * Mobile: a sticky bar under the app header, with the month picker moved into
 * a bottom sheet.
 */

export function FilterBar({ query, years, monthCounts, now }: FilterBarProps) {
  const pickerProps = { query, years, monthCounts, now };
  const monthLabel = format(new Date(query.year, query.month - 1, 1), "MMMM yyyy");

  return (
    <div className="sticky top-14 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-1 backdrop-blur md:static md:mx-0 md:rounded-xl md:border md:border-border-subtle md:bg-background-section md:p-6 md:backdrop-blur-none">
      <div className="flex flex-col gap-1 md:gap-4">
        <div className="hidden md:block">
          <YearMonthPicker {...pickerProps} layout="inline" />
        </div>

        <div className="md:hidden">
          <FilterSheet label={monthLabel}>
            <YearMonthPicker {...pickerProps} layout="sheet" />
          </FilterSheet>
        </div>

        <CategoryFilter query={query} />
      </div>
    </div>
  );
}
