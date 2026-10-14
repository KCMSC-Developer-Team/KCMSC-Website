-- Existing application has a NULL previousInstitution value.
-- Normalize it before Prisma makes the column required.
UPDATE "AdmissionApplication"
SET "previousInstitution" = ''
WHERE "previousInstitution" IS NULL;

-- Existing AdmissionCycle rows need a value for the new required field.
ALTER TABLE "AdmissionCycle"
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;