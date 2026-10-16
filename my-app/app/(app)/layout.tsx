import { AppShell } from "@/components/layout/app-shell";
import { PhotoPrivacyProvider } from "@/components/providers/photo-privacy-provider";
import { userSettings } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = { name: session.user.name, email: session.user.email };
  const [settings] = await db
    .select({ blurPhotos: userSettings.blurPhotos })
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  return (
    <PhotoPrivacyProvider initialBlurPhotos={settings?.blurPhotos ?? false}>
      <AppShell user={user}>{children}</AppShell>
    </PhotoPrivacyProvider>
  );
}
