import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a secure link to reset your Life Replay password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
