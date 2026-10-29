import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "We couldn’t find that page in Life Replay.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <Link
          href="/login"
          aria-label="Life Replay sign in"
          className="mb-12 inline-flex min-h-11 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Logo className="size-9" />
          <span className="text-lg font-bold">Life Replay</span>
        </Link>

        <div className="mb-6 grid size-20 place-items-center rounded-full border border-border bg-surface">
          <Compass className="size-9 text-teal" aria-hidden="true" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-dark">
          Page 404
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          This page seems to have wandered off.
        </h1>
        <p className="mt-4 max-w-md text-pretty leading-relaxed text-foreground-secondary">
          The link may be old, or the page may have moved. Your moments are
          still safe in your archive.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal px-5 font-semibold text-white transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Return to Life Replay
        </Link>
      </div>
    </main>
  );
}
