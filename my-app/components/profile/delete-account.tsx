"use client";

import { useId, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, TriangleAlert, X } from "lucide-react";
import {
  GENERIC_ERROR,
  deleteAccount,
  type ActionResult,
} from "@/features/profile/profile-actions";
import { FormAlert } from "@/components/auth/form-alert";

const CONFIRM_WORD = "DELETE";

/**
 * The button and the confirmation dialog for deleting the account. The dialog
 * is a native <dialog> (a bottom sheet on phones, centred on larger screens),
 * so focus trapping and Escape come from the browser. The destructive button
 * stays disabled until the person types DELETE, which prevents a stray tap.
 */
export function DeleteAccount() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);

  const titleId = useId();
  const inputId = useId();
  const confirmed = typed.trim() === CONFIRM_WORD;

  function close() {
    if (isPending) return;
    dialogRef.current?.close();
  }

  function handleDelete() {
    if (!confirmed) return;
    setError(null);

    startTransition(async () => {
      let result: ActionResult;
      try {
        result = await deleteAccount();
      } catch {
        setError(GENERIC_ERROR);
        return;
      }

      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-md flex-col items-start">
          <p className="text-sm leading-relaxed text-foreground-secondary">
            This removes your account and every moment, photo and setting in it, for good. Want a
            copy first?
          </p>
          <Link
            href="/settings#export"
            className="-ml-1 inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-semibold text-teal underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            Export your data first
          </Link>
        </div>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => dialogRef.current?.showModal()}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-error/40 px-4 text-sm font-semibold text-error transition-colors hover:bg-terracotta-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
        >
          Delete account…
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => {
          setTyped("");
          setError(null);
        }}
        onCancel={(event) => {
          // Escape must not abandon a delete that is already running.
          if (isPending) event.preventDefault();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-2xl border border-b-0 border-border bg-surface p-0 text-foreground backdrop:bg-foreground/40 md:inset-0 md:m-auto md:h-fit md:max-w-md md:rounded-2xl md:border-b"
      >
        <div className="flex flex-col gap-5 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-terracotta-light text-error">
              <TriangleAlert className="size-6" aria-hidden />
            </span>
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="-mr-2 -mt-2 grid size-11 place-items-center rounded-lg text-foreground-secondary hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h2 id={titleId} className="text-2xl font-bold text-foreground">
              Delete your account?
            </h2>
            <p className="text-sm leading-relaxed text-foreground-secondary">
              Every moment and photo you’ve saved will be permanently deleted. This can’t be
              undone.
            </p>
          </div>

          {error && <FormAlert>{error}</FormAlert>}

          <div className="flex flex-col gap-2">
            <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
              Type <span className="font-bold text-error">{CONFIRM_WORD}</span> to confirm
            </label>
            <input
              id={inputId}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              disabled={isPending}
              className="min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-base text-foreground transition-colors focus:border-error focus:outline-none focus:ring-2 focus:ring-error/30 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={close}
              disabled={isPending}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-surface px-5 text-base font-semibold text-foreground hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-60"
            >
              Keep my account
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!confirmed || isPending}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-error px-5 text-base font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
                  Deleting…
                </>
              ) : (
                "Delete my account"
              )}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
