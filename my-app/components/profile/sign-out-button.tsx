"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { signOut } from "@/actions/auth-action";
import { GENERIC_ERROR } from "@/features/profile/profile-actions";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const result = await signOut();
        if (!result.ok) {
          toast.error(result.message);
          return;
        }
      } catch {
        toast.error(GENERIC_ERROR);
        return;
      }
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {isPending ? (
        <Loader2
          className="size-4 animate-spin motion-reduce:animate-none"
          aria-hidden
        />
      ) : (
        <LogOut className="size-4" aria-hidden />
      )}
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
