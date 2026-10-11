const MAX_EDGE = 1600;
const QUALITY = 0.85;

/** Files already this small are left untouched. */
const SKIP_BELOW_BYTES = 800 * 1024;

/**
 * Shrinks a photo in the browser before upload. A fresh phone photo can be
 * 5–10 MB; at 1600px it is usually a few hundred KB, which makes capturing a
 * photo feel instant on mobile data. Falls back to the original file if
 * anything goes wrong.
 */
export async function downscaleImage(file: File): Promise<File> {
  if (typeof createImageBitmap !== "function") return file;

  try {
    // Honors EXIF rotation, so portrait photos stay upright.
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

    if (scale === 1 && file.size <= SKIP_BELOW_BYTES) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }

    // JPEG has no transparency; paint white so PNG cut-outs don't turn black.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
