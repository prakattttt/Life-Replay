import type { Metadata } from "next";
import { connection } from "next/server";
import { CaptureForm } from "@/components/moments/capture-form";
import { getPromptOfTheDay } from "@/features/home/greeting";

export const metadata: Metadata = { title: "New moment" };

export default async function NewMomentPage() {
  // The daily prompt depends on today's date, so render per request instead of
  // freezing the build-time date into a static page.
  await connection();
  const prompt = getPromptOfTheDay(new Date());

  return (
    <div className="mx-auto w-full max-w-170">
      <header className="flex flex-col gap-2 md:pb-8">
        <p className="hidden items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-dark md:flex">
          <span aria-hidden className="size-2 rounded-full bg-amber" />
          New moment
        </p>
        {/* On mobile the form's own header carries the title; keep the h1 for screen readers. */}
        <h1 className="sr-only text-[44px] font-bold leading-tight tracking-tight text-foreground md:not-sr-only">
          What’s worth remembering?
        </h1>
        <p className="hidden text-[17px] leading-relaxed text-foreground-secondary md:block">
          A few words is enough. Everything else is optional.
        </p>
      </header>

      <CaptureForm prompt={prompt} />
    </div>
  );
}
