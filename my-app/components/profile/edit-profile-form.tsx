"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { FormAlert } from "@/components/auth/form-alert";
import { TextField } from "@/components/auth/text-field";
import { updateUser } from "@/actions/auth-action";
import {
  GENERIC_ERROR,
  type ActionResult,
} from "@/features/profile/profile-actions";
import {
  AVATAR_TYPES,
  MAX_AVATAR_BYTES,
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/schemas/profile";
import { ProfileAvatar } from "./profile-avatar";

type EditProfileFormProps = {
  profile: { name: string; email: string; imageUrl: string | null };
};

type StagedPhoto = { file: File; url: string };

const secondaryButton =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Name, email and photo. Nothing is sent until "Save changes", and the button
 * stays disabled until something has actually changed. A new photo is
 * previewed straight away from the file on this device.
 */
export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const [savedImage, setSavedImage] = useState<string | null>(profile.imageUrl);
  const [staged, setStaged] = useState<StagedPhoto | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: profile.name, email: profile.email },
  });

  const shownImage = removePhoto ? null : (staged?.url ?? savedImage);
  const hasChanges = isDirty || staged !== null || removePhoto;

  function discardStaged() {
    if (staged) URL.revokeObjectURL(staged.url);
    setStaged(null);
  }

  function handlePhotoPicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // lets the same file be picked again later
    if (!file) return;

    if (!(AVATAR_TYPES as readonly string[]).includes(file.type)) {
      setPhotoError("Use a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setPhotoError("That photo is over 4 MB. Try a smaller one.");
      return;
    }

    setPhotoError(null);
    discardStaged();
    setRemovePhoto(false);
    setStaged({ file, url: URL.createObjectURL(file) });
  }

  function handleDiscard() {
    discardStaged();
    setRemovePhoto(false);
    setPhotoError(null);
    setFormError(null);
    reset({ name: profile.name, email: profile.email });
  }

  function onValid(values: UpdateProfileInput) {
    setFormError(null);

    if (staged || removePhoto) {
      setFormError(
        "Profile photo storage is not configured yet. Discard the photo change before saving your details.",
      );
      return;
    }

    startTransition(async () => {
      let result: ActionResult;
      try {
        result = await updateUser(values);
      } catch {
        setFormError(GENERIC_ERROR);
        return;
      }

      if (!result.ok) {
        const fieldErrors = result.fieldErrors ?? {};
        if (fieldErrors.name) setError("name", { message: fieldErrors.name });
        if (fieldErrors.email)
          setError("email", { message: fieldErrors.email });
        if (Object.keys(fieldErrors).length === 0) setFormError(result.message);
        return;
      }

      // Keep showing what was just saved. The preview URL moves over as the saved image.
      setSavedImage(shownImage);
      setStaged(null);
      setRemovePhoto(false);
      reset(values);
      toast.success("Profile updated");
      router.refresh();
    });
  }

  const name = useWatch({ control, name: "name" });

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      noValidate
      aria-busy={isPending}
      className="flex flex-col gap-6"
    >
      {formError && <FormAlert>{formError}</FormAlert>}

      <fieldset disabled={isPending} className="contents">
        <div className="flex items-center gap-5">
          <ProfileAvatar
            name={name || profile.name}
            imageUrl={shownImage}
            size="lg"
          />

          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className={secondaryButton}
              >
                <Camera className="mr-2 size-4" aria-hidden />
                {shownImage ? "Change photo" : "Add photo"}
              </button>
              {shownImage && (
                <button
                  type="button"
                  onClick={() => {
                    discardStaged();
                    setRemovePhoto(true);
                  }}
                  className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-foreground-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  Remove
                </button>
              )}
            </div>
            <p
              role={photoError ? "alert" : undefined}
              className={
                photoError
                  ? "text-sm text-error"
                  : "text-sm text-foreground-muted"
              }
            >
              {photoError ?? "JPG, PNG or WebP, up to 4 MB."}
            </p>
            <input
              ref={fileInput}
              type="file"
              accept={AVATAR_TYPES.join(",")}
              onChange={handlePhotoPicked}
              className="sr-only"
              tabIndex={-1}
              aria-label="Choose a profile photo"
            />
          </div>
        </div>

        <TextField
          label="Name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          hint="This is the address you sign in with."
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!hasChanges}
            className={secondaryButton}
          >
            Discard changes
          </button>
          <button
            type="submit"
            disabled={!hasChanges}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal px-6 text-base font-semibold text-background transition-colors hover:bg-teal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2
                  className="size-4 animate-spin motion-reduce:animate-none"
                  aria-hidden
                />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
