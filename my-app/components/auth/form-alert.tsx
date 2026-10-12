import { CircleAlert } from "lucide-react";

/** A form-level problem (wrong password, server unreachable). Announced to screen readers. */
export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-terracotta/30 bg-terracotta-light px-4 py-3 text-sm leading-relaxed text-foreground"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-error" aria-hidden />
      <p>{children}</p>
    </div>
  );
}
