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
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const safeUrl = url
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
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
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail
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
  const safeUrl = url
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  await sendEmail({
    to: user.email,
    subject: "Verify your Life Replay email",
    text: `Confirm your email address using this link:\n${url}`,
    html: `Confirm your email address by <a href="${safeUrl}">verifying your email</a>.`,
  });
}