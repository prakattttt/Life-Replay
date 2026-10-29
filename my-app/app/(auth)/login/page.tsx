import type { Metadata } from "next";
import { AuthHeading } from "@/components/auth/auth-heading";
import { AuthSwitch } from "@/components/auth/auth-switch";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to revisit your personal Life Replay archive.",
};

export default function LoginPage() {
  return (
    <>
      <AuthHeading
        eyebrow="Welcome back"
        title="Sign in to your archive"
        description="Your moments are right where you left them."
      />
      <LoginForm />
      <AuthSwitch
        prompt="New to Life Replay?"
        label="Create an account"
        href="/register"
      />
    </>
  );
}
