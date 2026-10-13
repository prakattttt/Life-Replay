import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { DeleteAccount } from "@/components/profile/delete-account";
import { SectionCard } from "@/components/profile/section-card";
import { SignOutOthers } from "@/components/profile/sign-out-others";

export const metadata: Metadata = { title: "Security · Life Replay" };

export default function SecurityPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        id="password"
        title="Password"
        description="Use a password you don’t use anywhere else."
      >
        <ChangePasswordForm />
      </SectionCard>

      <SectionCard
        id="devices"
        title="Signed-in devices"
        description="Where your account is open right now."
      >
        <SignOutOthers />
      </SectionCard>

      <SectionCard id="delete" title="Delete account" tone="danger">
        <DeleteAccount />
      </SectionCard>
    </div>
  );
}
