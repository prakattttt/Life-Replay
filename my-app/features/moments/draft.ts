/**
 * Unsent text is kept on this device so a dropped connection, an accidental
 * back-swipe or a closed tab never loses a thought. Browser storage can be
 * missing or throw (private windows, blocked storage), so every call is
 * wrapped and the form works without it. Call these from the browser only.
 */
const KEY = "life-replay:capture-draft:v1";

export type Draft = { title: string; description: string };

export function loadDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as Draft).title === "string" &&
      typeof (parsed as Draft).description === "string"
    ) {
      const { title, description } = parsed as Draft;
      return { title, description };
    }
    return null;
  } catch {
    return null;
  }
}

/** Returns true when something was actually stored. */
export function saveDraft(draft: Draft): boolean {
  try {
    if (!draft.title.trim() && !draft.description.trim()) {
      window.localStorage.removeItem(KEY);
      return false;
    }
    window.localStorage.setItem(KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clean up if storage isn't available.
  }
}
