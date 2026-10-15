import type { Metadata } from "next";
import { ProfileEditContent } from "@/components/profile/profile-edit-content";

export const metadata: Metadata = { title: "Profile · Life Replay" };

export default function ProfilePage() {
  return <ProfileEditContent />;
}
