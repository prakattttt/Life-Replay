import { cn } from "@/app/lib/utils";

type UserAvatarProps = {
  name: string;
  className?: string;
};

/** Initials avatar. Swap for an image once profile photos exist. */
export function UserAvatar({ name, className }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full bg-teal-light text-xs font-bold text-teal",
        className,
      )}
    >
      {initials}
    </span>
  );
}
