"use client";

import { createContext, useContext } from "react";
import { ProfileHeader } from "./profile-header";
import type { ProfileData } from "@/features/profile/types";

type ProfileDataContextValue = { data: ProfileData };

const ProfileDataContext = createContext<ProfileDataContextValue | null>(null);

export function ProfileDataProvider({
  children,
  initialData,
  showHeader = false,
}: {
  children: React.ReactNode;
  initialData: ProfileData;
  showHeader?: boolean;
}) {
  return (
    <ProfileDataContext.Provider value={{ data: initialData }}>
      {showHeader ? (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 md:gap-10 px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10 xl:px-10">
          <ProfileHeader user={initialData.profile} />
          {children}
        </div>
      ) : (
        children
      )}
    </ProfileDataContext.Provider>
  );
}

export function useProfileData(): ProfileDataContextValue {
  const value = useContext(ProfileDataContext);
  if (!value) throw new Error("Profile data must be used within ProfileDataProvider.");
  return value;
}