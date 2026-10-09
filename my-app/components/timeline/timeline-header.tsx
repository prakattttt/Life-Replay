type TimelineHeaderProps = {
  totalMoments: number;
  monthMoments: number;
};

export function TimelineHeader({ totalMoments, monthMoments }: TimelineHeaderProps) {
  const formatCount = (n: number) => n.toLocaleString("en-US");

  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-xl flex-col gap-2">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground-muted">
          <span aria-hidden className="size-2 rounded-full bg-teal" />
          Chronological view
        </p>
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-foreground md:text-[44px]">
          The Life Timeline
        </h1>
        <p className="text-base leading-relaxed text-foreground-secondary md:text-[17px]">
          Every small moment, preserved in sequence. A quiet cartography of
          everything you chose to remember.
        </p>
      </div>

      {/* Two calm counts. No streaks or scores (AGENTS.md §50). */}
      <dl className="hidden shrink-0 items-center gap-4 rounded-xl bg-background-secondary p-3 md:flex">
        <div className="flex flex-col gap-0.5 px-2">
          <dt className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
            Moments recorded
          </dt>
          <dd className="text-xl font-bold text-foreground">{formatCount(totalMoments)}</dd>
        </div>
        <span aria-hidden className="h-8 w-px bg-border" />
        <div className="flex flex-col gap-0.5 px-2">
          <dt className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
            This month
          </dt>
          <dd className="text-xl font-bold text-teal">{formatCount(monthMoments)}</dd>
        </div>
      </dl>
    </header>
  );
}
