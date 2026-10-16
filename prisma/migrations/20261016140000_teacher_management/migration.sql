ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'TEACHER';

CREATE TABLE "TeacherProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "wing" TEXT NOT NULL DEFAULT 'Unassigned',
    "subjects" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "photoUrl" TEXT,
    "highestDegree" TEXT,
    "university" TEXT,
    "qualifications" TEXT,
    "quote" TEXT,
    "biography" TEXT,
    "studentMessage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TeacherProfile_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TeacherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "TeacherProfile_userId_key" ON "TeacherProfile"("userId");
CREATE UNIQUE INDEX "TeacherProfile_staffId_key" ON "TeacherProfile"("staffId");
CREATE INDEX "TeacherProfile_wing_designation_idx" ON "TeacherProfile"("wing", "designation");
CREATE INDEX "TeacherProfile_isPublished_isActive_idx" ON "TeacherProfile"("isPublished", "isActive");
