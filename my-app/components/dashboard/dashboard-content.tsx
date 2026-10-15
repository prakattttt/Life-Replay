"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { GreetingHeader } from "@/components/dashboard/greeting-header";
import { OnThisDayBanner } from "@/components/dashboard/on-this-day-banner";
import { QuickCaptureBar } from "@/components/dashboard/quick-capture-bar";
import { RecentMemories } from "@/components/dashboard/recent-memories";
import { TodaysMoments } from "@/components/dashboard/todays-moments";
import { FadeIn } from "@/components/ui/fade-in";
import { getPromptOfTheDay } from "@/features/home/greeting";
import { deserializeHomeData, type SerializedHomeData } from "@/features/home/transport";
import type { HomeData } from "@/features/home/queries";
import { apiClient } from "@/lib/api-client";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: HomeData };

export function DashboardContent({ name, now }: { name: string; now: Date }) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get<SerializedHomeData>("/api/home", { signal: controller.signal })
      .then(({ data }) => data)
      .then((data) => setState({ status: "ready", data: deserializeHomeData(data) }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message:
            axios.isAxiosError(error) && error.response
              ? "We couldn’t load your archive."
              : error instanceof Error
                ? error.message
                : "We couldn’t load your archive.",
        });
      });

    return () => controller.abort();
  }, [attempt]);

  if (state.status === "loading") {
    return <p role="status" className="mx-auto w-full max-w-242.5 px-4 py-12 text-sm text-foreground-muted">Loading your archive…</p>;
  }

  if (state.status === "error") {
    return (
      <div role="alert" className="mx-auto flex w-full max-w-242.5 flex-col items-start gap-3 px-4 py-12">
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

  const { data } = state;

  return (
    <div className="relative isolate overflow-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-amber/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-40 -z-10 size-80 rounded-full bg-teal-light/40 blur-3xl"
      />

      <div className="mx-auto flex w-full max-w-242.5 flex-col gap-10 md:gap-12 px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10 xl:px-10">
        <FadeIn>
          <GreetingHeader
            name={name}
            now={now}
            totalMoments={data.totalMoments}
            timezone={data.timezone}
          />
        </FadeIn>

        <FadeIn delay={0.05}>
          <QuickCaptureBar prompt={getPromptOfTheDay(now)} />
        </FadeIn>

        <FadeIn delay={0.1}>
          <OnThisDayBanner data={data.onThisDay} now={now} timezone={data.timezone} />
        </FadeIn>

        <FadeIn delay={0.15}>
          <TodaysMoments moments={data.today} now={now} timezone={data.timezone} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <RecentMemories moments={data.recent} now={now} timezone={data.timezone} />
        </FadeIn>
      </div>
    </div>
  );
}