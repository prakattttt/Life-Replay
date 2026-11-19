import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { nextCookies } from "better-auth/next-js";

import { db } from "./db";
import { sendEmail } from "./email";
import * as schema from "../db/auth-schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,

    sendResetPassword: async ({ user, url }) => {
      const safeUrl = escapeHtml(url);

      await sendEmail({
        to: user.email,
        subject: "Reset your Life Replay password",
        text: `Use this link to choose a new password. It expires in one hour:\n${url}`,
        html: `Use this link to choose a new password. It expires in one hour: <a href="${safeUrl}">reset your password</a>.`,
      });
    },
  },

  user: {
    deleteUser: {
      enabled: true,
    },

    changeEmail: {
      enabled: true,

      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        const safeUrl = escapeHtml(url);

        await sendEmail({
          to: user.email,
          subject: "Confirm your Life Replay email change",
          text: `You requested to change your Life Replay email to ${newEmail}. Confirm this change:\n${url}`,
          html: `You requested to change your Life Replay email to ${newEmail}. <a href="${safeUrl}">Confirm this change</a>.`,
        });
      },
    },
  },

  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,

    sendVerificationEmail,
  },

  plugins: [nextCookies()],
});

async function sendVerificationEmail({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}): Promise<void> {
  const safeUrl = escapeHtml(url);

  await sendEmail({
    to: user.email,
    subject: "Verify your Life Replay email",
    text: `Confirm your email address using this link:\n${url}`,
    html: `
      <h2>Verify your email address</h2>
      <p>Confirm your email address to secure your Life Replay account.</p>
      <a href="${safeUrl}">Verify your email</a>
      <p>This link expires in one hour.</p>
    `,
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&#39;");
}
