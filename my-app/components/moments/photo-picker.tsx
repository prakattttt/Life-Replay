"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { downscaleImage } from "@/features/moments/downscale-image";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_PICKED_IMAGE_BYTES,
  validateImageFile,
} from "@/schemas/moment";

type PhotoPickerProps = {
  /** Called with the ready-to-upload file, or null when it is removed. */
  onChange: (file: File | null) => void;
  /** An error from the server (the picker shows its own checks too). */
  error?: string | null;
};

type Preview = { file: File; url: string };

const labelClass =
  "text-[11px] font-semibold uppercase tracking-widest text-foreground-muted";

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Optional single photo. Originals are shrunk in the browser first, so the
 * upload stays small on mobile data. To clear it from outside (after a save),
 * remount with a new `key`.
 */
export function PhotoPicker({ onChange, error }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<Preview | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const errorId = useId();

  // Object URLs hold memory until released: free the last one on unmount.
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current.url);
    };
  }, []);

  function replacePreview(next: Preview | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current.url);
    previewRef.current = next;
    setPreview(next);
    onChange(next?.file ?? null);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0];
    // Reset so choosing the same file again still fires onChange.
    event.target.value = "";
    if (!picked) return;

    setLocalError(null);

    // Check the original first so a huge or wrong file never reaches the canvas.
    const originalProblem = validateImageFile(picked, MAX_PICKED_IMAGE_BYTES);
    if (originalProblem) {
      setLocalError(originalProblem);
      return;
    }

    setIsPreparing(true);
    try {
      const prepared = await downscaleImage(picked);
      const problem = validateImageFile(prepared);
      if (problem) {
        setLocalError(problem);
        return;
      }
      replacePreview({ file: prepared, url: URL.createObjectURL(prepared) });
    } finally {
      setIsPreparing(false);
    }
  }

  const message = localError ?? error ?? null;

  return (
    <div className="flex flex-col gap-2">
      <p className={labelClass}>Visual fragment</p>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={handleFile}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />

      {preview ? (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-3">
          {/* A blob: URL can't go through next/image, and it's a local preview. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview.url}
            alt="Preview of the attached photo"
            className="size-20 shrink-0 rounded-lg object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {preview.file.name}
            </p>
            <p className="text-xs text-foreground-muted">
              {formatSize(preview.file.size)}
            </p>
            <div className="-ml-3 flex">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-bold text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocalError(null);
                  replacePreview(null);
                }}
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-bold text-foreground-secondary hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPreparing}
          aria-describedby={message ? errorId : undefined}
          className="flex min-h-24 w-full items-center gap-4 rounded-xl border border-dashed border-border-strong bg-background-section px-4 py-3 text-left transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-70"
        >
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-full bg-background text-foreground-secondary"
          >
            {isPreparing ? (
              <Loader2 className="size-5 motion-safe:animate-spin" />
            ) : (
              <Camera className="size-5" />
            )}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[13px] font-medium text-foreground">
              {isPreparing ? "Preparing your photo…" : "Add a photo (optional)"}
            </span>
            <span className="text-[11px] font-semibold text-foreground-muted">
              JPG, PNG or WebP
            </span>
          </span>
        </button>
      )}

      {message && (
        <p id={errorId} role="alert" className="text-sm text-error">
          {message}
        </p>
      )}
    </div>
  );
}
