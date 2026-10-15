-- KCMSC Blogger Platform. Additive migration; existing school data is preserved.
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'BLOGGER';
CREATE TYPE "BloggerType" AS ENUM ('STUDENT', 'TEACHER');
CREATE TYPE "BlogApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "BlogArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');
CREATE TYPE "BloggerNameChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TABLE "BlogApplication" (
 "id" TEXT NOT NULL, "type" "BloggerType" NOT NULL, "status" "BlogApplicationStatus" NOT NULL DEFAULT 'PENDING',
 "fullName" TEXT NOT NULL, "email" TEXT NOT NULL, "schoolId" TEXT NOT NULL, "phone" TEXT, "className" TEXT, "section" TEXT, "rollNumber" TEXT,
 "guardianName" TEXT, "guardianRelationship" TEXT, "guardianPhone" TEXT, "formTeacher" TEXT, "subject" TEXT,
 "reviewedById" TEXT, "reviewNote" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "BlogApplication_pkey" PRIMARY KEY ("id"));
CREATE INDEX "BlogApplication_status_createdAt_idx" ON "BlogApplication"("status","createdAt");
CREATE INDEX "BlogApplication_schoolId_type_idx" ON "BlogApplication"("schoolId","type");
ALTER TABLE "BlogApplication" ADD CONSTRAINT "BlogApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE TABLE "BloggerProfile" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "type" "BloggerType" NOT NULL, "schoolId" TEXT NOT NULL, "phone" TEXT, "className" TEXT, "section" TEXT, "rollNumber" TEXT,
 "guardianName" TEXT, "guardianRelationship" TEXT, "guardianPhone" TEXT, "formTeacher" TEXT, "subject" TEXT, "displayName" TEXT NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "BloggerProfile_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "BloggerProfile_userId_key" ON "BloggerProfile"("userId");
CREATE UNIQUE INDEX "BloggerProfile_schoolId_key" ON "BloggerProfile"("schoolId");
ALTER TABLE "BloggerProfile" ADD CONSTRAINT "BloggerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "BlogArticle" (
 "id" TEXT NOT NULL, "authorId" TEXT NOT NULL, "title" TEXT NOT NULL, "slug" TEXT NOT NULL, "excerpt" TEXT, "content" TEXT NOT NULL,
 "featuredImage" TEXT, "status" "BlogArticleStatus" NOT NULL DEFAULT 'DRAFT', "publishedAt" TIMESTAMP(3), "viewCount" INTEGER NOT NULL DEFAULT 0,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "BlogArticle_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "BlogArticle_slug_key" ON "BlogArticle"("slug");
CREATE INDEX "BlogArticle_status_publishedAt_idx" ON "BlogArticle"("status","publishedAt");
CREATE INDEX "BlogArticle_authorId_status_idx" ON "BlogArticle"("authorId","status");
ALTER TABLE "BlogArticle" ADD CONSTRAINT "BlogArticle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "BloggerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "BloggerNameChange" (
 "id" TEXT NOT NULL, "profileId" TEXT NOT NULL, "requestedName" TEXT NOT NULL, "status" "BloggerNameChangeStatus" NOT NULL DEFAULT 'PENDING', "reviewedById" TEXT,
 "reviewNote" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "BloggerNameChange_pkey" PRIMARY KEY ("id"));
CREATE INDEX "BloggerNameChange_status_createdAt_idx" ON "BloggerNameChange"("status","createdAt");
ALTER TABLE "BloggerNameChange" ADD CONSTRAINT "BloggerNameChange_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "BloggerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BloggerNameChange" ADD CONSTRAINT "BloggerNameChange_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
