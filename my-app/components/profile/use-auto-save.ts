"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { GENERIC_ERROR, type ActionResult } from "@/features/profile/types";

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
  const valuesRef = useRef(initial);
  const savedRef = useRef(initial);
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  function change(patch: Partial<T>) {
    const optimistic = { ...valuesRef.current, ...patch };
    valuesRef.current = optimistic;
    setValues(optimistic);

    startTransition(async () => {
      const queuedSave = queueRef.current.then(async () => {
        let result: ActionResult;
        try {
          result = await save(patch);
        } catch {
          result = { ok: false, message: GENERIC_ERROR };
        }

        if (!result.ok) {
          const current = valuesRef.current;
          const reverted = { ...current };
          for (const key of Object.keys(patch) as (keyof T)[]) {
            if (Object.is(current[key], optimistic[key])) {
              Object.assign(reverted, { [key]: savedRef.current[key] });
            }
          }
          valuesRef.current = reverted;
          setValues(reverted);
          toast.error(result.message, { id: "settings-saved" });
          return;
        }

        savedRef.current = { ...savedRef.current, ...patch };
        toast.success("Settings updated", { id: "settings-saved" });
      });
      queueRef.current = queuedSave;
      await queuedSave;
    });
  }

  return { values, change, isPending };
}
