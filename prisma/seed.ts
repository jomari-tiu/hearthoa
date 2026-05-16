import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hoa = await prisma.hoa.upsert({
    where: { slug: "sunset-ridge" },
    update: {},
    create: {
      name: "Sunset Ridge Community",
      slug: "sunset-ridge",
      supportedLanguages: ["en", "es"],
      defaultLanguage: "en",
      duesCadence: "monthly",
      timezone: "America/Los_Angeles",
      aiMonthlyBudgetCents: 30000,
      aiPerUserDailyMessages: 20,
    },
  });

  const passwordHash = await bcrypt.hash("changeme1234", 12);

  const admin = await prisma.user.upsert({
    where: { hoaId_email: { hoaId: hoa.id, email: "admin@sunset-ridge.test" } } as never,
    update: {},
    create: {
      hoaId: hoa.id,
      email: "admin@sunset-ridge.test",
      passwordHash,
      name: "Sam Adler",
      role: "admin",
      status: "active",
      preferredLanguage: "en",
      emailVerifiedAt: new Date(),
    },
  });

  const resident = await prisma.user.upsert({
    where: { hoaId_email: { hoaId: hoa.id, email: "resident@sunset-ridge.test" } } as never,
    update: {},
    create: {
      hoaId: hoa.id,
      email: "resident@sunset-ridge.test",
      passwordHash,
      name: "Maya Chen",
      role: "resident",
      status: "active",
      preferredLanguage: "en",
      emailVerifiedAt: new Date(),
    },
  });

  const units = [
    { address: "1024 Sunset Ridge Dr", unitNumber: null },
    { address: "1028 Sunset Ridge Dr", unitNumber: null },
    { address: "1032 Sunset Ridge Dr", unitNumber: null },
    { address: "200 Garden Court", unitNumber: "A" },
    { address: "200 Garden Court", unitNumber: "B" },
  ];

  for (const u of units) {
    await prisma.unit.upsert({
      where: { id: `${hoa.id}-${u.address}-${u.unitNumber ?? "main"}` } as never,
      update: {},
      create: { hoaId: hoa.id, address: u.address, unitNumber: u.unitNumber },
    }).catch(async () => {
      const exists = await prisma.unit.findFirst({
        where: { hoaId: hoa.id, address: u.address, unitNumber: u.unitNumber ?? null },
      });
      if (!exists) {
        await prisma.unit.create({
          data: { hoaId: hoa.id, address: u.address, unitNumber: u.unitNumber },
        });
      }
    });
  }

  const firstUnit = await prisma.unit.findFirst({ where: { hoaId: hoa.id } });
  if (firstUnit) {
    const existing = await prisma.unitResident.findFirst({
      where: { unitId: firstUnit.id, userId: resident.id, endDate: null },
    });
    if (!existing) {
      await prisma.unitResident.create({
        data: {
          hoaId: hoa.id,
          unitId: firstUnit.id,
          userId: resident.id,
          startDate: new Date(),
          isPrimary: true,
        },
      });
    }
  }

  const annCount = await prisma.announcement.count({ where: { hoaId: hoa.id } });
  if (annCount === 0) {
    await prisma.announcement.create({
      data: {
        hoaId: hoa.id,
        authorId: admin.id,
        title: "Welcome to HearthHOA",
        body: "Hi neighbors — we're moving HOA business to this portal. Announcements, dues, and document downloads all live here. Reply with questions any time.",
        priority: "general",
        sourceLanguage: "en",
        isPinned: true,
        publishedAt: new Date(),
      },
    });
    await prisma.announcement.create({
      data: {
        hoaId: hoa.id,
        authorId: admin.id,
        title: "Pool closed Saturday for repairs",
        body: "The pool will be closed Saturday from 8 AM to 2 PM for pump maintenance. Thanks for your patience!",
        priority: "critical",
        sourceLanguage: "en",
        publishedAt: new Date(),
      },
    });
  }

  const boardCount = await prisma.boardMember.count({ where: { hoaId: hoa.id } });
  if (boardCount === 0) {
    await prisma.boardMember.createMany({
      data: [
        { hoaId: hoa.id, name: "Sam Adler", role: "President", email: "president@sunset-ridge.test", displayOrder: 1 },
        { hoaId: hoa.id, name: "Lina Romero", role: "Treasurer", email: "treasurer@sunset-ridge.test", displayOrder: 2 },
        { hoaId: hoa.id, name: "Jordan Park", role: "Secretary", email: "secretary@sunset-ridge.test", displayOrder: 3 },
      ],
    });
  }

  console.log("✓ Seed complete");
  console.log("  HOA:", hoa.slug);
  console.log("  Admin:    admin@sunset-ridge.test / changeme1234");
  console.log("  Resident: resident@sunset-ridge.test / changeme1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
