import type { Metadata } from "next";

import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",

  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: process.env.SITE_URL
    ? new URL(process.env.SITE_URL)
    : undefined,
  title: {
    default: "Life Replay",
    template: "%s | Life Replay",
  },
  applicationName: "Life Replay",
  description:
    "A private archive for capturing everyday moments and rediscovering memories over time.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Life Replay",
    title: "Life Replay",
    description:
      "A private archive for capturing everyday moments and rediscovering memories over time.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Life Replay",
    description:
      "A private archive for capturing everyday moments and rediscovering memories over time.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
