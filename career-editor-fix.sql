ALTER TABLE "Career"
  ADD COLUMN IF NOT EXISTS "summaryEn" TEXT,
  ADD COLUMN IF NOT EXISTS "summaryBn" TEXT,
  ADD COLUMN IF NOT EXISTS "categoryEn" TEXT,
  ADD COLUMN IF NOT EXISTS "categoryBn" TEXT,
  ADD COLUMN IF NOT EXISTS "imageData" TEXT;

UPDATE "Career"
SET
  "summaryEn" = LEFT(
    REGEXP_REPLACE("descriptionEn", '<[^>]*>', ' ', 'g'),
    300
  ),
  "summaryBn" = LEFT(
    REGEXP_REPLACE("descriptionBn", '<[^>]*>', ' ', 'g'),
    300
  )
WHERE "summaryEn" IS NULL OR "summaryBn" IS NULL;
