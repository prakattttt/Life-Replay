import { Resend } from "resend";

type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(message: EmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error("Email delivery is not configured.");
  }

  let result: Awaited<ReturnType<Resend["emails"]["send"]>>;
  try {
    result = await new Resend(apiKey).emails.send({ ...message, from });
  } catch (error) {
    console.error(
      "Resend email request failed",
      error instanceof Error ? error.message : "Unknown email provider error",
    );
    throw new Error("The email provider request failed.");
  }

  if (result.error) {
    console.error("Resend rejected an email", result.error.message);
    throw new Error("The email provider rejected the message.");
  }
}

export function appUrl(path: string): string {
  const baseUrl = process.env.BETTER_AUTH_URL;
  if (!baseUrl) throw new Error("BETTER_AUTH_URL is not configured.");
  return new URL(path, baseUrl).toString();
}
