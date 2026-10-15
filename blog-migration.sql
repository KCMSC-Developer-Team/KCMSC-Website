-- KCMSC Blogger Platform: additive PostgreSQL migration.
-- Does not drop or alter existing application tables or records.
-- Run with: npx prisma db execute --file blog-migration.sql --schema prisma/schema.prisma

-- Add the role used by approved bloggers. Keep this statement outside a transaction.
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'BLOGGER';

DO $$ BEGIN
  CREATE TYPE "BloggerType" AS ENUM ('STUDENT', 'TEACHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BlogApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BlogArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BloggerNameChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "BlogApplication" (
  "id" TEXT NOT NULL,
  "type" "BloggerType" NOT NULL,
  "status" "BlogApplicationStatus" NOT NULL DEFAULT 'PENDING',
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "phone" TEXT,
  "className" TEXT,
  "section" TEXT,
  "rollNumber" TEXT,
  "guardianName" TEXT,
  "guardianRelationship" TEXT,
  "guardianPhone" TEXT,
  "formTeacher" TEXT,
  "subject" TEXT,
  "reviewedById" TEXT,
  "reviewNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BlogApplication_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BlogApplication_reviewer_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "BlogApplication_status_createdAt_idx" ON "BlogApplication"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "BlogApplication_schoolId_type_idx" ON "BlogApplication"("schoolId", "type");

CREATE TABLE IF NOT EXISTS "BloggerProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "BloggerType" NOT NULL,
  "schoolId" TEXT NOT NULL,
  "phone" TEXT,
  "className" TEXT,
  "section" TEXT,
  "rollNumber" TEXT,
  "guardianName" TEXT,
  "guardianRelationship" TEXT,
  "guardianPhone" TEXT,
  "formTeacher" TEXT,
  "subject" TEXT,
  "displayName" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BloggerProfile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BloggerProfile_userId_key" UNIQUE ("userId"),
  CONSTRAINT "BloggerProfile_schoolId_key" UNIQUE ("schoolId"),
  CONSTRAINT "BloggerProfile_user_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "BlogArticle" (
  "id" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "featuredImage" TEXT,
  "status" "BlogArticleStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BlogArticle_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BlogArticle_slug_key" UNIQUE ("slug"),
  CONSTRAINT "BlogArticle_author_fkey" FOREIGN KEY ("authorId") REFERENCES "BloggerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "BlogArticle_status_publishedAt_idx" ON "BlogArticle"("status", "publishedAt");
CREATE INDEX IF NOT EXISTS "BlogArticle_authorId_status_idx" ON "BlogArticle"("authorId", "status");

CREATE TABLE IF NOT EXISTS "BloggerNameChange" (
  "id" TEXT NOT NULL,
  "profileId" TEXT NOT NULL,
  "requestedName" TEXT NOT NULL,
  "status" "BloggerNameChangeStatus" NOT NULL DEFAULT 'PENDING',
  "reviewedById" TEXT,
  "reviewNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BloggerNameChange_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BloggerNameChange_profile_fkey" FOREIGN KEY ("profileId") REFERENCES "BloggerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "BloggerNameChange_reviewer_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "BloggerNameChange_status_createdAt_idx" ON "BloggerNameChange"("status", "createdAt");
