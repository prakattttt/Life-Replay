import { Loader2 } from "lucide-react";

type SubmitButtonProps = {
  pending: boolean;
  children: React.ReactNode;
  /** Shown while pending, e.g. "Signing in…". */
  pendingLabel: string;
};

/** The primary action on every auth form. Disabled while the request runs. */
export function SubmitButton({ pending, children, pendingLabel }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal px-5 text-base font-semibold text-background transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
