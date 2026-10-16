"use client";

import { useEffect } from "react";
import { Lock } from "lucide-react";
import { updateSettings } from "@/features/profile/profile-api";
import type { Settings } from "@/features/profile/types";
import { usePhotoPrivacy } from "@/components/providers/photo-privacy-provider";
import { ToggleRow } from "./toggle-row";
import { useAutoSave } from "./use-auto-save";

export function PrivacySettings({ initial }: { initial: Settings["privacy"] }) {
  const { values, change, isPending } = useAutoSave(initial, (patch) => updateSettings({ privacy: patch }));
  const { setBlurPhotos } = usePhotoPrivacy();

  useEffect(() => {
    setBlurPhotos(values.blurPhotos);
  }, [setBlurPhotos, values.blurPhotos]);

  return (
    <div>
      <div className="divide-y divide-border-subtle">
        <ToggleRow
          id="blur-photos"
          label="Blur photos until tapped"
          description="Keeps your photos private if someone glances at your screen."
          checked={values.blurPhotos}
          disabled={isPending}
          onChange={(blurPhotos) => change({ blurPhotos })}
        />
        <ToggleRow
          id="discreet-emails"
          label="Keep emails discreet"
          description="Reminders say you have memories from today, without showing what they say."
          checked={values.discreetEmails}
          disabled={isPending}
          onChange={(discreetEmails) => change({ discreetEmails })}
        />
      </div>

      <p className="mt-3 flex items-center gap-2 text-sm text-foreground-muted">
        <Lock className="size-4 shrink-0" aria-hidden />
        Your moments are only visible to you. We never share them.
      </p>
    </div>
  );
}
