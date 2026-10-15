ALTER TABLE "Career"
  ADD COLUMN "summaryEn" TEXT,
  ADD COLUMN "summaryBn" TEXT,
  ADD COLUMN "categoryEn" TEXT,
  ADD COLUMN "categoryBn" TEXT,
  ADD COLUMN "imageData" TEXT;

UPDATE "Career" SET
  "summaryEn" = LEFT(REGEXP_REPLACE("descriptionEn", '<[^>]*>', ' ', 'g'), 300),
  "summaryBn" = LEFT(REGEXP_REPLACE("descriptionBn", '<[^>]*>', ' ', 'g'), 300)
WHERE "summaryEn" IS NULL OR "summaryBn" IS NULL;
