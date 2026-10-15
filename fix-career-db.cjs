const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Career"
      ADD COLUMN IF NOT EXISTS "summaryEn" TEXT,
      ADD COLUMN IF NOT EXISTS "summaryBn" TEXT,
      ADD COLUMN IF NOT EXISTS "categoryEn" TEXT,
      ADD COLUMN IF NOT EXISTS "categoryBn" TEXT,
      ADD COLUMN IF NOT EXISTS "imageData" TEXT
  `);

  await prisma.$executeRawUnsafe(`
    UPDATE "Career"
    SET
      "summaryEn" = LEFT(REGEXP_REPLACE("descriptionEn", '<[^>]*>', ' ', 'g'), 300),
      "summaryBn" = LEFT(REGEXP_REPLACE("descriptionBn", '<[^>]*>', ' ', 'g'), 300)
    WHERE "summaryEn" IS NULL OR "summaryBn" IS NULL
  `);

  console.log("Career database columns added and summaries backfilled.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
