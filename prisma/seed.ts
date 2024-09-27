import { Role, PrismaClient, ReminderType, RepeatType } from "@prisma/client";
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
      role
    }
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
    where: { role: Role.CLINICIAN }
  });
  const patients = await prisma.user.findMany({
    where: { role: Role.PATIENT }
  });

  for (const patient of patients) {
    const randomClinician =
      clinicians[Math.floor(Math.random() * clinicians.length)];
    await prisma.connection.create({
      data: {
        clinicianId: randomClinician.id,
        patientId: patient.id
      }
    });
  }
}

async function createMessages() {
  const connections = await prisma.connection.findMany({
    include: {
      Clinician: true,
      Patient: true
    }
  });

  for (const connection of connections) {
    // Create a message from clinician to patient
    await prisma.message.create({
      data: {
        text: faker.lorem.sentence(),
        senderId: connection.clinicianId,
        receiverId: connection.patientId,
        sentAt: faker.date.past()
      }
    });

    // Optionally, create a response from patient to clinician
    if (Math.random() > 0.5) {
      // 50% chance to respond
      await prisma.message.create({
        data: {
          text: faker.lorem.sentence(),
          senderId: connection.patientId,
          receiverId: connection.clinicianId,
          sentAt: faker.date.past()
        }
      });
    }
  }
}

async function createReminders() {
  const patients = await prisma.user.findMany({
    where: { role: Role.PATIENT }
  });

  const clinicians = await prisma.user.findMany({
    where: { role: Role.CLINICIAN }
  });

  const reminderTypes = [
    ReminderType.ALIGNER,
    ReminderType.APPOINTMENT,
    ReminderType.OTHER
  ];

  const repeatTypes = [
    RepeatType.NEVER,
    RepeatType.DAILY,
    RepeatType.WEEKLY,
    RepeatType.FORTNIGHTLY,
    RepeatType.MONTHLY,
    RepeatType.YEARLY,
    RepeatType.CUSTOM
  ];

  for (const patient of patients) {
    const reminderCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < reminderCount; i++) {
      // Random senById by picking a random clinician
      const randomClinician =
        clinicians[Math.floor(Math.random() * clinicians.length)];

      // Random reminder type and repeat type
      const reminderType =
        reminderTypes[Math.floor(Math.random() * reminderTypes.length)];
      const repeatType =
        repeatTypes[Math.floor(Math.random() * repeatTypes.length)];

      // Calculate interval in days.
      let intervalInDays: number;

      if (repeatType === RepeatType.NEVER) {
        intervalInDays = 0;
      } else if (repeatType === RepeatType.DAILY) {
        intervalInDays = 1;
      } else if (repeatType === RepeatType.WEEKLY) {
        intervalInDays = 7;
      } else if (repeatType === RepeatType.FORTNIGHTLY) {
        intervalInDays = 14;
      } else if (repeatType === RepeatType.MONTHLY) {
        intervalInDays = 30;
      } else if (repeatType === RepeatType.YEARLY) {
        intervalInDays = 365;
      } else {
        intervalInDays = Math.floor(Math.random() * 30) + 1;
      }

      await prisma.reminder.create({
        data: {
          setById: randomClinician.id,
          setForId: patient.id,
          scheduledAt: faker.date.future(),
          startDate: faker.date.past(),
          endDate: faker.date.future(),
          description: faker.lorem.sentence(),
          reminderType: reminderType,
          repeatType: repeatType,
          intervalInDays: intervalInDays,
          isReminderActive: true
        }
      });
    }
  }
}

async function main() {
  const fakerSeed = 0;
  const clinicianCount = 3;
  const patientCount = 10;

  faker.seed(fakerSeed);
  // await deleteAllData();
  // await createRandomUser(Role.ADMIN);
  // await createUsers(clinicianCount, patientCount);
  // await createConnections();
  // await createMessages();
  await createReminders();
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
