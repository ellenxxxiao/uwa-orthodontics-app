import { Role, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function deleteAllData() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
}

async function createRandomUser(role: Role) {
  await prisma.user.create({
    data: {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role,
    },
  });
}

async function createUsers(clinicianCount: number, patientCount: number) {
  for (let i = 0; i < clinicianCount; i++) {
    await createRandomUser(Role.CLINICIAN);
  }

  for (let i = 0; i < patientCount; i++) {
    await createRandomUser(Role.PATIENT);
  }
}

async function createConnections() {
  const clinicians = await prisma.user.findMany({
    where: { role: Role.CLINICIAN },
  });
  const patients = await prisma.user.findMany({
    where: { role: Role.PATIENT },
  });

  for (const patient of patients) {
    const randomClinician =
      clinicians[Math.floor(Math.random() * clinicians.length)];
    await prisma.connection.create({
      data: {
        clinicianId: randomClinician.id,
        patientId: patient.id,
      },
    });
  }
}

async function createMessages() {
  const connections = await prisma.connection.findMany({
    include: {
      Clinician: true,
      Patient: true,
    },
  });

  for (const connection of connections) {
    // Create a message from clinician to patient
    await prisma.message.create({
      data: {
        text: faker.lorem.sentence(),
        senderId: connection.clinicianId,
        receiverId: connection.patientId,
        sentAt: faker.date.past(),
      },
    });

    // Optionally, create a response from patient to clinician
    if (Math.random() > 0.5) {
      // 50% chance to respond
      await prisma.message.create({
        data: {
          text: faker.lorem.sentence(),
          senderId: connection.patientId,
          receiverId: connection.clinicianId,
          sentAt: faker.date.past(),
        },
      });
    }
  }
}

async function main() {
  const fakerSeed = 0;
  const clinicianCount = 3;
  const patientCount = 10;

  faker.seed(fakerSeed);
  await deleteAllData();
  await createRandomUser(Role.ADMIN);
  await createUsers(clinicianCount, patientCount);
  await createConnections();
  await createMessages();
}

main()
  .then(async () => {
    console.log("Database seeding completed successfully.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error seeding database:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
