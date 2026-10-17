CREATE TABLE "Event" (
  "id" TEXT NOT NULL,
  "titleEn" TEXT NOT NULL,
  "titleBn" TEXT NOT NULL,
  "summaryEn" TEXT NOT NULL,
  "summaryBn" TEXT NOT NULL,
  "descriptionEn" TEXT NOT NULL,
  "descriptionBn" TEXT NOT NULL,
  "coverImage" TEXT,
  "photoUrls" TEXT,
  "venueEn" TEXT,
  "venueBn" TEXT,
  "startAt" TIMESTAMP(3) NOT NULL,
  "endAt" TIMESTAMP(3),
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Event_isPublished_startAt_idx" ON "Event"("isPublished", "startAt");
