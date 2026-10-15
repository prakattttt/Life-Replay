"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ImageOff, Loader2 } from "lucide-react";
import { updateMoment } from "@/actions/moment-management-action";
import { CategoryPicker } from "@/components/moments/category-picker";
import { MomentImage } from "@/components/moments/moment-image";
import { PhotoPicker } from "@/components/moments/photo-picker";
import {
  createMomentSchema,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  type CreateMomentInput,
} from "@/schemas/moment";
import type { MomentCategory } from "@/types/moment";

type EditableMoment = {
  id: string;
  title: string;
  description: string | null;
  category: MomentCategory;
  occurredAt: string;
  timezone: string;
  imageUrl: string | null;
};

type MomentEditFormProps = { moment: EditableMoment };

function datePartsInTimezone(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

function localValueInTimezone(iso: string, timezone: string): string {
  const parts = datePartsInTimezone(new Date(iso), timezone);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function instantFromLocalValue(local: string, timezone: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!match) return null;

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const desired = Date.UTC(
    Number(yearText),
    Number(monthText) - 1,
    Number(dayText),
    Number(hourText),
    Number(minuteText),
  );
  let candidate = desired;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const parts = datePartsInTimezone(new Date(candidate), timezone);
    const renderedAsUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
    );
    const nextCandidate = desired - (renderedAsUtc - candidate);
    if (nextCandidate === candidate) break;
    candidate = nextCandidate;
  }

  const verified = datePartsInTimezone(new Date(candidate), timezone);
  if (
    verified.year !== yearText ||
    verified.month !== monthText ||
    verified.day !== dayText ||
    verified.hour !== hourText ||
    verified.minute !== minuteText
  ) {
    return null;
  }

  return new Date(candidate);
}

export function MomentEditForm({ moment }: MomentEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localDateTime, setLocalDateTime] = useState(() =>
    localValueInTimezone(moment.occurredAt, moment.timezone),
  );
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateMomentInput>({
    resolver: zodResolver(createMomentSchema),
    defaultValues: {
      title: moment.title,
      description: moment.description ?? "",
      category: moment.category,
      occurredAt: moment.occurredAt,
    },
  });

  function handlePhotoChange(file: File | null) {
    setImage(file);
    setImageError(null);
    if (file) setRemoveImage(false);
  }

  function onValid(values: CreateMomentInput) {
    setFormError(null);
    setImageError(null);
    const formData = new FormData();
    formData.set("momentId", moment.id);
    formData.set("title", values.title);
    formData.set("description", values.description);
    formData.set("category", values.category);
    formData.set("occurredAt", values.occurredAt);
    formData.set("timezone", moment.timezone);
    formData.set("removeImage", String(removeImage));
    if (image) formData.set("image", image);

    startTransition(async () => {
      let result;
      try {
        result = await updateMoment(formData);
      } catch {
        setFormError("We couldn’t reach the server. Please try again.");
        return;
      }

      if (!result.ok) {
        const fieldErrors = result.fieldErrors ?? {};
        if (fieldErrors.title) setError("title", { message: fieldErrors.title });
        if (fieldErrors.description) {
          setError("description", { message: fieldErrors.description });
        }
        if (fieldErrors.category) {
          setError("category", { message: fieldErrors.category });
        }
        if (fieldErrors.occurredAt) {
          setError("occurredAt", { message: fieldErrors.occurredAt });
        }
        if (fieldErrors.image) setImageError(fieldErrors.image);
        if (Object.keys(fieldErrors).length === 0) setFormError(result.message);
        return;
      }

      toast.success("Moment updated");
      router.replace(`/moments/${moment.id}`);
      router.refresh();
    });
  }

  const initialLocalDateTime = localValueInTimezone(moment.occurredAt, moment.timezone);

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    const instant = localDateTime === initialLocalDateTime
      ? new Date(moment.occurredAt)
      : instantFromLocalValue(localDateTime, moment.timezone);
    if (!instant) {
      setError("occurredAt", {
        type: "validate",
        message: "Choose a valid date and time in this timezone.",
      });
      event.preventDefault();
      return;
    }

    clearErrors("occurredAt");
    setValue("occurredAt", instant.toISOString(), { shouldValidate: true });
    void handleSubmit(onValid)(event);
  }

  const showExistingImage = moment.imageUrl && !removeImage && !image;

  return (
    <form
      onSubmit={handleFormSubmit}
      noValidate
      aria-busy={isPending}
      className="flex flex-col gap-7"
    >
      {formError && (
        <p role="alert" className="rounded-lg border border-error/30 bg-terracotta-light px-4 py-3 text-sm text-error">
          {formError}
        </p>
      )}

      <fieldset disabled={isPending} className="flex min-w-0 flex-col gap-7">
        <div className="flex flex-col gap-2">
          <label htmlFor="moment-title" className="text-[11px] font-semibold uppercase tracking-widest text-foreground-muted">
            Headline
          </label>
          <input
            id="moment-title"
            maxLength={MAX_TITLE_LENGTH}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? "moment-title-error" : undefined}
            className="min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-base font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            {...register("title")}
          />
          {errors.title && (
            <p id="moment-title-error" role="alert" className="text-sm text-error">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="moment-description" className="text-[11px] font-semibold uppercase tracking-widest text-foreground-muted">
            Impressions
          </label>
          <textarea
            id="moment-description"
            rows={6}
            maxLength={MAX_DESCRIPTION_LENGTH}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? "moment-description-error" : undefined}
            className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-base leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            {...register("description")}
          />
          {errors.description && (
            <p id="moment-description-error" role="alert" className="text-sm text-error">
              {errors.description.message}
            </p>
          )}
        </div>

        <CategoryPicker field={register("category")} />
        {errors.category && (
          <p role="alert" className="-mt-5 text-sm text-error">{errors.category.message}</p>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="moment-occurred-at" className="text-[11px] font-semibold uppercase tracking-widest text-foreground-muted">
            Date and time ({moment.timezone})
          </label>
          <input
            id="moment-occurred-at"
            type="datetime-local"
            value={localDateTime}
            onChange={(event) => setLocalDateTime(event.target.value)}
            max={localValueInTimezone(new Date().toISOString(), moment.timezone)}
            aria-invalid={errors.occurredAt ? true : undefined}
            aria-describedby={errors.occurredAt ? "moment-occurred-at-error" : undefined}
            className="min-h-12 w-full max-w-sm rounded-lg border border-border bg-surface px-3 text-base text-foreground scheme-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal dark:scheme-dark"
          />
          {errors.occurredAt && (
            <p id="moment-occurred-at-error" role="alert" className="text-sm text-error">
              {errors.occurredAt.message}
            </p>
          )}
          <input type="hidden" {...register("occurredAt")} />
        </div>

        <div className="flex flex-col gap-3">
          {showExistingImage && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-border-subtle bg-background-secondary">
                <MomentImage src={moment.imageUrl} alt={moment.title} sizes="(min-width: 768px) 448px, 100vw" />
              </div>
              <button
                type="button"
                onClick={() => setRemoveImage(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-error hover:bg-terracotta-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
              >
                <ImageOff className="size-4" aria-hidden />
                Remove current photo
              </button>
            </div>
          )}
          {removeImage && (
            <p className="text-sm text-foreground-secondary">
              The current photo will be removed when you save.
              <button
                type="button"
                onClick={() => setRemoveImage(false)}
                className="ml-2 font-semibold text-teal underline-offset-2 hover:underline"
              >
                Undo
              </button>
            </p>
          )}
          <PhotoPicker onChange={handlePhotoChange} error={imageError} />
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isPending}
          onClick={() => router.push(`/moments/${moment.id}`)}
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border px-5 text-sm font-semibold text-foreground hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal px-6 text-sm font-semibold text-background hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}