import Link from "next/link";
import { Plus } from "lucide-react";
import { NavLink } from "./nav-link";
import { CAPTURE_HREF, mobileNavLeft, mobileNavRight } from "./nav-items";

/** Fixed bottom navigation with an elevated central Capture button. */
export function MobileBottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid h-16 grid-cols-5 items-center px-2">
        {mobileNavLeft.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex justify-center">
              <NavLink
                href={item.href}
                label={item.label}
                icon={<Icon className="size-5" aria-hidden />}
                variant="bottom"
              />
            </li>
          );
        })}

        <li className="flex justify-center">
          <Link
            href={CAPTURE_HREF}
            aria-label="Capture moment"
            className="-mt-6 grid size-13 place-items-center rounded-full bg-teal text-background shadow-subtle ring-4 ring-background transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-teal"
          >
            <Plus className="size-6" aria-hidden />
          </Link>
        </li>

        {mobileNavRight.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex justify-center">
              <NavLink
                href={item.href}
                label={item.label}
                icon={<Icon className="size-5" aria-hidden />}
                variant="bottom"
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
