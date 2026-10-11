import Link from "next/link";
import { Plus } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { CAPTURE_HREF, settingsItem, sidebarGroups } from "./nav-items";

type SidebarProps = {
  user: { name: string; email: string };
};

/**
 * Server component. Icon-only at md (768px+), full 230px at xl (1280px+).
 * Hidden on mobile, where the bottom nav takes over.
 */
export function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-18 flex-col justify-between border-r border-border bg-background-section md:flex xl:w-57.5">
      <div className="flex flex-col gap-4 overflow-y-auto px-3 py-4 xl:px-4">
        <Link
          href="/dashboard"
          aria-label="Life Replay home"
          className="flex items-center justify-center gap-2 rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal xl:justify-start"
        >
          <Logo className="size-8 shrink-0" />
          <span className="hidden xl:block">
            <span className="block text-[19px] font-bold leading-6 text-foreground">
              Life Replay
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
              Personal archive
            </span>
          </span>
        </Link>

        <Link
          href={CAPTURE_HREF}
          aria-label="Capture moment"
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal px-4 text-sm font-semibold text-background transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background-section"
        >
          <Plus className="size-4" aria-hidden />
          <span className="hidden xl:inline">Capture moment</span>
        </Link>

        <nav aria-label="Primary" className="flex flex-col gap-4">
          {sidebarGroups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-2">
              <p className="hidden px-2 text-[11px] font-bold uppercase tracking-widest text-foreground-muted xl:block">
                {group.heading}
              </p>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <NavLink
                        href={item.href}
                        label={item.label}
                        icon={<Icon className="size-4.5 shrink-0" aria-hidden />}
                        variant="sidebar"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 border-t border-border p-3 xl:p-4">
        {(() => {
          const SettingsIcon = settingsItem.icon;

          return (
            <NavLink
              href={settingsItem.href}
              label={settingsItem.label}
              icon={<SettingsIcon className="size-4.5 shrink-0" aria-hidden />}
              variant="sidebar"
            />
          );
        })()}
        <Link
          href="/profile"
          aria-label={`Profile: ${user.name}`}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-background-secondary p-2 transition-colors hover:bg-teal-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal xl:justify-start"
        >
          <UserAvatar name={user.name} />
          <span className="hidden min-w-0 xl:block">
            <span className="block truncate text-sm font-bold text-foreground">
              {user.name}
            </span>
            <span className="block truncate text-[11px] text-foreground-muted">
              {user.email}
            </span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
