const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcryptjs.hash("admin123", 12);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@college.edu" },
    update: {},
    create: {
      email: "admin@college.edu",
      password: hashedPassword,
      name: "Admin",
    },
  });

  console.log("Seeded admin:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
