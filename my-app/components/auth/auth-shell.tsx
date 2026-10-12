import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandPanel } from "./brand-panel";

/**
 * Frame for every signed-out screen. Large displays split in two: the brand
 * panel on the left, the form on the right. On phones and tablets the panel
 * disappears and the form takes the whole screen under a slim header.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-2">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-teal px-4 py-2 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <BrandPanel />

      <div className="flex min-h-dvh flex-col">
        <header className="flex h-16 items-center justify-between px-4 md:px-8">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal lg:hidden"
          >
            <Logo className="size-8 shrink-0" />
            <span className="whitespace-nowrap text-lg font-bold text-foreground">Life Replay</span>
          </Link>
          <ThemeToggle className="ml-auto" />
        </header>

        <main
          id="main-content"
          className="mx-auto flex w-full max-w-[26.5rem] flex-1 flex-col justify-center gap-8 px-4 pb-12 pt-4 md:px-0 md:pb-20"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
