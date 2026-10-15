"use client";

import { useEffect, useState } from "react";
import { CalendarHeart } from "lucide-react";
import { TimelineEntry } from "@/components/dashboard/timeline-entry";
import { FadeIn } from "@/components/ui/fade-in";
import {
  deserializeMoment,
  type SerializedOnThisDayData,
} from "@/features/home/transport";
import type { Moment } from "@/types/moment";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; moments: Moment[]; timezone: string };

export function OnThisDayContent() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/home/on-this-day", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("We couldn’t load your memories.");
        return (await response.json()) as SerializedOnThisDayData;
      })
      .then(({ moments, timezone }) =>
        setState({ status: "ready", moments: moments.map(deserializeMoment), timezone }),
      )
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "We couldn’t load your memories.",
        });
      });

    return () => controller.abort();
  }, [attempt]);

  if (state.status === "loading") {
    return <p role="status" className="py-12 text-sm text-foreground-muted">Finding this day in your archive…</p>;
  }

  if (state.status === "error") {
    return (
      <div role="alert" className="flex flex-col items-start gap-3 py-12">
        <p className="text-sm text-error">{state.message}</p>
        <button
          type="button"
          onClick={() => {
            setState({ status: "loading" });
            setAttempt((value) => value + 1);
          }}
          className="min-h-11 rounded-lg font-semibold text-teal underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          Try again
        </button>
      </div>
    );
  }

  const { moments, timezone } = state;
  const now = new Date();
  const todayLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    timeZone: timezone,
  }).format(now);
  const currentYear = Number(
    new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: timezone }).format(now),
  );
  const momentsByYear = new Map<number, Moment[]>();
  for (const memory of moments) {
    const year = Number(memory.occurredOn?.slice(0, 4));
    const yearMoments = momentsByYear.get(year) ?? [];
    yearMoments.push(memory);
    momentsByYear.set(year, yearMoments);
  }

  return (
    <div className="mx-auto flex w-full max-w-242.5 flex-col gap-8 px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10 xl:px-10">
      <FadeIn>
        <header className="flex flex-col gap-3">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-dark">
            <CalendarHeart className="size-4" aria-hidden />
            On this day
          </p>
          <h1 className="text-[32px] font-bold leading-tight text-foreground md:text-[40px]">
            {todayLabel}, in other years
          </h1>
          <p className="text-sm text-foreground-secondary">
            {moments.length} {moments.length === 1 ? "memory" : "memories"} from your archive
          </p>
        </header>
      </FadeIn>

      {moments.length === 0 ? (
        <section className="rounded-xl border border-dashed border-border-strong bg-background-section p-8">
          <p className="text-foreground-secondary">
            No earlier memories from {todayLabel} yet. They’ll gather here as your archive grows.
          </p>
        </section>
      ) : (
        <div className="flex flex-col gap-10">
          {[...momentsByYear.entries()]
            .sort(([left], [right]) => right - left)
            .map(([year, yearMoments]) => (
              <section key={year} className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-foreground md:text-2xl">
                  {year}
                  <span className="ml-2 text-sm font-medium text-foreground-muted">
                    {currentYear - year} {currentYear - year === 1 ? "year" : "years"} ago
                  </span>
                </h2>
                <ol className="flex flex-col gap-6">
                  {yearMoments.map((memory) => (
                    <TimelineEntry key={memory.id} moment={memory} />
                  ))}
                </ol>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}