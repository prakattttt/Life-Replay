"use client";

import { useEffect } from "react";
import Link from "next/link";

type TimelineErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TimelineError({ error, reset }: TimelineErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-242.5 flex-col items-start gap-4 rounded-xl border border-border bg-surface p-8">
      <h1 className="text-xl font-bold text-foreground">
        We couldn’t open your timeline.
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-foreground-secondary">
        Your moments are safe. Something went wrong while loading them, so
        please try again in a moment.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center rounded-lg bg-teal px-5 text-sm font-semibold text-background hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center rounded-lg border border-border px-5 text-sm font-semibold text-foreground hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
