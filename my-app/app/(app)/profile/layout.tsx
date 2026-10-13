import { ProfileHeader } from "@/components/profile/profile-header";
import { getProfile } from "@/features/profile/mock-data";

/**
 * Frame for /profile and /profile/security: the identity header with the
 * logout button and tabs, then whichever page is open.
 */
export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 md:gap-10 px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10 xl:px-10">
      <ProfileHeader profile={profile} />
      {children}
    </div>
  );
}
