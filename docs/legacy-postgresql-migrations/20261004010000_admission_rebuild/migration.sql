-- Admission reconstruction: keep old tracking/guardian columns nullable for
-- compatibility with legacy officer routes, but the new workflow never
-- collects, generates, or displays them.

ALTER TABLE "AdmissionCycle" DROP COLUMN "isActive";

ALTER TABLE "AdmissionApplication"
  ALTER COLUMN "referenceCode" DROP NOT NULL,
  ALTER COLUMN "guardianName" DROP NOT NULL,
  ALTER COLUMN "guardianRelationship" DROP NOT NULL,
  ALTER COLUMN "guardianPhone" DROP NOT NULL;

ALTER TABLE "AdmissionApplication"
  ADD COLUMN "nationality" TEXT NOT NULL DEFAULT 'Bangladeshi',
  ADD COLUMN "medium" TEXT NOT NULL DEFAULT 'Bangla Version',
  ADD COLUMN "birthRegistrationNo" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "birthCertificateName" TEXT,
  ADD COLUMN "birthCertificateType" TEXT,
  ADD COLUMN "birthCertificateData" BYTEA,
  ADD COLUMN "fatherName" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "fatherNidNumber" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "fatherContactNumber" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "fatherOccupation" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "fatherNationality" TEXT NOT NULL DEFAULT 'Bangladeshi',
  ADD COLUMN "fatherIsAlive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "motherName" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "motherNidNumber" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "motherContactNumber" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "motherOccupation" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "motherNationality" TEXT NOT NULL DEFAULT 'Bangladeshi',
  ADD COLUMN "motherIsAlive" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "AdditionalGuardian" (
  "id" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "relationship" TEXT NOT NULL,
  "nidNumber" TEXT NOT NULL,
  "contactNumber" TEXT NOT NULL,
  "occupation" TEXT NOT NULL,
  "nationality" TEXT NOT NULL,
  "isAlive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdditionalGuardian_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdditionalGuardian_applicationId_idx" ON "AdditionalGuardian"("applicationId");

ALTER TABLE "AdditionalGuardian"
  ADD CONSTRAINT "AdditionalGuardian_applicationId_fkey"
  FOREIGN KEY ("applicationId") REFERENCES "AdmissionApplication"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
