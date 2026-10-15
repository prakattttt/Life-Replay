import imageCompression from "browser-image-compression";

const MAX_EDGE = 1600;
const QUALITY = 0.90;
const SKIP_BELOW_BYTES = 800 * 1024;

export async function downscaleImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= SKIP_BELOW_BYTES) {
    return file;
  }

  try {
    return await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: MAX_EDGE,
      initialQuality: QUALITY,
      useWebWorker: true,
    });
  } catch {
    return file;
  }
}
