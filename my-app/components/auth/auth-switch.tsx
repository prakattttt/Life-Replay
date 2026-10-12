import Link from "next/link";

type AuthSwitchProps = {
  prompt: string;
  label: string;
  href: string;
};

/** "New here? Create an account": the link to the neighbouring auth screen. */
export function AuthSwitch({ prompt, label, href }: AuthSwitchProps) {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-sm text-foreground-secondary">
      {prompt}
      <Link
        href={href}
        className="inline-flex min-h-11 items-center rounded-lg px-1 font-bold text-teal hover:text-teal-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        {label}
      </Link>
    </p>
  );
}
