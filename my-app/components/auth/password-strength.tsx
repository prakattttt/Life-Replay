import { cn } from "@/app/lib/utils";
import { getPasswordStrength } from "@/features/auth/password";

const barColour = ["", "bg-terracotta", "bg-amber", "bg-teal", "bg-teal"] as const;

/**
 * Four-segment hint under a new-password field. The label carries the meaning
 * (colour is only a bonus), and screen readers hear it politely as it changes.
 */
export function PasswordStrength({ password }: { password: string }) {
  const { score, label } = getPasswordStrength(password);

  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div aria-hidden className="grid flex-1 grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={cn(
              "h-1.5 rounded-full transition-colors",
              score >= segment ? barColour[score] : "bg-border",
            )}
          />
        ))}
      </div>
      <p className="min-w-16 text-right text-xs font-semibold text-foreground-secondary">
        {label ? <span className="sr-only">Password strength: </span> : null}
        {label || "Strength"}
      </p>
    </div>
  );
}
