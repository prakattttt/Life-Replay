"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  CalendarHeart,
  History,
  House,
  Search,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { NavItem } from "./nav-items";

const icons = {
  archive: Archive,
  "calendar-heart": CalendarHeart,
  history: History,
  house: House,
  search: Search,
  settings: Settings,
  user: User,
};

type NavLinkProps = {
  item: NavItem;
  variant: "sidebar" | "bottom";
};

export function NavLink({ item, variant }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = icons[item.icon];

  if (variant === "bottom") {
    return (
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex min-h-11 min-w-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal",
          isActive ? "text-teal" : "text-foreground-secondary",
        )}
      >
        <Icon className="size-5" aria-hidden />
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      title={item.label}
      className={cn(
        "flex min-h-11 items-center justify-center gap-3 rounded-lg px-3 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal xl:justify-start",
        isActive
          ? "bg-teal-light font-bold text-teal"
          : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground",
      )}
    >
      <Icon className="size-4.5 shrink-0" aria-hidden />
      {/* Compact (tablet) sidebar is icon-only; label stays for screen readers. */}
      <span className="sr-only xl:not-sr-only">{item.label}</span>
    </Link>
  );
}
