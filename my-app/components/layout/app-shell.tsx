import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileHeader } from "./mobile-header";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

type AppShellProps = {
  user: { name: string; email: string };
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
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
        <MobileHeader />
        <main
          id="main-content"
        >
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
