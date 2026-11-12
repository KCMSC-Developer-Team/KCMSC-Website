// Browser-side image preparation for notice popups.
// Images are scaled so the longest side is at most MAX_SIDE and re-encoded as
// WebP (or JPEG where WebP encoding is unavailable). At this size and quality
// the file is much smaller than a camera original and still looks sharp on
// high-density screens.

const MAX_SIDE = 2000;
const WEBP_QUALITY = 0.86;
const JPEG_QUALITY = 0.9;
const KEEP_ORIGINAL_BYTES = 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not prepare the image."))),
      type,
      quality,
    ),
  );
}

export async function compressImageForUpload(file: File): Promise<File> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WebP images are supported.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));

    // Already small and within the size limit: keep the original untouched.
    if (scale === 1 && file.size <= KEEP_ORIGINAL_BYTES) return file;

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare the image.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);

    // WebP keeps transparency and is much smaller than JPEG at the same quality.
    const webp = await toBlob(canvas, "image/webp", WEBP_QUALITY);
    if (webp.type === "image/webp") {
      return new File([webp], `notice-${Date.now()}.webp`, { type: "image/webp" });
    }

    // Fallback for browsers that cannot encode WebP: JPEG needs a white background.
    const flat = document.createElement("canvas");
    flat.width = width;
    flat.height = height;
    const flatContext = flat.getContext("2d");
    if (!flatContext) throw new Error("Your browser could not prepare the image.");
    flatContext.fillStyle = "#ffffff";
    flatContext.fillRect(0, 0, width, height);
    flatContext.imageSmoothingQuality = "high";
    flatContext.drawImage(bitmap, 0, 0, width, height);
    const jpeg = await toBlob(flat, "image/jpeg", JPEG_QUALITY);
    return new File([jpeg], `notice-${Date.now()}.jpg`, { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}
