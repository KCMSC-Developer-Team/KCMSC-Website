const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.helpArticle.updateMany({
    data: { isPublished: true }
  });

  console.log(`Published ${result.count} help articles.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
