"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ProfileHeader } from "./profile-header";
import { fetchProfileData } from "@/features/profile/profile-api";
import type { ProfileData } from "@/features/profile/types";

type ProfileDataContextValue = {
  data: ProfileData;
  refreshProfile: () => Promise<void>;
};

const ProfileDataContext = createContext<ProfileDataContextValue | null>(null);

export function ProfileDataProvider({
  children,
  showHeader = false,
}: {
  children: React.ReactNode;
  showHeader?: boolean;
}) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshProfile() {
    try {
      const result = await fetchProfileData();
      setData(result);
      setError(null);
    } catch {
      setError("We couldn’t load your account details. Please try again.");
    }
  }

  useEffect(() => {
    let active = true;
    fetchProfileData()
      .then((result) => {
        if (!active) return;
        setData(result);
      })
      .catch(() => {
        if (active) setError("We couldn’t load your account details. Please try again.");
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-border bg-background-section p-6 text-sm text-foreground-secondary">
        {error}
        <button
          type="button"
          onClick={() => void refreshProfile()}
          className="ml-2 font-semibold text-teal underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) {
    return <p role="status" className="py-8 text-sm text-foreground-muted">Loading your account…</p>;
  }

  return (
    <ProfileDataContext.Provider value={{ data, refreshProfile }}>
      {showHeader ? (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 md:gap-10 px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10 xl:px-10">
          <ProfileHeader user={data.profile} />
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