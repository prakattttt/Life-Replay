"use client";

import { useRef } from "react";
import { CalendarDays, ChevronDown, X } from "lucide-react";

type FilterSheetProps = {
  /** Text on the trigger pill, e.g. "October 2026". */
  label: string;
  children: React.ReactNode;
};

/**
 * Mobile bottom sheet built on the native <dialog>: focus trapping, Escape to
 * close and the inert background all come from the browser. The content is
 * server-rendered and passed in as children.
 */
export function FilterSheet({ label, children }: FilterSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-background-secondary px-4 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        <CalendarDays className="size-4 text-foreground-secondary" aria-hidden />
        {label}
        <ChevronDown className="size-4 text-foreground-secondary" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="timeline-filter-sheet-title"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          // Backdrop click, or picking a month/year link, dismisses the sheet.
          if (target === event.currentTarget || target.closest("a")) {
            dialogRef.current?.close();
          }
        }}
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto rounded-t-xl border border-b-0 border-border bg-surface p-0 text-foreground backdrop:bg-foreground/40"
      >
        <div className="flex flex-col gap-6 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <h2
              id="timeline-filter-sheet-title"
              className="text-lg font-bold text-foreground"
            >
              Jump to a month
            </h2>
            <button
              type="button"
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
              className="grid size-11 place-items-center rounded-lg text-foreground-secondary hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          {children}
        </div>
      </dialog>
    </>
  );
}
