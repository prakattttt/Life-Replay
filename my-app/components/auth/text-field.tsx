import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/app/lib/utils";

const inputClass =
  "min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-base text-foreground placeholder:text-foreground-muted transition-colors hover:border-border-strong focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 disabled:opacity-60 aria-[invalid=true]:border-error aria-[invalid=true]:ring-error/20";

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  error?: string;
  hint?: string;
  labelAction?: ReactNode;
  trailing?: ReactNode;
};

export function TextField({
  label,
  error,
  hint,
  labelAction,
  trailing,
  className,
  ...inputProps
}: TextFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </label>
        {labelAction}
      </div>

      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(inputClass, trailing && "pr-14", className)}
          {...inputProps}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>
        )}
      </div>

      {message && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={cn("text-sm", error ? "text-error" : "text-foreground-muted")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
