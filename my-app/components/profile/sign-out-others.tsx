"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, MonitorSmartphone } from "lucide-react";
import { signOutOtherDevices } from "@/features/profile/profile-api";
import { GENERIC_ERROR, type ActionResult } from "@/features/profile/types";

/** Ends every session except this one. Handy after using a shared computer. */
export function SignOutOthers() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      let result: ActionResult;
      try {
        result = await signOutOtherDevices();
      } catch {
        result = { ok: false, message: GENERIC_ERROR };
      }

      if (result.ok) toast.success("Signed out of your other devices");
      else toast.error(result.message);
    });
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-md text-sm leading-relaxed text-foreground-secondary">
        Signed in on a shared or old device? This ends every session except the one you’re
        using now.
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
        ) : (
          <MonitorSmartphone className="size-4" aria-hidden />
        )}
        {isPending ? "Signing out…" : "Sign out other devices"}
      </button>
    </div>
  );
}
