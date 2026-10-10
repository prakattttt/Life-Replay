"use client";

import { useId, useState } from "react";
import { CalendarClock } from "lucide-react";
import { cn } from "@/app/lib/utils";
import {
  describeWhen,
  isSameWhen,
  toLocalInputValue,
  WHEN_PRESETS,
  type When,
} from "@/features/moments/when";

type WhenPickerProps = {
  value: When;
  onChange: (value: When) => void;
  error?: string;
};

const chip =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-h-10";

/**
 * Collapsed by default to a single calm line ("Just now"), because most
 * moments are captured as they happen. One tap on Change opens quick presets
 * and an exact date/time for remembering something afterwards.
 */
export function WhenPicker({ value, onChange, error }: WhenPickerProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const inputId = useId();
  const errorId = useId();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 rounded-lg bg-background-section py-1 pl-3 pr-1">
        <p
          aria-live="polite"
          className="flex items-center gap-2 text-xs font-semibold text-foreground"
        >
          <CalendarClock className="size-4 text-foreground-secondary" aria-hidden />
          <span className="sr-only">When: </span>
          {describeWhen(value)}
        </p>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-bold text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          {open ? "Done" : "Change"}
        </button>
      </div>

      {open && (
        <div id={panelId} className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {WHEN_PRESETS.map((preset) => {
              const selected = isSameWhen(value, preset.when);
              return (
                <button
                  key={preset.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange(preset.when)}
                  className={cn(
                    chip,
                    selected
                      ? "border-teal bg-teal-light text-teal"
                      : "border-border bg-surface text-foreground-secondary hover:bg-background-secondary",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}

            <button
              type="button"
              aria-pressed={value.kind === "custom"}
              onClick={() =>
                onChange({ kind: "custom", local: toLocalInputValue(new Date()) })
              }
              className={cn(
                chip,
                value.kind === "custom"
                  ? "border-teal bg-teal-light text-teal"
                  : "border-border bg-surface text-foreground-secondary hover:bg-background-secondary",
              )}
            >
              Pick time
            </button>
          </div>

          {value.kind === "custom" && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={inputId}
                className="text-[11px] font-semibold uppercase tracking-widest text-foreground-muted"
              >
                Date and time
              </label>
              <input
                id={inputId}
                type="datetime-local"
                value={value.local}
                max={toLocalInputValue(new Date())}
                onChange={(event) =>
                  onChange({ kind: "custom", local: event.target.value })
                }
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className="min-h-11 w-full max-w-xs rounded-lg border border-border bg-surface px-3 text-sm text-foreground [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal dark:[color-scheme:dark]"
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
