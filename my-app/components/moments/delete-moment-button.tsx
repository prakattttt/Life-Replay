"use client";

import { useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, X } from "lucide-react";
import { deleteMoment } from "@/actions/moment-management-action";

type DeleteMomentButtonProps = {
  momentId: string;
  title: string;
};

export function DeleteMomentButton({ momentId, title }: DeleteMomentButtonProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();

  function close() {
    if (!isPending) dialogRef.current?.close();
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      let result;
      try {
        result = await deleteMoment(momentId);
      } catch {
        setError("We couldn’t reach the server. Please try again.");
        return;
      }

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.replace("/moments");
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setError(null);
          dialogRef.current?.showModal();
        }}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-error transition-colors hover:bg-terracotta-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
      >
        <Trash2 className="size-4" aria-hidden />
        Delete
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setError(null)}
        onCancel={(event) => {
          if (isPending) event.preventDefault();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-2xl border border-b-0 border-border bg-surface p-0 text-foreground backdrop:bg-foreground/40 md:inset-0 md:m-auto md:h-fit md:max-w-md md:rounded-2xl md:border-b"
      >
        <div className="flex flex-col gap-5 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-terracotta-light text-error">
              <Trash2 className="size-5" aria-hidden />
            </span>
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              disabled={isPending}
              className="-mr-2 -mt-2 grid size-11 place-items-center rounded-lg text-foreground-secondary hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-60"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h2 id={titleId} className="text-2xl font-bold text-foreground">
              Delete this moment?
            </h2>
            <p className="text-sm leading-relaxed text-foreground-secondary">
              “{title}” and its photo will be permanently removed. This can’t be undone.
            </p>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-error/30 bg-terracotta-light px-4 py-3 text-sm text-error">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={close}
              disabled={isPending}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border px-5 text-sm font-semibold text-foreground hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-60"
            >
              Keep moment
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-error px-5 text-sm font-semibold text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
                  Deleting…
                </>
              ) : (
                "Delete moment"
              )}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}