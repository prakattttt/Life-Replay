"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, ImageIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { usePhotoPrivacy } from "@/components/providers/photo-privacy-provider";

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
  const { blurPhotos, revision } = usePhotoPrivacy();
  const [revealedRevision, setRevealedRevision] = useState<number | null>(null);
  const isBlurred = blurPhotos && revealedRevision !== revision;

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
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(
          "object-cover transition-[filter,transform] duration-200 motion-reduce:transition-none",
          isBlurred && "scale-105 blur-xl",
          className,
        )}
      />
      {isBlurred && (
        <button
          type="button"
          onClick={() => setRevealedRevision(revision)}
          aria-label="Reveal photo"
          className="absolute inset-0 z-20 grid place-items-center bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal"
        >
          <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface/95 px-4 text-sm font-semibold text-foreground shadow-subtle">
            <Eye className="size-4" aria-hidden />
            Show photo
          </span>
        </button>
      )}
    </>
  );
}
