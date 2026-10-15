CREATE TABLE IF NOT EXISTS "HelpArticle" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "questionEn" TEXT NOT NULL,
  "questionBn" TEXT NOT NULL,
  "answerEn" TEXT NOT NULL,
  "answerBn" TEXT NOT NULL,
  "categoryEn" TEXT NOT NULL,
  "categoryBn" TEXT NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HelpArticle_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "HelpArticle_slug_key" ON "HelpArticle"("slug");
CREATE INDEX IF NOT EXISTS "HelpArticle_isPublished_sortOrder_idx" ON "HelpArticle"("isPublished", "sortOrder");
CREATE INDEX IF NOT EXISTS "HelpArticle_categoryEn_idx" ON "HelpArticle"("categoryEn");
