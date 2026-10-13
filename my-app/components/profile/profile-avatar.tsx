import { cn } from "@/app/lib/utils";

type ProfileAvatarProps = {
  name: string;
  imageUrl?: string | null;
  size?: "md" | "lg";
  className?: string;
};

const sizes = {
  md: "size-12 text-base",
  lg: "size-20 text-2xl md:size-24 md:text-3xl",
} as const;

/** The user's photo, or their initials on a soft teal circle when there is none. */
export function ProfileAvatar({ name, imageUrl, size = "md", className }: ProfileAvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full bg-teal-light font-bold text-teal ring-4 ring-background-secondary",
        sizes[size],
        className,
      )}
    >
      {imageUrl ? (
        // Decorative: the name is right beside it. Swap for next/image once Cloudinary is set up.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="size-full object-cover" />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </span>
  );
}
