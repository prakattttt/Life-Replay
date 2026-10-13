import { cn } from "@/app/lib/utils";

type SectionCardProps = {
  /** Used for the heading link target (#id) and the aria wiring. */
  id: string;
  title: string;
  description?: React.ReactNode;
  /** "danger" tints the border for destructive areas like deleting the account. */
  tone?: "default" | "danger";
  children: React.ReactNode;
};

/** A titled card. Every group of controls on the profile and settings pages sits in one. */
export function SectionCard({ id, title, description, tone = "default", children }: SectionCardProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "scroll-mt-24 rounded-2xl border bg-surface p-5 shadow-subtle md:p-8",
        tone === "danger" ? "border-error/30" : "border-border",
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h2
          id={`${id}-title`}
          className={cn(
            "text-xl font-bold",
            tone === "danger" ? "text-error" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="max-w-xl text-pretty text-sm leading-relaxed text-foreground-secondary">
            {description}
          </p>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
