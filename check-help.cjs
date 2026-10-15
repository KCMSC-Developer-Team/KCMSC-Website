const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Total:", await prisma.helpArticle.count());
  console.log("Published:", await prisma.helpArticle.count({
    where: { isPublished: true }
  }));
  console.log("Drafts:", await prisma.helpArticle.count({
    where: { isPublished: false }
  }));
}

main().catch(console.error).finally(() => prisma.$disconnect());
