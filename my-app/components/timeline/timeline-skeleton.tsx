import { cn } from "@/app/lib/utils";

const block = "rounded-lg bg-background-secondary motion-safe:animate-pulse";

/** Loading placeholder shaped like the real timeline. */
export function TimelineSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your timeline"
      className="mx-auto flex w-full max-w-242.5 flex-col gap-8 md:gap-10"
    >
      <div className="flex flex-col gap-3">
        <div className={cn(block, "h-3 w-40")} />
        <div className={cn(block, "h-10 w-72 md:h-12")} />
        <div className={cn(block, "h-4 w-full max-w-md")} />
      </div>

      <div className={cn(block, "h-24 rounded-xl md:h-40")} />

      <div className="flex flex-col gap-6 pl-10 md:pl-14">
        <div className={cn(block, "h-10 w-56")} />
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className={cn(block, "h-40 rounded-xl border border-border-subtle")}
          />
        ))}
      </div>
    </div>
  );
}
