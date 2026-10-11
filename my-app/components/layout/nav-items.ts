import type { LucideIcon } from "lucide-react";
import {
  Archive,
  CalendarHeart,
  History,
  House,
  Search,
  Settings,
  User,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const CAPTURE_HREF = "/moments/new";

export const sidebarGroups: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Main",
    items: [
      { label: "Home", href: "/dashboard", icon: House },
      { label: "Timeline", href: "/timeline", icon: History },
      { label: "Moments Archive", href: "/moments", icon: Archive },
      { label: "Search", href: "/search", icon: Search },
    ],
  },
  {
    heading: "Memories",
    items: [
      { label: "On This Day", href: "/on-this-day", icon: CalendarHeart },
    ],
  },
];

export const settingsItem: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
};

/** Mobile bottom nav. Capture sits between the two pairs. */
export const mobileNavLeft: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: House },
  { label: "Timeline", href: "/timeline", icon: History },
];

export const mobileNavRight: NavItem[] = [
  { label: "Search", href: "/search", icon: Search },
  { label: "Profile", href: "/profile", icon: User },
];
