"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";

type NavLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  variant: "sidebar" | "bottom";
};

/** Client component only because it needs the current pathname. */
export function NavLink({ href, label, icon, variant }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (pathname.startsWith(`${href}/`) && pathname !== "/moments/new");

  if (variant === "bottom") {
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex min-h-11 min-w-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal",
          isActive ? "text-teal" : "text-foreground-secondary",
        )}
      >
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      title={label}
      className={cn(
        "flex min-h-11 items-center justify-center gap-3 rounded-lg px-3 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal xl:justify-start",
        isActive
          ? "bg-teal-light font-bold text-teal"
          : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground",
      )}
    >
      {icon}
      {/* Compact (tablet) sidebar is icon-only; label stays for screen readers. */}
      <span className="sr-only xl:not-sr-only">{label}</span>
    </Link>
  );
}
