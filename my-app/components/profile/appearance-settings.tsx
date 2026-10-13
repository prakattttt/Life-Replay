"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";

interface optionType {
  value: "light" | "dark" | "system";
  label: string;
  hint: string;
  icon: LucideIcon;
}

const options: optionType[] = [
  { value: "light", label: "Light", hint: "Warm ivory", icon: Sun },
  { value: "dark", label: "Dark", hint: "Easy on the eyes", icon: Moon },
  {
    value: "system",
    label: "System",
    hint: "Match your device",
    icon: Monitor,
  },
];

// Server snapshot is false; browser snapshot is true.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <fieldset>
      <legend className="sr-only">Theme</legend>

      <div className="grid gap-3 sm:grid-cols-3">
        {options.map(({ value, label, hint, icon: Icon }) => (
          <label key={value} className="relative block cursor-pointer">
            <input
              type="radio"
              name="theme"
              value={value}
              checked={mounted && theme === value}
              onChange={() => setTheme(value)}
              className="peer sr-only"
            />

            <span className="flex min-h-20 items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong peer-checked:border-teal peer-checked:bg-teal-subtle peer-focus-visible:ring-2 peer-focus-visible:ring-teal peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface">
              <Icon
                className="size-5 shrink-0 text-foreground-secondary"
                aria-hidden="true"
              />

              <span className="flex flex-col">
                <span className="font-bold text-foreground">{label}</span>
                <span className="text-sm text-foreground-secondary">
                  {hint}
                </span>
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
