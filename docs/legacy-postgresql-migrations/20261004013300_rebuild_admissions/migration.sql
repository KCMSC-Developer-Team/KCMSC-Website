-- Finalize the admission reconstruction.
-- Previous migration 20261004010000_admission_rebuild already added
-- the new student/family fields and the AdditionalGuardian table.
-- This migration converts that intermediate structure into the final schema.

-- Rename the existing guardian table instead of creating a second one.
ALTER TABLE "AdditionalGuardian"
  RENAME TO "AdmissionGuardian";

-- Rename the existing guardian constraints/index to match the final model.
ALTER TABLE "AdmissionGuardian"
  RENAME CONSTRAINT "AdditionalGuardian_pkey"
  TO "AdmissionGuardian_pkey";

ALTER TABLE "AdmissionGuardian"
  RENAME CONSTRAINT "AdditionalGuardian_applicationId_fkey"
  TO "AdmissionGuardian_applicationId_fkey";

ALTER INDEX IF EXISTS "AdditionalGuardian_applicationId_idx"
  RENAME TO "AdmissionGuardian_applicationId_idx";


-- Rename the old applicant name field.
ALTER TABLE "AdmissionApplication"
  RENAME COLUMN "applicantName" TO "fullName";


-- Remove the old tracking/reference system.
ALTER TABLE "AdmissionApplication"
  DROP CONSTRAINT IF EXISTS "AdmissionApplication_referenceCode_key";

ALTER TABLE "AdmissionApplication"
  DROP COLUMN IF EXISTS "referenceCode";


-- Remove the old single-guardian system.
ALTER TABLE "AdmissionApplication"
  DROP COLUMN IF EXISTS "guardianName";

ALTER TABLE "AdmissionApplication"
  DROP COLUMN IF EXISTS "guardianRelationship";

ALTER TABLE "AdmissionApplication"
  DROP COLUMN IF EXISTS "guardianPhone";

ALTER TABLE "AdmissionApplication"
  DROP COLUMN IF EXISTS "guardianEmail";


-- The new application workflow does not use this declaration field.
ALTER TABLE "AdmissionApplication"
  DROP COLUMN IF EXISTS "declarationAccepted";


-- Rename the certificate fields from the intermediate migration
-- to the final application model names.
ALTER TABLE "AdmissionApplication"
  RENAME COLUMN "birthCertificateData" TO "certificateData";

ALTER TABLE "AdmissionApplication"
  RENAME COLUMN "birthCertificateName" TO "certificateName";

ALTER TABLE "AdmissionApplication"
  RENAME COLUMN "birthCertificateType" TO "certificateMimeType";