import type { Metadata } from "next";
import { ProfileEditContent } from "@/components/profile/profile-edit-content";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your Life Replay profile and personal account details.",
};

export default function ProfilePage() {
  return <ProfileEditContent />;
}
