import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

type CaptureShellProps = {
  user: { name: string; email: string };
  children: React.ReactNode;
};

/**
 * Chrome for capture. Desktop and tablet keep the sidebar and header. Mobile
 * drops the bottom nav and app header so capture is a focused full-screen
 * flow, as in the Figma Create Moment frame. The page provides its own
 * Cancel / Draft bar there.
 */
export function CaptureShell({ user, children }: CaptureShellProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-teal px-4 py-2 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <Sidebar user={user} />

      <div className="md:pl-18 xl:pl-57.5">
        <TopHeader />
        <main id="main-content" className="px-4 pb-0 md:px-8 md:pb-16 md:pt-10 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
