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

function DashboardSkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`rounded-lg bg-background-secondary motion-safe:animate-pulse ${className}`}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-242.5 flex-col gap-10 px-4 pb-28 pt-6 md:gap-12 md:px-8 md:pb-16 md:pt-10 xl:px-10">
      <div role="status" aria-label="Loading your archive" className="flex flex-col gap-10 md:gap-12">
        <div aria-hidden="true" className="flex flex-col gap-10 md:gap-12">
          <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-xl flex-col gap-3">
              <DashboardSkeletonBlock className="h-3 w-32" />
              <DashboardSkeletonBlock className="h-20 w-full max-w-xl md:h-24" />
              <DashboardSkeletonBlock className="h-4 w-64 md:hidden" />
            </div>
            <div className="hidden shrink-0 flex-col gap-2 rounded-xl border border-border-subtle bg-background-section px-6 py-4 md:flex">
              <DashboardSkeletonBlock className="h-3 w-24" />
              <DashboardSkeletonBlock className="h-7 w-48" />
              <DashboardSkeletonBlock className="h-4 w-60" />
            </div>
          </section>

          <div className="flex items-center gap-4 md:rounded-xl md:border md:border-border md:bg-surface md:p-6 md:shadow-subtle">
            <DashboardSkeletonBlock className="hidden size-12 shrink-0 md:block" />
            <div className="hidden min-w-0 flex-1 flex-col gap-2 md:flex">
              <DashboardSkeletonBlock className="h-3 w-28" />
              <DashboardSkeletonBlock className="h-5 w-full max-w-md" />
            </div>
            <DashboardSkeletonBlock className="h-12 w-full rounded-xl md:w-48" />
          </div>

          <section className="grid overflow-hidden rounded-2xl border border-border-subtle bg-background-section md:grid-cols-[1fr_minmax(0,320px)]">
            <div className="flex flex-col gap-5 p-6 md:p-12">
              <div className="flex flex-col gap-2">
                <DashboardSkeletonBlock className="h-3 w-40" />
                <DashboardSkeletonBlock className="h-3 w-32" />
              </div>
              <DashboardSkeletonBlock className="h-7 w-full max-w-lg md:h-9" />
              <DashboardSkeletonBlock className="h-4 w-full max-w-md" />
              <DashboardSkeletonBlock className="h-11 w-40" />
            </div>
            <DashboardSkeletonBlock className="hidden min-h-64 rounded-none md:block" />
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex items-baseline justify-between gap-4">
              <DashboardSkeletonBlock className="h-7 w-44" />
              <DashboardSkeletonBlock className="h-4 w-24" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[0, 1].map((card) => (
                <div key={card} className="flex min-h-48 flex-col gap-5 rounded-xl border border-border bg-surface p-6 shadow-subtle">
                  <div className="flex items-center justify-between gap-3">
                    <DashboardSkeletonBlock className="h-6 w-24 rounded-full" />
                    <DashboardSkeletonBlock className="h-4 w-16" />
                  </div>
                  <DashboardSkeletonBlock className="h-6 w-3/4" />
                  <DashboardSkeletonBlock className="h-4 w-full" />
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <DashboardSkeletonBlock className="h-7 w-52" />
              <DashboardSkeletonBlock className="h-4 w-56" />
            </div>
            <div className="relative flex flex-col gap-6 pl-8 md:pl-10">
              <span aria-hidden="true" className="absolute bottom-0 left-1.5 top-0 w-px bg-border" />
              {[0, 1].map((entry) => (
                <div key={entry} className="relative flex min-h-36 flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-subtle">
                  <DashboardSkeletonBlock className="absolute -left-8 top-8 size-3 rounded-full md:-left-10" />
                  <div className="flex items-center justify-between gap-3">
                    <DashboardSkeletonBlock className="h-4 w-40" />
                    <DashboardSkeletonBlock className="h-6 w-20 rounded-full" />
                  </div>
                  <DashboardSkeletonBlock className="h-6 w-3/4 max-w-sm" />
                  <DashboardSkeletonBlock className="h-4 w-full max-w-lg" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

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
    return <DashboardSkeleton />;
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