"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";

const tabs = [
  { label: "Profile", href: "/profile" },
  { label: "Security", href: "/profile/security" },
] as const;

/** Underlined tabs under the profile header. Client only for the active state. */
export function ProfileTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Profile sections" className="border-b border-border">
      <ul className="-mb-px flex gap-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal",
                  active
                    ? "border-teal text-teal"
                    : "border-transparent text-foreground-secondary hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
