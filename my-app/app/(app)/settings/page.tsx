import type { Metadata } from "next";
import { ProfileDataProvider } from "@/components/profile/profile-data-provider";
import { SettingsContent } from "@/components/profile/settings-content";

export const metadata: Metadata = { title: "Settings · Life Replay" };

export default function SettingsPage() {
  return (
    <ProfileDataProvider>
      <SettingsContent />
    </ProfileDataProvider>
  );
}
