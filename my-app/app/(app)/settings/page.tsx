import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileDataProvider } from "@/components/profile/profile-data-provider";
import { SettingsContent } from "@/components/profile/settings-content";
import { getSession } from "@/features/auth/session";
import { getProfileData } from "@/features/profile/queries";

export const metadata: Metadata = {
  title: "Settings",
  description: "Adjust your Life Replay appearance, privacy, and notification settings.",
};

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const data = await getProfileData(session.user);

  return (
    <ProfileDataProvider initialData={data}>
      <SettingsContent />
    </ProfileDataProvider>
  );
}
