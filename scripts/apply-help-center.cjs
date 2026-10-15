const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "HelpArticle" (
      "id" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "questionEn" TEXT NOT NULL,
      "questionBn" TEXT NOT NULL,
      "answerEn" TEXT NOT NULL,
      "answerBn" TEXT NOT NULL,
      "categoryEn" TEXT NOT NULL,
      "categoryBn" TEXT NOT NULL,
      "isPublished" BOOLEAN NOT NULL DEFAULT false,
      "isFeatured" BOOLEAN NOT NULL DEFAULT false,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "HelpArticle_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "HelpArticle_slug_key" ON "HelpArticle"("slug")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "HelpArticle_isPublished_sortOrder_idx" ON "HelpArticle"("isPublished", "sortOrder")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "HelpArticle_categoryEn_idx" ON "HelpArticle"("categoryEn")`);
  console.log('HelpArticle table and indexes are ready. Existing tables and records were not changed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
