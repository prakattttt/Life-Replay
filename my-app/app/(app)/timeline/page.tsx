import type { Metadata } from "next";
import { format } from "date-fns";
import { DayBlock } from "@/components/timeline/day-block";
import { DayJump } from "@/components/timeline/day-jump";
import { FilterBar } from "@/components/timeline/filter-bar";
import { MonthHeader } from "@/components/timeline/month-header";
import { TimelineEmptyState } from "@/components/timeline/timeline-empty-state";
import { TimelineEndMarker } from "@/components/timeline/timeline-end-marker";
import { TimelineHeader } from "@/components/timeline/timeline-header";
import { FadeIn } from "@/components/ui/fade-in";
import { groupMomentsByDay } from "@/features/timeline/group";
import { MOCK_USER_ID } from "@/features/timeline/mock-data";
import {
  parseTimelineSearchParams,
  type RawSearchParams,
} from "@/features/timeline/params";
import {
  getTimelineFilterOptions,
  getTimelineMoments,
} from "@/features/timeline/queries";

export const metadata: Metadata = { title: "Timeline" };

type TimelinePageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  const now = new Date();
  const query = parseTimelineSearchParams(await searchParams, now);

  const userId = MOCK_USER_ID;

  const [result, options] = await Promise.all([
    getTimelineMoments(userId, query, now),
    getTimelineFilterOptions(userId, query.year, now),
  ]);

  const monthLabel = format(new Date(query.year, query.month - 1, 1), "MMMM yyyy");
  const groups = groupMomentsByDay(result.moments);

  return (
    <div className="mx-auto flex w-full max-w-242.5 flex-col gap-8 md:gap-10 px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10 xl:px-10">
      <FadeIn>
        <TimelineHeader
          totalMoments={options.totalMoments}
          monthMoments={options.monthCounts[query.month - 1]}
        />
      </FadeIn>

      <FilterBar
        query={query}
        years={options.years}
        monthCounts={options.monthCounts}
        now={now}
      />

      {result.total === 0 ? (
        <TimelineEmptyState query={query} monthLabel={monthLabel} />
      ) : (
        <FadeIn delay={0.05}>
          <div className="grid gap-6 xl:grid-cols-[207px_minmax(0,1fr)] xl:gap-10">
            <DayJump groups={groups} monthLabel={monthLabel} total={result.total} />

            {/* Stream: left padding holds the spine and nodes (40px / 56px). */}
            <section
              aria-labelledby="timeline-month-heading"
              className="relative pl-10 md:pl-14"
            >
              <span
                aria-hidden
                className="absolute bottom-0 left-1.25 top-0 w-0.5 bg-border"
              />
              <div className="flex flex-col gap-10 md:gap-12">
                <MonthHeader monthLabel={monthLabel} total={result.total} />
                {groups.map((group) => (
                  <DayBlock key={group.key} group={group} />
                ))}
                <TimelineEndMarker
                  query={query}
                  hasMore={result.hasMore}
                  nextBatchSize={result.nextBatchSize}
                />
              </div>
            </section>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
