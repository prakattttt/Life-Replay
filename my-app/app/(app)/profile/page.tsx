import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { SectionCard } from "@/components/profile/section-card";
import { getProfile } from "@/features/profile/mock-data";

export const metadata: Metadata = { title: "Profile · Life Replay" };

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        id="details"
        title="Personal details"
        description="How you appear in Life Replay. Only you can see your archive."
      >
        <EditProfileForm
          profile={{ name: profile.name, email: profile.email, imageUrl: profile.imageUrl }}
        />
      </SectionCard>

      <Link
        href="/settings"
        className="group flex min-h-16 items-center gap-4 rounded-2xl border border-border-subtle bg-background-section p-4 transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal md:px-6"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-light text-amber-dark">
          <SlidersHorizontal className="size-5" aria-hidden />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-bold text-foreground">Settings</span>
          <span className="text-sm text-foreground-secondary">
            Appearance, notifications, privacy and data export
          </span>
        </span>
        <ChevronRight
          className="size-5 shrink-0 text-foreground-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden
        />
      </Link>
    </div>
  );
}
