import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

type MomentImageProps = {
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
};

/**
 * Fills its parent, which must be `relative` and have a size.
 * Remote images need `images.remotePatterns` in next.config (e.g. Cloudinary).
 */
export function MomentImage({ src, alt, sizes, className }: MomentImageProps) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 grid place-items-center bg-linear-to-br from-amber-light via-background-secondary to-teal-light",
          className,
        )}
      >
        <ImageIcon className="size-8 text-foreground-disabled" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
