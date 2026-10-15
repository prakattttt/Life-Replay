"use client";

import { useTransition } from "react";

export function RouteError({
  message,
  reset,
}: {
  message: string;
  reset: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div
      role="alert"
      className="mx-auto flex w-full max-w-242.5 flex-col items-start gap-3 px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10 xl:px-10"
    >
      <p className="text-sm text-error">{message}</p>
      <button
        type="button"
        onClick={() => startTransition(() => reset())}
        disabled={isPending}
        className="min-h-11 rounded-lg font-semibold text-teal underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-60"
      >
        {isPending ? "Trying again…" : "Try again"}
      </button>
    </div>
  );
}