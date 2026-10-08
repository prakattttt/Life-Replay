import { format, getDayOfYear } from "date-fns";
import { getDayPeriod, getGreeting } from "@/features/home/greeting";

type GreetingHeaderProps = {
  name: string;
  now: Date;
  totalMoments: number;
};

export function GreetingHeader({
  name,
  now,
  totalMoments,
}: GreetingHeaderProps) {
  const firstName = name.split(" ")[0];

  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-xl flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-dark">
          {getDayPeriod(now)} reflection
        </p>
        <h1 className="text-balance text-[32px] font-bold leading-tight tracking-tight text-foreground md:text-[44px]">
          {getGreeting(now)}, {firstName}. Let’s replay your life.
        </h1>
        <p className="text-sm text-foreground-secondary md:hidden">
          {totalMoments.toLocaleString("en-US")} moments kept. Today is ripe for
          remembering.
        </p>
      </div>

      <div className="hidden shrink-0 flex-col gap-1 rounded-xl border border-border-subtle bg-background-section px-6 py-4 md:flex">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-dark">
          Archive date
        </p>
        <p className="text-2xl font-bold text-foreground">
          {format(now, "EEEE, MMMM d")}
        </p>
        <p className="text-[13px] text-foreground-secondary">
          Day {getDayOfYear(now)} of {format(now, "yyyy")} •{" "}
          {totalMoments.toLocaleString("en-US")} moments kept
        </p>
      </div>
    </header>
  );
}
