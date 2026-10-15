import { ProfileDataProvider } from "@/components/profile/profile-data-provider";
import { getSession } from "@/features/auth/session";
import { getProfileData } from "@/features/profile/queries";
import { redirect } from "next/navigation";
/**
 * Frame for /profile and /profile/security: the identity header with the
 * logout button and tabs, then whichever page is open.
 */
export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const data = await getProfileData(session.user);

  return (
    <ProfileDataProvider initialData={data} showHeader>
      {children}
    </ProfileDataProvider>
  );
}
