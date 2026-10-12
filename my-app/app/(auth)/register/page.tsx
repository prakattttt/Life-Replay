import type { Metadata } from "next";
import { AuthHeading } from "@/components/auth/auth-heading";
import { AuthSwitch } from "@/components/auth/auth-switch";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create account · Life Replay" };

export default function RegisterPage() {
  return (
    <>
      <AuthHeading
        eyebrow="Start your archive"
        title="Create your account"
        description="It takes under a minute. Your first moment can take ten seconds."
      />
      <RegisterForm />
      <AuthSwitch
        prompt="Already have an account?"
        label="Sign in"
        href="/login"
      />
    </>
  );
}
