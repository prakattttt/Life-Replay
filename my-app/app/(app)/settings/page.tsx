import type { Metadata } from "next";
import { AppearanceSettings } from "@/components/profile/appearance-settings";
import { DataExport } from "@/components/profile/data-export";
import { NotificationSettings } from "@/components/profile/notification-settings";
import { PrivacySettings } from "@/components/profile/privacy-settings";
import { SectionCard } from "@/components/profile/section-card";
import { SettingsNav } from "@/components/profile/settings-nav";
import { getProfile, getSettings } from "@/features/profile/mock-data";

export const metadata: Metadata = { title: "Settings · Life Replay" };

export default async function SettingsPage() {
  // TODO: swap both for your session-scoped queries (see features/profile/mock-data.ts).
  const [profile, settings] = await Promise.all([getProfile(), getSettings()]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 md:gap-10 px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10 xl:px-10">
      <header className="flex max-w-xl flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-dark">Preferences</p>
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-foreground md:text-[44px]">
          Settings
        </h1>
        <p className="text-base leading-relaxed text-foreground-secondary">
          Make Life Replay feel like yours. Changes save as you make them.
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10">
        <SettingsNav />

        <div className="flex min-w-0 flex-col gap-6">
          <SectionCard
            id="appearance"
            title="Appearance"
            description="Choose how the archive looks on this device."
          >
            <AppearanceSettings />
          </SectionCard>

          <SectionCard
            id="notifications"
            title="Notifications"
            description="Gentle nudges, never noise. Turn off whatever you don’t want."
          >
            <NotificationSettings initial={settings.notifications} email={profile.email} />
          </SectionCard>

          <SectionCard
            id="privacy"
            title="Privacy"
            description="Your archive is personal. These keep it that way."
          >
            <PrivacySettings initial={settings.privacy} />
          </SectionCard>

          <SectionCard
            id="export"
            title="Data export"
            description="Download a copy of every moment you’ve saved. It’s your archive, and you can take it with you."
          >
            <DataExport email={profile.email} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
