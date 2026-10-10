export type SniffedImageType = "jpeg" | "png" | "webp";

/**
 * Identifies an image from its first bytes. `file.type` is just a label the
 * client chose, so the server checks the real file signature too.
 * Pass at least the first 12 bytes.
 */
export function sniffImageType(bytes: Uint8Array): SniffedImageType | null {
  const startsWith = (signature: number[], offset = 0) =>
    signature.every((byte, index) => bytes[offset + index] === byte);

  if (startsWith([0xff, 0xd8, 0xff])) return "jpeg";
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  // WebP: "RIFF" .... "WEBP"
  if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)) {
    return "webp";
  }
  return null;
}
