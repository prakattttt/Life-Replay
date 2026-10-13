"use client";

import { cn } from "@/app/lib/utils";

type ToggleRowProps = {
  /** Unique within the page; wires the label and description to the switch. */
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

/**
 * A setting with a title, a one-line explanation and an on/off switch. The
 * switch is a real button with role="switch", so keyboards and screen readers
 * treat it properly. The tap area is 44px tall even though the track is 28px.
 */
export function ToggleRow({ id, label, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <p id={`${id}-label`} className="text-base font-semibold text-foreground">
          {label}
        </p>
        <p id={`${id}-description`} className="text-sm leading-relaxed text-foreground-secondary">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-description`}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="group grid min-h-11 w-14 shrink-0 place-items-center rounded-full focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className={cn(
            "relative block h-7 w-12 rounded-full transition-colors group-focus-visible:ring-2 group-focus-visible:ring-teal group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-surface",
            checked ? "bg-teal" : "bg-border-strong",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute left-1 top-1 size-5 rounded-full bg-background shadow-sm transition-transform motion-reduce:transition-none",
              checked && "translate-x-5",
            )}
          />
        </span>
      </button>
    </div>
  );
}
