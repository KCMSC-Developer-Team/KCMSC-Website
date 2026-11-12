import path from "node:path";

// Notice popup images are written to public/uploads/notifications, alongside
// the other uploads on this site, and served from /uploads/notifications/.
export const NOTICE_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "notifications");
export const NOTICE_URL_PREFIX = "/uploads/notifications/";

const noticeFilenamePattern = /^notice-[a-f0-9-]+\.(jpg|png|webp)$/i;

// Returns the stored filename for a notice image URL, or null if the URL is not
// one this site wrote. Only such files are ever served or deleted by notices.
export function noticeImageFilename(url: string): string | null {
  if (!url.startsWith(NOTICE_URL_PREFIX)) return null;
  const filename = url.slice(NOTICE_URL_PREFIX.length);
  return noticeFilenamePattern.test(filename) ? filename : null;
}
