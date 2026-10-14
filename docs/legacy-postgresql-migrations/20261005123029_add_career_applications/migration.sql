-- DropIndex
DROP INDEX "AdmissionGuardian_applicationId_idx";

-- AlterTable
ALTER TABLE "AdmissionApplication" ALTER COLUMN "nationality" DROP DEFAULT,
ALTER COLUMN "medium" DROP DEFAULT,
ALTER COLUMN "birthRegistrationNo" DROP DEFAULT,
ALTER COLUMN "fatherName" DROP DEFAULT,
ALTER COLUMN "fatherNidNumber" DROP DEFAULT,
ALTER COLUMN "fatherContactNumber" DROP DEFAULT,
ALTER COLUMN "fatherOccupation" DROP DEFAULT,
ALTER COLUMN "fatherNationality" DROP DEFAULT,
ALTER COLUMN "fatherIsAlive" DROP DEFAULT,
ALTER COLUMN "motherName" DROP DEFAULT,
ALTER COLUMN "motherNidNumber" DROP DEFAULT,
ALTER COLUMN "motherContactNumber" DROP DEFAULT,
ALTER COLUMN "motherOccupation" DROP DEFAULT,
ALTER COLUMN "motherNationality" DROP DEFAULT,
ALTER COLUMN "motherIsAlive" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AdmissionGuardian" ALTER COLUMN "isAlive" DROP DEFAULT;

-- CreateTable
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

-- CreateIndex
CREATE INDEX "CareerApplication_careerId_idx" ON "CareerApplication"("careerId");

-- CreateIndex
CREATE INDEX "CareerApplication_createdAt_idx" ON "CareerApplication"("createdAt");

-- AddForeignKey
ALTER TABLE "CareerApplication" ADD CONSTRAINT "CareerApplication_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;
