"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { GENERIC_ERROR, type ActionResult } from "@/features/profile/profile-actions";

/**
 * Instant-save behaviour for switches and selects: the screen updates at once,
 * the change is sent in the background, and if it fails the control springs
 * back and a toast says why. `save` receives only what changed.
 */
export function useAutoSave<T extends object>(
  initial: T,
  save: (patch: Partial<T>) => Promise<ActionResult>,
) {
  const [values, setValues] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function change(patch: Partial<T>) {
    const previous = values;
    setValues({ ...values, ...patch });

    startTransition(async () => {
      let result: ActionResult;
      try {
        result = await save(patch);
      } catch {
        result = { ok: false, message: GENERIC_ERROR };
      }

      if (!result.ok) {
        setValues(previous);
        toast.error(result.message, { id: "settings-saved" });
        return;
      }
      // One shared id: rapid changes replace the toast instead of stacking them.
      toast.success("Settings updated", { id: "settings-saved" });
    });
  }

  return { values, change, isPending };
}
