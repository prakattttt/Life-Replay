import { format } from "date-fns";
import type { Profile } from "@/features/profile/mock-data";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileTabs } from "./profile-tabs";
import { SignOutButton } from "./sign-out-button";

/**
 * Top of every profile page: who you are, three quiet facts about your
 * archive (no streaks or scores), the logout button and the section tabs.
 */
export function ProfileHeader({ profile }: { profile: Profile }) {
  const facts = [
    { label: "Member since", value: format(profile.createdAt, "MMM yyyy") },
    { label: "Moments kept", value: profile.momentCount.toLocaleString("en-US") },
    {
      label: "First memory",
      value: profile.firstMomentAt ? format(profile.firstMomentAt, "MMM yyyy") : "Not yet",
    },
  ];

  return (
    <header className="flex flex-col gap-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4 md:gap-5">
          <ProfileAvatar name={profile.name} imageUrl={profile.imageUrl} size="lg" />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-dark">
              Your account
            </p>
            <h1 className="truncate text-[28px] font-bold leading-tight tracking-tight text-foreground md:text-[40px]">
              {profile.name}
            </h1>
            <p className="truncate text-foreground-secondary">{profile.email}</p>
          </div>
        </div>

        <SignOutButton className="w-full md:w-auto" />
      </div>

      <dl className="grid grid-cols-3 gap-2 rounded-xl bg-background-secondary p-3 md:flex md:w-fit md:gap-6 md:px-5">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-0.5 px-1">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              {fact.label}
            </dt>
            <dd className="text-lg font-bold text-foreground">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <ProfileTabs />
    </header>
  );
}
