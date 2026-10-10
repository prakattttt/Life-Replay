"use client";

import { useEffect, useId, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { createMoment, type CreateMomentResult } from "@/actions/moments";
import { clearDraft, loadDraft, saveDraft } from "@/features/moments/draft";
import { suggestCategory } from "@/features/moments/suggest-category";
import { whenToIso, type When } from "@/features/moments/when";
import { buildTimelineHref } from "@/features/timeline/params";
import {
  createMomentSchema,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  type CreateMomentInput,
} from "@/schemas/moment";
import { categoryMeta } from "./category";
import { CategoryPicker } from "./category-picker";
import { PhotoPicker } from "./photo-picker";
import { WhenPicker } from "./when-picker";

const DEFAULT_VALUES: CreateMomentInput = {
  title: "",
  description: "",
  category: "other",
  occurredAt: "",
};

const labelClass =
  "text-[11px] font-semibold uppercase tracking-widest text-foreground-muted";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal";

type CaptureFormProps = {
  /** Today's rotating prompt, used as the headline placeholder. */
  prompt: string;
};

/**
 * The capture flow. Designed so the common case is: type a few words, press
 * Enter. Category is picked for you, the time is "just now", and everything
 * else is optional. Unsent text is kept as a draft on this device.
 */
export function CaptureForm({ prompt }: CaptureFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [when, setWhen] = useState<When>({ kind: "now" });
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [restored, setRestored] = useState(false);
  
  /** Counts successful saves. Also remounts the photo picker to clear it. */
  const [savedCount, setSavedCount] = useState(0);

  const titleId = useId();
  const titleErrorId = useId();
  const descriptionId = useId();
  const descriptionErrorId = useId();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<CreateMomentInput>({
    resolver: zodResolver(createMomentSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const title = useWatch({ control, name: "title" });
  const description = useWatch({ control, name: "description" });
  const suggested = useMemo(() => suggestCategory(title), [title]);

  // On arrival: bring back an unsent draft, then put the cursor in the headline.
  useEffect(() => {
    const draft = loadDraft(); // reads browser storage, so it can only run here
    let restoredTimer: number | undefined;
    if (draft) {
      reset({ ...DEFAULT_VALUES, ...draft });
      restoredTimer = window.setTimeout(() => setRestored(true), 0);
    }
    setFocus("title");
    return () => {
      if (restoredTimer !== undefined) window.clearTimeout(restoredTimer);
    };
  }, [reset, setFocus]);

  // Keep the category in step with the headline until the user picks one.
  useEffect(() => {
    if (categoryTouched) return;
    setValue("category", suggested ?? "other");
  }, [categoryTouched, suggested, setValue]);

  // Save the draft shortly after typing stops.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDraftSaved(saveDraft({ title, description }));
    }, 400);
    return () => window.clearTimeout(timer);
  }, [title, description]);

  // After a successful save, the form re-enables and the cursor goes back to
  // the headline, ready for the next moment.
  useEffect(() => {
    if (savedCount > 0 && !isPending) setFocus("title");
  }, [savedCount, isPending, setFocus]);

  function changeWhen(next: When) {
    setWhen(next);
    // The old time error no longer applies once the time has changed.
    clearErrors("occurredAt");
  }

  function startFresh() {
    clearDraft();
    reset(DEFAULT_VALUES);
    setCategoryTouched(false);
    setRestored(false);
    setDraftSaved(false);
    setFocus("title");
  }

  function onValid(values: CreateMomentInput) {
    setFormError(null);
    setImageError(null);

    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("description", values.description);
    formData.set("category", values.category);
    formData.set("occurredAt", values.occurredAt);
    if (image) formData.set("image", image);

    startTransition(async () => {
      let result: CreateMomentResult;
      try {
        result = await createMoment(formData);
      } catch {
        setFormError(
          "We couldn’t reach the server. Your text is safe as a draft, so try again in a moment.",
        );
        return;
      }

      if (!result.ok) {
        const fieldErrors = result.fieldErrors ?? {};
        if (fieldErrors.title) setError("title", { message: fieldErrors.title });
        if (fieldErrors.description) {
          setError("description", { message: fieldErrors.description });
        }
        if (fieldErrors.occurredAt) {
          setError("occurredAt", { message: fieldErrors.occurredAt });
        }
        if (fieldErrors.image) setImageError(fieldErrors.image);
        if (Object.keys(fieldErrors).length === 0) setFormError(result.message);
        return;
      }

      clearDraft();
      reset(DEFAULT_VALUES);
      setCategoryTouched(false);
      setRestored(false);
      setDraftSaved(false);
      setWhen({ kind: "now" });
      setImage(null);
      setSavedCount((count) => count + 1);

      const savedAt = new Date(result.occurredAt);
      toast.success("Moment saved", {
        description: "Added to your timeline.",
        action: {
          label: "View",
          onClick: () =>
            router.push(
              buildTimelineHref({
                year: savedAt.getFullYear(),
                month: savedAt.getMonth() + 1,
                category: null,
                page: 1,
              }),
            ),
        },
      });
    });
  }

  function handleSubmitEvent(event: React.FormEvent<HTMLFormElement>) {
    // "Just now" must mean the moment of saving, not when the page opened.
    setValue("occurredAt", whenToIso(when));
    void handleSubmit(onValid)(event);
  }

  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
  }

  const titleRemaining = MAX_TITLE_LENGTH - title.length;
  const descriptionRemaining = MAX_DESCRIPTION_LENGTH - description.length;

  const categoryHint =
    !categoryTouched && suggested
      ? `Picked ${categoryMeta[suggested].label} from your headline. Tap another to change it.`
      : null;

  return (
    <form
      onSubmit={handleSubmitEvent}
      onKeyDown={handleFormKeyDown}
      noValidate
      aria-busy={isPending}
      className="flex flex-col"
    >
      {/* Mobile header: Cancel / title / draft status (Figma: Create Moment) */}
      <div className="sticky top-0 z-20 -mx-4 flex h-14 items-center justify-between border-b border-border bg-background/90 px-2 backdrop-blur md:hidden">
        <Link
          href="/dashboard"
          className={`inline-flex min-h-11 w-24 items-center rounded-lg px-3 text-sm font-medium text-foreground-secondary ${focusRing}`}
        >
          Cancel
        </Link>
        <p
          aria-hidden
          className="flex items-center gap-2 text-[19px] font-semibold text-foreground"
        >
          <span className="size-1.5 rounded-full bg-amber-dark" />
          New moment
        </p>
        <p
          aria-live="polite"
          className="flex w-24 items-center justify-end gap-1 pr-3 text-[11px] font-semibold text-foreground-muted"
        >
          {draftSaved && (
            <>
              <Check className="size-3" aria-hidden />
              Draft saved
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-6 pt-5 md:rounded-2xl md:border md:border-border md:bg-surface md:p-8 md:pt-8 md:shadow-subtle">
        {restored && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-amber-light py-1 pl-3 pr-1 text-sm text-foreground">
            <p>Picked up where you left off.</p>
            <button
              type="button"
              onClick={startFresh}
              className={`inline-flex min-h-11 items-center rounded-lg px-3 font-bold text-teal ${focusRing}`}
            >
              Start fresh
            </button>
          </div>
        )}

        {/* Disabled while saving so nothing changes mid-submit. */}
        <fieldset disabled={isPending} className="contents">
          <WhenPicker value={when} onChange={changeWhen} error={errors.occurredAt?.message} />

          {/* The memory: the only field that really matters */}
          <div className="flex flex-col gap-2">
            <label htmlFor={titleId} className={labelClass}>
              The memory
            </label>
            <div className="border-b-2 border-border pb-2 transition-colors focus-within:border-teal">
              <textarea
                id={titleId}
                rows={1}
                enterKeyHint="send"
                autoComplete="off"
                placeholder={prompt}
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={errors.title ? titleErrorId : undefined}
                {...register("title")}
                onKeyDown={(event) => {
                  // A headline is one line: Enter saves instead of adding a line break.
                  if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
                  event.preventDefault();
                  if (!event.metaKey && !event.ctrlKey) {
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                className="field-sizing-content min-h-14 w-full resize-none bg-transparent text-2xl font-semibold leading-snug text-foreground placeholder:text-foreground-muted focus:outline-none"
              />
            </div>
            {(errors.title || title.length >= MAX_TITLE_LENGTH - 30) && (
              <div className="flex items-start justify-between gap-3">
                {errors.title ? (
                  <p id={titleErrorId} role="alert" className="text-sm text-error">
                    {errors.title.message}
                  </p>
                ) : (
                  <span />
                )}
                {title.length >= MAX_TITLE_LENGTH - 30 && (
                  <p
                    className={`shrink-0 text-xs font-semibold ${
                      titleRemaining < 0 ? "text-error" : "text-foreground-muted"
                    }`}
                  >
                    {titleRemaining} left
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Impressions: optional detail */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor={descriptionId} className={labelClass}>
                Impressions
              </label>
              <span className="text-[11px] font-semibold text-foreground-muted">
                Optional
              </span>
            </div>
            <div className="rounded-xl border border-border bg-background-section px-4 py-3 transition-colors focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/30 md:bg-surface-subtle">
              <textarea
                id={descriptionId}
                placeholder="A sound, a smell, who was there… or leave it empty."
                aria-invalid={errors.description ? true : undefined}
                aria-describedby={errors.description ? descriptionErrorId : undefined}
                {...register("description")}
                className="field-sizing-content max-h-60 min-h-18 w-full resize-none bg-transparent text-[15px] leading-relaxed text-foreground placeholder:text-foreground-muted focus:outline-none"
              />
              {description.length >= MAX_DESCRIPTION_LENGTH - 200 && (
                <p
                  className={`text-right text-[11px] font-semibold ${
                    descriptionRemaining < 0 ? "text-error" : "text-foreground-muted"
                  }`}
                >
                  {descriptionRemaining} left
                </p>
              )}
            </div>
            {errors.description && (
              <p id={descriptionErrorId} role="alert" className="text-sm text-error">
                {errors.description.message}
              </p>
            )}
          </div>

          <CategoryPicker
            field={register("category", { onChange: () => setCategoryTouched(true) })}
            hint={categoryHint}
          />

          <PhotoPicker key={savedCount} onChange={setImage} error={imageError} />
        </fieldset>

        {formError && (
          <p role="alert" className="rounded-lg bg-background-section px-3 py-2 text-sm text-error">
            {formError}
          </p>
        )}

        {/* Pinned on mobile so Save is always one tap away */}
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-background/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:static md:mx-0 md:flex md:items-center md:justify-between md:border-0 md:bg-transparent md:p-0 md:pt-2 md:backdrop-blur-none">
          <p className="hidden text-xs text-foreground-muted md:block">
            <kbd className="rounded border border-border bg-background-secondary px-1.5 py-0.5 font-sans text-[11px] font-semibold">
              Ctrl / ⌘
            </kbd>{" "}
            +{" "}
            <kbd className="rounded border border-border bg-background-secondary px-1.5 py-0.5 font-sans text-[11px] font-semibold">
              Enter
            </kbd>{" "}
            to save
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className={`hidden min-h-11 items-center rounded-lg px-4 text-sm font-semibold text-foreground-secondary hover:bg-background-secondary md:inline-flex ${focusRing}`}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal px-8 text-[17px] font-semibold text-background shadow-subtle transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-70 md:w-auto"
            >
              {isPending ? (
                <Loader2 className="size-4 motion-safe:animate-spin" aria-hidden />
              ) : (
                <Check className="size-4" aria-hidden />
              )}
              {isPending ? "Saving…" : "Save moment"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
