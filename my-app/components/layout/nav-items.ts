export type NavItem = {
  label: string;
  href: string;
  icon: "archive" | "calendar-heart" | "history" | "house" | "search" | "settings" | "user";
};

export const CAPTURE_HREF = "/moments/new";

export const sidebarGroups: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Main",
    items: [
      { label: "Home", href: "/dashboard", icon: "house" },
      { label: "Timeline", href: "/timeline", icon: "history" },
      { label: "Moments Archive", href: "/moments", icon: "archive" },
      { label: "Search", href: "/search", icon: "search" },
    ],
  },
  {
    heading: "Memories",
    items: [
      { label: "On This Day", href: "/on-this-day", icon: "calendar-heart" },
    ],
  },
];

export const settingsItem: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: "settings",
};

/** Mobile bottom nav. Capture sits between the two pairs. */
export const mobileNavLeft: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: "house" },
  { label: "Timeline", href: "/timeline", icon: "history" },
];

export const mobileNavRight: NavItem[] = [
  { label: "Search", href: "/search", icon: "search" },
  { label: "Profile", href: "/profile", icon: "user" },
];
