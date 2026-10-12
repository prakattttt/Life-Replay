type AuthHeadingProps = {
  /** Small amber label above the title, in the same voice as "On this day". */
  eyebrow: string;
  title: string;
  description: React.ReactNode;
};

export function AuthHeading({ eyebrow, title, description }: AuthHeadingProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-dark">
        {eyebrow}
      </p>
      <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-pretty leading-relaxed text-foreground-secondary">{description}</p>
    </div>
  );
}
