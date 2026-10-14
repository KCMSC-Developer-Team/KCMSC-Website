CREATE TABLE "CareerApplication" (
    "id" TEXT NOT NULL,
    "careerId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "qualification" TEXT,
    "experience" TEXT,
    "coverLetter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CareerApplication_careerId_idx"
ON "CareerApplication"("careerId");

CREATE INDEX "CareerApplication_createdAt_idx"
ON "CareerApplication"("createdAt");

ALTER TABLE "CareerApplication"
ADD CONSTRAINT "CareerApplication_careerId_fkey"
FOREIGN KEY ("careerId")
REFERENCES "Career"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;