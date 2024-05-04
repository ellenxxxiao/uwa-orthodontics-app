import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: {
      role: Role.ADMIN,
    },
  });
  console.log(user);
}

main();
