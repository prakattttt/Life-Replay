"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { FormAlert } from "@/components/auth/form-alert";
import {
  GENERIC_ERROR,
  requestDataExport,
  type ActionResult,
  type ExportFormat,
} from "@/features/profile/profile-actions";
import { cn } from "@/app/lib/utils";

const formats: { value: ExportFormat; label: string; hint: string }[] = [
  { value: "json", label: "JSON", hint: "Complete, best for backups" },
  { value: "csv", label: "CSV", hint: "Opens in a spreadsheet" },
];

/**
 * Asks for a copy of everything. Exports can take a while, so the confirmation
 * says it will arrive by email rather than promising an instant download.
 */
export function DataExport({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const [format, setFormat] = useState<ExportFormat>("json");
  const [includePhotos, setIncludePhotos] = useState(true);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleRequest() {
    setError(null);

    startTransition(async () => {
      let result: ActionResult;
      try {
        result = await requestDataExport({ format, includePhotos });
      } catch {
        setError(GENERIC_ERROR);
        return;
      }

      if (!result.ok) {
        setError(result.message);
        return;
      }
      setRequested(true);
      toast.success("Export requested");
    });
  }

  if (requested) {
    return (
      <div className="flex flex-col gap-4 rounded-xl bg-teal-subtle p-5 sm:flex-row sm:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface text-teal">
          <MailCheck className="size-6" aria-hidden />
        </span>
        <div role="status" className="flex flex-1 flex-col gap-0.5">
          <p className="font-bold text-foreground">Your export is on its way</p>
          <p className="text-sm leading-relaxed text-foreground-secondary">
            We’ll email a download link to{" "}
            <span className="break-all font-semibold text-foreground">{email}</span> when it’s
            ready.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRequested(false)}
          className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          Request another
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <FormAlert>{error}</FormAlert>}

      <fieldset disabled={isPending} className="flex flex-col gap-6">
        <fieldset className="flex min-w-0 flex-col gap-3">
          <legend className="mb-3 text-sm font-semibold text-foreground">Format</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {formats.map((option) => (
              <label key={option.value} className="relative block cursor-pointer">
                <input
                  type="radio"
                  name="export-format"
                  value={option.value}
                  checked={format === option.value}
                  onChange={() => setFormat(option.value)}
                  className="peer sr-only"
                />
                <span className="flex min-h-16 flex-col justify-center rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-border-strong peer-checked:border-teal peer-checked:bg-teal-subtle peer-focus-visible:ring-2 peer-focus-visible:ring-teal peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface">
                  <span className="font-bold text-foreground">{option.label}</span>
                  <span className="text-sm text-foreground-secondary">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={includePhotos}
            onChange={(event) => setIncludePhotos(event.target.checked)}
            className="size-5 rounded accent-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          />
          <span>
            Include photos
            <span className="block text-foreground-secondary">Makes the download larger.</span>
          </span>
        </label>

        <button
          type="button"
          onClick={handleRequest}
          className={cn(
            "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal px-6 text-base font-semibold text-background transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit",
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
              Requesting…
            </>
          ) : (
            "Request export"
          )}
        </button>
      </fieldset>
    </div>
  );
}
