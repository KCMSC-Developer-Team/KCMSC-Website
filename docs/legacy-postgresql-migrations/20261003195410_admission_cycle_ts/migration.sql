/*
  Warnings:

  - Made the column `previousInstitution` on table `AdmissionApplication` required. This step will fail if there are existing NULL values in that column.

  This migration must only operate on objects created by the migrations that
  precede it. The guardian table and the new student/parent fields are created
  by the following admission-rebuild migrations.
*/

-- Existing data was normalized by 20261003195209_add_admission_cycle_timestamps.
ALTER TABLE "AdmissionApplication"
  ALTER COLUMN "previousInstitution" SET NOT NULL;

ALTER TABLE "AdmissionCycle"
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "updatedAt" DROP DEFAULT;
