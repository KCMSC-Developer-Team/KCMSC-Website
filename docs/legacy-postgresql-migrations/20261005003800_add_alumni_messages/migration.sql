CREATE TABLE "AlumniMessage" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "messageEn" TEXT NOT NULL,
    "messageBn" TEXT NOT NULL,
    "graduationYear" INTEGER,
    "roleEn" TEXT,
    "roleBn" TEXT,
    "organizationEn" TEXT,
    "organizationBn" TEXT,
    "photoUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlumniMessage_pkey" PRIMARY KEY ("id")
);
