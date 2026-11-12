-- Notice popups can carry images (stored on Vercel Blob; only URLs are kept here).
ALTER TABLE "Notice" ADD COLUMN "imageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
