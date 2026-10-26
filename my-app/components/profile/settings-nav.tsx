const sections = [
  { id: "appearance", label: "Appearance" },
  // { id: "notifications", label: "Notifications" },
  { id: "privacy", label: "Privacy" },
  { id: "export", label: "Data export" },
] as const;

/**
 * Jump links to each settings section. Plain anchors (no JavaScript): a sticky
 * list beside the content on large screens, wrapping capsules on small screens.
 */
export function SettingsNav() {
  return (
    <nav aria-label="Settings sections" className="lg:sticky lg:top-24 lg:self-start">
      <ul className="flex flex-wrap gap-2 pb-1 lg:flex-col lg:gap-1 lg:pb-0">
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              className="inline-flex min-h-11 items-center rounded-full bg-background-secondary px-4 text-sm font-semibold text-foreground-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal lg:w-full lg:rounded-lg lg:bg-transparent lg:px-3 lg:hover:bg-background-secondary"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
