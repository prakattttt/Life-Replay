import type { Metadata } from "next";
import { GreetingHeader } from "@/components/dashboard/greeting-header";
import { OnThisDayBanner } from "@/components/dashboard/on-this-day-banner";
import { QuickCaptureBar } from "@/components/dashboard/quick-capture-bar";
import { RecentMemories } from "@/components/dashboard/recent-memories";
import { TodaysMoments } from "@/components/dashboard/todays-moments";
import { FadeIn } from "@/components/ui/fade-in";
import { getPromptOfTheDay } from "@/features/home/greeting";
import { getHomeData, mockUser } from "@/features/home/mock-data";

export const metadata: Metadata = { title: "Home" };

export default async function DashboardPage() {
  const now = new Date();
  const data = await getHomeData(now);

  return (
    <div className="relative isolate overflow-clip">
      {/* Warm ambient glow behind the editorial header (decorative). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-amber/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-40 -z-10 size-80 rounded-full bg-teal-light/40 blur-3xl"
      />

      <div className="mx-auto flex w-full max-w-242.5 flex-col gap-10 md:gap-12">
        <FadeIn>
          <GreetingHeader
            name={mockUser.name}
            now={now}
            totalMoments={data.totalMoments}
          />
        </FadeIn>

        <FadeIn delay={0.05}>
          <QuickCaptureBar prompt={getPromptOfTheDay(now)} />
        </FadeIn>

        <FadeIn delay={0.1}>
          <OnThisDayBanner data={data.onThisDay} now={now} />
        </FadeIn>

        <FadeIn delay={0.15}>
          <TodaysMoments moments={data.today} now={now} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <RecentMemories moments={data.recent} now={now} />
        </FadeIn>
      </div>
    </div>
  );
}
